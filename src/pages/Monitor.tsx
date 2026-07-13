import { allPhases } from '../data/phases'
import { PhaseShell } from '../components/PhaseHero'
import { Reveal, Callout, DataTable, Card } from '../components/Primitives'
import { FlowRow } from '../components/Diagrams'
import { CodeBlock } from '../components/CodeBlock'
import { Quiz } from '../components/Quiz'

const phase = allPhases.find((p) => p.slug === 'monitor')!

const toc = [
  { id: 'what', label: 'What to monitor' },
  { id: 'traces', label: 'Using traces' },
  { id: 'perf', label: 'Performance' },
  { id: 'cycle', label: 'Improvement cycle' },
  { id: 'playbook', label: 'Debugging playbook' },
  { id: 'check', label: 'Knowledge check' },
]

const symptoms = [
  { s: 'Agent calls the wrong tool (or no tool)', c: 'Vague tool description, too many overlapping tools, or instructions don’t say when to use it.', f: 'Read the docstring aloud to a stranger & rewrite; reduce to 3–7 tools; add explicit routing guidance.' },
  { s: 'Agent ignores instructions partway through', c: 'Context window filling up — instructions pushed out; history accumulating too much data.', f: 'Trim bloated tool results; turn off memory_enabled if stateless; shorten instructions to <500 tokens.' },
  { s: 'Agent confidently gives wrong info (hallucination)', c: 'Responds without calling a tool/KB, or tool returned nothing but it answered anyway.', f: 'Add explicit fallback (“If no data, say so; do NOT guess”); make tools return explicit “not found”.' },
  { s: 'Works in preview, fails in production', c: 'Draft has different tools/agents than Live; connections configured for Draft only.', f: 'Run connections list in both envs; confirm tool imports in the right env; check Live credentials.' },
  { s: 'Multi-agent routes everything to one specialist', c: 'That collaborator’s description too broad, others too vague, or supervisor omits some.', f: 'Tighten the over-broad description with exclusions; strengthen others with trigger phrases.' },
  { s: 'Context length error / max tokens exceeded', c: 'A tool returned an enormous payload — a hard failure that stops the run.', f: 'Find the tool call in the trace, check result size; add pagination & limits; return summaries.' },
]

