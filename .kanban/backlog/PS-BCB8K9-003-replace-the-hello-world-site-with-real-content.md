---
title: "Replace The Hello-World Site With Real Content"
id: "PS-BCB8K9-003"
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
  - "content"
related_files:
  - ".agent/knowledge.md"
comments: 0
attachments: 0
---

## Summary

The bootstrap shipped a `astro` hello-world site to `https://pending-first-deploy.example/`. Replace it with the
project's real homepage — the headline, the supporting copy, and any first-pass imagery — so the
site stops looking like a template.

## Problem Or Opportunity

A live site that says "Hello, world!" is worse than no site for any audience the URL is shared
with. This task is the on-ramp into actual content authoring.

## Why This Matters

Hosting + deploy + domain are wired up — every commit to `main` ships. But the user-visible content
is still the framework's default. Closing this task is the first time a real visitor would see real
content.

## Scope

- Replace the homepage hero / headline / body copy with real content.
- Replace the framework's default favicon and OG image with the project's brand assets.
- Confirm the page passes basic accessibility checks (heading hierarchy, alt text on every image,
  contrast ≥ 4.5:1 for body text — see the Product Sweet design system's Token-Contrast
  Guarantee, served by the agent).

## Out Of Scope

- The full information architecture for the rest of the site (about, contact, blog, etc.) — author
  fresh tasks for those.
- Design-system tuning beyond the homepage.

## Current State And Evidence

- The live URL is `https://pending-first-deploy.example/`.
- The framework is `astro`. Refer to the framework overlay in `.agent/knowledge.md >
  Architecture > Framework` for which files are where.

## Proposed Design / Approach

Author the homepage copy first, then commit framework changes. Keep the Product Sweet design
system's rules (served by the agent) in mind from the first commit — they are easier to apply
than to retrofit.

## Architecture Impact

No.

## Determinism Considerations

Content authoring. No ambient inputs.

## Implementation Plan

1. Replace homepage hero copy.
2. Replace framework default favicon + OG image.
3. Verify locally — `npm run dev` (or framework equivalent) — that the page renders.
4. Run the framework's lint + test scripts.
5. PR + merge.

## Verification Plan

- Local dev server renders the new homepage.
- The framework's lint + test scripts pass.
- The deploy workflow ships the change to `https://pending-first-deploy.example/`.
- Manual sweep: heading hierarchy, alt text, contrast.

## Questions

```yaml
- question: "Is there pre-existing brand copy / imagery to start from, or does this task author it from scratch?"
  status: open
  thread: []
```

## Documentation Update Plan

- `.agent/current-state.md`: under `Shipped Capabilities`, replace the "framework hello-world" line
  with a "real homepage" line.

## Risks / Dependencies / Open Questions

- **Risk: design drift.** The hello-world page might not exercise the design tokens; the first real
  page will. Resist using ad-hoc colours / sizes — pick from the design tokens.

## Completion Notes

Fill this in when the task is done.

- Outcome:
- Verification actually run:
- Documentation updated:
- Follow-up tasks created:

## Definition of Done Gate

1. The homepage at `https://pending-first-deploy.example/` shows real content.
2. Framework lint + test scripts pass on the final commit.
