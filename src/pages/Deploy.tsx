import { allPhases } from '../data/phases'
import { PhaseShell } from '../components/PhaseHero'
import { Reveal, Callout, DataTable } from '../components/Primitives'
import { ArchStack, ArchNode, DownArrow, FlowRow } from '../components/Diagrams'
import { CodeBlock } from '../components/CodeBlock'
import { Quiz } from '../components/Quiz'

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
        <p className="prose">After deploying, choose where users access the agent:</p>
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
        <p className="prose">Export from one environment and import to the next:</p>
        <CodeBlock lang="bash" title="Export → import between environments" code={`# Export from one environment
orchestrate agents export --name hr_assistant -o hr_assistant.zip

# Import to target environment
orchestrate agents import -f hr_assistant.zip`} />
        <Callout kind="warning" title="Works in Draft, fails in Live?">
          The classic cause is environment drift: Draft has different tools/agents than Live, or connections are configured for Draft
          but not Live. Run <span className="icode">orchestrate connections list</span> in both, and confirm tool imports landed in the
          correct environment.
        </Callout>
      </Reveal>

      <Reveal as="section" className="reveal">
        <div id="check" />
        <h3>Knowledge check</h3>
        <Quiz accent="var(--c-deploy)" questions={[
          {
            level: 'Easy',
            q: 'What’s the difference between Draft and Live?',
            options: ['Draft is faster', 'Draft is your build/test workspace; Live is production for real users', 'They are identical', 'Live is for testing'],
            answer: 1,
            why: 'Builders work in Draft (not visible to users); Live is production, and changes require a new deploy.',
          },
          {
            level: 'Easy',
            q: 'Which channel best fits a customer-facing, mobile use case?',
            options: ['Slack', 'WhatsApp', 'SMS only', 'Microsoft Teams'],
            answer: 1,
            why: 'WhatsApp suits customer-facing mobile; Slack and Teams are for internal use.',
          },
          {
            level: 'Medium', scenario: true,
            q: 'Your agent works in the chat preview but fails in Live. Most likely cause?',
            options: ['The LLM changed', 'Environment drift — tools/connections differ between Draft and Live', 'Too many quizzes', 'The favicon'],
            answer: 1,
            why: 'Confirm tool imports and connections exist in the correct environment — run connections list in both Draft and Live.',
          },
          {
            level: 'Medium', scenario: true,
            q: 'You updated an agent in Draft and tested it, but real users still get the old behaviour. Why?',
            options: ['Caching in the browser', 'Draft changes don’t reach users until you deploy to Live', 'The channel is down', 'The API key expired'],
            answer: 1,
            why: 'Draft is isolated from users. Changes only reach production when you deploy them to Live.',
          },
          {
            level: 'Hard',
            q: 'What is the recommended CI/CD promotion shape for a team?',
            options: ['Edit Live directly', 'Developer → Draft → QA review → Live, via export/import', 'Live → Draft → Developer', 'Only use the UI'],
            answer: 1,
            why: 'Promote by exporting from one environment and importing to the next: Developer → Draft → QA → Live.',
          },
          {
            level: 'Expert', scenario: true,
            q: 'You need to embed the chat widget for the production agent on your intranet. Which command generates it?',
            options: ['orchestrate agents deploy', 'orchestrate channels webchat embed --env live', 'orchestrate connections add', 'orchestrate chat ask'],
            answer: 1,
            why: 'channels webchat embed --env live produces the loader script and config for the Live agent to drop into your page.',
          },
        ]} />
      </Reveal>
    </PhaseShell>
  )
}
