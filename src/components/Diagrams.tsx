import type { ReactNode } from 'react'
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
