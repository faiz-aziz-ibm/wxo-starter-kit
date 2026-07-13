import { Link } from 'react-router-dom'
import '../styles/roadmap.css'
import { roadmap } from '../data/phases'
import { PhaseShell } from '../components/PhaseHero'
import { Reveal, Callout, H2, Card } from '../components/Primitives'
import { ArchStack, ArchNode, DownArrow } from '../components/Diagrams'
import {
  IconArrow, IconClock, IconCalculator, IconDownload, IconArrowUpRight,
  IconCheck, IconTrophy, IconSpark, IconRoute, IconTerminal,
} from '../icons/Icons'

const toc = [
  { id: 'how', label: 'How to use this' },
  { id: 'path', label: 'The 8-step path' },
  { id: 'example', label: 'The worked example' },
  { id: 'python-first', label: 'Great first tools' },
  { id: 'toolkit', label: 'Architect toolkit' },
  { id: 'curator', label: 'Who made this' },
]

type Tier = 'Understand' | 'Build' | 'Scale' | 'Ship' | 'Pro'
const tierColor: Record<Tier, string> = {
  Understand: 'var(--c-foundations)',
  Build: 'var(--c-build)',
  Scale: 'var(--purple)',
  Ship: 'var(--c-deploy)',
  Pro: 'var(--green)',
}

type Level = {
  n: number; tier: Tier; title: string; time: string
  body: string; learn: string[]; links: { label: string; to: string }[]
}

const levels: Level[] = [
  {
    n: 0, tier: 'Understand', title: 'Get the mental model', time: '~30 min',
    body: 'Before touching a keyboard, learn what an agent actually is and when you even need one. No code — just clarity. This is the one part everyone should read.',
    learn: ['What is an agent', 'The agentic spectrum'],
    links: [{ label: 'Foundations', to: '/foundations' }],
  },
  {
    n: 1, tier: 'Build', title: 'Write one Python tool', time: '~1 hr',
    body: 'Build a single deterministic tool — a UK take-home-pay calculator. Why start here? LLMs are unreliable at exact arithmetic, so maths belongs in a tool, not the model. You now have a superpower an agent can call.',
    learn: ['Python tools', 'verb_noun_context naming', 'Clear docstrings'],
    links: [{ label: 'Build · Tools', to: '/build' }],
  },
  {
    n: 2, tier: 'Build', title: 'Wrap it in a single agent', time: '~1 hr',
    body: 'Create one agent — “PayBot” — that uses your calculator to answer “what’s my take-home on £45,000?”. One agent, one tool, clear instructions. Test it in the chat preview.',
    learn: ['Your first agent', 'Agent styles', 'Instructions vs description'],
    links: [{ label: 'Build · First agent', to: '/build' }],
  },
  {
    n: 3, tier: 'Scale', title: 'Grow the agent', time: '~half day',
    body: 'Add more tools — National Insurance, student loan, pension relief — and a knowledge base of the current tax bands so answers stay grounded. Keep it to 3–7 tools; more than that and tool selection starts to slip.',
    learn: ['Knowledge bases', 'The 3–7 tool rule', 'Grounding'],
    links: [{ label: 'Build · Knowledge bases', to: '/build' }, { label: 'Anti-pattern: Tool Soup', to: '/anti-patterns#ap-5' }],
  },
  {
    n: 4, tier: 'Scale', title: 'Split into a team', time: '~1 day',
    body: 'PayBot is doing too much. Break it into specialists — an Income Tax agent, an NI agent, a Pension agent — with a Supervisor that routes by intent. This is where good names and descriptions become load-bearing.',
    learn: ['Multi-agent systems', 'Supervisor routing', 'Descriptions drive routing'],
    links: [{ label: 'Design · Patterns', to: '/design' }, { label: 'Build · Multi-agent', to: '/build' }],
  },
  {
    n: 5, tier: 'Scale', title: 'Add a workflow', time: '~1 day',
    body: 'A salary-sacrifice request needs manager approval before it’s applied — a deterministic, human-in-the-loop step. That’s not a job for a free-reasoning agent; it’s an agentic workflow with a User Activity node.',
    learn: ['Agentic workflows', 'Human-in-the-loop', 'When NOT to use an agent'],
    links: [{ label: 'Build · Workflows', to: '/build' }, { label: 'Anti-pattern: Agent-as-Process', to: '/anti-patterns#ap-4' }],
  },
  {
    n: 6, tier: 'Ship', title: 'Test, deploy & watch', time: '~2 days',
    body: 'Prove it works with functional tests, an evaluation dataset and a red-teaming pass. Then deploy to a channel, and read the traces of real conversations to find the weak spots.',
    learn: ['Three levels of testing', 'Channels & environments', 'Traces & debugging'],
    links: [{ label: 'Test', to: '/test' }, { label: 'Deploy', to: '/deploy' }, { label: 'Monitor', to: '/monitor' }],
  },
  {
    n: 7, tier: 'Pro', title: 'Go Pro', time: 'ongoing',
    body: 'Share tools across your org with MCP toolkits, promote through environments with CI/CD, and let your AI assistant help you build using the Architect Toolkit below. You are now a wxO Pro.',
    learn: ['MCP toolkits', 'CI/CD promotion', 'The Architect Toolkit'],
    links: [{ label: 'MCP Servers', to: '/mcp' }],
  },
]

