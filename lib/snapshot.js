/**
 * WorkBuddy 用量快照（原 dsh-workbuddy-credits 的宿主逻辑，合并进 workbuddy-monitor）。
 *
 * 供输入框右侧圆环徽标与设置面板共用：一条 GET /api/workbuddy-credits 返回
 *   - credits：积分总量（直连 copilot.tencent.com billing 接口，来自 lib/auth.js fetchCredits）
 *   - token  ：24h token 窗口（用 DSH 会话用量本地估算，见 computeTokenWindow）
 * 直连失败时可选回退到本机 Magpie 网关（默认关闭）。
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { getAuth, fetchCredits } from './auth.js'
import { computeTokenWindow } from './tokenwindow.js'

const DEFAULT_GATEWAY = 'http://127.0.0.1:3425'
const REQUEST_TIMEOUT_MS = 6000
const HISTORY_LIMIT = 32
const HOURLY_HOURS = 12

function configDir() {
  const fromEnv = (process.env.WORKBUDDY_CONFIG_DIR || '').trim()
  if (fromEnv) return fromEnv
  return path.join(os.homedir() || process.env.HOME || '', '.config', 'dsh-workbuddy-credits')
}
function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')) } catch { return undefined }
}
function localDateKey(d) {
  const dt = d instanceof Date ? d : new Date()
  const y = dt.getFullYear()
  const m = String(dt.getMonth() + 1).padStart(2, '0')
  const day = String(dt.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
function errorMessage(error) {
  const m = error && error.message ? error.message : String(error)
  return String(m).split('\n')[0].slice(0, 300)
}

/** 是否开启「接入 Magpie」开关（面板写入的共享模式文件）。 */
function readViaMagpie() {
  try {
    const f = path.join(os.homedir() || process.env.HOME || '', '.config', 'dsh-workbuddy-credits', 'mode.json')
    return JSON.parse(fs.readFileSync(f, 'utf8')).viaMagpie === true
  } catch { return false }
}

function readTodayUsed(provider) {
  const data = readJson(path.join(configDir(), 'credits-daily.json'))
  if (!data || typeof data !== 'object') return undefined
  const prefix = `${provider}|`
  const todayKey = localDateKey()
  const keys = Object.keys(data).filter((k) => k.startsWith(prefix))
  if (keys.length === 0) return undefined
  const ordered = keys.slice().sort((a, b) => (/total\s*credits/i.test(a) ? 0 : 1) - (/total\s*credits/i.test(b) ? 0 : 1))
  for (const key of ordered) {
    const entry = data[key]
    if (!entry || typeof entry !== 'object') continue
    const last = entry.last && typeof entry.last === 'object' ? entry.last : undefined
    const days = entry.days && typeof entry.days === 'object' ? entry.days : undefined
    let used = last ? last.used : undefined
    if (days && typeof days[todayKey] === 'number') used = days[todayKey]
    if (typeof used !== 'number' && !last) continue
    return { used, total: last ? last.total : undefined, at: last ? last.at : undefined, since: entry.since, day: todayKey, key }
  }
  return undefined
}

function readHistory(provider, limit) {
  const data = readJson(path.join(configDir(), 'quota-history.json'))
  if (!data || typeof data !== 'object') return []
  const prefix = `${provider}|`
  for (const key of Object.keys(data)) {
    if (!key.startsWith(prefix)) continue
    const windows = data[key]
    if (!windows || typeof windows !== 'object') continue
    const series = windows['Total credits'] || windows['Credits'] || windows.credits || windows.Credits
    if (!Array.isArray(series)) continue
    return series.filter((p) => p && typeof p.left === 'number').slice(-limit).map((p) => ({ at: p.at, left: p.left }))
  }
  return []
}

function readHourlyUsage(provider, hours) {
  let raw
  try { raw = fs.readFileSync(path.join(configDir(), 'usage.jsonl'), 'utf8') } catch { return { hours: [], peak: null } }
  const now = new Date()
  const startHour = new Date(now.getTime())
  startHour.setMinutes(0, 0, 0)
  const buckets = new Map()
  const list = []
  for (let i = hours - 1; i >= 0; i--) {
    const d = new Date(startHour.getTime() - i * 3600 * 1000)
    const key = localDateKey(d) + 'T' + String(d.getHours()).padStart(2, '0')
    const b = { key, label: String(d.getHours()).padStart(2, '0') + ':00', date: localDateKey(d), hour: d.getHours(), used: 0, calls: 0 }
    buckets.set(key, b)
    list.push(b)
  }
  for (const line of raw.split('\n')) {
    if (!line) continue
    let e
    try { e = JSON.parse(line) } catch { continue }
    if (!e || e.provider !== provider) continue
    const t = typeof e.t === 'string' ? e.t : ''
    const dt = new Date(t)
    if (Number.isNaN(dt.getTime())) continue
    const b = buckets.get(localDateKey(dt) + 'T' + String(dt.getHours()).padStart(2, '0'))
    if (!b) continue
    b.used += (typeof e.credits === 'number' && Number.isFinite(e.credits)) ? e.credits : 0
    b.calls += 1
  }
  let peak = null
  for (const b of list) if (!peak || b.used > peak.used) peak = b
  const round2 = (n) => Math.round(n * 100) / 100
  return {
    hours: list.map((b) => ({ label: b.label, date: b.date, hour: b.hour, used: round2(b.used), calls: b.calls })),
    peak: peak ? { label: peak.label, date: peak.date, used: round2(peak.used) } : null,
  }
}

