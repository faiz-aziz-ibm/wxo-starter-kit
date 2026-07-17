import { allPhases } from '../data/phases'
import { PhaseShell } from '../components/PhaseHero'
import { Reveal, Callout, DataTable, Card, XRef, DoDont, Cite } from '../components/Primitives'
import { DecisionFlow, ArchStack, ArchNode, DownArrow } from '../components/Diagrams'
import { CodeBlock } from '../components/CodeBlock'
import { CodeTabs } from '../components/CodeTabs'
import { Quiz } from '../components/Quiz'
import { designQuiz } from '../data/quizzes'
import { doc } from '../data/docs'

const phase = allPhases.find((p) => p.slug === 'design')!

const toc = [
  { id: 'golden', label: 'The golden rule' },
  { id: 'canvas', label: 'Use case canvas' },
  { id: 'tree', label: 'Should this be an agent?' },
  { id: 'patterns', label: 'Architecture patterns' },
  { id: 'how-many-agents', label: 'How many agents?' },
  { id: 'instructions', label: 'Good instructions' },
  { id: 'desc-vs-inst', label: 'Description vs instructions' },
  { id: 'context-vars', label: 'Context variables' },
  { id: 'check', label: 'Knowledge check' },
]

const canvasQs = [
  'What is the business goal?',
  'Who is the user?',
  'What trigger starts the process?',
  'What systems or data does it need?',
  'What decisions does it need to make?',
  'What actions does it take?',
  'What does “success” look like?',
  'What could go wrong?',
  'Does it need human approval? When?',
  'What is NOT in scope?',
]

