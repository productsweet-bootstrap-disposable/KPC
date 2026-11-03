import { getByRole, queryByRole } from '@testing-library/dom';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';

import IndexPage from '../pages/index.astro';

// Exemplar test seeded by Product Sweet bootstrap (AI6P-2190).
//
// It exists so the whole chain — vitest config, the Astro container, jsdom, the
// `test` script, and the pr-gate step that runs it — is proven by the bootstrap's
// own first deploy, rather than by your first real task discovering it does not
// work. Keep it, extend it, or replace it with better tests; do not delete it and
// leave nothing.
//
// **`vitest run` exits non-zero when no test file matches**, so deleting this
// without replacing it turns your required check red rather than making it pass.
//
// **What jsdom cannot do:** there is no layout engine. Clipping, overflow,
// scrolling, element size and position are all unavailable — every measurement
// reads as zero. Assert on content, roles and behaviour here; verify anything
// geometric in a real browser.

/**
 * Render an `.astro` page and return a queryable document.
 *
 * Astro renders on the server, so a page is a **string** first — `renderToString`
 * is the whole of what a visitor receives. jsdom then turns that string into a
 * document you can query, which is why it is used here as a library rather than
 * as vitest's `environment` (see the note in vitest.config.ts — switching to the
 * jsdom environment breaks this outright).
 *
 * Returning the document rather than the raw HTML is what makes the assertions
 * below meaningful: `getByRole` computes the *accessible* name, which needs a real
 * DOM with a window attached. Asserting on the HTML string instead would pass for
 * markup no screen reader could navigate.
 *
 * Extract this into `src/test/render-page.ts` once you have a second page test.
 */
async function renderPage(Page: Parameters<AstroContainer['renderToString']>[0]) {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Page);
  return new JSDOM(html).window.document;
}

describe('index page', () => {
  it('renders the project heading', async () => {
    const doc = await renderPage(IndexPage);
    // Queried by ROLE and accessible name, which survives restyling and fails if
    // the heading stops being reachable to a screen reader.
    expect(
      getByRole(doc.body, 'heading', { name: 'KPC', level: 1 }),
    ).toBeInTheDocument();
  });

  it('renders a full document, not a body fragment', async () => {
    // `<title>` lives in `<head>`. Asserting on it proves the page was rendered
    // and parsed as a whole document — the check that would silently pass if the
    // harness ever started handling only `<body>` contents.
    const doc = await renderPage(IndexPage);
    expect(doc.title).toBe('KPC');
  });

  it('gives each test its own document', async () => {
    // Two renders must not share state. If they did, one test's markup would
    // satisfy the next test's query and the suite would pass having verified
    // nothing — the reason there is no shared `cleanup` to forget.
    const first = await renderPage(IndexPage);
    const second = await renderPage(IndexPage);
    expect(first).not.toBe(second);
    first.body.innerHTML = '';
    expect(queryByRole(first.body, 'heading')).toBeNull();
    expect(getByRole(second.body, 'heading', { level: 1 })).toBeInTheDocument();
  });

  it('has a real DOM, with a window attached', async () => {
    // Explicit rather than implied. `getByRole` resolves accessible names through
    // `window`, so a document parsed without one (for example by `DOMParser`)
    // throws "no window available" — a failure that reads as a broken query
    // rather than a broken harness. This asserts the property directly.
    const doc = await renderPage(IndexPage);
    expect(doc.defaultView).not.toBeNull();
    const el = doc.createElement('div');
    // Checked against the document's OWN constructor, not this module's realm.
    // jsdom elements live in a separate realm, so a cross-realm `instanceof` can
    // be false while the DOM works perfectly.
    expect(el).toBeInstanceOf(doc.defaultView!.HTMLElement);
    expect(el.tagName).toBe('DIV');
  });
});
