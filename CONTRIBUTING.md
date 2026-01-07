# Contributing to vue.aareguru

Thank you for your interest in vue.aareguru! We welcome all contributions.

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow:

- **Be respectful** - Treat everyone with respect and consideration
- **Be constructive** - Provide helpful feedback and accept constructive criticism
- **Be inclusive** - Welcome newcomers and help them get started
- **Be professional** - Focus on the project and avoid personal attacks
- **Be patient** - Remember that everyone is learning and contributing voluntarily

Unacceptable behavior includes harassment, discrimination, trolling, or any conduct that creates an unwelcoming environment.

If you experience or witness unacceptable behavior, please report it by opening an issue or contacting the maintainer directly.

## Development Setup

### Prerequisites

- Node.js >= 20.x
- npm >= 10.x (or yarn/pnpm)
- Git

### Installation

```bash
git clone https://github.com/sbaerlocher/vue.aareguru.git
cd vue.aareguru
npm install
```

### Development Server

```bash
npm run dev
```

The development server runs on `http://localhost:8080` by default.

## Testing

### Running Unit Tests

```bash
npm run test              # Run tests once
npm run test:watch        # Watch mode
npm run test:ui           # Open test UI (interactive)
npm run test:coverage     # Generate coverage report
```

### Writing Tests

- All tests are located in `tests/unit/`
- Use Vitest and Vue Test Utils
- Mock external dependencies (e.g. Axios)
- Test all important scenarios: Success, Error, Loading States
- Goal: At least 80% code coverage

Example:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AareGuru from '@/components/AareGuru.vue'

describe('AareGuru.vue', () => {
  it('renders temperature correctly', async () => {
    const wrapper = mount(AareGuru)
    // ... test code
  })
})
```

## Linting

### Running ESLint

```bash
npm run lint              # Run linting
npm run lint:fix          # Auto-fix issues
```

### Code Style

- Vue 3 Recommended Rules
- ESLint Recommended
- Composition API with `<script setup>`
- TypeScript for all new files

## TypeScript

### Type Checking

```bash
npm run type-check        # TypeScript type check
npm run type-check:watch  # Watch mode
```

### Type Definitions

- All types in `src/types/index.d.ts`
- Use strict TypeScript modes
- Document complex types with JSDoc

## Build

### Library Build

```bash
npm run build             # Build for npm package
```

The build creates ESM, CJS, and UMD bundles in the `dist/` directory.

## Pull Request Process

### 1. Fork & Clone

```bash
git clone https://github.com/YOUR_USERNAME/vue.aareguru.git
cd vue.aareguru
git remote add upstream https://github.com/sbaerlocher/vue.aareguru.git
```

### 2. Create Feature Branch

```bash
git checkout -b feature/amazing-feature
```

Branch names should be descriptive:

- `feature/add-loading-state`
- `fix/retry-logic`
- `docs/update-readme`
- `refactor/improve-error-handling`

### 3. Commit Changes

Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: add loading state indicator"
git commit -m "fix: handle network timeout errors"
git commit -m "docs: update API documentation"
```

#### Commit Message Format

```text
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting (no code change)
- `refactor`: Code refactoring
- `test`: Add/modify tests
- `chore`: Build process, dependencies, etc.
- `perf`: Performance improvements
- `ci`: CI/CD changes

**Examples:**

```text
feat(component): add retry logic with exponential backoff

- Implement configurable retry attempts
- Add exponential backoff delay
- Emit retry events for tracking

Closes #42
```

```text
fix(api): handle timeout errors correctly

Previously, timeout errors would not trigger retries.
Now they are properly caught and retried.
```

### 4. Tests & Lint

Ensure all tests pass and there are no linting errors:

```bash
npm run validate          # Run all checks (type-check, lint, test)
```

Or run individually:

```bash
npm run lint
npm run type-check
npm run test
npm run build
```

### 5. Push & Pull Request

```bash
git push origin feature/amazing-feature
```

Open a Pull Request on GitHub with:

- **Descriptive title** (e.g. "feat: Add retry logic for API calls")
- **Description of changes**
- **Screenshots** (if UI changes)
- **Linked issues** (e.g. "Closes #42")

## Code Review

All Pull Requests will be reviewed. Please:

- Keep PRs small and focused (one change per PR)
- Describe changes clearly and understandably
- Add screenshots for UI changes
- Link relevant issues
- Be open to feedback and suggestions

### Review Checklist

- [ ] Code follows the style guide
- [ ] Tests are present and passing
- [ ] No linting errors
- [ ] TypeScript types are correct
- [ ] Documentation updated (if necessary)
- [ ] CHANGELOG.md updated (if necessary)

## Documentation

### Update README

When adding new features:

- Update API documentation
- Add usage examples
- Update props/events table

### Update CHANGELOG

For larger changes:

- Add entry to CHANGELOG.md
- Use Semantic Versioning (MAJOR.MINOR.PATCH)

## Bug Reports

### Create Issue

If you find a bug:

1. Search for existing issues first
2. Create a new issue with template
3. Include:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs. actual behavior
   - Environment (browser, Node.js version, etc.)
   - Screenshots or code examples

## Feature Requests

Want to suggest a new feature?

1. Create a GitHub Issue
2. Describe the use case
3. Explain why the feature is useful
4. Discuss the implementation

## Code Quality Standards

### TypeScript

- Use strict TypeScript modes
- No `any` types (except when absolutely necessary)
- Document complex types

### Testing

- At least 80% code coverage
- Test all important scenarios
- Mock external dependencies
- Use descriptive test names

### Performance

- Avoid unnecessary re-renders
- Use computed properties
- Cache API responses when possible

### Accessibility

- Use semantic HTML
- Add ARIA attributes
- Test with screen readers (if possible)

## License

By contributing, you agree that your code will be published under the same license as the project.

## Questions?

If you have questions:

- Open a [GitHub Issue](https://github.com/sbaerlocher/vue.aareguru/issues)
- Contact the maintainer: @sbaerlocher

---

Thank you for your contribution! 🎉
