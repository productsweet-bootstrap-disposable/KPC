import { getViteConfig } from 'astro/config';

// Test harness seeded by Product Sweet bootstrap (AI6P-2190).
//
// `getViteConfig` is Astro's own vitest integration. It matters rather than being
// a stylistic choice: it loads `astro.config.mjs`, so the aliases and
// integrations your pages already rely on resolve the same way in a test as they
// do in a build. A hand-rolled `defineConfig` from `vitest/config` works right up
// until the first test that imports a page using an integration, and then fails
// in a way that reads as a broken test rather than a missing config.
export default getViteConfig({
  test: {
    // **`node`, deliberately — do not change this to `jsdom`.**
    //
    // Astro renders on the server: a page is a *string* before it is ever a
    // document. Tests therefore render to a string and parse it with jsdom as a
    // LIBRARY (`new JSDOM(html)`), which is what `src/test/*.test.ts` does. That
    // is not a workaround, it is the shape of the thing being tested.
    //
    // Switching to `environment: 'jsdom'` breaks page tests outright, and the
    // error names neither Astro nor jsdom. jsdom installs its own `Uint8Array`,
    // so a typed array made anywhere else fails `instanceof Uint8Array`; esbuild
    // asserts exactly that invariant at import time and throws "your JavaScript
    // environment is broken"; and Astro loads esbuild the moment you import
    // `astro/container`. Every page test then fails to *collect*.
    //
    // If you add a client-side island (React, Vue, Svelte) and want ambient
    // browser globals for it, put `// @vitest-environment jsdom` at the top of
    // that one file. Island component tests do not import `astro/container`, so
    // they are unaffected by the above.
    environment: 'node',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.ts'],
    // Report coverage without enforcing a threshold. A threshold on a project
    // with one exemplar test fires immediately and teaches the tenant to disable
    // it on day one — which is worse than no threshold at all. Add one when
    // there is a suite worth defending.
    coverage: {
      reporter: ['text-summary'],
    },
  },
});
