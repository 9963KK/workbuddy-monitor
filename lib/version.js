/** 版本自检：DSH 版本、插件版本、是否已验证。全部失败安全（只返回空串，不抛）。 */
import fs from 'node:fs'
import { execFileSync } from 'node:child_process'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const APP = '/Applications/DeepSeek Harness.app'
const here = path.dirname(fileURLToPath(import.meta.url))
const pkgPath = path.join(here, '..', 'package.json')

function readJson(p) { try { return JSON.parse(fs.readFileSync(p, 'utf8')) } catch { return null } }

export function pluginPackage() { return readJson(pkgPath) || {} }
export function pluginVersion() { return pluginPackage().version || '' }
export function verifiedDsh() {
  const v = pluginPackage()?.dsh?.compatibility?.verified
  return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []
}
export function minored(v) { const m = String(v || '').match(/^(\d+)\.(\d+)/); return m ? m[1] + '.' + m[2] : '' }

function fromInfoPlist() {
  const p = path.join(APP, 'Contents', 'Info.plist')
  try {
    const raw = fs.readFileSync(p, 'utf8')
    const m = raw.match(/<key>CFBundleShortVersionString<\/key>\s*<string>([^<]+)<\/string>/)
    if (m) return m[1]
  } catch {}
  try {
    const out = execFileSync('/usr/bin/plutil', ['-extract', 'CFBundleShortVersionString', 'raw', '-o', '-', p], { encoding: 'utf8', timeout: 2000 })
    return String(out).trim()
  } catch {}
  return ''
}

function fromAsar() {
  const j = readJson(path.join(APP, 'Contents', 'Resources', 'app.asar', 'package.json'))
  return (j && j.version) || ''
}

function fromCrashLog() {
  try {
    const dir = path.join(os.homedir() || '', 'Library', 'Logs', 'DeepSeek Harness')
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.log')).sort().reverse()
    for (const f of files.slice(0, 3)) {
      const m = fs.readFileSync(path.join(dir, f), 'utf8').match(/^app:\s*\S+\s+(\S+)/m)
      if (m) return m[1]
    }
  } catch {}
  return ''
}

/** 我们依赖的宿主能力是否还在（比版本号更能说明「需要跟着改」）。 */
export function capabilityReport(ctx) {
  const missing = []
  const has = (fn) => { try { return typeof fn === 'function' } catch { return false } }
  if (!ctx || !ctx.llm) missing.push('llm')
  else {
    if (!has(ctx.llm.registerAdapter)) missing.push('llm.registerAdapter')
    if (!has(ctx.llm.registerConfigurableProviders)) missing.push('llm.registerConfigurableProviders')
  }
  if (!ctx || !ctx.webServer || !has(ctx.webServer.register)) missing.push('webServer.register')
  return { ok: missing.length === 0, missing }
}

/** 探测本机 DSH 版本：环境变量 → profile 的 dsh-base → asar → Info.plist → 崩溃日志。 */
export function dshVersion() {
  const home = process.env.DSH_HOME || path.join(os.homedir() || process.env.HOME || '', '.dsh')
  const probes = [
    () => process.env.DSH_VERSION || '',
    () => {
      const dir = path.join(home, 'profiles')
      for (const name of fs.readdirSync(dir)) {
        const f = path.join(dir, name, 'node_modules', '@deepseek-ai', 'dsh-base', 'package.json')
        const j = readJson(f)
        if (j && j.version) return j.version
      }
      return ''
    },
    fromAsar,
    fromInfoPlist,
    fromCrashLog,
  ]
  for (const probe of probes) { try { const v = probe(); if (v) return v } catch {} }
  return ''
}

/** 当前环境状态：needsUpdate = 本机 DSH 不在「已验证」列表里。 */
export function envStatus(ctx) {
  const dsh = dshVersion()
  const plugin = pluginVersion()
  const verified = verifiedDsh()
  const d = minored(dsh)
  const listed = verified.length > 0 && verified.some((v) => minored(v) === d)
  const caps = capabilityReport(ctx)
  const versionMismatch = verified.length > 0 && !!dsh && !listed
  return {
    dsh,
    plugin,
    verified,
    capabilities: caps,
    verifiedOk: !versionMismatch && caps.ok,
    needsUpdate: versionMismatch || !caps.ok,
    reason: versionMismatch ? 'dsh-version' : (!caps.ok ? 'missing-api' : ''),
    checkedAt: Date.now(),
  }
}

/** 查 npm 上插件的最新版本（失败返回空串，不抛）。 */
export async function latestPluginVersion(timeoutMs = 5000) {
  try {
    const r = await fetch('https://registry.npmjs.org/workbuddy-monitor/latest', { signal: AbortSignal.timeout(timeoutMs) })
    if (!r.ok) return ''
    const j = await r.json()
    return (j && j.version) || ''
  } catch { return '' }
}
