import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Callout from '../components/Callout'
import CodeBlock from '../components/CodeBlock'
import FlowDiagram from '../components/FlowDiagram'
import Mindmap from '../components/Mindmap'
import PageHero from '../components/PageHero'
import PageNav from '../components/PageNav'
import Section from '../components/Section'

type ServiceType = 'ClusterIP' | 'NodePort' | 'LoadBalancer'

function ServicePage() {
  const [type, setType] = useState<ServiceType>('ClusterIP')
  const [request, setRequest] = useState(0)
  const endpoints = ['pod-a', 'pod-b', 'pod-c']

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRequest((value) => value + 1)
    }, 900)
    return () => window.clearInterval(timer)
  }, [])

  const selectedEndpoint = endpoints[request % endpoints.length]

  const diagramNodes = useMemo(
    () => [
      { id: 'client', position: { x: 40, y: 140 }, data: { label: 'Client' }, className: 'rf-node', style: { borderColor: 'var(--docker)' } },
      { id: 'service', position: { x: 240, y: 140 }, data: { label: `${type} Service` }, className: 'rf-node', style: { borderColor: 'var(--k8s)' } },
      { id: 'pod-a', position: { x: 460, y: 40 }, data: { label: 'pod-a' }, className: 'rf-node' },
      { id: 'pod-b', position: { x: 460, y: 140 }, data: { label: 'pod-b' }, className: 'rf-node' },
      { id: 'pod-c', position: { x: 460, y: 240 }, data: { label: 'pod-c' }, className: 'rf-node' },
    ],
    [type],
  )

  const diagramEdges = [
    { id: 's1', source: 'client', target: 'service', type: 'smoothstep' },
    { id: 's2', source: 'service', target: 'pod-a', type: 'smoothstep' },
    { id: 's3', source: 'service', target: 'pod-b', type: 'smoothstep' },
    { id: 's4', source: 'service', target: 'pod-c', type: 'smoothstep' },
  ]

  const manifest = `apiVersion: v1
kind: Service
metadata:
  name: web
spec:
  type: ClusterIP
  selector:
    app: web
  ports:
    - port: 80
      targetPort: 8080`

  return (
    <div className="page">
      <PageHero
        eyebrow="Networking"
        title="Service"
        lede="A Service gives Pods a stable virtual IP and a label selector that tracks the current endpoint list."
      />

      <Section num="01" title="Why Services exist">
        <div className="grid-2">
          <div className="card">
            Pods are disposable. A Service decouples clients from individual Pod IPs by keeping a stable front door and
            updating its endpoints as the selector matches change.
          </div>
          <Callout kind="info">
            kube-proxy programs node-level forwarding rules, so traffic that hits the Service IP can be load-balanced to
            one of the matching Pods.
          </Callout>
        </div>
      </Section>

      <Section num="02" title="Service type and endpoint behavior">
        <div className="stage">
          <div className="btn-row" style={{ marginBottom: 12 }}>
            {(['ClusterIP', 'NodePort', 'LoadBalancer'] as const).map((serviceType) => (
              <button key={serviceType} type="button" className={`chip ${type === serviceType ? 'on' : ''}`} onClick={() => setType(serviceType)}>
                {serviceType}
              </button>
            ))}
          </div>
          <FlowDiagram nodes={diagramNodes} edges={diagramEdges} />
          <div className="card" style={{ marginTop: 14 }}>
            <div className="kv">
              <span className="k">selected endpoint</span>
              <span>{selectedEndpoint}</span>
            </div>
            <div className="btn-row" style={{ marginTop: 8 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedEndpoint}
                  className="box"
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.95 }}
                  style={{ borderColor: 'var(--green)' }}
                >
                  request → {selectedEndpoint}
                </motion.div>
              </AnimatePresence>
              <div className="chip on">kube-proxy load balances across endpoints</div>
            </div>
          </div>
        </div>
      </Section>

      <Section num="03" title="Service map">
        <Mindmap
          center="Service"
          branches={[
            { label: 'Types', children: ['ClusterIP', 'NodePort', 'LoadBalancer'] },
            { label: 'Data plane', children: ['Endpoints', 'kube-proxy', 'virtual IP'] },
            { label: 'Consumers', children: ['in-cluster clients', 'external clients', 'ingress'] },
          ]}
        />
      </Section>

      <Section num="04" title="Example manifest">
        <CodeBlock title="service.yaml" lang="yaml" code={manifest} />
      </Section>

      <Section num="05" title="Key takeaways">
        <div className="card">
          <ul className="takeaways">
            <li>Services give Pods a stable network identity even though Pods themselves are ephemeral.</li>
            <li>The selector turns Pod labels into an endpoint list.</li>
            <li>kube-proxy implements the virtual IP and traffic distribution on each node.</li>
          </ul>
        </div>
      </Section>

      <PageNav />
    </div>
  )
}

export default ServicePage
