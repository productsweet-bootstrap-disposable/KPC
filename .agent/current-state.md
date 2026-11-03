---
last_updated: "2026-11-03"
phase: live
health: green
tests_passing: 1
active_objectives: ["PS-BCB8K9-001"]
blockers: []
---

# Current State

> Volatile snapshot of what is shipped, what is in flight, and what is broken.
> Stable architecture and decisions live in `.agent/knowledge.md`.
> Canonical architecture model lives in `.agent/c4-model.json`. Design rules come from the
> Product Sweet design system, served by the agent.
>
> This file was seeded by the Product Sweet bootstrap (AI6P-249 / AI6P-254). The frontmatter `phase`
> field starts at `bootstrapping` and flips to `live` automatically when the bootstrap reaches the
> `complete` node.

## Contents
- [At a Glance](#at-a-glance)
- [Bootstrap Decisions](#bootstrap-decisions)
- [Shipped Capabilities](#shipped-capabilities)
- [Not Yet Shipped](#not-yet-shipped)
- [Current Objectives](#current-objectives)
- [Blockers](#blockers)
- [Entry Points for Agents](#entry-points-for-agents)

## At a Glance
- **Phase:** Live — first deploy verified end-to-end against the bound URL.
- **Health:** Green — initial build passed; no real content yet.
- **Deploy verified:** HTTPS 200 at https://main.d3jvz8g9mohfwa.amplifyapp.com.
- **Next up:** Refine the seeded `Bootstrap Follow-ups` epic in `.kanban/backlog/`.
- **Blockers:** None.

## Bootstrap Decisions

Captured at bootstrap time and pinned here so the project starts with real context, not boilerplate:

- **Project Type:** website
- **Framework:** astro
- **GitHub Repo:** https://github.com/productsweet-bootstrap-disposable/KPC
- **Default Branch:** `main`
- **AWS Account:** `874373490779`
- **AWS Region:** `ap-southeast-2`
- **Amplify App ID:** `d3jvz8g9mohfwa`
- **Live URL:** https://main.d3jvz8g9mohfwa.amplifyapp.com
- **Custom Domain:** https://main.d3jvz8g9mohfwa.amplifyapp.com
- **Owner:** productsweet-bootstrap-disposable
- **Bootstrap Feature Flag:** `01M6FDAFZ72Z37MW4KQ2BCB8K9` (per AI6P-249 Q8 per-tenant flag)
- **Bootstrap ID:** `01M6FDAFZ72Z37MW4KQ2BCB8K9`

## Shipped Capabilities

### Hosting & Delivery
- AWS Amplify app `d3jvz8g9mohfwa` connected to `main`, build spec matched to the framework.
- GitHub Actions deploy workflow committed and verified end-to-end against the synthetic
  bootstrap commit.
- Auto-build on `main` is **disabled** — the deploy workflow is the only release path.
- Content-only env-cache rule applied — changes under `.kanban/` and `.agent/` skip the rebuild.

### Repository Shape
- Default branch `main`; content-only / actionlint / dependabot baseline workflows committed.
- `.agent/` and `.kanban/` lane structure committed with this `current-state.md`, the seeded
  `Bootstrap Follow-ups` epic, and the always-seeded follow-up tasks.

## Not Yet Shipped

- Real content. The site currently serves a framework hello-world.
- Custom domain — the site is on the `*.amplifyapp.com` fallback; bind a real domain via the `Bind a custom domain` task seeded in `.kanban/backlog/`.
- Branch protection on `main` (`Set up branch protection on main` task seeded in
  `.kanban/backlog/`).
- Any feature secret — every declared secret has an SSM placeholder; supply real values before
  shipping anything that depends on them.

## Current Objectives

- Refine the seeded `Bootstrap Follow-ups` epic and promote children to `todo` once they have a
  real implementation plan.

## Blockers

None today.

## Entry Points for Agents

- This file (`.agent/current-state.md`) — what is shipped right now.
- `.agent/knowledge.md` — durable principles + key constraints.
- Product Sweet design system — design rules (binding), served by the agent.
- `.agent/c4-model.json` — architecture (canonical).
- `.kanban/backlog/` — work waiting for review.
- `.kanban/intake/` — captured ideas / bugs / requests not yet refined into dev tasks.
