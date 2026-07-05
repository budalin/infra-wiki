import { useState } from 'react'
import { motion } from 'framer-motion'
import Callout from '../components/Callout'
import CodeBlock from '../components/CodeBlock'
import Mindmap from '../components/Mindmap'
import PageHero from '../components/PageHero'
import PageNav from '../components/PageNav'
import Section from '../components/Section'

interface PodRecord {
  name: string
  labels: Record<string, string>
}

function LabelsSelectorsPage() {
  const [useSetBased, setUseSetBased] = useState(false)
  const [envFilter, setEnvFilter] = useState(true)
  const [tierFilter, setTierFilter] = useState(true)
  const [appFilter, setAppFilter] = useState(true)

  const pods: PodRecord[] = [
    { name: 'web-1', labels: { app: 'web', tier: 'frontend', env: 'prod' } },
    { name: 'web-2', labels: { app: 'web', tier: 'frontend', env: 'staging' } },
    { name: 'api-1', labels: { app: 'api', tier: 'backend', env: 'prod' } },
    { name: 'batch-1', labels: { app: 'worker', tier: 'batch', env: 'dev' } },
  ]

  const selectorText = useSetBased
    ? `matchLabels: {${appFilter ? ' app: web,' : ''}}\nmatchExpressions:\n  ${tierFilter ? '- key: tier\n    operator: In\n    values: [frontend, backend]\n  ' : ''}${envFilter ? '- key: env\n    operator: NotIn\n    values: [dev]' : ''}`.trim()
    : `${appFilter ? 'app=web' : ''}${tierFilter ? `${appFilter ? ', ' : ''}tier=frontend` : ''}${envFilter ? `${appFilter || tierFilter ? ', ' : ''}env=prod` : ''}`

  function matches(pod: PodRecord) {
    if (useSetBased) {
      const appAllowed = appFilter ? pod.labels.app === 'web' || pod.labels.app === 'api' : true
      const tierAllowed = tierFilter ? pod.labels.tier === 'frontend' || pod.labels.tier === 'backend' : true
      const envAllowed = envFilter ? pod.labels.env !== 'dev' : true
      return appAllowed && tierAllowed && envAllowed
    }
    return (!appFilter || pod.labels.app === 'web') && (!tierFilter || pod.labels.tier === 'frontend') && (!envFilter || pod.labels.env === 'prod')
  }

  const highlighted = pods.filter(matches)

  const manifest = `apiVersion: v1
kind: Service
metadata:
  name: web
spec:
  selector:
    app: web
    tier: frontend
  ports:
    - port: 80
      targetPort: 80`

  return (
    <div className="page">
      <PageHero
        eyebrow="Metadata"
        title="Labels & Selectors"
        lede="Labels are arbitrary key/value metadata. Selectors turn that metadata into a query language that controllers and Services use to target the right objects."
      />

      <Section num="01" title="How label matching works">
        <div className="grid-2">
          <div className="card">
            Labels are attached to Pods, ReplicaSets, Services, and many other objects. A selector is just a filter
            expression that matches objects by label values.
          </div>
          <Callout kind="tip">
            Equality-based selectors are simple <b>key=value</b> checks. Set-based selectors add <b>In</b>, <b>NotIn</b>,
            <b>Exists</b>, and <b>DoesNotExist</b> matching.
          </Callout>
        </div>
      </Section>

      <Section num="02" title="Interactive selector builder">
        <div className="stage">
          <div className="btn-row" style={{ marginBottom: 12 }}>
            <button type="button" className={`chip ${!useSetBased ? 'on' : ''}`} onClick={() => setUseSetBased(false)}>
              equality
            </button>
            <button type="button" className={`chip ${useSetBased ? 'on' : ''}`} onClick={() => setUseSetBased(true)}>
              set-based
            </button>
            <button type="button" className={`chip ${appFilter ? 'on' : ''}`} onClick={() => setAppFilter((value) => !value)}>
              app
            </button>
            <button type="button" className={`chip ${tierFilter ? 'on' : ''}`} onClick={() => setTierFilter((value) => !value)}>
              tier
            </button>
            <button type="button" className={`chip ${envFilter ? 'on' : ''}`} onClick={() => setEnvFilter((value) => !value)}>
              env
            </button>
          </div>
          <div className="grid-2">
            <div className="card">
              <div className="pill" style={{ marginBottom: 10 }}>
                selector
              </div>
              <pre style={{ margin: 0, fontFamily: 'var(--mono)', whiteSpace: 'pre-wrap' }}>{selectorText}</pre>
            </div>
            <div className="card">
              <div className="pill" style={{ marginBottom: 10 }}>
                matching Pods
              </div>
              <div className="btn-row">
                {pods.map((pod) => (
                  <motion.div
                    key={pod.name}
                    layout
                    className="box"
                    animate={{ opacity: matches(pod) ? 1 : 0.35, scale: matches(pod) ? 1 : 0.96 }}
                    style={{ borderColor: matches(pod) ? 'var(--green)' : 'var(--border)' }}
                  >
                    <b>{pod.name}</b>
                    <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 6 }}>
                      {Object.entries(pod.labels)
                        .map(([key, value]) => `${key}=${value}`)
                        .join(', ')}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div style={{ marginTop: 10 }}>Matched Pods: {highlighted.length}</div>
            </div>
          </div>
        </div>
      </Section>

      <Section num="03" title="Why selectors matter">
        <Mindmap
          center="Selectors"
          branches={[
            { label: 'Equality', children: ['simple service target', 'exact label match'] },
            { label: 'Set-based', children: ['In / NotIn', 'Exists / DoesNotExist'] },
            { label: 'Users', children: ['Services', 'Deployments', 'ReplicaSets'] },
          ]}
        />
      </Section>

      <Section num="04" title="Example selector manifest">
        <CodeBlock title="service.yaml" lang="yaml" code={manifest} />
      </Section>

      <Section num="05" title="Key takeaways">
        <div className="card">
          <ul className="takeaways">
            <li>Labels are attached to objects; selectors are the queries that find them.</li>
            <li>Equality selectors are exact matches, while set-based selectors support richer filtering.</li>
            <li>Controllers depend on stable selectors so that they keep managing the intended objects.</li>
          </ul>
        </div>
      </Section>

      <PageNav />
    </div>
  )
}

export default LabelsSelectorsPage
