import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Callout from '../components/Callout'
import CodeBlock from '../components/CodeBlock'
import Mindmap from '../components/Mindmap'
import PageHero from '../components/PageHero'
import PageNav from '../components/PageNav'
import Section from '../components/Section'

interface PodInstance {
  id: number
  app: string
}

function ReplicaSetPage() {
  const [desired, setDesired] = useState(4)
  const [pods, setPods] = useState<PodInstance[]>([
    { id: 1, app: 'web' },
    { id: 2, app: 'web' },
    { id: 3, app: 'api' },
    { id: 4, app: 'web' },
  ])
  const [setBased, setSetBased] = useState(true)
  const [nextId, setNextId] = useState(5)

  useEffect(() => {
    if (pods.length >= desired) {
      return undefined
    }
    const timer = window.setTimeout(() => {
      setPods((current) => [...current, { id: nextId, app: 'web' }])
      setNextId((value) => value + 1)
    }, 700)
    return () => window.clearTimeout(timer)
  }, [desired, nextId, pods.length])

  function killPod() {
    setPods((current) => current.slice(0, -1))
  }

  function matches(pod: PodInstance) {
    return setBased ? pod.app === 'web' || pod.app === 'api' : pod.app === 'web'
  }

  const manifest = `apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: web
spec:
  replicas: 4
  selector:
    matchExpressions:
      - key: app
        operator: In
        values: ["web", "api"]
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
        - name: app
          image: nginx:1.27`

  return (
    <div className="page">
      <PageHero
        eyebrow="Workloads"
        title="ReplicaSet"
        lede="ReplicaSet is the modern fixed-replica controller. It uses label selectors with set-based expressions and is usually managed by a Deployment."
      />

      <Section num="01" title="Why ReplicaSet exists">
        <div className="grid-2">
          <div className="card">
            ReplicaSet does the same reconciliation job as ReplicationController, but it can target objects with
            set-based selectors such as <code>In</code> and <code>NotIn</code>.
          </div>
          <Callout kind="info">
            A Deployment generally owns the ReplicaSet, which means the Deployment manages rollout history and strategy
            while the ReplicaSet manages the Pods.
          </Callout>
        </div>
      </Section>

      <Section num="02" title="Selector mode and reconciliation">
        <div className="stage">
          <div className="btn-row" style={{ marginBottom: 12 }}>
            <button type="button" className={`chip ${setBased ? 'on' : ''}`} onClick={() => setSetBased(true)}>
              set-based selector
            </button>
            <button type="button" className={`chip ${!setBased ? 'on' : ''}`} onClick={() => setSetBased(false)}>
              equality selector
            </button>
            <button type="button" className="btn primary" onClick={killPod}>
              kill pod
            </button>
          </div>
          <div className="grid-2">
            <div className="card">
              <div className="kv">
                <span className="k">desired</span>
                <span>{desired}</span>
              </div>
              <input type="range" min="2" max="6" value={desired} onChange={(event) => setDesired(Number(event.target.value))} style={{ width: '100%' }} />
              <div style={{ marginTop: 10, fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text-dim)' }}>
                {setBased ? 'app in (web, api)' : 'app=web'}
              </div>
            </div>
            <div className="card">
              <div className="kv">
                <span className="k">matched Pods</span>
                <span>{pods.filter(matches).length}</span>
              </div>
              <div className="btn-row">
                <AnimatePresence>
                  {pods.map((pod) => (
                    <motion.div
                      key={pod.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: matches(pod) ? 1 : 0.35, y: 0 }}
                      exit={{ opacity: 0, y: -12, scale: 0.92 }}
                      className="box"
                      style={{ borderColor: matches(pod) ? 'var(--green)' : 'var(--border)', minWidth: 92 }}
                    >
                      pod {pod.id}
                      <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 6 }}>{pod.app}</div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section num="03" title="Selector model">
        <Mindmap
          center="ReplicaSet"
          branches={[
            { label: 'Selector', children: ['matchLabels', 'matchExpressions'] },
            { label: 'Reconcile', children: ['create Pods', 'replace missing Pods'] },
            { label: 'Owner', children: ['usually a Deployment', 'rollout history'] },
          ]}
        />
      </Section>

      <Section num="04" title="Example manifest">
        <CodeBlock title="rs.yaml" lang="yaml" code={manifest} />
      </Section>

      <Section num="05" title="Key takeaways">
        <div className="card">
          <ul className="takeaways">
            <li>ReplicaSet keeps a set of matching Pods at the desired replica count.</li>
            <li>Its set-based selector model is more expressive than the legacy ReplicationController.</li>
            <li>Deployments usually own ReplicaSets in real applications.</li>
          </ul>
        </div>
      </Section>

      <PageNav />
    </div>
  )
}

export default ReplicaSetPage
