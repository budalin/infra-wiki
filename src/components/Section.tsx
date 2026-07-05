import type { ReactNode } from 'react'

interface SectionProps {
  num: string
  title: string
  children: ReactNode
}

function Section({ num, title, children }: SectionProps) {
  return (
    <section className="section">
      <div className="section-head">
        <span className="section-num">{num}</span>
        <h2 className="section-title">{title}</h2>
      </div>
      {children}
    </section>
  )
}

export default Section
