---
title: "Verify The Deploy Reaches The Live URL"
id: "PS-BCB8K9-002"
status: backlog
template_type: implementation-task
parent_task_id: "PS-BCB8K9-001"
backlog_state: refining
created: "2026-11-03"
updated: "2026-11-03"
priority: high
owner: "productsweet-bootstrap-disposable"
source: "Product Sweet bootstrap (AI6P-249 / AI6P-254 catalog)"
tags:
  - "bootstrap"
  - "verify"
  - "deploy"
related_files:
  - ".agent/current-state.md"
comments: 0
attachments: 0
---

## Summary

Confirm that an end-to-end push to `main` actually deploys to `https://pending-first-deploy.example/` and that the live URL
serves the framework's hello-world page.

## Problem Or Opportunity

The bootstrap reported "first deploy verified" against the synthetic bootstrap commit, but the
project hasn't yet had a real human-authored commit go through the workflow. This task closes the
"the workflow runs because of the bootstrap" loop versus "the workflow runs because of normal
authorship" loop.

## Why This Matters

If the deploy workflow only runs when the bootstrap pushes the synthetic commit (e.g. wrong path
filter, wrong branch, missing secret), the project is broken in a way that won't surface until the
first real change. Verify it now while the live URL and Amplify console are fresh.

## Scope

- Make a trivial real commit to `main` (e.g. a `docs:` README tweak).
- Watch the GitHub Actions run go green.
- Confirm Amplify reports a successful RELEASE job.
- HTTPS-GET `https://pending-first-deploy.example/` and confirm the response code is 200 and the body changed.

## Out Of Scope

- Tuning the build spec for performance.
- Changing the workflow.

## Current State And Evidence

- Live URL: `https://pending-first-deploy.example/`
- Amplify App ID: see `.agent/current-state.md` (filled in once the bootstrap reaches `complete`)
  or repo Settings → Variables → Actions → `PRODUCTSWEET_AMPLIFY_APP_ID`.
- Repo: `https://github.com/productsweet-bootstrap-disposable/KPC`
- Bootstrap audit checklist references — see AI6P-250 §C9 (Amplify reports `AVAILABLE`) and §D3
  (HTTPS GET serves hello-world).

## Proposed Design / Approach

Push a one-line README change. Wait for green. Visit the URL.

## Architecture Impact

No. Read-only verification.

## Determinism Considerations

Network + GitHub Actions runner availability. Not deterministic; treat any flake as suspicious and
investigate before retrying.

## Implementation Plan

1. Make a trivial change to `README.md`.
2. Commit + push to `main`.
3. Watch the deploy workflow at GitHub → Actions.
4. Watch Amplify → your project's app → `main` for a new RELEASE job (the app id is in
   `.agent/current-state.md` or the `PRODUCTSWEET_AMPLIFY_APP_ID` repo variable).
5. HTTPS-GET `https://pending-first-deploy.example/` and confirm the README change is reflected in the served HTML (or
   nearby — depending on framework, the README might not render to the live page directly; in that
   case make a more visible content change).

## Verification Plan

- GitHub Actions run is green.
- Amplify RELEASE job reports `SUCCEED`.
- `curl -sSf https://pending-first-deploy.example/` returns 200.
- The visible content reflects the new commit.

## Questions

```yaml
- question: "Is the live URL right? If the bootstrap took the *.amplifyapp.com fallback per AI6P-249 Q5, also confirm that the seeded `Bind a custom domain` task is on the backlog."
  status: open
  thread: []
```

## Documentation Update Plan

- `.agent/current-state.md`: when this task is `done`, increment whatever counter the project uses
  for shipped capabilities and add an evidence link to the green workflow run.

## Risks / Dependencies / Open Questions

- If the workflow fails on the first real push, do not bypass — diagnose. Common causes: missing
  GitHub repo secret, IAM trust mismatch, branch path filter excluding the change.

## Completion Notes

Fill this in when the task is done.

- Outcome:
- Verification actually run:
- Documentation updated:
- Follow-up tasks created:

## Definition of Done Gate

1. End-to-end deploy reproduced from a real commit.
2. Live URL responds 200 and shows the change.
