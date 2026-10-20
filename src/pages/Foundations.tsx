import { allPhases } from '../data/phases'
import { PhaseShell } from '../components/PhaseHero'
import { Reveal, Callout, DataTable, DoDont, Pill, Cite } from '../components/Primitives'
import { FlowRow, Spectrum } from '../components/Diagrams'
import { CodeBlock } from '../components/CodeBlock'
import { Quiz } from '../components/Quiz'
import { foundationsQuiz } from '../data/quizzes'
import { IdeMockup, CliTrainer } from '../components/Terminal'
import { doc } from '../data/docs'

const phase = allPhases.find((p) => p.slug === 'foundations')!

const toc = [
  { id: 'what', label: 'What is agentic AI?' },
  { id: 'agent', label: 'What is an agent?' },
  { id: 'glossary', label: 'Plain-language glossary' },
  { id: 'spectrum', label: 'The agentic spectrum' },
  { id: 'platform', label: 'The platform' },
  { id: 'two-ways', label: 'Two ways to build' },
  { id: 'interface', label: 'Navigating wxO' },
  { id: 'adk', label: 'ADK setup' },
  { id: 'cli-practice', label: 'Practice the CLI' },
  { id: 'check', label: 'Knowledge check' },
]

export default function Foundations() {
  return (
    <PhaseShell phase={phase} toc={toc} tagline="The foundation. Please do not skip this. What agentic AI is, the words you need, and how to find your way around watsonx Orchestrate.">
      <Reveal as="section" className="reveal">
        <div id="what" />
        <div className="eyebrow"><span className="dot" /> 0.1 · The 30-second explanation</div>
        <h2 className="h2" style={{ marginTop: 12 }}>What is agentic AI?</h2>
        <Callout kind="analogy">
          A traditional chatbot is like a <strong>vending machine</strong>: you press a button, it gives you a snack.
          An AI agent is like a <strong>personal assistant</strong>: you say “plan my Friday,” and it checks your calendar,
          books a restaurant, and sends the invite. It reasons, decides, and acts.
        </Callout>
        <p className="prose">
          This guide is written for people who have never built an agent before. It covers the whole lifecycle —
          Design, Build, Test, Deploy, and Monitor — so that by the end you will know not just <em>which buttons to press</em>,
          but <strong>why each decision matters</strong>.
        </p>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="agent" />
        <h3>What actually is an “agent”?</h3>
        <p className="prose">
          An <strong>LLM</strong> (large language model) is a prediction engine trained on text — on its own it can only produce words.
          An <strong>agent</strong> wraps an LLM with a <strong>goal</strong>, a set of <strong>tools</strong> it can call, and <strong>instructions</strong> about how to behave. <Cite href={doc.buildAgent} />
          Three things people often confuse:
        </p>
        <DataTable
          first="strong"
          head={['Thing', 'What it does', 'Takes action?']}
          rows={[
            ['Chatbot', 'Answers questions using the model’s own knowledge', <Pill tone="red">No</Pill>],
            ['Automation / RPA', 'Runs a fixed script the same way every time', <Pill tone="amber">One fixed path</Pill>],
            ['Agent', 'Reasons about a goal, chooses tools, and acts', <Pill tone="green">Yes — it decides how</Pill>],
          ]}
        />
        <p className="prose">Every agent, no matter how complex, does three things in a loop:</p>
        <FlowRow
          accent="var(--c-foundations)"
          steps={[
            { title: 'Perceive', sub: 'Read & understand the request' },
            { title: 'Reason', sub: 'Decide which tool to use & what to pass' },
            { title: 'Act', sub: 'Call the tool, then form a clear reply' },
          ]}
        />
        <p className="prose">
          Agentic AI differs from traditional software because <strong>the path is not written in advance</strong>. The same agent can
          handle an HR onboarding question, a claims query, or an IT ticket — choosing its own route each time based on what the user actually asked.
        </p>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="glossary" />
        <h3>Key concepts glossary (plain language)</h3>
        <DataTable
          first="strong"
          head={['Term', 'Plain-language meaning']}
          rows={[
            ['Agent', 'An AI that can decide what to do and take actions on your behalf'],
            ['Tool', 'A specific capability the agent can call — e.g. search a database or send an email'],
            ['Knowledge Base', 'A library of documents the agent can search and read'],
            ['Workflow / Flow', 'A pre-defined sequence of steps the agent follows, like a flowchart'],
            ['LLM', 'The “brain” of the agent — a large language model such as Granite, GPT, or Llama'],
            ['Instructions', 'The rules and personality you give the agent'],
            ['Draft environment', 'Your development and testing workspace'],
            ['Live environment', 'Production — what real users see'],
            ['ADK', 'Agent Development Kit — the developer CLI and code toolkit for wxO'],
            ['Collaborator', 'Another agent your main agent can hand off tasks to'],
            ['Supervisor agent', 'A top-level agent that routes tasks to the right sub-agent'],
          ]}
        />
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="spectrum" />
        <h3>The agentic AI spectrum</h3>
        <p className="prose">
          Agentic systems sit on a spectrum from simple to sophisticated. <strong>You rarely need the far right.</strong>
          Start as far left as your use case allows.
        </p>
        <Spectrum items={[
          { name: 'Simple Chatbot', sub: 'Q&A only' },
          { name: 'RAG', sub: 'Grounded answers' },
          { name: 'Tool-Using Agent', sub: 'Takes actions' },
          { name: 'Multi-Agent', sub: 'Delegates tasks' },
          { name: 'Autonomous Workflow', sub: 'End-to-end process' },
        ]} />
        <DataTable
          first="strong"
          head={['Your need', 'Right level']}
          rows={[
            ['Answer questions from general knowledge', 'Simple Chatbot'],
            ['Answer questions grounded in your documents', 'RAG'],
            ['Look things up and take a single action', 'Tool-Using Agent'],
            ['Handle several distinct domains with routing', 'Multi-Agent System'],
            ['Run a regulated, multi-step process end to end', 'Autonomous Workflow'],
          ]}
        />
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="platform" />
        <div className="eyebrow"><span className="dot" /> Part 1 · Platform orientation</div>
        <h2 className="h2" style={{ marginTop: 12 }}>What is watsonx Orchestrate?</h2>
        <p className="prose">wxO has two sides that share the same underlying objects:</p>
        <ul className="plain">
          <li><strong>Business Interface (UI)</strong> — a browser-based, low-code way to create, configure, and chat with agents.</li>
          <li><strong>Developer Toolkit (ADK)</strong> — a Python SDK and command-line interface for building the same agents as version-controlled code.</li>
        </ul>
        <p className="prose">
          wxO gives you the runtime, model gateway, connections, channels, evaluation, and observability out of the box.
          What you build on top is your <strong>agents, tools, flows, and knowledge bases</strong>. It fits alongside the wider IBM AI
          ecosystem, including watsonx.ai for models and Watson Assistant for conversational front ends.
        </p>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="two-ways" />
        <h3>The two ways to build</h3>
        <Callout kind="note" title="Set expectations early">
          Both approaches manage the same underlying objects (agents, tools, flows). The <strong>ADK</strong> gives more control and is
          version-controllable. The <strong>UI</strong> is faster to start.
        </Callout>
        <DataTable
          first="strong"
          head={['Approach', 'Best for', 'Requires']}
          rows={[
            ['UI Builder (no/low-code)', 'Business users, simple agents, quick prototypes', 'A browser'],
            ['ADK (CLI + code)', 'Developers, complex agents, CI/CD, team environments', 'Python, terminal'],
          ]}
        />
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="interface" />
        <h3>Navigating the wxO interface</h3>
        <p className="prose">The UI is organised around seven areas — knowing what each is for before you start helps a lot:</p>
        <div className="grid-2" style={{ margin: '18px 0' }}>
          {[
            ['Home / Chat', 'Where end users interact with agents'],
            ['Manage Agents', 'Where builders create and configure agents'],
            ['Tools', 'Where capabilities are registered'],
            ['Knowledge Bases', 'Where documents are stored'],
            ['Connections', 'Where external service credentials are managed'],
            ['Channels', 'Where agents publish to Slack, WhatsApp, web embed & more'],
            ['Evaluations', 'Where agent performance is tested'],
          ].map(([t, d], i) => (
            <div className="card" key={i} style={{ padding: 18 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
                <span className="mono" style={{ color: 'var(--c-foundations)', fontSize: '0.8rem' }}>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <strong style={{ color: 'var(--text)' }}>{t}</strong>
                  <div className="muted" style={{ fontSize: '0.88rem', marginTop: 2 }}>{d}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="adk" />
        <h3>ADK setup (for developers)</h3>
        <p className="prose">
          First, orientation — <strong>where do you actually type these commands?</strong> In a code editor (like VS Code), the
          <strong> terminal</strong> is a panel at the bottom. That’s where the <span className="icode">orchestrate</span> CLI runs:
        </p>
        <IdeMockup />
        <p className="prose">Four commands take you from nothing to a working, authenticated CLI:</p>
        <CodeBlock lang="bash" title="ADK setup" code={`# 1. Install the ADK
pip install ibm-watsonx-orchestrate

# 2. Register your wxO environment (one-time setup)
#    Service instance URL: wxO Settings > API details
orchestrate env add -n my-wxo-env -u <your-service-instance-url>

# 3. Activate (authenticate) against that environment
#    API key: wxO Settings > API details > Generate API key
orchestrate env activate my-wxo-env
# Prompts: "Please enter WXO API key: "

# 4. Verify connection
orchestrate agents list`} />
        <Callout kind="note" title="SaaS sessions expire every two hours">
          Authentication is <span className="icode">orchestrate env add</span> (one-time registration) then
          <span className="icode"> orchestrate env activate</span> (authenticate). On SaaS the session lasts about two hours —
          re-run <span className="icode">orchestrate env activate</span> when it lapses.
        </Callout>
        <h4>What you get with the ADK</h4>
        <DoDont
          dos={[
            'YAML, JSON, or Python-based agent definitions',
            'CLI commands for every resource (agents, tools, flows, KBs)',
            'A local Developer Edition for offline testing',
            'Export and import for version control',
          ]}
          donts={[
            'Assuming a session lasts forever — SaaS expires every 2h',
            'Skipping env registration before activating',
            'Editing production directly — build in Draft',
            'Committing API keys — use connections instead',
          ]}
        />
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="cli-practice" />
        <h3>Practice the CLI</h3>
        <p className="prose">
          The best way to get comfortable is to type the commands yourself. Read each task and enter the
          <span className="icode"> orchestrate</span> command — small mistakes are fine, it checks the important parts.
          Full command reference: <a href={doc.cli} target="_blank" rel="noreferrer" className="xref">ADK CLI docs <span aria-hidden>↗</span></a>
        </p>
        <CliTrainer />
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="check" />
        <h3>Knowledge check</h3>
        <Quiz accent="var(--c-foundations)" questions={foundationsQuiz} docsDefault={doc.buildAgent} />
      </Reveal>
    </PhaseShell>
  )
}
