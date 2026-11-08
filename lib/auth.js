/** WorkBuddy 直连取数 + 多账号令牌池（不经过 Magpie）。 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

export const BASE = 'https://copilot.tencent.com'
export const APP_VERSION = '5.9.3'
const UA = 'WorkBuddy/' + APP_VERSION
const DEFAULT_DOMAIN = 'www.workbuddy.cn'

function cfgDir() { return path.join(os.homedir() || process.env.HOME || '', '.config', 'dsh-workbuddy-credits') }
export function authPath() { return path.join(cfgDir(), 'auth.json') }
function accountsPath() { return path.join(cfgDir(), 'accounts.json') }

function readJson(p) { try { return JSON.parse(fs.readFileSync(p, 'utf8')) } catch { return null } }
function writeJson(p, v) { fs.mkdirSync(path.dirname(p), { recursive: true }); const t = p + '.tmp'; fs.writeFileSync(t, JSON.stringify(v, null, 2)); fs.renameSync(t, p); try { fs.chmodSync(p, 0o600) } catch {} }

function normAccount(a) {
  return {
    id: a.id || a.uid || ('acc-' + Date.now()),
    name: a.name || a.accountName || 'WorkBuddy',
    access: a.access || '',
    refresh: a.refresh || '',
    expires: a.expires || 0,
    refreshExpiresAt: a.refreshExpiresAt || 0,
    uid: a.uid || '',
    domain: a.domain || DEFAULT_DOMAIN,
    tokenType: a.tokenType || '',
  }
}

/** 账号池状态：{ mode:'roundrobin'|'single', active, accounts:[...], rr }。首次从旧 auth.json 迁移。 */
export function readState() {
  const s = readJson(accountsPath())
  if (s && Array.isArray(s.accounts)) return s
  const legacy = readJson(authPath())
  if (legacy && legacy.access) {
    const acc = normAccount({ ...legacy, id: legacy.uid || 'default', name: legacy.accountName || 'WorkBuddy' })
    const st = { mode: 'roundrobin', active: acc.id, accounts: [acc], rr: 0 }
    writeJson(accountsPath(), st)
    return st
  }
  return { mode: 'roundrobin', active: '', accounts: [], rr: 0 }
}
export function writeState(s) { writeJson(accountsPath(), s) }

export function addAccount(a) {
  const s = readState()
  const acc = normAccount(a)
  const i = s.accounts.findIndex((x) => x.id === acc.id || (acc.uid && x.uid === acc.uid))
  if (i >= 0) s.accounts[i] = { ...s.accounts[i], ...acc }
  else s.accounts.push(acc)
  if (!s.active) s.active = acc.id
  writeState(s)
  return acc
}

export function listAccounts() {
  const s = readState()
  return { mode: s.mode || 'roundrobin', active: s.active || '', accounts: s.accounts.map((a) => ({ id: a.id, name: a.name, uid: a.uid, expires: a.expires })) }
}

export function setMode(mode, active) {
  const s = readState()
  if (mode === 'single' || mode === 'roundrobin') s.mode = mode
  if (typeof active === 'string' && active) s.active = active
  writeState(s)
  return listAccounts()
}

function baseHeaders() { return { 'content-type': 'application/json', accept: 'application/json', 'user-agent': UA } }
function meterHeaders(a) {
  return { ...baseHeaders(), authorization: 'Bearer ' + a.access, 'x-user-id': a.uid || '', 'x-domain': a.domain || DEFAULT_DOMAIN, 'x-product': 'SaaS', 'x-ide-type': 'WorkBuddy' }
}
async function wbFetch(pathname, opts) {
  const res = await fetch(BASE + pathname, { method: opts.method || 'GET', headers: opts.headers || baseHeaders(), body: opts.body === undefined ? undefined : JSON.stringify(opts.body), signal: AbortSignal.timeout(opts.timeout || 20000) })
  const text = await res.text(); let env = {}; try { env = JSON.parse(text) } catch {}
  return { status: res.status, ok: res.ok, env, text }
}
function dataOf(r) { if (!r.ok) throw new Error(`WorkBuddy HTTP ${r.status}${r.env && r.env.msg ? ': ' + r.env.msg : ''}`); const code = Number.parseInt(r.env && r.env.code, 10) || 0; if (code) throw new Error(`WorkBuddy 错误 ${code}: ${r.env.msg || ''}`); return r.env.data }

