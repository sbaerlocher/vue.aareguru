---
description: Create a Git commit with message
---

Create a Git commit with the message: **$ARGUMENTS**

1. **Check Status:**

   - Run `git status`
   - Show all changed and new files
   - Group by: Components, Views, Composables, Tests, Config

2. **Staging:**

   - Ask: "Which files should be committed?"
   - Show options:
     - All files (`git add .`)
     - Only src (`git add src/`)
     - Only tests (`git add tests/`)
     - Only specific files (user chooses)
     - Cancel

3. **Show Diff:**

   - Show `git diff --staged` for selected files
   - Ask: "Proceed with commit?"

4. **Create Commit:**

   ```bash
   git commit -m "$ARGUMENTS
   ```

5. **Verification:**

   - Show `git log -1` for the created commit
   - Show current branch with `git branch --show-current`
   - Ask: "Push to remote? (y/n)"

6. **Optional Push:**
   - On "y": Run `git push`
   - On "n": Info that commit is local

**Commit Message Conventions for this repo:**

Follow existing style (see `git log`):

- `feat(scope)`: New features
- `fix(scope)`: Bug fixes
- `refactor(scope)`: Code refactoring
- `chore(deps)`: Dependency updates (Renovate)
- `chore(scope)`: Maintenance tasks
- `ci(workflow)`: CI/CD changes
- `docs`: Documentation
- `test(scope)`: Add/modify tests
- `style(scope)`: Styling/CSS changes

**Scopes:** `components`, `views`, `composables`, `api`, `store`, `styles`, `tests`, `config`, `deps`, `ci`, `i18n`

**Security Checks:**

- Warn if `.env` or credential files are included
- Warn if secrets are visible in diff
- Warn if API keys/tokens are visible
