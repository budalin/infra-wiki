import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import { topics } from '../topics'

function Home() {
  return (
    <div className="page">
      <PageHero
        eyebrow="Kubernetes concepts"
        title="Learn the cluster from the inside out."
        lede="Explore how Kubernetes objects work internally with diagrams, mental models, runnable-style demos, and real manifests."
      />

      <div className="card">
        Kubernetes is easier to understand when you follow the control loops: a client declares intent, the control plane
        stores it, controllers reconcile it, and worker nodes materialize it. Every topic in this guide focuses on that
        internal machinery rather than memorized definitions.
      </div>

      <div className="grid-3" style={{ marginTop: 16 }}>
        {topics.map((topic) => (
          <Link key={topic.slug} to={`/topic/${topic.slug}`} className="card" style={{ display: 'block' }}>
            <div className="status-dot" style={{ background: topic.accent, marginBottom: 12 }} />
            <h3>{topic.title}</h3>
            <p>{topic.blurb}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Home
