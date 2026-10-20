import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { IconArrow, IconCheck, IconX } from '../icons/Icons'
import { Reveal } from './Primitives'

/* ---- Flow row: labelled nodes joined by arrows (Perceive → Reason → Act) ---- */
export function FlowRow({
  steps, accent = 'var(--blue)',
}: { steps: { title: string; sub?: string }[]; accent?: string }) {
  return (
    <div className="flowrow" style={{ ['--accent' as string]: accent }}>
      {steps.map((s, i) => (
        <div className="flowrow-item" key={i}>
          <Reveal delay={i * 90} className="flownode">
            <div className="flownode-title">{s.title}</div>
            {s.sub && <div className="flownode-sub">{s.sub}</div>}
          </Reveal>
          {i < steps.length - 1 && <span className="flowrow-arrow"><IconArrow width={20} height={20} /></span>}
        </div>
      ))}
    </div>
  )
}

/* ---- Decision tree: a chain of yes/no questions ---- */
export type TreeStep = { q: string; branches: { label: 'YES' | 'NO' | string; to: string; tone?: 'stop' | 'go' }[] }
export function DecisionTree({ steps, accent = 'var(--c-design)' }: { steps: TreeStep[]; accent?: string }) {
  return (
    <div className="dtree" style={{ ['--accent' as string]: accent }}>
      {steps.map((s, i) => (
        <Reveal key={i} delay={i * 70} className="dtree-step">
          <div className="dtree-q"><span className="dtree-qmark">?</span><span>{s.q}</span></div>
          <div className="dtree-branches">
            {s.branches.map((b, j) => (
              <div key={j} className={`dtree-branch ${b.tone === 'stop' ? 'is-stop' : 'is-go'}`}>
                <span className="dtree-label">{b.label}</span>
                <IconArrow width={15} height={15} />
                <span className="dtree-to">{b.to}</span>
              </div>
            ))}
          </div>
        </Reveal>
      ))}
    </div>
  )
}

/* ---- Visual decision flow: a node graph. Numbered step nodes sit on a
   vertical "No" spine; each question card branches to its outcomes through
   measured SVG bezier connectors that draw in on scroll. A data packet
   travels the spine *under* the step nodes and lights each one as it
   passes. Hover or tap any card to trace its route from the top. ---- */
