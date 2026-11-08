import { exec } from 'node:child_process'
import { startLogin, pollLoginToken, fetchAccount, addAccount, listAccounts, BASE } from './auth.js'
const now = () => Date.now()
const wanted = (process.argv[2] || '').trim()

async function main() {
  const site = await startLogin()
  console.log('\n请用浏览器登录 WorkBuddy（要新增的账号）：\n\n  ' + site.authUrl + '\n')
  try { exec(`open "${site.authUrl}"`) } catch {}
  const tok = await pollLoginToken(site.state)
  const domain = tok.domain || 'www.workbuddy.cn'
  let acct = {}
  try { acct = await fetchAccount(site.state, tok.accessToken, domain) } catch {}
  const acc = addAccount({
    id: acct.uid || tok.uid || undefined,
    name: wanted || acct.nickname || acct.nickName || acct.name || 'WorkBuddy',
    access: tok.accessToken,
    refresh: tok.refreshToken || '',
    expires: tok.expiresIn > 0 ? now() + tok.expiresIn * 1000 : (tok.expiresAt || 0),
    refreshExpiresAt: tok.refreshExpiresIn > 0 ? now() + tok.refreshExpiresIn * 1000 : (tok.refreshExpiresAt || 0),
    domain,
    uid: acct.uid || tok.uid || '',
    tokenType: tok.tokenType || '',
  })
  const st = listAccounts()
  console.log(`✅ 已加入账号池：${acc.name}（共 ${st.accounts.length} 个账号，模式 ${st.mode}）`)
}

main().catch((e) => { console.error('登录失败：' + (e && e.message ? e.message : e)); process.exit(1) })