export default function Monitor() {
  return (
    <PhaseShell phase={phase} toc={toc} tagline="Traces, observability & governance. You cannot improve what you cannot see.">
      <Reveal as="section" className="reveal">
        <div id="what" />
        <h3>What to monitor in an agentic system</h3>
        <DataTable
          first="strong"
          head={['Signal', 'What it tells you']}
          rows={[
            ['Traces', 'Step-by-step log of what the agent did each run'],
            ['Tool call accuracy', 'Did it call the right tools in the right order?'],
            ['Latency', 'How long does each run take? Where is the slowdown?'],
            ['Error rate', 'How often does it fail or hallucinate?'],
            ['Fallback rate', 'How often does it say “I don’t know”?'],
            ['User satisfaction', 'Thumbs up / down from the chat interface'],
          ]}
        />
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="traces" />
        <h3>Using traces</h3>
        <p className="prose">Traces are the most powerful debugging tool for agents. Via the ADK:</p>
        <CodeBlock lang="bash" title="Search recent traces" code={`orchestrate observability traces search \\
  --agent-name hr_assistant \\
  --last 1h

# Or by time window
orchestrate observability traces search \\
  --agent-name hr_assistant \\
  --from 2024-01-15T09:00:00Z \\
  --to 2024-01-15T18:00:00Z`} />
        <CodeBlock lang="text" title="What a trace shows (read top to bottom)" code={`Run: abc-123
  |- [User Input] "How many leave days do I have?"
  |- [LLM Call] "Deciding to call get_leave_balance..."
  |- [Tool Call] get_leave_balance(employee_id="E12345")
  |     |- [Result] "15 days annual, 5 days sick"
  |- [LLM Call] "Formatting response..."
  |- [Response] "You have 15 annual and 5 sick days remaining."`} />
        <Callout kind="key" title="The golden rule of agent debugging">
          Start from the <strong>trace</strong>, not from the code. There is no stack trace — the failure might be in the instructions,
          the tool description, the data returned, or the model itself.
        </Callout>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="perf" />
        <h3>Performance monitoring</h3>
        <p className="prose">Key latency budgets to establish:</p>
        <DataTable
          first="strong"
          head={['Agent type', 'Target latency']}
          rows={[
            ['Simple Q&A agent', 'Under 3 seconds'],
            ['Tool-calling agent', 'Under 8 seconds per tool call'],
            ['Multi-agent system', 'Under 15 seconds total'],
            ['Workflow', 'Minutes to hours (async, use instance IDs)'],
          ]}
        />
        <p className="prose muted">Where latency hides: slow external APIs, LLM inference time (right-size the model), and context window size (are you flooding the model?).</p>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="cycle" />
        <h3>The ongoing improvement cycle</h3>
        <FlowRow accent="var(--c-monitor)" steps={[
          { title: 'Deploy', sub: 'ship the change' },
          { title: 'Monitor traces', sub: 'watch real runs' },
          { title: 'Identify failures', sub: 'find the weak spots' },
          { title: 'Update & re-test', sub: 'close the loop' },
        ]} />
        <Callout kind="tip" title="A monthly health-check cadence">
          Review failure traces from the past 30 days · check tool-call accuracy · identify the top 3 poorly-handled queries ·
          update the knowledge base · re-run evaluations · check for LLM or tool updates.
        </Callout>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="playbook" />
        <h3>Debugging playbook: when things go wrong</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {symptoms.map((sy, i) => (
            <Card key={i} accent="var(--c-monitor)">
              <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
                <span className="mono" style={{ color: 'var(--c-monitor)', fontSize: '0.8rem' }}>{String(i + 1).padStart(2, '0')}</span>
                <strong style={{ color: '#fff', fontSize: '1.02rem' }}>{sy.s}</strong>
              </div>
              <div style={{ marginTop: 12, paddingLeft: 26 }}>
                <p className="muted" style={{ margin: 0, fontSize: '0.9rem' }}><strong style={{ color: 'var(--amber)' }}>Likely cause · </strong>{sy.c}</p>
                <p className="muted" style={{ margin: '8px 0 0', fontSize: '0.9rem' }}><strong style={{ color: 'var(--green)' }}>Fix · </strong>{sy.f}</p>
              </div>
            </Card>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="check" />
        <h3>Knowledge check</h3>
        <Quiz accent="var(--c-monitor)" questions={[
          {
            level: 'Easy',
            q: 'The golden rule of agent debugging is…',
            options: ['Start from the code', 'Start from the trace', 'Restart the agent', 'Increase the context window'],
            answer: 1,
            why: 'There is no stack trace — begin from the run trace to see where behaviour deviated, then work back to the cause.',
          },
          {
            level: 'Easy',
            q: 'What is a healthy latency target for a simple Q&A agent?',
            options: ['Under 3 seconds', 'Under 60 seconds', 'Minutes', 'No target needed'],
            answer: 0,
            why: 'Simple Q&A should be under ~3s; tool-calling under ~8s per call; multi-agent under ~15s total.',
          },
          {
            level: 'Medium', scenario: true,
            q: 'An agent behaves early in a conversation but drifts after several turns. First thing to check?',
            options: ['The favicon', 'Context accumulation / window filling up', 'The channel', 'The LLM vendor'],
            answer: 1,
            why: 'Later-turn drift usually means the context window is filling with history and bloated tool results — trim them.',
          },
          {
            level: 'Hard', scenario: true,
            q: 'The trace shows the agent answered a policy question confidently without ever calling the knowledge base — and it was wrong. Best fix?',
            options: ['Use a bigger model', 'Add explicit fallback instructions and make tools return an explicit “not found”', 'Turn on react style', 'Add more collaborators'],
            answer: 1,
            why: 'It fell back to LLM knowledge. Tell it “if no data is found, say so — do not guess”, and never leave an empty return path from a tool.',
          },
          {
            level: 'Hard', scenario: true,
            q: 'A trace shows a long gap between a tool call and its response. Most likely cause?',
            options: ['The prompt is too short', 'A slow external API behind that tool', 'The user typed slowly', 'Too few tools'],
            answer: 1,
            why: 'Gaps between call and response point at the tool’s external dependency. Add timeouts, cache hot data, or reduce the payload it fetches.',
          },
          {
            level: 'Expert',
            q: 'You need to debug a single agentic-workflow run node-by-node with timing. Where do you go?',
            options: ['The agent’s chat preview', 'The Flow Inspector', 'The connections list', 'The channel settings'],
            answer: 1,
            why: 'The Flow Inspector is the purpose-built visual view of one workflow run — execution history, per-node timing, and where it went wrong.',
          },
        ]} />
      </Reveal>
    </PhaseShell>
  )
}
