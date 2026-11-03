---
title: "Bootstrap Follow-ups"
id: "PS-BCB8K9-001"
status: backlog
template_type: implementation-task
kind: epic
backlog_state: refining
created: "2026-11-03"
updated: "2026-11-03"
priority: medium
owner: "productsweet-bootstrap-disposable"
source: "Product Sweet bootstrap (AI6P-249)"
tags:
  - "bootstrap"
  - "follow-up"
related_files:
  - ".agent/current-state.md"
  - ".agent/knowledge.md"
comments: 0
attachments: 0
---

## Summary

Parent epic for the obvious next moves after the Product Sweet bootstrap reaches `complete`. The
bootstrap landed hosting, the deploy workflow, the `.agent/` knowledge folder, and a hello-world
site — none of that is yet a real project. This epic groups the follow-ups every freshly bootstrapped
website needs.

## Problem Or Opportunity

The bootstrap is intentionally narrow — it creates a working shell, not a finished site. Without a
seeded backlog, the user lands at a dead end with hosting wired up but no obvious next move. This
epic is the on-ramp into the normal Product Sweet refine → todo → doing → done workflow.

## Why This Matters

A bootstrapped project with an empty kanban board is unusable. The seeded children give the user
explicit next moves: verify the deploy reaches the live URL, replace the hello-world content,
configure analytics, set branch protection, and (conditionally) bind a custom domain or supply
real values for any placeholder secrets. Each child can be closed without doing the work — none of
the seeds are mandatory — but each one represents a known follow-up that would otherwise be
forgotten.

## Scope

In scope: refine and (where the user agrees) implement the seeded children.

Out of scope: framework-level customisation, real content authoring, design-system tuning. Those
are project-specific work the user authors fresh tasks for.

## Current State And Evidence

- The bootstrap left `current-state.md > Bootstrap Decisions` populated with the framework, repo,
  domain, AWS account, owner, feature-flag id, and bootstrap id — start there.
- The first deploy reached `https://pending-first-deploy.example/` (verified during bootstrap completion).
- All seeded children carry `backlog_state: refining` so review is required before they enter
  `todo`.

## Proposed Design / Approach

Refine the children one at a time. For each:

1. Open the seed; confirm the recommendation still applies to your project.
2. If it does — flip `backlog_state` to `ready`, then promote to `todo` when you have a concrete
   implementation plan.
3. If it does not — close the seed with a note explaining why.

## Architecture Impact

No. Refining the seeded backlog does not change system boundaries. Children that involve
infrastructure changes (e.g. branch protection, custom domain) re-evaluate this on their own.

## Determinism Considerations

Refinement is a human / agent activity over markdown files. No ambient inputs.

## Stages

```yaml
- stage_id: S1
  title: "Verify and replace placeholder content"
  status: designed
  summary: "Confirm the deploy actually reaches the live URL and start replacing the hello-world content with the real site."
  child_task_ids:
    - "PS-BCB8K9-002"
    - "PS-BCB8K9-003"
  depends_on_stage: []

- stage_id: S2
  title: "Harden the project for real use"
  status: stub
  summary: "Configure analytics, set branch protection, bind a custom domain (if needed), supply values for placeholder secrets."
  child_task_ids:
    - "PS-BCB8K9-004"
    - "PS-BCB8K9-005"
    - "PS-BCB8K9-006"
    - "PS-BCB8K9-007"
    - "PS-BCB8K9-008"
  depends_on_stage:
    - S1
```

## Verification Plan

This epic is verified by its children — when every child is `closed` or `done`, the epic can flip
to `done`.

## Questions

```yaml
- question: "Are there project-specific follow-ups the bootstrap could not have known about (custom auth, third-party integrations, hosted form services)? If yes, author fresh tasks under this epic."
  status: open
  thread: []
```

## Documentation Update Plan

- `.agent/current-state.md`: when this epic moves to `done`, flip `phase` from `bootstrapping` to
  `live` (the bootstrap may have already done this — confirm).
- `.agent/knowledge.md`: as the project takes shape, fill in the `<!-- -->` placeholders.

## Risks / Dependencies / Open Questions

- **Risk: seeds go stale.** Each seed cites the source AI6P task that justifies it; if that task
  changes, revisit the seed. Close seeds that no longer apply rather than leaving them open.
- **Risk: seeds are too opinionated.** Each child is `backlog_state: refining` — close any seed
  the project does not need; the bootstrap deliberately does not move children to `todo`.

## Completion Notes

Fill this in when the epic is closed.

- Outcome:
- Verification actually run:
- Documentation updated:
- Follow-up tasks created:

## Definition of Done Gate

This epic cannot transition to `status: done` until every child is closed (`status: done` or
`backlog_state: closed`).
