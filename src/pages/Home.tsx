import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/home.css'
import '../styles/roadmap.css'
import { phases, extras, roadmap } from '../data/phases'
import { LifecycleRing } from '../components/LifecycleRing'
import { Reveal, H2, Card } from '../components/Primitives'
import {
  IconArrow, IconSpark, IconUsers, IconBuild, IconTarget,
  IconCheck, IconBook, IconArrowUpRight, IconDownload,
} from '../icons/Icons'

const audiences = [
  { icon: IconUsers, color: 'var(--cyan)', title: 'Non-technical stakeholders', body: 'Analysts and business owners who need to understand what agents can do, where they fit, and how to scope a use case — no code required.' },
  { icon: IconBuild, color: 'var(--purple)', title: 'New platform builders', body: 'People building their first agent in the UI or ADK. Clear, copy-ready steps and the "why" behind every decision.' },
  { icon: IconTarget, color: 'var(--blue)', title: 'Experienced developers', body: 'Engineers shipping multi-agent systems, workflows and CI/CD who want best practices, trade-offs and debugging playbooks.' },
]

/* A live agent run, cycling like the status chip in a real chat. */
const runSteps = [
  { kind: 'busy', text: 'Planning the request' },
  { kind: 'tool', text: 'Calling get_leave_balance' },
  { kind: 'busy', text: 'Checking HR policy' },
  { kind: 'done', text: 'Resolved', meta: '1m 52s' },
] as const

function AgentStatus() {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setI(runSteps.length - 1); return }
    const id = window.setTimeout(() => setI((n) => (n + 1) % runSteps.length), i === runSteps.length - 1 ? 3200 : 1500)
    return () => window.clearTimeout(id)
  }, [i])
  const s = runSteps[i]
  return (
    <div className="agent-status" aria-live="polite">
      <span className={`as-icon as-${s.kind}`} aria-hidden>
        {s.kind === 'done' ? <IconCheck width={13} height={13} /> : s.kind === 'tool' ? <span className="as-tool" /> : <span className="as-spin" />}
      </span>
      <span key={i} className="as-text">
        {s.text}{'meta' in s && <span className="as-meta"> · {s.meta}</span>}
      </span>
    </div>
  )
}

