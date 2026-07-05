# infra-wiki — Kubernetes Explorer

An interactive, visual learning app for understanding Docker and core Kubernetes
concepts. Each topic gets its own page with a plain-language explanation of how it
works internally, an animated diagram, a mindmap, an interactive demo, and a real
YAML/Dockerfile manifest.

Built with React 19 + Vite + TypeScript, [Framer Motion](https://www.framer.com/motion/)
for animation, and [React Flow](https://reactflow.dev/) for node graphs / mindmaps.

## Topics

- **Docker** — image layers, container lifecycle, containers vs VMs
- **Cluster Architecture** — control plane + worker node components and the request flow
- **Pods** — shared namespaces, the pause container, multi-container patterns
- **Creating Pods** — the path from `kubectl` to a running Pod
- **Labels & Selectors** — equality- vs set-based selection, live matching
- **Replication Controller** — the original replica reconciler
- **ReplicaSet** — set-based selectors, managed by Deployments
- **DaemonSet** — one Pod per node
- **Deployment** — rolling updates, rollbacks, RollingUpdate vs Recreate
- **Service** — ClusterIP / NodePort / LoadBalancer, endpoint load-balancing
- **Job** — run-to-completion with parallelism and completions
- **CronJob** — schedule-driven Jobs
- **K8s Probes** — liveness / readiness / startup and their effects
- **Volumes** — emptyDir, hostPath, configMap/secret, PVC → PV persistence

## Getting started

```bash
npm install
npm run dev      # start the dev server (default http://localhost:5173)
```

## Scripts

```bash
npm run build    # type-check and build to dist/
npm run preview  # preview the production build locally
npm run lint     # run oxlint
```

## Deploying the static build

`npm run build` outputs a static site to `dist/` that can be hosted on any static
host (GitHub Pages, Netlify, Vercel, S3, nginx, ...).

The app is a single-page app using History-API routing, so configure your host with
a catch-all rewrite to `index.html` (e.g. Netlify `_redirects`: `/* /index.html 200`)
so deep links such as `/topic/pods` resolve correctly.
