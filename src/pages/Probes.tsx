import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Callout from '../components/Callout'
import CodeBlock from '../components/CodeBlock'
import Mindmap from '../components/Mindmap'
import PageHero from '../components/PageHero'
import PageNav from '../components/PageNav'
import Section from '../components/Section'

function ProbesPage() {
  const [unhealthy, setUnhealthy] = useState(false)
  const [startupComplete, setStartupComplete] = useState(true)
  const [restarts, setRestarts] = useState(0)

  const livenessFailed = unhealthy && startupComplete
  const readinessFailed = unhealthy || !startupComplete

  function restartContainer() {
    setRestarts((value) => value + 1)
    setUnhealthy(false)
    setStartupComplete(true)
  }

  const manifest = `apiVersion: v1
kind: Pod
metadata:
  name: api
spec:
  containers:
    - name: app
      image: nginx:1.27
      livenessProbe:
        httpGet:
          path: /healthz
          port: 8080
        initialDelaySeconds: 10
        periodSeconds: 5
      readinessProbe:
        tcpSocket:
          port: 8080
        periodSeconds: 5
      startupProbe:
        exec:
          command: ["cat", "/tmp/started"]
        failureThreshold: 30
        periodSeconds: 2`

  return (
    <div className="page">
      <PageHero
        eyebrow="Reliability"
        title="K8s Probes"
        lede="Liveness, readiness, and startup probes tell Kubernetes whether a container should be restarted, added to Service endpoints, or still be given time to boot."
      />

      <Section num="01" title="The three probe types">
        <div className="grid-2">
          <div className="card">
            Liveness answers “should this container be restarted?”, readiness answers “should it receive traffic?”, and
            startup answers “has the app finished starting yet?”.
          </div>
          <Callout kind="warn">
            Readiness failures do <b>not</b> restart the container. They only remove the Pod from Service endpoints until
            it becomes ready again.
          </Callout>
        </div>
      </Section>

      <Section num="02" title="Health simulator">
        <div className="stage">
          <div className="btn-row" style={{ marginBottom: 12 }}>
            <button type="button" className={`chip ${unhealthy ? 'on' : ''}`} onClick={() => setUnhealthy((value) => !value)}>
              unhealthy app
            </button>
            <button type="button" className={`chip ${startupComplete ? 'on' : ''}`} onClick={() => setStartupComplete((value) => !value)}>
              startup complete
            </button>
            <button type="button" className="btn primary" onClick={restartContainer}>
              restart container
            </button>
          </div>
          <div className="grid-2">
            <div className="card">
              <div className="kv">
                <span className="k">liveness</span>
                <span>{livenessFailed ? 'failing' : 'healthy'}</span>
              </div>
              <div className="kv">
                <span className="k">readiness</span>
                <span>{readinessFailed ? 'failing' : 'ready'}</span>
              </div>
              <div className="kv">
                <span className="k">restart count</span>
                <span>{restarts}</span>
              </div>
            </div>
            <div className="card">
              <div className="pill" style={{ marginBottom: 10 }}>
                Service endpoints
              </div>
              <AnimatePresence>
                {(readinessFailed ? ['pod-b', 'pod-c'] : ['pod-a', 'pod-b', 'pod-c']).map((endpoint) => (
                  <motion.div
                    key={endpoint}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="box"
                    style={{ borderColor: 'var(--green)', marginBottom: 8 }}
                  >
                    {endpoint}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Section>

      <Section num="03" title="Probe mental model">
        <Mindmap
          center="Probes"
          branches={[
            { label: 'Liveness', children: ['restart unhealthy container', 'detect deadlock'] },
            { label: 'Readiness', children: ['control traffic', 'wait for dependencies'] },
            { label: 'Startup', children: ['allow slow boot', 'defer other probes'] },
          ]}
        />
      </Section>

      <Section num="04" title="Probe configuration">
        <CodeBlock title="pod.yaml" lang="yaml" code={manifest} />
      </Section>

      <Section num="05" title="Key takeaways">
        <div className="card">
          <ul className="takeaways">
            <li>Liveness restarts containers; readiness gates traffic; startup protects slow initial boot.</li>
            <li>Probe types include httpGet, exec, and tcpSocket.</li>
            <li>initialDelaySeconds, periodSeconds, and failureThreshold shape the detection window.</li>
          </ul>
        </div>
      </Section>

      <PageNav />
    </div>
  )
}

export default ProbesPage
