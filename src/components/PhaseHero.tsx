import type { ReactNode, MouseEvent } from 'react'
import type { Phase } from '../data/phases'
import { PhaseNav } from './Layout'

export function PhaseHero({ phase, tagline }: { phase: Phase; tagline: string }) {
  const Icon = phase.icon
  return (
    <header className="phasehero" style={{ ['--accent' as string]: phase.color }}>
      <div className="phasehero-glow" />
      <div className="container phasehero-inner">
        <div className="phasehero-badge">
          <span className="phasehero-icon"><Icon width={26} height={26} /></span>
          <span className="phasehero-kicker">{phase.kicker} · {phase.num}</span>
        </div>
        <h1 className="phasehero-title">{phase.title}</h1>
        <p className="phasehero-tagline">{tagline}</p>
      </div>
    </header>
  )
}

/* Full phase page shell: hero + sticky TOC + content + prev/next */
export function PhaseShell({
  phase, tagline, toc, children,
}: { phase: Phase; tagline: string; toc: { id: string; label: string }[]; children: ReactNode }) {
  return (
    <>
      <PhaseHero phase={phase} tagline={tagline} />
      <div className="phasebody">
        <div className="container">
          <div className="phasebody-grid">
            <TocRail items={toc} />
            <div className="content">{children}</div>
          </div>
        </div>
      </div>
      <PhaseNav slug={phase.slug} />
    </>
  )
}

/* Table of contents rail for long phase pages.
   Under HashRouter a bare href="#id" clobbers the route hash (→ 404), so we
   scroll to the target ourselves and leave the router hash untouched. */
export function TocRail({ items }: { items: { id: string; label: string }[] }) {
  const go = (e: MouseEvent, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  return (
    <nav className="toc" aria-label="On this page">
      <div className="toc-label">On this page</div>
      <ul>
        {items.map((it) => (
          <li key={it.id}><a href={`#${it.id}`} onClick={(e) => go(e, it.id)}>{it.label}</a></li>
        ))}
      </ul>
    </nav>
  )
}
