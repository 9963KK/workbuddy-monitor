/**
 * 24h token 窗口：不依赖 Magpie，用 DSH 自己的会话用量本地估算。
 *
 * 口径对齐 Magpie（其源码说明）：
 *   - 只统计 deepseek-v4.1-flash（含付费别名 -sg）；
 *   - 每条计 inputTokens + cacheReadTokens + outputTokens（缓存读也算）；
 *   - 固定 24h 窗口（非滑动）：窗口起点 = 上窗结束后第一条请求，reset = 起点 + 24h；
 *   - 上限是实测值：中国版 copilot.tencent.com ≈ 2e8（~200M）/账号/24h。
 * 数据来自 DSH 会话档（sessions 下的 session*.jsonl.zstd，多帧 zstd，按 magic 切帧解压）。
 */
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { zstdDecompressSync } from 'node:zlib'

const MAGIC = Buffer.from([0x28, 0xb5, 0x2f, 0xfd])
const CAP = 2e8
const SPAN = 24 * 3600 * 1000
const NAME = 'deepseek-v4.1-flash tokens (est.)'

function sessionsRoot() {
  const home = process.env.DSH_HOME || path.join(os.homedir() || process.env.HOME || '', '.dsh')
  return path.join(home, 'sessions')
}


function pinnedWindow(nowMs) {
  try {
    const home = process.env.DSH_HOME || path.join(os.homedir() || process.env.HOME || '', '.dsh')
    const p = path.join(process.env.HOME || '', '.config', 'dsh-workbuddy-credits', 'window.json')
    const j = JSON.parse(fs.readFileSync(p, 'utf8'))
    if (j && typeof j.resetAt === 'number' && j.resetAt > nowMs) return j
  } catch {}
  return null
}

// 多帧 zstd 解码：帧以 magic 起始，逐帧解压拼接
function decodeZstd(bytes) {
  const ranges = []
  let at = bytes.indexOf(MAGIC)
  while (at >= 0) {
    if (ranges.length > 0) ranges[ranges.length - 1].end = at
    ranges.push({ start: at, end: bytes.length })
    at = bytes.indexOf(MAGIC, at + MAGIC.length)
  }
  let text = ''
  for (const r of ranges) {
    try { text += zstdDecompressSync(bytes.subarray(r.start, r.end)).toString('utf8') } catch {}
  }
  return text
}

// 递归找近期的会话档（只看最近 ~26h 改动的文件，控制开销）
function recentLogFiles(sinceMs) {
  const root = sessionsRoot()
  const out = []
  const walk = (dir, depth) => {
    if (depth > 5) return
    let ents
    try { ents = fs.readdirSync(dir, { withFileTypes: true }) } catch { return }
    for (const e of ents) {
      const p = path.join(dir, e.name)
      if (e.isDirectory()) { walk(p, depth + 1); continue }
      if (!/\.jsonl(\.zstd)?$/.test(e.name)) continue
      try {
        const st = fs.statSync(p)
        if (st.mtimeMs >= sinceMs) out.push({ path: p, mtimeMs: st.mtimeMs })
      } catch {}
    }
  }
  walk(root, 0)
  return out
}

const fileCache = new Map() // path -> { mtimeMs, samples: [{t, tokens}] }

function samplesOfFile(entry) {
  const cached = fileCache.get(entry.path)
  if (cached && cached.mtimeMs === entry.mtimeMs) return cached.samples
  const samples = []
  try {
    const bytes = fs.readFileSync(entry.path)
    const text = /\.zstd$/.test(entry.path) ? decodeZstd(bytes) : bytes.toString('utf8')
    for (const line of text.split('\n')) {
      const s = line.trim()
      if (!s) continue
      let e
      try { e = JSON.parse(s) } catch { continue }
      if (!e || e.type !== 'assistant/message') continue
      const u = e.data && e.data.usage
      const src = e.data && e.data.message && e.data.message.source
      const model = src && src.model ? String(src.model) : ''
      if (!u || !/deepseek-v4\.1-flash/.test(model)) continue
      const t = typeof e.time === 'number' ? e.time : (e.createdAt || null)
      if (!t) continue
      const tokens = (u.inputTokens || 0) + (u.cacheReadTokens || 0) + (u.outputTokens || 0)
      if (tokens > 0) samples.push({ t, tokens })
    }
  } catch {}
  fileCache.set(entry.path, { mtimeMs: entry.mtimeMs, samples })
  return samples
}

/**
 * 计算当前 24h 窗口用量，返回与插件 token 徽标同结构的对象：
 * { name, amount(used tokens), limit, remaining, remainingPercent, usedPercent, display, resetsAt }
 */
export function computeTokenWindow(nowMs = Date.now()) {
  const pin = pinnedWindow(nowMs)
  if (pin) {
    return { name: NAME, amount: CAP, limit: CAP, remaining: 0, remainingPercent: 0, usedPercent: 100, display: `~200M / ~200M`, resetsAt: new Date(pin.resetAt).toISOString(), samples: 0, pinned: true }
  }
  const files = recentLogFiles(nowMs - (SPAN + 2 * 3600 * 1000))
  const all = []
  for (const f of files) for (const s of samplesOfFile(f)) all.push(s)
  if (all.length === 0) {
    return { name: NAME, amount: 0, limit: CAP, remaining: CAP, remainingPercent: 100, usedPercent: 0, display: `0 / ~200M`, resetsAt: null, samples: 0 }
  }
  all.sort((a, b) => a.t - b.t)
  // 固定 24h 窗口重建：某条 >= 当前窗起点+24h 就开新窗
  let winStart = all[0].t
  let used = all[0].tokens
  for (let i = 1; i < all.length; i++) {
    if (all[i].t >= winStart + SPAN) { winStart = all[i].t; used = all[i].tokens }
    else used += all[i].tokens
  }
  const remaining = Math.max(0, CAP - used)
  const round1 = (n) => Math.round(n * 10) / 10
  const fmtBig = (v) => (v >= 1e6 ? (v / 1e6).toFixed(1).replace(/\.0$/, '') + 'M' : v >= 1e3 ? (v / 1e3).toFixed(1) + 'K' : String(Math.round(v)))
  return {
    name: NAME,
    amount: Math.round(used),
    limit: CAP,
    remaining,
    remainingPercent: round1((remaining / CAP) * 100),
    usedPercent: round1((used / CAP) * 100),
    display: `${fmtBig(used)} / ~200M`,
    resetsAt: new Date(winStart + SPAN).toISOString(),
    samples: all.length,
  }
}
