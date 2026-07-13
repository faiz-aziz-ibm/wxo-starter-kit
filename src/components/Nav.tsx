import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { phases, extras, roadmap } from '../data/phases'
import { IconMenu, IconX, IconArrow } from '../icons/Icons'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const loc = useLocation()

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12)
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [loc.pathname])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : '' }, [open])

  return (
    <>
      <header className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="nav-inner container">
          <Link to="/" className="brand">
            <span className="brand-mark"><img src="./wxo_logo.png" alt="watsonx Orchestrate" /></span>
            <span className="brand-text">
              <span className="brand-name">watsonx Orchestrate</span>
              <span className="brand-sub">Starter Kit</span>
            </span>
          </Link>

          <nav className="nav-links" aria-label="Primary">
            <NavLink to={roadmap.path} className="nav-link nav-link-star">{roadmap.title}</NavLink>
            <span className="nav-divider" />
            {phases.map((p) => (
              <NavLink key={p.slug} to={p.path} className="nav-link">{p.title}</NavLink>
            ))}
            <span className="nav-divider" />
            {extras.map((p) => (
              <NavLink key={p.slug} to={p.path} className="nav-link">{p.title}</NavLink>
            ))}
          </nav>

          <div className="nav-right">
            <Link to="/foundations" className="btn btn-sm btn-primary nav-cta">
              Start learning <IconArrow width={15} height={15} />
            </Link>
            <button className="nav-burger" onClick={() => setOpen((v) => !v)} aria-label="Menu" aria-expanded={open}>
              {open ? <IconX width={22} height={22} /> : <IconMenu width={22} height={22} />}
            </button>
          </div>
        </div>
        <div className="nav-progress" style={{ transform: `scaleX(${progress / 100})` }} />
      </header>

      {open && (
        <div className="mobile-menu">
          <div className="mobile-menu-inner">
            <div className="mm-label">Start here</div>
            <NavLink to={roadmap.path} className="mm-link">
              <span className="mm-num" style={{ color: roadmap.color }}>{roadmap.num}</span>
              {roadmap.title}
            </NavLink>
            <div className="mm-label">The lifecycle</div>
            {phases.map((p) => (
              <NavLink key={p.slug} to={p.path} className="mm-link">
                <span className="mm-num" style={{ color: p.color }}>{p.num}</span>
                {p.title}
              </NavLink>
            ))}
            <div className="mm-label">More</div>
            {extras.map((p) => (
              <NavLink key={p.slug} to={p.path} className="mm-link">
                <span className="mm-num" style={{ color: p.color }}>{p.num}</span>
                {p.title}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
