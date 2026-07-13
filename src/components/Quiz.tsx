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

/* A lightweight, self-contained knowledge check. One question at a time,
   instant feedback with an explanation, and a final score. */
export function Quiz({ questions, accent = 'var(--blue)' }: { questions: QuizQuestion[]; accent?: string }) {
  const [idx, setIdx] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const q = questions[idx]
  const answered = picked !== null
  const correct = picked === q?.answer

  const pick = (i: number) => {
    if (answered) return
    setPicked(i)
    if (i === q.answer) setScore((s) => s + 1)
  }
  const next = () => {
    if (idx + 1 >= questions.length) { setDone(true); return }
    setIdx((i) => i + 1)
    setPicked(null)
  }
  const restart = () => { setIdx(0); setPicked(null); setScore(0); setDone(false) }

  if (done) {
    const pct = Math.round((score / questions.length) * 100)
    const msg = pct === 100 ? 'Flawless — you’ve got this.' : pct >= 60 ? 'Solid. Re-skim the section to lock it in.' : 'Worth another read-through — then try again.'
    return (
      <div className="quiz" style={{ ['--accent' as string]: accent }}>
        <div className="quiz-result">
          <div className="quiz-score-ring" style={{ ['--pct' as string]: String(pct) }}>
            <span>{score}<small>/{questions.length}</small></span>
          </div>
          <div>
            <div className="quiz-result-title">Knowledge check complete</div>
            <p className="quiz-result-msg">{msg}</p>
            <button className="quiz-btn" onClick={restart}>Try again</button>
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
          <span className="quiz-progress">{idx + 1} / {questions.length}</span>
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
              {idx + 1 >= questions.length ? 'See score' : 'Next question'} <IconArrow width={15} height={15} />
            </button>
          </div>
        </>
      )}
    </div>
  )
}
