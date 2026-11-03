---
title: "Bind A Custom Domain"
id: "PS-BCB8K9-006"
status: backlog
template_type: implementation-task
parent_task_id: "PS-BCB8K9-001"
backlog_state: refining
created: "2026-11-03"
updated: "2026-11-03"
priority: medium
owner: "productsweet-bootstrap-disposable"
source: "Product Sweet bootstrap (AI6P-249 / AI6P-254 catalog); fired because the bootstrap took the *.amplifyapp.com fallback per AI6P-249 Q5"
tags:
  - "bootstrap"
  - "domain"
  - "route53"
  - "amplify"
related_files:
  - ".agent/current-state.md"
  - ".agent/c4-model.json"
comments: 0
attachments: 0
---

## Summary

The bootstrap could not bind a custom domain at provisioning time — no Route53 hosted zone was
available — and took the `*.amplifyapp.com` fallback per AI6P-249 Q5. The site is currently served
at `https://main.d3jvz8g9mohfwa.amplifyapp.com` (the Amplify default URL). When a hosted zone is available, bind the chosen
custom domain.

## Problem Or Opportunity

`*.amplifyapp.com` URLs are fine for staging but wrong for a public site — they look unbranded and
they pin the site to AWS's TLD rather than the project's. Binding a custom domain is a one-time
setup that pays off forever.

## Why This Matters

A real domain is part of looking like a real project. Search-engine indexing, social-share previews,
and inbound links all key off the canonical hostname; the longer the site lives at the
`*.amplifyapp.com` URL, the more rework when the domain finally lands.

## Scope

- Confirm or create a Route53 hosted zone for the chosen parent domain.
- Use the AWS Amplify console (or the Amplify domain-association API) to bind the chosen
  subdomain — or apex — to the Amplify app.
- Wait for ACM certificate issuance + DNS verification.
- Confirm the new URL serves the same content as `https://main.d3jvz8g9mohfwa.amplifyapp.com` over HTTPS.
- Update `.agent/current-state.md > Bootstrap Decisions > Custom Domain` with the new value and
  flip `c4-model.json` to add the `aws-route53` external system if it was omitted at bootstrap.

## Out Of Scope

- Email DNS records (SPF, DKIM, DMARC). Author a follow-up if the project sends mail from this
  domain.
- Apex-vs-subdomain SEO redirects. Decide once the domain is live.

## Current State And Evidence

- Bootstrap took the `*.amplifyapp.com` fallback per AI6P-249 Q5.
- Live URL today: `https://main.d3jvz8g9mohfwa.amplifyapp.com`.
- Amplify App ID: see `.agent/current-state.md` (filled in once the bootstrap reaches `complete`)
  or repo Settings → Variables → Actions → `PRODUCTSWEET_AMPLIFY_APP_ID`.
- AWS Account: `874373490779`, region `ap-southeast-2`.
- Pattern reference: AI6P-027 A5 (Route53 reuse) — the AI6P repo did exactly this.

## Proposed Design / Approach

Use the Amplify-managed domain-association flow rather than hand-rolling DNS records — Amplify
handles the certificate, the validation records, and the apex-vs-subdomain mapping in one go.

## Architecture Impact

Yes (small) — adds Route53 as an external system. Update `.agent/c4-model.json` accordingly.

## Determinism Considerations

DNS propagation is asynchronous. Allow up to ~24h for full propagation; ACM validation usually
completes within minutes.

## Implementation Plan

1. Decide the domain — apex (`example.com`) or subdomain (`www.example.com`).
2. Confirm a Route53 hosted zone exists; create one if not (and update the registrar's NS records).
3. Open Amplify console → app → Domain management → Add domain.
4. Pick the hosted zone; pick the subdomain mapping.
5. Wait for status `AVAILABLE`.
6. HTTPS-GET the new URL; confirm 200 + same content as `https://main.d3jvz8g9mohfwa.amplifyapp.com`.
7. Update `.agent/current-state.md` and `.agent/c4-model.json`.

## Verification Plan

- Amplify reports `AVAILABLE` for the new domain mapping.
- `curl -sSf https://<new-domain>/` returns 200 and serves the same content as `https://main.d3jvz8g9mohfwa.amplifyapp.com`.
- ACM certificate is valid (no browser warning).
- `dig <new-domain>` resolves to a CloudFront / Amplify edge.

## Questions

```yaml
- question: "Apex (`example.com`) or subdomain (`www.example.com`)? Subdomain is simpler — apex requires Route53 alias records and tighter ACM coordination."
  status: open
  thread: []
- question: "Should the *.amplifyapp.com URL stay live as a staging surface, or should it be retired once the custom domain is up? Default: keep both; staging URLs cost nothing."
  status: open
  thread: []
```

## Documentation Update Plan

- `.agent/current-state.md`: update `Bootstrap Decisions > Custom Domain` and `Live URL`.
- `.agent/c4-model.json`: add `aws-route53` to `externalSystems` if absent; add a relationship from
  the system to `aws-route53`.

## Risks / Dependencies / Open Questions

- **Risk: registrar lock-in.** If the parent domain is registered elsewhere, you need control of
  the NS records — confirm before starting.
- **Risk: ACM validation stuck.** Most often caused by stale CAA records on the parent domain;
  check before retrying.

## Completion Notes

Fill this in when the task is done.

- Outcome:
- Verification actually run:
- Documentation updated:
- Follow-up tasks created:

## Definition of Done Gate

1. New URL serves 200 over HTTPS with a valid certificate.
2. `.agent/current-state.md` and `.agent/c4-model.json` reflect the new domain.
