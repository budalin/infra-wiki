import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Callout from '../components/Callout'
import CodeBlock from '../components/CodeBlock'
import Mindmap from '../components/Mindmap'
import PageHero from '../components/PageHero'
import PageNav from '../components/PageNav'
import Section from '../components/Section'

interface ContainerRecord {
  id: number
  status: 'running' | 'stopped'
}

function DockerPage() {
  const [containers, setContainers] = useState<ContainerRecord[]>([])
  const [nextId, setNextId] = useState(1)

  const imageLayers = ['ubuntu base', 'runtime libs', 'app binary', 'config']

  const visibleContainers = useMemo(() => containers.slice().reverse(), [containers])

  function runContainer() {
    setContainers((current) => [...current, { id: nextId, status: 'running' }])
    setNextId((value) => value + 1)
  }

  function stopContainer() {
    setContainers((current) =>
      current.map((container, index) => (index === current.length - 1 ? { ...container, status: 'stopped' } : container)),
    )
  }

  function removeContainer() {
    setContainers((current) => current.slice(0, -1))
  }

  const manifest = `FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
CMD ["node", "server.js"]`

  return (
    <div className="page">
      <PageHero
        eyebrow="Containers"
        title="Docker"
        lede="A Docker image is a stack of read-only layers. A container is the same image plus a thin writable layer and a process running in its own namespaces."
      />

      <Section num="01" title="What Docker does internally">
        <div className="grid-2">
          <div className="card">
            Docker builds images by stacking filesystem layers. At runtime it asks the kernel for cgroups, namespaces,
            and a writable copy-on-write layer, then starts the container process inside that isolated environment.
          </div>
          <Callout kind="info">
            Containers are not virtual machines. They <b>share the host kernel</b>; the isolation comes from Linux
            primitives, not from emulated hardware.
          </Callout>
        </div>
      </Section>

      <Section num="02" title="Layer stack and container lifecycle">
        <div className="stage">
          <div className="grid-2">
            <div>
              <div className="card" style={{ marginBottom: 16 }}>
                <b>Image layers</b>
                <div className="btn-row" style={{ marginTop: 10 }}>
                  {imageLayers.map((layer, index) => (
                    <motion.div
                      key={layer}
                      className="pill"
                      initial={{ y: 18, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.08 }}
                      style={{ borderColor: 'var(--docker)', color: 'var(--text)' }}
                    >
                      {layer}
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="btn-row">
                <button type="button" className="btn primary" onClick={runContainer}>
                  docker run
                </button>
                <button type="button" className="btn" onClick={stopContainer} disabled={!containers.length}>
                  stop
                </button>
                <button type="button" className="btn" onClick={removeContainer} disabled={!containers.length}>
                  rm
                </button>
              </div>
            </div>

            <div className="card">
              <div className="kv">
                <span className="k">Shared layers</span>
                <span>{imageLayers.length}</span>
              </div>
              <div className="kv">
                <span className="k">Writable layers</span>
                <span>{containers.length}</span>
              </div>
              <div className="kv">
                <span className="k">Kernel</span>
                <span>shared host kernel</span>
              </div>
            </div>
          </div>

          <div className="grid-2" style={{ marginTop: 18 }}>
            <div className="card">
              <div className="box" style={{ borderColor: 'var(--docker)' }}>
                <div className="pill" style={{ marginBottom: 10 }}>
                  image
                </div>
                <div>Immutable layer stack</div>
              </div>
            </div>
            <div className="card">
              <AnimatePresence>
                {visibleContainers.map((container) => (
                  <motion.div
                    key={container.id}
                    layout
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30, scale: 0.96 }}
                    className="box"
                    style={{ marginBottom: 10, borderColor: container.status === 'running' ? 'var(--green)' : 'var(--amber)' }}
                  >
                    <div className="pill" style={{ marginBottom: 8 }}>
                      container #{container.id}
                    </div>
                    <div>{container.status === 'running' ? 'running process' : 'stopped container'}</div>
                    <div className="status-dot" style={{ background: container.status === 'running' ? 'var(--green)' : 'var(--amber)', marginTop: 8 }} />
                  </motion.div>
                ))}
              </AnimatePresence>
              {!containers.length ? <div className="card">Click <b>docker run</b> to create a container from the same image.</div> : null}
            </div>
          </div>
        </div>
      </Section>

      <Section num="03" title="Why containers are smaller than VMs">
        <div className="grid-2">
          <div className="card">
            A VM boots a full guest operating system. A container reuses the host kernel and only packages the user-space
            bits: the filesystem layers, process environment, and entrypoint.
          </div>
          <Callout kind="tip">
            The writable container layer is ephemeral. If you need durable data, mount a volume instead of writing inside
            the container filesystem.
          </Callout>
        </div>
      </Section>

      <Section num="04" title="Image design map">
        <Mindmap
          center="Docker image"
          branches={[
            { label: 'Build', children: ['Dockerfile', 'layer cache', 'multi-stage build'] },
            { label: 'Run', children: ['containerd / runc', 'namespaces', 'cgroups'] },
            { label: 'Ship', children: ['registry push', 'registry pull', 'digest pinning'] },
          ]}
        />
      </Section>

      <Section num="05" title="Example Dockerfile">
        <CodeBlock title="Dockerfile" lang="dockerfile" code={manifest} />
      </Section>

      <Section num="06" title="Key takeaways">
        <div className="card">
          <ul className="takeaways">
            <li>Images are immutable layer stacks; containers add a writable layer on top.</li>
            <li>Container isolation comes from namespaces and cgroups, not a guest kernel.</li>
            <li>Repeated containers from one image share the same read-only layers.</li>
          </ul>
        </div>
      </Section>

      <PageNav />
    </div>
  )
}

export default DockerPage
