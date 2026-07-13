import { Link } from 'react-router-dom'
import '../styles/roadmap.css'
import { roadmap } from '../data/phases'
import { PhaseShell } from '../components/PhaseHero'
import { Reveal, Callout, H2, Card, Pill } from '../components/Primitives'
import { ArchStack, ArchNode, DownArrow } from '../components/Diagrams'
import { CodeTabs } from '../components/CodeTabs'
import { CodeBlock } from '../components/CodeBlock'
import {
  IconArrow, IconClock, IconCalculator, IconDownload, IconArrowUpRight,
  IconCheck, IconTrophy, IconSpark, IconRoute, IconTerminal,
  IconChat, IconPlug, IconShield, IconGauge,
} from '../icons/Icons'

const toc = [
  { id: 'how', label: 'How to use this' },
  { id: 'path', label: 'The 8-step path' },
  { id: 'example', label: 'The worked example' },
  { id: 'python-first', label: 'Starter recipes' },
  { id: 'pro-playbook', label: 'What “Pro” looks like' },
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
    body: 'Channels everywhere, your own MCP server on Code Engine, custom API-filtering tools, evals as a release gate, and red-teaming. Share tools across the org and let the Architect Toolkit build with you.',
    learn: ['Channels', 'Own MCP server', 'Evals & red-teaming', 'CI/CD'],
    links: [{ label: 'The Pro playbook', to: '/roadmap#pro-playbook' }, { label: 'MCP Servers', to: '/mcp' }],
  },
]

const usecases = [
  { icon: IconCalculator, title: 'Take-home pay & tax', region: 'UK example', body: 'Income tax, NI, pension relief — exact arithmetic the model must never guess. Swap in your own country’s bands.' },
  { icon: IconRoute, title: 'Currency & unit conversion', region: 'Any region', body: 'Convert reliably against live or fixed rates, with the rounding you control.' },
  { icon: IconClock, title: 'Deadlines & working days', region: 'Any region', body: 'Due dates, SLA timers, “5 business days from now” — precise calendar logic, holidays included.' },
  { icon: IconCalculator, title: 'Bill split & tip', region: 'Any region', body: 'Split a total across people, apply a tip or tax, round per person — universally understandable.' },
]

