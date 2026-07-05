import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Callout from '../components/Callout'
import CodeBlock from '../components/CodeBlock'
import Mindmap from '../components/Mindmap'
import PageHero from '../components/PageHero'
import PageNav from '../components/PageNav'
import Section from '../components/Section'
import Stepper from '../components/Stepper'

const steps = [
  'kubectl sends request',
  'API server validates',
  'etcd stores spec',
  'scheduler selects node',
  'kubelet starts containers',
]

function CreatingPodsPage() {
  const [step, setStep] = useState(-1)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!playing || step < 0 || step >= steps.length - 1) {
      return undefined
    }
    const timer = window.setTimeout(() => {
      setStep((value) => value + 1)
    }, 850)
    return () => window.clearTimeout(timer)
  }, [playing, step])

  function reset() {
    setPlaying(false)
    setStep(-1)
  }

  function advance() {
    setPlaying(false)
    setStep((value) => (value < 0 ? 0 : Math.min(value + 1, steps.length - 1)))
  }

  function play() {
    setPlaying(true)
    setStep((value) => (value < 0 ? 0 : value))
  }

  const manifest = `apiVersion: v1
kind: Pod
metadata:
  name: api
spec:
  containers:
    - name: app
      image: ghcr.io/example/api:v1`

  return (
    <div className="page">
      <PageHero
        eyebrow="Workloads"
        title="Creating Pods"
        lede="A Pod appears only after the API server accepts the spec, the scheduler binds it to a node, and the kubelet makes the containers real."
      />

      <Section num="01" title="Declarative creation path">
        <div className="grid-2">
          <div className="card">
            Imperative commands create objects immediately, but declarative flow is the normal Kubernetes pattern: the
            YAML is submitted, stored, and then continuously converged by the control plane.
          </div>
          <Callout kind="info">
            The scheduler only picks a node after the Pod exists in the API. The kubelet then becomes the actor that
            pulls images and starts containers on that node.
          </Callout>
        </div>
      </Section>

      <Section num="02" title="Creation pipeline">
        <div className="stage">
          <div className="btn-row" style={{ marginBottom: 12 }}>
            <button type="button" className="btn primary" onClick={play}>
              Play
            </button>
            <button type="button" className="btn" onClick={advance}>
              Next
            </button>
            <button type="button" className="btn" onClick={reset}>
              Reset
            </button>
          </div>
          <Stepper steps={steps} active={step < 0 ? 0 : step} />
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              className="card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              style={{ marginTop: 16 }}
            >
              <h3>{step < 0 ? 'Idle' : steps[step]}</h3>
              <p>
                {step < 0
                  ? 'Submit a manifest to begin.'
                  : step === 0
                    ? 'kubectl sends the request to the API server.'
                    : step === 1
                      ? 'The API server validates the object and admission control can mutate it.'
                      : step === 2
                        ? 'The object is persisted in etcd.'
                        : step === 3
                          ? 'The scheduler chooses a node that satisfies the Pod constraints.'
                          : 'The kubelet pulls the image, creates the Pod sandbox, and launches the containers.'}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </Section>

      <Section num="03" title="Mindmap of the lifecycle">
        <Mindmap
          center="Create Pod"
          branches={[
            { label: 'Client', children: ['kubectl apply', 'server-side apply', 'dry-run'] },
            { label: 'API path', children: ['validation', 'admission', 'etcd storage'] },
            { label: 'Node path', children: ['binding', 'image pull', 'sandbox start'] },
          ]}
        />
      </Section>

      <Section num="04" title="Example Pod manifest">
        <CodeBlock title="pod.yaml" lang="yaml" code={manifest} />
      </Section>

      <Section num="05" title="Key takeaways">
        <div className="card">
          <ul className="takeaways">
            <li>A Pod only becomes real after the API server stores it and the scheduler binds it.</li>
            <li>The kubelet is the component that turns the spec into running containers on a node.</li>
            <li>Declarative creation lets reconciliation loops repair drift automatically.</li>
          </ul>
        </div>
      </Section>

      <PageNav />
    </div>
  )
}

export default CreatingPodsPage