type Box = { l: number; t: number; r: number; b: number; cx: number; cy: number }
type Geo = {
  w: number; h: number
  spine: string
  spineSegs: string[]
  links: string[]
  branches: { d: string; i: number; j: number; ex: number; ey: number }[]
  badgeAt: number[]
}
type Hot = { i: number; j: number | null } | null

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function DecisionFlow({ steps }: { steps: TreeStep[]; accent?: string }) {
  const model = steps.map((s) => {
    const cont = s.branches.find((b) => /^continue\b/i.test(String(b.to)))
    const note = cont ? String(cont.to).replace(/^continue\s*[—–-]?\s*/i, '') : ''
    return { q: s.q, cont, note, terms: s.branches.filter((b) => b !== cont) }
  })
  const modelRef = useRef(model)
  modelRef.current = model

  const wrap = useRef<HTMLDivElement>(null)
  const badges = useRef<(HTMLSpanElement | null)[]>([])
  const qs = useRef<(HTMLDivElement | null)[]>([])
  const outs = useRef<Record<string, HTMLDivElement | null>>({})
  const spineEl = useRef<SVGPathElement>(null)
  const trailEl = useRef<SVGPathElement>(null)
  const packetEl = useRef<SVGCircleElement>(null)
  const haloEl = useRef<SVGCircleElement>(null)

  const [geo, setGeo] = useState<Geo | null>(null)
  const [seen, setSeen] = useState(false)
  const [hot, setHot] = useState<Hot>(null)

  // Layout positions via offset* (ignores the entrance transforms).
  const measure = useCallback(() => {
    const w = wrap.current
    if (!w) return
    const box = (el: HTMLElement): Box => {
      let l = 0, t = 0
      let e: HTMLElement | null = el
      while (e && e !== w) { l += e.offsetLeft; t += e.offsetTop; e = e.offsetParent as HTMLElement | null }
      const W = el.offsetWidth, H = el.offsetHeight
      return { l, t, r: l + W, b: t + H, cx: l + W / 2, cy: t + H / 2 }
    }
    const m = modelRef.current
    const B = badges.current.map((b) => (b ? box(b) : null))
    const Q = qs.current.map((q) => (q ? box(q) : null))
    const spineSegs: string[] = []
    const links: string[] = []
    const branches: Geo['branches'] = []
    const badgeAt: number[] = []
    let spine = ''
    let len = 0
    let chain = true
    m.forEach((step, i) => {
      const b = B[i], q = Q[i]
      if (!b || !q) return
      if (i === 0) { spine = `M ${b.cx} ${b.cy}`; badgeAt[0] = 0 }
      links.push(`M ${b.r} ${b.cy} L ${q.l} ${b.cy}`)
      const n = B[i + 1]
      if (step.cont && n) {
        spineSegs.push(`M ${b.cx} ${b.b} L ${n.cx} ${n.t}`)
        if (chain) { spine += ` L ${n.cx} ${n.cy}`; len += Math.hypot(n.cx - b.cx, n.cy - b.cy); badgeAt[i + 1] = len }
      } else {
        spineSegs.push('')
        chain = false
      }
      step.terms.forEach((_, j) => {
        const el = outs.current[`${i}-${j}`]
        if (!el) return
        const o = box(el)
        let d: string, ex: number, ey: number
        if (o.l >= q.r - 2) {
          const sx = q.r, sy = q.cy
          ex = o.l; ey = o.cy
          const dx = Math.max(22, (ex - sx) * 0.55)
          d = `M ${sx} ${sy} C ${sx + dx} ${sy}, ${ex - dx} ${ey}, ${ex} ${ey}`
        } else {
          const sx = q.l + 24, sy = q.b
          ex = o.l; ey = o.cy
          const rr = Math.min(10, Math.max(0, ex - sx - 2))
          d = `M ${sx} ${sy} L ${sx} ${ey - rr} Q ${sx} ${ey} ${sx + rr} ${ey} L ${ex} ${ey}`
        }
        branches.push({ d, i, j, ex, ey })
      })
    })
    setGeo({ w: w.offsetWidth, h: w.offsetHeight, spine, spineSegs, links, branches, badgeAt })
  }, [])

  useLayoutEffect(() => {
    measure()
    const w = wrap.current
    if (!w) return
    const ro = new ResizeObserver(() => measure())
    ro.observe(w)
    window.addEventListener('resize', measure)
    document.fonts?.ready.then(measure).catch(() => {})
    return () => { ro.disconnect(); window.removeEventListener('resize', measure) }
  }, [measure])

  useEffect(() => {
    const w = wrap.current
    if (!w) return
    const io = new IntersectionObserver(
      (e) => e.forEach((x) => { if (x.isIntersecting) { setSeen(true); io.disconnect() } }),
      { threshold: 0, rootMargin: '0px 0px -100px 0px' },
    )
    io.observe(w)
    return () => io.disconnect()
  }, [])

  // The data packet: rides the spine under the nodes, lighting each in turn.
  useEffect(() => {
    if (!seen || !geo || prefersReducedMotion()) return
    const p = spineEl.current
    if (!p) return
    const L = p.getTotalLength()
    if (L < 20) return
    const speed = 110            // px / s
    const travel = (L / speed) * 1000
    const rest = 900             // pause at the bottom before the next run
    const period = travel + rest
    const trailLen = 46
    const start = performance.now() + 1100 // let the connectors draw first
    let raf = 0
    const tick = (now: number) => {
      const t = now - start
      if (t >= 0) {
        const tt = t % period
        const d = Math.min(L, (tt / travel) * L)
        const pt = p.getPointAtLength(d)
        const fade = tt > travel ? Math.max(0, 1 - (tt - travel) / 300) : Math.min(1, d / 16)
        packetEl.current?.setAttribute('cx', String(pt.x))
        packetEl.current?.setAttribute('cy', String(pt.y))
        haloEl.current?.setAttribute('cx', String(pt.x))
        haloEl.current?.setAttribute('cy', String(pt.y))
        packetEl.current?.setAttribute('opacity', String(fade))
        haloEl.current?.setAttribute('opacity', String(0.16 * fade))
        if (trailEl.current) {
          trailEl.current.style.strokeDasharray = `${Math.min(trailLen, d)} ${L + trailLen}`
          trailEl.current.style.strokeDashoffset = String(-Math.max(0, d - trailLen))
          trailEl.current.style.opacity = String(0.45 * fade)
        }
        geo.badgeAt.forEach((a, i) => {
          if (a === undefined) return
          badges.current[i]?.classList.toggle('is-lit', tt <= travel + 120 && Math.abs(d - a) < 24)
        })
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); badges.current.forEach((b) => b?.classList.remove('is-lit')) }
  }, [seen, geo])

  const onRoute = (i: number) => !!hot && i <= hot.i
  const segLit = (k: number) => !!hot && k < hot.i
  const brLit = (i: number, j: number) => !!hot && hot.i === i && (hot.j === null || hot.j === j)
  const toggle = (h: NonNullable<Hot>) =>
    setHot((cur) => (cur && cur.i === h.i && cur.j === h.j ? null : h))

  return (
    <div
      ref={wrap}
      className={`dfl ${seen ? 'is-seen' : ''} ${hot ? 'has-hot' : ''}`}
      onMouseLeave={() => setHot(null)}
    >
      {geo && (
        <svg className="dfl-svg" width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`} aria-hidden>
          {geo.spineSegs.map((d, k) => d && (
            <g key={`s${k}`}>
              <path d={d} className="dfl-base" />
              <path d={d} pathLength={1} className={`dfl-draw ${segLit(k) ? 'lit' : ''}`} style={{ ['--d' as string]: `${k * 140 + 150}ms` }} />
            </g>
          ))}
          {geo.links.map((d, i) => (
            <path key={`l${i}`} d={d} pathLength={1} className={`dfl-draw ${onRoute(i) ? 'lit' : ''}`} style={{ ['--d' as string]: `${i * 140}ms` }} />
          ))}
          {geo.branches.map((b) => (
            <g key={`b${b.i}-${b.j}`}>
              <path d={b.d} className="dfl-base" />
              <path d={b.d} pathLength={1} className={`dfl-draw ${brLit(b.i, b.j) ? 'lit' : ''}`} style={{ ['--d' as string]: `${b.i * 140 + 220}ms` }} />
              <circle cx={b.ex} cy={b.ey} r={4} className={`dfl-end ${brLit(b.i, b.j) ? 'lit' : ''}`} />
            </g>
          ))}
          <path ref={spineEl} d={geo.spine} fill="none" stroke="none" />
          <path ref={trailEl} d={geo.spine} className="dfl-trail" style={{ opacity: 0 }} />
          <circle ref={haloEl} r={11} className="dfl-halo" opacity={0} />
          <circle ref={packetEl} r={4.5} className="dfl-packet" opacity={0} />
        </svg>
      )}

      {model.map((m, i) => (
        <div className="dfl-step" key={i} style={{ ['--i' as string]: String(i) }}>
          <span ref={(el) => { badges.current[i] = el }} className={`dfl-badge ${onRoute(i) ? 'on' : ''}`}>
            {String(i + 1).padStart(2, '0')}
          </span>
          <div
            ref={(el) => { qs.current[i] = el }}
            className={`dfl-q ${onRoute(i) ? 'on' : ''}`}
            onMouseEnter={() => setHot({ i, j: null })}
            onClick={() => toggle({ i, j: null })}
          >
            {m.q}
          </div>
          <div className="dfl-outs">
            {m.terms.map((t, j) => (
              <div
                key={j}
                ref={(el) => { outs.current[`${i}-${j}`] = el }}
                className={`dfl-out ${t.tone === 'go' ? 'go' : 'stop'} ${brLit(i, j) ? 'lit' : ''}`}
                tabIndex={0}
                onMouseEnter={() => setHot({ i, j })}
                onFocus={() => setHot({ i, j })}
                onBlur={() => setHot(null)}
                onClick={() => toggle({ i, j })}
              >
                <span className="dfl-out-tag">{t.label}</span>
                <span>{t.to}</span>
              </div>
            ))}
          </div>
          {m.cont && i < model.length - 1 && (
            <span className="dfl-cont">
              <span className="dfl-cont-tag">{m.cont.label}</span>
              {m.note && <span className="dfl-cont-note">{m.note}</span>}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

/* ---- Architecture diagram: supervisor / specialists etc. ---- */
export function ArchNode({
  title, sub, tone = 'default', wide = false,
}: { title: string; sub?: string; tone?: 'primary' | 'default' | 'user'; wide?: boolean }) {
  return (
    <div className={`archnode archnode-${tone} ${wide ? 'wide' : ''}`}>
      <div className="archnode-title">{title}</div>
      {sub && <div className="archnode-sub">{sub}</div>}
    </div>
  )
}
export function ArchStack({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className="archstack">
      {label && <div className="archstack-label">{label}</div>}
      {children}
    </div>
  )
}
export function DownArrow({ label }: { label?: string }) {
  return (
    <div className="downarrow">
      <svg width="18" height="34" viewBox="0 0 18 34" fill="none"><path d="M9 0v27M2 21l7 8 7-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      {label && <span>{label}</span>}
    </div>
  )
}

/* ---- Spectrum bar (Agentic AI Spectrum) ---- */
export function Spectrum({ items }: { items: { name: string; sub: string }[] }) {
  return (
    <div className="spectrum">
      <div className="spectrum-track" />
      <div className="spectrum-items">
        {items.map((it, i) => (
          <Reveal key={i} delay={i * 80} className="spectrum-item">
            <div className="spectrum-dot" style={{ ['--i' as string]: String(i) }} />
            <div className="spectrum-name">{it.name}</div>
            <div className="spectrum-sub">{it.sub}</div>
          </Reveal>
        ))}
      </div>
      <div className="spectrum-legend"><span>Simpler — start here</span><span>More sophisticated</span></div>
    </div>
  )
}

/* ---- Yes/No verdict inline ---- */
export function Verdict({ yes, children }: { yes?: boolean; children: ReactNode }) {
  return (
    <span className={`verdict ${yes ? 'v-yes' : 'v-no'}`}>
      {yes ? <IconCheck width={14} height={14} /> : <IconX width={14} height={14} />}
      {children}
    </span>
  )
}

/* ---- Hook timeline: one agent turn, left to right. Gates mark the hooks
   where plug-ins and controls run; a packet walks the turn and each gate
   lights as it passes. ---- */
export type HookItem =
  | { kind: 'stage'; title: string; sub?: string }
  | { kind: 'gate'; scope: string; hook: string; who: 'both' | 'control' }
export function HookTimeline({ items }: { items: HookItem[] }) {
  const n = items.length
  const dur = 7 // seconds per pass
  return (
    <div className="hk" style={{ ['--hk-dur' as string]: `${dur}s` }} role="list" aria-label="Where plug-ins and controls run during one agent turn">
      <div className="hk-track" aria-hidden><span className="hk-packet" /></div>
      {items.map((it, i) => {
        const delay = `${((i + 0.5) / n) * dur}s`
        return it.kind === 'stage' ? (
          <div key={i} className="hk-item hk-stage" role="listitem">
            <span className="hk-dot" style={{ animationDelay: delay }} />
            <div className="hk-title">{it.title}</div>
            {it.sub && <div className="hk-sub">{it.sub}</div>}
          </div>
        ) : (
          <div key={i} className={`hk-item hk-gate ${it.who}`} role="listitem">
            <span className="hk-diamond" style={{ animationDelay: delay }} />
            <div className="hk-scope">{it.scope}</div>
            <div className="hk-hook">{it.hook}</div>
            <div className="hk-who">{it.who === 'both' ? 'Plug-in · Control' : 'Control'}</div>
          </div>
        )
      })}
    </div>
  )
}
