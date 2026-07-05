import { useState } from 'react'
import { motion } from 'framer-motion'
import Callout from '../components/Callout'
import CodeBlock from '../components/CodeBlock'
import Mindmap from '../components/Mindmap'
import PageHero from '../components/PageHero'
import PageNav from '../components/PageNav'
import Section from '../components/Section'

type VolumeType = 'emptyDir' | 'hostPath' | 'configMap' | 'PVC'

function VolumesPage() {
  const [type, setType] = useState<VolumeType>('emptyDir')
  const [data, setData] = useState('draft')
  const [podGeneration, setPodGeneration] = useState(1)

  function writeData() {
    setData((current) => `${current}*`)
  }

  function restartContainer() {
    setData((current) => current)
  }

  function deletePod() {
    setPodGeneration((value) => value + 1)
    if (type === 'PVC' || type === 'hostPath') {
      return
    }
    if (type === 'configMap') {
      setData('readonly')
      return
    }
    setData('')
  }

  const manifest = `apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: data
spec:
  accessModes: ["ReadWriteOnce"]
  storageClassName: standard
  resources:
    requests:
      storage: 1Gi`

  return (
    <div className="page">
      <PageHero
        eyebrow="Storage"
        title="Volumes"
        lede="A container filesystem is ephemeral, but a Pod volume can persist across container restarts and, depending on the type, across Pod deletion."
      />

      <Section num="01" title="Volume lifecycle">
        <div className="grid-2">
          <div className="card">
            Volumes mount storage into the Pod sandbox. Some are node-local or Pod-scoped, while persistent volumes
            survive Pod replacement by binding a claim to underlying storage.
          </div>
          <Callout kind="info">
            <b>emptyDir</b> survives container restarts inside the same Pod, but it is erased when the Pod itself is deleted.
          </Callout>
        </div>
      </Section>

      <Section num="02" title="Interactive volume comparison">
        <div className="stage">
          <div className="btn-row" style={{ marginBottom: 12 }}>
            {(['emptyDir', 'hostPath', 'configMap', 'PVC'] as const).map((volumeType) => (
              <button key={volumeType} type="button" className={`chip ${type === volumeType ? 'on' : ''}`} onClick={() => setType(volumeType)}>
                {volumeType}
              </button>
            ))}
          </div>
          <div className="grid-2">
            <div className="card">
              <div className="kv">
                <span className="k">Pod generation</span>
                <span>{podGeneration}</span>
              </div>
              <div className="btn-row">
                <button type="button" className="btn" onClick={writeData} disabled={type === 'configMap'}>
                  write data
                </button>
                <button type="button" className="btn" onClick={restartContainer}>
                  restart container
                </button>
                <button type="button" className="btn primary" onClick={deletePod}>
                  delete Pod
                </button>
              </div>
            </div>
            <div className="card">
              <div className="pill" style={{ marginBottom: 10 }}>
                mounted data
              </div>
              <motion.div key={`${type}-${podGeneration}`} layout className="box" initial={{ opacity: 0.5, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                {data || 'empty'}
              </motion.div>
              <div style={{ marginTop: 10, color: 'var(--text-dim)' }}>
                {type === 'PVC'
                  ? 'The PV-backed volume survives Pod deletion.'
                  : type === 'hostPath'
                    ? 'The data lives on the node filesystem.'
                    : type === 'configMap'
                      ? 'ConfigMap data is mounted read-only.'
                      : 'emptyDir is recreated when the Pod is deleted.'}
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section num="03" title="Storage binding chain">
        <Mindmap
          center="PVC"
          branches={[
            { label: 'Pod volume', children: ['emptyDir', 'hostPath', 'configMap', 'secret'] },
            { label: 'Persistent path', children: ['PVC', 'PV', 'StorageClass'] },
            { label: 'Binding result', children: ['claim matched', 'storage provisioned'] },
          ]}
        />
      </Section>

      <Section num="04" title="Example claim">
        <CodeBlock title="pvc.yaml" lang="yaml" code={manifest} />
      </Section>

      <Section num="05" title="Key takeaways">
        <div className="card">
          <ul className="takeaways">
            <li>Container filesystems are ephemeral; volumes are where you place state you want to survive restarts.</li>
            <li>emptyDir survives container restarts but not Pod deletion.</li>
            <li>PVCs bind to PVs through a StorageClass so that storage can outlive the Pod.</li>
          </ul>
        </div>
      </Section>

      <PageNav />
    </div>
  )
}

export default VolumesPage
