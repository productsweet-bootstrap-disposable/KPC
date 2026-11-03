// Vitest setup — seeded by Product Sweet bootstrap (AI6P-2190).
//
// `@testing-library/jest-dom` adds the DOM matchers (`toBeInTheDocument`,
// `toHaveTextContent`, …). They work on elements from any jsdom document, which
// is what lets the page tests query a document they constructed themselves
// rather than an ambient global one.
//
// There is deliberately no `cleanup` here. Each test builds its own `JSDOM` and
// drops it, so there is no shared document for one test's markup to leak into
// the next — the failure mode a React harness needs `cleanup` to prevent cannot
// arise. See the note on `environment: 'node'` in vitest.config.ts.
import '@testing-library/jest-dom/vitest';
