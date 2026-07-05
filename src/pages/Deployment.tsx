import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Callout from '../components/Callout'
import CodeBlock from '../components/CodeBlock'
import FlowDiagram from '../components/FlowDiagram'
import Mindmap from '../components/Mindmap'
import PageHero from '../components/PageHero'
import PageNav from '../components/PageNav'
import Section from '../components/Section'

type Strategy = 'RollingUpdate' | 'Recreate'

interface PodReplica {
  id: string
  version: 'v1' | 'v2'
}

function DeploymentPage() {
  const [strategy, setStrategy] = useState<Strategy>('RollingUpdate')
  const [rollout, setRollout] = useState(false)
  const [replicas, setReplicas] = useState<PodReplica[]>([
    { id: 'pod-1', version: 'v1' },
    { id: 'pod-2', version: 'v1' },
    { id: 'pod-3', version: 'v1' },
  ])
  const [stage, setStage] = useState(0)

  useEffect(() => {
    if (!rollout) {
      return undefined
    }
    const timer = window.setTimeout(() => {
      setStage((value) => value + 1)
    }, 850)
    return () => window.clearTimeout(timer)
  }, [rollout, stage])

  useEffect(() => {
    if (!rollout) {
      return
    }
    if (strategy === 'RollingUpdate') {
      if (stage === 0) {
        setReplicas((current) => [...current, { id: 'pod-4', version: 'v2' }])
      } else if (stage === 1) {
        setReplicas([
          { id: 'pod-2', version: 'v1' },
          { id: 'pod-3', version: 'v1' },
          { id: 'pod-4', version: 'v2' },
        ])
      } else if (stage === 2) {
        setReplicas([
          { id: 'pod-3', version: 'v1' },
          { id: 'pod-4', version: 'v2' },
          { id: 'pod-5', version: 'v2' },
        ])
      } else if (stage === 3) {
        setReplicas([
          { id: 'pod-4', version: 'v2' },
          { id: 'pod-5', version: 'v2' },
          { id: 'pod-6', version: 'v2' },
        ])
        setRollout(false)
      }
    } else if (strategy === 'Recreate') {
      if (stage === 0) {
        setReplicas([])
      } else if (stage === 1) {
        setReplicas([
          { id: 'pod-4', version: 'v2' },
          { id: 'pod-5', version: 'v2' },
          { id: 'pod-6', version: 'v2' },
        ])
        setRollout(false)
      }
    }
  }, [rollout, stage, strategy])

  function deployV2() {
    setStage(0)
    setRollout(true)
  }

  function rollback() {
    setRollout(false)
    setStage(0)
    setStrategy('RollingUpdate')
    setReplicas([
      { id: 'pod-1', version: 'v1' },
      { id: 'pod-2', version: 'v1' },
      { id: 'pod-3', version: 'v1' },
    ])
  }

  const diagramNodes = useMemo(
    () => [
      { id: 'deployment', position: { x: 250, y: 20 }, data: { label: 'Deployment' }, className: 'rf-node', style: { borderColor: 'var(--k8s)' } },
      { id: 'rs-old', position: { x: 50, y: 150 }, data: { label: 'ReplicaSet v1' }, className: 'rf-node', style: { borderColor: 'var(--green)' } },
      { id: 'rs-new', position: { x: 450, y: 150 }, data: { label: 'ReplicaSet v2' }, className: 'rf-node', style: { borderColor: 'var(--purple)' } },
      { id: 'pods-old', position: { x: 50, y: 300 }, data: { label: 'old Pods' }, className: 'rf-node' },
      { id: 'pods-new', position: { x: 450, y: 300 }, data: { label: 'new Pods' }, className: 'rf-node' },
    ],
    [],
  )

  const diagramEdges = [
    { id: 'd1', source: 'deployment', target: 'rs-old', type: 'smoothstep' },
    { id: 'd2', source: 'deployment', target: 'rs-new', type: 'smoothstep' },
    { id: 'd3', source: 'rs-old', target: 'pods-old', type: 'smoothstep' },
    { id: 'd4', source: 'rs-new', target: 'pods-new', type: 'smoothstep' },
  ]

  const manifest = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
  selector:
    matchLabels:
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
        title="Deployment"
        lede="A Deployment does not run Pods directly. It manages ReplicaSets so that it can roll out new versions and roll back safely."
      />

      <Section num="01" title="The rollout controller">
        <div className="grid-2">
          <div className="card">
            The Deployment stores rollout intent, creates ReplicaSets for each revision, and then scales them up and
            down according to the chosen strategy.
          </div>
          <Callout kind="info">
            RollingUpdate is the default because it keeps the application available while new Pods gradually replace old
            ones. Recreate is simpler but produces downtime.
          </Callout>
        </div>
      </Section>

      <Section num="02" title="Deployment hierarchy">
        <FlowDiagram nodes={diagramNodes} edges={diagramEdges} />
      </Section>

      <Section num="03" title="Interactive rollout">
        <div className="stage">
          <div className="btn-row" style={{ marginBottom: 12 }}>
            <button type="button" className={`chip ${strategy === 'RollingUpdate' ? 'on' : ''}`} onClick={() => setStrategy('RollingUpdate')}>
              RollingUpdate
            </button>
            <button type="button" className={`chip ${strategy === 'Recreate' ? 'on' : ''}`} onClick={() => setStrategy('Recreate')}>
              Recreate
            </button>
            <button type="button" className="btn primary" onClick={deployV2}>
              Deploy v2
            </button>
            <button type="button" className="btn" onClick={rollback}>
              Rollback
            </button>
          </div>
          <div className="card">
            <div className="kv">
              <span className="k">rollout stage</span>
              <span>{rollout ? stage : 'idle'}</span>
            </div>
            <div className="btn-row">
              <AnimatePresence>
                {replicas.map((pod) => (
                  <motion.div
                    key={pod.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="box"
                    style={{ borderColor: pod.version === 'v2' ? 'var(--purple)' : 'var(--green)', minWidth: 92 }}
                  >
                    {pod.id}
                    <div style={{ color: 'var(--text-faint)', fontSize: 12 }}>{pod.version}</div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Section>

      <Section num="04" title="Rollout strategy map">
        <Mindmap
          center="Deployment"
          branches={[
            { label: 'Revision control', children: ['new ReplicaSet', 'old ReplicaSet'] },
            { label: 'Availability', children: ['maxSurge', 'maxUnavailable'] },
            { label: 'Operations', children: ['rollout status', 'rollback', 'pause / resume'] },
          ]}
        />
      </Section>

      <Section num="05" title="Example manifest">
        <CodeBlock title="deployment.yaml" lang="yaml" code={manifest} />
      </Section>

      <Section num="06" title="Key takeaways">
        <div className="card">
          <ul className="takeaways">
            <li>Deployments manage ReplicaSets, not individual Pods.</li>
            <li>RollingUpdate trades a little extra capacity for availability during upgrades.</li>
            <li>Rollback works because the Deployment keeps rollout history across ReplicaSets.</li>
          </ul>
        </div>
      </Section>

      <PageNav />
    </div>
  )
}

export default DeploymentPage
