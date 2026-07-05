import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Callout from '../components/Callout'
import CodeBlock from '../components/CodeBlock'
import Mindmap from '../components/Mindmap'
import PageHero from '../components/PageHero'
import PageNav from '../components/PageNav'
import Section from '../components/Section'

interface PodContainer {
  name: string
  color: string
}

function PodsPage() {
  const [sidecar, setSidecar] = useState(false)
  const [sharedNetwork, setSharedNetwork] = useState(true)
  const [sharedVolume, setSharedVolume] = useState(true)

  const containers = useMemo<PodContainer[]>(
    () => [
      { name: 'app', color: 'var(--k8s)' },
      ...(sidecar ? [{ name: 'sidecar', color: 'var(--teal)' }] : []),
    ],
    [sidecar],
  )

  const manifest = `apiVersion: v1
kind: Pod
metadata:
  name: web
spec:
  containers:
    - name: app
      image: nginx:1.27
      ports:
        - containerPort: 80
    - name: sidecar
      image: busybox:1.36
      command: ["sh", "-c", "while true; do sleep 30; done"]`

  return (
    <div className="page">
      <PageHero
        eyebrow="Workloads"
        title="Pods"
        lede="A Pod is one shared network namespace, one shared storage boundary, and one or more containers that are scheduled together."
      />

      <Section num="01" title="What makes a Pod special">
        <div className="grid-2">
          <div className="card">
            Containers in the same Pod see each other over <code>localhost</code> and share the same IP address. They
            also mount the same Pod volumes, which is why sidecars can inspect logs or proxy traffic locally.
          </div>
          <Callout kind="tip">
            The <b>pause</b> or infra container keeps the Pod sandbox alive so that the namespace survives while the
            regular application containers come and go.
          </Callout>
        </div>
      </Section>

      <Section num="02" title="Interactive Pod sandbox">
        <div className="stage">
          <div className="btn-row" style={{ marginBottom: 12 }}>
            <button type="button" className={`chip ${sidecar ? 'on' : ''}`} onClick={() => setSidecar((value) => !value)}>
              sidecar
            </button>
            <button type="button" className={`chip ${sharedNetwork ? 'on' : ''}`} onClick={() => setSharedNetwork((value) => !value)}>
              shared localhost
            </button>
            <button type="button" className={`chip ${sharedVolume ? 'on' : ''}`} onClick={() => setSharedVolume((value) => !value)}>
              shared volume
            </button>
          </div>

          <div className="grid-2">
            <div className="card">
              <div className="pill" style={{ marginBottom: 10 }}>
                pod sandbox
              </div>
              <div className="box" style={{ borderColor: 'var(--k8s)' }}>
                <motion.div layout className="pill" style={{ marginBottom: 10, background: 'rgba(50,108,229,0.16)', color: '#fff' }}>
                  pause container
                </motion.div>
                <div className="btn-row" style={{ justifyContent: 'center' }}>
                  <AnimatePresence>
                    {containers.map((container) => (
                      <motion.div
                        key={container.name}
                        layout
                        initial={{ opacity: 0, y: 16, scale: 0.94 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -16, scale: 0.94 }}
                        className="box"
                        style={{ borderColor: container.color, minWidth: 132 }}
                      >
                        {container.name}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="kv">
                <span className="k">Network namespace</span>
                <span>{sharedNetwork ? 'shared' : 'hidden'}</span>
              </div>
              <div className="kv">
                <span className="k">Volume mount</span>
                <span>{sharedVolume ? 'shared' : 'isolated'}</span>
              </div>
              <div className="kv">
                <span className="k">Containers inside</span>
                <span>{containers.length}</span>
              </div>
            </div>
          </div>

          <div className="grid-2" style={{ marginTop: 16 }}>
            <div className="card">
              <b>Shared localhost</b>
              <p>{sharedNetwork ? 'The app and sidecar can talk over 127.0.0.1.' : 'Toggle it on to show the shared network namespace.'}</p>
            </div>
            <div className="card">
              <b>Shared volume</b>
              <p>{sharedVolume ? 'Both containers see the same mounted files.' : 'Toggle it on to show the shared filesystem mount.'}</p>
            </div>
          </div>
        </div>
      </Section>

      <Section num="03" title="Common multi-container patterns">
        <Mindmap
          center="Pod patterns"
          branches={[
            { label: 'Sidecar', children: ['log shipper', 'proxy', 'config reloader'] },
            { label: 'Ambassador', children: ['local proxy', 'TLS termination', 'protocol translation'] },
            { label: 'Adapter', children: ['metrics adapter', 'format conversion', 'normalization'] },
          ]}
        />
      </Section>

      <Section num="04" title="Example Pod manifest">
        <CodeBlock title="pod.yaml" lang="yaml" code={manifest} />
      </Section>

      <Section num="05" title="Key takeaways">
        <div className="card">
          <ul className="takeaways">
            <li>A Pod shares IP, localhost, and volume mounts across its containers.</li>
            <li>The pause container holds the Pod sandbox open even when app containers restart.</li>
            <li>Multi-container Pods work best when the containers share a lifecycle and cooperate closely.</li>
          </ul>
        </div>
      </Section>

      <PageNav />
    </div>
  )
}

export default PodsPage
