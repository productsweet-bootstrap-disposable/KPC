---
title: "Configure Analytics"
id: "PS-BCB8K9-004"
status: backlog
template_type: implementation-task
parent_task_id: "PS-BCB8K9-001"
backlog_state: refining
created: "2026-11-03"
updated: "2026-11-03"
priority: medium
owner: "productsweet-bootstrap-disposable"
source: "Product Sweet bootstrap (AI6P-249 / AI6P-254 catalog)"
tags:
  - "bootstrap"
  - "analytics"
  - "observability"
related_files:
  - ".agent/knowledge.md"
comments: 0
attachments: 0
---

## Summary

Decide whether this site needs analytics, and if so, install the chosen provider.

## Problem Or Opportunity

The site is live with no visibility into who visits, which pages they read, or where they bounce.
Without that signal you cannot tell whether the homepage works or whether a specific page is
broken on a specific browser.

## Why This Matters

Analytics is a one-time setup that pays off every week thereafter. Doing it now while the rest of
the site is empty avoids retrofitting markup later.

## Scope

- Pick a privacy-respecting analytics provider — Plausible, Fathom, Umami, GoatCounter — that
  satisfies the project's privacy stance. Default recommendation: **Plausible** (no cookies, no
  personal data, GDPR-friendly out of the box).
- Add the provider's snippet to the framework's root layout.
- Verify a hit appears in the provider's dashboard within a few minutes of deploying.

## Out Of Scope

- A consent-management platform. Cookie-free providers (Plausible, Fathom, Umami, GoatCounter) do
  not need one. **If you pick Google Analytics or any cookie-based provider, you own the consent
  banner and the regional gating that goes with it** — author a follow-up task before shipping.
- Custom event tracking. Author a follow-up task once the page set is real.

## Framework-specific recommendation

For `astro`, install the snippet in the framework's canonical layout slot:
- **Astro:** add the script in `src/layouts/Layout.astro` (or whichever layout the homepage extends).
- **Next.js:** add the snippet to `app/layout.tsx`; consider the framework-recommended provider
  package if one exists (e.g. `next/script` with `strategy="afterInteractive"`).
- **React + Vite:** add the snippet to `index.html` (build-time-rendered, so the HTML serves the
  script even before hydration).
- **Eleventy:** add the snippet to `_includes/base.njk` (or the equivalent layout for the chosen
  template engine).

## Current State And Evidence

- No analytics installed today.
- Live URL: `https://main.d3jvz8g9mohfwa.amplifyapp.com`.

## Proposed Design / Approach

Pick a provider. Sign up. Drop the snippet in the layout. Push. Verify a hit lands.

## Architecture Impact

No (small dependency / external system; not a new boundary).

## Determinism Considerations

Third-party provider availability. Treat any analytics outage as non-fatal; never block render on
the analytics script.

## Implementation Plan

1. Pick a provider (default: Plausible).
2. Sign up + obtain the site identifier.
3. Add the snippet to the framework's root layout.
4. Push to `main`.
5. Visit `https://main.d3jvz8g9mohfwa.amplifyapp.com` from a browser; confirm a hit lands in the provider's dashboard.

## Verification Plan

- Provider dashboard shows hits within a few minutes of pushing.
- Lighthouse / Pagespeed shows no significant regression in performance scores.

## Questions

```yaml
- question: "Privacy stance — does this site need a cookie banner? If yes, pick Google Analytics + a CMP and budget the time accordingly. If no, pick a cookie-free provider."
  status: open
  thread: []
- question: "Is there a parent organisation analytics property the project should report into, or is this a standalone site?"
  status: open
  thread: []
```

## Documentation Update Plan

- `.agent/knowledge.md > Architecture`: add a one-line note naming the analytics provider and where
  the snippet lives.

## Risks / Dependencies / Open Questions

- **Risk: provider lock-in.** Avoid building dashboards / reports against a provider's proprietary
  query layer until the provider is committed.
- **Risk: consent regression.** If a future task adds a cookie-based provider, the consent surface
  becomes mandatory.

## Completion Notes

Fill this in when the task is done.

- Outcome:
- Verification actually run:
- Documentation updated:
- Follow-up tasks created:

## Definition of Done Gate

1. Provider snippet committed and shipped to `https://main.d3jvz8g9mohfwa.amplifyapp.com`.
2. Provider dashboard records hits.
