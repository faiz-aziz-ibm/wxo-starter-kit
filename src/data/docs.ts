/* Canonical IBM watsonx Orchestrate ADK documentation links.
   One source of truth for both quiz "read the docs" links and inline citations. */
const BASE = 'https://developer.watson-orchestrate.ibm.com'

export const doc = {
  // Agents
  buildAgent: `${BASE}/agents/build_agent`,
  agentStyles: `${BASE}/agents/agent_styles`,
  agentStylesMigration: `${BASE}/agents/agent_styles_migration`,
  // Agent skills (scoped, loadable instruction sets with SKILL.md)
  agentSkills: `${BASE}/agent_skills/overview`,
  agentSkillsManage: `${BASE}/agent_skills/manage_skills`,
  connectAgent: `${BASE}/agents/connect_agent`,
  importAgent: `${BASE}/agents/import_agent`,
  descriptions: `${BASE}/agents/descriptions`,
  agentDesign: `${BASE}/agents/agent_design/overview`,
  // NB: the old getting_started/guidelines page no longer exists — this points
  // at the current design-guidance page.
  guidelines: `${BASE}/agents/agent_design/foundational_architecture`,
  // Getting started / CLI
  cli: `${BASE}/getting_started/cli`,
  installing: `${BASE}/getting_started/installing`,
  whatIs: `${BASE}/getting_started/what_is`,
  examples: `${BASE}/getting_started/examples`,
  devEdition: `${BASE}/developer_edition/wxOde_setup`,
  choosingToolType: `${BASE}/tools/toolkits/choosing_tool_type`,
  // Tools
  pythonTool: `${BASE}/tools/create_tool`,
  pythonToolContext: `${BASE}/tools/create_tool#additional-features-of-python-tools`,
  openapiTool: `${BASE}/tools/create_openapi_tool`,
  mcpToolkit: `${BASE}/tools/toolkits/remote_mcp_toolkits`,
  // Connections
  connections: `${BASE}/connections/build_connections`,
  connectionsOverview: `${BASE}/connections/overview`,
  // Context variables
  contextVariables: `${BASE}/webchat/context_variables`,
  // Knowledge base
  knowledgeBase: `${BASE}/knowledge_base/build_kb`,
  // Flows / workflows
  flowsOverview: `${BASE}/tools/flows/overview`,
  buildingFlow: `${BASE}/tools/flows/building_flow`,
  userActivity: `${BASE}/tools/flows/user_activities_node`,
  // Testing / evaluation
  evaluateOverview: `${BASE}/evaluate/overview`,
  evaluate: `${BASE}/evaluate/evaluate`,
  createData: `${BASE}/evaluate/create_data`,
  redTeaming: `${BASE}/evaluate/llm_vulnerability`,
  // Monitoring
  traces: `${BASE}/traces/overview`,
  tracesCli: `${BASE}/traces/traces_with_cli`,
  observability: `${BASE}/llm/observability`,
  // Deploy / channels / environments
  channels: `${BASE}/channels/overview`,
  webChat: `${BASE}/channels/web_chat`,
  webchatEmbed: `${BASE}/adk_extension/webchat_embed`,
  slack: `${BASE}/channels/slack`,
  environments: `${BASE}/environment/initiate_environment`,
  productionImport: `${BASE}/environment/production_import`,
  cicd: `${BASE}/tutorials/ci_cd/deployment-cicd-approach-1`,
  // Models
  models: `${BASE}/llm/watsonx_models`,
  // Ops
  codeEngine: `${BASE}/tutorials/testing_voice/deploy_to_ibm_code_engine`,
}
