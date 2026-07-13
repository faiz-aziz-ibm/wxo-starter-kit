import type { ComponentType, SVGProps } from 'react'
import {
  IconCompass, IconDraft, IconBuild, IconTest, IconDeploy,
  IconMonitor, IconAlert, IconPlug, IconBook, IconMap,
} from '../icons/Icons'

export type Phase = {
  slug: string
  path: string
  num: string
  title: string
  kicker: string
  blurb: string
  color: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  lifecycle: boolean // part of the 5-stage build lifecycle ring
}

export const roadmap: Phase = {
  slug: 'roadmap', path: '/roadmap', num: 'PRO',
  title: 'Learning Roadmap', kicker: 'Become a wxO Pro',
  blurb: 'Your personal, staged learning plan — from your first Python tool to a full multi-agent system. Start here if you don’t know where to start.',
  color: 'var(--green)', icon: IconMap, lifecycle: false,
}

export const phases: Phase[] = [
  {
    slug: 'foundations', path: '/foundations', num: '00',
    title: 'Foundations', kicker: 'Start here',
    blurb: 'What agentic AI actually is, the plain-language glossary, and how to orient yourself in watsonx Orchestrate.',
    color: 'var(--c-foundations)', icon: IconCompass, lifecycle: false,
  },
  {
    slug: 'design', path: '/design', num: '01',
    title: 'Design', kicker: 'Phase 1',
    blurb: 'Architecture and planning. Spend 20% of your time here — it saves the other 80%.',
    color: 'var(--c-design)', icon: IconDraft, lifecycle: true,
  },
  {
    slug: 'build', path: '/build', num: '02',
    title: 'Build', kicker: 'Phase 2',
    blurb: 'Agents, tools, agentic workflows, knowledge bases and multi-agent teams. Where it gets made.',
    color: 'var(--c-build)', icon: IconBuild, lifecycle: true,
  },
  {
    slug: 'test', path: '/test', num: '03',
    title: 'Test', kicker: 'Phase 3',
    blurb: 'Three levels of testing, systematic evaluation, and red-teaming. An untested agent is a liability.',
    color: 'var(--c-test)', icon: IconTest, lifecycle: true,
  },
  {
    slug: 'deploy', path: '/deploy', num: '04',
    title: 'Deploy', kicker: 'Phase 4',
    blurb: 'From your draft workspace to real users — environments, channels, and CI/CD promotion.',
    color: 'var(--c-deploy)', icon: IconDeploy, lifecycle: true,
  },
  {
    slug: 'monitor', path: '/monitor', num: '05',
    title: 'Monitor', kicker: 'Phase 5',
    blurb: 'Traces, observability, performance and the debugging playbook. You cannot improve what you cannot see.',
    color: 'var(--c-monitor)', icon: IconMonitor, lifecycle: true,
  },
]

export const extras: Phase[] = [
  {
    slug: 'mcp', path: '/mcp', num: '06',
    title: 'MCP Servers', kicker: 'Deep dive',
    blurb: 'Model Context Protocol in watsonx Orchestrate: toolkits, the platform MCP server, and the docs server.',
    color: 'var(--c-mcp)', icon: IconPlug, lifecycle: false,
  },
  {
    slug: 'anti-patterns', path: '/anti-patterns', num: '07',
    title: 'Anti-Patterns', kicker: 'Hall of shame',
    blurb: 'Real mistakes real teams make. Read this before you build, not after.',
    color: 'var(--red)', icon: IconAlert, lifecycle: false,
  },
  {
    slug: 'reference', path: '/reference', num: '08',
    title: 'Reference', kicker: 'Cheat sheets',
    blurb: 'ADK command reference, YAML and Python quick sheets, decision flowcharts, and the full glossary.',
    color: 'var(--teal)', icon: IconBook, lifecycle: false,
  },
]

export const allPhases = [roadmap, ...phases, ...extras]
