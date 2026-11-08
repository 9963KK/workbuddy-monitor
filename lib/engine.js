/**
 * WorkBuddy 聊天传输层（直连 copilot.tencent.com，不经 Magpie）。
 * 端点：POST https://copilot.tencent.com/v2/chat/completions（必须 stream:true）
 * SSE 为标准 OpenAI chat.completion.chunk。
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { getAuthCandidates, BASE } from './auth.js'
import { readMode, MAGPIE_BASE } from './mode.js'
const UA = 'WorkBuddy/5.9.3'

export function headersOf(a, stream) {
  return {
    'content-type': 'application/json',
    accept: stream ? 'text/event-stream' : 'application/json',
    'user-agent': UA,
    authorization: 'Bearer ' + a.access,
    'x-user-id': a.uid || '',
    'x-domain': a.domain || 'www.workbuddy.cn',
    'x-product': 'SaaS',
    'x-ide-type': 'WorkBuddy',
  }
}


const DEFAULT_SYSTEM = 'You are a helpful assistant.'
function textOf(content) {
  if (typeof content === 'string') return content
  if (!Array.isArray(content)) return ''
  return content.map((p) => (typeof p?.text === 'string' ? p.text : '')).filter(Boolean).join('\n')
}
// WorkBuddy 渠道校验(11128)：system 开场必须是"被批准"的；把 harness 的 system 挪进
// <instructions> 用户消息，system 固定成 "You are a helpful assistant."。
function shapeMessages(messages) {
  const msgs = (messages || []).map((m) => (m && m.role === 'developer' ? { ...m, role: 'system' } : m))
  let i = 0
  const lead = []
  while (i < msgs.length && msgs[i] && msgs[i].role === 'system') { lead.push(textOf(msgs[i].content)); i++ }
  const said = lead.join('\n\n').trim()
  const rest = msgs.slice(i).map((m) => (m && m.role === 'system' ? { ...m, role: 'user' } : m))
  if (said && said !== DEFAULT_SYSTEM) {
    const text = '<instructions>\n' + said + '\n</instructions>'
    const u = rest.findIndex((m) => m && m.role === 'user')
    if (u < 0) rest.unshift({ role: 'user', content: text })
    else {
      const c = rest[u].content
      if (typeof c === 'string') rest[u] = { ...rest[u], content: text + '\n\n' + c }
      else if (Array.isArray(c)) rest[u] = { ...rest[u], content: [{ type: 'text', text }, ...c] }
      else rest[u] = { ...rest[u], content: text }
    }
  }
  return [{ role: 'system', content: DEFAULT_SYSTEM }, ...rest]
}


function winPath() { return path.join(os.homedir(), '.config', 'dsh-workbuddy-credits', 'window.json') }
function parseReset(text) {
  let m = text.match(/将在\s*(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/)
  if (!m) m = text.match(/reset at\s*(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/i)
  if (m) { const t = Date.parse(`${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}+08:00`); if (Number.isFinite(t)) return t }
  const r = text.match(/"reset_at"\s*:\s*"?(\d{10})/)
  if (r) return Number(r[1]) * 1000
  return null
}
function pinWindow(resetAt, text) {
  try { fs.mkdirSync(path.dirname(winPath()), { recursive: true }); fs.writeFileSync(winPath(), JSON.stringify({ resetAt, at: Date.now(), note: String(text).slice(0, 200) })) } catch {}
}

export function wireModel(model) {
  return String(model || '').replace(/^workbuddy\//, '')
}

export async function* readSSE(stream) {
  const reader = stream.getReader()
  const dec = new TextDecoder()
  let buf = ''
  try {
    for (;;) {
      const { value, done } = await reader.read()
      if (done) break
      buf += dec.decode(value, { stream: true })
      let idx
      while ((idx = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, idx).replace(/\r$/, '')
        buf = buf.slice(idx + 1)
        if (!line) continue
        if (!line.startsWith('data:')) continue
        const p = line.slice(5).trim()
        if (p === '[DONE]') { yield '[DONE]'; return }
        yield p
      }
    }
  } finally {
    try { await reader.cancel() } catch {}
  }
}

/** 原始 SSE 载荷流（字符串；最后一个是 '[DONE]'）。 */
export async function* streamChatRaw(o) {
  // ── 走 Magpie：模型与鉴权都交给本机 Magpie 网关（无需 WorkBuddy 令牌）──
  if (readMode().viaMagpie) {
    const bodyM = {
      model: 'workbuddy/' + wireModel(o.model),
      messages: o.messages,
      stream: true,
      stream_options: { include_usage: true },
      ...(o.tools && o.tools.length ? { tools: o.tools } : {}),
      ...(o.temperature === undefined ? {} : { temperature: o.temperature }),
      ...(o.maxTokens === undefined ? {} : { max_tokens: o.maxTokens }),
      ...(o.reasoningEffort === undefined ? {} : { reasoning_effort: o.reasoningEffort }),
    }
    const res = await fetch(MAGPIE_BASE + '/v1/chat/completions', {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'text/event-stream', authorization: 'Bearer ' + (process.env.MAGPIE_GATEWAY_KEY || 'local') },
      body: JSON.stringify(bodyM), signal: o.signal,
    })
    if (!res.ok) { const t = await res.text().catch(() => ''); const e = new Error(`Magpie HTTP ${res.status} ${t.slice(0, 250)}`); e.status = res.status; throw e }
    if (!res.body) throw new Error('Magpie 无响应体')
    yield* readSSE(res.body)
    return
  }
  const accounts = o.auth ? [o.auth] : await getAuthCandidates()
  if (!accounts.length) throw new Error('WorkBuddy 未登录（先运行 node lib/login.js）')
  const body = {
    model: wireModel(o.model),
    messages: shapeMessages(o.messages),
    stream: true,
    stream_options: { include_usage: true },
    ...(o.tools && o.tools.length ? { tools: o.tools } : {}),
    ...(o.temperature === undefined ? {} : { temperature: o.temperature }),
    ...(o.maxTokens === undefined ? {} : { max_tokens: o.maxTokens }),
    ...(o.reasoningEffort === undefined ? {} : { reasoning_effort: o.reasoningEffort }),
  }
  let lastErr = null
  for (const a of accounts) {
    let res
    try {
      res = await fetch(BASE + '/v2/chat/completions', { method: 'POST', headers: headersOf(a, true), body: JSON.stringify(body), signal: o.signal })
    } catch (e) {
      if (o.signal && o.signal.aborted) throw e
      lastErr = e
      continue
    }
    if (!res.ok) {
      const t = await res.text().catch(() => '')
      const err = new Error(`WorkBuddy HTTP ${res.status} ${t.slice(0, 300)}`)
      err.status = res.status
      lastErr = err
      // 429 限流：解析 WorkBuddy 给的 reset，把窗口钉满（与 Magpie 同口径）
      if (res.status === 429) { const reset = parseReset(t); if (reset) pinWindow(reset, t) }
      // 账号级失败(401 未授权 / 402 余额 / 429 限流) → 换下一个账号
      if (res.status === 401 || res.status === 402 || res.status === 429) continue
      throw err
    }
    if (!res.body) { lastErr = new Error('WorkBuddy 无响应体'); continue }
    yield* readSSE(res.body)
    return
  }
  throw lastErr || new Error('WorkBuddy 所有账号均失败')
}
