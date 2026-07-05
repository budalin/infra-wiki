import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Callout from '../components/Callout'
import CodeBlock from '../components/CodeBlock'
import Mindmap from '../components/Mindmap'
import PageHero from '../components/PageHero'
import PageNav from '../components/PageNav'
import Section from '../components/Section'

interface JobPod {
  id: number
  status: 'running' | 'completed'
}

function JobPage() {
  const [completions, setCompletions] = useState(4)
  const [parallelism, setParallelism] = useState(2)
  const [running, setRunning] = useState(false)
  const [pods, setPods] = useState<JobPod[]>([])
  const [completed, setCompleted] = useState(0)
  const [nextId, setNextId] = useState(1)

  useEffect(() => {
    if (!running) {
      return undefined
    }
    if (completed >= completions && pods.every((pod) => pod.status === 'completed')) {
      setRunning(false)
      return undefined
    }
    const timer = window.setTimeout(() => {
      setPods((current) => {
        const active = current.filter((pod) => pod.status === 'running').length
        if (active < parallelism && completed + active < completions) {
          return [...current, { id: nextId, status: 'running' }]
        }
        return current.map((pod) => (pod.status === 'running' ? { ...pod, status: 'completed' } : pod))
      })
      setNextId((value) => value + 1)
      setCompleted((value) => Math.min(value + 1, completions))
    }, 850)
    return () => window.clearTimeout(timer)
  }, [completed, completions, nextId, parallelism, pods, running])

  function runJob() {
    setPods([{ id: 1, status: 'running' }])
    setCompleted(0)
    setNextId(2)
    setRunning(true)
  }

  const manifest = `apiVersion: batch/v1
kind: Job
metadata:
  name: batch
spec:
  completions: 4
  parallelism: 2
  backoffLimit: 3
  template:
    spec:
      restartPolicy: Never
      containers:
        - name: worker
          image: busybox:1.36
          command: ["sh", "-c", "echo hello && sleep 2"]`

  return (
    <div className="page">
      <PageHero
        eyebrow="Workloads"
        title="Job"
        lede="A Job runs Pods to completion. It tracks how many successful completions are still needed and how many Pods may run at once."
      />

      <Section num="01" title="What makes a Job different">
        <div className="grid-2">
          <div className="card">
            A Job is for finite work. When a Pod exits successfully, the Job counts it as one completion and launches
            more Pods until the target is met.
          </div>
          <Callout kind="tip">
            <b>backoffLimit</b> controls how many times Kubernetes retries failed Pods before declaring the Job failed.
          </Callout>
        </div>
      </Section>

      <Section num="02" title="Parallel execution">
        <div className="stage">
          <div className="grid-2">
            <div className="card">
              <div className="kv">
                <span className="k">completions</span>
                <span>{completions}</span>
              </div>
              <input type="range" min="1" max="8" value={completions} onChange={(event) => setCompletions(Number(event.target.value))} style={{ width: '100%' }} />
              <div className="kv" style={{ marginTop: 10 }}>
                <span className="k">parallelism</span>
                <span>{parallelism}</span>
              </div>
              <input type="range" min="1" max="4" value={parallelism} onChange={(event) => setParallelism(Number(event.target.value))} style={{ width: '100%' }} />
              <div className="btn-row" style={{ marginTop: 12 }}>
                <button type="button" className="btn primary" onClick={runJob}>
                  Run
                </button>
              </div>
            </div>
            <div className="card">
              <div className="kv">
                <span className="k">completed</span>
                <span>{completed}</span>
              </div>
              <div className="btn-row">
                <AnimatePresence>
                  {pods.map((pod) => (
                    <motion.div
                      key={pod.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      className="box"
                      style={{ borderColor: pod.status === 'completed' ? 'var(--green)' : 'var(--amber)', minWidth: 96 }}
                    >
                      pod {pod.id}
                      <div style={{ color: 'var(--text-faint)', fontSize: 12 }}>{pod.status}</div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section num="03" title="Batch control map">
        <Mindmap
          center="Job"
          branches={[
            { label: 'Desired work', children: ['completions', 'parallelism'] },
            { label: 'Retry policy', children: ['restartPolicy: Never', 'backoffLimit'] },
            { label: 'Outcome', children: ['succeeded', 'failed'] },
          ]}
        />
      </Section>

      <Section num="04" title="Example manifest">
        <CodeBlock title="job.yaml" lang="yaml" code={manifest} />
      </Section>

      <Section num="05" title="Key takeaways">
        <div className="card">
          <ul className="takeaways">
            <li>Jobs are for run-to-completion workloads.</li>
            <li>parallelism limits concurrent Pods, while completions defines the total successful runs needed.</li>
            <li>backoffLimit caps retries when Pods keep failing.</li>
          </ul>
        </div>
      </Section>

      <PageNav />
    </div>
  )
}

export default JobPage