function Words({ text, from = 0, className = '' }: { text: string; from?: number; className?: string }) {
  return (
    <>
      {text.split(' ').map((w, k) => (
        <span key={k} className={`hw ${className}`} style={{ animationDelay: `${(from + k) * 90 + 150}ms` }}>{w}{' '}</span>
      ))}
    </>
  )
}

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container hero-inner">
          <AgentStatus />
          <div className="hero-eyebrow">IBM watsonx Orchestrate · Starter Kit</div>
          <h1 className="hero-title">
            <Words text="Build agentic AI," />
            <Words text="the right way." from={3} className="hw-blue" />
          </h1>
          <Reveal delay={760}>
            <p className="hero-sub">
              A friendly, premium starter kit for everyone at IBM — taking you from zero to production
              across the full watsonx Orchestrate lifecycle: <strong>Design, Build, Test, Deploy, Monitor.</strong>
            </p>
          </Reveal>
          <Reveal delay={880}>
            <div className="hero-cta">
              <Link to="/roadmap" className="btn btn-primary">Follow the roadmap <IconArrow width={16} height={16} /></Link>
              <Link to="/foundations" className="btn btn-ghost">Start from zero <IconSpark width={16} height={16} /></Link>
            </div>
          </Reveal>
          <Reveal delay={1000}>
            <div className="hero-meta">
              <span className="hero-meta-item"><IconCheck width={16} height={16} /> Non-technical to technical</span>
              <span className="hero-meta-item"><IconBook width={16} height={16} /> 9 guided chapters</span>
              <span className="hero-meta-item"><IconSpark width={16} height={16} /> Copy-ready examples</span>
            </div>
          </Reveal>
          <Reveal delay={1100}>
            <p className="hero-byline">
              Curated by <strong>Faiz Aziz</strong> · Data &amp; AI Delivery Consultant, IBM Expert Labs
            </p>
          </Reveal>
        </div>
      </section>

      {/* LIFECYCLE RING */}
      <section className="section lifecycle">
        <div className="container">
          <Reveal className="lifecycle-head">
            <div className="eyebrow" style={{ justifyContent: 'center' }}><span className="dot" /> The mental model</div>
            <h2 className="h2" style={{ marginTop: 12 }}>One lifecycle, five phases</h2>
            <p className="lead" style={{ marginTop: 12 }}>
              Every agent — from a simple Q&amp;A bot to a multi-agent system — travels the same loop.
              Master it once, apply it everywhere. Hover a stage to explore.
            </p>
          </Reveal>

          <LifecycleRing />

          <div className="ring-legend">
            {phases.filter((p) => p.lifecycle).map((p) => (
              <Link key={p.slug} to={p.path} className="ring-legend-item">
                <span className="ring-legend-dot" style={{ background: p.color }} />
                <span className="ring-legend-num">{p.num}</span>
                <span className="ring-legend-name">{p.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AUDIENCE */}
      <section className="section">
        <div className="container">
          <Reveal><H2 eyebrow="Who this is for">Written for the whole team</H2></Reveal>
          <div className="audience-grid">
            {audiences.map((a, i) => (
              <Reveal key={i} delay={i * 100}>
                <Card className="aud-card" hover accent={a.color}>
                  <div className="aud-icon" >
                    <a.icon width={24} height={24} />
                  </div>
                  <h3>{a.title}</h3>
                  <p>{a.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PHASE INDEX */}
      <section className="section">
        <div className="container">
          <Reveal><H2 eyebrow="The guide">Everything, in order</H2></Reveal>
          <div className="phase-grid">
            {[roadmap, ...phases, ...extras].map((p, i) => (
              <Reveal key={p.slug} delay={(i % 2) * 80}>
                <Link to={p.path} className="phase-card card card-hover" style={{ ['--accent' as string]: p.color }}>
                  <span className="phase-card-icon"><p.icon width={24} height={24} /></span>
                  <span style={{ minWidth: 0 }}>
                    <span className="phase-card-num">{p.kicker.toUpperCase()} · {p.num}</span>
                    <h3>{p.title} <span className="arr"><IconArrow width={18} height={18} /></span></h3>
                    <p>{p.blurb}</p>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BOB TOOLKIT */}
      <section className="section">
        <div className="container">
          <Reveal><H2 eyebrow="Build faster">Meet Bob, your wxO Agent Architect</H2></Reveal>
          <Reveal delay={80}>
            <div className="rm-download">
              <div className="rm-download-grid">
                <div>
                  <h3>Turn your AI assistant into a wxO Architect</h3>
                  <p>
                    A ready-to-drop <span className="icode">.bob</span> folder that gives your coding assistant an
                    <strong> Agent Architect</strong> mode, both <strong>ADK MCP servers</strong> (docs + platform), and eight
                    <strong> wxO skills</strong> — so it can design, build, review and debug agents and flows against the live ADK.
                  </p>
                  <div className="rm-download-items">
                    {['Agent Architect mode', 'ADK Docs MCP', 'ADK Platform MCP', '8 wxO skills'].map((t) => (
                      <span className="rm-chip" key={t}>{t}</span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <img className="rm-bob" src="./bob_logo.svg" alt="Bob, the WXO Agent Architect mascot" />
                  <a className="rm-dl-btn" href="./downloads/wxo-architect-toolkit.zip" download>
                    <IconDownload width={20} height={20} /> Download toolkit
                  </a>
                  <div className="rm-dl-sub">.zip · ~295&nbsp;KB · <Link to="/roadmap" style={{ color: 'var(--blue-bright)' }}>how it works</Link></div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* BIG CTA */}
      <section className="section">
        <div className="container narrow">
          <Reveal>
            <div className="bigcta">
              <h2>Ready to build your first agent?</h2>
              <p>Follow the staged roadmap from your first Python tool to a full multi-agent system — one new concept at a time.</p>
              <div className="hero-cta" style={{ justifyContent: 'center' }}>
                <Link to="/roadmap" className="btn btn-primary">Become a wxO Pro <IconArrow width={16} height={16} /></Link>
                <a href="https://developer.watson-orchestrate.ibm.com" target="_blank" rel="noreferrer" className="btn btn-ghost">Official docs <IconArrowUpRight width={15} height={15} /></a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
