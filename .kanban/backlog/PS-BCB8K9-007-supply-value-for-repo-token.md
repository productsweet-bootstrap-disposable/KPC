---
title: "Supply Value For `repo-token`"
id: "PS-BCB8K9-007"
status: backlog
template_type: implementation-task
parent_task_id: "PS-BCB8K9-001"
backlog_state: refining
created: "2026-11-03"
updated: "2026-11-03"
priority: high
owner: "productsweet-bootstrap-disposable"
source: "Product Sweet bootstrap (AI6P-249 / AI6P-254 catalog); fired because the project declared `repo-token` and the bootstrap created an SSM placeholder per AI6P-249 Q6"
tags:
  - "bootstrap"
  - "secrets"
  - "ssm"
related_files:
  - ".agent/knowledge.md"
comments: 0
attachments: 0
---

## Summary

The project declared a runtime / build-time secret named `repo-token`. The bootstrap created
an SSM Parameter Store placeholder at `/productsweet/projects//repo-token` (tagged
`productsweet:secret-state=placeholder`) so the project's IAM grants and code paths exist, but the
parameter currently holds a placeholder string — not the real value. Replace it before any code
that depends on `repo-token` reaches production.

## Problem Or Opportunity

A code path that reads `repo-token` will currently see a placeholder and either fail loudly
(best case — visible bug at deploy time) or behave wrongly in a way that only surfaces when a real
visitor hits the affected feature (worst case — silent regression).

## Why This Matters

Placeholder secrets are a known foot-gun. The `productsweet:secret-state=placeholder` tag exists so
operators can find every placeholder via `aws resourcegroupstaggingapi get-resources`, but the tag
only helps if someone actually runs the query before shipping.

## Scope

- Obtain the real value for `repo-token` from the relevant source (third-party vendor portal,
  internal credential store, etc.).
- `aws ssm put-parameter --name /productsweet/projects//repo-token --type SecureString --overwrite --value '<real-value>'`
- Remove the `productsweet:secret-state=placeholder` tag (`aws ssm remove-tags-from-resource` or
  `aws resourcegroupstaggingapi untag-resources`).
- Confirm the consuming code path actually reads the new value (run the relevant build /
  integration test / smoke check).

## Out Of Scope

- Credential rotation policy. Decide and document separately once the real value lands.
- Cross-environment secret strategy (separate secrets per env). Author a follow-up if the project
  needs more than the bootstrap's single SSM path.

## Current State And Evidence

- Secret name: `repo-token`
- SSM path: `/productsweet/projects//repo-token`
- Purpose: `Product Sweet reads the project repo through this OAuth token (canonical-checklist §F4).`
- AWS Account: `874373490779`, region `ap-southeast-2`.
- Bootstrap left the parameter with a placeholder string and the
  `productsweet:secret-state=placeholder` tag attached.

## Proposed Design / Approach

`aws ssm put-parameter --overwrite` is sufficient. Do **not** delete-and-recreate — that briefly
breaks the IAM grants attached to the parameter ARN.

## Architecture Impact

No.

## Determinism Considerations

The real value is sensitive — never paste it into a chat, a PR, or a log. Use `--cli-input-json` or
read from a local file that is `git`-ignored.

## Implementation Plan

1. Obtain the real value from the source of truth.
2. `aws ssm put-parameter --overwrite --name /productsweet/projects//repo-token --type SecureString --value '<real>'`
3. Remove the `productsweet:secret-state=placeholder` tag.
4. Re-run the consuming code path / build / smoke check.
5. Confirm the live site serves the affected feature without errors.

## Verification Plan

- `aws ssm get-parameter --name /productsweet/projects//repo-token --with-decryption` returns the real value (do
  not log the value itself — assert non-empty + length-or-prefix matches expectation).
- The `productsweet:secret-state=placeholder` tag is no longer present:
  `aws ssm list-tags-for-resource --resource-type Parameter --resource-id /productsweet/projects//repo-token`.
- The consuming code path's smoke check / build / integration test passes.

## Questions

```yaml
- question: "Where is the canonical source of truth for `repo-token`? Document it in `.agent/knowledge.md` so the next rotation does not require re-discovery."
  status: open
  thread: []
- question: "Is rotation expected? If yes, set a calendar reminder and decide whether to encode the rotation as a follow-up task."
  status: open
  thread: []
```

## Documentation Update Plan

- `.agent/knowledge.md > Key Constraints > Secrets`: add a one-line entry naming the secret, its
  source of truth, and its rotation cadence (if any).

## Risks / Dependencies / Open Questions

- **Risk: secret leaked in logs.** Confirm the consuming code path does not log the value (a
  surprising number do). If it does, fix that before the real value lands.
- **Risk: placeholder shipped.** The `productsweet:secret-state=placeholder` tag is the
  early-warning system; do not remove the tag without first replacing the value.

## Completion Notes

Fill this in when the task is done.

- Outcome:
- Verification actually run:
- Documentation updated:
- Follow-up tasks created:

## Definition of Done Gate

1. SSM parameter holds the real value.
2. The `productsweet:secret-state=placeholder` tag is removed.
3. The consuming code path passes its smoke check.
