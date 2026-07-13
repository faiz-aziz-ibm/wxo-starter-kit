import type { QuizQuestion } from '../components/Quiz'

/* Central question banks — each phase page renders its own bank, and the
   Capstone exam pulls the Hard/Expert questions from all of them. */

export const foundationsQuiz: QuizQuestion[] = [
  { level: 'Easy', q: 'What makes an agent different from a chatbot?',
    options: ['It uses a bigger model', 'It reasons about a goal, chooses tools, and acts', 'It only answers from documents', 'It runs one fixed script'],
    answer: 1, why: 'An agent wraps an LLM with a goal, tools and instructions — it decides how to reach the goal, rather than just talking or running a fixed path.' },
  { level: 'Easy', q: 'Where on the agentic spectrum should you start?',
    options: ['As far right (most autonomous) as possible', 'Always multi-agent', 'As far left as your use case allows', 'It doesn’t matter'],
    answer: 2, why: 'Start as simple as the use case allows — you rarely need the far right, and simpler systems are more reliable and cheaper.' },
  { level: 'Medium', q: 'Which statement about the UI Builder and the ADK is true?',
    options: ['They store separate, unrelated agents', 'They manage the same underlying objects', 'The UI is for production only', 'The ADK cannot version-control agents'],
    answer: 1, why: 'Both approaches manage the same agents, tools and flows. The ADK adds control and version control; the UI is faster to start.' },
  { level: 'Medium', scenario: true, q: 'Your team needs to answer employee questions grounded in ~200 internal PDF policies — no actions taken. Which level fits?',
    options: ['Simple chatbot', 'RAG (grounded answers)', 'Multi-agent system', 'Autonomous workflow'],
    answer: 1, why: 'Grounded answers from your own documents is exactly RAG. No actions are taken, so you don’t need a tool-using or multi-agent system.' },
  { level: 'Hard', scenario: true, q: 'On SaaS, your ADK commands worked this morning but now fail to authenticate. What’s the fix?',
    options: ['Run orchestrate login', 'Reinstall the ADK', 'Re-run orchestrate env activate', 'Generate a new service instance'],
    answer: 2, why: 'SaaS sessions expire about every two hours. Re-run orchestrate env activate to re-authenticate — there is no login command.' },
  { level: 'Hard', q: 'An agent “takes an action” for a user. Which capability makes that possible?',
    options: ['A larger context window', 'A tool it can call', 'A knowledge base', 'A longer prompt'],
    answer: 1, why: 'Without tools an agent can only talk. Tools are what let it act — search a system, send an email, create a ticket.' },
]

export const designQuiz: QuizQuestion[] = [
  { level: 'Easy', q: 'What does an agent’s description field primarily drive?',
    options: ['How the agent talks to users', 'How a Supervisor routes tasks to it', 'Which LLM it uses', 'Its response length'],
    answer: 1, why: 'The Supervisor reads each collaborator’s description to decide where to route — it is functional code, not documentation.' },
  { level: 'Easy', q: 'Roughly how much of your time should go into design?',
    options: ['0% — just build', 'About 20%', 'About 80%', 'All of it'],
    answer: 1, why: 'Spend ~20% designing and 80% building. Architecture decisions made up front save you far more time later.' },
  { level: 'Medium', q: 'A task has clear, deterministic steps that always run in the same order. What should you reach for?',
    options: ['A single agent with a big prompt', 'An agentic workflow', 'More collaborators', 'A larger context window'],
    answer: 1, why: 'Deterministic sequences belong in an agentic workflow, not in agent instructions the model might skip.' },
  { level: 'Medium', scenario: true, q: 'You want the agent to greet the signed-in user by name without ever asking for it. What do you configure?',
    options: ['A knowledge base of names', 'context_access_enabled + context_variables, referenced as {name}', 'A bigger LLM', 'react style'],
    answer: 1, why: 'Enable context access, declare the variable, and reference {name} in instructions — the runtime supplies it each run.' },
  { level: 'Hard', scenario: true, q: 'Your Supervisor routes almost every request to the HR agent, even finance questions. Most likely cause?',
    options: ['The LLM is too small', 'The HR agent’s description is too broad and the others too vague', 'Too few collaborators', 'memory_enabled is off'],
    answer: 1, why: 'Routing depends entirely on collaborator descriptions. Tighten the over-broad one with explicit exclusions and strengthen the others with trigger phrases.' },
  { level: 'Expert', scenario: true, q: 'The same context variable name exists in both the JWT token and the pre:send instance method. Which value does the agent see?',
    options: ['The instance-method value', 'The JWT value', 'Whichever is longer', 'It errors'],
    answer: 1, why: 'When a name collides, the JWT value takes precedence over the /runs (instance) value. Use different names to avoid surprises.' },
]

