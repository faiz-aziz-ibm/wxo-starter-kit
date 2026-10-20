import { allPhases } from '../data/phases'
import { PhaseShell } from '../components/PhaseHero'
import { Reveal, Callout, DataTable, Cite } from '../components/Primitives'
import { ArchStack, ArchNode, DownArrow, FlowRow } from '../components/Diagrams'
import { CodeBlock } from '../components/CodeBlock'
import { Quiz } from '../components/Quiz'
import { deployQuiz } from '../data/quizzes'
import { doc } from '../data/docs'

const phase = allPhases.find((p) => p.slug === 'deploy')!

const toc = [
  { id: 'envs', label: 'Draft vs. Live' },
  { id: 'deploy', label: 'Deploying an agent' },
  { id: 'channels', label: 'Channels' },
  { id: 'embed', label: 'Embedding webchat' },
  { id: 'cicd', label: 'CI/CD promotion' },
  { id: 'check', label: 'Knowledge check' },
]

export default function Deploy() {
  return (
    <PhaseShell phase={phase} toc={toc} tagline="Environments & channels. From your draft workspace to real users.">
      <Reveal as="section" className="reveal">
        <div id="envs" />
        <h3>Draft vs. Live: understanding environments</h3>
        <ArchStack>
          <ArchNode title="Draft Environment" sub="Your development workspace · builders access via Manage Agents · not visible to end users" tone="default" wide />
          <DownArrow label="deploy" />
          <ArchNode title="Live Environment" sub="Production · end users access via chat UI & channels · changes require a new deploy" tone="primary" wide />
        </ArchStack>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="deploy" />
        <h3>Deploying an agent</h3>
        <p className="prose">In the UI: <strong>Manage Agents → select the agent → Deploy</strong>. In the ADK:</p>
        <CodeBlock lang="bash" code={`orchestrate agents deploy --name hr_assistant`} />
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="channels" />
        <h3>Channels: where does your agent live?</h3>
        <p className="prose">After deploying, choose where users access the agent: <Cite href={doc.channels} /></p>
        <DataTable
          first="strong"
          head={['Channel', 'Best for']}
          rows={[
            ['Webchat (embed)', 'Company intranet, portals, websites'],
            ['Slack', 'Internal team use'],
            ['WhatsApp', 'Customer-facing, mobile'],
            ['SMS (Twilio)', 'Alerts, notifications, simple interactions'],
            ['Microsoft Teams', 'Enterprise internal use'],
            ['Genesys', 'Contact centre integration'],
            ['API', 'Custom integrations, headless use'],
          ]}
        />
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="embed" />
        <h4>Embedding webchat</h4>
        <CodeBlock lang="bash" title="Generate the embed script" code={`orchestrate channels webchat embed \\
  --agent-name hr_assistant \\
  --env live`} />
        <CodeBlock lang="html" title="Add it to your HTML page" code={`<!DOCTYPE html>
<body>
  <div id="root"></div>
  <script>
    window.wxOConfiguration = {
      hostURL: "https://dl.watson-orchestrate.ibm.com",
      chatOptions: {
        agentId: "your-agent-id",
        agentEnvironmentId: "your-env-id"
      }
    };
    // ... loader script from CLI output ...
  </script>
</body>`} />
        <h4>Setting up Slack</h4>
        <CodeBlock lang="bash" code={`orchestrate channels create \\
  --agent-name hr_assistant \\
  --env live \\
  --type byo_slack \\
  --name "HR Slack Bot" \\
  --field bot_token=xoxb-your-token \\
  --field signing_secret=your-secret`} />
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="cicd" />
        <h3>CI/CD: promoting through environments</h3>
        <p className="prose">For teams running structured deployments, the shape is:</p>
        <FlowRow accent="var(--c-deploy)" steps={[
          { title: 'Developer', sub: 'builds locally' },
          { title: 'Draft', sub: 'integration workspace' },
          { title: 'QA Review', sub: 'evaluation gate' },
          { title: 'Live', sub: 'production' },
        ]} />
        <p className="prose">Export from one environment and import to the next: <Cite href={doc.cicd} /></p>
        <CodeBlock lang="bash" title="Export → import between environments" code={`# Export from one environment
orchestrate agents export --name hr_assistant -o hr_assistant.zip

# Import to target environment
orchestrate agents import -f hr_assistant.zip`} />
        <h4>Promote the guardrails with the agent</h4>
        <p className="prose">
          A guardrail that exists in Draft but not Live is a production incident waiting to happen. Treat guardrails as code:
          plug-ins are tools, so import them <strong>before</strong> the agents that reference them; controls export to YAML, so
          version them next to the agent. <Cite href={doc.controls} />
        </p>
        <CodeBlock lang="bash" title="Release order in the target environment" code={`# 1. Plug-ins (they're Python tools) before the agents that list them
orchestrate tools import -k python -f plugins/injection_guard.py
orchestrate tools import -k python -f plugins/email_masking_plugin.py

# 2. Agents
orchestrate agents import -f hr_assistant.agent.yaml

# 3. Controls (ADK 2.15+, if enabled), bound by agent name
orchestrate controls import --file controls/content_safety.yaml
orchestrate controls list --agent hr_assistant      # verify the binding landed`} />
        <Callout kind="critical" title="Controls bind by name">
          A control's <span className="icode">agent_names</span> must match the agent's name in the <em>target</em> environment.
          Never patch Live with <span className="icode">controls update --agent</span>: it <strong>replaces</strong> the whole
          binding list. Re-import the versioned YAML instead.
        </Callout>
        <Callout kind="warning" title="Works in Draft, fails in Live?">
          The classic cause is environment drift: Draft has different tools/agents than Live, or connections are configured for Draft
          but not Live. Run <span className="icode">orchestrate connections list</span> in both, and confirm tool imports landed in the
          correct environment.
        </Callout>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="check" />
        <h3>Knowledge check</h3>
        <Quiz accent="var(--c-deploy)" questions={deployQuiz} docsDefault={doc.channels} />
      </Reveal>
    </PhaseShell>
  )
}
