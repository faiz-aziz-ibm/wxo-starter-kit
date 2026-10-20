import { allPhases } from '../data/phases'
import { PhaseShell } from '../components/PhaseHero'
import { Reveal, Callout, DataTable, DoDont, Pill, Stat, XRef, Cite } from '../components/Primitives'
import { DecisionFlow, FlowRow, HookTimeline } from '../components/Diagrams'
import { CodeTabs } from '../components/CodeTabs'
import { Quiz } from '../components/Quiz'
import { buildQuiz } from '../data/quizzes'
import { doc } from '../data/docs'
import { CodeBlock } from '../components/CodeBlock'

const phase = allPhases.find((p) => p.slug === 'build')!

const toc = [
  { id: 'first', label: 'Your first agent' },
  { id: 'styles', label: 'Agent styles' },
  { id: 'tools', label: 'Building tools' },
  { id: 'naming', label: 'Naming & docstrings' },
  { id: 'connections', label: 'Connections' },
  { id: 'auth', label: 'Auth & OAuth flows' },
  { id: 'tool-vs-flow', label: 'Tool or workflow?' },
  { id: 'workflows', label: 'Agentic workflows' },
  { id: 'nodes', label: 'The node catalogue' },
  { id: 'mapping', label: 'Data flow & mapping' },
  { id: 'kb', label: 'Knowledge bases' },
  { id: 'skills', label: 'Agent skills' },
  { id: 'multi', label: 'Multi-agent systems' },
  { id: 'context', label: 'Context window' },
  { id: 'guardrails', label: 'Guardrails (plug-ins)' },
  { id: 'controls', label: 'Controls · advanced' },
  { id: 'check', label: 'Knowledge check' },
]

