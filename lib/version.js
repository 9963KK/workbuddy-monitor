/** 版本自检：DSH 版本、插件版本、是否已验证。全部失败安全（只返回空串，不抛）。 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

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

/** 探测本机 DSH 版本：环境变量 → profile 里的 @deepseek-ai/dsh-base → 应用包。 */
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
    () => {
      const f = '/Applications/DeepSeek Harness.app/Contents/Resources/app.asar/package.json'
      const j = readJson(f)
      return (j && j.version) || ''
    },
  ]
  for (const probe of probes) { try { const v = probe(); if (v) return v } catch {} }
  return ''
}

/** 当前环境状态：needsUpdate = 本机 DSH 不在「已验证」列表里。 */
export function envStatus() {
  const dsh = dshVersion()
  const plugin = pluginVersion()
  const verified = verifiedDsh()
  const d = minored(dsh)
  const listed = verified.length > 0 && verified.some((v) => minored(v) === d)
  return {
    dsh,
    plugin,
    verified,
    verifiedOk: verified.length === 0 ? true : listed,
    needsUpdate: verified.length > 0 && !!dsh && !listed,
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
