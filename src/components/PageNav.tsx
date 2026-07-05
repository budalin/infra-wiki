import { Link, useParams } from 'react-router-dom'
import { getPrevNext } from '../topics'

function PageNav() {
  const { slug = '' } = useParams()
  const { prev, next } = getPrevNext(slug)

  return (
    <nav className="page-nav" aria-label="Topic navigation">
      {prev ? (
        <Link to={`/topic/${prev.slug}`}>
          <div className="dir">Previous</div>
          <div className="ttl">{prev.title}</div>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link to={`/topic/${next.slug}`} className="next">
          <div className="dir">Next</div>
          <div className="ttl">{next.title}</div>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}

export default PageNav