export default function Build() {
  return (
    <PhaseShell phase={phase} toc={toc} tagline="Agents, tools, agentic workflows, knowledge bases and multi-agent teams. The largest part — where the agent actually gets made.">
      <Reveal as="section" className="reveal">
        <div id="first" />
        <h3>Building your first agent</h3>
        <h4>The UI path (no-code)</h4>
        <ol className="prose" style={{ paddingLeft: 20, lineHeight: 1.9 }}>
          <li>Navigate to <strong>Manage Agents → Create Agent</strong></li>
          <li>Fill in name, description, LLM model, and agent style</li>
          <li>Add tools from the tool library, then write instructions</li>
          <li>Add knowledge bases and collaborators (optional)</li>
          <li>Test in the chat preview, then save as draft</li>
        </ol>
        <h4>The ADK path (code)</h4>
        <CodeBlock lang="yaml" title="hr_assistant.agent.yaml" code={`spec_version: v1
kind: native
name: hr_assistant
llm: groq/openai/gpt-oss-120b   # a common wxO model; change only with a reason
style: react_core               # the current, recommended style (see below)
description: |
  Handles employee HR queries including leave balances,
  policy questions, and onboarding ticket creation.
instructions: |
  You are Maya, an HR assistant. Help employees with:
  - Leave balance queries (use get_leave_balance tool)
  - Policy questions (search HR knowledge base first)
  - Onboarding requests (use create_onboarding_ticket tool)
  Always confirm before submitting tickets.
tools:
  - get_leave_balance
  - create_onboarding_ticket
knowledge_base:
  - hr_policy_kb
memory_enabled: true`} />
        <CodeBlock lang="bash" title="Import & verify" code={`orchestrate agents import -f hr_assistant.agent.yaml
orchestrate agents list`} />
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="styles" />
        <h3>Agent styles: which one to pick?</h3>
        <p className="prose">
          The agent style controls how the agent reasons through a request and how it behaves when collaborating with other
          agents. <strong>This changed in recent releases.</strong> wxO has consolidated on a single style — <span className="icode">react_core</span>
          (“ReAct Core”) — and the older styles are now deprecated. For new agents, <strong>use <span className="icode">react_core</span></strong>. <Cite href={doc.agentStyles} />
        </p>
        <DataTable
          first="strong"
          head={['Style', 'Status', 'What it does', 'Best for']}
          rows={[
            [<><span className="icode">react_core</span> ✦</>, <Pill tone="green">Recommended</Pill>, 'Uses the model’s built-in function calling with improved collaboration accuracy', 'Everything — simple tasks, complex reasoning, and multi-agent workflows'],
            ['default', <Pill tone="amber">Deprecated</Pill>, 'Uses the model’s built-in function calling', 'Legacy agents only — migrate to react_core'],
            ['react', <Pill tone="amber">Deprecated</Pill>, 'Prompt-based Think → Act → Observe loop', 'Legacy agents on models with weak native tool-calling'],
          ]}
        />
        <Callout kind="warning" title="default and react are being removed">
          IBM has flagged <span className="icode">default</span> and <span className="icode">react</span> for removal in a future
          release — only <span className="icode">react_core</span> remains supported. The old <span className="icode">planner</span>
          (Plan-Act) style is gone too. Export existing agents and switch <span className="icode">style:</span> to
          <span className="icode"> react_core</span>, then re-run your evaluations before promoting. <Cite href={doc.agentStylesMigration} label="Migration guide" />
        </Callout>
        <Callout kind="note" title="react_intrinsic was renamed to react_core">
          If you have agents set to <span className="icode">react_intrinsic</span>, that is now <span className="icode">react_core</span>.
          The ADK still accepts <span className="icode">react_intrinsic</span> as an alias and it behaves identically; the REST API
          continues to use <span className="icode">react_intrinsic</span> as the value. New YAML should just say <span className="icode">react_core</span>.
        </Callout>
        <Callout kind="key" title="Some models override the style entirely">
          If your agent uses <span className="icode">gpt-oss-120b</span> or <span className="icode">gpt-5.4</span>, the style setting is
          ignored — the agent runs ReAct Core automatically. Since the starter examples here use <span className="icode">groq/openai/gpt-oss-120b</span>,
          they already behave as <span className="icode">react_core</span> regardless of what the YAML says. Setting
          <span className="icode"> style: react_core</span> explicitly keeps the config honest and future-proof.
        </Callout>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="tools" />
        <h3>Building tools: giving your agent superpowers</h3>
        <p className="prose">Tools are what agents <em>do</em>. Without tools, an agent can only talk. Choosing the wrong type creates maintenance headaches:</p>
        <DataTable
          first="strong"
          head={['Tool type', 'What it is', 'Strength', 'Weakness']}
          rows={[
            ['Python Tool', 'A function decorated with @tool', 'Full flexibility', 'You own the code'],
            ['OpenAPI Tool', 'REST API from an OpenAPI spec', 'Zero code; auth via connection', 'Needs a valid spec'],
            ['Agentic Workflow', 'A multi-step orchestrated flow', 'Guaranteed order; HITL; auditable', 'Deterministic; more setup'],
            ['Langflow', 'A visual AI pipeline', 'No-code, fast to prototype', 'Less version-controllable'],
            ['MCP Toolkit', 'An MCP server exposing many tools', 'One server, many reusable tools', 'Needs a running server'],
          ]}
        />
        <DecisionFlow accent="var(--c-build)" steps={[
          { q: 'Have an existing REST API with an OpenAPI spec?', branches: [{ label: 'YES', to: 'OpenAPI Tool (zero code)', tone: 'stop' }, { label: 'NO', to: 'Continue', tone: 'go' }] },
          { q: 'Is it a single deterministic function with clear I/O?', branches: [{ label: 'YES', to: 'Python Tool', tone: 'stop' }, { label: 'NO', to: 'Continue', tone: 'go' }] },
          { q: 'Multiple steps, approvals, or loops?', branches: [{ label: 'YES', to: 'Agentic Workflow', tone: 'stop' }, { label: 'NO', to: 'Continue', tone: 'go' }] },
          { q: 'Same tool set shared across many agents in your org?', branches: [{ label: 'YES', to: 'MCP Toolkit', tone: 'stop' }, { label: 'NO', to: 'Python Tool (default)', tone: 'go' }] },
        ]} />
        <Callout kind="tip" title="Start with Python Tools">
          They are the simplest, most flexible, and most debuggable. Migrate to OpenAPI or MCP when you have a specific reason.
        </Callout>
        <Callout kind="warning" title="OpenAPI specs weren’t written for agents">
          When you import an OpenAPI tool, the operation names and descriptions come straight from a spec built for
          <em> programmatic</em> use — think <span className="icode">getUserById</span> or “Returns a 200 response.” An agent reads those
          strings to decide when to call the tool, and machine-oriented wording misfires badly. <strong>Rename the operations and
          rewrite the descriptions</strong> in plain, intent-led language (the <span className="icode">verb_noun_context</span> rule below applies
          just as much here). Otherwise you land straight in <XRef to="/anti-patterns#ap-5">Tool Soup</XRef>.
        </Callout>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="naming" />
        <h3>Naming &amp; docstrings matter more than you think</h3>
        <p className="prose">
          The agent does not magically know when to call a tool. It reads the tool’s <strong>name</strong> and <strong>description
          (the docstring)</strong> to decide whether the tool is relevant and what to pass. The formula: <span className="icode">verb_noun_context</span>.
        </p>
        <DoDont
          dos={[
            <><span className="icode">get_leave_balance</span> — retrieves leave balance</>,
            <><span className="icode">submit_expense_request</span> — submits an expense</>,
            <><span className="icode">search_hr_policy_docs</span> — searches HR policies</>,
          ]}
          donts={[
            <><span className="icode">tool1</span> — tells the agent nothing</>,
            <><span className="icode">process_data</span> — process what data?</>,
            <><span className="icode">do_the_thing</span> — please, truly, do not</>,
          ]}
        />
        <CodeBlock lang="python" title="A Python tool (ADK)" code={`from ibm_watsonx_orchestrate.agent_builder.tools import tool

@tool                                    # Required decorator
def get_leave_balance(employee_id: str) -> str:
    """
    Retrieves the leave balance for an employee.    # the agent reads this
    Args:
        employee_id (str): The employee's ID number. # very important
    Returns:
        str: A summary of available leave days.
    """
    balance = call_hr_system(employee_id)
    return f"Employee {employee_id} has {balance} days remaining."`} />
        <Callout kind="critical" title="The docstring IS the tool’s description">
          If your tool says “Gets data”, the agent has no idea what data, when to call it, or what to pass — you will see it
          call the wrong tool, or refuse to call any tool at all.
        </Callout>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="connections" />
        <h3>Connecting tools to external services</h3>
        <p className="prose">Tools often need credentials. wxO handles this securely via <strong>Connections</strong> — three steps in the ADK:</p>
        <CodeBlock lang="bash" title="Connections — all three steps required" code={`# Step 1: Register/add the connection
orchestrate connections add -a my_salesforce_conn

# Step 2: Configure (auth type, scope, environment)
orchestrate connections configure -a my_salesforce_conn \\
  --env draft --type team --kind bearer

# Step 3: Set the actual credentials
orchestrate connections set-credentials -a my_salesforce_conn \\
  --env draft --token "your-bearer-token-here"`} />
        <Callout kind="critical" title="You must run all three steps">
          <span className="icode">add</span> registers it, <span className="icode">configure</span> sets the auth type,
          <span className="icode"> set-credentials</span> provides the secret. Miss any step and your tool will not authenticate.
          Supported auth: basic, bearer, api_key, key_value, and OAuth 2.0 flows. <Cite href={doc.connections} />
        </Callout>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="auth" />
        <h3>Authentication &amp; OAuth flows: which to pick</h3>
        <p className="prose">
          Simple keys (<span className="icode">api_key</span>, <span className="icode">bearer</span>, <span className="icode">basic</span>)
          are fine for a fixed service token. Reach for <strong>OAuth 2.0</strong> when the target system issues short-lived tokens or the
          access must be tied to a <em>specific user</em>. wxO supports these flows — pick by <strong>who the call acts as</strong>: <Cite href={doc.connections} />
        </p>
        <DataTable
          first="strong"
          head={['Flow (kind)', 'Acts as', 'Reach for it when…']}
          rows={[
            ['oauth_auth_client_credentials_flow', 'The application (machine-to-machine)', 'A backend service integration with no end-user context — one shared identity.'],
            ['oauth_auth_code_flow', 'A delegated user (standard web OAuth)', 'You need a user to sign in and consent once, then call on their behalf.'],
            ['oauth_auth_on_behalf_of_flow', 'The signed-in user, via your IdP', 'An IdP must exchange the user’s token for downstream access (embedded web chat).'],
            ['oauth_auth_password_flow', 'A user, by username/password', 'A trusted legacy system with no better option (avoid if you can).'],
            ['api_key / bearer / basic', 'A fixed service identity', 'A stable, long-lived credential for a shared integration.'],
          ]}
        />
        <h4>Team vs. member: who owns the credentials</h4>
        <DataTable
          first="strong"
          head={['Scope', 'Who sets it', 'Use for']}
          rows={[
            ['team', 'The builder sets one credential, shared by everyone', 'Shared service accounts — e.g. a read-only reporting API.'],
            ['member', 'Each user provides their own (prompted in chat)', 'Per-user access where actions must be attributed to that person.'],
          ]}
        />
        <CodeBlock lang="yaml" title="A client-credentials connection (my_app.yaml)" code={`spec_version: v1
kind: connection
app_id: my_reporting_api
environments:
  draft:
    kind: oauth_auth_client_credentials_flow
    type: team                       # one shared credential
    server_url: https://api.example.com/
  live:
    kind: oauth_auth_client_credentials_flow
    type: team
    server_url: https://api.example.com/`} />
        <Callout kind="critical" title="Secrets hygiene — never hard-code credentials">
          Keep tokens and client secrets <strong>out of your tool code and YAML</strong>. Register them only through
          <span className="icode"> orchestrate connections set-credentials</span>, which stores them in the wxO connection vault.
          Configure connections <strong>per environment</strong> (Draft and Live are separate), prefer <span className="icode">member</span> scope
          when actions must be attributed to a real user, and rotate secrets on a schedule — the connection is the only place a secret should live.
        </Callout>
        <Callout kind="tip" title="A collision to know about">
          For <span className="icode">oauth_auth_on_behalf_of_flow</span>, support is currently limited to agents accessed through
          <strong> embedded web chat</strong>, and the connection is <span className="icode">member</span>-scoped by nature (it acts as each signed-in user).
        </Callout>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="tool-vs-flow" />
        <h3>Python tool or agentic workflow?</h3>
        <p className="prose">
          The most common point of confusion. The short version: a <strong>Python tool</strong> is one focused capability the agent calls;
          an <strong>agentic workflow</strong> orchestrates several steps in a guaranteed order, with branching, waiting, or human input.
          Walk down these questions and stop at the first <span className="icode">Yes</span>.
        </p>
        <DecisionFlow accent="var(--c-build)" steps={[
          { q: 'Do you need a human in the loop — an approval or input mid-execution?', branches: [
            { label: 'YES', to: 'Agentic workflow (add a User Activity node).', tone: 'stop' },
            { label: 'NO', to: 'Continue', tone: 'go' },
          ] },
          { q: 'Is it a repeatable process with multiple deterministic steps, branching, looping, or waiting?', branches: [
            { label: 'YES', to: 'Agentic workflow — it guarantees the order.', tone: 'stop' },
            { label: 'NO', to: 'Continue', tone: 'go' },
          ] },
          { q: 'Must you collect structured input (e.g. a form) before the next action?', branches: [
            { label: 'YES', to: 'Workflow with a User Activity node, then pass the inputs to a tool downstream.', tone: 'stop' },
            { label: 'NO', to: 'Continue', tone: 'go' },
          ] },
          { q: 'Is it one focused capability the agent can call directly once it has the inputs?', branches: [
            { label: 'YES', to: 'Python tool.', tone: 'stop' },
            { label: 'NO', to: 'Continue', tone: 'go' },
          ] },
          { q: 'Is it mainly custom code or business logic inside a single step, not end-to-end orchestration?', branches: [
            { label: 'YES', to: 'Python tool (wrap it in a workflow later only if the wider process needs orchestration).', tone: 'go' },
            { label: 'NO', to: 'Agentic workflow — you need orchestration.', tone: 'stop' },
          ] },
        ]} />
        <Callout kind="key" title="Build tools first, orchestrate later">
          Keep your core business logic as <strong>modular, reusable Python tools</strong> — they’re the simplest, most testable unit and
          can be shared across many use cases. Reach for an <strong>agentic workflow</strong> only when a <em>higher-level process</em> needs to
          coordinate those tools: sequencing, branching, waiting, or human-in-the-loop. In short: <strong>a tool does one thing; a workflow
          chains things together.</strong>
        </Callout>
        <DataTable
          first="strong"
          head={['Signal', 'Python tool', 'Agentic workflow']}
          rows={[
            ['Number of steps', 'One focused action', 'Several, in a set order'],
            ['Human-in-the-loop', <Pill tone="red">No</Pill>, <Pill tone="green">Yes — approvals, forms</Pill>],
            ['Branching / looping / waiting', <Pill tone="red">No</Pill>, <Pill tone="green">Yes</Pill>],
            ['Reusability', 'High — call it anywhere', 'Wraps and coordinates tools'],
            ['How the agent uses it', 'Calls it directly', 'Imported and called like a tool'],
          ]}
        />
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="workflows" />
        <h3>Building agentic workflows</h3>
        <p className="prose">
          An agent decides what to do on the fly. An <strong>agentic workflow</strong> does the opposite: it runs a defined sequence in a
          guaranteed order, with branching, loops, and human approvals. A workflow is imported and used like any other tool. <Cite href={doc.flowsOverview} />
        </p>
        <ul className="plain">
          <li>You need repeatable, predictable sequencing of agents, tools, and human tasks</li>
          <li>The process is long-running — minutes, hours, or even days</li>
          <li>Human-in-the-loop approvals are required</li>
          <li>Scheduling triggers the process at set times</li>
        </ul>
        <Callout kind="note" title="Workflows run asynchronously">
          Invoking one returns an <strong>instance ID</strong> and the system waits. To check progress, use the “Get agentic workflow
          status” tool in a new chat session and pass the instance ID.
        </Callout>
        <FlowRow accent="var(--c-build)" steps={[
          { title: 'Start', sub: 'exactly one' },
          { title: 'Tool / Agent', sub: 'do the work' },
          { title: 'Branch / Loop', sub: 'control flow' },
          { title: 'End', sub: 'at least one' },
        ]} />
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="nodes" />
        <h4>The node catalogue</h4>
        <p className="prose">Nodes come in three families: work nodes, control-flow nodes, and human/document nodes.</p>
        <DataTable
          first="strong"
          head={['Node', 'Purpose']}
          rows={[
            ['Tool Node', 'Calls a registered tool and returns its result — the workhorse'],
            ['Agent Node', 'Calls an imported agent for a reasoning task inside the workflow'],
            ['Prompt Node *', 'Direct LLM call to classify, extract, or generate (Public Preview)'],
            ['Doc Processing Node *', 'Extracts text or key-value pairs from documents (Public Preview)'],
            ['User Activity Node', 'Pauses and shows a form to a person (human-in-the-loop)'],
            ['Branch Node', 'Conditional routing — follows the first matching path'],
            ['Decisions Node *', 'A decision table: many conditions → actions (Public Preview)'],
            ['Foreach Node', 'Iterates over a list, running a sub-workflow for each'],
            ['Loop Node', 'Repeats a sub-workflow while a condition holds'],
            ['Timer Node', 'Waits for a set time before continuing'],
            ['Flow Node', 'Embeds another workflow as a single step (compose & reuse)'],
          ]}
        />
        <Callout kind="tip" title="Rule of thumb">
          If a step is deterministic (“always do this, in this order”), put it in a workflow logic block, not in agent instructions.
          Keep the agent for the genuinely open-ended reasoning.
        </Callout>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="mapping" />
        <h4>How data flows: auto-mapping vs. explicit mapping</h4>
        <p className="prose">Data moves along three schema layers: the <strong>flow input</strong>, each <strong>node’s input/output</strong>, and the <strong>flow output</strong>. To pass a value you reference a <strong>flow variable</strong>:</p>
        <ul className="plain">
          <li><span className="icode">flow.input.&lt;field&gt;</span> — a field from the workflow’s own input</li>
          <li><span className="icode">flow.&lt;NodeName&gt;.output.&lt;field&gt;</span> — a field produced by an earlier node</li>
          <li>A conditional with a fallback: <span className="icode">flow.A.output.x if flow.A.output.x else "N/A"</span></li>
        </ul>
        <DataTable
          first="strong"
          head={['Approach', 'How it works', 'Trade-off']}
          rows={[
            ['Auto-mapping (default)', 'Runtime matches fields by schema, using an LLM to reshape', 'Little to write, but slower — can guess wrong'],
            ['Explicit mapping', 'You call map_input() / map_output() with an exact expression', 'Deterministic and fast; a little more to write'],
          ]}
        />
        <Callout kind="warning" title="The auto-mapping trap: token overflow">
          When a node returns large or deeply-structured data (a Doc Processing node is the classic case), auto-mapping can inject
          that whole structure into the LLM context and cause a token-overflow failure. The fix: map each field explicitly.
        </Callout>
        <CodeBlock lang="python" title="A worked example — expense approval flow" code={`from ibm_watsonx_orchestrate.flow_builder.flows import Flow, flow, START, END
from ibm_watsonx_orchestrate.flow_builder.types import UserFieldKind
from pydantic import BaseModel

class ApprovalRequest(BaseModel):
    employee_id: str
    amount: float
    reason: str

@flow(name="expense_approval_flow",
      description="Routes expense requests for manager approval",
      input_schema=ApprovalRequest, output_schema=str)
def build_expense_flow(aflow: Flow = None) -> Flow:
    validate_node = aflow.tool("validate_expense")
    # Human-in-the-loop: a sub-flow requiring internal edge setup
    approval_userflow = aflow.userflow()
    approval_node = approval_userflow.field(
        direction="input", name="approved", display_name="Approve?",
        kind=UserFieldKind.Text, text="Please confirm approval (yes/no):")
    approval_userflow.edge(START, approval_node)
    approval_userflow.edge(approval_node, END)
    process_node = aflow.tool("process_payment")
    aflow.sequence(START, validate_node, approval_userflow, process_node, END)
    return aflow`} />
        <Callout kind="note" title="The Flow Inspector: where to debug workflows">
          A purpose-built visual view of a single workflow run — execution history, per-node timing, and bottlenecks.
          Walk the run in order, find the first node that failed, and inspect its input/output. Most workflow bugs are a
          mapping problem or a mis-evaluated Branch/Loop condition.
        </Callout>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="kb" />
        <h3>Building knowledge bases</h3>
        <p className="prose">Knowledge bases let agents search your documents and give grounded, citation-backed answers.</p>
        <CodeBlock lang="yaml" title="hr_policy_kb.kb.yaml — built-in KB" code={`spec_version: v1
kind: knowledge_base
name: hr_policy_kb
description: Aviva HR policies and procedures
type: built_in
documents:
  - ./docs/leave_policy.pdf
  - ./docs/expense_policy.pdf
  - ./docs/code_of_conduct.pdf`} />
        <h4>Built-in KB — limitations you need to know</h4>
        <p className="prose">The built-in KB uses an embedded Milvus vector store. Fast to set up, but with real limits:</p>
        <DataTable
          first="strong"
          head={['Limitation', 'Why it matters']}
          rows={[
            ['No keyword / exact-match search', 'Semantic only — exact phrase, regex, structured filters unreliable'],
            ['No metadata filtering', 'Cannot restrict to “only 2024 docs” or “only Finance”'],
            ['No incremental updates', 'Updating a doc means removing & re-importing the KB'],
            ['No hybrid search (BM25 + vector)', 'Often outperforms pure vector in enterprise use cases'],
            ['Scale ceiling', 'Works to hundreds of docs; degrades at tens of thousands'],
          ]}
        />
        <Callout kind="tip" title="The integration pattern for external RAG">
          Build a Python tool that calls your external search API, trims the results, and returns only the top-N relevant chunks.
          The agent calls it like any other tool — giving you full control of chunking, filtering, and ranking. Options:
          Elasticsearch/OpenSearch, watsonx Discovery, Pinecone, Weaviate, Qdrant.
        </Callout>
        <DoDont
          dos={['Chunk documents logically (per topic/policy)', 'Use clear, descriptive filenames', 'Keep documents current and versioned', 'Trim results before returning to the agent']}
          donts={['Upload one massive PDF for everything', 'Include scanned images without OCR text', 'Expect answers not in the documents', 'Return entire documents from a search tool']}
        />
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="skills" />
        <h3>Agent skills: instructions that load only when needed</h3>
        <p className="prose">
          An <strong>agent skill</strong> is a scoped, reusable instruction set the agent loads <em>on demand</em> — for one
          specific procedure like processing an invoice, submitting an order, or running a policy review. Instead of cramming every
          procedure into one giant <span className="icode">instructions</span> block, you package each as a skill. The agent reads only
          each skill’s <strong>name</strong> and <strong>description</strong> at startup, then loads the full body into context
          <em> only</em> when a request matches. <Cite href={doc.agentSkills} /></p>
        <Callout kind="key" title="Progressive disclosure — why this matters">
          Skills are the direct antidote to bloated instructions and the <XRef to="/anti-patterns#ap-3">Firehose Effect</XRef>.
          Ten procedures in one prompt means all ten sit in the context window on every turn. As ten skills, only the one relevant
          procedure is ever loaded — the active context stays small, routing stays sharp, and each procedure is maintained (and reused)
          on its own.
        </Callout>
        <h4>Anatomy of a skill</h4>
        <p className="prose">A skill is a directory with a <span className="icode">SKILL.md</span> at its root — YAML frontmatter plus a Markdown instruction body — and two optional folders:</p>
        <CodeBlock lang="text" title="Skill directory structure" code={`order-placement/
├── SKILL.md          # Required: frontmatter (name, description) + instructions
├── scripts/          # Optional: Python (.py) the agent runs for compute/validation
└── references/       # Optional: .md / .txt / .json the agent consults on demand`} />
        <CodeBlock lang="yaml" title="SKILL.md" code={`---
name: order-placement
description: Place and track customer orders. Use when a user wants to
  submit a new order or check the status of an existing order.
allowed-tools:            # optional — restrict which tools this skill may call
  - create_order
  - update_order_status
---

# Order Placement
You help customers place orders in compliance with company policy.

## Instructions
1. Collect product_id, quantity, and unit_price from the user.
2. Before placing any order, run the validation script validate_order.py with:
   args={"product_id": "<product_id>", "quantity": <quantity>, "unit_price": <unit_price>}
   Do not call create_order until validation passes.
3. For limits and shipping rules, read the policy reference: ORDER_POLICY.md
4. Call create_order(...) and return the order_id and status.`} />
        <Callout kind="critical" title="The description is the only routing signal">
          Just like a collaborator’s description, the agent picks a skill purely from its <span className="icode">name</span> and
          <span className="icode"> description</span> — it does not read the body or scripts to decide. State <strong>what it does and
          when to use it</strong> (“Use when a user asks for order status…”), keep it to a sentence or two, and make it specific enough
          that two skills never overlap. Vague descriptions mean the wrong skill loads.
        </Callout>
        <h4>Attaching and managing skills</h4>
        <p className="prose">Import the skill into your environment, then name it in the agent’s <span className="icode">skills</span> list — alongside <span className="icode">tools</span>:</p>
        <CodeBlock lang="bash" title="Import & verify (the orchestrate skills command group)" code={`# Import a whole skill dir (uploads SKILL.md, scripts/*.py, references/*)
orchestrate skills import --dir skills/order-placement/

# Bulk-import many skills, upsert by name — the pattern for CI pipelines
orchestrate skills import --dir skills/ --recursive --upsert

orchestrate skills list                         # verify it registered
orchestrate skills get --skill-name order-placement`} />
        <CodeBlock lang="yaml" title="ops_assistant.agent.yaml — skills sit next to tools" code={`spec_version: v1
kind: native
name: ops_assistant
llm: groq/openai/gpt-oss-120b
style: react_core
description: Operations assistant for order placement and inventory.
instructions: |
  You handle order placement and inventory analysis.
tools:
  - get_customer_profile          # agent-level: available under every skill
skills:
  - order-placement               # each skill declares its own allowed-tools
  - inventory-check`} />
        <Callout kind="note" title="Scripts run sandboxed">
          Skill scripts are for compute (validation, reshaping data) — a plain <span className="icode">run(...)</span> function, validated
          at upload. Network and filesystem access are blocked (<span className="icode">os</span>, <span className="icode">requests</span>,
          <span className="icode"> open</span>, <span className="icode">eval</span>, URLs, <span className="icode">pip install</span>, and more are
          rejected). If a procedure needs to call an external system, that belongs in a <strong>tool</strong>, not a skill script. <Cite href={doc.agentSkillsManage} label="Manage skills" />
        </Callout>
        <h4>Prompt instruction, skill, tool, or workflow?</h4>
        <p className="prose">
          These are easy to confuse. The distinction: <strong>instructions</strong> are always-on guidance; a <strong>skill</strong>
          is a procedure loaded on demand; a <strong>tool</strong> performs an action; a <strong>workflow</strong> enforces a sequence;
          a <strong>plug-in</strong> enforces a rule.
          Walk down and stop at the first <span className="icode">Yes</span>.
        </p>
        <DecisionFlow accent="var(--c-build)" steps={[
          { q: 'Does it perform an action — call an API, run deterministic logic, hit a system?', branches: [
            { label: 'YES', to: 'A tool (Python/OpenAPI/MCP). A skill orchestrates tools; it doesn’t replace them.', tone: 'stop' },
            { label: 'NO', to: 'Continue — it’s guidance, not an action', tone: 'go' },
          ] },
          { q: 'Must several steps run in a guaranteed order, with branching, waiting, or human approval?', branches: [
            { label: 'YES', to: 'An agentic workflow — it guarantees the sequence.', tone: 'stop' },
            { label: 'NO', to: 'Continue', tone: 'go' },
          ] },
          { q: 'Must it be enforced, not just encouraged: block, mask, or authorise?', branches: [
            { label: 'YES', to: 'A plug-in or control: prompts can be talked around. See Guardrails below.', tone: 'stop' },
            { label: 'NO', to: 'Continue', tone: 'go' },
          ] },
          { q: 'Should this guidance apply to every request (persona, tone, global conventions)?', branches: [
            { label: 'YES', to: 'Agent instructions — always-on behaviour belongs in the prompt.', tone: 'stop' },
            { label: 'NO', to: 'Continue — it’s situational', tone: 'go' },
          ] },
          { q: 'Is it a self-contained procedure for one task, relevant only sometimes, reused or maintained on its own?', branches: [
            { label: 'YES', to: 'An agent skill — scoped instructions that load only when that task comes up.', tone: 'stop' },
            { label: 'NO', to: 'Keep it as a few lines of instructions.', tone: 'go' },
          ] },
        ]} />
        <DataTable
          first="strong"
          head={['Signal', 'Prompt instruction', 'Agent skill']}
          rows={[
            ['When it loads', 'Every turn, always in context', 'On demand, only when the description matches'],
            ['Scope', 'Global behaviour, persona, tone', 'One specific procedure or task'],
            ['Context cost', 'Pays on every request', 'Near-zero until activated'],
            ['Reuse', 'Copied between agents by hand', 'Imported once, attached to many agents'],
            ['Best when', 'A handful of short, always-true rules', 'Many procedures, or any one that is long or reused'],
          ]}
        />
        <DoDont
          dos={[
            'Keep instructions for persona, tone, and always-on rules',
            'Move each distinct procedure into its own skill',
            'Write the description as “what it does + when to use it”',
            'Use allowed-tools to scope a skill to just the tools it needs',
          ]}
          donts={[
            'Pack ten procedures into one instructions block',
            'Duplicate the same workflow across five agents’ prompts',
            'Put API calls or network access in a skill script — use a tool',
            'Write vague, overlapping descriptions the agent can’t tell apart',
          ]}
        />
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="multi" />
        <h3>Multi-agent systems: building the team</h3>
        <CodeBlock lang="yaml" title="supervisor.agent.yaml" code={`spec_version: v1
kind: native
name: aviva_supervisor
llm: groq/openai/gpt-oss-120b
style: react_core
description: |
  Main entry point for all Aviva employee requests.
  Routes HR queries to hr_agent, Finance to finance_agent,
  IT issues to it_helpdesk_agent.
instructions: |
  Understand what the employee needs and route to the right
  specialist. Do not answer questions yourself: always delegate.
  If unclear, ask one clarifying question.
collaborators:
  - hr_agent
  - finance_agent
  - it_helpdesk_agent`} />
        <Callout kind="critical" title="Names & descriptions are load-bearing">
          The Supervisor has exactly two signals to route: each collaborator’s <strong>name</strong> and <strong>description</strong>.
          These are not documentation — they are functional code. Getting them wrong silently breaks routing.
        </Callout>
        <CodeBlock lang="text" title="The collaborator description formula" code={`[Agent name] handles [specific task types].
Use this agent when the user asks about [specific triggers / intent signals].
This agent CAN: [list of concrete capabilities].
This agent CANNOT: [explicit out-of-scope items].`} />
        <h4>The right number of tools per agent</h4>
        <p className="prose">
          Every tool you add increases the surface area for wrong tool selection. The research-backed number is
          <strong> 3–7</strong>. Go past it and you drift into <XRef to="/anti-patterns#ap-5">Tool Soup</XRef>.
        </p>
        <div className="grid-4" style={{ margin: '18px 0' }}>
          <Stat value="1–3" label="Near-perfect selection" accent="var(--green)" />
          <Stat value="4–7" label="Good; occasional misses" accent="var(--blue)" />
          <Stat value="8–12" label="Noticeable degradation" accent="var(--amber)" />
          <Stat value="13+" label="Unpredictable — don’t" accent="var(--red)" />
        </div>
        <Callout kind="note" title="Not every user should reach every specialist">
          Descriptions decide where the supervisor <em>can</em> route; they don't decide who is <em>allowed</em>. Bind a pre-invoke
          plug-in to a specialist and wxO removes it from the supervisor's options for users who fail the check.
          See <XRef to="/build#rbac">collaborator access control</XRef>.
        </Callout>
        <Callout kind="tip" title="Test your descriptions without code">
          Paste your Supervisor’s instructions and all collaborator descriptions into a plain LLM chat (no tools), describe a user
          request, and ask which agent it would route to and why. Routing logic becomes visible — you spot gaps without running anything.
        </Callout>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="context" />
        <h3>Context window management: the silent agent killer</h3>
        <Callout kind="analogy" title="Working memory has limits">
          Imagine holding a two-hour conversation in your head while reading 50-page reports out loud. Eventually you forget the
          beginning. LLMs do the same — except they do not warn you.
        </Callout>
        <p className="prose">
          The context window holds everything the agent knows: system prompt, conversation history, and
          <strong> tool-call results — often the biggest offender.</strong> A tool that returns too much is the
          <XRef to="/anti-patterns#ap-3">Firehose Effect</XRef> anti-pattern in action.
        </p>
        <div className="grid-2" style={{ margin: '18px 0' }}>
          <CodeBlock lang="python" title="This WILL break your agent" code={`@tool
def get_customer_orders(customer_id: str) -> dict:
    """Gets orders for a customer."""
    return database.get_all_orders(customer_id)
    # 2,000 rows x 30 fields = ~150,000 tokens.
    # Context window: exceeded.`} />
          <CodeBlock lang="python" title="This is SAFE" code={`@tool
def get_customer_orders(customer_id: str, limit: int = 5) -> str:
    """Gets the most recent orders for a customer.
    Args:
        customer_id (str): The customer's unique ID.
        limit (int): Recent orders to return. Default 5.
    Returns:
        str: A summary of recent orders.
    """
    orders = database.get_orders(customer_id,
             order_by="date_desc", limit=limit)
    return "\\n".join(f"Order {o.id}: {o.product}" for o in orders)
    # ~5 lines of text. Safe.`} />
        </div>
        <Callout kind="key" title="The rule">
          Every tool should return the <strong>minimum useful</strong> information, not the maximum available information.
        </Callout>
        <h4>Context window budgeting</h4>
        <DataTable
          first="strong"
          head={['Component', 'Typical tokens', 'Notes']}
          rows={[
            ['System prompt / instructions', '200–800', 'Keep tight. Every line costs.'],
            ['Conversation history (per turn)', '100–500', 'Accumulates fast'],
            ['A single tool result', '50–5,000', 'You control this. Keep under 1,000.'],
            ['A knowledge base retrieval', '500–3,000', 'Trim to top-3 chunks, not top-20'],
            ['A full PDF in context', '10,000–50,000+', <Pill tone="red">Never do this</Pill>],
          ]}
        />
        <Callout kind="warning" title="The 80% rule">
          If your expected conversation plus tools will consume more than <strong>80%</strong> of the model’s context window, you will
          have reliability problems. Trim your data, shorten instructions, or reduce history retention.
        </Callout>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="guardrails" />
        <h3>Guardrails with plug-ins</h3>
        <p className="prose">
          Instructions <em>ask</em> the agent to behave. A guardrail <em>makes</em> it. If a rule must hold every time (block an
          unsafe request, mask an email address, check who is allowed in), don't leave it to the prompt, because a determined user
          can talk an LLM out of almost anything. Put it in a <strong>plug-in</strong>: a small Python tool that wxO runs
          automatically on every turn, before or after the agent. <Cite href={doc.plugins} />
        </p>
        <Callout kind="key" title="Where guardrails run in a single turn">
          Plug-ins run at the two <strong>agent</strong> hooks. Controls (the advanced, policy-based option at the end of this page)
          can also run at the <strong>tool</strong> hooks, and at two prompt-fetch hooks not shown here.
        </Callout>
        <HookTimeline items={[
          { kind: 'stage', title: 'User message', sub: 'arrives' },
          { kind: 'gate', scope: 'agent', hook: 'pre-invoke', who: 'both' },
          { kind: 'stage', title: 'Agent reasons', sub: 'picks a tool' },
          { kind: 'gate', scope: 'tool', hook: 'pre-invoke', who: 'control' },
          { kind: 'stage', title: 'Tool runs', sub: 'calls a system' },
          { kind: 'gate', scope: 'tool', hook: 'post-invoke', who: 'control' },
          { kind: 'gate', scope: 'agent', hook: 'post-invoke', who: 'both' },
          { kind: 'stage', title: 'Reply', sub: 'to the user' },
        ]} />
        <h4>What a plug-in can do</h4>
        <p className="prose">
          A plug-in receives the <strong>context</strong> (user, tenant, request) and a <strong>payload</strong> (the messages), and
          returns a result. Two fields decide what happens next:
        </p>
        <DataTable
          first="strong"
          head={['Outcome', 'continue_processing', 'modified_payload', 'Use it to…']}
          rows={[
            ['Accept', <Pill tone="green">True</Pill>, 'unchanged', 'Let a clean message through'],
            ['Rewrite', <Pill tone="green">True</Pill>, 'edited messages', 'Mask PII, strip profanity, normalise input'],
            ['Reject', <Pill tone="red">False</Pill>, 'optional notice', 'Stop unsafe or unauthorised requests'],
          ]}
        />
        <p className="prose">
          The decorator's <span className="icode">kind</span> sets the phase: <span className="icode">PythonToolKind.AGENTPREINVOKE</span> runs
          before the agent sees the message, <span className="icode">PythonToolKind.AGENTPOSTINVOKE</span> runs after it answers.
        </p>
        <CodeTabs tabs={[
          { label: 'Pre-invoke · input guard', lang: 'python', title: 'plugins/injection_guard.py', code: `from ibm_watsonx_orchestrate.agent_builder.tools import tool
from ibm_watsonx_orchestrate.agent_builder.tools.types import (
    PythonToolKind, PluginContext, AgentPreInvokePayload, AgentPreInvokeResult,
)

BLOCKED = ["ignore your instructions", "developer mode"]   # demo list only

@tool(description="Blocks known prompt-injection phrases", kind=PythonToolKind.AGENTPREINVOKE)
def injection_guard(plugin_context: PluginContext,
                    agent_pre_invoke_payload: AgentPreInvokePayload) -> AgentPreInvokeResult:
    result = AgentPreInvokeResult(modified_payload=agent_pre_invoke_payload)
    if not agent_pre_invoke_payload or not agent_pre_invoke_payload.messages:
        result.continue_processing = True
        return result

    text = agent_pre_invoke_payload.messages[-1].content.text or ""
    if any(p in text.lower() for p in BLOCKED):
        result.continue_processing = False          # reject: the agent never processes it
        result.modified_payload.messages[-1].content.text = "Request blocked by policy."
    else:
        result.continue_processing = True           # accept
    return result` },
          { label: 'Post-invoke · output masking', lang: 'python', title: 'plugins/email_masking_plugin.py', code: `import re
from ibm_watsonx_orchestrate.agent_builder.tools import tool
from ibm_watsonx_orchestrate.agent_builder.tools.types import (
    PythonToolKind, PluginContext, AgentPostInvokePayload, AgentPostInvokeResult,
    TextContent, Message,
)

EMAIL = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}")

def _mask(m: re.Match) -> str:
    local, domain = m.group(0).split("@", 1)
    keep = min(2, max(0, len(local) - 2))      # always mask at least 2 chars
    return local[:keep] + "*" * (len(local) - keep) + "@" + domain

@tool(description="Masks email addresses in the agent's reply", kind=PythonToolKind.AGENTPOSTINVOKE)
def email_masking_plugin(plugin_context: PluginContext,
                         agent_post_invoke_payload: AgentPostInvokePayload) -> AgentPostInvokeResult:
    result = AgentPostInvokeResult()
    msgs = agent_post_invoke_payload.messages if agent_post_invoke_payload else None
    if not msgs or getattr(msgs[0].content, "text", None) is None:
        result.continue_processing = False           # nothing safe to return: fail closed
        return result

    first = msgs[0]
    payload = agent_post_invoke_payload.copy(deep=True)
    payload.messages[0] = Message(
        role=first.role,
        content=TextContent(type="text", text=EMAIL.sub(_mask, first.content.text)),
    )
    result.continue_processing = True
    result.modified_payload = payload
    return result` },
          { label: 'Attach to the agent', lang: 'yaml', title: 'email_agent.agent.yaml', code: `spec_version: v1
kind: native
name: email_agent
llm: groq/openai/gpt-oss-120b
style: react_core
description: Sends emails on the user's behalf.
tools:
  - send_email_tool          # the agent chooses when to call this
plugins:                     # these run automatically, every turn
  agent_pre_invoke:
    - plugin_name: injection_guard
  agent_post_invoke:
    - plugin_name: email_masking_plugin` },
        ]} />
        <CodeBlock lang="bash" title="Import the plug-ins first, then the agent" code={`orchestrate tools import -k python -f plugins/injection_guard.py
orchestrate tools import -k python -f plugins/email_masking_plugin.py
orchestrate agents import -f email_agent.agent.yaml`} />
        <Callout kind="warning" title="A keyword list is a demo, not a defence">
          Phrase matching catches the obvious and misses the creative. Use plug-ins for <strong>your</strong> rules (business policy,
          entitlements, house masking formats). For broad jailbreak and toxicity detection, use the IBM-maintained
          <XRef to="/build#controls">Content Guardrails control</XRef>.
        </Callout>
        <Callout kind="note" title="Post-invoke edits carry forward">
          The next turn sees the conversation <em>as the plug-in left it</em>. Once an email is masked in a reply, the agent
          won't see the original address again either.
        </Callout>

        <div id="rbac" />
        <h4>Collaborator access control</h4>
        <p className="prose">
          In a multi-agent system, not every user should reach every specialist. Bind a pre-invoke plug-in to the
          <strong> collaborator</strong> agent. When the supervisor starts a turn, wxO calls it with the action
          <span className="icode"> RBAC_ONLY</span>. If it returns <span className="icode">False</span>, that specialist is
          removed from the supervisor's list for this user, so the supervisor can't route there at all. <Cite href={doc.pluginsRbac} />
        </p>
        <DataTable
          first="strong"
          head={['plugin_context.metadata["action"]', 'When', 'What to do']}
          rows={[
            [<span className="icode">ALL</span>, 'Every message to the root agent', 'Run your full logic'],
            [<span className="icode">RBAC_ONLY</span>, 'A parent agent is checking access to this collaborator', 'Check entitlements; return the answer'],
            [<span className="icode">SKIP_RBAC</span>, 'Access was already checked on this thread (cached)', 'Continue unchanged; don’t re-check'],
          ]}
        />
        <CodeBlock lang="python" title="plugins/hr_access_plugin.py, bound to hr_agent" code={`from ibm_watsonx_orchestrate.agent_builder.tools import tool
from ibm_watsonx_orchestrate.agent_builder.tools.types import (
    PythonToolKind, PluginContext, AgentPreInvokePayload, AgentPreInvokeResult,
    AgentPreInvokeType,
)

@tool(description="Only HR staff can reach the HR agent", kind=PythonToolKind.AGENTPREINVOKE)
def hr_access_plugin(plugin_context: PluginContext,
                     agent_pre_invoke_payload: AgentPreInvokePayload) -> AgentPreInvokeResult:
    result = AgentPreInvokeResult(modified_payload=agent_pre_invoke_payload)
    action = plugin_context.metadata["action"]

    if action == AgentPreInvokeType.RBAC_ONLY.value:
        result.continue_processing = check_access(plugin_context)   # your IdP / entitlement lookup
        return result

    result.continue_processing = True    # ALL or SKIP_RBAC: let the message through
    return result`} />
        <Callout kind="tip" title="Check once per thread">
          Entitlement lookups hit your identity provider, so branch on the action and only call it for
          <span className="icode"> RBAC_ONLY</span>. wxO caches the result and sends <span className="icode">SKIP_RBAC</span> for
          the rest of the thread. Import <span className="icode">AgentPreInvokeType</span> from
          <span className="icode"> ibm_watsonx_orchestrate.agent_builder.tools.types</span> with the other plug-in types. It is not
          exported from the package root.
        </Callout>

        <h4>Plug-ins as a hosted service (OpenAPI)</h4>
        <p className="prose">
          Already have a guardrail or masking service, or want one policy across many agents and tenants? Implement the plug-in
          as an HTTP endpoint in any language and describe it with OpenAPI. It runs at the same two hooks and returns the same
          <span className="icode"> continue_processing</span> / <span className="icode">modified_payload</span>. <Cite href={doc.openapiPlugin} />
        </p>
        <CodeBlock lang="yaml" title="guardrail-plugin.yaml (excerpt)" code={`paths:
  /agent_pre_invoke:
    post:
      operationId: guardrail_pre
      x-ibm-orchestrate-plugin:
        hook: agent_pre_invoke        # must match the agent YAML section
      requestBody:                    # wxO POSTs { payload, context }
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [payload, context]
      responses:
        "200":                        # you return { continue_processing, modified_payload? }
          content:
            application/json:
              schema:
                type: object
                required: [continue_processing]`} />
        <Callout kind="critical" title="OpenAPI plug-ins fail closed">
          If the service errors, times out, or omits <span className="icode">continue_processing</span>, wxO
          <strong> stops processing</strong> rather than letting unchecked content through. Size its timeouts and availability
          like the production dependency it is. Its URL must also pass your tenant's outbound allowlist.
        </Callout>
        <p className="prose">
          Python <strong>toolkit</strong> tools can be plug-ins too: reference them as
          <span className="icode"> &lt;toolkit_name&gt;:&lt;plugin_name&gt;</span> under <span className="icode">plugins:</span>.
        </p>

        <h4>Where should this rule live?</h4>
        <DecisionFlow steps={[
          { q: 'Is it a standard policy: PII, hateful or harmful content, jailbreak detection?', branches: [
            { label: 'YES', to: 'A control (advanced): IBM-maintained, no code. See the end of this page.', tone: 'stop' },
            { label: 'NO', to: 'Continue', tone: 'go' },
          ] },
          { q: 'Is it a sensitive field moving through an agentic workflow?', branches: [
            { label: 'YES', to: 'Flow masking: aflow.mask_property() on that property.', tone: 'stop' },
            { label: 'NO', to: 'Continue', tone: 'go' },
          ] },
          { q: 'Must it hold every time: block, rewrite, mask, or authorise?', branches: [
            { label: 'YES', to: 'A plug-in: pre-invoke for input and access, post-invoke for output.', tone: 'stop' },
            { label: 'NO', to: 'Continue', tone: 'go' },
          ] },
          { q: 'Is it about tone, persona, or how the agent phrases things?', branches: [
            { label: 'YES', to: 'Agent instructions: guidance, not enforcement.', tone: 'stop' },
            { label: 'NO', to: 'When in doubt, enforce it in a plug-in.', tone: 'go' },
          ] },
        ]} />
        <DoDont
          dos={[
            'Enforce safety and compliance in plug-ins or controls',
            'Keep plug-ins fast: they run on every turn',
            'Fail closed when the payload is missing or malformed',
            'Re-run your red-team plan after adding a guardrail',
          ]}
          donts={[
            'Rely on "never reveal X" in the prompt as your only defence',
            'Call your identity provider on every message (use the RBAC actions)',
            'Trust a user’s claim of permission ("my manager said it’s fine")',
            'Put a plug-in under the wrong hook section (the agent import fails)',
          ]}
        />
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="controls" />
        <h3>Controls: policy guardrails without code <Pill tone="blue">Advanced</Pill></h3>
        <p className="prose">
          Controls attach an IBM-maintained <strong>policy</strong>, such as a PII filter or content guardrails, to agents, tools
          and models, at whichever hooks you choose. There's no code to write or maintain: you pick the policy, configure it, and
          bind it. <Cite href={doc.controls} />
        </p>
        <Callout kind="warning" title="Check you have it first">
          Controls need <strong>ADK 2.15+</strong> and the controls feature <strong>enabled on your instance</strong> (ask your
          administrator). If <span className="icode">orchestrate controls list-types</span> fails, it isn't on yet.
        </Callout>
        <DataTable
          first="strong"
          head={['', 'Plug-ins', 'Controls']}
          rows={[
            ['What you write', 'Python (or an OpenAPI service)', 'Configuration only'],
            ['Policy logic', 'Yours: any business rule', 'IBM-maintained (PII, HAP, jailbreak…)'],
            ['Hooks', 'agent pre / post-invoke', 'agent, tool and prompt-fetch (6 in total)'],
            ['Binds to', 'One agent (in its YAML)', 'Agents, tools and models (many at once)'],
            ['Version', 'ADK 2.1+', 'ADK 2.15+, enabled by an admin'],
            ['Reach for it when', 'Custom rules, entitlements, house formats', 'Standard safety & PII coverage, org-wide'],
          ]}
        />
        <p className="prose">
          A control can bind to any of six hooks: the four agent and tool hooks in the timeline above, plus
          <span className="icode"> prompt_pre_fetch</span> and <span className="icode">prompt_post_fetch</span>. The docs list the
          prompt-fetch hooks but don't yet describe their behaviour, so test them in Draft before relying on them.
        </p>
        <CodeBlock lang="bash" title="Discover the policies your instance offers" code={`orchestrate controls list-types
orchestrate controls get-type --name "PII Filter"`} />
        <CodeBlock lang="yaml" title="controls/content_safety.yaml (versioned with your agent)" code={`spec_version: v1
kind: control
control:
  artifact_name: Content Guardrails
  name: content_safety
  description: Blocks harmful content and jailbreaks around the HR assistant.
  hooks:
    - agent_pre_invoke         # screen the request
    - agent_post_invoke        # screen the reply
  priority: 100                # lower numbers run first
  config:
    enabled:
      hap: true
      harm: true
      jailbreak: true
      social_bias: true
    block_message: Sorry, I can't help with that request.
  agent_names:
    - hr_assistant`} />
        <CodeBlock lang="bash" title="Apply, inspect, version" code={`orchestrate controls import --file controls/content_safety.yaml
orchestrate controls list --agent hr_assistant
orchestrate controls get-details --name content_safety
orchestrate controls export --name content_safety --output controls/content_safety.yaml`} />
        <Callout kind="critical" title="Updating bindings replaces them">
          <span className="icode">orchestrate controls update --agent …</span> <strong>replaces</strong> that control's whole
          agent list (same for <span className="icode">--tool</span> and <span className="icode">--model</span>). Include the
          existing names, or you'll silently remove protection from other agents. Prefer editing the YAML and re-importing.
        </Callout>
        <Callout kind="tip" title="Use both">
          Controls give broad, maintained coverage; plug-ins add the rules only you know. A typical production agent runs a
          Content Guardrails control plus a pre-invoke plug-in for entitlements and a post-invoke plug-in for house masking.
        </Callout>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="check" />
        <h3>Knowledge check</h3>
        <Quiz accent="var(--c-build)" questions={buildQuiz} docsDefault={doc.pythonTool} />
      </Reveal>
    </PhaseShell>
  )
}
