interface PageHeroProps {
  eyebrow: string
  title: string
  lede: string
}

function PageHero({ eyebrow, title, lede }: PageHeroProps) {
  return (
    <header className="page-hero">
      <div className="eyebrow">{eyebrow}</div>
      <h1 className="page-title">{title}</h1>
      <p className="page-lede">{lede}</p>
    </header>
  )
}

export default PageHero
