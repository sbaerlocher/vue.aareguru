# AGENTS.md — vue.aareguru

## Overview

Vue 3 component library that displays the current Aare river temperature from the
[Aareguru API](https://aare.guru). Published to npm as `vue.aareguru`.

- Main component: `src/components/AareGuru.vue` (`<script setup lang="ts">`)
- Library entry: `src/index.ts` — default export `AareGuru`, named exports
  `useCities`, `useHistory`, `useForecast` plus the public types
- Package version, tool versions and peer dependencies: see `package.json`

## Structure

```text
src/
  components/      AareGuru.vue, AareGuru.stories.ts, Showcase.mdx
  composables/     useCities.ts, useHistory.ts, useForecast.ts, index.ts, composables.stories.ts
  types/           index.d.ts (public types)
  index.ts         library entry
tests/
  unit/            Vitest specs (happy-dom)
  browser/         Vitest browser specs (Playwright, Chromium)
.storybook/        Storybook configuration
scripts/           install-hooks.mjs (git hook installer)
.github/workflows/ pull-request.yml, tag.yml, weekly-security.yml
lefthook.yml       git hooks
vite.config.ts     library build
vitest.config.ts   test projects `unit` and `browser`
eslint.config.js   ESLint flat config
.prettierrc.yml    Prettier config
```

Leftovers not used by any `package.json` script: `src/App.vue`, `src/main.ts` and
`index.html` (old demo entry, served by plain `vite` on port 8080 via `server.port` in
`vite.config.ts`) and `vitest.workspace.ts` (ignored by the current Vitest; the test
projects come from `vitest.config.ts`).

## Commands

The repo uses pnpm (pinned via `packageManager` in `package.json`).

```bash
pnpm install          # install dependencies, installs git hooks via `prepare`
pnpm dev              # Storybook on http://localhost:6006
pnpm test             # Vitest project `unit` (happy-dom)
pnpm test:browser     # Vitest project `browser` (Playwright, Chromium)
pnpm test:coverage    # unit tests with coverage
pnpm typecheck        # vue-tsc --noEmit
pnpm lint             # ESLint on src/ and tests/
pnpm format:check     # Prettier check
pnpm validate         # format:check + typecheck + lint + test
pnpm build            # library bundle + type declarations into dist/
pnpm build:storybook  # static Storybook build
```

## Git hooks

Defined in `lefthook.yml`, installed by the `prepare` script
(`scripts/install-hooks.mjs`):

- pre-commit: Prettier and ESLint (`--fix`) on staged files
- pre-push: `pnpm typecheck` and `pnpm test`

## CI/CD

All jobs call reusable workflows from `sbaerlocher/.github`.

- `.github/workflows/pull-request.yml` — on PRs to `main`: quality, tests and build
  (`ci-js`), CodeQL, Claude code review
- `.github/workflows/tag.yml` — on `v*` tags or manual dispatch: npm release with
  provenance and SBOM, GitHub release. Publishing runs the `prepublishOnly` script
  (`pnpm typecheck && pnpm test:coverage`).
- `.github/workflows/weekly-security.yml` — Mondays 02:00 UTC: CodeQL, dependency and
  license scan, secret detection

## Repo conventions

- Allowed cities: single source is `ALLOWED_CITIES` in `src/components/AareGuru.vue`,
  mirrored by `AllowedCity` in `src/types/index.d.ts` (bern, thun, brienz, interlaken,
  biel, hagneck, olten, brugg). Keep both in sync.
- Peer dependencies: `peerDependencies` in `package.json`.
- Public API (props, events, slots, exposed methods) is documented in `README.md`;
  the types live in `src/types/index.d.ts`.

## Common tasks

New prop or event:

1. Add the type to `AareGuruProps` / `AareGuruEmits` in `src/types/index.d.ts`.
2. Add it to `defineProps` / `defineEmits` in `src/components/AareGuru.vue`.
3. Add tests in `tests/unit/AareGuru.spec.ts`.
4. Update the API tables in `README.md`.
5. Add an entry to `CHANGELOG.md`.

## Further reading

- `README.md` — usage and API reference
- `CONTRIBUTING.md` — setup, commit format, pull requests
- `REVIEW.md` — code review guidelines
- `CHANGELOG.md` — version history
