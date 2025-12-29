---
description: Check GitHub Actions for best practices
---

Analyze all GitHub Actions workflows in `.github/workflows/` for best practices.

**Check the following aspects:**

## 1. Action Pinning (Security)

- [ ] All actions pinned with SHA (not just `@v4`)
- [ ] Correct version in comment (`# v4.2.2`)
- [ ] SHA matches comment

```yaml
# Correct
uses: actions/checkout@8e8c483db84b4bee98b60c0593521ed34d9990e8 # v6.0.1

# Wrong - Supply chain risk
uses: actions/checkout@v4
```

## 2. Permissions (Least Privilege)

- [ ] `permissions:` explicitly set
- [ ] Only required permissions (`contents: read`)
- [ ] No `write-all` or missing permissions

## 3. Step Names

- [ ] Every step has a `name:`
- [ ] Names are descriptive
- [ ] Workflow/Job has meaningful `name:`

## 4. Timeouts

- [ ] `timeout-minutes:` set on all jobs
- [ ] Reasonable values (not too high)

## 5. Caching

- [ ] pnpm/npm cache via `actions/setup-node` with `cache: pnpm`
- [ ] `restore-keys:` with fallback chain if custom cache

## 6. Node Version Matrix

- [ ] Multiple Node versions tested (20.x, 22.x, 23.x)
- [ ] `fail-fast: false` in matrix strategy
- [ ] LTS versions prioritized

## 7. Quality Checks

- [ ] Type check (`npm run type-check` or `vue-tsc`)
- [ ] Lint (`npm run lint`)
- [ ] Tests (`npm run test`)
- [ ] Build (`npm run build`)

## 8. Release Workflow

- [ ] Only triggered on tags/releases
- [ ] npm publish configured
- [ ] `NPM_TOKEN` secret used

## 9. Concurrency

- [ ] `concurrency:` on deploy/release workflows
- [ ] `cancel-in-progress: true` for PRs

---

**Output:**

For each item:

- OK: Fulfilled
- WARNING: Partially fulfilled (with explanation)
- MISSING: Not present (with recommendation)

**At the end:**

```
GitHub Actions Best Practices Score: X/9 categories fulfilled

Critical issues:
1. ...

Recommended improvements:
1. ...

Should I apply the changes? (Yes/No)
```
