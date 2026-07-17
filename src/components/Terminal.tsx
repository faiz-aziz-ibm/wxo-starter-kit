import { useState, useRef, useEffect, type KeyboardEvent } from 'react'
import '../styles/terminal.css'
import { IconCheck, IconX, IconArrow, IconTerminal, IconSpark } from '../icons/Icons'

/* ============================================================
   IdeMockup — a static, labelled picture of a code editor with its
   terminal, so non-technical readers can see WHERE the CLI is run.
   ============================================================ */
export function IdeMockup() {
  return (
    <div className="ide">
      <div className="ide-chrome">
        <span className="ide-dot r" /><span className="ide-dot y" /><span className="ide-dot g" />
        <span className="ide-title">wxo-take-home-pay — Visual Studio Code</span>
      </div>
      <div className="ide-body">
        <aside className="ide-tree">
          <div className="ide-tree-h">Explorer</div>
          {['▾ wxo-take-home-pay', '  ▾ agents', '    payroll.agent.yaml', '  ▾ tools', '    calculate_tax.py', '  requirements.txt', '  .env'].map((f, i) => (
            <div key={i} className={`ide-file ${f.includes('.py') || f.includes('.yaml') ? 'code' : ''}`}>{f}</div>
          ))}
        </aside>
        <div className="ide-main">
          <div className="ide-editor">
            <div className="ide-tab">calculate_tax.py</div>
            <pre className="ide-code"><span className="tk-kw">@tool</span>{'\n'}<span className="tk-kw">def</span> <span className="tk-fn">calculate_tax</span>(salary: <span className="tk-ty">float</span>) -&gt; <span className="tk-ty">str</span>:{'\n'}    <span className="tk-str">"""Return the income tax due."""</span>{'\n'}    ...</pre>
          </div>
          <div className="ide-term">
            <div className="ide-term-h"><IconTerminal width={13} height={13} /> TERMINAL</div>
            <div className="ide-term-body">
              <div><span className="t-prompt">➜ wxo-take-home-pay $</span> orchestrate env activate my-env</div>
              <div className="t-ok">✓ Environment 'my-env' is now active</div>
              <div><span className="t-prompt">➜ wxo-take-home-pay $</span> orchestrate tools import -k python -f tools/calculate_tax.py</div>
              <div className="t-ok">✓ Imported tool: calculate_tax</div>
              <div><span className="t-prompt">➜ wxo-take-home-pay $</span> orchestrate chat start</div>
              <div className="t-dim">Opening chat at http://localhost:3000 …<span className="t-caret" /></div>
            </div>
          </div>
        </div>
      </div>
      <div className="ide-callout">
        <IconArrow width={16} height={16} style={{ transform: 'rotate(90deg)' }} />
        The panel at the bottom of a code editor is the <strong>terminal</strong>. It’s where you type the
        <span className="icode"> orchestrate</span> commands you see throughout this guide — one line, press Enter, read the result.
      </div>
    </div>
  )
}

/* ============================================================
   CliTrainer — an interactive terminal. Read the task, type the
   orchestrate command, press Enter. Forgiving matching (small
   mistakes allowed): it checks the important tokens are present.
   ============================================================ */
type Challenge = { task: string; must: string[]; answer: string }

/* Canonical commands verified against the ADK CLI docs. `must` = the tokens that
   must appear (forgiving of flag order / placeholders); `answer` drives the
   progressive hint. Ordered roughly basics -> advanced. */
