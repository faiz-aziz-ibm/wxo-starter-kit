import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { phases } from '../data/phases'

/* Animated circular build lifecycle. Five stages sit on a ring whose arcs
   draw in on scroll. A pulse with a comet tail orbits the ring, passing
   *under* each node; a node lights up and glows as the pulse goes through
   it, then fades as the pulse continues. */
export function LifecycleRing() {
  const ref = useRef<SVGSVGElement>(null)
  const [active, setActive] = useState(false)
  const [hover, setHover] = useState<number | null>(null)
  const hoverRef = useRef<number | null>(null)
  hoverRef.current = hover

  const packet = useRef<SVGCircleElement>(null)
  const halo = useRef<SVGCircleElement>(null)
  const tails = useRef<(SVGPathElement | null)[]>([])
  const glowRing = useRef<(SVGCircleElement | null)[]>([])
  const fillDot = useRef<(SVGCircleElement | null)[]>([])
  const numBlue = useRef<(SVGTextElement | null)[]>([])
  const numWhite = useRef<(SVGTextElement | null)[]>([])
  const labBlue = useRef<(SVGTextElement | null)[]>([])
  const labWhite = useRef<(SVGTextElement | null)[]>([])

  const stages = phases.filter((p) => p.lifecycle)
  const cx = 200, cy = 200, r = 150
  const n = stages.length
  const gap = 0.12
  const seg = (Math.PI * 2) / n
  const nodeR = 24

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (e) => e.forEach((x) => { if (x.isIntersecting) { setActive(true); io.disconnect() } }),
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const nodePos = (i: number) => {
    const a = -Math.PI / 2 + i * seg
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), a }
  }

  const arc = (a0: number, a1: number) => {
    const x1 = cx + r * Math.cos(a0), y1 = cy + r * Math.sin(a0)
    const x2 = cx + r * Math.cos(a1), y2 = cy + r * Math.sin(a1)
    return `M ${x1} ${y1} A ${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x2} ${y2}`
  }
  const segPath = (i: number) => {
    const s = -Math.PI / 2 + i * seg + gap / 2
    return arc(s, s + seg - gap)
  }
  const segLen = seg * r

  // Orbit loop — direct DOM writes, no React re-render per frame.
  useEffect(() => {
    if (!active) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const period = 9000
    const tailSpans = [0.62, 0.4, 0.2]
    const tailOps = [0.12, 0.22, 0.42]
    const reach = 0.3 // radians either side of a node where it glows
    const start = performance.now() + 1400 // after the arcs draw
    let raf = 0
    const tick = (now: number) => {
      const t = now - start
      if (t >= 0) {
        const a = -Math.PI / 2 + ((t % period) / period) * Math.PI * 2
        const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a)
        packet.current?.setAttribute('cx', String(x))
        packet.current?.setAttribute('cy', String(y))
        halo.current?.setAttribute('cx', String(x))
        halo.current?.setAttribute('cy', String(y))
        packet.current?.setAttribute('opacity', '1')
        halo.current?.setAttribute('opacity', '0.18')
        tailSpans.forEach((span, k) => {
          const p = tails.current[k]
          if (!p) return
          p.setAttribute('d', arc(a - span, a))
          p.setAttribute('opacity', String(tailOps[k]))
        })
        for (let i = 0; i < n; i++) {
          const na = -Math.PI / 2 + i * seg
          let d = Math.abs(((a - na + Math.PI * 3) % (Math.PI * 2)) - Math.PI)
          d = Math.min(d, Math.PI * 2 - d)
          const raw = Math.max(0, 1 - d / reach)
          const g = hoverRef.current === i ? 1 : raw * raw * (3 - 2 * raw) // smoothstep
          glowRing.current[i]?.setAttribute('r', String(nodeR + 4 + g * 12))
          glowRing.current[i]?.setAttribute('opacity', String(g * 0.28))
          fillDot.current[i]?.setAttribute('opacity', String(g))
          numBlue.current[i]?.setAttribute('opacity', String(1 - g))
          labBlue.current[i]?.setAttribute('opacity', String(1 - g))
          numWhite.current[i]?.setAttribute('opacity', String(g))
          labWhite.current[i]?.setAttribute('opacity', String(g))
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, n, seg])

  return (
    <div className="ring-wrap">
      <svg ref={ref} className="ring-svg" viewBox="0 0 400 400" role="img" aria-label="watsonx Orchestrate build lifecycle: Design, Build, Test, Deploy, Monitor">
        <defs>
          <filter id="ringGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--blue-50)" strokeWidth="8" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--line)" strokeWidth="1" strokeDasharray="2 6" opacity="0.9" />

        {/* arcs draw in */}
        {stages.map((s, i) => (
          <path
            key={s.slug}
            className="ring-seg"
            d={segPath(i)}
            fill="none"
            stroke={hover === i ? 'var(--blue)' : 'var(--blue-200)'}
            strokeWidth={hover === i ? 5 : 3}
            strokeLinecap="round"
            style={{
              strokeDasharray: segLen,
              strokeDashoffset: active ? 0 : segLen,
              opacity: hover === null || hover === i ? 1 : 0.45,
              transitionDelay: `${i * 220}ms`,
            }}
          />
        ))}

        {/* comet tail + pulse — drawn BEFORE nodes so it passes under them */}
        {[0, 1, 2].map((k) => (
          <path key={k} ref={(el) => { tails.current[k] = el }} fill="none" stroke="var(--blue)" strokeWidth="5" strokeLinecap="round" opacity="0" />
        ))}
        <circle ref={halo} r="13" fill="var(--blue)" opacity="0" filter="url(#ringGlow)" />
        <circle ref={packet} r="5.5" fill="var(--blue)" stroke="#fff" strokeWidth="2" opacity="0" />

        {/* nodes on top */}
        {stages.map((s, i) => {
          const { x, y } = nodePos(i)
          const hv = hover === i
          return (
            <g
              key={s.slug}
              className="ring-node"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              <Link to={s.path} aria-label={`${s.num} ${s.title}`}>
                <circle ref={(el) => { glowRing.current[i] = el }} cx={x} cy={y} r={nodeR + 4} fill="var(--blue)" opacity="0" filter="url(#ringGlow)" />
                <circle cx={x} cy={y} r={hv ? nodeR + 3 : nodeR} fill="#fff" stroke="var(--blue)" strokeWidth="2" className="ring-node-dot" />
                <circle ref={(el) => { fillDot.current[i] = el }} cx={x} cy={y} r={hv ? nodeR + 3 : nodeR} fill="var(--blue)" opacity={hv ? 1 : 0} className="ring-node-dot" />
                <text ref={(el) => { numBlue.current[i] = el }} x={x} y={y - 2} textAnchor="middle" fontSize="11" fontFamily="var(--font-mono)" fill="var(--blue-deep)" fontWeight="600" opacity={hv ? 0 : 1}>{s.num}</text>
                <text ref={(el) => { numWhite.current[i] = el }} x={x} y={y - 2} textAnchor="middle" fontSize="11" fontFamily="var(--font-mono)" fill="#fff" fontWeight="600" opacity={hv ? 1 : 0}>{s.num}</text>
                <text ref={(el) => { labBlue.current[i] = el }} x={x} y={y + 11} textAnchor="middle" fontSize="8.5" fill="var(--text-2)" opacity={hv ? 0 : 1}>{s.title}</text>
                <text ref={(el) => { labWhite.current[i] = el }} x={x} y={y + 11} textAnchor="middle" fontSize="8.5" fill="#fff" opacity={hv ? 1 : 0}>{s.title}</text>
              </Link>
            </g>
          )
        })}
      </svg>

      <div className="ring-center">
        <div className="ring-center-inner">
          <div className="ring-center-label">The build lifecycle</div>
          <div className="ring-center-title">Idea → Production</div>
          <div className="ring-center-sub">Five phases, one continuous loop</div>
        </div>
      </div>
    </div>
  )
}
