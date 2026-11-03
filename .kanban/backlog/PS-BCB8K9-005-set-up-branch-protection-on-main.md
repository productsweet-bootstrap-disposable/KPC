---
title: "Set Up Branch Protection On `main`"
id: "PS-BCB8K9-005"
status: backlog
template_type: implementation-task
parent_task_id: "PS-BCB8K9-001"
backlog_state: refining
created: "2026-11-03"
updated: "2026-11-03"
priority: high
owner: "productsweet-bootstrap-disposable"
source: "Product Sweet bootstrap (AI6P-249 / AI6P-254 catalog); cites AI6P-098"
tags:
  - "bootstrap"
  - "github"
  - "branch-protection"
  - "ci-cd"
related_files:
  - ".github/workflows"
comments: 0
attachments: 0
---

## Summary

Apply GitHub branch protection to `main` so that the deploy workflow's required-status-checks
gates every change rather than relying on author discipline. Cites AI6P-098 (Branch Protection on
main) — the same posture this repo took.

## Problem Or Opportunity

The repo currently allows direct pushes to `main`. Anyone with write access can land a change that
fails CI; the deploy workflow will then fail in production rather than at PR time. Branch
protection moves the gate left.

## Why This Matters

The deploy workflow is the only release path (Amplify auto-build is disabled). If a change can
land on `main` without passing the workflow's required checks, the next push silently breaks
production. Branch protection prevents that class of failure.

## Scope

- Enable branch protection on `main`.
- Require pull request reviews (at least one approving review for shared repos; this rule is
  optional for solo / personal-account projects but recommended).
- Require status checks to pass before merging — the always-on `pr-gate` check (the bootstrap
  already provisions a Ruleset requiring it; this task confirms / hardens that posture).
  **Never require a path-filtered check** (it stays "Expected — waiting for status" and wedges any
  PR whose paths don't trigger it) — only the always-on `pr-gate` is safe to require.
- Require branches to be up to date before merging.
- Require linear history (squash or rebase merges only — no merge commits).
- Apply restrictions to administrators (so the protection cannot be silently bypassed).

## Out Of Scope

- Required signed commits. Optional and project-dependent.
- CODEOWNERS rules. Optional and project-dependent.
- Status checks beyond the always-on `pr-gate` workflow — author follow-ups when other CI surfaces land.

## Current State And Evidence

- Repo: `https://github.com/productsweet-bootstrap-disposable/KPC`.
- The deploy workflow `.github/workflows/deploy-low.yml` is the only release path; without
  protection, any push to `main` triggers a release.
- Cites AI6P-098 (Branch Protection on main) and AI6P-250 §B7 (audit checklist).

## Proposed Design / Approach

Apply via GitHub UI or API. Recorded the chosen protection set in `.agent/knowledge.md` so future
agents know what's expected.

## Architecture Impact

No (org-level configuration; not in C4 scope).

## Determinism Considerations

GitHub UI / API. Setting is persistent.

## Implementation Plan

1. Open `https://github.com/productsweet-bootstrap-disposable/KPC/settings/branches`.
2. Add a rule for `main`.
3. Enable: require PR reviews, require status checks (the always-on `pr-gate`), require branches up
   to date, require linear history, apply to administrators.
4. Save.
5. Verify by opening a PR and confirming the gate is enforced.

## Verification Plan

- Open a PR with a known-failing change. Confirm the merge button is gated.
- Open a PR with a passing change but stale branch. Confirm the "update branch" prompt fires.
- (Optional) Use the GitHub API to dump the branch-protection JSON and pin it in this task's
  Completion Notes for auditability.

## Questions

```yaml
- question: "Solo project or shared repo? If solo, the PR-review requirement is optional and may slow you down without adding signal — still set the status-check + linear-history rules."
  status: open
  thread: []
- question: "Are there other status checks (CodeQL, secret scanning, custom workflow) that should also be required? Author follow-up tasks if so."
  status: open
  thread: []
```

## Documentation Update Plan

- `.agent/knowledge.md > Key Constraints`: add a one-line note that `main` is protected by the
  rules listed above.

## Risks / Dependencies / Open Questions

- **Risk: overly strict rules slow solo work.** Solo projects can skip the PR-review requirement;
  status checks + linear history alone catch the worst failure modes.

## Completion Notes

Fill this in when the task is done.

- Outcome:
- Verification actually run:
- Documentation updated:
- Follow-up tasks created:

## Definition of Done Gate

1. `main` shows a protected-branch icon in GitHub.
2. A PR with failing CI cannot be merged.
