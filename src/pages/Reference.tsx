import { useState } from 'react'
import { allPhases } from '../data/phases'
import { PhaseShell } from '../components/PhaseHero'
import { Reveal, DataTable, Card } from '../components/Primitives'
import { DecisionFlow } from '../components/Diagrams'
import { CodeBlock } from '../components/CodeBlock'
import { Flashcards } from '../components/Flashcards'
import { IconArrowUpRight } from '../icons/Icons'

const phase = allPhases.find((p) => p.slug === 'reference')!

const toc = [
  { id: 'cli', label: 'ADK command reference' },
  { id: 'yaml', label: 'Agent YAML' },
  { id: 'python', label: 'Python tool' },
  { id: 'flowchart', label: 'Architecture decision' },
  { id: 'checklist', label: 'Pre-deploy checklist' },
  { id: 'glossary', label: 'Glossary' },
  { id: 'flashcards', label: 'Flashcards' },
  { id: 'links', label: 'Key links' },
]

const glossary: [string, string][] = [
  ['ADK', 'Agent Development Kit — the Python SDK and CLI for wxO'],
  ['A2A', 'Agent-to-Agent Protocol — a standard for inter-agent communication'],
  ['Agentic Drift', 'When an agent becomes incoherent mid-conversation due to context overload'],
  ['Agentic Workflow', 'A deterministic workflow tool with branching, loops, and human-in-the-loop'],
  ['Chain of Thought', 'An LLM reasoning technique where the model explains its steps before acting'],
  ['Collaborator', 'An agent that another agent can delegate tasks to'],
  ['Context Window', 'The working memory of an LLM — the maximum text it can process at once'],
  ['Draft', 'Development environment; not visible to end users'],
  ['Grounding', 'Connecting agent responses to real data via knowledge bases or tools'],
  ['HITL', 'Human-in-the-Loop — a workflow step requiring human input or approval'],
  ['Knowledge Base', 'A searchable vector store of documents the agent can reference'],
  ['LLM', 'Large Language Model — the AI “brain” powering the agent'],
  ['Live', 'Production environment; accessible to end users'],
  ['MCP', 'Model Context Protocol — a standard way to expose tools to AI models'],
  ['Native Agent', 'An agent built and managed within wxO using the ADK'],
  ['OpenAPI', 'A standard format for describing REST APIs (YAML/JSON)'],
  ['RAG', 'Retrieval-Augmented Generation — searching documents before answering'],
  ['ReAct', 'Reason-Act-Observe — an agent reasoning pattern'],
  ['Supervisor Agent', 'A top-level agent that routes to specialist agents'],
  ['Tool', 'A function the agent can call to take actions or retrieve data'],
  ['Trace', 'A step-by-step log of an agent’s actions during one conversation'],
]

const links: [string, string][] = [
  ['wxO Developer Docs', 'https://developer.watson-orchestrate.ibm.com'],
  ['ADK GitHub Examples', 'https://github.com/IBM/ibm-watsonx-orchestrate-adk'],
  ['Documentation MCP Server', 'https://developer.watson-orchestrate.ibm.com/mcp'],
]

