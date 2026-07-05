import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Callout from '../components/Callout'
import CodeBlock from '../components/CodeBlock'
import Mindmap from '../components/Mindmap'
import PageHero from '../components/PageHero'
import PageNav from '../components/PageNav'
import Section from '../components/Section'

interface NodeRecord {
  name: string
}

function DaemonSetPage() {
  const [nodes, setNodes] = useState<NodeRecord[]>([{ name: 'node-a' }, { name: 'node-b' }, { name: 'node-c' }])

  const pods = useMemo(
    () => nodes.map((node) => ({ node: node.name, pod: `ds-${node.name}` })),
    [nodes],
  )

  const manifest = `apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: node-agent
spec:
  selector:
    matchLabels:
      app: node-agent
  template:
    metadata:
      labels:
        app: node-agent
    spec:
      nodeSelector:
        kubernetes.io/os: linux
      containers:
        - name: agent
          image: fluent-bit:3.0`

  return (
    <div className="page">
      <PageHero
        eyebrow="Workloads"
        title="DaemonSet"
        lede="A DaemonSet ensures that one Pod runs on every matching node. As nodes join or leave, the controller adds or removes Pods to keep the one-per-node invariant."
      />

      <Section num="01" title="When one Pod per node is the right model">
        <div className="grid-2">
          <div className="card">
            DaemonSets are ideal for node-local agents: log shippers, metrics collectors, CNI plugins, and host-level
            daemons that need to run everywhere.
          </div>
          <Callout kind="tip">
            Scheduling can be constrained with node selectors, affinities, and taints/tolerations so that the DaemonSet
            only runs on the nodes it should manage.
          </Callout>
        </div>
      </Section>

      <Section num="02" title="One Pod per node">
        <div className="stage">
          <div className="btn-row" style={{ marginBottom: 12 }}>
            <button type="button" className="btn" onClick={() => setNodes((current) => [...current, { name: `node-${current.length + 1}` }])}>
              add node
            </button>
            <button type="button" className="btn" onClick={() => setNodes((current) => current.slice(0, -1))} disabled={nodes.length <= 1}>
              remove node
            </button>
          </div>
          <div className="grid-3">
            <AnimatePresence>
              {nodes.map((node) => (
                <motion.div
                  key={node.name}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  className="card"
                >
                  <div className="pill" style={{ marginBottom: 10 }}>
                    {node.name}
                  </div>
                  <div className="box" style={{ borderColor: 'var(--amber)' }}>
                    {`Pod on ${node.name}`}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="card" style={{ marginTop: 16 }}>
            Pods scheduled: {pods.length}
          </div>
        </div>
      </Section>

      <Section num="03" title="DaemonSet mental map">
        <Mindmap
          center="DaemonSet"
          branches={[
            { label: 'Placement', children: ['one pod per node', 'nodeSelector', 'affinity'] },
            { label: 'Use cases', children: ['logging', 'metrics', 'CNI', 'storage agents'] },
            { label: 'Lifecycle', children: ['node joins', 'node leaves', 'pod follows'] },
          ]}
        />
      </Section>

      <Section num="04" title="Example manifest">
        <CodeBlock title="daemonset.yaml" lang="yaml" code={manifest} />
      </Section>

      <Section num="05" title="Key takeaways">
        <div className="card">
          <ul className="takeaways">
            <li>DaemonSets keep one Pod running on every matching node.</li>
            <li>They are commonly used for node agents and infrastructure services.</li>
            <li>As the node list changes, the DaemonSet reconciles the Pod set automatically.</li>
          </ul>
        </div>
      </Section>

      <PageNav />
    </div>
  )
}

export default DaemonSetPage
