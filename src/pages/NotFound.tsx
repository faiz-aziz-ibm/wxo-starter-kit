import { Link } from 'react-router-dom'
import { IconArrow } from '../icons/Icons'

export default function NotFound() {
  return (
    <section className="hero" style={{ minHeight: '70vh', display: 'grid', placeItems: 'center' }}>
      <div className="container hero-inner">
        <div className="mono" style={{ color: 'var(--blue-bright)', fontSize: '3rem', fontWeight: 600 }}>404</div>
        <h1 className="hero-title" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>Page not found</h1>
        <p className="hero-sub">That route drifted out of the context window. Let’s get you back on the lifecycle.</p>
        <div className="hero-cta" style={{ justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary">Back to home <IconArrow width={16} height={16} /></Link>
          <Link to="/foundations" className="btn btn-ghost">Start the guide</Link>
        </div>
      </div>
    </section>
  )
}
