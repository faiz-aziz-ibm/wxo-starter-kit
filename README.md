# watsonx Orchestrate — Starter Kit

A friendly, premium website that takes everyone at IBM from **zero to production** with
**IBM watsonx Orchestrate**, across the full agentic-AI development lifecycle:
**Design → Build → Test → Deploy → Monitor.**

Built for non-technical stakeholders and seasoned engineers alike — visual, animated, and easy to follow.

## What's inside

| Page | Covers |
| --- | --- |
| **Home** | Animated lifecycle ring, who it's for, guided index |
| **Roadmap** | *"Become a wxO Pro"* — an 8-step staged learning plan following one running example (a UK take-home-pay assistant) from a single Python tool to a multi-agent system; great first use cases; and a downloadable **Architect Toolkit** |
| **Foundations** | What agentic AI is, plain-language glossary, the agentic spectrum, platform orientation, ADK setup |
| **Design** | Use-case canvas, "should this be an agent?" decision tree, architecture patterns, writing good instructions |
| **Build** | First agent, agent styles, tools, agentic workflows, knowledge bases, multi-agent systems, context-window management |
| **Test** | Three levels of testing, the evaluation framework, red-teaming |
| **Deploy** | Draft vs. Live, channels, webchat embed, CI/CD promotion |
| **Monitor** | Traces, performance budgets, the improvement cycle, a debugging playbook |
| **MCP Servers** | The three faces of MCP in wxO — toolkits, the wxO MCP server, and the docs MCP server |
| **Anti-Patterns** | The seven mistakes real teams make, and how to fix them |
| **Reference** | ADK command reference, YAML/Python cheat sheets, decision flowcharts, a searchable glossary |

## Tech stack

- **Vite + React 18 + TypeScript**
- **React Router** (HashRouter — portable to any GitHub Pages path with no server config)
- **Framer Motion** + a lightweight `IntersectionObserver` reveal system
- Custom design system (IBM Plex type, SVG icon set, dependency-free syntax highlighter)

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build

```bash
npm run build    # outputs to ./dist
npm run preview  # preview the production build
```

## Deploy

The site is published in two places. Both work at any path because the app uses `base: './'` + `HashRouter`.

| Where | Who can see it | How it deploys |
| --- | --- | --- |
| **[faiz-aziz-ibm.github.io/wxo-starter-kit](https://faiz-aziz-ibm.github.io/wxo-starter-kit/)** (github.com) | Anyone, including clients | **Automatic.** `.github/workflows/deploy.yml` builds and deploys on every push to `main` (Pages source: GitHub Actions). |
| **pages.github.ibm.com** (IBM GitHub Enterprise) | IBMers (w3id login) | **Manual.** Run `npm run deploy` from `main`: it builds and pushes `./dist` to the `gh-pages` branch, which that Pages site serves. Pushing to `main` alone does not update it. |

The repo has two remotes, so a release is:

```bash
git push origin main && git push github main   # IBM GHE + github.com (github.com deploys itself)
npm run deploy                                 # refresh the IBM GHE Pages site
```

## The downloadable Architect Toolkit

`public/downloads/wxo-architect-toolkit.zip` ships with the site (linked from the **Roadmap** and **MCP** pages).
It contains a ready-to-drop `.bob` folder: the *WXO Agent Architect* mode, both ADK MCP servers (docs + platform)
pre-wired in `mcp.json`, and eight wxO skills (`solution-architect`, `sop-builder`, `wxo-builder`, `wxo-analyzer`,
`agent-instructions-evaluator`, `agentic-workflow-advisor`, `telemetry-analyzer`, `customercare-mcp-builder`),
plus a setup guide. Its source lives in [`toolkit/wxo-architect-toolkit/`](toolkit/wxo-architect-toolkit) — edit it there,
then run `npm run toolkit` to rebuild the zip. (The repo-root `.bob/` is a separate, git-ignored local folder.)

## Cross-references

Warnings link to the anti-pattern they relate to (e.g. the Build page's context-window warning → *Firehose Effect*,
tool counts → *Tool Soup*). These deep links work under `HashRouter` via a hash-aware scroll handler in
[`Layout.tsx`](src/components/Layout.tsx).

## Notes

- Source material: *Building Agentic AI with IBM watsonx Orchestrate* (Knowledge Transfer Series), plus
  live research against the wxO documentation MCP server for the MCP chapter.
- Unofficial community guide. Platform target: ADK v2.12+. UI screenshots change between releases —
  capture those from your own environment.
- **Curated by Faiz Aziz** · faiz.aziz@ibm.com · Data & AI Delivery Consultant, IBM Expert Labs.