export default function Design() {
  return (
    <PhaseShell phase={phase} toc={toc} tagline="Architecture & planning. Spend 20% of your time here — it saves the other 80%.">
      <Reveal as="section" className="reveal">
        <div id="golden" />
        <Callout kind="key" title="The golden rule before you build anything">
          Architecture decisions made here will haunt you — or save you — for the entire project.
          Spend <strong>20% of your time designing and 80% building</strong>, not the other way around.
        </Callout>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="canvas" />
        <h3>Start here: the Use Case Design Canvas</h3>
        <p className="prose">
          Fill out this one-page canvas <strong>before writing a single line of code</strong>. If you cannot answer these questions,
          you are not ready to build yet.
        </p>
        <div className="grid-2" style={{ margin: '18px 0' }}>
          {canvasQs.map((q, i) => (
            <Card key={i} className="" accent="var(--c-design)" hover>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span className="mono" style={{ color: 'var(--c-design)', fontSize: '0.82rem' }}>{String(i + 1).padStart(2, '0')}</span>
                <strong style={{ color: '#fff', fontWeight: 500 }}>{q}</strong>
              </div>
            </Card>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="tree" />
        <h3>The “Should this even be an agent?” decision tree</h3>
        <DecisionFlow accent="var(--c-design)" steps={[
          { q: 'Does the task require decisions based on unpredictable inputs?', branches: [
            { label: 'NO', to: 'Use a simple tool, API call, or RPA. Stop here.', tone: 'stop' },
            { label: 'YES', to: 'Continue', tone: 'go' },
          ] },
          { q: 'Does it involve multiple steps that depend on each other’s outputs?', branches: [
            { label: 'NO', to: 'One agent with one tool is probably enough.', tone: 'stop' },
            { label: 'YES', to: 'Continue', tone: 'go' },
          ] },
          { q: 'Are any steps deterministic — always in the same order?', branches: [
            { label: 'YES', to: 'Use an Agentic Workflow for those steps, not a pure agent.', tone: 'stop' },
            { label: 'NO', to: 'Continue', tone: 'go' },
          ] },
          { q: 'Does it involve multiple different domains (HR + Finance + IT)?', branches: [
            { label: 'YES', to: 'Multi-Agent System (Supervisor + Specialists).', tone: 'go' },
            { label: 'NO', to: 'Single Agent with multiple tools.', tone: 'stop' },
          ] },
        ]} />
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="patterns" />
        <h3>Agent architecture patterns</h3>

        <h4>Pattern 1 · Single Agent + Tools <span className="muted">(start here)</span></h4>
        <p className="prose">Use when: one domain, 2–7 tools, moderate complexity.</p>
        <ArchStack label="Single agent">
          <ArchNode title="User" tone="user" />
          <DownArrow />
          <ArchNode title="Single Agent" sub="Granite / GPT · searches DB, sends email, searches KB" tone="primary" wide />
          <DownArrow />
          <ArchNode title="User Response" tone="user" />
        </ArchStack>
        <p className="prose muted">Example: an IT helpdesk agent that searches the knowledge base, creates tickets, and sends notifications.</p>

        <h4 style={{ marginTop: 34 }}>Pattern 2 · Supervisor + Specialists <span className="muted">(scale up)</span></h4>
        <p className="prose">Use when: multiple domains, you need routing logic, two or more distinct task types.</p>
        <ArchStack>
          <ArchNode title="Supervisor Agent" sub="Routes based on intent" tone="primary" wide />
          <DownArrow />
          <div className="arch-row">
            <ArchNode title="HR Agent" sub="leave, onboarding" />
            <ArchNode title="Finance Agent" sub="expenses, reimbursement" />
            <ArchNode title="IT Agent" sub="access, incidents" />
          </div>
        </ArchStack>
        <Callout kind="note" title="Routing is driven by descriptions">
          The Supervisor’s routing depends entirely on each specialist’s <span className="icode">description</span> field.
          Write it as if describing the specialist to another AI that must decide whether to send a task there.
        </Callout>

        <h4 style={{ marginTop: 34 }}>Pattern 3 · Agent + Agentic Workflow <span className="muted">(hybrid)</span></h4>
        <p className="prose">Use when: a mix of open-ended reasoning and deterministic steps, with human approvals needed.</p>
        <ArchStack>
          <ArchNode title="Agent" sub="Collects information, reasons about the request" tone="primary" wide />
          <DownArrow />
          <ArchNode title="Agentic Workflow" sub="Validate → Get Approval (human) → Execute" wide />
        </ArchStack>
        <p className="prose muted">Example: expense approval — the agent collects & validates, the workflow routes to a manager, then executes payment.</p>

        <h4 style={{ marginTop: 34 }}>Pattern 4 · External Agent Integration</h4>
        <p className="prose">Use when: you already have an agent on another platform (Salesforce AgentForce, watsonx.ai, LangGraph, BeeAI).</p>
        <ArchStack>
          <ArchNode title="wxO Native Agent" tone="primary" wide />
          <DownArrow label="via A2A or external_chat protocol" />
          <ArchNode title="External Agent" sub="AgentForce / watsonx.ai / custom LangGraph or BeeAI" wide />
        </ArchStack>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="how-many-agents" />
        <h3>How many agents? When to add a specialist</h3>
        <p className="prose">
          <strong>Default to one agent.</strong> Every extra agent adds routing complexity, hand-off latency and failure surface, so
          “agent sprawl” is as much an anti-pattern as a bloated single agent. Split into a specialist only when a real boundary forces it —
          most often, <strong>separation of concerns</strong>: think of each agent like a microservice that owns one well-defined
          responsibility or business capability.
        </p>
        <Callout kind="note" title="What “separation of concerns” means here">
          Each agent should own <strong>one cohesive responsibility</strong> — its own tools, knowledge, instructions and rules — so you can
          build, test and change it in isolation. The tell that concerns are <em>tangled</em> and belong in separate agents: a change to one
          area (say Finance) could accidentally break another (HR), or you can’t test one area on its own. The subtlety: this tells you
          <em> where</em> to draw the boundary — along genuine, cohesive responsibilities — not that more boundaries are always better.
          Split no finer than “something one person or team could own,” or the hand-off overhead outweighs the tidiness. <Cite href={doc.buildAgent} />
        </Callout>
        <DecisionFlow accent="var(--c-design)" steps={[
          { q: 'Is it really one coherent domain with ≤7 tools and instructions you can keep tight (~20 lines)?', branches: [
            { label: 'YES', to: 'One agent with tools. Don’t split yet.', tone: 'stop' },
            { label: 'NO', to: 'Continue', tone: 'go' },
          ] },
          { q: 'Do the parts run in a fixed, deterministic order?', branches: [
            { label: 'YES', to: 'Not multiple agents — use an agentic workflow.', tone: 'stop' },
            { label: 'NO', to: 'Continue', tone: 'go' },
          ] },
          { q: 'Do the parts need different tools, knowledge, permissions, or reasoning per domain?', branches: [
            { label: 'YES', to: 'Split into specialists behind a Supervisor.', tone: 'stop' },
            { label: 'NO', to: 'Continue', tone: 'go' },
          ] },
          { q: 'Will a capability be reused elsewhere or owned by a different team?', branches: [
            { label: 'YES', to: 'Give it its own agent (or tool) for reuse.', tone: 'go' },
            { label: 'NO', to: 'Keep it inside one agent.', tone: 'stop' },
          ] },
        ]} />
        <DoDont
          dos={[
            'Separation of concerns — one area can’t change without risking another',
            'The work spans distinct domains (HR + Finance + IT), each with its own tools & rules',
            'A single agent would need more than ~7 tools — that’s the split line',
            'Instructions can’t stay tight without becoming contradictory (Mega-Prompt)',
            'A part needs its own knowledge base, connection/permissions, or model',
            'A capability will be reused, or owned by a different team',
          ]}
          donts={[
            'Splitting for tidiness rather than a real limitation',
            'Making “agents” that are really fixed, ordered steps — use a workflow',
            'One coherent domain that fits inside 3–7 tools',
            'So many tiny agents that routing and testing get harder (agent sprawl)',
            'Giving the Supervisor its own domain tools — it should only route',
          ]}
          doTitle="Add a specialist when…"
          dontTitle="Keep it one agent when…"
        />
        <Callout kind="key" title="The rules of thumb">
          One agent per <strong>bounded responsibility</strong> (like a microservice). Keep each to
          <XRef to="/build#tools"> 3–7 tools</XRef> and ~20 lines of instructions — if it grows past that, that’s your split line.
          Use <strong>one Supervisor that routes</strong> + N specialists that execute, where N is the number of genuinely distinct domains.
          Each specialist owns one job with a crisp <span className="icode">description</span> (descriptions drive routing), and you
          <XRef to="/test"> test each specialist alone</XRef> before wiring them together. Prefer as few agents as the problem allows —
          reach for tools and workflows before adding another agent (see <XRef to="/anti-patterns#ap-5">Tool Soup</XRef> and
          <XRef to="/anti-patterns#ap-1"> Mega-Prompt</XRef>).
        </Callout>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="instructions" />
        <h3>Designing good agent instructions</h3>
        <p className="prose">
          One of the most underrated skills in agentic AI. Good instructions have a clear anatomy — and stay short.
          Cramming every case into one enormous prompt is the <XRef to="/anti-patterns#ap-1">Mega-Prompt</XRef> anti-pattern;
          aim for around 20 lines per agent.
        </p>
        <ol className="prose" style={{ paddingLeft: 20, lineHeight: 2 }}>
          <li><strong>WHO</strong> the agent is (persona, role, tone)</li>
          <li><strong>WHAT</strong> it can do (tools available and when to use them)</li>
          <li><strong>WHAT it cannot do</strong> (hard limits, escalation rules)</li>
          <li><strong>HOW to handle edge cases</strong> (ambiguity, errors, unknowns)</li>
          <li><strong>OUTPUT format</strong> preferences (markdown, tables, brevity)</li>
        </ol>
        <div className="grid-2" style={{ margin: '20px 0' }}>
          <Card accent="var(--red)"><div className="callout-label" style={{ color: 'var(--red)' }}>Bad instructions</div>
            <p className="muted" style={{ margin: '10px 0 0', fontSize: '0.92rem' }}>“You are a helpful HR assistant. Help employees with their questions.”</p>
          </Card>
          <Card accent="var(--green)"><div className="callout-label" style={{ color: 'var(--green)' }}>Good instructions</div>
            <p className="muted" style={{ margin: '10px 0 0', fontSize: '0.9rem', lineHeight: 1.5 }}>
              “You are Maya, an HR assistant for Aviva. Help with leave balances (use <span className="icode">get_leave_balance</span>),
              policy questions (search the HR KB first), onboarding (use <span className="icode">create_onboarding_ticket</span>).
              Always confirm before submitting a ticket. Never make up policies. Keep responses to 3 sentences unless asked for detail.”
            </p>
          </Card>
        </div>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="desc-vs-inst" />
        <h3>Description vs. instructions are NOT the same</h3>
        <DataTable
          first="strong"
          head={['Field', 'Purpose', 'Who reads it']}
          rows={[
            ['description', 'Summary of what this agent does', 'Other agents (for routing)'],
            ['instructions', 'Behavioural rules for the agent', 'The LLM (the agent itself)'],
          ]}
        />
        <Callout kind="critical" title="Descriptions drive routing">
          In a Supervisor-Specialist pattern, the Supervisor routes based on each specialist’s <span className="icode">description</span>.
          Write it as if you are describing the specialist to another AI that must decide whether to send a task there. <Cite href={doc.guidelines} />
        </Callout>
        <CodeBlock lang="yaml" title="my_agent.agent.yaml — the two fields" code={`description: |          # other agents read this to ROUTE
  Handles employee HR queries: leave balances,
  policy questions, and onboarding ticket creation.
instructions: |         # the agent itself reads this to BEHAVE
  You are Maya, an HR assistant. Always confirm before
  submitting tickets. Never invent policies or balances.`} />
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="context-vars" />
        <h3>Context variables: what the agent already knows</h3>
        <p className="prose">
          Design decision: <strong>what does the agent already know about the user, before they say a word?</strong> Context
          variables let your app pass information — a user ID, name, role, region — straight into the agent runtime, so it never
          has to ask for things it should already have. Plan these up front; retro-fitting them is painful. <Cite href={doc.contextVariables} />
        </p>
        <h4>Three steps to wire them up</h4>
        <ol className="prose" style={{ paddingLeft: 20, lineHeight: 1.9 }}>
          <li>Set <span className="icode">context_access_enabled: true</span> in the agent definition</li>
          <li>List each variable under <span className="icode">context_variables</span></li>
          <li>Reference them in <span className="icode">instructions</span> with curly braces: <span className="icode">{'{user_name}'}</span></li>
        </ol>
        <CodeTabs tabs={[
          {
            label: 'agent.yaml', lang: 'yaml', title: 'askhr_agent.agent.yaml',
            code: `spec_version: v1
kind: native
name: askhr_agent
llm: groq/openai/gpt-oss-120b
description: Answers HR-related queries for the signed-in employee
instructions: >-
  You have access to these context values:
    name: {name}
    role: {role}
    email_id: {wxo_email_id}
  Use them directly — do NOT ask the user for these,
  they are always provided by the runtime.
context_access_enabled: true       # unlock context access
context_variables:                 # declare what you expect
  - name
  - role`,
          },
          {
            label: 'python tool', lang: 'python', title: 'read context in a tool',
            code: `from ibm_watsonx_orchestrate.agent_builder.tools import tool
from ibm_watsonx_orchestrate.run.context import AgentRun

@tool
def whoami(context: AgentRun) -> str:
    """Greets the signed-in user by reading request context.
    Args:
        context (AgentRun): The run context with request metadata.
    Returns:
        str: A short, personalised greeting.
    """
    req = context.request_context
    email = req.get("wxo_email_id")   # system vars use the wxo_ prefix
    return f"You're signed in as {email}."`,
          },
        ]} />
        <DataTable
          first="strong"
          head={['Pass it via…', 'Best for', 'Changes often?']}
          rows={[
            ['JWT token', 'Stable identity — user ID, role, org, permissions (secured embed)', 'No — constant for the session'],
            ['Instance method (pre:send)', 'Dynamic context added to the /runs payload at send time', 'Yes — can vary per message'],
          ]}
        />
        <Callout kind="warning" title="The wxo_ prefix is reserved">
          Don’t name your own variables with a <span className="icode">wxo_</span> prefix — that namespace is for system-provided
          values like <span className="icode">wxo_email_id</span> and <span className="icode">wxo_user_name</span>. If the same name exists in
          both the JWT and the instance method, the <strong>JWT value wins</strong>.
        </Callout>
        <Callout kind="note" title="Updates live for one run only">
          A Python tool can update context (<span className="icode">req["order_id"] = "..."</span>) and later tools in the <em>same</em> run
          see it. It is <strong>not</strong> persisted across sessions or threads — for lasting state, use an external system and retrieve by ID
          (see <XRef to="/anti-patterns#ap-7">Invisible State</XRef>).
        </Callout>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="check" />
        <h3>Knowledge check</h3>
        <Quiz accent="var(--c-design)" questions={designQuiz} docsDefault={doc.guidelines} />
      </Reveal>
    </PhaseShell>
  )
}
