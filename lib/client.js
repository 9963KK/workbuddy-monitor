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
    ].join('\n')
    const TAG = 'workbuddy-monitor/usage.css'
    if (typeof document !== 'undefined' && document.querySelector('style[data-plugin-css=' + JSON.stringify(TAG) + ']') === null) {
      const s = document.createElement('style'); s.dataset.pluginCss = TAG; s.textContent = CSS; document.head.appendChild(s)
    }
    const num = (v) => (typeof v === 'number' && isFinite(v) ? Math.round(v * 100) / 100 : null)
    const colorFor = (rem) => (rem === null ? '#9aa0a6' : rem > 50 ? '#2f9e63' : rem > 20 ? '#e0a029' : '#e5484d')
    const BLUE = '#3b82f6'
    const getJSON = async (u) => { const r = await fetch(u, { headers: { accept: 'application/json' } }); return r.json() }

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
      const roundrobin = !acc || acc.mode !== 'single'

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

        // 账号池
        h('div', { key: 'accts', className: 'wbx-card' }, [
          h('div', { key: 'h', className: 'wbx-row' }, [
            h('span', { key: 'l', className: 'wbx-lab' }, '账号池 · ' + (acc ? acc.accounts.length : 0) + ' 个'),
            h('div', { key: 'ops', style: { display: 'flex', alignItems: 'center', gap: 8 } }, [
              h('div', { key: 'seg', className: 'wbx-seg' }, [
                h('button', { key: 'rr', className: roundrobin ? 'on' : '', onClick: () => post({ mode: 'roundrobin' }) }, '轮询'),
                h('button', { key: 'sg', className: !roundrobin ? 'on' : '', onClick: () => post({ mode: 'single' }) }, '单账号'),
              ]),
              h('button', { key: 'add', className: 'wbx-btn', onClick: addAccountFlow }, '＋ 添加账号'),
            ]),
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
        h('div', { key: 'note', className: 'wbx-note' }, '添加账号：node lib/login.js 名称 · 轮询=按请求轮流用各账号；勾选 Magpie 接入后模型与监控数据都走本机 Magpie 网关'),
      ])
    }

    exports.inject = ['slots']
    exports.apply = function (ctx) {
      try {
      ctx.slots.inject('settings.section', () => ctx.slots.register({ name: 'settings.section', id: 'workbuddy-usage', order: 60, label: () => 'WorkBuddy 用量' }, UsagePanel))
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
