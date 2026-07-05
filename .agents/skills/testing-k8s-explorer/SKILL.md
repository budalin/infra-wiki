---
name: testing-k8s-explorer
description: Test the Kubernetes Explorer React/Vite app end-to-end. Use when verifying UI or interactive-demo changes across the topic pages (Docker, Deployment, Labels & Selectors, DaemonSet, etc.).
---

# Testing the Kubernetes Explorer app

A frontend-only React 19 + Vite + TypeScript SPA. No backend, no auth, no secrets.

## Run it

```bash
npm install        # first time only
npm run dev        # serves at http://localhost:5173 (Vite default)
```

Other commands: `npm run build` (tsc + vite build), `npm run lint` (oxlint), `npm run preview`.

## Routing

- `/` → Home (grid of topic cards)
- `/topic/:slug` → topic page (slugs live in `src/topics.ts`, e.g. `docker`, `deployment`, `labels-selectors`, `daemonset`, `service`, `job`, `cronjob`, `probes`, `volumes`).
- History-API routing: deep links work in dev, but a static host needs a catch-all rewrite to `index.html`.
- Sidebar links + bottom prev/next cards both navigate; prev/next order follows the `topics` array.

## Golden-path checks (each produces a visibly distinct state)

These are good end-to-end assertions because a broken/static build would look identical:

- **Docker** (`/topic/docker`, section 02): click `docker run` → container cards appear and the "Writable layers" counter increments (0 → N). `rm` decrements.
- **Deployment** (`/topic/deployment`, section 03): with `RollingUpdate` selected, `Deploy v2` transitions all pods from `v1` to `v2` (takes a few seconds — wait ~4s); `Rollback` reverts to `v1`.
- **Labels & Selectors** (`/topic/labels-selectors`, section 02): toggling matcher chips (`app`/`tier`/`env`) changes the selector text and the "Matched Pods: N" count; matching pods highlight, others dim.
- **DaemonSet** (`/topic/daemonset`, section 02): `add node` appends a node card with its own pod and increments "Pods scheduled"; `remove node` decrements — pod count always tracks node count.

## Tips

- Interactive demos are usually in section 02 or 03 — scroll down after navigating.
- Rollout/animation demos are time-based; wait a few seconds before asserting the final state rather than screenshotting immediately.
- Verify counters/labels in the DOM text (e.g. "Writable layers 2", "Matched Pods: 2", "Pods scheduled: 4") — these are the reliable pass/fail signals.
- React Flow diagrams/mindmaps render as `<svg>` with node `<div>`s; presence of the labeled nodes is enough to confirm they mounted.

## Devin Secrets Needed

None — the app is fully local with no external dependencies or credentials.
