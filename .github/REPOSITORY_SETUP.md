# Repository Setup Guide

Diese Anleitung beschreibt die notwendigen manuellen Konfigurationsschritte für das Repository, die über die GitHub Web-UI durchgeführt werden müssen.

## 1. Renovate GitHub App installieren

Da der Renovate Workflow eine GitHub App verwendet, müssen Sie entweder:

### Option A: Renovate GitHub App verwenden (Empfohlen)
1. Installieren Sie die [Renovate GitHub App](https://github.com/apps/renovate)
2. Gewähren Sie der App Zugriff auf dieses Repository
3. Die App verwendet die `renovate.json` Konfiguration automatisch

**Hinweis:** Bei dieser Option ist der `.github/workflows/renovate.yml` Workflow NICHT erforderlich und kann entfernt werden.

### Option B: GitHub Actions mit GitHub App Token verwenden
1. Erstellen Sie eine GitHub App in Ihren Account-Einstellungen
2. Fügen Sie folgende Repository Secrets hinzu:
   - `RENOVATE_APP_ID`: Die App ID Ihrer GitHub App
   - `RENOVATE_APP_PRIVATE_KEY`: Der Private Key Ihrer GitHub App
3. Der Workflow `.github/workflows/renovate.yml` wird automatisch ausgeführt

### Option C: GitHub Actions mit Personal Access Token
Falls Sie keine GitHub App verwenden möchten, können Sie den Workflow anpassen:

```yaml
- name: Run Renovate
  uses: renovatebot/github-action@v40.3.12
  with:
    token: ${{ secrets.GITHUB_TOKEN }}  # Oder ein PAT mit entsprechenden Rechten
    configurationFile: renovate.json
```

**Wichtig:** `GITHUB_TOKEN` hat eingeschränkte Rechte und kann möglicherweise keine Workflows in PRs triggern.

## 2. Branch Protection Rules konfigurieren

Navigieren Sie zu: `Settings` → `Branches` → `Add branch protection rule`

### Für den Main Branch:
- **Branch name pattern**: `main` (oder `master`)
- ✅ **Require a pull request before merging**
  - ✅ **Require approvals**: 1 (kann für Renovate-PRs durch Auto-Merge umgangen werden)
  - ✅ **Dismiss stale pull request approvals when new commits are pushed**
  - ✅ **Require review from Code Owners**
- ✅ **Require status checks to pass before merging**
  - ✅ **Require branches to be up to date before merging**
  - Status checks hinzufügen (wenn vorhanden):
    - `test` (aus test.yml workflow)
    - `build` (falls vorhanden)
    - `CodeQL` (aus codeql.yml workflow)
- ✅ **Require conversation resolution before merging**
- ✅ **Do not allow bypassing the above settings**
  - **Ausnahmen hinzufügen**:
    - ⚠️ Für automatisches Mergen von Renovate: Fügen Sie die Renovate App oder Ihren Bot-Account hinzu
    - Oder: Verwenden Sie `platformAutomerge: true` in renovate.json (empfohlen)

## 3. Auto-Merge aktivieren

### Repository-Einstellung:
1. Navigieren Sie zu: `Settings` → `General`
2. Scrollen Sie zu **Pull Requests**
3. ✅ Aktivieren Sie **Allow auto-merge**

### Renovate Konfiguration:
Die Auto-Merge Regeln sind bereits in `renovate.json` konfiguriert:
- ✅ Patch-Updates: Automatisches Mergen aktiviert
- ✅ Minor-Updates für DevDependencies: Automatisches Mergen aktiviert
- ❌ Major-Updates: Manuelles Review erforderlich
- ❌ Production Dependencies (Minor/Major): Manuelles Review erforderlich

## 4. CODEOWNERS aktivieren

Die `.github/CODEOWNERS` Datei ist bereits erstellt. Um sie zu aktivieren:

1. Navigieren Sie zu: `Settings` → `Branches` → Branch Protection Rule für `main`
2. ✅ Aktivieren Sie **Require review from Code Owners**

**Hinweis für Renovate PRs:**
- Wenn Sie möchten, dass Renovate PRs automatisch gemerged werden, müssen Sie entweder:
  - Die Renovate App/Bot als Ausnahme in den Branch Protection Rules hinzufügen, ODER
  - `platformAutomerge: true` in renovate.json verwenden (bereits konfiguriert)

## 5. Dependabot vs. Renovate

Sie haben jetzt beide Tools konfiguriert:
- **Dependabot** (`.github/dependabot.yml`)
- **Renovate** (`.github/workflows/renovate.yml` und `renovate.json`)

### Empfehlung:
Deaktivieren oder entfernen Sie Dependabot, um Duplikate zu vermeiden:

1. Löschen oder umbenennen Sie `.github/dependabot.yml` zu `.github/dependabot.yml.disabled`
2. Oder behalten Sie beide und passen Sie die Konfigurationen an, um verschiedene Package-Ecosystems zu verwalten

**Vorteile von Renovate:**
- Flexiblere Konfiguration
- Bessere Gruppierung von Updates
- Auto-Merge direkt in der Konfiguration
- Dependency Dashboard
- Unterstützung für mehr Package Managers

## 6. Notification-Einstellungen

1. Navigieren Sie zu: `Settings` → `Notifications`
2. Konfigurieren Sie Benachrichtigungen für:
   - Pull Request Reviews
   - Pull Request Merges
   - Dependency Updates

## 7. GitHub Actions Permissions

1. Navigieren Sie zu: `Settings` → `Actions` → `General`
2. Unter **Workflow permissions**:
   - Wählen Sie **Read and write permissions**
   - ✅ Aktivieren Sie **Allow GitHub Actions to create and approve pull requests**

Dies ist erforderlich, damit Renovate PRs erstellen kann.

## 8. Labels erstellen (Optional)

Renovate verwendet folgende Labels. Erstellen Sie diese optional vorab:
- `dependencies`
- `renovate`
- `security`
- `major-update`
- `production`

Navigieren Sie zu: `Issues` → `Labels` → `New label`

## 9. Testing der Konfiguration

Nach der Einrichtung:

1. **Renovate manuell auslösen** (wenn GitHub Actions verwendet wird):
   - Gehen Sie zu `Actions` → `Renovate` → `Run workflow`
   - Setzen Sie `dryRun` auf `true` für einen Test-Durchlauf

2. **Prüfen Sie das Dependency Dashboard**:
   - Renovate erstellt automatisch ein Issue mit dem Titel "Renovate Dashboard"
   - Dort sehen Sie alle ausstehenden Updates

3. **Testen Sie Auto-Merge**:
   - Warten Sie auf einen Patch-Update PR von Renovate
   - Prüfen Sie, ob dieser automatisch gemerged wird (nach bestandenen Tests)

## Zusammenfassung der Dateien

- ✅ `renovate.json` - Renovate Konfiguration
- ✅ `.github/workflows/renovate.yml` - Renovate GitHub Action (optional)
- ✅ `.github/CODEOWNERS` - Code Ownership Definition
- ✅ `package.json` - Aktualisierte Dependencies
- ℹ️ `.github/dependabot.yml` - Bestehende Dependabot Config (erwägen Sie Deaktivierung)

## Support

Bei Fragen oder Problemen:
- [Renovate Dokumentation](https://docs.renovatebot.com/)
- [GitHub Branch Protection Docs](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [CODEOWNERS Dokumentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
