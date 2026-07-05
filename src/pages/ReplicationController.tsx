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
}

function ReplicationControllerPage() {
  const [desired, setDesired] = useState(3)
  const [pods, setPods] = useState<PodInstance[]>([{ id: 1 }, { id: 2 }, { id: 3 }])
  const [nextId, setNextId] = useState(4)
  const [reconciling, setReconciling] = useState(false)

  useEffect(() => {
    if (pods.length >= desired || reconciling) {
      return undefined
    }
    setReconciling(true)
    const timer = window.setTimeout(() => {
      setPods((current) => [...current, { id: nextId }])
      setNextId((value) => value + 1)
      setReconciling(false)
    }, 900)
    return () => window.clearTimeout(timer)
  }, [desired, nextId, pods.length, reconciling])

  function killPod() {
    setPods((current) => current.slice(0, -1))
  }

  useEffect(() => {
    if (pods.length > desired) {
      setPods((current) => current.slice(0, desired))
    }
  }, [desired, pods.length])

  const manifest = `apiVersion: v1
kind: ReplicationController
metadata:
  name: web
spec:
  replicas: 3
  selector:
    app: web
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
        title="Replication Controller"
        lede="The original replica manager keeps a fixed number of Pods alive by comparing desired replicas with the current count and creating replacements when needed."
      />

      <Section num="01" title="The reconciliation loop">
        <div className="grid-2">
          <div className="card">
            A ReplicationController is a control loop: observe the number of matching Pods, compare it to the desired
            replica count, and create or delete Pods until the numbers line up.
          </div>
          <Callout kind="warn">
            This API is <b>legacy</b>. ReplicaSet replaced it because set-based selectors are more expressive and work
            better with Deployments.
          </Callout>
        </div>
      </Section>

      <Section num="02" title="Desired vs current replicas">
        <div className="stage">
          <div className="grid-2">
            <div className="card">
              <div className="kv">
                <span className="k">desired</span>
                <span>{desired}</span>
              </div>
              <input type="range" min="1" max="6" value={desired} onChange={(event) => setDesired(Number(event.target.value))} style={{ width: '100%' }} />
              <div className="btn-row" style={{ marginTop: 12 }}>
                <button type="button" className="btn primary" onClick={killPod} disabled={!pods.length}>
                  kill pod
                </button>
              </div>
            </div>
            <div className="card">
              <div className="kv">
                <span className="k">current</span>
                <span>{pods.length}</span>
              </div>
              <div className="btn-row">
                <AnimatePresence>
                  {pods.map((pod) => (
                    <motion.div
                      key={pod.id}
                      layout
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -14, scale: 0.92 }}
                      className="box"
                      style={{ borderColor: 'var(--green)', minWidth: 92 }}
                    >
                      pod {pod.id}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              {reconciling ? <div style={{ marginTop: 10 }}>controller is creating a replacement...</div> : null}
            </div>
          </div>
        </div>
      </Section>

      <Section num="03" title="How it thinks">
        <Mindmap
          center="ReplicationController"
          branches={[
            { label: 'Observe', children: ['count Pods', 'read selector'] },
            { label: 'Compare', children: ['desired replicas', 'current replicas'] },
            { label: 'Act', children: ['create Pod', 'delete Pod', 'reconcile again'] },
          ]}
        />
      </Section>

      <Section num="04" title="Example manifest">
        <CodeBlock title="rc.yaml" lang="yaml" code={manifest} />
      </Section>

      <Section num="05" title="Key takeaways">
        <div className="card">
          <ul className="takeaways">
            <li>ReplicationControllers maintain a fixed replica count for matching Pods.</li>
            <li>If a Pod disappears, the controller reconciles by creating a replacement.</li>
            <li>ReplicaSet superseded this API with richer selector support.</li>
          </ul>
        </div>
      </Section>

      <PageNav />
    </div>
  )
}

export default ReplicationControllerPage