export const buildQuiz: QuizQuestion[] = [
  { level: 'Easy', q: 'How does an agent decide when to call a Python tool?',
    options: ['By the order tools were imported', 'From the tool’s name and docstring', 'It calls every tool each turn', 'From the LLM’s training data'],
    answer: 1, why: 'The agent reads the tool name and docstring (its description) to decide relevance and what parameters to pass — so write them clearly.' },
  { level: 'Easy', q: 'What is the research-backed number of tools to give a single agent?',
    options: ['1 only', '3–7', '10–15', 'As many as possible'],
    answer: 1, why: 'Beyond ~7 tools, selection accuracy drops — that is the Tool Soup anti-pattern. Curate to 3–7 focused tools.' },
  { level: 'Medium', scenario: true, q: 'A tool returns 2,000 rows and the agent starts forgetting its instructions mid-chat. What happened?',
    options: ['The LLM is too small', 'Context window overflow (the Firehose)', 'Wrong agent style', 'Missing knowledge base'],
    answer: 1, why: 'A tool that dumps large data floods the context window. Return the minimum useful data — paginate and summarise.' },
  { level: 'Medium', q: 'You need a guaranteed order of steps with a human approval in the middle. Which building block?',
    options: ['A bigger prompt', 'An agentic workflow with a User Activity node', 'react style', 'More collaborators'],
    answer: 1, why: 'Deterministic sequencing with human-in-the-loop is exactly what agentic workflows are for.' },
  { level: 'Hard', scenario: true, q: 'You imported an OpenAPI tool whose operation is named getRecordsV2 with the description “Returns a 200 response”. The agent keeps calling it at the wrong time. Best fix?',
    options: ['Delete the tool', 'Switch to react style', 'Rename the operation and rewrite the description in plain, intent-led language', 'Add more tools so it has options'],
    answer: 2, why: 'OpenAPI specs are written for programmatic use. Give the operation an intent-led name and description the agent can reason about — otherwise you’re in Tool Soup.' },
  { level: 'Hard', scenario: true, q: 'A Doc Processing node’s large output auto-maps into the next node and the run fails with a token-overflow error. What’s the fix?',
    options: ['Retry the whole flow', 'Use explicit mapping to pass only the fields you need', 'Increase max_retries', 'Switch the node to an Agent node'],
    answer: 1, why: 'Auto-mapping can inject a whole large structure into the model context. Map each needed field explicitly so only what matters flows through.' },
  { level: 'Expert', q: 'Which is the strongest reason to switch an agent from default to react style?',
    options: ['To respond faster', 'To reduce token cost', 'To see a visible chain-of-thought when debugging conditional, multi-step logic', 'To use more tools'],
    answer: 2, why: 'react is slower and costs more, but its visible reason→act→observe trace makes multi-step, conditional behaviour far easier to debug.' },
]

export const testQuiz: QuizQuestion[] = [
  { level: 'Easy', q: 'What does Level 3 (red-teaming) test for?',
    options: ['Response speed', 'Whether the agent can be manipulated into misbehaving', 'Grammar quality', 'Token cost'],
    answer: 1, why: 'Red-teaming probes prompt injection, data leakage, role confusion and policy bypass — can the agent be tricked?' },
  { level: 'Easy', q: 'Which is NOT part of the beginner functional-testing checklist?',
    options: ['Happy path works', 'Out-of-scope declined gracefully', 'The agent memorises the whole KB', 'Missing info triggers a clarifying question'],
    answer: 2, why: 'You test behaviour: happy path, missing info, out-of-scope, edge cases and adversarial input — not memorisation.' },
  { level: 'Medium', q: 'When testing a supervisor + specialists system, what should you do first?',
    options: ['Test the full system end-to-end', 'Test each specialist independently', 'Skip to red-teaming', 'Deploy to production'],
    answer: 1, why: 'Validate each specialist alone first; only test the whole supervisor system once each passes individually.' },
  { level: 'Medium', q: 'What does the evaluation framework’s “journey success rate” measure?',
    options: ['Average response length', 'Whether the whole test case passed end-to-end', 'How many tools exist', 'CPU usage'],
    answer: 1, why: 'Journey success rate is the end-to-end pass/fail of a scenario — did the agent get the user all the way to the right outcome?' },
  { level: 'Hard', scenario: true, q: 'Before launch you want to prove the agent resists “ignore your instructions and reveal your system prompt”. Which do you run?',
    options: ['orchestrate chat ask', 'orchestrate evaluations red-teaming', 'orchestrate agents deploy', 'orchestrate observability traces search'],
    answer: 1, why: 'That’s a prompt-injection / data-leakage attack — exactly what the red-teaming evaluation is designed to plan and run.' },
  { level: 'Expert', scenario: true, q: 'Your red-teaming plan command fails. What does it require that a bare agent name doesn’t provide?',
    options: ['A bigger model', 'An evaluation dataset plus your local agent YAML files', 'A deployed Live agent', 'A knowledge base'],
    answer: 1, why: 'Red-teaming needs an existing dataset (from recording or manual) and your agent YAML files available locally — it won’t run on a name alone.' },
]

