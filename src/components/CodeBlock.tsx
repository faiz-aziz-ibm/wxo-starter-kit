import { useState, type ReactNode } from 'react'
import { IconCopy, IconCheck, IconTerminal } from '../icons/Icons'

type Lang = 'bash' | 'python' | 'yaml' | 'json' | 'html' | 'text'

/* A small, dependency-free highlighter. It is intentionally conservative:
   it colors comments, strings, numbers and a curated keyword set per language.
   Output is escaped first, so it is safe to set as innerHTML. */

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const wrap = (cls: string, s: string) => `<span class="tok-${cls}">${s}</span>`

function highlightLine(line: string, lang: Lang): string {
  // Comments first (whole-line or trailing)
  const commentChar = lang === 'python' || lang === 'bash' || lang === 'yaml' ? '#' : null
  let code = line
  let comment = ''
  if (commentChar) {
    // naive: split on first # that is not inside quotes
    let inS = false, inD = false
    for (let i = 0; i < code.length; i++) {
      const c = code[i]
      if (c === "'" && !inD) inS = !inS
      else if (c === '"' && !inS) inD = !inD
      else if (c === commentChar && !inS && !inD) {
        comment = code.slice(i)
        code = code.slice(0, i)
        break
      }
    }
  }

  let out = esc(code)

  // strings
  out = out.replace(/(&quot;|&#39;|['"])(?:(?!\1).)*\1/g, (m) => wrap('str', m))
    .replace(/&quot;(?:[^&]|&(?!quot;))*&quot;/g, (m) => wrap('str', m))

  const kw: Record<Lang, RegExp | null> = {
    bash: /\b(pip|orchestrate|python|npx|uvx|pipx|source|cd|export|for|do|done|in)\b/g,
    python: /\b(from|import|def|return|class|for|while|if|else|elif|await|async|not|in|is|None|True|False|and|or|with|as|lambda|yield)\b/g,
    yaml: null,
    json: null,
    html: null,
    text: null,
  }
  const rx = kw[lang]
  if (rx) out = out.replace(rx, (m) => wrap('kw', m))

  // decorators / cli subcommands
  if (lang === 'python') out = out.replace(/(@\w+)/g, (m) => wrap('dec', m))
  if (lang === 'yaml') out = out.replace(/^(\s*)([\w.-]+)(:)/g, (_m, a, b, c) => `${a}${wrap('key', b)}${c}`)

  // numbers
  out = out.replace(/\b(\d+(?:\.\d+)?)\b/g, (m) => wrap('num', m))

  if (comment) out += wrap('com', esc(comment))
  return out
}

export function CodeBlock({
  code, lang = 'bash', title,
}: { code: string; lang?: Lang; title?: ReactNode }) {
  const [copied, setCopied] = useState(false)
  const lines = code.replace(/\n$/, '').split('\n')

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch { /* clipboard unavailable */ }
  }

  return (
    <div className="codeblock">
      <div className="codeblock-head">
        <span className="codeblock-lang">
          <IconTerminal width={14} height={14} />
          {title ?? lang}
        </span>
        <button className="codeblock-copy" onClick={copy} aria-label="Copy code">
          {copied ? <IconCheck width={14} height={14} /> : <IconCopy width={14} height={14} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="codeblock-body"><code>
        {lines.map((l, i) => (
          <span className="cl" key={i}>
            <span className="ln" aria-hidden>{i + 1}</span>
            <span className="lc" dangerouslySetInnerHTML={{ __html: highlightLine(l, lang) || '&nbsp;' }} />
          </span>
        ))}
      </code></pre>
    </div>
  )
}
