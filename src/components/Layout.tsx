import { useEffect, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Nav } from './Nav'
import { allPhases, phases, extras } from '../data/phases'
import { IconArrow, IconGithub, IconArrowUpRight } from '../icons/Icons'

export function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    // With HashRouter the section anchor lives in location.hash; scroll to it
    // manually since the browser can't resolve a second '#'.
    if (hash) {
      const id = hash.replace('#', '')
      // wait a frame for the target page to mount
      requestAnimationFrame(() => {
        const el = document.getElementById(id)
        if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return }
        window.scrollTo({ top: 0, behavior: 'auto' })
      })
      return
    }
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname, hash])
  return null
}

/* Prev / Next navigation across the whole guide order */
export function PhaseNav({ slug }: { slug: string }) {
  const idx = allPhases.findIndex((p) => p.slug === slug)
  const prev = idx > 0 ? allPhases[idx - 1] : null
  const next = idx < allPhases.length - 1 ? allPhases[idx + 1] : null
  return (
    <div className="phasenav container">
      {prev ? (
        <Link to={prev.path} className="phasenav-card prev">
          <span className="phasenav-dir"><IconArrow width={15} height={15} style={{ transform: 'rotate(180deg)' }} /> Previous</span>
          <span className="phasenav-title" style={{ color: prev.color }}>{prev.title}</span>
        </Link>
      ) : <span />}
      {next && (
        <Link to={next.path} className="phasenav-card next">
          <span className="phasenav-dir">Next <IconArrow width={15} height={15} /></span>
          <span className="phasenav-title" style={{ color: next.color }}>{next.title}</span>
        </Link>
      )}
    </div>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="brand-mark"><img src="./wxo_logo.png" alt="watsonx Orchestrate" /></span>
          <div>
            <div className="brand-name">watsonx Orchestrate Starter Kit</div>
            <p className="footer-tag">A practical knowledge-transfer guide to building agentic AI — from idea to production.</p>
          </div>
        </div>
        <div className="footer-cols">
          <div className="footer-col">
            <div className="footer-col-h">Lifecycle</div>
            {phases.map((p) => <Link key={p.slug} to={p.path}>{p.title}</Link>)}
          </div>
          <div className="footer-col">
            <div className="footer-col-h">Reference</div>
            <Link to="/roadmap">Learning Roadmap</Link>
            {extras.map((p) => <Link key={p.slug} to={p.path}>{p.title}</Link>)}
            <Link to="/capstone">Capstone exam</Link>
          </div>
          <div className="footer-col">
            <div className="footer-col-h">Official</div>
            <a href="https://developer.watson-orchestrate.ibm.com" target="_blank" rel="noreferrer">Developer Docs <IconArrowUpRight width={13} height={13} /></a>
            <a href="https://github.com/IBM/ibm-watsonx-orchestrate-adk" target="_blank" rel="noreferrer">ADK on GitHub <IconGithub width={13} height={13} /></a>
            <a href="https://developer.watson-orchestrate.ibm.com/mcp" target="_blank" rel="noreferrer">Docs MCP Server <IconArrowUpRight width={13} height={13} /></a>
          </div>
        </div>
      </div>
      <div className="container footer-base">
        <span>
          Curated by <strong style={{ color: 'var(--text-1)' }}>Faiz Aziz</strong> ·{' '}
          <a href="mailto:faiz.aziz@ibm.com" style={{ color: 'var(--blue-bright)' }}>faiz.aziz@ibm.com</a> · Data &amp; AI Delivery Consultant, IBM Expert Labs
        </span>
        <span>Platform: ADK v2.12+ · Unofficial community guide</span>
      </div>
    </footer>
  )
}

export function Page({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollToTop />
      <Nav />
      <main className="main">{children}</main>
      <Footer />
    </>
  )
}

export { IconArrow }
