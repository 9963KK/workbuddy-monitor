/** 接入模式：direct（直连 copilot.tencent.com）或 viaMagpie（数据与模型都走本机 Magpie 网关）。 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

export const MAGPIE_BASE = 'http://127.0.0.1:3425'
export const MAGPIE_INSTALL_URL = 'https://github.com/yetone/magpie-releases'
const CFG = path.join(os.homedir() || process.env.HOME || '', '.config', 'dsh-workbuddy-credits')
const FILE = path.join(CFG, 'mode.json')

export function readMode() {
  try { const j = JSON.parse(fs.readFileSync(FILE, 'utf8')); return { viaMagpie: !!j.viaMagpie } } catch { return { viaMagpie: false } }
}
export function writeMode(m) {
  fs.mkdirSync(CFG, { recursive: true })
  fs.writeFileSync(FILE, JSON.stringify({ viaMagpie: !!m.viaMagpie }, null, 2))
  return readMode()
}
export async function detectMagpie(timeoutMs = 1500) {
  try { const r = await fetch(MAGPIE_BASE + '/v1/models', { signal: AbortSignal.timeout(timeoutMs) }); return r.ok } catch { return false }
}
