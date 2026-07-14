import { Link } from 'react-router-dom'
import { Reveal, Callout } from '../components/Primitives'
import { Quiz } from '../components/Quiz'
import { capstoneQuestions, allQuizzes } from '../data/quizzes'
import { IconTrophy, IconArrowUpRight } from '../icons/Icons'

const ACCENT = 'var(--purple)'

export default function Capstone() {
  return (
    <>
      <header className="phasehero" style={{ ['--accent' as string]: ACCENT }}>
        <div className="phasehero-glow" />
        <div className="container phasehero-inner">
          <div className="phasehero-badge">
            <span className="phasehero-icon"><IconTrophy width={26} height={26} /></span>
            <span className="phasehero-kicker">Prove it · EXAM</span>
          </div>
          <h1 className="phasehero-title">The Capstone</h1>
          <p className="phasehero-tagline">
            One graded exam drawn from the toughest questions across every phase. Score {70}% or more to earn
            <strong> wxO Ready</strong> — proof you can reason across the whole lifecycle, not just recall it.
          </p>
        </div>
      </header>

      <div className="phasebody">
        <div className="container" style={{ maxWidth: 820 }}>
          <div className="content">
            <Reveal as="section" className="reveal">
              <h3>How it works</h3>
              <ul className="prose" style={{ paddingLeft: 20, lineHeight: 1.9 }}>
                <li><strong>12 questions</strong> pulled from the Hard and Expert pool of all six sections ({capstoneQuestions.length} in the bank).</li>
                <li><strong>Scenario-heavy</strong> — most ask you to apply the ideas, not repeat them.</li>
                <li><strong>Pass mark 70%.</strong> Fresh questions every attempt, so a retake is never the same paper.</li>
              </ul>
              <Callout kind="tip" title="Work the sections first">
                If a topic feels shaky, run its own Knowledge Check before attempting the Capstone — the exam assumes you’ve done the reading.
              </Callout>
              <div className="cap-covers">
                <span className="cap-covers-label">Covers</span>
                {allQuizzes.map((s) => (
                  <Link key={s.path} to={s.path} className="cap-chip">{s.section}<IconArrowUpRight width={12} height={12} /></Link>
                ))}
              </div>
            </Reveal>

            <Reveal as="section" className="reveal">
              <h3>Sit the exam</h3>
              <Quiz questions={capstoneQuestions} count={12} certification passMark={70} accent={ACCENT} />
            </Reveal>
          </div>
        </div>
      </div>
    </>
  )
}
