import { useState } from 'react'
import { CodeBlock } from './CodeBlock'

type Lang = 'bash' | 'python' | 'yaml' | 'json' | 'html' | 'text'
export type CodeTab = { label: string; lang: Lang; code: string; title?: string }

/* Tabbed code viewer — e.g. flip between a Python tool and its agent YAML. */
export function CodeTabs({ tabs }: { tabs: CodeTab[] }) {
  const [active, setActive] = useState(0)
  const t = tabs[active]
  return (
    <div className="codetabs">
      <div className="codetabs-bar" role="tablist">
        {tabs.map((tab, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === active}
            className={`codetabs-tab ${i === active ? 'is-active' : ''}`}
            onClick={() => setActive(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <CodeBlock lang={t.lang} title={t.title ?? t.label} code={t.code} />
    </div>
  )
}
