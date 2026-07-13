import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { phases } from '../data/phases'

/* Animated circular SDLC lifecycle. Five build-lifecycle stages arranged
   around a ring; segments draw in on scroll, nodes carry each phase color. */
export function LifecycleRing() {
  const ref = useRef<SVGSVGElement>(null)
  const [active, setActive] = useState(false)
  const [hover, setHover] = useState<number | null>(null)

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

  const stages = phases.filter((p) => p.lifecycle)
  const cx = 200, cy = 200, r = 150
  const n = stages.length
  const gap = 0.12 // radians gap between segments
  const seg = (Math.PI * 2) / n

  // colors resolved to concrete values for SVG stroke
  const colorVar = (c: string) => c

  const nodePos = (i: number) => {
    const a = -Math.PI / 2 + i * seg
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), a }
  }

  const arcPath = (i: number) => {
    const start = -Math.PI / 2 + i * seg + gap / 2
    const end = start + seg - gap
    const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start)
    const x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end)
    const large = end - start > Math.PI ? 1 : 0
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
  }

  const circumference = seg * r

  return (
    <div className="ring-wrap">
      <svg ref={ref} className="ring-svg" viewBox="0 0 400 400" role="img" aria-label="watsonx Orchestrate build lifecycle: Design, Build, Test, Deploy, Monitor">
        <defs>
          <filter id="ringGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* faint full ring */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

        {/* colored segments */}
        {stages.map((s, i) => (
          <path
            key={s.slug}
            className="ring-seg"
            d={arcPath(i)}
            fill="none"
            stroke={colorVar(s.color)}
            strokeWidth={hover === i ? 6 : 3}
            strokeLinecap="round"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: active ? 0 : circumference,
              opacity: hover === null || hover === i ? 1 : 0.35,
              transitionDelay: `${i * 220}ms`,
            }}
          />
        ))}

        {/* nodes */}
        {stages.map((s, i) => {
          const { x, y } = nodePos(i)
          return (
            <g
              key={s.slug}
              className="ring-node"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              <Link to={s.path}>
                <circle cx={x} cy={y} r={hover === i ? 26 : 22} fill="var(--bg-1)" stroke={s.color} strokeWidth="2" filter={hover === i ? 'url(#ringGlow)' : undefined} className="ring-node-dot" />
                <text x={x} y={y - 2} textAnchor="middle" fontSize="11" fontFamily="var(--font-mono)" fill={s.color} fontWeight="600">{s.num}</text>
                <text x={x} y={y + 11} textAnchor="middle" fontSize="8.5" fill="var(--text-2)">{s.title}</text>
              </Link>
            </g>
          )
        })}

        {/* animated pulse traveling the ring */}
        {active && (
          <circle r="4" fill="var(--blue-bright)" filter="url(#ringGlow)">
            <animateMotion dur="8s" repeatCount="indefinite" path={`M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r}`} />
          </circle>
        )}
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
