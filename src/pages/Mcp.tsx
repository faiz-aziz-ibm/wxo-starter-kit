import { allPhases } from '../data/phases'
import { PhaseShell } from '../components/PhaseHero'
import { Reveal, Callout, DataTable, Card } from '../components/Primitives'
import { CodeBlock } from '../components/CodeBlock'
import { Link } from 'react-router-dom'
import { IconArrowUpRight, IconPlug, IconTerminal, IconBook, IconDownload } from '../icons/Icons'

const phase = allPhases.find((p) => p.slug === 'mcp')!

const toc = [
  { id: 'what', label: 'What is MCP?' },
  { id: 'three', label: 'Three ways MCP shows up' },
  { id: 'toolkits', label: 'MCP toolkits' },
  { id: 'remote', label: 'Remote toolkits' },
  { id: 'local', label: 'Local toolkits' },
  { id: 'server', label: 'The wxO MCP Server' },
  { id: 'docs', label: 'The Docs MCP Server' },
  { id: 'auth', label: 'Auth & transports' },
]

export default function Mcp() {
  return (
    <PhaseShell phase={phase} toc={toc} tagline="Model Context Protocol in watsonx Orchestrate — bring external tools in, and let AI clients drive wxO. Three distinct concepts, made clear.">
      <Reveal as="section" className="reveal">
        <div id="what" />
        <h3>What is MCP?</h3>
        <p className="prose">
          The <strong>Model Context Protocol (MCP)</strong> is a standard way to expose tools to AI models. It’s adopted across most
          leading AI platforms — watsonx Orchestrate, GitHub Copilot, Cursor, Claude Desktop and many more. Because everyone speaks the
          same protocol, a tool written once can be reused everywhere.
        </p>
        <Callout kind="note" title="Three different things share the name “MCP” in wxO">
          People conflate them constantly. They point in opposite directions — get the direction right and everything else follows.
        </Callout>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="three" />
        <h3>Three ways MCP shows up</h3>
        <div className="grid-3">
          <Card accent="var(--c-mcp)" hover>
            <div className="aud-icon" style={{ background: 'color-mix(in srgb, var(--c-mcp) 14%, transparent)', color: 'var(--c-mcp)' }}><IconPlug width={22} height={22} /></div>
            <h4 style={{ margin: '0 0 6px' }}>1 · MCP Toolkits</h4>
            <p className="muted" style={{ fontSize: '0.9rem', margin: 0 }}>Bring <strong>external MCP tools into wxO</strong>, so your agents can call them. Local (stdio) or remote (HTTP/SSE).</p>
          </Card>
          <Card accent="var(--purple)" hover>
            <div className="aud-icon" style={{ background: 'color-mix(in srgb, var(--purple) 14%, transparent)', color: 'var(--purple)' }}><IconTerminal width={22} height={22} /></div>
            <h4 style={{ margin: '0 0 6px' }}>2 · wxO MCP Server</h4>
            <p className="muted" style={{ fontSize: '0.9rem', margin: 0 }}>Lets AI clients <strong>manage your wxO resources</strong> — create agents, tools & KBs from Cursor, Copilot or Claude Desktop.</p>
          </Card>
          <Card accent="var(--teal)" hover>
            <div className="aud-icon" style={{ background: 'color-mix(in srgb, var(--teal) 14%, transparent)', color: 'var(--teal)' }}><IconBook width={22} height={22} /></div>
            <h4 style={{ margin: '0 0 6px' }}>3 · Docs MCP Server</h4>
            <p className="muted" style={{ fontSize: '0.9rem', margin: 0 }}>A remote server that lets any AI client <strong>query the wxO documentation</strong> directly while you build.</p>
          </Card>
        </div>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="toolkits" />
        <h3>1 · MCP toolkits — bringing tools into wxO</h3>
        <p className="prose">
          A <strong>toolkit</strong> is a collection of tools imported as a single unit. wxO supports MCP toolkits in two execution modes:
        </p>
        <DataTable
          first="strong"
          head={['Mode', 'How it runs', 'When to use']}
          rows={[
            ['Local MCP toolkit', 'Inside the wxO runtime via stdio · Python or Node.js · imported from npm, PyPI or local filesystem', 'You have existing MCP servers, need Node.js, or want protocol features (resources, prompts)'],
            ['Remote MCP toolkit', 'Connects to an external MCP server over HTTP (SSE or streamable HTTP)', 'Tools live in cloud services or third-party APIs; centralized management'],
          ]}
        />
        <Callout kind="warning" title="MCP Toolkits are not Python Tools">
          MCP servers run as separate processes and must be reachable by wxO at runtime. Don’t use them for one-off tools — the
          operational overhead isn’t worth it for a single function. Local toolkits also carry ~100–300 ms process-startup overhead per call.
        </Callout>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="remote" />
        <h4>Adding a remote MCP toolkit</h4>
        <CodeBlock lang="bash" title="orchestrate toolkits add — remote (streamable HTTP)" code={`orchestrate toolkits add --kind mcp \\
  --name github \\
  --description "GitHub remote toolkit" \\
  --url "https://api.githubcopilot.com/mcp/" \\
  --transport "streamable_http" \\
  --tools "list-issues" \\
  --app-id "mcpgithub"`} />
        <CodeBlock lang="bash" title="Remote via SSE (e.g. CoinGecko)" code={`orchestrate toolkits add --kind mcp \\
  --name coingecko \\
  --description "coingecko toolkit" \\
  --url "https://mcp.api.coingecko.com/sse" \\
  --transport "sse" \\
  --tools "get_range_coins_market_chart"`} />
        <p className="prose muted">Use <span className="icode">--tools "*"</span> to import everything, or a comma-separated subset. The <span className="icode">--app-id</span> attaches a <strong>key_value</strong> connection whose keys become environment variables for the server.</p>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="local" />
        <h4>Importing a local MCP toolkit</h4>
        <Callout kind="note" title="A 2.0 naming change to know">
          The former <span className="icode">orchestrate toolkits import</span> command was renamed to <span className="icode">orchestrate toolkits add</span>.
          A new <span className="icode">toolkits import</span> now works on files (the inverse of <span className="icode">toolkits export</span>).
        </Callout>
        <CodeBlock lang="bash" title="From npm — with a key_value connection for secrets" code={`# Set up the connection first
orchestrate connections add -a tavily
for env in draft live; do
  orchestrate connections configure -a tavily --env $env --type team --kind key_value
  orchestrate connections set-credentials -a tavily --env $env -e "TAVILY_API_KEY=$TAVILY_API_KEY"
done

# Import the toolkit
orchestrate toolkits add --kind mcp \\
  --name tavily \\
  --description "Search the internet" \\
  --command "npx -y tavily-mcp@0.1.3" \\
  --tools "*" \\
  --app-id tavily`} />
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="server" />
        <h3>2 · The watsonx Orchestrate MCP Server</h3>
        <p className="prose">
          This one points the other way. The <strong>wxO ADK MCP Server</strong> exposes the ADK’s capabilities — creating agents, tools
          and knowledge bases — as MCP tools, so an AI client (Cursor, GitHub Copilot, Claude Desktop) can build in your environment
          conversationally. A great way to move fast.
        </p>
        <CodeBlock lang="bash" title="Install & run the server" code={`# Recommended: run in an isolated environment with pipx or uvx
pipx run ibm-watsonx-orchestrate-mcp-server

# Or install it
pip install --upgrade ibm-watsonx-orchestrate-mcp-server
ibm-watsonx-orchestrate-mcp-server`} />
        <Callout kind="warning" title="File access is blocked by default">
          For security, the server blocks tools from touching the filesystem. To allow reads/writes (needed for import/export), set a
          root working directory: <span className="icode">WXO_MCP_WORKING_DIRECTORY=&lt;file_path&gt;</span>. Tools then stay within that
          directory and its subdirectories.
        </Callout>
        <Callout kind="tip" title="Get it pre-wired — the Architect Toolkit">
          The <Link to="/roadmap" className="xref">Architect Toolkit<IconArrowUpRight width={13} height={13} /></Link> bundles this
          server and the docs server (with a ready <span className="icode">mcp.json</span>), plus an Agent Architect mode and four wxO
          skills — as a single downloadable <span className="icode">.bob</span> folder. No manual wiring.
        </Callout>
        <div style={{ margin: '18px 0', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <img src="./bob_logo.svg" alt="Bob, the WXO Agent Architect mascot" style={{ width: 64, height: 64, filter: 'drop-shadow(0 8px 18px rgba(15,98,254,0.35))' }} />
          <a className="rm-dl-btn" href="./downloads/wxo-architect-toolkit.zip" download style={{ display: 'inline-flex' }}>
            <IconDownload width={19} height={19} /> Download the Architect Toolkit
          </a>
        </div>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="docs" />
        <h3>3 · The Documentation MCP Server</h3>
        <p className="prose">
          A remote server (streamable HTTP) that lets your AI client answer questions straight from the official wxO docs while you
          work. Point any MCP client at it:
        </p>
        <CodeBlock lang="text" title="Endpoint" code={`https://developer.watson-orchestrate.ibm.com/mcp`} />
        <CodeBlock lang="json" title=".vscode/mcp.json — GitHub Copilot / Cursor" code={`{
  "servers": {
    "wxo-docs": {
      "type": "http",
      "url": "https://developer.watson-orchestrate.ibm.com/mcp"
    }
  }
}`} />
        <CodeBlock lang="json" title="Claude Desktop — via mcp-proxy" code={`{
  "mcpServers": {
    "wxo-docs": {
      "command": "uvx",
      "args": [
        "mcp-proxy",
        "--transport", "streamablehttp",
        "https://developer.watson-orchestrate.ibm.com/mcp"
      ]
    }
  }
}`} />
        <p className="prose muted" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <a href="https://developer.watson-orchestrate.ibm.com/mcp" target="_blank" rel="noreferrer" style={{ color: 'var(--teal)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            Open the Docs MCP endpoint <IconArrowUpRight width={14} height={14} />
          </a>
        </p>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="auth" />
        <h3>Auth &amp; transports at a glance</h3>
        <DataTable
          first="strong"
          head={['Concern', 'Details']}
          rows={[
            ['Remote transports', 'SSE and streamable HTTP. You must choose explicitly — no automatic fallback.'],
            ['Local transport', 'stdio only (Python or Node.js), running inside the wxO runtime.'],
            ['Auth methods (remote)', 'OAuth2 (no DCR), API Key, Bearer Token, Basic Auth, Key-value.'],
            ['Connections for toolkits', 'Only key_value connections are supported; each key/value becomes an env var.'],
            ['Custom-named API keys', 'Use the key-value pair method rather than a plain api_key connection.'],
          ]}
        />
        <Callout kind="tip" title="Pick the right mental model">
          <strong>Toolkits</strong> = tools flowing <em>into</em> wxO for your agents. The <strong>wxO MCP Server</strong> = AI clients reaching
          <em> into</em> wxO to build. The <strong>Docs Server</strong> = knowledge flowing <em>out</em> to your AI client. Direction is everything.
        </Callout>
      </Reveal>
    </PhaseShell>
  )
}
