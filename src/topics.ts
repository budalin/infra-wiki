export interface TopicMeta {
  slug: string
  title: string
  group: string
  accent: string
  blurb: string
}

export const topics: TopicMeta[] = [
  {
    slug: 'docker',
    title: 'Docker',
    group: 'Containers',
    accent: 'var(--docker)',
    blurb: 'Image layers, container runtime behavior, and how Docker boots isolated processes.',
  },
  {
    slug: 'cluster-architecture',
    title: 'Cluster Architecture',
    group: 'Cluster',
    accent: 'var(--k8s)',
    blurb: 'How the control plane and worker nodes cooperate to turn desired state into reality.',
  },
  {
    slug: 'pods',
    title: 'Pods',
    group: 'Workloads',
    accent: 'var(--teal)',
    blurb: 'The smallest deployable unit: shared namespaces, pause containers, and container patterns.',
  },
  {
    slug: 'creating-pods',
    title: 'Creating Pods',
    group: 'Workloads',
    accent: 'var(--purple)',
    blurb: 'The request path from kubectl to a running Pod, including validation, scheduling, and kubelet.',
  },
  {
    slug: 'replication-controller',
    title: 'Replication Controller',
    group: 'Workloads',
    accent: 'var(--green)',
    blurb: 'The original replica manager that keeps a fixed number of Pods alive.',
  },
  {
    slug: 'replicaset',
    title: 'ReplicaSet',
    group: 'Workloads',
    accent: 'var(--pink)',
    blurb: 'The successor to ReplicationController with set-based selectors and Deployment integration.',
  },
  {
    slug: 'daemonset',
    title: 'DaemonSet',
    group: 'Workloads',
    accent: 'var(--amber)',
    blurb: 'Runs one Pod on every matching node for agents, logging, and node-level services.',
  },
  {
    slug: 'deployment',
    title: 'Deployment',
    group: 'Workloads',
    accent: 'var(--k8s-light)',
    blurb: 'Manages ReplicaSets to support rolling updates, rollbacks, and declarative rollout control.',
  },
  {
    slug: 'job',
    title: 'Job',
    group: 'Workloads',
    accent: 'var(--green)',
    blurb: 'Runs Pods to completion with parallelism, completions, and retry behavior.',
  },
  {
    slug: 'cronjob',
    title: 'CronJob',
    group: 'Workloads',
    accent: 'var(--purple)',
    blurb: 'Schedules Jobs from a cron expression and coordinates recurring batch execution.',
  },
  {
    slug: 'labels-selectors',
    title: 'Labels & Selectors',
    group: 'Metadata',
    accent: 'var(--teal)',
    blurb: 'Attach metadata to objects and use selectors to target the right Pods.',
  },
  {
    slug: 'service',
    title: 'Service',
    group: 'Networking',
    accent: 'var(--docker)',
    blurb: 'Expose a stable virtual IP and maintain endpoint membership as Pods come and go.',
  },
  {
    slug: 'probes',
    title: 'K8s Probes',
    group: 'Reliability',
    accent: 'var(--red)',
    blurb: 'Liveness, readiness, and startup checks that influence restarts and traffic routing.',
  },
  {
    slug: 'volumes',
    title: 'Volumes',
    group: 'Storage',
    accent: 'var(--amber)',
    blurb: 'Attach storage to Pods with lifecycle rules that differ from container filesystems.',
  },
]

export function getPrevNext(slug: string): { prev?: TopicMeta; next?: TopicMeta } {
  const index = topics.findIndex((topic) => topic.slug === slug)
  return {
    prev: index > 0 ? topics[index - 1] : undefined,
    next: index >= 0 && index < topics.length - 1 ? topics[index + 1] : undefined,
  }
}
