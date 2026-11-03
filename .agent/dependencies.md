---
title: "Project Dependencies"
generated_by: "Product Sweet bootstrap (AI6P-249 / AI6P-311 — S7.3)"
generated_at: "2026-11-03"
framework: "astro"
bootstrap_id: "01M6FDAFZ72Z37MW4KQ2BCB8K9"
---

# Project Dependencies

Snapshot of every build-time / runtime dependency the Product Sweet bootstrap committed to this project, plus the AWS and GitHub services this project depends on.

The AWS account and region used at bootstrap time are recorded in `.agent/current-state.md`; consult that file rather than duplicating the values here so the two never drift apart.

> Generated at bootstrap. This file is a point-in-time snapshot, not a live mirror — if you add or remove dependencies later, update `package.json` and run the post-bootstrap `agent:refresh-manifest-file` utility (out of scope for AI6P-311; tracked separately).

## Framework

- **Framework:** Astro 5 (pinned at `^5.0`)
- **Language:** TypeScript
- **Package manager:** npm
- **Toolchain shape:** flat single root package.json

## Framework-required npm packages

These are installed by every Astro 5 project the bootstrap creates. The wizard surfaces them read-only with a `framework-required` badge.

| Package | Notes |
|---|---|
| `astro` | framework-required |
| `@astrojs/check` | framework-required |
| `typescript` | framework-required |

## User-declared npm extras

Extra packages the operator added in the AI6P-283 wizard's `DeclareSecrets` sub-state (S7.2). The bootstrap's executor filters wizard entries colliding with framework defaults before they reach `package.json`.

_None declared._

## AWS services this project uses

- **AWS Amplify** — hosting + first-party deploy pipeline.
- **AWS IAM** — plan + deploy roles assumed by the deploy workflow via OIDC.
- **AWS SSM Parameter Store** — per-project secret placeholders under `/productsweet/projects/productsweet-bootstrap-disposable-kpc/`.
- **AWS STS** — cross-account `AssumeRole` for the bootstrap orchestrator.

## GitHub services this project uses

- **GitHub Repositories** — the project lives in the bootstrap-created repo.
- **GitHub Actions** — `pr-gate.yml` (the always-on required check) + `deploy-low.yml` + `promote-<env>.yml` (+ `actionlint.yml`).
- **GitHub Actions Secrets** — sealed-box-encrypted runtime secrets injected into workflow runs.
- **GitHub Actions Variables** — non-sensitive runtime config (e.g. the deploy-role ARN).

## What you still need to supply

See `.agent/secrets.md` for the live list of secret placeholders. The seeded follow-up tasks under `.kanban/backlog/` carry the deep-link path for each placeholder; complete those before the project goes live.
