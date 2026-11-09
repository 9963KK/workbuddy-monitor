window.__ModuleLoader__.load({
  id: 'workbuddy-monitor',
  factory: (require) => {
    const module = { exports: {} }
    const exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })
    const React = require('react')
    const h = React.createElement
    let ReactDOM = null
    try { ReactDOM = require('react-dom') } catch { ReactDOM = null }

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
      '.wb-badges{position:relative;display:inline-flex;align-items:center;gap:2px;margin:0 6px;font-size:12px;line-height:1}',
      '.wb-badge{display:inline-flex;align-items:center;gap:5px;border:0.5px solid transparent;background:transparent;color:var(--dsw-alias-label-primary);border-radius:999px;padding:3px 8px 3px 5px;font-size:12px;cursor:pointer;white-space:nowrap;transition:background .14s ease,border-color .14s ease}',
      '.wb-badge:hover{border-color:var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1)}',
      '.wb-ring{flex:0 0 auto;display:block;overflow:visible}',
      '.wb-pct{font-weight:600;font-variant-numeric:tabular-nums}',
      '.wb-tag{color:var(--dsw-alias-label-tertiary);font-size:10px;font-weight:500}',
      '.wb-card{position:fixed;z-index:80;box-sizing:border-box;padding:12px;border-radius:12px;border:0.5px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);box-shadow:0 10px 30px rgba(0,0,0,.22);font-size:12px;display:flex;flex-direction:column;gap:9px}',
      '.wb-card-head{display:flex;align-items:center;justify-content:space-between;gap:8px}',
      '.wb-card-title{font-weight:600;font-size:13px;display:flex;align-items:center;gap:7px}',
      '.wb-close{border:0;background:transparent;color:var(--dsw-alias-label-tertiary);cursor:pointer;font-size:14px;line-height:1;padding:2px 4px;border-radius:6px}',
      '.wb-sec{display:flex;flex-direction:column;gap:6px}',
      '.wb-sec-h{display:flex;align-items:center;gap:6px;font-weight:600;font-size:12px}',
      '.wb-big{display:flex;align-items:baseline;gap:6px;flex-wrap:nowrap;min-width:0}',
      '.wb-big-num{font-size:17px;font-weight:700;font-variant-numeric:tabular-nums;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;white-space:nowrap}',
      '.wb-big-sub{color:var(--dsw-alias-label-tertiary);font-size:11px;white-space:nowrap}',
      '.wb-track{height:6px;border-radius:3px;background:var(--dsw-alias-border-l2);overflow:hidden}',
      '.wb-fill{height:100%;border-radius:3px;transition:width .4s ease}',
      '.wb-kv{display:flex;align-items:center;justify-content:space-between;gap:10px}',
      '.wb-k{color:var(--dsw-alias-label-tertiary);white-space:nowrap}',
      '.wb-v{color:var(--dsw-alias-label-primary);text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}',
      '.wb-div{border-top:0.5px solid var(--dsw-alias-border-l3);margin:2px 0}',
      '.wb-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;border-top:0.5px solid var(--dsw-alias-border-l3);padding-top:8px;margin-top:1px}',
      '.wb-btn{border:0.5px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);border-radius:7px;padding:4px 10px;font-size:12px;cursor:pointer}',
      '.wb-btn:hover:not(:disabled){border-color:var(--dsw-alias-brand-primary)}',
      '.wb-btn:disabled{opacity:.5;cursor:default}',
      '.wb-err{color:var(--dsw-alias-state-error-primary)}',
      '.wb-spark{display:block;width:100%;height:40px}',
      '.wb-empty{color:var(--dsw-alias-label-tertiary)}',
      '.wb-pop{position:fixed;z-index:2147483000;box-sizing:border-box;padding:10px 12px;border-radius:10px;border:0.5px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);box-shadow:0 8px 24px rgba(0,0,0,.20);font-size:12px;display:flex;flex-direction:column;gap:7px}',
      '.wb-pop::after{content:"";position:absolute;bottom:-5px;left:var(--wb-arrow-left,16px);width:9px;height:9px;background:var(--dsw-alias-bg-layer-2);border-right:0.5px solid var(--dsw-alias-border-l2);border-bottom:0.5px solid var(--dsw-alias-border-l2);transform:rotate(45deg)}',
      // —— 顺带把输入框里的「模型选择器」收成一个图标（隐藏冗长的「模型名 · 提供方」与推理档位；,
      //    保留内置图标与点击行为，hover 仍显示完整 title，点开仍是完整选择器）——,
      'button[aria-haspopup="menu"] [class*="triggerLabel"]{display:none!important}',
      'button[aria-haspopup="menu"] [class*="triggerEffort"]{display:none!important}',
      'button[aria-haspopup="menu"] svg[class*="triggerIcon"]{display:inline-block!important;vertical-align:middle}',
      'button[aria-haspopup="menu"] svg[class*="chevron"]{display:none!important}',
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


    // ── 徽标（原 dsh-workbuddy-credits 合并而来）──
    const WC_GREEN = '#2f9e63'
    const WC_BLUE = '#3b82f6'
    const ENDPOINT = '/api/workbuddy-credits'
    const POLL_MS = 20000
    function isNum(v) {
      return typeof v === 'number' && Number.isFinite(v)
    }

    function clampPercent(v) {
      if (!isNum(v)) return null
      return Math.max(0, Math.min(100, v))
    }

    function wcColorFor(remaining) {
      if (!isNum(remaining)) return '#9aa0a6'
      if (remaining > 50) return WC_GREEN
      if (remaining > 20) return '#e0a029'
      return '#e5484d'
    }

    function trimNum(v) {
      if (!isNum(v)) return '—'
      if (Math.abs(v) >= 100) return String(Math.round(v))
      if (Math.abs(v) >= 1) return String(Math.round(v * 100) / 100)
      return String(Math.round(v * 1000) / 1000)
    }

    /** 大数字（token 数量）：1.1M / 200M / 3.4K。 */
    function fmtBig(v) {
      if (!isNum(v)) return '—'
      const abs = Math.abs(v)
      if (abs >= 1e9) return (v / 1e9).toFixed(1).replace(/\.0$/, '') + 'B'
      if (abs >= 1e6) return (v / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'
      if (abs >= 1e3) return (v / 1e3).toFixed(1).replace(/\.0$/, '') + 'K'
      return String(Math.round(v))
    }

    function fmtDate(iso) {
      if (!iso || typeof iso !== 'string') return '—'
      const d = new Date(iso)
      if (Number.isNaN(d.getTime())) return '—'
      try {
        return d.toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
      } catch {
        return d.toISOString().slice(5, 16).replace('T', ' ')
      }
    }

    async function readCredits() {
      const response = await fetch(ENDPOINT, { method: 'GET', headers: { accept: 'application/json' } })
      if (!response.ok) throw new Error('积分接口 HTTP ' + response.status)
      return response.json()
    }

    /**
     * 读取输入框「模型选择器」上的当前模型 id（如 workbuddy/deepseek-v4.1-flash）。
     * 用于判断当前是否 WorkBuddy 系列模型——这两枚徽标只在 WorkBuddy 模型下显示。
     */
    function currentModelId() {
      try {
        const inTrigger = document.querySelector('button[aria-haspopup="menu"] [data-model-id]')
        if (inTrigger) return inTrigger.getAttribute('data-model-id') || ''
        const slot = document.querySelector('[data-slot="conversation.input.model.label"]')
        const owner = slot && slot.closest ? slot.closest('[data-model-id]') : null
        if (owner) return owner.getAttribute('data-model-id') || ''
        const any = document.querySelector('[data-model-id]')
        return any ? (any.getAttribute('data-model-id') || '') : ''
      } catch {
        return ''
      }
    }

    function isWorkbuddyModelId(id) {
      return /workbuddy/i.test(String(id || ''))
    }

    /**
     * 从 payload 里取出「积分总量」与「24h token 窗口」。
     * 新宿主直接给 data.credits / data.token；若拿到的还是旧宿主（只有 data.windows
     * 且把 token 误标成 credits），这里按窗口名再分一次类，保证改版不会因宿主未热更而变空。
     */
    function pickWindows(data) {
      let credits = data && data.credits ? data.credits : null
      let token = data && data.token ? data.token : null
      const wins = data && Array.isArray(data.windows) ? data.windows : []
      const isToken = (w) => /tokens?/i.test(String((w && w.name) || ''))
      if (!credits) {
        const c = wins.find((w) => /total\s*credits/i.test(String(w.name || ''))) ||
          wins.filter((w) => /credits?/i.test(String(w.name || '')) && !isToken(w)).sort((a, b) => (b.limit || 0) - (a.limit || 0))[0] ||
          null
        if (c) {
          credits = {
            name: c.name, amount: c.amount, limit: c.limit,
            remaining: isNum(c.limit) && isNum(c.amount) ? Math.max(0, c.limit - c.amount) : undefined,
            usedPercent: c.usedPercent, remainingPercent: c.remainingPercent,
            display: c.display, resetsAt: c.resetsAt,
          }
        }
      }
      if (!token) {
        const t = wins.find(isToken) || null
        if (t) {
          token = {
            name: t.name, amount: t.amount, limit: t.limit,
            remaining: isNum(t.limit) && isNum(t.amount) ? Math.max(0, t.limit - t.amount) : undefined,
            usedPercent: t.usedPercent, remainingPercent: t.remainingPercent,
            display: t.display, resetsAt: t.resetsAt,
          }
        }
      }
      return { credits, token }
    }

    /** 环形进度：ratio 为「剩余比例」0..1，弧长即剩余。 */
    function Ring(props) {
      const ratio = isNum(props.ratio) ? Math.max(0, Math.min(1, props.ratio)) : 0
      const R = 9
      const C = 2 * Math.PI * R
      const size = props.size || 16
      const stroke = props.stroke || 2.5
      return h('svg', {
        className: 'wb-ring',
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        'aria-hidden': 'true',
        style: { transform: 'rotate(-90deg)' },
      }, [
        h('circle', { key: 'b', cx: 12, cy: 12, r: R, fill: 'none', stroke: 'currentColor', strokeOpacity: 0.16, strokeWidth: stroke }),
        h('circle', {
          key: 'a',
          cx: 12, cy: 12, r: R, fill: 'none', stroke: props.color, strokeWidth: stroke,
          strokeLinecap: 'round',
          strokeDasharray: C,
          strokeDashoffset: C * (1 - ratio),
          style: { transition: 'stroke-dashoffset .26s ease' },
        }),
      ])
    }

    /** 每日消耗柱状图：峰值那天高亮。 */
    function DailyBars(props) {
      const rows = Array.isArray(props.rows) ? props.rows.filter((r) => r && isNum(r.used)) : []
      if (rows.length === 0) return null
      const W = 262
      const Hh = 52
      const pad = 2
      const gap = 3
      const n = rows.length
      const bw = Math.max(1, (W - pad * 2 - gap * (n - 1)) / n)
      const maxV = Math.max.apply(null, rows.map((r) => r.used).concat([0.0001]))
      return h('svg', { className: 'wb-spark', viewBox: '0 0 ' + W + ' ' + Hh, preserveAspectRatio: 'none', 'aria-hidden': 'true', style: { height: '52px' } },
        rows.map((r, i) => {
          const bh = Math.max(1, (r.used / maxV) * (Hh - pad * 2))
          const x = pad + i * (bw + gap)
          const y = Hh - pad - bh
          const isPeak = props.peakLabel === r.label
          return h('rect', {
            key: i,
            x: x.toFixed(1),
            y: y.toFixed(1),
            width: bw.toFixed(1),
            height: bh.toFixed(1),
            rx: 1.5,
            fill: isPeak ? props.peakColor : props.color,
            opacity: isPeak ? 0.95 : 0.4,
          })
        }))
    }


    function UsageBadge() {
      const [data, setData] = React.useState(null)
      const [failed, setFailed] = React.useState(false)
      const [busy, setBusy] = React.useState(false)
      const [hover, setHover] = React.useState(null)
      const [wbModel, setWbModel] = React.useState(null)
      const boxRef = React.useRef(null)
      const readRef = React.useRef(() => {})

      React.useEffect(() => {
        let alive = true
        let inFlight = false
        const load = async (manual) => {
          if (inFlight) return
          if (manual !== true && typeof document !== 'undefined' && document.visibilityState === 'hidden') return
          inFlight = true
          if (manual === true) setBusy(true)
          try {
            const value = await readCredits()
            if (alive) { setData(value); setFailed(false) }
          } catch (error) {
            if (alive) setFailed(true)
            if (manual === true) console.warn('[workbuddy-credits] 读取失败：', error && error.message ? error.message : error)
          } finally {
            inFlight = false
            if (alive && manual === true) setBusy(false)
          }
        }
        readRef.current = () => { void load(true) }
        void load(false)
        const timer = setInterval(() => { void load(false) }, POLL_MS)
        const onVisible = () => { if (document.visibilityState === 'visible') void load(false) }
        document.addEventListener('visibilitychange', onVisible)
        return () => {
          alive = false
          readRef.current = () => {}
          clearInterval(timer)
          document.removeEventListener('visibilitychange', onVisible)
        }
      }, [])

      React.useEffect(() => {
        const detect = () => { setWbModel(isWorkbuddyModelId(currentModelId())) }
        detect()
        const timer = setInterval(detect, 1200)
        return () => { clearInterval(timer) }
      }, [])

      const PANEL_W = 272
      const hoverCloseRef = React.useRef(0)
      React.useEffect(() => () => { clearTimeout(hoverCloseRef.current) }, [])
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
      const hideHoverSoon = () => {
        clearTimeout(hoverCloseRef.current)
        hoverCloseRef.current = setTimeout(() => setHover(null), 200)
      }

      const picked = data && data.available ? pickWindows(data) : { credits: null, token: null }
      const credits = picked.credits
      const token = picked.token

      const paidNoCap = !!(data && data.capApplies === false) // 付费档：官方已无该限流，不显示 24h
      const creditRem = credits ? clampPercent(credits.remainingPercent) : null
      const tokenRem = token ? clampPercent(token.remainingPercent) : null
      const creditColor = wcColorFor(creditRem)
      const tokenColor = isNum(tokenRem) ? (tokenRem > 50 ? WC_BLUE : wcColorFor(tokenRem)) : '#9aa0a6'

      // —— 徽标 ——
      const badges = []
      if (data && data.ok === false) {
        badges.push(h('button', { key: 'b', type: 'button', className: 'wb-badge', title: '读取失败：' + ((data.error && data.error.message) || '') },
          h(Ring, { ratio: 0, color: '#9aa0a6' }),
          h('span', { className: 'wb-pct' }, '不可用')))
      } else if (!data) {
        badges.push(h('button', { key: 'b', type: 'button', className: 'wb-badge', title: '正在读取 WorkBuddy 用量…' },
          h(Ring, { ratio: 0, color: '#9aa0a6' }),
          h('span', { className: 'wb-pct' }, '…')))
      } else if (!data.available) {
        badges.push(h('button', { key: 'b', type: 'button', className: 'wb-badge', title: 'Magpie 中未找到 WorkBuddy 配额' },
          h(Ring, { ratio: 0, color: '#9aa0a6' }),
          h('span', { className: 'wb-pct' }, '未配置')))
      } else {
        if (token && !paidNoCap) {
          const pct = isNum(tokenRem) ? Math.round(tokenRem) + '%' : '—'
          const cap = token.display || ((isNum(token.amount) ? fmtBig(token.amount) : '—') + ' / ' + (isNum(token.limit) ? fmtBig(token.limit) : '—'))
          const tip = 'WorkBuddy 24h 窗口（token）· 已用 ' + cap + ' · 剩余 ' + pct + ' · 重置 ' + fmtDate(token.resetsAt)
          badges.push(h('button', {
            key: 't', type: 'button', className: 'wb-badge', 'aria-label': tip,
            onMouseEnter: (e) => showHover('token', e.currentTarget),
            onMouseLeave: hideHoverSoon,
            onFocus: (e) => showHover('token', e.currentTarget),
            onBlur: hideHoverSoon,
          },
            h(Ring, { ratio: isNum(tokenRem) ? tokenRem / 100 : 0, color: tokenColor }),
            h('span', { className: 'wb-pct' }, pct)))
        }
        if (credits) {
          const pct = isNum(creditRem) ? Math.round(creditRem) + '%' : '—'
          const tip = 'WorkBuddy 积分总量 · 已用 ' + (credits.display || '—') +
            ' · 剩余 ' + (isNum(credits.remaining) ? trimNum(credits.remaining) : '—') +
            ' 积分（' + pct + '）· 重置 ' + fmtDate(credits.resetsAt)
          badges.push(h('button', {
            key: 'c', type: 'button', className: 'wb-badge', 'aria-label': tip,
            onMouseEnter: (e) => showHover('credits', e.currentTarget),
            onMouseLeave: hideHoverSoon,
            onFocus: (e) => showHover('credits', e.currentTarget),
            onBlur: hideHoverSoon,
          },
            h(Ring, { ratio: isNum(creditRem) ? creditRem / 100 : 0, color: creditColor }),
            h('span', { className: 'wb-pct' }, pct)))
        }
        if (badges.length === 0) {
          badges.push(h('button', { key: 'b', type: 'button', className: 'wb-badge', title: 'WorkBuddy' },
            h(Ring, { ratio: 0, color: '#9aa0a6' }),
            h('span', { className: 'wb-pct' }, '—')))
        }
      }

      // —— 悬浮详情：鼠标移到徽标上，在徽标上方浮出对应数据（不占用固定面板）——
      const creditSection = credits
        ? h('div', { key: 'c-sec', className: 'wb-sec' }, [
          h('div', { key: 'big', className: 'wb-big' }, [
            h('span', { key: 'n', className: 'wb-big-num' }, isNum(credits.remaining) ? trimNum(credits.remaining) : '—'),
            h('span', { key: 's', className: 'wb-big-sub' }, '剩余积分'),
            h('span', { key: 'p', className: 'wb-big-sub', style: { marginLeft: 'auto', color: creditColor } }, isNum(creditRem) ? Math.round(creditRem * 100) / 100 + '%' : '—'),
          ]),
          h('div', { key: 'track', className: 'wb-track' },
            h('div', { key: 'fill', className: 'wb-fill', style: { width: (isNum(creditRem) ? creditRem : 0) + '%', background: creditColor } })),
          h('div', { key: 'kv-used', className: 'wb-kv' }, [
            h('span', { key: 'k', className: 'wb-k' }, '已用 / 额度'),
            h('span', { key: 'v', className: 'wb-v' }, credits.display || ((isNum(credits.amount) ? trimNum(credits.amount) : '—') + ' / ' + (isNum(credits.limit) ? trimNum(credits.limit) : '—'))),
          ]),
          credits.resetsAt ? h('div', { key: 'kv-reset', className: 'wb-kv' }, [
            h('span', { key: 'k', className: 'wb-k' }, '重置'),
            h('span', { key: 'v', className: 'wb-v' }, fmtDate(credits.resetsAt)),
          ]) : null,
          (function () {
            const wins = Array.isArray(data.creditWindows) ? data.creditWindows : []
            if (wins.length <= 1) return null
            return h(React.Fragment, { key: 'wins' }, wins.map((w, i) => h('div', { key: 'w' + i, className: 'wb-kv' }, [
              h('span', { key: 'k', className: 'wb-k' }, w.name || 'Credits'),
              h('span', { key: 'v', className: 'wb-v' }, w.display || ((isNum(w.amount) ? trimNum(w.amount) : '—') + ' / ' + (isNum(w.limit) ? trimNum(w.limit) : '—'))),
            ])))
          })(),
          (function () {
            const todayVal = data.todayUsed && isNum(data.todayUsed.used) ? trimNum(data.todayUsed.used) : null
            return h('div', { key: 'kv-today', className: 'wb-kv' }, [
              h('span', { key: 'k', className: 'wb-k' }, '今日已用'),
              h('span', { key: 'v', className: 'wb-v' }, todayVal !== null ? todayVal + ' 积分' : '—'),
            ])
          })(),
        ])
        : null

      const tokenSection = (token && !paidNoCap)
        ? h('div', { key: 't-sec', className: 'wb-sec' }, [
          h('div', { key: 'big', className: 'wb-big' }, [
            h('span', { key: 'n', className: 'wb-big-num' }, token.display || ((isNum(token.amount) ? fmtBig(token.amount) : '—') + ' / ' + (isNum(token.limit) ? fmtBig(token.limit) : '—'))),
            h('span', { key: 'p', className: 'wb-big-sub', style: { marginLeft: 'auto', color: tokenColor } }, '剩余 ' + (isNum(tokenRem) ? Math.round(tokenRem * 100) / 100 + '%' : '—')),
          ]),
          h('div', { key: 'track', className: 'wb-track' },
            h('div', { key: 'fill', className: 'wb-fill', style: { width: (isNum(tokenRem) ? tokenRem : 0) + '%', background: tokenColor } })),
          h('div', { key: 'kv-used', className: 'wb-kv' }, [
            h('span', { key: 'k', className: 'wb-k' }, '已用比例'),
            h('span', { key: 'v', className: 'wb-v' }, isNum(token.usedPercent) ? Math.round(token.usedPercent * 100) / 100 + '%' : '—'),
          ]),
          token.resetsAt ? h('div', { key: 'kv-reset', className: 'wb-kv' }, [
            h('span', { key: 'k', className: 'wb-k' }, '窗口重置'),
            h('span', { key: 'v', className: 'wb-v' }, fmtDate(token.resetsAt)),
          ]) : null,
        ])
        : null

      const hourlySection = (data && data.hourlyUsage && Array.isArray(data.hourlyUsage.hours) && data.hourlyUsage.hours.length > 0)
        ? (function () {
          const hu = data.hourlyUsage
          const peak = hu.peak
          const last = hu.hours[hu.hours.length - 1]
          return h('div', { key: 'daily-wrap', className: 'wb-sec' }, [
            h('div', { key: 'h', className: 'wb-k', style: { display: 'flex', justifyContent: 'space-between', gap: '8px' } }, [
              h('span', { key: 't' }, '近 ' + hu.hours.length + ' 小时积分消耗'),
              peak ? h('span', { key: 'p', style: { color: creditColor } }, '峰值 ' + peak.label + ' · ' + trimNum(peak.used)) : null,
            ]),
            h(DailyBars, { key: 'b', rows: hu.hours, peakLabel: peak && peak.label, color: creditColor, peakColor: creditColor }),
            h('div', { key: 'axis', className: 'wb-k', style: { display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginTop: '1px', opacity: 0.7 } }, [
              h('span', { key: 'a' }, hu.hours[0].label),
              h('span', { key: 'z' }, last ? last.label : ''),
            ]),
          ])
        })()
        : null

      const popHead = (title, color) => h('div', { key: 'h', className: 'wb-card-title' }, [
        h('span', { key: 'd', className: 'wb-dot', style: { background: color } }),
        h('span', { key: 'n' }, title),
      ])
      const popFoot = h('div', { key: 'foot', className: 'wb-foot' }, [
        h('span', { key: 't', className: 'wb-k' }, data && (data.readAt || data.fetchedAt) ? '更新 ' + fmtDate(data.readAt || data.fetchedAt) : ''),
        h('button', { key: 'r', type: 'button', className: 'wb-btn', disabled: busy, onClick: () => readRef.current() }, busy ? '刷新中…' : '刷新'),
      ])

      let popover = null
      if (hover && data && data.available) {
        const section = (paidNoCap && hover.section === 'token') ? 'credits' : hover.section
        const body = section === 'credits'
          ? [popHead('WorkBuddy 积分', creditColor), creditSection, hourlySection, popFoot]
          : [popHead('WorkBuddy 24h 窗口 · token', tokenColor), tokenSection, popFoot]
        const pop = h('div', {
          className: 'wb-pop',
          style: { left: hover.left + 'px', bottom: hover.bottom + 'px', width: PANEL_W + 'px', '--wb-arrow-left': (hover.arrow || 16) + 'px' },
          role: 'tooltip',
          onMouseEnter: keepHover,
          onMouseLeave: hideHoverSoon,
        }, body.filter(Boolean))
        popover = (typeof document !== 'undefined' && ReactDOM && typeof ReactDOM.createPortal === 'function')
          ? ReactDOM.createPortal(pop, document.body)
          : pop
      }

      // 只在当前模型属于 WorkBuddy 系列时显示（未确定前也先隐藏，避免闪现）。
      if (wbModel !== true) return null

      return h('div', { className: 'wb-badges', ref: boxRef }, [].concat(badges).concat([popover]))
    }

    // 在侧边栏底部「头像 + 昵称」那一行（AccountMenu 的 trigger 按钮）最右边追加一个
    // 官网 API 余额数字（DeepSeek 平台账户余额，不是 WorkBuddy 积分）。该行由宿主渲染、
    // 没有可注入的子槽位，所以这里用 DOM 附加 + 定时校准的方式，让数字常驻在昵称右侧、
    // 不被 React 重渲染冲掉；侧边栏收起（仅图标）时自动隐藏。
    const ACCOUNT_BALANCE_ATTR = 'data-wb-account-balance'
    let accountBalance = null // { text, hint } | null
    let accountBalanceTimer = null

    function addCommas(fixed) {
      const parts = String(fixed).split('.')
      return Number(parts[0]).toLocaleString('en-US') + (parts.length > 1 ? '.' + parts[1] : '')
    }

    function fmtMoney(value, symbol) {
      if (!isNum(value)) return null
      if (value === 0) return symbol + '0.00'
      const abs = Math.abs(value)
      const body = abs < 0.01 ? '0.01' : addCommas(abs.toFixed(2))
      return (value < 0 ? '-' : '') + symbol + body
    }

    /** 汇总官网（DeepSeek 平台）API 余额：充值余额 + 赠送余额，按币种分组。 */
    function computeAccountBalance(payload) {
      if (!payload || payload.status !== 'ready') return null
      const wallets = Array.isArray(payload.value) ? payload.value : []
      const bonus = Array.isArray(payload.bonusWallets) ? payload.bonusWallets : []
      const sum = {}
      const add = (list) => list.forEach((w) => {
        if (!w) return
        const n = Number(w.balance)
        if (!Number.isFinite(n)) return
        const cur = w.currency || 'CNY'
        sum[cur] = (sum[cur] || 0) + n
      })
      add(wallets)
      add(bonus)
      const currencies = Object.keys(sum)
      if (currencies.length === 0) return null
      const text = currencies
        .map((cur) => fmtMoney(sum[cur], cur === 'CNY' ? '¥' : '$'))
        .filter(Boolean)
        .join(' + ')
      if (!text) return null
      const bonusTotal = bonus.reduce((a, w) => a + (Number(w && w.balance) || 0), 0)
      let hint = '官网 API 余额 · ' + text
      if (bonusTotal > 0) hint += '（含赠送余额）'
      return { text: text, hint: hint }
    }

    /** 读取官网 API 余额：POST /api/account/getBalance，走同源 Cookie 鉴权。 */
    async function readAccountBalance() {
      const body = {
        type: 'client-request',
        rpcId: 'wb-balance-' + Date.now(),
        method: 'account/getBalance',
        payload: {
          args: {
            client: {
              version: '0.0.0',
              locale: (typeof navigator !== 'undefined' && navigator.language) || 'zh',
              timezoneOffsetSeconds: -(new Date()).getTimezoneOffset() * 60,
            },
          },
        },
      }
      const response = await fetch('/api/account/getBalance', {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify(body),
      })
      if (!response.ok) throw new Error('余额接口 HTTP ' + response.status)
      const json = await response.json()
      if (!json || !json.result || json.result.ok !== true) {
        const msg = json && json.result && json.result.error && json.result.error.message
        throw new Error(msg || '余额读取失败')
      }
      return json.result.value
    }

    function accountTrigger() {
      try {
        return document.querySelector('button[aria-haspopup="menu"][data-signed-out]')
      } catch {
        return null
      }
    }

    function syncAccountBalance() {
      if (typeof document === 'undefined') return
      const trigger = accountTrigger()
      if (!trigger) return
      const collapsed = trigger.getAttribute('data-collapsed') === 'true'
      const text = accountBalance && accountBalance.text ? accountBalance.text : ''
      let el = trigger.querySelector('[' + ACCOUNT_BALANCE_ATTR + ']')
      if (collapsed || !text) {
        if (el) el.remove()
        return
      }
      if (!el) {
        el = document.createElement('span')
        el.setAttribute(ACCOUNT_BALANCE_ATTR, '1')
        el.style.cssText = 'margin-left:auto;flex:0 0 auto;padding-left:8px;font-size:12px;font-weight:600;line-height:1;color:var(--dsw-alias-label-secondary,currentColor);font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:48%'
        trigger.appendChild(el)
      } else if (trigger.lastElementChild !== el) {
        trigger.appendChild(el)
      }
      const t = accountBalance && accountBalance.text ? accountBalance.text : ''
      if (el.textContent !== t) el.textContent = t
      el.title = accountBalance && accountBalance.hint ? accountBalance.hint : ''
    }

    function startAccountBalance() {
      if (typeof document === 'undefined' || accountBalanceTimer !== null) return
      if (typeof window !== 'undefined' && window.__wbAccountBalanceStarted) return
      if (typeof window !== 'undefined') window.__wbAccountBalanceStarted = true
      const refresh = async () => {
        try {
          const d = await readAccountBalance()
          accountBalance = computeAccountBalance(d)
        } catch {
          // 读取失败时保留上次数字（若有），不闪成空。
        }
        syncAccountBalance()
      }
      void refresh()
      accountBalanceTimer = setInterval(() => { void refresh() }, POLL_MS)
      // 更轻量的位置校准：只重排 DOM，不重复请求，防止 React 重渲染冲掉节点。
      setInterval(syncAccountBalance, 1200)
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
