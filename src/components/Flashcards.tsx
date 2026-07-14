import { useMemo, useState } from 'react'
import { IconArrow, IconCheck, IconX, IconSpark } from '../icons/Icons'

type Card = [string, string] // [term, definition]

function shuffle<T>(arr: T[]): T[] {
  const c = [...arr]
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[c[i], c[j]] = [c[j], c[i]]
  }
  return c
}

/* Self-test flashcards: see the term, flip for the definition, then mark
   "Knew it" or "Review". Flagged cards can be practised again at the end. */
export function Flashcards({ cards, accent = 'var(--teal)' }: { cards: Card[]; accent?: string }) {
  const [deck, setDeck] = useState<Card[]>(() => shuffle(cards))
  const [pos, setPos] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState(0)
  const [flagged, setFlagged] = useState<Card[]>([])
  const [done, setDone] = useState(false)

  const total = deck.length
  const card = deck[pos]

  const mark = (gotIt: boolean) => {
    if (gotIt) setKnown((k) => k + 1)
    else setFlagged((f) => [...f, card])
    if (pos + 1 >= total) { setDone(true); return }
    setPos((p) => p + 1)
    setFlipped(false)
  }

  const restart = (only?: Card[]) => {
    setDeck(shuffle(only && only.length ? only : cards))
    setPos(0); setFlipped(false); setKnown(0); setFlagged([]); setDone(false)
  }

  const progress = useMemo(() => Math.round(((done ? total : pos) / total) * 100), [pos, total, done])

  if (done) {
    return (
      <div className="fc" style={{ ['--accent' as string]: accent }}>
        <div className="fc-done">
          <div className="fc-done-stat"><strong>{known}</strong><span>/ {total} knew it</span></div>
          <div className="fc-done-body">
            <div className="fc-done-title">Deck complete</div>
            <p className="fc-done-msg">
              {flagged.length === 0
                ? 'Every card marked as known — glossary mastered.'
                : `You flagged ${flagged.length} to review. Practise just those, or reshuffle the full deck.`}
            </p>
            <div className="fc-done-actions">
              {flagged.length > 0 && (
                <button className="fc-btn" onClick={() => restart(flagged)}>Practise the {flagged.length} flagged</button>
              )}
              <button className="fc-btn ghost" onClick={() => restart()}>Reshuffle all {cards.length}</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fc" style={{ ['--accent' as string]: accent }}>
      <div className="fc-head">
        <span className="fc-badge"><IconSpark width={14} height={14} /> Flashcards</span>
        <span className="fc-progress">{pos + 1} / {total}</span>
      </div>
      <div className="fc-track"><span className="fc-track-fill" style={{ width: `${progress}%` }} /></div>

      <button className={`fc-card ${flipped ? 'is-flipped' : ''}`} onClick={() => setFlipped((f) => !f)} aria-label="Flip card">
        <div className="fc-face fc-front">
          <span className="fc-kicker">Term</span>
          <span className="fc-term">{card[0]}</span>
          <span className="fc-hint">Tap to reveal</span>
        </div>
        <div className="fc-face fc-back">
          <span className="fc-kicker">Definition</span>
          <span className="fc-def">{card[1]}</span>
        </div>
      </button>

      <div className="fc-actions">
        {!flipped ? (
          <button className="fc-btn" onClick={() => setFlipped(true)}>Show answer <IconArrow width={15} height={15} /></button>
        ) : (
          <>
            <button className="fc-btn review" onClick={() => mark(false)}><IconX width={15} height={15} /> Review</button>
            <button className="fc-btn knew" onClick={() => mark(true)}><IconCheck width={15} height={15} /> Knew it</button>
          </>
        )}
      </div>
    </div>
  )
}
