# watsonx Orchestrate — Architect Toolkit (`.bob`)

Everything you need to turn your AI coding assistant into a **watsonx Orchestrate Agent Architect**.
Curated by **Faiz Aziz** · faiz.aziz@ibm.com · Data & AI Delivery Consultant, IBM Expert Labs.

Drop the `.bob` folder into the root of your project and your assistant gains:

- **WXO Agent Architect mode** — a custom persona ("Bob") tuned for authoring wxO agents, tools, flows, knowledge bases and connections.
- **Two MCP servers** wired up:
  - `watsonx-orchestrate-adk-docs` — the official wxO documentation MCP server (searchable docs).
  - `watsonx-orchestrate-adk` — the ADK MCP server that can list/create agents, tools and resources in your environment.
- **Eight wxO skills** covering the full lifecycle:
  - **Design → build → document:** `solution-architect`, `sop-builder`, `wxo-builder`, `wxo-analyzer`
  - **Review & quality:** `agent-instructions-evaluator`, `agentic-workflow-advisor`
  - **Debug in production:** `telemetry-analyzer`
  - **Specialist build:** `customercare-mcp-builder`

## What's inside

```
.bob/
├── custom_modes.yaml     # The WXO Agent Architect mode
├── mcp.json              # ADK docs + ADK MCP server config
└── skills/
    ├── README.md                     # Full skills catalogue
    ├── solution-architect/
    ├── sop-builder/
    ├── wxo-builder/                  # SKILL.md + references/ (CLI, schemas, KB, testing…)
    ├── wxo-analyzer/
    ├── agent-instructions-evaluator/ # SKILL.md + scripts/ + scoring rubrics
    ├── agentic-workflow-advisor/     # SKILL.md + scripts/
    ├── telemetry-analyzer/           # SKILL.md + trace export/search scripts
    └── customercare-mcp-builder/     # SKILL.md + references/examples.md
```

## Setup

1. **Drop `.bob/` into your project's working directory.** That's it for wiring — your assistant picks up
   the **WXO Agent Architect** mode, the **wxO skills**, and both **MCP servers** automatically. No manual config.
2. **Prerequisites so the MCP servers can run:** install [`uv`](https://docs.astral.sh/uv/) (provides `uvx`) and the ADK:
   ```bash
   pip install ibm-watsonx-orchestrate
   ```
3. **Authenticate the ADK** against your environment (see the Deploy chapter of the Starter Kit):
   ```bash
   orchestrate env add -n my-wxo-env -u <your-service-instance-url>
   orchestrate env activate my-wxo-env
   ```
4. **Select the WXO Agent Architect mode and start building.**

> **Optional — file read/write access.** By default the ADK MCP server can't touch the filesystem. If you want it
> to import/export resources, set `WXO_MCP_WORKING_DIRECTORY` in `mcp.json` to the folder it may read/write:
> ```json
> "env": { "WXO_MCP_WORKING_DIRECTORY": "/absolute/path/to/your/project" }
> ```

## The skills at a glance

| Skill | Turns… | …into |
| --- | --- | --- |
| solution-architect | a business problem | a structured solution architecture |
| sop-builder | a workflow (BPMN / n8n / Langflow) | a business-readable SOP |
| wxo-builder | an SOP or prompt | a working wxO implementation (agents, tools, flows, KBs) |
| wxo-analyzer | an existing wxO project | documentation + anti-pattern analysis |
| agent-instructions-evaluator | an agent's instructions / YAML | a scored achievability report with fixes |
| agentic-workflow-advisor | an agentic workflow (JSON or `@flow`) | prioritised architecture recommendations |
| telemetry-analyzer | agent traces (OTel or Langfuse JSON) | a bug report with root causes and fixes |
| customercare-mcp-builder | customer-care requirements | a production MCP server (widgets, transactions, auth) |

**Build loop:** solution-architect → sop-builder → wxo-builder → wxo-analyzer.
**Quality loop:** before you ship, run **agent-instructions-evaluator** on each agent and
**agentic-workflow-advisor** on each flow; once it's live, use **telemetry-analyzer** on real traces.

> **Script-backed skills.** `agent-instructions-evaluator`, `agentic-workflow-advisor` and `telemetry-analyzer`
> ship small Python helpers in their `scripts/` folders. Run them inside the same venv as the ADK
> (`pip install ibm-watsonx-orchestrate pyyaml requests`). `telemetry-analyzer` needs an activated
> `orchestrate env` (see its README) — it never stores credentials in the toolkit.

---

Unofficial community toolkit. Always confirm behaviour against the official
[wxO developer docs](https://developer.watson-orchestrate.ibm.com).