/* Copyable starter recipes — region-neutral so anyone can follow along. */
const recipeBillSplit = {
  py: `from ibm_watsonx_orchestrate.agent_builder.tools import tool

@tool
def split_bill(total: float, people: int, tip_percent: float = 0.0) -> str:
    """
    Splits a bill evenly, optionally adding a tip.
    Args:
        total (float): The bill total before tip, in any currency.
        people (int): Number of people splitting the bill (>= 1).
        tip_percent (float): Tip to add, as a percentage. Default 0.
    Returns:
        str: The per-person amount and the grand total.
    """
    if people < 1:
        return "Need at least one person to split the bill."
    grand = round(total * (1 + tip_percent / 100), 2)
    each = round(grand / people, 2)
    return f"Total with {tip_percent:g}% tip: {grand}. Each of {people} pays {each}."`,
  yaml: `spec_version: v1
kind: native
name: bill_splitter
llm: groq/openai/gpt-oss-120b
style: default
description: Splits bills evenly and applies tips for a group.
instructions: |
  Help the user split a bill. Always call split_bill for the maths —
  never calculate it yourself. Ask for the total and number of people
  if they are missing. Keep replies to one short sentence.
tools:
  - split_bill`,
}
const recipeWorkingDays = {
  py: `from datetime import date, timedelta
from ibm_watsonx_orchestrate.agent_builder.tools import tool

@tool
def due_date(business_days: int, holidays: str = "") -> str:
    """
    Returns the date that is N business days from today (skips weekends).
    Args:
        business_days (int): Number of working days ahead (>= 0).
        holidays (str): Comma-separated ISO dates to also skip, e.g.
                        "2025-12-25,2026-01-01". Optional.
    Returns:
        str: The resulting ISO date and weekday.
    """
    skip = {h.strip() for h in holidays.split(",") if h.strip()}
    d, added = date.today(), 0
    while added < business_days:
        d += timedelta(days=1)
        if d.weekday() < 5 and d.isoformat() not in skip:
            added += 1
    return f"Due {d.isoformat()} ({d.strftime('%A')})."`,
  yaml: `spec_version: v1
kind: native
name: sla_agent
llm: groq/openai/gpt-oss-120b
style: default
description: Calculates SLA due dates in working days for support tickets.
instructions: |
  When a user asks when something is due, call due_date with the number
  of business days. Do NOT count days yourself. Mention the weekday so
  they can plan. Pass known public holidays if the user names them.
tools:
  - due_date`,
}

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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="rm-usecase-icon"><u.icon width={22} height={22} /></div>
                  <Pill tone={u.region === 'Any region' ? 'green' : 'blue'}>{u.region}</Pill>
                </div>
                <h4>{u.title}</h4>
                <p>{u.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
        <Callout kind="warning" title="Why not just ask the model?">
          LLMs predict text; they don’t compute. Ask one for “tax on 52,340 at this year’s rates” — or even “what’s 15% of
          847.50 split three ways” — and it will often produce a confident, wrong number. A few lines of Python get it right
          every time, and you can test it.
        </Callout>

        <h4 style={{ marginTop: 28 }}>Copy a recipe and go</h4>
        <p className="prose">
          Two complete, region-neutral starters. Each is a <strong>Python tool</strong> plus the <strong>agent YAML</strong> that uses it —
          copy both, import them, and you have a working agent. Flip the tabs to see each half.
        </p>
        <h4 style={{ color: 'var(--teal)', fontSize: '0.95rem' }}>Recipe 1 · Bill splitter</h4>
        <CodeTabs tabs={[
          { label: 'split_bill.py', lang: 'python', code: recipeBillSplit.py },
          { label: 'bill_splitter.agent.yaml', lang: 'yaml', code: recipeBillSplit.yaml },
        ]} />
        <h4 style={{ color: 'var(--teal)', fontSize: '0.95rem' }}>Recipe 2 · Working-days due date</h4>
        <CodeTabs tabs={[
          { label: 'due_date.py', lang: 'python', code: recipeWorkingDays.py },
          { label: 'sla_agent.agent.yaml', lang: 'yaml', code: recipeWorkingDays.yaml },
        ]} />
        <Callout kind="tip" title="Import them in two commands">
          <span className="icode">orchestrate tools import -k python -f split_bill.py</span> then
          <span className="icode"> orchestrate agents import -f bill_splitter.agent.yaml</span> — chat to it with
          <span className="icode"> orchestrate chat ask --agent-name bill_splitter</span>.
        </Callout>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="pro-playbook" />
        <H2 eyebrow="Level 7, expanded">What “Pro” really looks like</H2>
        <p className="prose">
          “Pro” isn’t about bigger prompts — it’s about production muscle. Once your agents work, these are the moves that
          separate a demo from a dependable system.
        </p>
        <div className="grid-2" style={{ margin: '18px 0' }}>
          {[
            { icon: IconChat, c: 'var(--c-monitor)', t: 'Meet users where they are', d: 'Publish the same agent to Slack, Teams, WhatsApp, web embed or the API — one build, many channels.', to: '/deploy' },
            { icon: IconPlug, c: 'var(--c-mcp)', t: 'Build & host your own MCP server', d: 'Wrap your internal APIs as an MCP toolkit, containerise it, and run it on IBM Code Engine so every agent can reuse it.', to: '/mcp' },
            { icon: IconRoute, c: 'var(--teal)', t: 'Custom API-filtering tools', d: 'Don’t hand raw API JSON to the model. A Python tool calls the endpoint, filters to the fields that matter, and returns a tight summary.', to: '/build' },
            { icon: IconGauge, c: 'var(--c-test)', t: 'Evals as a release gate', d: 'Record real conversations, run the evaluation framework in CI, and block promotion when journey success drops.', to: '/test' },
            { icon: IconShield, c: 'var(--red)', t: 'Red-team before you ship', d: 'Plan and run attack scenarios — prompt injection, data leakage, policy bypass — and fix what leaks.', to: '/test' },
            { icon: IconSpark, c: 'var(--green)', t: 'Let Bob build with you', d: 'Use the Architect Toolkit so your assistant scaffolds agents, tools and flows against the live ADK.', to: '/mcp' },
          ].map((p, i) => (
            <Reveal key={i} delay={i * 50}>
              <Link to={p.to} className="card card-hover rm-usecase" style={{ ['--accent' as string]: p.c, display: 'block' }}>
                <div className="rm-usecase-icon" style={{ color: p.c, background: `color-mix(in srgb, ${p.c} 14%, transparent)` }}><p.icon width={22} height={22} /></div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{p.t} <IconArrowUpRight width={15} height={15} style={{ color: p.c }} /></h4>
                <p>{p.d}</p>
              </Link>
            </Reveal>
          ))}
        </div>
        <h4>The custom API-filtering tool, in full</h4>
        <p className="prose">
          This is the single highest-leverage Pro habit: never let a raw endpoint response reach the model. Call the API,
          keep only what matters, and return a short string.
        </p>
        <CodeBlock lang="python" title="filter_orders.py — trim before you return" code={`import requests
from ibm_watsonx_orchestrate.agent_builder.tools import tool

@tool
def recent_orders(customer_id: str, limit: int = 3) -> str:
    """
    Returns a short summary of a customer's most recent orders.
    Args:
        customer_id (str): The customer's unique ID.
        limit (int): How many recent orders to return. Default 3.
    Returns:
        str: One line per order — never the raw API payload.
    """
    resp = requests.get(
        f"https://api.internal/customers/{customer_id}/orders",
        params={"sort": "-created", "page_size": limit},
        timeout=8,
    )
    resp.raise_for_status()
    orders = resp.json().get("data", [])[:limit]   # cap it hard
    if not orders:
        return "No recent orders found."            # never an empty return
    return "\\n".join(
        f"#{o['id']}: {o['item']} — {o['status']} ({o['total']})"
        for o in orders
    )`} />
        <Callout kind="tip" title="Deploy your MCP server on Code Engine">
          Once your toolkit is a container, IBM Code Engine gives you a scalable HTTPS endpoint with no cluster to manage.
          Register it with <span className="icode">orchestrate toolkits add --kind mcp --transport streamable_http --url …</span> and every
          agent in your org can share it. See <Link to="/mcp" className="xref">MCP Servers<IconArrowUpRight width={13} height={13} /></Link>.
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
