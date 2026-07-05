import { useEffect, useMemo, useState } from 'react'
import type { Edge, Node } from 'reactflow'
import { AnimatePresence, motion } from 'framer-motion'
import Callout from '../components/Callout'
import CodeBlock from '../components/CodeBlock'
import FlowDiagram from '../components/FlowDiagram'
import Mindmap from '../components/Mindmap'
import PageHero from '../components/PageHero'
import PageNav from '../components/PageNav'
import Section from '../components/Section'

interface ClusterComponent {
  id: string
  title: string
  detail: string
}

function ClusterArchitecturePage() {
  const components: ClusterComponent[] = [
    { id: 'apiserver', title: 'kube-apiserver', detail: 'Front door that authenticates, validates, and persists objects.' },
    { id: 'etcd', title: 'etcd', detail: 'Strongly consistent store for the entire cluster state.' },
    { id: 'scheduler', title: 'kube-scheduler', detail: 'Chooses a node for Pods that are not yet bound.' },
    { id: 'cm', title: 'controller-manager', detail: 'Runs reconciliation loops for Deployments, Nodes, and more.' },
    { id: 'cloud', title: 'cloud-controller', detail: 'Integrates with external cloud APIs for nodes, routes, and load balancers.' },
    { id: 'kubelet', title: 'kubelet', detail: 'Node agent that makes sure the Pod spec is realized on the machine.' },
    { id: 'proxy', title: 'kube-proxy', detail: 'Programs Service traffic rules and virtual IP forwarding.' },
    { id: 'runtime', title: 'container runtime', detail: 'Pulls images and launches containers through CRI.' },
  ]
  const [selected, setSelected] = useState('apiserver')
  const [phase, setPhase] = useState(-1)

  const requestFlow = ['kubectl apply', 'apiserver validates', 'etcd persists', 'scheduler binds', 'kubelet runs Pod']

  useEffect(() => {
    if (phase < 0) {
      return undefined
    }
    if (phase >= requestFlow.length - 1) {
      return undefined
    }
    const timer = window.setTimeout(() => {
      setPhase((value) => value + 1)
    }, 900)
    return () => window.clearTimeout(timer)
  }, [phase, requestFlow.length])

  function runApply() {
    setPhase(0)
  }

  const nodes = useMemo<Node[]>(
    () => [
      { id: 'apiserver', position: { x: 280, y: 40 }, data: { label: 'kube-apiserver' }, className: 'rf-node', style: { borderColor: 'var(--k8s)' } },
      { id: 'etcd', position: { x: 280, y: 150 }, data: { label: 'etcd' }, className: 'rf-node', style: { borderColor: 'var(--purple)' } },
      { id: 'scheduler', position: { x: 80, y: 150 }, data: { label: 'scheduler' }, className: 'rf-node', style: { borderColor: 'var(--green)' } },
      { id: 'cm', position: { x: 80, y: 260 }, data: { label: 'controller-manager' }, className: 'rf-node', style: { borderColor: 'var(--amber)' } },
      { id: 'cloud', position: { x: 480, y: 260 }, data: { label: 'cloud-controller' }, className: 'rf-node', style: { borderColor: 'var(--pink)' } },
      { id: 'kubelet', position: { x: 280, y: 340 }, data: { label: 'kubelet' }, className: 'rf-node', style: { borderColor: 'var(--teal)' } },
      { id: 'proxy', position: { x: 80, y: 450 }, data: { label: 'kube-proxy' }, className: 'rf-node', style: { borderColor: 'var(--docker)' } },
      { id: 'runtime', position: { x: 480, y: 450 }, data: { label: 'runtime' }, className: 'rf-node', style: { borderColor: 'var(--red)' } },
      { id: 'pod', position: { x: 280, y: 530 }, data: { label: 'Pod' }, className: 'rf-node', style: { borderColor: 'var(--green)' } },
    ],
    [],
  )

  const edges: Edge[] = [
    { id: 'e1', source: 'apiserver', target: 'etcd', type: 'smoothstep' },
    { id: 'e2', source: 'apiserver', target: 'scheduler', type: 'smoothstep' },
    { id: 'e3', source: 'scheduler', target: 'kubelet', type: 'smoothstep' },
    { id: 'e4', source: 'kubelet', target: 'runtime', type: 'smoothstep' },
    { id: 'e5', source: 'kubelet', target: 'pod', type: 'smoothstep' },
    { id: 'e6', source: 'cm', target: 'apiserver', type: 'smoothstep' },
    { id: 'e7', source: 'cloud', target: 'apiserver', type: 'smoothstep' },
    { id: 'e8', source: 'proxy', target: 'apiserver', type: 'smoothstep' },
  ]

  const manifest = `apiVersion: v1
kind: Pod
metadata:
  name: demo
  labels:
    app: demo
spec:
  containers:
    - name: app
      image: nginx:1.27`

  return (
    <div className="page">
      <PageHero
        eyebrow="Cluster"
        title="Cluster Architecture"
        lede="The control plane stores desired state and worker nodes continuously turn that state into running Pods."
      />

      <Section num="01" title="The control plane is the decision layer">
        <div className="grid-2">
          <div className="card">
            Every Kubernetes write goes through the API server. Controllers and the scheduler do not directly own the
            cluster; they repeatedly read the stored objects and reconcile them until reality matches the spec.
          </div>
          <Callout kind="info">
            <b>etcd</b> is the source of truth. If the API server can persist the object, the rest of the control plane
            can converge from that record.
          </Callout>
        </div>
      </Section>

      <Section num="02" title="Architecture map">
        <FlowDiagram nodes={nodes} edges={edges} />
        <div className="btn-row" style={{ marginTop: 14 }}>
          {components.map((component) => (
            <button key={component.id} type="button" className={`chip ${selected === component.id ? 'on' : ''}`} onClick={() => setSelected(component.id)}>
              {component.title}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            className="card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            style={{ marginTop: 12 }}
          >
            {components.find((component) => component.id === selected)?.detail}
          </motion.div>
        </AnimatePresence>
      </Section>

      <Section num="03" title="What happens when you apply a manifest">
        <div className="stage">
          <div className="btn-row" style={{ marginBottom: 12 }}>
            <button type="button" className="btn primary" onClick={runApply}>
              kubectl apply
            </button>
            <button type="button" className="btn" onClick={() => setPhase(-1)}>
              reset
            </button>
          </div>
          <motion.div className="card" style={{ marginBottom: 16 }}>
            <div className="pill">current step</div>
            <h3 style={{ marginTop: 10 }}>{phase < 0 ? 'Idle' : requestFlow[phase]}</h3>
            <p>
              {phase < 0
                ? 'No request is in flight.'
                : phase === requestFlow.length - 1
                  ? 'The kubelet starts the Pod after the scheduler binds it to a node.'
                  : 'The request continues through the control plane until the Pod is scheduled.'}
            </p>
          </motion.div>
          <div className="btn-row">
            {requestFlow.map((step, index) => (
              <motion.div key={step} className={`chip ${phase >= index ? 'on' : ''}`} animate={{ scale: phase === index ? 1.06 : 1 }}>
                {step}
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Section num="04" title="Cluster relationships">
        <Mindmap
          center="Cluster"
          branches={[
            { label: 'Control plane', children: ['API server', 'etcd', 'scheduler', 'controller-manager'] },
            { label: 'Workers', children: ['kubelet', 'kube-proxy', 'runtime'] },
            { label: 'External', children: ['cloud-controller', 'load balancers', 'storage / route APIs'] },
          ]}
        />
      </Section>

      <Section num="05" title="Example Pod manifest">
        <CodeBlock title="pod.yaml" lang="yaml" code={manifest} />
      </Section>

      <Section num="06" title="Key takeaways">
        <div className="card">
          <ul className="takeaways">
            <li>The API server is the only component that accepts writes from users and automation.</li>
            <li>Controllers and the scheduler react to stored state; worker nodes materialize that state.</li>
            <li>etcd persistence is what makes the cluster recoverable and eventually consistent.</li>
          </ul>
        </div>
      </Section>

      <PageNav />
    </div>
  )
}

export default ClusterArchitecturePage
