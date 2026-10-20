import { allPhases } from '../data/phases'
import { PhaseShell } from '../components/PhaseHero'
import { Reveal, DataTable, Pill } from '../components/Primitives'
import { IconAlert, IconCheck } from '../icons/Icons'

const phase = allPhases.find((p) => p.slug === 'anti-patterns')!

const toc = [
  { id: 'list', label: 'The seven anti-patterns' },
  { id: 'summary', label: 'Quick summary' },
]

const antipatterns = [
  { n: 1, title: 'The Monolithic Mega-Prompt', tag: 'most common', why: 'One agent given 400 lines of nested if/then instructions. LLMs lose track of long instruction sets, steps at the end get skipped, and it’s impossible to debug which instruction was ignored.', fix: 'One agent = one clear job. Aim for ~20 lines of instructions per agent. Extract complex logic into specialists or workflows.' },
  { n: 2, title: 'Agent-Washing', tag: 'very common', why: 'A deterministic function dressed up as an agent — e.g. an @agent that just calls a weather API. You pay for LLM reasoning on a deterministic task: ~3× latency and cost, plus unpredictability where none is needed.', fix: 'If there is one clear path with no decisions, use a Tool, not an Agent.' },
  { n: 3, title: 'The Firehose Effect', tag: 'very common', why: 'A tool that returns everything — return database.get_all_customer_records() yielding 50,000 rows. It floods the context window, the agent becomes incoherent (agentic drift), and cost rises exponentially.', fix: 'Return only what’s needed: the customer’s name, status, balance, and last 3 tickets.' },
  { n: 4, title: 'Agent-as-Business-Process Fallacy', tag: 'critical', why: '“Let’s replace our entire claims process with an agent; it’ll figure out the steps.” Regulated processes need guaranteed order — no audit trail or rollback means skipped steps become compliance violations.', fix: 'Use an Agentic Workflow for the deterministic parts, and an Agent only for reasoning steps within it.' },
  { n: 5, title: 'Tool Soup', tag: 'critical', why: 'One agent loaded with dozens of near-identical tools: search_database_v1, search_database_v2, find_records… The agent gets confused choosing between them, and accuracy drops sharply above 7–10 tools.', fix: 'Curate ruthlessly. Combine overlapping tools. 3–7 focused tools per agent.' },
  { n: 6, title: 'Happy-Path Engineering', tag: 'critical', why: 'Testing only the perfect scenario. Real users phrase things unexpectedly, APIs fail and time out, and agents without error handling produce broken responses.', fix: 'Wrap tool logic in try/except, return friendly not-found & timeout messages, and test edge cases and failures explicitly.' },
  { n: 7, title: 'Invisible State', tag: 'critical', why: 'The agent starts a leave request, the user says “actually make it Tuesday,” and it replies “I don’t have a previous request to update.” LLMs don’t reliably track state across long conversations.', fix: 'For multi-step processes, use Agentic Workflows with explicit state, or store state in external systems and retrieve by ID.' },
]

export default function AntiPatterns() {
  return (
    <PhaseShell phase={phase} toc={toc} tagline="Real mistakes real teams make. Read this before you build, not after.">
      <Reveal as="section" className="reveal">
        <div id="list" />
        <h3>The seven anti-patterns</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {antipatterns.map((ap) => (
            <Reveal key={ap.n} delay={ap.n * 40}>
              <div id={`ap-${ap.n}`} style={{ scrollMarginTop: 'calc(var(--nav-h) + 20px)' }} />
              <div className="card" style={{ ['--accent' as string]: 'var(--red)', padding: 0, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 24px', borderBottom: '1px solid var(--line-soft)', background: 'color-mix(in srgb, var(--red) 5%, var(--bg))' }}>
                  <span style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 11, display: 'grid', placeItems: 'center', background: 'color-mix(in srgb, var(--red) 12%, var(--bg))', color: 'var(--red)' }}>
                    <IconAlert width={20} height={20} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <span className="mono" style={{ color: 'var(--red)', fontSize: '0.8rem' }}>#{ap.n}</span>
                      <strong style={{ color: 'var(--text)', fontSize: '1.12rem' }}>{ap.title}</strong>
                      <Pill tone="red">{ap.tag}</Pill>
                    </div>
                  </div>
                </div>
                <div style={{ padding: '18px 24px' }}>
                  <p className="muted" style={{ margin: '0 0 14px', fontSize: '0.94rem', lineHeight: 1.6 }}>
                    <strong style={{ color: 'var(--red)' }}>Why it fails · </strong>{ap.why}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.94rem', lineHeight: 1.6, color: 'var(--text-1)', display: 'flex', gap: 10 }}>
                    <span style={{ flexShrink: 0, color: 'var(--green)', marginTop: 2 }}><IconCheck width={17} height={17} /></span>
                    <span><strong style={{ color: 'var(--green)' }}>Fix it · </strong>{ap.fix}</span>
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="summary" />
        <h3>Quick anti-pattern summary</h3>
        <DataTable
          first="strong"
          head={['Anti-pattern', 'Symptom', 'Fix']}
          rows={[
            ['Mega-prompt', 'Agent ignores some instructions', 'Split into focused agents'],
            ['Agent-washing', 'Slow, expensive, simple tasks', 'Use tools or workflows instead'],
            ['Firehose effect', 'Agent incoherent mid-session', 'Filter data at the tool layer'],
            ['Agent-as-process', 'Compliance violations, skipped steps', 'Use Agentic Workflows'],
            ['Tool soup', 'Wrong tool selected, inconsistent', 'Curate to 3–7 tools per agent'],
            ['Happy-path only', 'Agent breaks in production', 'Test edge cases and failures'],
            ['Invisible state', 'Forgets context in multi-step flows', 'Externalise state to systems'],
          ]}
        />
      </Reveal>
    </PhaseShell>
  )
}
