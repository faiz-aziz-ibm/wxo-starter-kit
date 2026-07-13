import { allPhases } from '../data/phases'
import { PhaseShell } from '../components/PhaseHero'
import { Reveal, Callout, DataTable, DoDont, Pill, Stat, XRef } from '../components/Primitives'
import { DecisionTree, FlowRow } from '../components/Diagrams'
import { CodeBlock } from '../components/CodeBlock'

const phase = allPhases.find((p) => p.slug === 'build')!

const toc = [
  { id: 'first', label: 'Your first agent' },
  { id: 'styles', label: 'Agent styles' },
  { id: 'tools', label: 'Building tools' },
  { id: 'naming', label: 'Naming & docstrings' },
  { id: 'connections', label: 'Connections' },
  { id: 'workflows', label: 'Agentic workflows' },
  { id: 'nodes', label: 'The node catalogue' },
  { id: 'mapping', label: 'Data flow & mapping' },
  { id: 'kb', label: 'Knowledge bases' },
  { id: 'multi', label: 'Multi-agent systems' },
  { id: 'context', label: 'Context window' },
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
style: default
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
        <p className="prose">The agent style controls how the agent follows instructions. wxO formally describes three:</p>
        <DataTable
          first="strong"
          head={['Style', 'What it does', 'Best for']}
          rows={[
            ['default', 'Uses LLM prompts to decide tools & actions dynamically', 'Simple, linear tasks needing flexibility'],
            ['react', 'Iterative loop: Think → Act → Observe. Adjusts to outcomes', 'Complex, evolving tasks needing reasoning'],
            ['react_intrinsic', 'Like ReAct, but uses the model’s native chain-of-thought', 'Complex tasks with models that support intrinsic reasoning'],
          ]}
        />
        <Callout kind="tip" title="Start with default">
          Only switch styles when you have a specific, diagnosed failure. Some ADK versions expose extra styles such as
          <span className="icode"> planner</span> and <span className="icode">custom</span> — confirm availability for your version first.
        </Callout>
        <h4>default vs. react — the real trade-offs</h4>
        <DataTable
          first="strong"
          head={['Dimension', 'default', 'react']}
          rows={[
            ['Speed', 'Faster, fewer LLM calls', 'Slower, multiple calls per turn'],
            ['Latency', 'Lower', 'Higher (~1.5–3× per turn)'],
            ['Token cost', 'Lower', 'Higher (each step costs tokens)'],
            ['Transparency', 'Black box (in/out only)', 'Visible chain-of-thought'],
            ['Debugging', 'Harder to see failures', 'Easier — trace shows every step'],
            ['Risk', 'May pick wrong tool silently', 'Can loop if instructions unclear'],
          ]}
        />
        <Callout kind="warning" title="react increases latency">
          Each Reason-Act-Observe cycle is a separate LLM call. An agent that completes in 3s on <span className="icode">default</span>
          may take 8–12s on <span className="icode">react</span>. Always benchmark before committing.
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
        <DecisionTree accent="var(--c-build)" steps={[
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
          Supported auth: basic, bearer, api_key, key_value, and OAuth 2.0 flows.
        </Callout>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="workflows" />
        <h3>Building agentic workflows</h3>
        <p className="prose">
          An agent decides what to do on the fly. An <strong>agentic workflow</strong> does the opposite: it runs a defined sequence in a
          guaranteed order, with branching, loops, and human approvals. A workflow is imported and used like any other tool.
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
        <div id="multi" />
        <h3>Multi-agent systems: building the team</h3>
        <CodeBlock lang="yaml" title="supervisor.agent.yaml" code={`spec_version: v1
kind: native
name: aviva_supervisor
llm: groq/openai/gpt-oss-120b
style: default
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
    </PhaseShell>
  )
}
