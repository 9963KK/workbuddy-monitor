/**
 * workbuddy-monitor — WorkBuddy 用量监控（积分 / 免费档 24h 窗口额度）+ 可选的原生 LLM 供应商。
 *
 * 防御式设计：所有对外部包的引用都是「可选 + 失败降级」，任何一处缺失或改名都不会让 entry 激活失败。
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { WorkBuddyAdapter } from './adapter.js'
import { MODELS } from './catalog.js'
import { installLiveSection } from './compat.js'
import { listAccounts, setMode, startLogin, loginPoll, fetchAccount, addAccount } from './auth.js'
import { readMode, writeMode, detectMagpie, MAGPIE_INSTALL_URL } from './mode.js'
import { envStatus, latestPluginVersion } from './version.js'

export const name = 'workbuddy-provider'
export const inject = ['llm', 'webServer']

/** 可选加载 schemastery：link 安装 / 依赖改名 / 未来版本都能降级而不是炸掉。 */
function loadSchemaLib() {
  const home = process.env.DSH_HOME || path.join(os.homedir() || process.env.HOME || '', '.dsh')
  const bases = [import.meta.url]
  try {
    for (const n of fs.readdirSync(path.join(home, 'profiles'))) bases.push(pathToFileURL(path.join(home, 'profiles', n, 'package.json')).href)
  } catch {}
  for (const base of bases) {
    try {
      const req = createRequire(base)
      const m = req('@deepseek-ai/schemastery')
      const z = m && (m.default ?? m)
      if (z && typeof z.object === 'function') return z
    } catch {}
  }
  return null
}

const z = loadSchemaLib()

export const Config = z
  ? z.object({
    displayName: z.string().default('WorkBuddy'),
    knownModels: z.array(z.string()).default(MODELS.map((m) => 'workbuddy/' + m.id)),
    defaultContextWindow: z.number().default(1000000),
    maxTokens: z.number().default(128000),
  })
  : undefined

export { WorkBuddyAdapter }

function markerPath() {
  return path.join(os.homedir() || process.env.HOME || '', '.config', 'dsh-workbuddy-credits', 'dsh-version.json')
}

/** 记录一次环境快照，供定时任务/排查使用。 */
function writeEnvMarker(env) {
  try {
    fs.mkdirSync(path.dirname(markerPath()), { recursive: true })
    fs.writeFileSync(markerPath(), JSON.stringify(env, null, 2))
  } catch {}
}

export function apply(ctx, config) {
  try {
    applyInner(ctx, config)
  } catch (error) {
    // 绝不因为我们的问题让宿主 entry 激活失败
    ctx.logger?.warn?.('[workbuddy] apply degraded: ' + (error && error.message ? error.message : error))
  }
}

function applyInner(ctx, config) {
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
  if (Config) {
    ctx.inject(['settings'], (settingsCtx) => {
      try {
        installLiveSection(settingsCtx.settings, ctx, 'workbuddy-provider', Config, cfg, {})
      } catch (error) {
        ctx.logger?.warn?.('[workbuddy] settings section failed: ' + (error && error.message ? error.message : error))
      }
    })
  } else {
    ctx.logger?.warn?.('[workbuddy] schemastery 不可用，已跳过设置表单（模型列表不受影响）')
  }

  // ── 版本自检 ──
  const env0 = envStatus(ctx)
  writeEnvMarker(env0)
  if (env0.needsUpdate) {
    ctx.logger?.warn?.('[workbuddy] 需要检查更新：reason=' + env0.reason + ' dsh=' + (env0.dsh || 'unknown') + ' verified=' + JSON.stringify(env0.verified) + ' missing=' + JSON.stringify(env0.capabilities && env0.capabilities.missing))
  } else {
    ctx.logger?.info?.('[workbuddy] env ok: dsh=%s plugin=%s', env0.dsh || 'unknown', env0.plugin)
  }
  let latestCache = { at: 0, version: '' }
  const latestOnce = async () => {
    if (Date.now() - latestCache.at < 6 * 3600 * 1000) return latestCache.version
    latestCache = { at: Date.now(), version: await latestPluginVersion() }
    return latestCache.version
  }

  const sendJSON = (res, v) => { res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' }); res.end(JSON.stringify(v)) }
  const panel = async () => {
    const acc = listAccounts()
    let detected = false
    try { detected = await detectMagpie() } catch {}
    const env = envStatus(ctx)
    const latest = await latestOnce()
    return {
      ...acc,
      viaMagpie: readMode().viaMagpie,
      magpie: { detected, url: MAGPIE_INSTALL_URL },
      env: { ...env, latestPlugin: latest, pluginOutdated: !!latest && latest !== env.plugin },
    }
  }

  const loginStates = new Map()
  try {
    ctx.webServer.register({ kind: 'exact', path: '/api/dsh-workbuddy/panel', handler: async (req, res) => {
      try {
        if (req.method === 'POST') {
          let body = ''
          for await (const chunk of req) body += chunk
          let j = {}
          try { j = JSON.parse(body || '{}') } catch {}
          if (typeof j.viaMagpie === 'boolean') {
            if (j.viaMagpie && !(await detectMagpie())) return sendJSON(res, { ok: false, error: 'magpie-not-detected' })
            writeMode({ viaMagpie: j.viaMagpie })
          }
          if (typeof j.mode === 'string') setMode(j.mode, j.active)
          return sendJSON(res, { ok: true, ...(await panel()) })
        }
        sendJSON(res, { ok: true, ...(await panel()) })
      } catch (e) {
        sendJSON(res, { ok: false, error: e && e.message ? e.message : String(e) })
      }
    } })
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
    ctx.logger?.warn?.('[workbuddy] routes failed: ' + (error && error.message ? error.message : error))
  }

  ctx.logger?.info?.('[workbuddy] provider "workbuddy" registered (%d models)', models.length)
}