const CHALLENGES: Challenge[] = [
  { task: 'Register a new environment called "prod" (any service URL).',
    must: ['env', 'add', 'prod'], answer: 'orchestrate env add -n prod -u <url>' },
  { task: 'Authenticate (activate) against the "prod" environment.',
    must: ['env', 'activate', 'prod'], answer: 'orchestrate env activate prod' },
  { task: 'Start the local Developer Edition server from an .env file.',
    must: ['server', 'start'], answer: 'orchestrate server start -e .env' },
  { task: 'Import a Python tool from the file tax.py.',
    must: ['tools', 'import', 'python', 'tax.py'], answer: 'orchestrate tools import -k python -f tax.py' },
  { task: 'List the tools in the active environment.',
    must: ['tools', 'list'], answer: 'orchestrate tools list' },
  { task: 'Import the agent defined in payroll.agent.yaml.',
    must: ['agents', 'import', 'payroll.agent.yaml'], answer: 'orchestrate agents import -f payroll.agent.yaml' },
  { task: 'Import a knowledge base from tax_kb.yaml.',
    must: ['knowledge-bases', 'import', 'tax_kb.yaml'], answer: 'orchestrate knowledge-bases import -f tax_kb.yaml' },
  { task: 'Start a chat session to test your agent.',
    must: ['chat', 'start'], answer: 'orchestrate chat start' },
  { task: 'Register a connection for an app called "crm".',
    must: ['connections', 'add', 'crm'], answer: 'orchestrate connections add -a crm' },
  { task: 'Set the credentials for the "crm" connection (draft env, a token).',
    must: ['connections', 'set-credentials', 'crm'], answer: 'orchestrate connections set-credentials -a crm --env draft --token <token>' },
  { task: 'Add a remote MCP toolkit called "coingecko".',
    must: ['toolkits', 'add', 'mcp', 'coingecko'], answer: 'orchestrate toolkits add --kind mcp --name coingecko --url <url> --transport sse --tools <tools>' },
  { task: 'Import a model definition from watsonx-model.yaml.',
    must: ['models', 'import'], answer: 'orchestrate models import --file watsonx-model.yaml --app-id <conn>' },
  { task: 'Deploy the "payroll" agent to Live.',
    must: ['agents', 'deploy'], answer: 'orchestrate agents deploy --name payroll' },
  { task: 'Export the "payroll" agent to payroll.zip (to promote it).',
    must: ['agents', 'export', 'payroll'], answer: 'orchestrate agents export --name payroll -o payroll.zip' },
  { task: 'Record the next chat session into an evaluation dataset.',
    must: ['evaluations', 'record'], answer: 'orchestrate evaluations record --output-dir ./chat_recordings' },
  { task: 'List the available red-teaming attack types.',
    must: ['evaluations', 'red-teaming'], answer: 'orchestrate evaluations red-teaming list-attacks' },
  { task: 'Search the last hour of run traces for the agent "payroll".',
    must: ['observability', 'traces', 'search', 'payroll'], answer: 'orchestrate observability traces search --agent-name payroll --last 1h' },
  { task: 'Re-run an agent import with verbose debug logging turned on.',
    must: ['--debug', 'agents', 'import'], answer: 'orchestrate --debug agents import -f payroll.agent.yaml' },
  { task: 'Show the help for the connections command group.',
    must: ['connections', 'help'], answer: 'orchestrate connections --help' },
]

type Line = { cmd: string; ok: boolean; note: string }

