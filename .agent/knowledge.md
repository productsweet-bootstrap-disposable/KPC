---
last_updated: "2026-11-03"
---

# Project Knowledge

> Durable principles, conventions, and reference material for this project.
> Volatile state lives in `.agent/current-state.md`.
> Per-task decision history lives in `.kanban/done/{task-id}.md`.
> The C4 model lives in `.agent/c4-model.json`. Design rules come from the Product Sweet
> design system, served by the agent (not stored in this repo).
>
> This file was seeded by the Product Sweet bootstrap (AI6P-249 / AI6P-254).
> Every section below is structural — fill in the project-specific narrative as the project takes shape.

## Contents
- [Project Identity](#project-identity)
- [Goals](#goals)
- [Key Constraints](#key-constraints)
- [Architecture](#architecture)
- [Testing Philosophy](#testing-philosophy)
- [C4 Architecture Model](#c4-architecture-model)
- [Toolchain](#toolchain)

## Project Identity

**Name:** KPC
**Purpose:** <!-- One or two sentences describing what this website is for and who it serves. -->

## Goals

<!-- Numbered list of the project's primary goals. Three to five is enough. -->

1. <!-- Goal one -->
2. <!-- Goal two -->
3. <!-- Goal three -->

## Key Constraints

<!-- The non-negotiables: language, hosting, accessibility floor, performance floor, etc.
     The defaults below were captured during bootstrap; edit them as the project evolves. -->

- **Language:** TypeScript
- **Hosting:** AWS Amplify Hosting in account `874373490779` (region `ap-southeast-2`).
- **Repository:** https://github.com/productsweet-bootstrap-disposable/KPC
- **Custom domain:** https://main.d3jvz8g9mohfwa.amplifyapp.com
- **Owner:** productsweet-bootstrap-disposable
- **Accessibility floor:** WCAG 2.2 AA — every shipped surface must pass the contrast,
  focus-visibility, touch-target, and label rules of the Product Sweet design system
  (served by the agent).
- **Secrets:** AWS SSM Parameter Store (`SecureString`), never in code or environment variables. Every
  declared secret has a placeholder SSM parameter at bootstrap time; supply real values before going
  live.

## Architecture

### Hosting & Delivery
- **Cloud Provider:** AWS, account `874373490779`, region `ap-southeast-2`.
- **Hosting:** AWS Amplify Hosting on the `main` branch with the build spec recommended for the
  chosen framework. Auto-build on `main` is **disabled** — the GitHub Actions deploy workflow is the
  only release path. Content-only changes (under `.kanban/` and `.agent/`) skip the rebuild via the
  env-cache pattern.
- **Custom Domain:** https://main.d3jvz8g9mohfwa.amplifyapp.com. Route53 hosted zone reused per the AI6P pattern; if
  no zone was available the bootstrap took the `*.amplifyapp.com` fallback and seeded a "bind a
  custom domain later" task.

### CI/CD
- **GitHub Actions workflows** (committed by the bootstrap):
  - `pr-gate.yml` — the **single required status check** on `main`. Always-on (no `paths:`
    filter, so it reports on every PR — a path-filtered required check would wedge content-only
    PRs and never let them merge). Classifies the diff inside the job: a content lane (changes
    only under `.kanban/`, `.agent/`, or root `*.md`) runs lint + typecheck + test and skips the
    framework build; the full lane adds the build. The `.kanban` duplicate-task-ID + frontmatter
    guards run on every PR. **Never make a path-filtered check the required one** — only this
    always-on gate may be required.
  - `deploy-low.yml` — on every `main` push, runs lint + tests + build, then triggers an
    Amplify RELEASE job to the **low** environment (auto-deploy leg).
  - `promote-<env>.yml` (one per higher environment) — `workflow_dispatch`-only (no push
    trigger), takes a `sha` input, checks out that pinned commit, and promotes it to `<env>`.
    The Product Sweet webapp dispatches these; "the gate is the trigger".
  - `actionlint.yml` — validates workflow files.
  - `dependabot.yml` — config-only; weekly dependency PRs.
- **OIDC trust:** federated into AWS via `token.actions.githubusercontent.com`, scoped to
  `repository_owner` and the bootstrap-created plan + deploy roles (per AI6P-103 / AI6P-104).

### Framework
<!-- The framework-specific overlay rendered by the bootstrap inserts a paragraph here describing
     the chosen framework, its build pipeline, and any framework-specific files of note. -->

This project uses **Astro 5** as its web framework. Astro is a content-led static-site generator
that ships **zero JavaScript by default** — every page renders to plain HTML at build time, and any
interactive component is opted in via a `client:*` directive (`client:load`, `client:idle`,
`client:visible`). This makes Astro the right default for content-led marketing sites where SEO and
first-paint speed matter more than rich client-side interactivity.

The build pipeline runs `astro build` to produce a `dist/` tree of static HTML / CSS / JS, which the
GitHub Actions deploy workflow uploads to AWS Amplify Hosting on every push to `main`. PR validation
runs the same `astro build` plus the framework's lint + test scripts.


## Testing Philosophy

- Every piece of functionality has corresponding tests.
- Tests serve as regression protection — no change should break existing tests without explicit
  justification.
- Build / lint / test gates run in CI on every PR; the same gates run again pre-deploy on `main`.
- Product Sweet treats merge as delivery, not completion. Done requires server-observed required CI
  on the exact merged SHA plus structured Verification Plan evidence, or an explicit human waiver.
- Accessibility regressions (contrast, focus visibility, touch-target) are blocking — they ship as
  unit tests against the design tokens, not as manual checks.

## C4 Architecture Model

The project maintains a structured C4 architecture model at `.agent/c4-model.json`. This file is the
canonical source of truth for the project overview and is read by the Product Sweet web UI.

### Schema rules
- `schemaVersion` must be `1`.
- `system` is the single root node (System Context level).
- `externalSystems` lists systems outside the project boundary.
- `containers` are the deployable units within the system boundary.
- `components` are grouped under a `containerId` to enable drill-down.
- Every node requires `id`, `name`, and `summary`. `technology`, `responsibilities`, `relatedFiles`,
  and `relationships` are optional.
- Each relationship has `targetId`, `label`, and `direction`
  (`outgoing` | `incoming` | `bidirectional`).

### Maintenance policy
- Any task that changes system boundaries, container responsibilities, integrations, storage, auth
  flow, deployment topology, or major component ownership **must** update `.agent/c4-model.json`.
- The task template includes an **Architecture Impact** checkpoint to enforce this.

## Toolchain

<!-- Replace these defaults with the actual toolchain once the framework is set up. -->

- **Structure:** flat single root package.json <!-- e.g. flat single root package.json, or pnpm workspace -->
- **Package manager:** npm
- **TypeScript:** tsconfig.json with `strict: true`
- **Testing:** vitest, run under `environment: "node"` — NOT jsdom. Astro pages render to a STRING on the server, so the exemplar renders one with `astro/container` and parses it with jsdom used as a LIBRARY (`new JSDOM(html).window.document`). A jsdom *environment* breaks esbuild, which Astro loads. `npm test`
- **Linting:** no linter is seeded for this framework — the pr-gate says so explicitly rather than skipping silently. Add one in its own change if you want style enforced
