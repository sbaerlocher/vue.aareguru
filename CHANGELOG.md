# Changelog

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
and [human-readable changelog](https://keepachangelog.com/en/1.0.0/).

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
