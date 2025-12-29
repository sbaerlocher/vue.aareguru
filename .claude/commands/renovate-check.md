---
description: Check Renovate configuration for best practices
---

Analyze the Renovate configuration in `.github/renovate.json` for best practices.

**Check the following aspects:**

## 1. Base Configuration

- [ ] `$schema` present for IDE support
- [ ] `extends: ["config:recommended"]` as base
- [ ] `timezone` set (e.g., "Europe/Zurich")
- [ ] `schedule` defined (e.g., weekly)

## 2. Automerge & Platform

- [ ] `platformAutomerge: true` for GitHub's native automerge
- [ ] `prConcurrentLimit` set (recommended: 5-10)
- [ ] `prHourlyLimit: 0` for no hourly limits
- [ ] `automergeStrategy: "squash"` for clean history
- [ ] `minimumReleaseAge: "3 days"` for new release stability (optional)
- [ ] `rebaseWhen: "behind-base-branch"` for clear rebase strategy (optional)

## 3. Semantic Commits

- [ ] `semanticCommits: "enabled"` OR `:semanticCommits` in extends
- [ ] `commitMessagePrefix`, `commitMessageAction`, etc. configured
- [ ] `semanticCommitType` and `semanticCommitScope` in packageRules (optional)

## 4. Package Rules - Grouping

Check if important packages are grouped:

- [ ] Vue Packages (`vue`, `@vue/*`)
- [ ] ESLint Packages (`eslint`, `@typescript-eslint/*`)
- [ ] Vitest/Testing Packages (`vitest`, `@vitest/*`, `@testing-library/*`)
- [ ] TypeScript (`typescript`)
- [ ] Vite (`vite`, `@vitejs/*`)
- [ ] GitHub Actions (`matchManagers: ["github-actions"]`) (optional)

## 5. Package Rules - Update Types

- [ ] Patch: Automerge for safe updates
- [ ] Minor devDependencies: Automerge enabled
- [ ] Major: `automerge: false` for manual review
- [ ] Major: `dependencyDashboardApproval: true` (optional)
- [ ] Production Dependencies: Careful (no automerge for minor/major)

## 6. Security

- [ ] `vulnerabilityAlerts` enabled
- [ ] Security updates with `schedule: ["at any time"]`
- [ ] Security updates with `automerge: true`
- [ ] `osvVulnerabilityAlerts: true` for OSV database (optional)

## 7. Lock File Maintenance

- [ ] `lockFileMaintenance.enabled: true`
- [ ] Separate schedule (e.g., monthly)
- [ ] `automerge: true` for lock file updates

## 8. Dashboard & Labels

- [ ] `dependencyDashboard: true`
- [ ] `dependencyDashboardTitle` meaningful
- [ ] `dependencyDashboardHeader` with schedule info (optional)
- [ ] `labels` configured for PRs
- [ ] `assignees` or `reviewers` set
- [ ] `reviewersFromCodeOwners: true` (optional, with CODEOWNERS)
- [ ] `suppressNotifications: ["prIgnoreNotification"]` (optional)

---

**Output:**

For each item:

- OK: Fulfilled
- WARNING: Partially fulfilled (with explanation)
- MISSING: Not present (with recommendation)

**At the end:**

```text
Renovate Best Practices Score: X/8 categories fulfilled

Recommended changes:
1. ...
2. ...

Should I apply the changes? (Yes/No)
```