export function isFresh(a) { return !!a && typeof a.access === 'string' && a.access !== '' && (!a.expires || a.expires - Date.now() > 60000) }

export async function refreshAuth(a) {
  if (!a || !a.refresh) throw new Error('没有 refresh 令牌')
  const r = await wbFetch('/v2/plugin/auth/token/refresh', { method: 'POST', headers: { ...baseHeaders(), 'x-refresh-token': a.refresh, 'x-auth-refresh-source': 'plugin', 'x-domain': a.domain || DEFAULT_DOMAIN }, body: {} })
  const d = dataOf(r) || {}
  if (!d.accessToken) throw new Error('刷新未返回 accessToken')
  const now = Date.now()
  return { ...a, access: d.accessToken, refresh: d.refreshToken || a.refresh, expires: d.expiresIn > 0 ? now + d.expiresIn * 1000 : (d.expiresAt || a.expires), refreshExpiresAt: d.refreshExpiresIn > 0 ? now + d.refreshExpiresIn * 1000 : (d.refreshExpiresAt || a.refreshExpiresAt), domain: d.domain || a.domain || DEFAULT_DOMAIN, tokenType: d.tokenType || a.tokenType }
}

/** 逐个账号确保有可用 access（过期则刷新并回写）；返回刷新后的账号列表（不旋转）。 */
async function freshAccounts() {
  const s = readState()
  let changed = false
  const out = []
  for (const raw of s.accounts) {
    let a = normAccount(raw)
    if (!isFresh(a) && a.refresh) {
      try { a = { ...a, ...(await refreshAuth(a)) }; const i = s.accounts.findIndex((x) => x.id === a.id); if (i >= 0) s.accounts[i] = a; changed = true } catch {}
    }
    out.push(a)
  }
  if (changed) writeState(s)
  return { state: s, accounts: out }
}

/** 供失败换号使用的候选账号（按模式排序）。 */
export async function getAuthCandidates() {
  const { state, accounts } = await freshAccounts()
  if (accounts.length <= 1 || state.mode === 'single') {
    if (state.mode === 'single' && state.active) {
      const act = accounts.find((a) => a.id === state.active)
      if (act) return [act, ...accounts.filter((a) => a !== act)]
    }
    return accounts
  }
  const rr = (state.rr || 0) % accounts.length
  const rotated = accounts.slice(rr).concat(accounts.slice(0, rr))
  state.rr = (rr + 1) % accounts.length
  try { writeState(state) } catch {}
  return rotated
}

export async function getAuth() { const c = await getAuthCandidates(); return c[0] || null }

const round2 = (n) => Math.round(n * 100) / 100

export async function fetchCredits(a0) {
  const a = a0 || (await getAuth())
  if (!a) throw new Error('WorkBuddy 未登录')
  const r = await wbFetch('/billing/meter/get-user-resource-summary', { method: 'POST', headers: meterHeaders(a), body: {} })
  const data = dataOf(r) || {}
  const pkgs = Array.isArray(data.Packages) ? data.Packages : []
  const groups = Array.isArray(data.CreditGroups) ? data.CreditGroups : []
  let limit = 0, used = 0, remain = 0
  for (const p of pkgs) { limit += Number(p.CycleTotalCapacity) || 0; used += Number(p.CycleUsedCapacity) || 0; remain += Number(p.CycleRemainCapacity) || 0 }
  if (!limit && Number.isFinite(Number(data.TotalCredits))) remain = Number(data.TotalCredits)
  const remainingPercent = limit > 0 ? (remain / limit) * 100 : undefined
  const credits = { name: 'Total credits', amount: round2(used), limit: limit || undefined, remaining: round2(remain), remainingPercent: typeof remainingPercent === 'number' ? round2(remainingPercent) : undefined, usedPercent: limit > 0 ? round2((used / limit) * 100) : undefined, display: limit > 0 ? `${round2(used)} / ${limit}` : `${round2(remain)}` }
  const creditWindows = groups.filter((g) => g && (Number(g.CycleTotalCapacity) > 0 || Number(g.CycleUsedCapacity) > 0)).map((g) => { const t = Number(g.CycleTotalCapacity) || 0; const u = Number(g.CycleUsedCapacity) || 0; return { name: g.Name || 'Credits', amount: round2(u), limit: t, remainingPercent: t > 0 ? round2(((t - u) / t) * 100) : undefined, display: t > 0 ? `${round2(u)} / ${t}` : `${round2(u)}` } })
  return { credits, creditWindows, plan: data.SubscriptionPackageName || '', isPaid: !!data.IsPaidUser }
}