export default function Reference() {
  const [q, setQ] = useState('')
  const filtered = glossary.filter(([t, d]) => (t + d).toLowerCase().includes(q.toLowerCase()))
  return (
    <PhaseShell phase={phase} toc={toc} tagline="Everything you reach for most, in one place — commands, quick sheets, decision flowcharts and the full glossary.">
      <Reveal as="section" className="reveal">
        <div id="cli" />
        <h3>Cheat Sheet 1 · ADK command reference</h3>
        <CodeBlock lang="bash" title="orchestrate — the commands you’ll use most" code={`# -- AGENTS ------------------------------------------------
orchestrate agents list                          # List all agents
orchestrate agents import -f agent.yaml          # Import/update agent
orchestrate agents export -n myagent -k native -o out.zip
orchestrate agents deploy --name myagent         # Deploy draft to live
orchestrate agents remove --name myagent --kind native
orchestrate chat ask --agent-name myagent        # Chat in terminal

# -- TOOLS -------------------------------------------------
orchestrate tools list
orchestrate tools import -k python -f tool.py    # Python tool
orchestrate tools import -k python -f tool.py -r requirements.txt
orchestrate tools import -k openapi -f spec.yaml # OpenAPI tool
orchestrate tools import -k openapi -f spec.yaml -a myconn
orchestrate tools import -k flow -f flow.py      # Workflow tool

# -- KNOWLEDGE BASES ---------------------------------------
orchestrate knowledge-bases import -f kb.yaml
orchestrate knowledge-bases remove --name mykb   # Remove (NOT "delete")

# -- CONNECTIONS -------------------------------------------
orchestrate connections add -a myconn                              # 1. register
orchestrate connections configure -a myconn --env draft --type team --kind bearer  # 2. auth type
orchestrate connections set-credentials -a myconn --env draft --token "mytoken"     # 3. secrets

# -- TOOLKITS (MCP) ----------------------------------------
orchestrate toolkits add --kind mcp --name x --description "..." --url <url> --transport streamable_http --tools "*"

# -- CHANNELS / EVALS / TRACES -----------------------------
orchestrate channels webchat embed --agent-name myagent --env live
orchestrate evaluations record --output-dir ./recordings
orchestrate observability traces search --agent-name myagent --last 1h

# -- ENVIRONMENTS ------------------------------------------
orchestrate env add -n <env-name> -u <service-url>   # Register (one-time)
orchestrate env activate <env-name>                  # Authenticate (re-run every 2h on SaaS)`} />
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="yaml" />
        <h3>Cheat Sheet 2 · Agent YAML quick reference</h3>
        <CodeBlock lang="yaml" title="agent.yaml" code={`spec_version: v1
kind: native                    # native | external | assistant
name: my_agent                  # Unique name (snake_case)
llm: groq/openai/gpt-oss-120b   # a common wxO model
style: default                  # default | react | react_intrinsic
description: |                   # Used by supervisor for routing
  Brief description for routing.
instructions: |                 # Behaviour rules (the agent reads this)
  Your persona, rules, and guidance.
tools:
  - my_tool_1
collaborators:                  # Other agents to delegate to
  - specialist_agent_1
knowledge_base:
  - my_knowledge_base
memory_enabled: false           # true = remembers session history
hide_reasoning: false           # true = hides thinking from user
is_schedulable: false           # true = can be scheduled`} />
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="python" />
        <h3>Cheat Sheet 3 · Python tool quick reference</h3>
        <CodeBlock lang="python" title="tool.py" code={`from ibm_watsonx_orchestrate.agent_builder.tools import tool
from ibm_watsonx_orchestrate.agent_builder.tools import ToolPermission

@tool(
    name="optional_custom_name",           # Defaults to function name
    permission=ToolPermission.READ_ONLY    # READ_ONLY | READ_WRITE
)
def my_tool(input_param: str, optional: int = 0) -> str:
    """
    One line summary of what this tool does.    # the agent reads this
    Args:
        input_param (str): What this parameter is.
        optional (int): An optional integer. Default 0.
    Returns:
        str: Description of what is returned.
    """
    return result`} />
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="flowchart" />
        <h3>Cheat Sheet 4 · Architecture decision flowchart</h3>
        <DecisionFlow accent="var(--teal)" steps={[
          { q: 'Is the task deterministic (same input = same output)?', branches: [{ label: 'YES', to: 'Tool or Agentic Workflow, not an Agent', tone: 'stop' }, { label: 'NO', to: 'Continue', tone: 'go' }] },
          { q: 'Does it need to decide between different paths?', branches: [{ label: 'YES', to: 'Agent', tone: 'go' }, { label: 'NO', to: 'Tool or Workflow', tone: 'stop' }] },
          { q: 'How many distinct task types does it handle?', branches: [{ label: '1–4', to: 'Single Agent + Tools', tone: 'go' }, { label: '5+', to: 'Supervisor + Specialists', tone: 'stop' }] },
          { q: 'Does it require human approval mid-process?', branches: [{ label: 'YES', to: 'Agentic Workflow with a User Activity Node', tone: 'stop' }, { label: 'NO', to: 'Pure Agent', tone: 'go' }] },
          { q: 'Integrate with an existing agent platform?', branches: [{ label: 'YES', to: 'External Agent (A2A / external_chat)', tone: 'stop' }, { label: 'NO', to: 'Native wxO Agent', tone: 'go' }] },
        ]} />
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="checklist" />
        <h3>Cheat Sheet 5 · Pre-deployment testing checklist</h3>
        <div className="grid-2">
          {[
            ['Functional', ['Happy path works end-to-end', 'Agent calls the correct tools', 'Asks for clarification when inputs missing', 'Declines out-of-scope gracefully', 'Multi-turn maintains context']],
            ['Edge case', ['Empty or null inputs handled', 'Very long inputs handled', 'Ambiguous queries trigger clarification', 'API/tool timeouts handled gracefully', 'Duplicate requests idempotent']],
            ['Security', ['Prompt injection attempts fail', 'System prompt not exposed', 'Agent stays in its role', 'Credentials not echoed back']],
            ['Performance', ['Response time within budget', 'Consistent across repeated runs', 'No context overflow on long chats']],
          ].map(([title, items], i) => (
            <Card key={i} accent="var(--teal)">
              <div className="callout-label" style={{ color: 'var(--teal)', marginBottom: 12 }}>{title as string}</div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
                {(items as string[]).map((it, j) => (
                  <li key={j} style={{ display: 'flex', gap: 9, fontSize: '0.9rem', color: 'var(--text-1)', lineHeight: 1.45 }}>
                    <span style={{ color: 'var(--teal)', flexShrink: 0 }}>☐</span>{it}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="glossary" />
        <h3>Glossary</h3>
        <input
          className="gloss-search"
          placeholder="Filter terms…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <DataTable
          first="strong"
          head={['Term', 'Definition']}
          rows={filtered.map(([t, d]) => [t, d])}
        />
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="flashcards" />
        <h3>Test yourself: glossary flashcards</h3>
        <p className="prose">
          See the term, recall the meaning, then flip to check. Mark each <strong>Knew it</strong> or <strong>Review</strong> —
          at the end you can practise just the ones you flagged. The deck reshuffles every time.
        </p>
        <Flashcards cards={glossary} accent="var(--teal)" />
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="links" />
        <h3>Key links</h3>
        <div className="grid-3">
          {links.map(([name, url], i) => (
            <a key={i} href={url} target="_blank" rel="noreferrer" className="card card-hover" style={{ ['--accent' as string]: 'var(--teal)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
              <span style={{ fontWeight: 500 }}>{name}</span>
              <IconArrowUpRight width={17} height={17} style={{ color: 'var(--teal)', flexShrink: 0 }} />
            </a>
          ))}
        </div>
      </Reveal>
    </PhaseShell>
  )
}
