# KPC

A Astro 5 site, bootstrapped by Product Sweet (AI6P-249).

- **Live:** https://pending-first-deploy.example/
- **Framework:** Astro 5
- **Hosting:** AWS Amplify (account `874373490779`)
- **Managed by:** Product Sweet bootstrap (AI6P-249)

## Local development

```bash
npm ci
npm run dev      # local dev server
npm run build    # produce dist/ (deployable static output)
npm run preview  # serve the built output locally
```

## Testing

```bash
npm test             # run the suite once (what CI runs)
npm run test:watch   # re-run on change
npm run typecheck    # astro check — typechecks .astro templates too
npm run ci:verify    # everything the merge gate runs, in one command
```

`vitest` with jsdom, seeded by the bootstrap. `src/test/index-page.test.ts` is a
working example: it renders `src/pages/index.astro` through Astro's container and
queries the result by accessible role. Copy its `renderPage` helper to test your
own pages.

Two things worth knowing before you change the setup:

- **The suite runs under `environment: 'node'`, not `jsdom`, on purpose.** Astro
  renders on the server, so a page is a *string* before it is ever a document —
  tests parse that string with `new JSDOM(html)`. Switching to the jsdom
  environment breaks page tests with an error that mentions neither Astro nor
  jsdom; `vitest.config.ts` explains why in full.
- **jsdom has no layout engine.** Clipping, overflow, scrolling, element size and
  position all read as zero, so a green suite says nothing about whether the page
  *looks* right. Assert on content, roles and behaviour here; check anything
  geometric in a real browser.

No linter is seeded for Astro — `npm run typecheck` covers `.astro` templates, and
the pull-request gate says out loud that there is no linter rather than pretending
one ran.

### Before you merge a dependency bump

The harness is coupled to Astro more tightly than a normal test setup, because
`vitest.config.ts` calls `getViteConfig()` from `astro/config` and the exemplar
test imports `astro/container`. Both are Astro internals a major bump may move.
So the majors below were **measured**, not inferred (AI6P-2234, 2026-07-29 — the
full `ci:verify` triad of `typecheck`, `test` and `build` on each):

| astro | vitest | resolved `vite` copies | result |
|---|---|---|---|
| 5.18.2 | 3.2.7 (the pin) | 1 | 4 tests pass |
| 6.4.8 | 3.2.7 | 1 | 4 tests pass |
| 7.1.5 | 3.2.7 | **3 (nested)** | 4 tests pass |
| 7.1.5 | 4.1.10 | 1 | 4 tests pass |

**Astro 7 needs `vitest@^4` in the same change.** It works with the seeded
`vitest@3.2.7`, but only by npm nesting two extra copies of `vite` — the exact
shape that produced "no tests, exit 1" once already (AI6P-2203) and that the
platform's own duplicate detector flags as a hazard. Bump them together, or not
at all.

Watch the **test count**, not the exit code. A `vitest.config.ts` that fails to
load reports *no tests*, which under some configurations still exits 0 — a green
check that verified nothing. The seeded suite is 4 tests.

## Deployment

Pushes to `main` trigger `.github/workflows/deploy-low.yml`, which builds the
site and triggers an AWS Amplify `RELEASE` job to the low environment. Higher
environments are promoted by the `promote-<env>.yml` workflows — dispatched by
the Product Sweet webapp with the reviewed commit pinned, never on push. PRs
are gated by the always-on `.github/workflows/pr-gate.yml` (the single required
status check). It classifies the diff in-job: changes only under `.agent/`,
`.kanban/`, or a root `*.md` run a fast content lane (lint + typecheck + test,
no build); anything else runs the full build lane.

## Replacing the hello-world content

This is a bootstrap-seeded hello-world site. Replace the contents of
`src/pages/` and `public/` with your own content. The seeded
"Replace the hello-world site with real content" task in `.kanban/backlog/`
walks the steps.
