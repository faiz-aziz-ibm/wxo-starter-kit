import { useState, type ReactNode } from 'react'
import { IconCopy, IconCheck, IconTerminal } from '../icons/Icons'

type Lang = 'bash' | 'python' | 'yaml' | 'json' | 'html' | 'text'

/* A small, dependency-free syntax highlighter.
   Tokenises the RAW source first (before any HTML escaping), then
   HTML-escapes each token's text individually. This avoids the broken
   pattern of escaping first and then trying to regex-match &quot; etc. */

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const wrap = (cls: string, raw: string) =>
  `<span class="tok-${cls}">${esc(raw)}</span>`

type Token = { kind: 'str' | 'com' | 'kw' | 'dec' | 'key' | 'num' | 'plain'; text: string }

const KW: Record<Lang, RegExp | null> = {
  bash:   /^(pip|orchestrate|python|npx|uvx|pipx|source|cd|export|for|do|done|in)$/,
  python: /^(from|import|def|return|class|for|while|if|else|elif|await|async|not|in|is|None|True|False|and|or|with|as|lambda|yield)$/,
  yaml: null, json: null, html: null, text: null,
}

/* Tokenise a single line of source. Returns an array of tokens in order. */
function tokeniseLine(line: string, lang: Lang): Token[] {
  const tokens: Token[] = []
  const commentChar = (lang === 'python' || lang === 'bash' || lang === 'yaml') ? '#' : null
  let i = 0

  const push = (kind: Token['kind'], text: string) => { if (text) tokens.push({ kind, text }) }

  while (i < line.length) {
    const ch = line[i]

    // Comment: consume to end of line
    if (commentChar && ch === commentChar) {
      push('com', line.slice(i))
      break
    }

    // String: single-quoted or double-quoted, handles escaped chars
    if (ch === '"' || ch === "'") {
      const q = ch
      let j = i + 1
      while (j < line.length) {
        if (line[j] === '\\') { j += 2; continue }   // skip escape
        if (line[j] === q) { j++; break }
        j++
      }
      push('str', line.slice(i, j))
      i = j
      continue
    }

    // Word token: keyword, decorator, or plain identifier/number
    if (/[\w@]/.test(ch)) {
      let j = i + 1
      while (j < line.length && /\w/.test(line[j])) j++
      const word = line.slice(i, j)

      if (ch === '@') {
        push('dec', word)
      } else if (/^\d/.test(word)) {
        push('num', word)
      } else {
        const rx = KW[lang]
        push(rx && rx.test(word) ? 'kw' : 'plain', word)
      }
      i = j
      continue
    }

    // YAML key: match "key:" pattern at the current position
    if (lang === 'yaml') {
      const m = line.slice(i).match(/^([\w.-]+)(:)/)
      if (m) {
        push('key',   m[1])
        push('plain', m[2])
        i += m[0].length
        continue
      }
    }

    // Everything else: accumulate plain chars
    let j = i + 1
    while (j < line.length) {
      const c = line[j]
      if (c === '"' || c === "'" || c === '@' || /\w/.test(c)) break
      if (commentChar && c === commentChar) break
      j++
    }
    push('plain', line.slice(i, j))
    i = j
  }

  return tokens
}

/* Pre-process the full code for Python: detect multi-line triple-quoted strings
   and mark those lines as 'str' tokens before per-line tokenisation runs.
   Returns an array parallel to the lines array; entry is null if the line
   should be tokenised normally, or a pre-built HTML string if it's inside
   a triple-quoted block. */
function preProcessTripleQuotes(code: string): (string | null)[] {
  const lines = code.replace(/\n$/, '').split('\n')
  const result: (string | null)[] = new Array(lines.length).fill(null)
  let inTriple = false

  for (let li = 0; li < lines.length; li++) {
    const raw = lines[li]
    const count = (raw.match(/"""/g) || []).length

    if (!inTriple && count === 0) continue

    if (!inTriple && count >= 2) {
      // Opening and closing on the same line — tokenise normally; the
      // per-line string tokeniser will handle it.
      continue
    }

    if (!inTriple && count >= 1) {
      // Opening """ on this line (no closing yet)
      inTriple = true
      result[li] = wrap('str', raw)
      continue
    }

    if (inTriple) {
      result[li] = wrap('str', raw)
      if (count >= 1) inTriple = false   // closing """ found
    }
  }

  return result
}

function highlightLine(line: string, lang: Lang): string {
  return tokeniseLine(line, lang)
    .map(t => t.kind === 'plain' ? esc(t.text) : wrap(t.kind, t.text))
    .join('')
}

export function CodeBlock({
  code, lang = 'bash', title,
}: { code: string; lang?: Lang; title?: ReactNode }) {
  const [copied, setCopied] = useState(false)

  // For Python, detect multi-line triple-quoted strings and pre-render those lines.
  // tripleMap[i] is a pre-built HTML string for line i if it's inside a docstring, else null.
  const tripleMap = lang === 'python' ? preProcessTripleQuotes(code) : null

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
        {lines.map((l, i) => {
          const prebuilt = tripleMap?.[i] ?? null
          const html = prebuilt !== null ? prebuilt : (highlightLine(l, lang) || '&nbsp;')
          return (
            <span className="cl" key={i}>
              <span className="ln" aria-hidden>{i + 1}</span>
              <span className="lc" dangerouslySetInnerHTML={{ __html: html }} />
            </span>
          )
        })}
      </code></pre>
    </div>
  )
}
