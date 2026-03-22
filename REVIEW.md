# Code Review Guidelines

## Scope

In scope:

- Component changes (`src/components/`, `src/composables/`)
- TypeScript type definitions (`src/types/`)
- Test changes (`tests/`)
- Build configuration (`vite.config.ts`, `vitest.config.mts`)
- CI/CD workflow changes
- Renovate configuration updates

Out of scope:

- Auto-generated lock files (`package-lock.json`)
- Build artifacts (`dist/`)
- Coverage reports (`coverage/`)
- Renovate dependency-only PRs (patch/minor with automerge enabled)

## Required checks

- All tests pass (`npm test`)
- TypeScript type check passes (`npm run type-check`)
- ESLint passes (`npm run lint`)
- No secrets committed
- New features include tests
- Public API changes reflected in types (`src/types/index.d.ts`)

## Severity levels

| Level        | Meaning                                             | Merge impact       |
| ------------ | --------------------------------------------------- | ------------------ |
| Bug          | Incorrect behavior or broken contract               | Blocks merge       |
| Nit          | Minor issue — suboptimal but not incorrect          | Non-blocking       |
| Pre-existing | Issue present before this PR; flagged for awareness | No action required |

## Skip

- Renovate PRs with `automerge: true` (patch/minor) after CI passes
- Documentation-only changes with no functional impact
