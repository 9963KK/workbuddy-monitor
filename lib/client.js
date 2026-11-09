window.__ModuleLoader__.load({
  id: 'workbuddy-monitor',
  factory: (require) => {
    const module = { exports: {} }
    const exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })
    const React = require('react')
    const h = React.createElement

    const CSS = [
      '.wbx{display:flex;flex-direction:column;gap:14px;font-size:13px;color:var(--dsw-alias-label-primary);max-width:560px}',
      '.wbx-head{display:flex;align-items:center;justify-content:space-between;gap:12px}',
      '.wbx-title{font-weight:600;font-size:14px}',
      '.wbx-btn{border:0.5px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);border-radius:8px;padding:4px 12px;font-size:12px;cursor:pointer;transition:border-color .15s}',
      '.wbx-btn:hover{border-color:var(--dsw-alias-brand-primary)}',
      '.wbx-btn:disabled{opacity:.55;cursor:default}',
      '.wbx-card{border:0.5px solid var(--dsw-alias-border-l2);border-radius:10px;padding:12px 14px;display:flex;flex-direction:column;gap:9px;background:var(--dsw-alias-bg-layer-1)}',
      '.wbx-lab{color:var(--dsw-alias-label-tertiary);font-size:12px}',
      '.wbx-big{font-size:22px;font-weight:700;font-variant-numeric:tabular-nums;line-height:1.1}',
      '.wbx-sub{color:var(--dsw-alias-label-tertiary);font-size:11px}',
      '.wbx-row{display:flex;align-items:center;justify-content:space-between;gap:12px}',
      '.wbx-v{font-variant-numeric:tabular-nums}',
      '.wbx-track{height:7px;border-radius:4px;background:var(--dsw-alias-border-l2);overflow:hidden}',
      '.wbx-fill{height:100%;border-radius:4px;transition:width .4s ease}',
      '.wbx-pct{font-weight:600;font-variant-numeric:tabular-nums}',
      '.wbx-switch{position:relative;width:40px;height:23px;border-radius:12px;background:var(--dsw-alias-border-l2);transition:background .18s ease;flex:none;cursor:pointer;border:0;padding:0}',
      '.wbx-switch.on{background:#2f9e63}',
      '.wbx-switch::after{content:"";position:absolute;top:2.5px;left:2.5px;width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.25);transition:left .18s ease}',
      '.wbx-switch.on::after{left:19.5px}',
      '.wbx-switch[disabled]{opacity:.5;cursor:default}',
      '.wbx-seg{display:inline-flex;border:0.5px solid var(--dsw-alias-border-l2);border-radius:8px;overflow:hidden}',
      '.wbx-seg button{border:0;background:transparent;color:var(--dsw-alias-label-secondary);padding:4px 12px;font-size:12px;cursor:pointer}',
      '.wbx-seg button.on{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font-weight:600}',
      '.wbx-acct{display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:12px;padding:3px 0}',
      '.wbx-dot{width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:7px;background:#2f9e63}',
      '.wbx-note{color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:1.6}',
      '.wbx-chips{display:flex;flex-wrap:wrap;gap:6px;align-items:center}',
      '.wbx-chip{display:inline-flex;align-items:center;gap:4px;font-size:11px;line-height:1;padding:4px 9px;border-radius:999px;border:0.5px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-2);font-variant-numeric:tabular-nums;white-space:nowrap}',
      '.wbx-chip.ok{color:#2f9e63;border-color:rgba(47,158,99,.35);background:rgba(47,158,99,.10)}',
      '.wbx-chip.warn{color:#e0a029;border-color:rgba(224,160,41,.35);background:rgba(224,160,41,.10)}',
      '.wbx-chip.dim{color:var(--dsw-alias-label-tertiary)}',
      // ── 输入框右侧圆环徽标 ──
      '.wbx-badges{position:relative;display:inline-flex;align-items:center;gap:2px;margin:0 6px;font-size:12px;line-height:1}',
      '.wbx-ringbadge{display:inline-flex;align-items:center;gap:5px;border:0.5px solid transparent;background:transparent;color:var(--dsw-alias-label-primary);border-radius:999px;padding:3px 8px 3px 5px;font-size:12px;cursor:pointer;white-space:nowrap;transition:background .14s ease,border-color .14s ease}',
      '.wbx-ringbadge:hover{border-color:var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1)}',
      '.wbx-ring{flex:0 0 auto;display:block;overflow:visible}',
      '.wbx-ringpct{font-weight:600;font-variant-numeric:tabular-nums}',
      '.wbx-pop{position:fixed;z-index:2147483000;box-sizing:border-box;padding:10px 12px;border-radius:10px;border:0.5px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);box-shadow:0 8px 24px rgba(0,0,0,.20);font-size:12px;display:flex;flex-direction:column;gap:7px}',
      '.wbx-pop::after{content:"";position:absolute;bottom:-5px;left:var(--wbx-arrow-left,16px);width:9px;height:9px;background:var(--dsw-alias-bg-layer-2);border-right:0.5px solid var(--dsw-alias-border-l2);border-bottom:0.5px solid var(--dsw-alias-border-l2);transform:rotate(45deg)}',
    ].join('\n')
    const TAG = 'workbuddy-monitor/usage.css'
    if (typeof document !== 'undefined' && document.querySelector('style[data-plugin-css=' + JSON.stringify(TAG) + ']') === null) {
      const s = document.createElement('style'); s.dataset.pluginCss = TAG; s.textContent = CSS; document.head.appendChild(s)
    }
    let ReactDOM = null
    try { ReactDOM = require('react-dom') } catch { ReactDOM = null }
    const num = (v) => (typeof v === 'number' && isFinite(v) ? Math.round(v * 100) / 100 : null)
    const colorFor = (rem) => (rem === null ? '#9aa0a6' : rem > 50 ? '#2f9e63' : rem > 20 ? '#e0a029' : '#e5484d')
    const BLUE = '#3b82f6'
    const getJSON = async (u) => { const r = await fetch(u, { headers: { accept: 'application/json' } }); return r.json() }

    // 徽标用的辅助函数（与设置面板同源：都读 /api/workbuddy-credits）
    const clampPct = (v) => (typeof v === 'number' && isFinite(v) ? Math.max(0, Math.min(100, v)) : null)
    const fmtBig = (v) => {
      if (typeof v !== 'number' || !isFinite(v)) return '—'
      const a = Math.abs(v)
      if (a >= 1e9) return (v / 1e9).toFixed(1).replace(/\.0$/, '') + 'B'
      if (a >= 1e6) return (v / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'
      if (a >= 1e3) return (v / 1e3).toFixed(1).replace(/\.0$/, '') + 'K'
      return String(Math.round(v))
    }
    const trimNum = (v) => num(v) === null ? '—' : (Math.abs(v) >= 100 ? String(Math.round(v)) : Math.abs(v) >= 1 ? String(Math.round(v * 100) / 100) : String(Math.round(v * 1000) / 1000))
    const fmtDate = (iso) => {
      if (!iso || typeof iso !== 'string') return '—'
      const d = new Date(iso)
      if (Number.isNaN(d.getTime())) return '—'
      try { return d.toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) } catch { return d.toISOString().slice(5, 16).replace('T', ' ') }
    }
    const currentModelId = () => {
      try {
        const inTrigger = document.querySelector('button[aria-haspopup="menu"] [data-model-id]')
        if (inTrigger) return inTrigger.getAttribute('data-model-id') || ''
        const slot = document.querySelector('[data-slot="conversation.input.model.label"]')
        const owner = slot && slot.closest ? slot.closest('[data-model-id]') : null
        if (owner) return owner.getAttribute('data-model-id') || ''
        const any = document.querySelector('[data-model-id]')
        return any ? (any.getAttribute('data-model-id') || '') : ''
      } catch { return '' }
    }
    const Ring = (props) => {
      const ratio = typeof props.ratio === 'number' && isFinite(props.ratio) ? Math.max(0, Math.min(1, props.ratio)) : 0
      const R = 9, C = 2 * Math.PI * R, size = props.size || 16, stroke = props.stroke || 2.5
      return h('svg', { className: 'wbx-ring', width: size, height: size, viewBox: '0 0 24 24', 'aria-hidden': 'true', style: { transform: 'rotate(-90deg)' } }, [
        h('circle', { key: 'b', cx: 12, cy: 12, r: R, fill: 'none', stroke: 'currentColor', strokeOpacity: 0.16, strokeWidth: stroke }),
        h('circle', { key: 'a', cx: 12, cy: 12, r: R, fill: 'none', stroke: props.color, strokeWidth: stroke, strokeLinecap: 'round', strokeDasharray: C, strokeDashoffset: C * (1 - ratio), style: { transition: 'stroke-dashoffset .26s ease' } }),
      ])
    }

    function Bar(props) {
      return h('div', { className: 'wbx-track' }, h('div', { className: 'wbx-fill', style: { width: Math.max(0, Math.min(100, props.pct || 0)) + '%', background: props.color } }))
    }
    function Switch(props) {
      return h('button', {
        type: 'button', role: 'switch', 'aria-checked': !!props.checked, disabled: !!props.disabled,
        className: 'wbx-switch' + (props.checked ? ' on' : ''), title: props.title || '',
        onClick: props.disabled ? undefined : props.onChange,
      })
    }
    function Metric(props) {
      return h('div', { className: 'wbx-card' }, [
        h('div', { key: 'r1', className: 'wbx-row' }, [
          h('span', { key: 'l', className: 'wbx-lab' }, props.label),
          h('span', { key: 'p', className: 'wbx-pct', style: { color: props.color } }, props.pctText || ''),
        ]),
        h('div', { key: 'r2', className: 'wbx-row', style: { alignItems: 'baseline' } }, [
          h('span', { key: 'n', className: 'wbx-big' }, props.value),
          h('span', { key: 's', className: 'wbx-sub' }, props.sub || ''),
        ]),
        h(Bar, { key: 'b', pct: props.pct, color: props.color }),
        ...(props.rows || []).map((row, i) => h('div', { key: 'row' + i, className: 'wbx-row' }, [
          h('span', { key: 'k', className: 'wbx-lab' }, row[0]),
          h('span', { key: 'v', className: 'wbx-v', style: { fontSize: 12 } }, row[1]),
        ])),
      ])
    }

    function UsagePanel() {
      const [d, setD] = React.useState(null)
      const [acc, setAcc] = React.useState(null)
      const [busy, setBusy] = React.useState(false)
      const [msg, setMsg] = React.useState('')
      const loadAll = async (manual) => {
        if (manual) setBusy(true)
        try { const [v, a] = await Promise.all([getJSON('/api/workbuddy-credits'), getJSON('/api/dsh-workbuddy/panel')]); setD(v); setAcc(a) } catch { setD({ ok: false }) }
        if (manual) setBusy(false)
      }
      React.useEffect(() => { let alive = true; const run = async () => { try { const [v, a] = await Promise.all([getJSON('/api/workbuddy-credits'), getJSON('/api/dsh-workbuddy/panel')]); if (alive) { setD(v); setAcc(a) } } catch {} }; run(); const t = setInterval(run, 20000); return () => { alive = false; clearInterval(t) } }, [])
      const post = async (body) => { try { const r = await fetch('/api/dsh-workbuddy/panel', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }); const j = await r.json(); if (j.ok) { setAcc(j); setMsg('') } else setMsg(j.error === 'magpie-not-detected' ? '未检测到 Magpie，无法接入' : '设置失败'); return j } catch (e) { setMsg('设置失败') } }

      const addAccountFlow = async () => {
        setMsg('正在发起登录…')
        try {
          const r = await fetch('/api/dsh-workbuddy/login/start', { method: 'POST' }).then((x) => x.json())
          if (!r.ok) { setMsg('发起登录失败：' + (r.error || '')); return }
          try { window.open(r.url, '_blank') } catch (e) {}
          setMsg('已打开 WorkBuddy 登录页，请在该页面完成登录…')
          const t0 = Date.now()
          const timer = setInterval(async () => {
            if (Date.now() - t0 > 300000) { clearInterval(timer); setMsg('登录超时，请重试'); return }
            try {
              const p = await fetch('/api/dsh-workbuddy/login/poll', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ state: r.state }) }).then((x) => x.json())
              if (p.ok && p.status === 'done') { clearInterval(timer); setAcc(p); setMsg('已添加账号：' + ((p.account && p.account.name) || '')) }
              else if (!p.ok) { clearInterval(timer); setMsg('登录失败：' + (p.error || p.status || '')) }
            } catch (e) {}
          }, 2000)
        } catch (e) { setMsg('发起登录失败') }
      }

      const c = d && d.credits
      const tk = d && d.token
      const remC = c ? num(c.remainingPercent) : null
      const remT = tk ? num(tk.remainingPercent) : null
      const detected = !!(acc && acc.magpie && acc.magpie.detected)
      const viaMagpie = !!(acc && acc.viaMagpie)
      const ci = acc && acc.checkin

      return h('div', { className: 'wbx' }, [
        h('div', { key: 'head', className: 'wbx-head' }, [
          h('div', { key: 't', className: 'wbx-title', style: { display: 'flex', alignItems: 'center', gap: 8 } }, [
            h('span', { key: 'x' }, 'WorkBuddy 用量 / 余额'),
            d && d.plan ? h('span', {
              key: 'p', className: 'wbx-sub',
              style: { padding: '1px 7px', borderRadius: 999, border: '0.5px solid var(--dsw-alias-border-l2)', color: d.isPaid ? '#2f9e63' : 'var(--dsw-alias-label-tertiary)' },
            }, (d.plan || '') + (d.isPaid ? ' · 付费' : ' · 免费')) : null,
          ]),
          h('button', { key: 'r', className: 'wbx-btn', disabled: busy, onClick: () => loadAll(true) }, busy ? '刷新中…' : '刷新'),
        ]),

        h(Metric, {
          key: 'credits', label: '积分总量（官方账单）', value: c && typeof c.remaining === 'number' ? String(Math.round(c.remaining)) : '—', sub: '剩余积分',
          pct: remC, pctText: remC !== null ? Math.round(remC) + '%' : '', color: colorFor(remC),
          rows: [
            ['已用 / 额度', c ? String(c.display || '—') : '—'],
            ...(c && typeof c.resetsAt === 'string' ? [['重置', new Date(c.resetsAt).toLocaleString()]] : []),
          ],
        }),

        (d && d.capApplies === false) ? null : h(Metric, {
          key: 'token',
          label: '24h token 窗口（本机估算）',
          value: tk ? String(tk.display || '—') : '—',
          sub: tk && tk.pinned ? '已被 429 钉满' : '',
          pct: remT,
          pctText: remT !== null ? '剩余 ' + Math.round(remT) + '%' : '', color: BLUE,
          rows: [
            ...(tk && typeof tk.resetsAt === 'string' ? [['窗口重置', new Date(tk.resetsAt).toLocaleString()]] : []),
          ],
        }),

        // 账号（不再是「账号池 / 轮询 / 单账号」这些词）
        h('div', { key: 'accts', className: 'wbx-card' }, [
          h('div', { key: 'h', className: 'wbx-row' }, [
            h('span', { key: 'l', className: 'wbx-lab' }, '账号 · ' + (acc ? acc.accounts.length : 0) + ' 个'),
            h('button', { key: 'add', className: 'wbx-btn', onClick: addAccountFlow }, '＋ 添加账号'),
          ]),
        ].concat((acc && acc.accounts ? acc.accounts : []).map((a) => h('div', { key: a.id, className: 'wbx-acct' }, [
          h('span', { key: 'n' }, [h('span', { key: 'd', className: 'wbx-dot' }), a.name || a.uid || a.id]),
          h('span', { key: 's', className: 'wbx-lab' }, (acc.active === a.id ? '当前 · ' : '') + '已登录'),
        ]))).concat(acc && acc.accounts && acc.accounts.length === 0 ? [h('div', { key: 'none', className: 'wbx-lab' }, '暂无账号，运行 node lib/login.js 添加')] : [])),

        // Magpie 接入（滑动开关）
        h('div', { key: 'magpie', className: 'wbx-card' }, [
          h('div', { key: 'h', className: 'wbx-row' }, [
            h('div', { key: 'l' }, [
              h('div', { key: 't', style: { fontWeight: 600, fontSize: 13 } }, 'Magpie 接入'),
              h('div', { key: 's', className: 'wbx-sub' }, detected ? (viaMagpie ? '模型与数据都走 Magpie' : '直连 copilot.tencent.com（不走 Magpie）') : '未检测到本机 Magpie'),
            ]),
            h(Switch, { key: 'sw', checked: viaMagpie, disabled: !detected, title: detected ? '切换是否走 Magpie' : '未检测到 Magpie', onChange: () => post({ viaMagpie: !viaMagpie }) }),
          ]),
          !detected ? h('div', { key: 'ins', className: 'wbx-row' }, [
            h('span', { key: 'k', className: 'wbx-sub' }, '装好并启动 Magpie 后此开关自动可用'),
            h('button', { key: 'b', className: 'wbx-btn', onClick: () => window.open((acc.magpie && acc.magpie.url) || 'https://github.com/yetone/magpie-releases', '_blank') }, '安装 Magpie'),
          ]) : null,
        ]),

        h('div', { key: 'checkin', className: 'wbx-card' }, [
          h('div', { key: 'h', className: 'wbx-row' }, [
            h('div', { key: 'l' }, [
              h('div', { key: 't', style: { fontWeight: 600, fontSize: 13 } }, '每日自动签到'),
              h('div', { key: 's', className: 'wbx-sub' }, '每天自动领取 WorkBuddy 签到积分'),
              (ci && ci.status)
                ? h('div', { key: 'chips', className: 'wbx-chips', style: { marginTop: 6 } }, [
                  h('span', { key: 'st', className: 'wbx-chip ' + (ci.status.today_checked_in ? 'ok' : 'warn') }, (ci.status.today_checked_in ? '今日已签到' : '今日未签到')),
                  h('span', { key: 'streak', className: 'wbx-chip dim' }, '连续 ' + (ci.status.streak_days || 0) + ' 天'),
                  h('span', { key: 'daily', className: 'wbx-chip dim' }, '+' + (ci.status.daily_credit || 0) + ' 积分/天'),
                  (ci.status.active === false) ? h('span', { key: 'inactive', className: 'wbx-chip warn' }, '该账号未开启签到') : null,
                ])
                : null,
            ]),
            h(Switch, { key: 'sw', checked: !!(ci && ci.enabled), onChange: () => post({ autoCheckin: !(ci && ci.enabled) }) }),
          ]),
          (ci && ci.last && ci.last.results && ci.last.results.length)
            ? h('div', { key: 'last', className: 'wbx-chips', style: { marginTop: 6 } }, [
              h('span', { key: 't', className: 'wbx-chip dim' }, '最近一次 ' + new Date(ci.last.at).toLocaleTimeString()),
              ...ci.last.results.map((r, i) => h('span', {
                key: 'r' + i,
                className: 'wbx-chip ' + (r.status === 'claimed' ? 'ok' : r.status === 'error' || r.status === 'failed' ? 'warn' : 'dim'),
              }, (r.name || '-') + ' · ' + (r.status === 'claimed' ? '已领取' : r.status === 'already' ? '已签到' : r.status === 'failed' ? '未成功' : '出错'))),
            ])
            : null,
        ]),
        (acc && acc.env) ? h('div', { key: 'env', className: 'wbx-card' }, [
          h('div', { key: 'h', className: 'wbx-row' }, [
            h('div', { key: 'l' }, [
              h('div', { key: 't', style: { fontWeight: 600, fontSize: 13 } }, '环境自检'),
              h('div', { key: 's', className: 'wbx-sub' }, 'DSH ' + (acc.env.dsh || '未知') + ' · 插件 ' + (acc.env.plugin || '?')),
            ]),
            h('span', {
              key: 'st', className: 'wbx-sub',
              style: { color: acc.env.needsUpdate ? '#e5484d' : '#2f9e63' },
            }, acc.env.needsUpdate ? '⚠ 未验证' : '已验证'),
          ]),
          acc.env.needsUpdate
            ? h('div', { key: 'w', className: 'wbx-sub', style: { color: '#e5484d' } }, acc.env.reason === 'missing-api' ? ('DSH 更新后缺少本插件依赖的接口：' + (((acc.env.capabilities || {}).missing || []).join(', ') || '未知') + '，插件需要跟进更新。') : ('DSH 已升级到 ' + (acc.env.dsh || '未知') + '，本插件只在 ' + ((acc.env.verified || []).join(' / ') || '—') + ' 上验证过，请到 GitHub 检查新版本。'))
            : null,
          acc.env.pluginOutdated
            ? h('div', { key: 'u', className: 'wbx-sub' }, '插件有新版本 ' + acc.env.latestPlugin + '（当前 ' + acc.env.plugin + '），可运行 dsh plugin add workbuddy-monitor 升级。')
            : null,
        ]) : null,
        msg ? h('div', { key: 'm', className: 'wbx-note', style: { color: 'var(--dsw-alias-state-error-primary)' } }, msg) : null,
        h('div', { key: 'note', className: 'wbx-note' }, '添加账号：node lib/login.js 名称 · 多个账号会自动轮流使用；开启「每日自动签到」后每天自动领取积分；勾选 Magpie 接入后模型与监控数据都走本机 Magpie 网关'),
      ])
    }

    // ── 输入框右侧圆环徽标（仅在当前为 WorkBuddy 模型时显示）──
    function UsageBadge() {
      const [d, setD] = React.useState(null)
      const [hover, setHover] = React.useState(null)
      const [wbModel, setWbModel] = React.useState(null)
      const hoverCloseRef = React.useRef(0)

      React.useEffect(() => {
        let alive = true, inFlight = false
        const load = async () => {
          if (inFlight) return
          if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return
          inFlight = true
          try { const v = await getJSON('/api/workbuddy-credits'); if (alive) setD(v) } catch { if (alive) setD((prev) => prev || { ok: false }) } finally { inFlight = false }
        }
        void load()
        const timer = setInterval(() => { void load() }, 20000)
        const onVisible = () => { if (document.visibilityState === 'visible') void load() }
        document.addEventListener('visibilitychange', onVisible)
        return () => { alive = false; clearInterval(timer); document.removeEventListener('visibilitychange', onVisible) }
      }, [])

      React.useEffect(() => {
        const detect = () => setWbModel(/workbuddy/i.test(String(currentModelId() || '')))
        detect()
        const timer = setInterval(detect, 1200)
        return () => clearInterval(timer)
      }, [])

      React.useEffect(() => () => { clearTimeout(hoverCloseRef.current) }, [])
      const PANEL_W = 272
      const showHover = (section, el) => {
        if (!el) return
        clearTimeout(hoverCloseRef.current)
        const r = el.getBoundingClientRect()
        const vw = window.innerWidth || 1024
        const center = r.left + r.width / 2
        let left = Math.round(center - PANEL_W / 2)
        left = Math.max(8, Math.min(left, vw - PANEL_W - 8))
        const arrow = Math.max(16, Math.min(Math.round(center - left), PANEL_W - 16))
        const bottom = Math.max(8, window.innerHeight - r.top + 10)
        setHover({ section, left, bottom, arrow })
      }
      const keepHover = () => { clearTimeout(hoverCloseRef.current) }
      const hideHoverSoon = () => { clearTimeout(hoverCloseRef.current); hoverCloseRef.current = setTimeout(() => setHover(null), 200) }

      const c = d && d.credits
      const tk = d && d.token
      const paidNoCap = !!(d && d.capApplies === false)
      const remC = c ? clampPct(num(c.remainingPercent)) : null
      const remT = tk ? clampPct(num(tk.remainingPercent)) : null
      const creditColor = colorFor(remC)
      const tokenColor = remT === null ? '#9aa0a6' : (remT > 50 ? BLUE : colorFor(remT))

      const badges = []
      if (!d) {
        badges.push(h('button', { key: 'b', type: 'button', className: 'wbx-ringbadge', title: '正在读取 WorkBuddy 用量…' }, h(Ring, { ratio: 0, color: '#9aa0a6' }), h('span', { className: 'wbx-ringpct' }, '…')))
      } else if (d.ok === false) {
        badges.push(h('button', { key: 'b', type: 'button', className: 'wbx-ringbadge', title: '读取失败：' + ((d.error && d.error.message) || '') }, h(Ring, { ratio: 0, color: '#9aa0a6' }), h('span', { className: 'wbx-ringpct' }, '不可用')))
      } else {
        if (!paidNoCap && tk && remT !== null) {
          const pct = Math.round(remT) + '%'
          const tip = 'WorkBuddy 24h 窗口（token）· 已用 ' + (tk.display || '—') + ' · 剩余 ' + pct + ' · 重置 ' + fmtDate(tk.resetsAt)
          badges.push(h('button', { key: 't', type: 'button', className: 'wbx-ringbadge', 'aria-label': tip, onMouseEnter: (e) => showHover('token', e.currentTarget), onMouseLeave: hideHoverSoon, onFocus: (e) => showHover('token', e.currentTarget), onBlur: hideHoverSoon }, h(Ring, { ratio: remT / 100, color: tokenColor }), h('span', { className: 'wbx-ringpct' }, pct)))
        }
        if (c && remC !== null) {
          const pct = Math.round(remC) + '%'
          const tip = 'WorkBuddy 积分总量 · 已用 ' + (c.display || '—') + ' · 剩余 ' + (typeof c.remaining === 'number' ? trimNum(c.remaining) : '—') + ' 积分（' + pct + '）· 重置 ' + fmtDate(c.resetsAt)
          badges.push(h('button', { key: 'c', type: 'button', className: 'wbx-ringbadge', 'aria-label': tip, onMouseEnter: (e) => showHover('credits', e.currentTarget), onMouseLeave: hideHoverSoon, onFocus: (e) => showHover('credits', e.currentTarget), onBlur: hideHoverSoon }, h(Ring, { ratio: remC / 100, color: creditColor }), h('span', { className: 'wbx-ringpct' }, pct)))
        }
        if (badges.length === 0) {
          badges.push(h('button', { key: 'b', type: 'button', className: 'wbx-ringbadge', title: 'WorkBuddy' }, h(Ring, { ratio: 0, color: '#9aa0a6' }), h('span', { className: 'wbx-ringpct' }, '—')))
        }
      }

      const kv = (k, v) => h('div', { key: 'kv-' + k, className: 'wbx-row', style: { fontSize: 12 } }, [h('span', { key: 'k', className: 'wbx-lab' }, k), h('span', { key: 'v', className: 'wbx-v' }, v)])
      const popHead = (title, color) => h('div', { key: 'h', className: 'wbx-row', style: { fontWeight: 600, fontSize: 13 } }, [h('span', { key: 'd', className: 'wbx-dot', style: { background: color } }), h('span', { key: 'n' }, title)])
      const creditsBody = () => c ? [
        h('div', { key: 'big', className: 'wbx-row', style: { alignItems: 'baseline' } }, [
          h('span', { key: 'n', className: 'wbx-big' }, typeof c.remaining === 'number' ? trimNum(c.remaining) : '—'),
          h('span', { key: 's', className: 'wbx-sub' }, '剩余积分'),
          h('span', { key: 'p', className: 'wbx-pct', style: { marginLeft: 'auto', color: creditColor } }, remC !== null ? Math.round(remC * 100) / 100 + '%' : '—'),
        ]),
        h('div', { key: 'b', className: 'wbx-track' }, h('div', { key: 'f', className: 'wbx-fill', style: { width: (remC || 0) + '%', background: creditColor } })),
        kv('已用 / 额度', c.display || ((typeof c.amount === 'number' ? trimNum(c.amount) : '—') + ' / ' + (typeof c.limit === 'number' ? trimNum(c.limit) : '—'))),
        c.resetsAt ? kv('重置', fmtDate(c.resetsAt)) : null,
      ].filter(Boolean) : null
      const tokenBody = () => (tk && !paidNoCap) ? [
        h('div', { key: 'big', className: 'wbx-row', style: { alignItems: 'baseline' } }, [
          h('span', { key: 'n', className: 'wbx-big' }, tk.display || '—'),
          h('span', { key: 'p', className: 'wbx-pct', style: { marginLeft: 'auto', color: tokenColor } }, '剩余 ' + (remT !== null ? Math.round(remT * 100) / 100 + '%' : '—')),
        ]),
        h('div', { key: 'b', className: 'wbx-track' }, h('div', { key: 'f', className: 'wbx-fill', style: { width: (remT || 0) + '%', background: tokenColor } })),
        tk.resetsAt ? kv('窗口重置', fmtDate(tk.resetsAt)) : null,
      ].filter(Boolean) : null

      let popover = null
      if (hover && d && d.ok !== false) {
        const section = (paidNoCap && hover.section === 'token') ? 'credits' : hover.section
        const body = section === 'credits' ? [popHead('WorkBuddy 积分', creditColor)].concat(creditsBody() || []) : [popHead('WorkBuddy 24h 窗口 · token', tokenColor)].concat(tokenBody() || [])
        const pop = h('div', { className: 'wbx-pop', style: { left: hover.left + 'px', bottom: hover.bottom + 'px', width: PANEL_W + 'px', '--wbx-arrow-left': (hover.arrow || 16) + 'px' }, role: 'tooltip', onMouseEnter: keepHover, onMouseLeave: hideHoverSoon }, body)
        popover = (typeof document !== 'undefined' && ReactDOM && typeof ReactDOM.createPortal === 'function') ? ReactDOM.createPortal(pop, document.body) : pop
      }

      if (wbModel !== true) return null
      return h('div', { className: 'wbx-badges' }, [].concat(badges).concat([popover]))
    }

    exports.inject = ['slots']
    exports.apply = function (ctx) {
      try {
      ctx.slots.inject('settings.section', () => ctx.slots.register({ name: 'settings.section', id: 'workbuddy-usage', order: 60, label: () => 'WorkBuddy 用量' }, UsagePanel))
      // 输入框右侧圆环徽标（积分 / 24h token 窗口），仅在 WorkBuddy 模型下显示
      try {
        ctx.slots.inject('conversation.input.right', () => ctx.slots.register({
          name: 'conversation.input.right',
          id: 'workbuddy-usage-badge',
          order: 90,
          inject: () => ({}),
        }, UsageBadge))
      } catch (e) { try { console.warn('[workbuddy-monitor] badge slot unavailable:', e && e.message) } catch (x) {} }
      // 设置区导航图标：用量表盘
      ctx.slots.inject('settings.section.icon', () => ctx.slots.register({ name: 'settings.section.icon', id: 'workbuddy-usage' }, (owner = {}) => {
        const size = owner.size || 16
        return h('svg', {
          width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
          strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true',
        }, [
          h('path', { key: 'a', d: 'M4.6 18a8 8 0 1 1 14.8 0' }),
          h('path', { key: 'b', d: 'M12 14.6 15.6 9.4' }),
          h('circle', { key: 'c', cx: 12, cy: 14.6, r: 1.4, fill: 'currentColor', stroke: 'none' }),
        ])
      }))
      } catch (error) {
        try { console.warn('[workbuddy-monitor] client apply failed:', error) } catch (e) {}
      }
    }
    return module.exports
  },
})