function isTokenWindow(w) {
  const unit = String((w && w.unit) || '').toLowerCase()
  const name = String((w && w.name) || '')
  if (unit === 'token' || unit === 'tokens') return true
  return /tokens?/i.test(name)
}
function normalizeWindow(w) {
  const limit = typeof w.limit === 'number' ? w.limit : undefined
  let amount = typeof w.amount === 'number' ? w.amount : undefined
  if (amount === undefined && typeof w.used === 'number' && typeof limit === 'number') amount = (w.used / 100) * limit
  const remaining = typeof amount === 'number' && typeof limit === 'number' ? Math.max(0, limit - amount) : undefined
  const usedPercent = typeof w.used === 'number' ? w.used : (typeof amount === 'number' && typeof limit === 'number' && limit > 0 ? (amount / limit) * 100 : undefined)
  const remainingPercent = typeof w.remaining === 'number' ? w.remaining : (typeof remaining === 'number' && typeof limit === 'number' && limit > 0 ? (remaining / limit) * 100 : undefined)
  return { name: w.name || 'Credits', amount, limit, remaining, unit: w.unit || (isTokenWindow(w) ? 'tokens' : 'credits'), usedPercent, remainingPercent, display: w.display, resetsAt: w.resetsAt, runsOutAt: w.runsOutAt, holds: w.holds }
}

/** 打一次快照：直连（默认）或 Magpie 网关。 */
export async function snapshot(options = {}) {
  const provider = options.provider || 'workbuddy'
  const gateway = options.gateway || DEFAULT_GATEWAY
  const fetchedAt = new Date().toISOString()
  const url = `${gateway.replace(/\/+$/, '')}/v1/magpie/quotas`

  // —— 直连模式：插件自己的令牌 + billing 接口 + 本地会话账本 ——
  if (options.mode !== 'magpie' && !readViaMagpie()) {
    const auth = await getAuth()
    if (auth) {
      try {
        const c = await fetchCredits(auth)
        const tw = computeTokenWindow()
        return {
          ok: true, available: true, provider: 'workbuddy', matchedProvider: 'workbuddy', candidates: ['workbuddy'],
          label: 'WorkBuddy', displayName: 'WorkBuddy', plan: c.plan || '', isPaid: c.isPaid === true, capApplies: c.isPaid !== true, user: auth.uid || '',
          readAt: new Date().toISOString(), fetchedAt, gateway: 'direct', mode: 'direct',
          todayUsed: undefined, history: [], hourlyUsage: { hours: [], peak: null },
          credits: c.credits, creditWindows: c.creditWindows, token: tw, window: c.credits,
        }
      } catch (error) {
        if (options.fallbackMagpie === false) return { ok: false, error: { message: errorMessage(error) }, gateway: 'direct', provider: 'workbuddy', fetchedAt }
      }
    } else if (options.fallbackMagpie === false) {
      return {
        ok: true, available: false, reason: 'not-signed-in', provider: 'workbuddy', candidates: ['workbuddy'],
        label: 'WorkBuddy', gateway: 'direct', mode: 'direct', todayUsed: undefined, history: [],
        hourlyUsage: { hours: [], peak: null }, credits: null, creditWindows: [], token: null, window: null, fetchedAt,
      }
    }
  }

  // —— Magpie 网关 ——
  const response = await fetch(url, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) })
  if (!response.ok) throw new Error(`Magpie 网关返回 HTTP ${response.status}`)
  const body = await response.json()
  const rows = Array.isArray(body && body.data) ? body.data : []
  const candidates = [provider].filter((v, i, a) => v && a.indexOf(v) === i)
  const wb = rows.find((row) => row && candidates.includes(row.provider))
  const matched = wb ? wb.provider : provider
  const todayUsed = readTodayUsed(matched)
  const history = readHistory(matched, HISTORY_LIMIT)
  const hourlyUsage = readHourlyUsage(matched, HOURLY_HOURS)
  if (!wb) return { ok: true, available: false, provider, candidates, gateway, todayUsed, history, hourlyUsage, credits: null, creditWindows: [], token: null, fetchedAt }

  const windows = (Array.isArray(wb.windows) ? wb.windows : []).map(normalizeWindow)
  const tokenWindows = windows.filter((w) => w.unit === 'tokens' || isTokenWindow(w))
  const creditWindows = windows.filter((w) => !(w.unit === 'tokens' || isTokenWindow(w)))
  const primaryCredits = creditWindows.find((w) => /total\s*credits/i.test(w.name)) ||
    creditWindows.filter((w) => typeof w.limit === 'number' && w.limit > 0).sort((a, b) => b.limit - a.limit)[0] || null
  const credits = primaryCredits ? { ...primaryCredits, unit: 'credits' } : null
  const primaryToken = tokenWindows.slice().sort((a, b) => (b.limit || 0) - (a.limit || 0))[0] || null
  const token = primaryToken ? { ...primaryToken, unit: 'tokens' } : null

  return {
    ok: true, available: true, provider: wb.provider, matchedProvider: matched, candidates,
    label: 'WorkBuddy', displayName: wb.name || 'WorkBuddy', plan: wb.plan || '',
    isPaid: !/free/i.test(wb.plan || ''), capApplies: /free/i.test(wb.plan || ''), user: wb.user || '',
    readAt: wb.readAt || fetchedAt, fetchedAt, gateway, todayUsed, history, hourlyUsage,
    credits,
    creditWindows: creditWindows.map((w) => ({ name: w.name, amount: w.amount, limit: w.limit, display: w.display, remainingPercent: w.remainingPercent })),
    token, window: credits, windows,
  }
}