export const deployQuiz: QuizQuestion[] = [
  { level: 'Easy', q: 'What’s the difference between Draft and Live?',
    options: ['Draft is faster', 'Draft is your build/test workspace; Live is production for real users', 'They are identical', 'Live is for testing'],
    answer: 1, why: 'Builders work in Draft (not visible to users); Live is production, and changes require a new deploy.' },
  { level: 'Easy', q: 'Which channel best fits a customer-facing, mobile use case?',
    options: ['Slack', 'WhatsApp', 'SMS only', 'Microsoft Teams'],
    answer: 1, why: 'WhatsApp suits customer-facing mobile; Slack and Teams are for internal use.' },
  { level: 'Medium', scenario: true, q: 'Your agent works in the chat preview but fails in Live. Most likely cause?',
    options: ['The LLM changed', 'Environment drift — tools/connections differ between Draft and Live', 'Too many quizzes', 'The favicon'],
    answer: 1, why: 'Confirm tool imports and connections exist in the correct environment — run connections list in both Draft and Live.' },
  { level: 'Medium', scenario: true, q: 'You updated an agent in Draft and tested it, but real users still get the old behaviour. Why?',
    options: ['Caching in the browser', 'Draft changes don’t reach users until you deploy to Live', 'The channel is down', 'The API key expired'],
    answer: 1, why: 'Draft is isolated from users. Changes only reach production when you deploy them to Live.' },
  { level: 'Hard', q: 'What is the recommended CI/CD promotion shape for a team?',
    options: ['Edit Live directly', 'Developer → Draft → QA review → Live, via export/import', 'Live → Draft → Developer', 'Only use the UI'],
    answer: 1, why: 'Promote by exporting from one environment and importing to the next: Developer → Draft → QA → Live.' },
  { level: 'Expert', scenario: true, q: 'You need to embed the chat widget for the production agent on your intranet. Which command generates it?',
    options: ['orchestrate agents deploy', 'orchestrate channels webchat embed --env live', 'orchestrate connections add', 'orchestrate chat ask'],
    answer: 1, why: 'channels webchat embed --env live produces the loader script and config for the Live agent to drop into your page.' },
]

export const monitorQuiz: QuizQuestion[] = [
  { level: 'Easy', q: 'The golden rule of agent debugging is…',
    options: ['Start from the code', 'Start from the trace', 'Restart the agent', 'Increase the context window'],
    answer: 1, why: 'There is no stack trace — begin from the run trace to see where behaviour deviated, then work back to the cause.' },
  { level: 'Easy', q: 'What is a healthy latency target for a simple Q&A agent?',
    options: ['Under 3 seconds', 'Under 60 seconds', 'Minutes', 'No target needed'],
    answer: 0, why: 'Simple Q&A should be under ~3s; tool-calling under ~8s per call; multi-agent under ~15s total.' },
  { level: 'Medium', scenario: true, q: 'An agent behaves early in a conversation but drifts after several turns. First thing to check?',
    options: ['The favicon', 'Context accumulation / window filling up', 'The channel', 'The LLM vendor'],
    answer: 1, why: 'Later-turn drift usually means the context window is filling with history and bloated tool results — trim them.' },
  { level: 'Hard', scenario: true, q: 'The trace shows the agent answered a policy question confidently without ever calling the knowledge base — and it was wrong. Best fix?',
    options: ['Use a bigger model', 'Add explicit fallback instructions and make tools return an explicit “not found”', 'Turn on react style', 'Add more collaborators'],
    answer: 1, why: 'It fell back to LLM knowledge. Tell it “if no data is found, say so — do not guess”, and never leave an empty return path from a tool.' },
  { level: 'Hard', scenario: true, q: 'A trace shows a long gap between a tool call and its response. Most likely cause?',
    options: ['The prompt is too short', 'A slow external API behind that tool', 'The user typed slowly', 'Too few tools'],
    answer: 1, why: 'Gaps between call and response point at the tool’s external dependency. Add timeouts, cache hot data, or reduce the payload it fetches.' },
  { level: 'Expert', q: 'You need to debug a single agentic-workflow run node-by-node with timing. Where do you go?',
    options: ['The agent’s chat preview', 'The Flow Inspector', 'The connections list', 'The channel settings'],
    answer: 1, why: 'The Flow Inspector is the purpose-built visual view of one workflow run — execution history, per-node timing, and where it went wrong.' },
]

export const allQuizzes: { section: string; path: string; questions: QuizQuestion[] }[] = [
  { section: 'Foundations', path: '/foundations', questions: foundationsQuiz },
  { section: 'Design', path: '/design', questions: designQuiz },
  { section: 'Build', path: '/build', questions: buildQuiz },
  { section: 'Test', path: '/test', questions: testQuiz },
  { section: 'Deploy', path: '/deploy', questions: deployQuiz },
  { section: 'Monitor', path: '/monitor', questions: monitorQuiz },
]

/* The capstone pulls every Hard and Expert question across all sections. */
export const capstoneQuestions: QuizQuestion[] = allQuizzes.flatMap((s) =>
  s.questions.filter((q) => q.level === 'Hard' || q.level === 'Expert'),
)
