import { useState, type ReactNode } from 'react'
import { IconCheck, IconX, IconSpark, IconArrow } from '../icons/Icons'

export type QuizLevel = 'Easy' | 'Medium' | 'Hard' | 'Expert'
export type QuizQuestion = {
  q: string
  options: string[]
  answer: number // index of correct option
  why: ReactNode // explanation shown after answering
  level?: QuizLevel
  scenario?: boolean // renders a "Scenario" tag
}

const ORDER: QuizLevel[] = ['Easy', 'Medium', 'Hard', 'Expert']

function shuffle<T>(arr: T[]): T[] {
  const c = [...arr]
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[c[i], c[j]] = [c[j], c[i]]
  }
  return c
}

/* Draw a difficulty-balanced sample, then order it easy -> expert so each
   attempt ramps up. Re-rolled every time the quiz (re)starts. */
function drawQuestions(all: QuizQuestion[], n: number): QuizQuestion[] {
  if (all.length <= n) return [...all].sort(byLevel)
  const target: Record<QuizLevel, number> = { Easy: 2, Medium: 2, Hard: 2, Expert: 1 }
  const buckets: Record<QuizLevel, QuizQuestion[]> = { Easy: [], Medium: [], Hard: [], Expert: [] }
  for (const q of all) buckets[q.level ?? 'Medium'].push(q)

  const picked: QuizQuestion[] = []
  for (const lvl of ORDER) picked.push(...shuffle(buckets[lvl]).slice(0, target[lvl]))
  if (picked.length < n) {
    const rest = shuffle(all.filter((q) => !picked.includes(q)))
    picked.push(...rest.slice(0, n - picked.length))
  }
  return picked.slice(0, n).sort(byLevel)
}

function byLevel(a: QuizQuestion, b: QuizQuestion) {
  return ORDER.indexOf(a.level ?? 'Medium') - ORDER.indexOf(b.level ?? 'Medium')
}

/* A lightweight, self-contained knowledge check. Shows `count` random questions
   from the bank, one at a time, with instant feedback and a final score. */
export function Quiz({ questions, accent = 'var(--blue)', count = 7, certification = false, passMark = 70 }: { questions: QuizQuestion[]; accent?: string; count?: number; certification?: boolean; passMark?: number }) {
  const [active, setActive] = useState<QuizQuestion[]>(() => drawQuestions(questions, count))
  const [idx, setIdx] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [copied, setCopied] = useState(false)

  const q = active[idx]
  const answered = picked !== null
  const correct = picked === q?.answer

  const pick = (i: number) => {
    if (answered) return
    setPicked(i)
    if (i === q.answer) setScore((s) => s + 1)
  }
  const next = () => {
    if (idx + 1 >= active.length) { setDone(true); return }
    setIdx((i) => i + 1)
    setPicked(null)
  }
  const restart = () => {
    setActive(drawQuestions(questions, count)) // re-roll a fresh set
    setIdx(0); setPicked(null); setScore(0); setDone(false); setCopied(false)
  }

  if (done) {
    const pct = Math.round((score / active.length) * 100)
    const passed = pct >= passMark

    if (certification) {
      const share = `watsonx Orchestrate Starter Kit — Capstone: ${score}/${active.length} (${pct}%) · ${passed ? 'wxO Ready' : 'Keep studying'}`
      const copy = () => {
        navigator.clipboard?.writeText(share).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) }).catch(() => {})
      }
      return (
        <div className={`quiz quiz-cert ${passed ? 'pass' : 'fail'}`} style={{ ['--accent' as string]: accent }}>
          <div className="quiz-result">
            <div className="quiz-score-ring" style={{ ['--pct' as string]: String(pct) }}>
              <span>{pct}<small>%</small></span>
            </div>
            <div>
              <div className={`cert-badge ${passed ? 'pass' : 'fail'}`}>{passed ? 'wxO Ready' : 'Not yet certified'}</div>
              <div className="quiz-result-title">You scored {score} / {active.length}</div>
              <p className="quiz-result-msg">
                {passed
                  ? `Above the ${passMark}% pass mark — you can reason across the whole lifecycle, not just recall it.`
                  : `The pass mark is ${passMark}%. Revisit the sections behind the ones you missed, then take a fresh set.`}
              </p>
              <div className="quiz-foot" style={{ borderTop: 'none', paddingTop: 0, marginTop: 4 }}>
                <button className="quiz-btn ghost" onClick={copy}>{copied ? 'Copied!' : 'Copy my result'}</button>
                <button className="quiz-btn" onClick={restart}>Retake — new questions</button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    const msg = pct === 100 ? 'Flawless — you’ve got this.' : pct >= 60 ? 'Solid. Re-skim the section to lock it in.' : 'Worth another read-through — then try again.'
    return (
      <div className="quiz" style={{ ['--accent' as string]: accent }}>
        <div className="quiz-result">
          <div className="quiz-score-ring" style={{ ['--pct' as string]: String(pct) }}>
            <span>{score}<small>/{active.length}</small></span>
          </div>
          <div>
            <div className="quiz-result-title">Knowledge check complete</div>
            <p className="quiz-result-msg">{msg}</p>
            <button className="quiz-btn" onClick={restart}>Try again — new questions</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="quiz" style={{ ['--accent' as string]: accent }}>
      <div className="quiz-head">
        <span className="quiz-badge"><IconSpark width={14} height={14} /> Knowledge check</span>
        <span className="quiz-head-right">
          {q.scenario && <span className="quiz-tag scenario">Scenario</span>}
          {q.level && <span className={`quiz-tag lvl-${q.level.toLowerCase()}`}>{q.level}</span>}
          <span className="quiz-progress">{idx + 1} / {active.length}</span>
        </span>
      </div>
      <div className="quiz-q">{q.q}</div>
      <div className="quiz-options">
        {q.options.map((opt, i) => {
          const isAnswer = i === q.answer
          const isPicked = i === picked
          const state = !answered ? '' : isAnswer ? 'is-correct' : isPicked ? 'is-wrong' : 'is-dim'
          return (
            <button key={i} className={`quiz-opt ${state}`} onClick={() => pick(i)} disabled={answered}>
              <span className="quiz-opt-mark">
                {answered && isAnswer && <IconCheck width={15} height={15} />}
                {answered && isPicked && !isAnswer && <IconX width={15} height={15} />}
                {(!answered || (!isAnswer && !isPicked)) && <span className="quiz-opt-letter">{String.fromCharCode(65 + i)}</span>}
              </span>
              {opt}
            </button>
          )
        })}
      </div>
      {answered && (
        <>
          <div className={`quiz-explain ${correct ? 'ok' : 'no'}`}>
            <strong>{correct ? 'Correct.' : 'Not quite.'}</strong> {q.why}
          </div>
          <div className="quiz-foot">
            <span className="quiz-foot-score">Score so far · {score}/{idx + 1}</span>
            <button className="quiz-btn" onClick={next}>
              {idx + 1 >= active.length ? 'See score' : 'Next question'} <IconArrow width={15} height={15} />
            </button>
          </div>
        </>
      )}
    </div>
  )
}
