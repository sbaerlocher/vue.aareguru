# Changelog

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
and [human-readable changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added

- **Storybook**: Interactive component documentation with Storybook 10
  - Live component playground with all props
  - Stories for all 8 cities along the Aare river
  - Custom slot examples
  - Accessibility testing via `@storybook/addon-a11y`
  - Auto-generated documentation via `@storybook/addon-docs`
- **New Cities**: Added support for Olten and Brugg AG (now 8 cities total)
- **Composables**: New composables for advanced use cases:
  - `useCities()` - Dynamically fetch available cities from the API
  - `useHistory(city)` - Fetch historical temperature and flow data
- **TypeScript**: Full TypeScript support in `AareGuru.vue` component (`<script setup lang="ts">`)
- **TypeScript**: `AllowedCity` union type for compile-time city prop validation
- **TypeScript**: Exported additional Weather types: `WeatherCurrent`, `WeatherToday`, `WeatherPeriod`
- **Component**: Watch handlers for `autoRefresh` and `cacheTimeout` props enabling dynamic updates at runtime
- **CI**: Renovate comments for automatic Node.js version updates in workflows
- **Config**: `.editorconfig` for consistent editor settings across IDEs
- **Config**: `CLAUDE.md` configuration file for Claude Code
- Claude Code slash commands for development workflow:
  - `/commit` - Create Git commits with conventional commit messages
  - `/renovate-check` - Check Renovate configuration for best practices
  - `/actions-check` - Check GitHub Actions for best practices
  - `/docs-check` - Check documentation for completeness and consistency
  - `/code-review` - Perform code reviews on files or directories

### Changed

- **Component**: Migrated `AareGuru.vue` to full TypeScript with typed props, emits, and refs
- **Component**: `refreshInterval` is now a reactive `ref` instead of a plain variable (Vue-idiomatic)
- **DX**: `npm run dev` now starts Storybook instead of Vite dev server (best practice for component libraries)
- **DX**: Simplified `App.vue` to minimal entry point (Storybook is now primary development tool)
- **Tests**: Updated tests to reflect TypeScript changes (city validation now at compile-time)
- **CI**: Renamed `test.yml` to `ci.yml` for clarity
- **CI**: Renamed `release.yml` workflow to "Release & Publish" for clarity
- **CI**: Unified Node.js version to 22 (LTS) across all workflows
- **CI**: Updated test matrix to Node.js 20.x, 22.x, 24.x
- **CI**: Added Storybook browser testing with Vitest workspace and Playwright
- **CI**: Added Playwright browser caching for faster CI runs
- **Tests**: Added Vitest workspace configuration for separate unit and browser tests
- **Docs**: Updated README.md with correct npm scripts (`npm run dev`, `npm run build`)
- **Docs**: Updated README.md roadmap (removed completed Vite migration, added SSR support)
- **Docs**: Updated CONTRIBUTING.md with correct build commands
- **Docs**: Updated AGENTS.md project structure to reflect current state
- **Docs**: Renamed `AGENT.md` to `AGENTS.md`
- Improved Renovate configuration with additional best practices:
  - Added `minimumReleaseAge: "3 days"` for new release stability
  - Added `dependencyDashboardApproval: true` for major updates
  - Added `osvVulnerabilityAlerts: true` for OSV security database
  - Added GitHub Actions grouping with automerge
  - Added `dependencyDashboardHeader` with schedule information
- Translated all Claude Code commands to English for consistency with repository language
- Updated development dependencies:
  - @types/node: 24.10.4 → 25.0.3
  - vue-tsc: 3.2.0 → 3.2.1
- Updated CI dependencies:
  - renovatebot/github-action: 44.2.0 → 44.2.2

### Removed

- Runtime city validation warning (now handled by TypeScript at compile time)
- Debug `console.log` statements from component
- `console.error` call after retries (error still emitted via event)
- Removed `.github/dependabot.yml` (replaced by Renovate)
- Removed `.github/workflows/renovate.yml` (using GitHub App instead)

### Security

- Pinned all GitHub Actions to SHA for supply chain security:
  - actions/checkout@8e8c483db84b4bee98b60c0593521ed34d9990e8 (v6.0.1)
  - actions/setup-node@395ad3262231945c25e8478fd5baf05154b1d79f (v6.1.0)
  - actions/upload-artifact@b7c566a772e6b6bfb58ed0dc250532a479d7789f (v6.0.0)
  - actions/download-artifact@37930b1c2abaa49bbe596cd826c3c89aef350131 (v7.0.0)
  - actions/cache@5a3ec84eff668545956fd18022155c47e93e2684 (v4.2.3)
  - codecov/codecov-action@671740ac38dd9b0130fbe1cec585b89eea48d3de (v5.5.2)
  - github/codeql-action@5d4e8d1aca955e8d8589aabd499c5cae939e33c7 (v4.31.9)
  - softprops/action-gh-release@a06a81a03ee405af7f2048a818ed3f03bbf83c7b (v2.5.0)

## [2.2.3] - 2025-12-20

### Changed

- Updated development dependencies:
  - vue: 3.5.24 → 3.5.26
  - vite: 7.2.4 → 7.3.0
  - @vitejs/plugin-vue: 6.0.2 → 6.0.3
  - @types/node: 24.10.1 → 24.10.4
  - eslint: 9.39.1 → 9.39.2
  - happy-dom: 20.0.10 → 20.0.11
  - glob: 10.5.0 → 13.0.0
- Updated CI dependencies:
  - renovatebot/github-action: 44.0.2 → 44.2.0
  - Node.js test matrix: 20.x, 22.x, 23.x → 24.12.0

### Improved

- Lock file maintenance for better dependency resolution
- All tests passing (28/28)
- Zero security vulnerabilities

## [2.2.2] - 2025-12-20

### Security

- Fixed glob security vulnerability (CVE) by overriding to secure version 10.5.0+
  - Addresses vulnerability in transitive dependency via js-beautify
  - Added npm overrides to force safe version

### Changed

- Updated development dependencies:
  - vitest: 4.0.9 → 4.0.16
  - @vitest/ui: 4.0.9 → 4.0.16
  - @vitest/coverage-v8: 4.0.9 → 4.0.16
  - glob: 10.4.5 → 10.5.0 (via override)

### Improved

- All tests passing (28/28)
- Zero security vulnerabilities
- Updated dependencies for better stability

## [2.2.1] - 2025-11-15

### Security

- Upgraded js-yaml from 4.1.0 to 4.1.1 to fix prototype pollution vulnerability (CVE-2024-12327, Medium severity)

### Fixed

- Fixed package.json and package-lock.json synchronization for vitest dependencies
- Resolved dependency version mismatches that caused CI failures

### Changed

- Updated development dependencies:
  - vitest: 4.0.7 → 4.0.9
  - @vitest/ui: 4.0.7 → 4.0.9
  - @vitest/coverage-v8: 4.0.7 → 4.0.9
  - vite: 6.4.1 → 7.2.2
  - vue: 3.5.23 → 3.5.24
  - @vue/compiler-sfc: 3.5.23 → 3.5.24
- Updated CI dependency: renovatebot/github-action from 43.0.20 to 44.0.2

## [2.2.0] - 2025-11-07

### Fixed

- Fixed TypeScript interfaces to match actual Aareguru API response structure
  - `weather.current` is now correctly typed as `WeatherCurrent` object with `tt` (temperature), `rr`, `rrreal`, `timestamp`, `timestring` properties (was incorrectly typed as `number`)
  - `weather.today` is now correctly typed as `WeatherToday` object with `v`, `n`, `a` properties for different time periods (was incorrectly typed as `number`)
  - `weather.forecast` items now include all fields: `day`, `dayshort`, `timestamp`, `sy`, `syt`, `symt`, `tx`, `tn`, `rr`, `rrisk` (previously had incomplete type definition)
  - `aare` object now includes all available fields: `temperature_prec`, `temperature_text`, `temperature_text_short`, `flow_text`, `location`, `location_long`, `forecast2h`, `forecast2h_text`, `timestamp`, `timestring`
  - Removed incorrect `text` and `timestamp` fields from root `AareData` interface (these don't exist in the actual API response)

### Changed

- Updated README.md with correct TypeScript interface documentation

## [2.1.0] - 2025-11-07

### Added

- OIDC trusted publishing for npm with provenance
- `.eslintignore` file to exclude specific directories from linting

### Changed

- **Build System**: Migrated from Vue CLI to Vite for faster builds and better developer experience
- Updated GitHub Actions workflows to latest versions (upload-artifact v5, download-artifact v6)
- Migrated Renovate configuration to new format
- Updated ESLint to 9.39.0

### Fixed

- Improved array validation in Vite configuration
- Fixed documentation links in README
- Addressed code review feedback for better code quality

### Removed

- core-js dependency (no longer needed with modern build setup)

## [2.0.0] - 2025-10-22

### Added

- **TypeScript Support**: Full TypeScript type definitions in `src/types/index.d.ts`
- **Unit Tests**: 28 comprehensive unit tests with Vitest and Vue Test Utils (100% coverage)
- **Retry Logic**: Configurable retry attempts with exponential backoff
- **Error Handling**: Improved error states with custom error slot
- **Loading States**: Visual loading indicator with custom loading slot
- **Temperature Units**: Support for Celsius and Fahrenheit conversion
- **Caching**: Configurable cache timeout to reduce API calls (default 5 minutes)
- **Auto-Refresh**: Optional automatic data refresh functionality
- **Reactive Props**: Component watches city prop and refetches on change
- **Custom Slots**: Three slots (default, loading, error) for custom rendering
- **Exposed Methods**: `refresh()` and `clearCache()` methods via template refs
- **Events**: `@loaded`, `@error`, and `@retry` events for better integration
- **Input Validation**: Validates city prop against allowed cities
- **Accessibility**: ARIA attributes for screen readers
- **Documentation**:
  - CONTRIBUTING.md with development guidelines
  - TESTING.md with comprehensive testing guide
  - SCRIPTS.md with all npm scripts documented
  - agent.md as AI reference documentation
  - Updated README with examples and API documentation
- **NPM Scripts**: Expanded from 9 to 20 scripts with best practices
- **CI/CD**: Updated GitHub Actions workflows with type checking and testing
- **Demo App**: 9 comprehensive examples in `src/App.vue`

### Changed

- **BREAKING**: Migrated from Vue 2 to Vue 3
- **BREAKING**: Component now uses Composition API with `<script setup>`
- **BREAKING**: Minimum Node.js version is now 20.x
- **BREAKING**: Requires Vue 3.3.0+ and Axios 1.0.0+ as peer dependencies
- Updated build system to Vue CLI 5.0.8
- Improved component API with better prop validation
- Enhanced error messages and timeout handling (5 seconds)
- All documentation translated to English
- Updated all dependencies to latest versions

### Fixed

- Network timeout errors now properly trigger retries
- Component properly updates when city prop changes
- API response structure validation

### Removed

- Vue 2 compatibility (use version 1.x for Vue 2 projects)

## master

## 1.3.0

### Changed

- Bump @vue/cli-plugin-babel from 4.5.6 4.5.13
- Bump @vue/cli-plugin-eslint from 4.5.6 to 4.5.7
- Bump @vue/cli-service from 4.5.6 to 4.5.13
- Bump axios from 0.20.0 to 0.21.1
- Bump core-js from 3.6.5 to 3.13.1
- Bump eslint from 7.10.0 to 7.27.0
- Bump eslint-plugin-vue from 7.0.0 to 7.10.0

## 1.2.1

### Fixed

- Fixed versions nummer in package.json.

## 1.2.0

### Added

- Add dependabot file.

### Changed

- Bump @vue/cli-plugin-babel from 4.4.1 to 4.5.6.
- Bump vue-template-compiler from 2.6.11 to 2.6.12.
- Bump @vue/cli-service from 4.4.1 to 4.5.6.
- Bump eslint-plugin-vue from 6.2.2 to 7.0.0.
- Bump @vue/cli-plugin-eslint from 4.4.1 to 4.5.6.
- Bump eslint from 7.2.0 to 7.10.
- Bump axios from 0.19.2 to 0.20.0.

## 1.1.0

### Changed

- Bump axios from 0.19.0 to 0.19.2.
- Bump core-js from 2.6.5 to 3.6.5.
- Bump vue from 2.6.10 to 2.6.11.
- Bump @vue/cli-plugin-babel from 3.11.0 to 4.4.1.
- Bump @vue/cli-plugin-eslint from 3.11.0 to 4.4.1.
- Bump @vue/cli-service from 3.11.0 to 4.4.1.
- Bump babel-eslint from 10.0.1 to 10.1.0.
- Bump eslint from 5.16.0 to 7.2.0.
- Bump eslint-plugin-vue from 5.0.0 to 6.2.2.
- Bump vue-template-compiler from 2.6.10 to 2.6.11.

## 1.0.0

### Added

- Initial release
