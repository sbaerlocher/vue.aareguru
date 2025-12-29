---
description: Check documentation for completeness and consistency
---

Analyze the repository documentation for completeness, consistency, and best practices.

**Documentation Structure:**

```text
├── README.md        # Main documentation for GitHub/npm
├── AGENT.md         # AI reference documentation (Claude, Copilot)
├── CONTRIBUTING.md  # Contribution guidelines
└── CHANGELOG.md     # Version history
```

---

## 1. README.md (Main Documentation)

### Required Sections for npm Package

- [ ] **Badges** - Build status, npm version, license
- [ ] **Description** - Short project description (1-2 sentences)
- [ ] **Requirements** - Vue version, peer dependencies
- [ ] **Installation** - npm, yarn, pnpm commands
- [ ] **Usage** - At least one simple example
- [ ] **Props** - Table with all props
- [ ] **Events** - Table with all events
- [ ] **Slots** - Table with all slots
- [ ] **TypeScript** - Type import example
- [ ] **License** - License information

### Recommended Sections

- [ ] **Features** - Feature list with checkmarks
- [ ] **Development** - Setup, build, test commands
- [ ] **Contributing** - Link to CONTRIBUTING.md
- [ ] **Browser Support** - Supported browsers
- [ ] **API Reference** - Link to external API

## 2. AGENT.md (AI Reference)

- [ ] **Project Overview** - What is the project?
- [ ] **Architecture** - Component structure
- [ ] **Coding Standards** - TypeScript, Vue best practices
- [ ] **Testing** - Test commands, coverage
- [ ] **Build** - Build commands

## 3. CONTRIBUTING.md

- [ ] **Code of Conduct** - Behavior guidelines
- [ ] **How to Contribute** - Step-by-step guide
- [ ] **Development Setup** - Local development environment
- [ ] **Pull Request Process** - PR guidelines
- [ ] **Commit Messages** - Conventional commits format
- [ ] **Code Style** - Linting, formatting

## 4. CHANGELOG.md

- [ ] **Keep a Changelog Format** - Standard format used
- [ ] **Semantic Versioning** - Versions correctly formatted
- [ ] **Current Version** - Matches package.json
- [ ] **Unreleased Section** - For upcoming changes

---

## 5. Consistency Checks

### Cross-References

- [ ] README links to CONTRIBUTING.md, CHANGELOG.md, AGENT.md
- [ ] Props in README match component
- [ ] Events in README match component
- [ ] Slots in README match component
- [ ] Version in CHANGELOG matches package.json

### Code Examples

- [ ] Vue examples are syntactically correct
- [ ] TypeScript examples compile
- [ ] Bash commands are executable

### Currency

- [ ] No outdated props/events documented
- [ ] TypeScript types current
- [ ] Dependencies current

---

## 6. Perform Check

**Steps:**

1. **Read documentation:**
   - README.md
   - AGENT.md
   - CONTRIBUTING.md
   - CHANGELOG.md

2. **Analyze component:**
   - Extract props from `src/components/AareGuru.vue`
   - Extract events
   - Extract slots

3. **Compare:**
   - Documented props vs. actual props
   - Documented events vs. actual events
   - package.json version vs. CHANGELOG

---

## 7. Output

For each area:

- OK: Complete
- WARNING: Partial (with missing sections)
- MISSING: Not present (with recommendation)

**At the end:**

```text
Documentation Check Result
=============================

README.md:
├── Required Sections: X/10
└── Recommended Sections: X/5

AGENT.md:        OK/WARNING/MISSING
CONTRIBUTING.md: OK/WARNING/MISSING
CHANGELOG.md:    OK/WARNING/MISSING

Consistency:
├── Props:   X documented, Y in component
├── Events:  X documented, Y in component
├── Slots:   X documented, Y in component
└── Version: package.json vX.X.X, CHANGELOG vX.X.X

Score: X/20 points

Critical issues:
1. ...

Recommended improvements:
1. ...

Should I add the missing documentation? (Yes/No)
```
