import type { ReactNode } from 'react'

interface CodeBlockProps {
  title: string
  lang: string
  code: string
}

function tokenizeLine(line: string): ReactNode[] {
  if (line.trim().startsWith('#')) {
    return [<span className="cm-com" key={line}>{line}</span>]
  }

  const keyMatch = line.match(/^(\s*)([A-Za-z0-9_-]+)(:)(.*)$/)
  if (keyMatch) {
    const [, indent, key, colon, rest] = keyMatch
    return [
      indent,
      <span className="cm-key" key={`${key}-${colon}`}>
        {key + colon}
      </span>,
      ...highlightInline(rest),
    ]
  }

  return highlightInline(line)
}

function highlightInline(text: string): ReactNode[] {
  const parts: ReactNode[] = []
  let cursor = 0
  const inlinePattern = /("[^"]*"|'[^']*'|\b\d+(?:\.\d+)?\b)/g

  for (const match of text.matchAll(inlinePattern)) {
    const token = match[0]
    const index = match.index ?? 0
    if (index > cursor) {
      parts.push(text.slice(cursor, index))
    }
    const className = token.startsWith('"') || token.startsWith("'") ? 'cm-str' : 'cm-num'
    parts.push(
      <span className={className} key={`${index}-${token}`}>
        {token}
      </span>,
    )
    cursor = index + token.length
  }

  if (cursor < text.length) {
    parts.push(text.slice(cursor))
  }

  return parts
}

function CodeBlock({ title, lang, code }: CodeBlockProps) {
  const lines = code.split('\n')

  return (
    <div className="code-block">
      <div className="code-head">
        <span className="code-dot" style={{ background: 'var(--red)' }} />
        <span className="code-dot" style={{ background: 'var(--amber)' }} />
        <span className="code-dot" style={{ background: 'var(--green)' }} />
        <span>{title}</span>
        <span style={{ marginLeft: 'auto' }}>{lang}</span>
      </div>
      <pre>
        {lines.map((line, index) => (
          <div key={`${index}-${line}`}>
            {line.length === 0 ? '\u00a0' : tokenizeLine(line)}
          </div>
        ))}
      </pre>
    </div>
  )
}

export default CodeBlock
