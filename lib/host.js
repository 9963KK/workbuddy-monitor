/** dsh-workbuddy — WorkBuddy 原生 DSH LLM 供应商（直连 copilot.tencent.com，不经 Magpie）。 */
import z from '@deepseek-ai/schemastery'
import { WorkBuddyAdapter } from './adapter.js'
import { MODELS } from './catalog.js'
import { installLiveSection } from './compat.js'
import { listAccounts, setMode, startLogin, loginPoll, fetchAccount, addAccount } from './auth.js'
import { readMode, writeMode, detectMagpie, MAGPIE_INSTALL_URL } from './mode.js'

export const name = 'workbuddy-provider'
export const inject = ['llm', 'webServer']

export const Config = z.object({
  displayName: z.string().default('WorkBuddy'),
  knownModels: z.array(z.string()).default(MODELS.map((m) => 'workbuddy/' + m.id)),
  defaultContextWindow: z.number().default(1000000),
  maxTokens: z.number().default(128000),
})

export { WorkBuddyAdapter }

export function apply(ctx, config) {
  const cfg = config || {}
  const known = Array.isArray(cfg.knownModels) && cfg.knownModels.length ? cfg.knownModels : MODELS.map((m) => 'workbuddy/' + m.id)
  const models = known.map((full) => {
    const bare = String(full).replace(/^workbuddy\//, '')
    const meta = MODELS.find((m) => m.id === bare) || { id: bare }
    return {
      id: 'workbuddy/' + bare,
      name: meta.name || bare,
      contextWindow: meta.contextWindow || cfg.defaultContextWindow || 1000000,
      maxTokens: meta.maxTokens || cfg.maxTokens || 128000,
      input: ['text'],
    }
  })
  const connection = () => ({
    displayName: cfg.displayName || 'WorkBuddy',
    models,
    defaultContextWindow: cfg.defaultContextWindow || 1000000,
    maxTokens: cfg.maxTokens || 128000,
    reasoningModels: true,
  })
  const adapter = new WorkBuddyAdapter({ connection })
  ctx.llm.registerAdapter(['workbuddy'], adapter)
  ctx.llm.registerConfigurableProviders([{ provider: 'workbuddy', displayName: cfg.displayName || 'WorkBuddy', settingsNs: 'workbuddy-provider', settingsPath: [] }])
  try {
    ctx.llm.registerModelDiscovery('workbuddy-provider', async () => models.map((m) => ({ provider: 'workbuddy', id: m.id, name: m.name, inputModalities: ['text'], context: { contextWindow: m.contextWindow }, defaultMaxTokens: m.maxTokens })))
  } catch (error) {
    ctx.logger?.warn?.('[workbuddy] model discovery refused: ' + (error && error.message ? error.message : error))
  }
  ctx.inject(['settings'], (settingsCtx) => {
    try {
      installLiveSection(settingsCtx.settings, ctx, 'workbuddy-provider', Config, cfg, {})
    } catch (error) {
      ctx.logger?.warn?.('[workbuddy] settings section failed: ' + (error && error.message ? error.message : error))
    }
  })
  try {
    const panel = async () => {
      const acc = listAccounts()
      let detected = false
      try { detected = await detectMagpie() } catch {}
      return { ...acc, viaMagpie: readMode().viaMagpie, magpie: { detected, url: MAGPIE_INSTALL_URL } }
    }
    ctx.webServer.register({ kind: 'exact', path: '/api/dsh-workbuddy/panel', handler: async (req, res) => {
      try {
        const send = (v) => { res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' }); res.end(JSON.stringify(v)) }
        if (req.method === 'POST') {
          let body = ''
          for await (const chunk of req) body += chunk
          let j = {}
          try { j = JSON.parse(body || '{}') } catch {}
          if (typeof j.viaMagpie === 'boolean') {
            if (j.viaMagpie && !(await detectMagpie())) return send({ ok: false, error: 'magpie-not-detected' })
            writeMode({ viaMagpie: j.viaMagpie })
          }
          if (typeof j.mode === 'string') setMode(j.mode, j.active)
          return send({ ok: true, ...(await panel()) })
        }
        send({ ok: true, ...(await panel()) })
      } catch (e) {
        res.writeHead(200, { 'content-type': 'application/json' })
        res.end(JSON.stringify({ ok: false, error: e && e.message ? e.message : String(e) }))
      }
    } })
  // ── 面板内「添加账号」：起登录 → 轮询 → 入池 ──
  const loginStates = new Map()
  const sendJSON = (res, v) => { res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' }); res.end(JSON.stringify(v)) }
  try {
    ctx.webServer.register({ kind: 'exact', path: '/api/dsh-workbuddy/login/start', handler: async (req, res) => {
      if (req.method !== 'POST') return sendJSON(res, { ok: false, error: 'method-not-allowed' })
      try { const s = await startLogin(); loginStates.set(s.state, Date.now()); sendJSON(res, { ok: true, state: s.state, url: s.authUrl }) }
      catch (e) { sendJSON(res, { ok: false, error: e && e.message ? e.message : String(e) }) }
    } })
    ctx.webServer.register({ kind: 'exact', path: '/api/dsh-workbuddy/login/poll', handler: async (req, res) => {
      try {
        let body = ''
        for await (const chunk of req) body += chunk
        let j = {}
        try { j = JSON.parse(body || '{}') } catch {}
        const state = j.state
        if (!state) return sendJSON(res, { ok: false, error: 'no-state' })
        const created = loginStates.get(state) || 0
        if (created && Date.now() - created > 300000) { loginStates.delete(state); return sendJSON(res, { ok: false, status: 'expired' }) }
        const r = await loginPoll(state)
        if (r.status === 'pending') return sendJSON(res, { ok: true, status: 'pending' })
        if (r.status === 'error') { loginStates.delete(state); return sendJSON(res, { ok: false, status: 'error', error: r.message }) }
        const t = r.token
        const domain = t.domain || 'www.workbuddy.cn'
        let acct = {}
        try { acct = await fetchAccount(state, t.accessToken, domain) } catch {}
        const now = Date.now()
        const acc = addAccount({
          id: acct.uid || t.uid || undefined,
          name: (j.name || acct.nickname || acct.nickName || acct.name || 'WorkBuddy'),
          access: t.accessToken,
          refresh: t.refreshToken || '',
          expires: t.expiresIn > 0 ? now + t.expiresIn * 1000 : (t.expiresAt || 0),
          refreshExpiresAt: t.refreshExpiresIn > 0 ? now + t.refreshExpiresIn * 1000 : (t.refreshExpiresAt || 0),
          domain,
          uid: acct.uid || t.uid || '',
          tokenType: t.tokenType || '',
        })
        loginStates.delete(state)
        sendJSON(res, { ok: true, status: 'done', account: acc, ...(await panel()) })
      } catch (e) { sendJSON(res, { ok: false, error: e && e.message ? e.message : String(e) }) }
    } })
  } catch (error) {
    ctx.logger?.warn?.('[workbuddy] login routes failed: ' + (error && error.message ? error.message : error))
  }
  } catch (error) {
    ctx.logger?.warn?.('[workbuddy] accounts route failed: ' + (error && error.message ? error.message : error))
  }
  ctx.logger?.info?.('[workbuddy] provider "workbuddy" registered (%d models)', models.length)
}