const usecases = [
  { icon: IconCalculator, title: 'Take-home pay & tax', body: 'Income tax, NI, pension relief — exact arithmetic the model must never guess.' },
  { icon: IconCalculator, title: 'Loan & mortgage maths', body: 'Repayments, interest, affordability. Deterministic formulas, deterministic answers.' },
  { icon: IconClock, title: 'SLA & deadline dates', body: 'Working-day calculations, due dates, escalation timers — precise date logic.' },
  { icon: IconRoute, title: 'Unit & currency conversion', body: 'Convert reliably against live or fixed rates, with the rounding you control.' },
]

export default function Roadmap() {
  return (
    <PhaseShell phase={roadmap} toc={toc} tagline="Your personal, staged learning plan — from your first Python tool to a full multi-agent system. If you don’t know where to start, start here.">
      <Reveal as="section" className="reveal">
        <div id="how" />
        <h3>You don’t need to learn it all at once</h3>
        <p className="rm-intro">
          watsonx Orchestrate is big — but you become a Pro by shipping one small thing, then growing it.
          This roadmap follows a single running example (a UK take-home-pay assistant) as it grows from one
          Python tool into a tested, deployed, multi-agent system. Do the levels in order, or jump to the one you need.
        </p>
        <div className="rm-tiers">
          {(Object.keys(tierColor) as Tier[]).map((t) => (
            <span className="rm-tier" key={t}><span className="d" style={{ background: tierColor[t] }} />{t}</span>
          ))}
        </div>
        <Callout kind="tip" title="Avoid the firehose">
          Resist the urge to build the whole thing on day one. Every level below adds exactly one new concept.
          That’s deliberate — it’s how you stay oriented instead of overwhelmed.
        </Callout>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="path" />
        <H2 eyebrow="The path">Zero to Pro, in eight steps</H2>
        <div className="rm-track">
          {levels.map((lv) => (
            <Reveal key={lv.n} className="rm-level" delay={40}>
              <RmLevel lv={lv} />
            </Reveal>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="example" />
        <h3>Watch the example grow</h3>
        <p className="prose">
          The same use case carries you through the whole journey. It starts as one agent calling one tool — and
          ends as a routed team of specialists. Nothing is wasted; each stage builds on the last.
        </p>
        <div className="rm-grow">
          <div className="rm-grow-col">
            <div className="rm-grow-cap">Levels 1–3 · one agent</div>
            <ArchStack>
              <ArchNode title="PayBot" sub="take-home, NI, pension tools + tax-band KB" tone="primary" wide />
            </ArchStack>
          </div>
          <div className="rm-grow-arrow"><IconArrow width={26} height={26} /></div>
          <div className="rm-grow-col">
            <div className="rm-grow-cap">Levels 4–5 · a team</div>
            <ArchStack>
              <ArchNode title="Payroll Supervisor" sub="routes by intent" tone="primary" wide />
              <DownArrow />
              <div className="arch-row">
                <ArchNode title="Income Tax" />
                <ArchNode title="NI" />
                <ArchNode title="Pension" />
              </div>
            </ArchStack>
          </div>
        </div>
        <Callout kind="key" title="The lesson threaded through the example">
          Start as simple as the use case allows, and only add structure when a real limitation forces it.
          A tool becomes an agent; an over-loaded agent becomes a team; a deterministic step becomes a workflow.
        </Callout>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="python-first" />
        <h3>Great first projects (all Python tools)</h3>
        <p className="prose">
          The best first builds are deterministic ones — where there’s a single correct answer the LLM should never
          improvise. Put the logic in a Python tool and let the agent call it.
        </p>
        <div className="grid-2">
          {usecases.map((u, i) => (
            <Reveal key={i} delay={i * 70}>
              <Card className="rm-usecase" hover accent="var(--teal)">
                <div className="rm-usecase-icon"><u.icon width={22} height={22} /></div>
                <h4>{u.title}</h4>
                <p>{u.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
        <Callout kind="warning" title="Why not just ask the model?">
          LLMs predict text; they don’t compute. Ask one for “income tax on £52,340 at 2024/25 rates” and it will
          often produce a confident, wrong number. A five-line Python tool gets it right every time — and you can test it.
        </Callout>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="toolkit" />
        <H2 eyebrow="Level up faster">The wxO Architect Toolkit</H2>
        <div className="rm-download">
          <div className="rm-download-grid">
            <div>
              <h3>Meet Bob — your wxO Agent Architect</h3>
              <p>
                A ready-to-drop <span className="icode">.bob</span> folder that turns your coding assistant into
                <strong> Bob</strong>, the <strong>WXO Agent Architect</strong>. You get his architect mode, the two
                <strong> ADK MCP servers</strong> (docs + platform), and four <strong>wxO skills</strong> for the full build loop.
              </p>
              <div className="rm-download-items">
                {['WXO Agent Architect mode', 'ADK Docs MCP', 'ADK Platform MCP', 'solution-architect', 'sop-builder', 'wxo-builder', 'wxo-analyzer'].map((t) => (
                  <span className="rm-chip" key={t}>{t}</span>
                ))}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <img className="rm-bob" src="./bob_logo.svg" alt="Bob, the WXO Agent Architect mascot" />
              <a className="rm-dl-btn" href="./downloads/wxo-architect-toolkit.zip" download>
                <IconDownload width={20} height={20} /> Download toolkit
              </a>
              <div className="rm-dl-sub">.zip · ~57&nbsp;KB · includes setup guide</div>
            </div>
          </div>
        </div>
        <div className="grid-3" style={{ marginTop: 18 }}>
          <Card accent="var(--blue)"><div className="rm-usecase-icon" style={{ color: 'var(--blue)', background: 'color-mix(in srgb, var(--blue) 14%, transparent)' }}><IconTerminal width={20} height={20} /></div><h4 style={{ margin: '0 0 4px' }}>1 · Drop it in your working dir</h4><p className="muted" style={{ fontSize: '0.88rem', margin: 0 }}>Unzip and place the <span className="icode">.bob</span> folder in your project root.</p></Card>
          <Card accent="var(--purple)"><div className="rm-usecase-icon" style={{ color: 'var(--purple)', background: 'color-mix(in srgb, var(--purple) 14%, transparent)' }}><IconSpark width={20} height={20} /></div><h4 style={{ margin: '0 0 4px' }}>2 · It loads automatically</h4><p className="muted" style={{ fontSize: '0.88rem', margin: 0 }}>The Architect mode, wxO skills, and both MCP servers wire themselves in.</p></Card>
          <Card accent="var(--green)"><div className="rm-usecase-icon" style={{ color: 'var(--green)', background: 'color-mix(in srgb, var(--green) 14%, transparent)' }}><IconCheck width={20} height={20} /></div><h4 style={{ margin: '0 0 4px' }}>3 · Pick Architect mode &amp; build</h4><p className="muted" style={{ fontSize: '0.88rem', margin: 0 }}>Select the WXO Agent Architect mode and start building conversationally.</p></Card>
        </div>
        <p className="prose muted" style={{ marginTop: 14, display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link to="/mcp" className="xref">Full detail on these MCP servers<IconArrowUpRight width={13} height={13} /></Link>
        </p>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="curator" />
        <h3>Who curated this</h3>
        <div className="curator">
          <div className="curator-avatar">FA</div>
          <div>
            <div className="curator-name">Faiz Aziz</div>
            <div className="curator-role">Data &amp; AI Delivery Consultant · IBM Expert Labs</div>
            <a className="curator-mail" href="mailto:faiz.aziz@ibm.com">faiz.aziz@ibm.com</a>
          </div>
          <div style={{ marginLeft: 'auto', color: 'var(--green)', opacity: 0.85 }}><IconTrophy width={30} height={30} /></div>
        </div>
      </Reveal>
    </PhaseShell>
  )
}

function RmLevel({ lv }: { lv: Level }) {
  const color = tierColor[lv.tier]
  return (
    <>
      <div className="rm-rail" style={{ ['--accent' as string]: color }}>
        <div className="rm-node">{lv.n}</div>
        <div className="rm-line" />
      </div>
      <div className="rm-card" style={{ ['--accent' as string]: color }}>
        <div className="rm-card-top">
          <span className="rm-tierbadge" style={{ ['--accent' as string]: color }}>{lv.tier}</span>
          <h3>{lv.title}</h3>
          <span className="rm-time"><IconClock width={13} height={13} />{lv.time}</span>
        </div>
        <p>{lv.body}</p>
        <div className="rm-learn">
          <span className="rm-learn-label">You’ll learn</span>
          {lv.learn.map((c) => <span className="rm-chip" key={c}>{c}</span>)}
          <span className="rm-links">
            {lv.links.map((l) => (
              <Link key={l.to + l.label} to={l.to} className="xref">{l.label}<IconArrowUpRight width={12} height={12} /></Link>
            ))}
          </span>
        </div>
      </div>
    </>
  )
}
