import type { ReactNode } from 'react'

interface CalloutProps {
  kind: 'info' | 'tip' | 'warn'
  children: ReactNode
}

function Callout({ kind, children }: CalloutProps) {
  const icon = kind === 'info' ? 'ℹ️' : kind === 'tip' ? '💡' : '⚠️'

  return (
    <div className={`callout ${kind}`}>
      <span className="ico" aria-hidden="true">
        {icon}
      </span>
      <div>{children}</div>
    </div>
  )
}

export default Callout