// ---- 登录（lib/login.js 用）----
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
export function startLogin() {
  return wbFetch('/v2/plugin/auth/state?platform=workbuddy', { method: 'POST', headers: { ...baseHeaders(), 'x-no-authorization': 'true', 'x-no-user-id': 'true', 'x-no-enterprise-id': 'true', 'x-no-department-info': 'true' }, body: {} }).then((r) => {
    const d = dataOf(r) || {}
    if (!d.state || !d.authUrl) throw new Error('WorkBuddy 未返回登录地址')
    const url = new URL(d.authUrl)
    url.searchParams.set('version', APP_VERSION)
    url.searchParams.set('loginSessionId', crypto.getRandomValues(new Uint8Array(16)).reduce((s, x) => s + x.toString(16).padStart(2, '0'), ''))
    return { state: d.state, authUrl: url.toString() }
  })
}
export async function pollLoginToken(state, timeoutMs = 180000) {
  const deadline = Date.now() + timeoutMs; const q = encodeURIComponent(state)
  while (Date.now() < deadline) {
    const r = await wbFetch(`/v2/plugin/auth/token?state=${q}`, { method: 'GET', headers: baseHeaders() })
    if (r.ok) { const code = Number.parseInt(r.env && r.env.code, 10) || 0; const d = r.env && r.env.data; if (!code && d && d.accessToken) return d; if (code && code !== 11217) throw new Error(`登录失败 ${code}: ${r.env.msg || ''}`) }
    await sleep(2000)
  }
  throw new Error('登录超时')
}
export async function fetchAccount(state, access, domain) {
  const q = encodeURIComponent(state)
  const r = await wbFetch(`/v2/plugin/login/account?state=${q}`, { method: 'GET', headers: { ...baseHeaders(), authorization: 'Bearer ' + access, 'x-domain': domain || DEFAULT_DOMAIN, 'x-no-user-id': 'true', 'x-no-enterprise-id': 'true' } })
  return dataOf(r) || {}
}

/** 单次轮询登录令牌（给面板用，不阻塞）。 */
export async function loginPoll(state) {
  const q = encodeURIComponent(state)
  const r = await wbFetch(`/v2/plugin/auth/token?state=${q}`, { method: 'GET', headers: baseHeaders() })
  if (!r.ok) return { status: 'pending' }
  const code = Number.parseInt(r.env && r.env.code, 10) || 0
  const d = r.env && r.env.data
  if (!code && d && d.accessToken) return { status: 'done', token: d }
  if (code && code !== 11217) return { status: 'error', message: (r.env && r.env.msg) || ('code ' + code) }
  return { status: 'pending' }
}

// ---- 每日签到 ----
async function meterPost(pathname, a) {
  const r = await wbFetch(pathname, { method: 'POST', headers: meterHeaders(a), body: {} })
  const code = Number.parseInt((r.env && r.env.code), 10) || 0
  return { status: r.status, code, msg: (r.env && r.env.msg) || '', data: (r.env && r.env.data) || null }
}

/** 签到状态：{active, today_checked_in, streak_days, daily_credit, today_credit, ...} */
export async function fetchCheckinStatus(a0) {
  const a = a0 || (await getAuth())
  if (!a) throw new Error('WorkBuddy 未登录')
  const r = await meterPost('/v2/billing/meter/checkin-activity-status', a)
  if (r.code) throw new Error(`签到状态查询失败 ${r.code}: ${r.msg}`)
  return r.data || {}
}

/** 领取每日签到。已签到（10001）不算失败。 */
export async function claimDailyCheckin(a0) {
  const a = a0 || (await getAuth())
  if (!a) throw new Error('WorkBuddy 未登录')
  const r = await meterPost('/v2/billing/meter/daily-checkin', a)
  if (r.code === 0) return { ok: true, already: false, msg: r.msg || 'OK', data: r.data }
  if (r.code === 10001) return { ok: true, already: true, msg: r.msg || '今天已签到', data: null }
  return { ok: false, already: false, msg: `${r.code}: ${r.msg}`, data: null }
}
