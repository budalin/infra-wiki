import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Callout from '../components/Callout'
import CodeBlock from '../components/CodeBlock'
import Mindmap from '../components/Mindmap'
import PageHero from '../components/PageHero'
import PageNav from '../components/PageNav'
import Section from '../components/Section'

type SchedulePreset = '*/5 * * * *' | '0 * * * *' | '0 0 * * *'
type ConcurrencyPolicy = 'Allow' | 'Forbid' | 'Replace'

function CronJobPage() {
  const [preset, setPreset] = useState<SchedulePreset>('*/5 * * * *')
  const [policy, setPolicy] = useState<ConcurrencyPolicy>('Allow')
  const [clock, setClock] = useState(0)
  const [jobs, setJobs] = useState<number[]>([])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setClock((value) => value + 1)
    }, 600)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const interval = preset === '*/5 * * * *' ? 5 : preset === '0 * * * *' ? 10 : 15
    if (clock > 0 && clock % interval === 0) {
      setJobs((current) => {
        if (policy === 'Forbid' && current.length > 0) {
          return current
        }
        if (policy === 'Replace' && current.length > 0) {
          return [clock]
        }
        return [...current, clock]
      })
    }
  }, [clock, policy, preset])

  const manifest = `apiVersion: batch/v1
kind: CronJob
metadata:
  name: nightly
spec:
  schedule: "0 0 * * *"
  concurrencyPolicy: Forbid
  jobTemplate:
    spec:
      template:
        spec:
          restartPolicy: Never
          containers:
            - name: backup
              image: busybox:1.36
              command: ["sh", "-c", "echo backup"]`

  return (
    <div className="page">
      <PageHero
        eyebrow="Workloads"
        title="CronJob"
        lede="A CronJob creates Jobs on a schedule. Kubernetes parses the cron expression, waits for the next firing time, and then starts a Job from the embedded template."
      />

      <Section num="01" title="Scheduling model">
        <div className="grid-2">
          <div className="card">
            A CronJob manages time, while the Job it spawns manages completion. That separation keeps the schedule
            policy independent from the batch execution policy.
          </div>
          <Callout kind="info">
            <b>concurrencyPolicy</b> controls what happens if the next schedule arrives while the previous Job is still
            running.
          </Callout>
        </div>
      </Section>

      <Section num="02" title="Clock and schedule presets">
        <div className="stage">
          <div className="btn-row" style={{ marginBottom: 12 }}>
            {(['*/5 * * * *', '0 * * * *', '0 0 * * *'] as const).map((schedule) => (
              <button key={schedule} type="button" className={`chip ${preset === schedule ? 'on' : ''}`} onClick={() => setPreset(schedule)}>
                {schedule}
              </button>
            ))}
          </div>
          <div className="btn-row" style={{ marginBottom: 12 }}>
            {(['Allow', 'Forbid', 'Replace'] as const).map((entry) => (
              <button key={entry} type="button" className={`chip ${policy === entry ? 'on' : ''}`} onClick={() => setPolicy(entry)}>
                {entry}
              </button>
            ))}
          </div>
          <div className="grid-2">
            <div className="card">
              <div className="pill" style={{ marginBottom: 10 }}>
                clock
              </div>
              <motion.div className="box" animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY }}>
                tick {clock}
              </motion.div>
            </div>
            <div className="card">
              <div className="pill" style={{ marginBottom: 10 }}>
                spawned Jobs
              </div>
              <div className="btn-row">
                <AnimatePresence>
                  {jobs.map((job) => (
                    <motion.div
                      key={job}
                      layout
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -14 }}
                      className="box"
                      style={{ borderColor: 'var(--purple)', minWidth: 92 }}
                    >
                      job @ {job}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section num="03" title="Cron expression breakdown">
        <Mindmap
          center="CronJob"
          branches={[
            { label: 'minute', children: ['0-59', '*/5'] },
            { label: 'hour', children: ['0-23', 'business hours'] },
            { label: 'day / month / weekday', children: ['calendar targeting', 'time windows'] },
          ]}
        />
      </Section>

      <Section num="04" title="Example manifest">
        <CodeBlock title="cronjob.yaml" lang="yaml" code={manifest} />
      </Section>

      <Section num="05" title="Key takeaways">
        <div className="card">
          <ul className="takeaways">
            <li>CronJobs schedule Jobs, and Jobs run Pods to completion.</li>
            <li>The cron expression decides when the Job template is instantiated.</li>
            <li>concurrencyPolicy keeps overlapping executions under control.</li>
          </ul>
        </div>
      </Section>

      <PageNav />
    </div>
  )
}

export default CronJobPage
