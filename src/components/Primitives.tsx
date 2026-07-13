import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  IconInfo, IconAlert, IconBulb, IconKey, IconSpark, IconCheck, IconX, IconChat, IconArrowUpRight,
} from '../icons/Icons'

/* ---- Cross-reference link (jump to a related section on another page) ---- */
export function XRef({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="xref">
      {children}<IconArrowUpRight width={13} height={13} />
    </Link>
  )
}

/* ---- Reveal on scroll ---- */
export function Reveal({
  children, className = '', delay = 0, as = 'div',
}: { children: ReactNode; className?: string; delay?: number; as?: 'div' | 'section' | 'li' }) {
  const ref = useRef<HTMLElement>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    // threshold 0 + a bottom inset: reveal as soon as the element's top edge
    // enters the viewport. Using a ratio threshold breaks for sections taller
    // than the viewport (their max intersection ratio can stay below it).
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }),
      { threshold: 0, rootMargin: '0px 0px -80px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const Tag = as as 'div'
  return (
    <Tag
      ref={ref as never}
      className={`reveal ${seen ? 'in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}

/* ---- Callout ---- */
type CalloutKind = 'note' | 'warning' | 'tip' | 'critical' | 'key' | 'analogy'
const calloutMeta: Record<CalloutKind, { label: string; icon: typeof IconInfo }> = {
  note: { label: 'Note', icon: IconInfo },
  warning: { label: 'Warning', icon: IconAlert },
  tip: { label: 'Tip', icon: IconBulb },
  critical: { label: 'Critical', icon: IconAlert },
  key: { label: 'Key idea', icon: IconKey },
  analogy: { label: 'Analogy', icon: IconChat },
}
export function Callout({
  kind = 'note', title, children,
}: { kind?: CalloutKind; title?: string; children: ReactNode }) {
  const { label, icon: Icon } = calloutMeta[kind]
  return (
    <div className={`callout callout-${kind}`}>
      <div className="callout-icon"><Icon width={17} height={17} /></div>
      <div className="callout-body">
        <div className="callout-label">{title ?? label}</div>
        <div className="callout-content">{children}</div>
      </div>
    </div>
  )
}

/* ---- Card ---- */
export function Card({
  children, className = '', accent, hover = false,
}: { children: ReactNode; className?: string; accent?: string; hover?: boolean }) {
  return (
    <div
      className={`card ${hover ? 'card-hover' : ''} ${className}`}
      style={accent ? ({ ['--accent' as string]: accent }) : undefined}
    >
      {children}
    </div>
  )
}

/* ---- Section heading ---- */
export function H2({ id, eyebrow, children }: { id?: string; eyebrow?: string; children: ReactNode }) {
  return (
    <div className="h2-wrap" id={id}>
      {eyebrow && <div className="eyebrow"><span className="dot" />{eyebrow}</div>}
      <h2 className="h2">{children}</h2>
    </div>
  )
}

/* ---- Do / Don't lists ---- */
export function DoDont({ dos, donts }: { dos: ReactNode[]; donts: ReactNode[] }) {
  return (
    <div className="dodont">
      <div className="dd-col dd-do">
        <div className="dd-head"><IconCheck width={16} height={16} /> Do</div>
        <ul>{dos.map((d, i) => <li key={i}>{d}</li>)}</ul>
      </div>
      <div className="dd-col dd-dont">
        <div className="dd-head"><IconX width={16} height={16} /> Avoid</div>
        <ul>{donts.map((d, i) => <li key={i}>{d}</li>)}</ul>
      </div>
    </div>
  )
}

/* ---- Data table ---- */
export function DataTable({
  head, rows, first,
}: { head: string[]; rows: ReactNode[][]; first?: 'strong' }) {
  return (
    <div className="table-wrap">
      <table className={`data-table ${first === 'strong' ? 'first-strong' : ''}`}>
        <thead><tr>{head.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ---- Pill ---- */
export function Pill({ children, tone = 'default' }: { children: ReactNode; tone?: string }) {
  return <span className={`pill pill-${tone}`}>{children}</span>
}

/* ---- Stat ---- */
export function Stat({ value, label, accent }: { value: string; label: string; accent?: string }) {
  return (
    <div className="stat" style={accent ? { ['--accent' as string]: accent } : undefined}>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

export { IconSpark }