export function CliTrainer() {
  const [idx, setIdx] = useState(0)
  const [input, setInput] = useState('')
  const [lines, setLines] = useState<Line[]>([])
  const [score, setScore] = useState(0)
  const [tries, setTries] = useState(0)
  const [hintLevel, setHintLevel] = useState(0) // how many tokens of the answer are revealed
  const [done, setDone] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const ch = CHALLENGES[idx]
  const hintTokens = ch.answer.split(' ')
  const fullyRevealed = hintLevel >= hintTokens.length

  useEffect(() => { bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight }) }, [lines, hintLevel])

  const advance = (clean: boolean) => {
    if (clean) setScore((s) => s + 1)
    if (idx + 1 >= CHALLENGES.length) { setDone(true); return }
    setIdx((i) => i + 1); setTries(0); setInput(''); setHintLevel(0)
  }

  const submit = () => {
    const raw = input.trim()
    if (!raw) return
    const norm = raw.toLowerCase().replace(/\s+/g, ' ')
    const missing = ch.must.filter((t) => !norm.includes(t.toLowerCase()))
    const hasPrefix = norm.startsWith('orchestrate')
    if (missing.length === 0) {
      const note = hasPrefix ? 'Correct.' : 'Correct — tip: commands start with `orchestrate`.'
      setLines((l) => [...l, { cmd: raw, ok: true, note }])
      setInput('')
      setTimeout(() => advance(tries === 0 && hintLevel === 0), 550) // clean solve = no retries, no hints
    } else {
      const newTries = tries + 1
      setTries(newTries)
      const note = `Missing: ${missing.join(', ')}. Try the Hint button to reveal the command piece by piece.`
      setLines((l) => [...l, { cmd: raw, ok: false, note }])
      setInput('')
    }
  }

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') submit() }
  const nextHint = () => setHintLevel((h) => Math.min(h + 1, hintTokens.length))
  const skip = () => { setLines((l) => [...l, { cmd: ch.answer, ok: true, note: 'Skipped — answer shown.' }]); setTimeout(() => advance(false), 300) }
  const restart = () => { setIdx(0); setInput(''); setLines([]); setScore(0); setTries(0); setHintLevel(0); setDone(false) }

  if (done) {
    const pct = Math.round((score / CHALLENGES.length) * 100)
    return (
      <div className="cli">
        <div className="cli-chrome"><span className="ide-dot r" /><span className="ide-dot y" /><span className="ide-dot g" /><span className="ide-title"><IconTerminal width={12} height={12} /> ADK CLI Trainer</span></div>
        <div className="cli-done">
          <div className="cli-done-score">{score}<small>/{CHALLENGES.length}</small></div>
          <div>
            <div className="cli-done-title">{pct >= 75 ? 'You can drive the ADK CLI.' : 'Good start — run it again.'}</div>
            <p className="cli-done-msg">{score} solved first try. The rest are worth a second pass — muscle memory is the point.</p>
            <button className="cli-btn solid" onClick={restart}>Run again</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cli" onClick={() => inputRef.current?.focus()}>
      <div className="cli-chrome"><span className="ide-dot r" /><span className="ide-dot y" /><span className="ide-dot g" /><span className="ide-title"><IconTerminal width={12} height={12} /> ADK CLI Trainer</span><span className="cli-progress">{idx + 1}/{CHALLENGES.length}</span></div>
      <div className="cli-task"><span className="cli-task-badge"><IconSpark width={13} height={13} /> Task</span>{ch.task}</div>
      <div className="cli-body" ref={bodyRef}>
        {lines.map((l, i) => (
          <div key={i} className="cli-line">
            <div className="cli-cmd"><span className="t-prompt">➜ ~ $</span> {l.cmd}</div>
            <div className={`cli-note ${l.ok ? 'ok' : 'no'}`}>{l.ok ? <IconCheck width={13} height={13} /> : <IconX width={13} height={13} />}{l.note}</div>
          </div>
        ))}
        {hintLevel > 0 && (
          <div className="cli-hintline">
            <span className="cli-hint-tag">hint</span>
            <code>{hintTokens.slice(0, hintLevel).join(' ')}{!fullyRevealed && <span className="cli-hint-rest"> …</span>}</code>
          </div>
        )}
        <div className="cli-input-row">
          <span className="t-prompt">➜ ~ $</span>
          <input
            ref={inputRef}
            className="cli-input"
            value={input}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            placeholder="type the command, then Enter"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
          />
        </div>
      </div>
      <div className="cli-foot">
        <span className="cli-hint">Small mistakes are fine — it checks the key parts.</span>
        <span className="cli-actions">
          <button className="cli-btn" onClick={skip}>Skip</button>
          <button className="cli-btn" onClick={nextHint} disabled={fullyRevealed}>
            {hintLevel === 0 ? 'Hint' : fullyRevealed ? 'Full command shown' : `Hint (${hintLevel}/${hintTokens.length})`}
          </button>
          <button className="cli-btn solid" onClick={submit}>Run <IconArrow width={13} height={13} /></button>
        </span>
      </div>
    </div>
  )
}
