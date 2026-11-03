---
title: "Project Secrets"
generated_by: "Product Sweet bootstrap (AI6P-249 / AI6P-311 — S7.3)"
generated_at: "2026-11-03"
bootstrap_id: "01M6FDAFZ72Z37MW4KQ2BCB8K9"
product_prefix: "productsweet"
---

# Project Secrets

Every secret slot the Product Sweet bootstrap provisioned for this project. Values are placeholders — replace them before the consuming code path reaches production.

SSM paths follow the per-tenant scheme `/productsweet/projects/productsweet-bootstrap-disposable-kpc/<secretName>` per canonical-checklist §F1.

> Generated at bootstrap. Re-run the post-bootstrap `agent:refresh-manifest-file` utility (out of scope for AI6P-311) to refresh after secret rotations.

## Platform-default secrets

Slots Product Sweet itself uses to operate against this project. The operator does not declare them — the bootstrap seeds them automatically. They render in the wizard read-only with a `platform-required` badge.

| Name | SSM path | Purpose | Follow-up task |
|---|---|---|---|
| `repo-token` | `/productsweet/projects//repo-token` | Product Sweet reads the project repo through this OAuth token (canonical-checklist §F4). | `PS-BCB8K9-007` |
| `webhook-secret` | `/productsweet/projects//webhook-secret` | Product Sweet verifies inbound GitHub webhooks with this HMAC secret (canonical-checklist §F5). | `PS-BCB8K9-008` |

**Rotation:** the F4 repo-token slot is filled by the tenant-credential surface (`rotateRepoToken` reveal-once flow); the F5 webhook-secret slot is filled by the inbound-webhook bootstrap on first sync. Until rotated, the placeholder value (`PLACEHOLDER:` prefix) makes a not-yet-rotated state self-documenting in any log that surfaces the value.

## User-declared secrets

Secrets the operator declared in the AI6P-283 wizard. Each row has a seeded "Supply value for `<name>`" follow-up task under `.kanban/backlog/`; the table below links each row to its follow-up by id.

_None declared._

## Reserved names

The wizard and the `secrets-placeholders-provisioned` handler both refuse the following names because they collide with GitHub-injected or AWS-injected env vars in the workflow runner:

- `GITHUB_TOKEN`
- `GITHUB_REPOSITORY`
- `AWS_REGION`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_SESSION_TOKEN`

## What you still need to supply

Walk `.kanban/backlog/` and complete every seeded "Supply value for `<name>`" task. The "Bootstrap follow-ups" epic groups them; closing them moves this project from "bootstrapped" to "live".
