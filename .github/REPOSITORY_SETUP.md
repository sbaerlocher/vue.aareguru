# Repository Setup Guide

Diese Anleitung beschreibt die notwendigen manuellen Konfigurationsschritte für das Repository, die über die GitHub Web-UI durchgeführt werden müssen.

## 1. Personal Access Token (PAT) einrichten

Der Renovate Workflow verwendet einen Personal Access Token für die Authentifizierung.

### Token erstellen:
1. Navigieren Sie zu: GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Klicken Sie auf "Generate new token (classic)"
3. Token-Name: z.B. "Renovate Bot"
4. Wählen Sie folgende Berechtigungen:
   - `repo` (Full control of private repositories)
   - `workflow` (Update GitHub Action workflows)
5. Klicken Sie auf "Generate token" und kopieren Sie den Token

### Token als Repository Secret hinzufügen:
1. Navigieren Sie zu: Repository Settings → Secrets and variables → Actions
2. Klicken Sie auf "New repository secret"
3. Name: `RENOVATE_TOKEN`
4. Value: Fügen Sie Ihren kopierten PAT ein
5. Klicken Sie auf "Add secret"

**Hinweis:** Der Workflow `.github/workflows/renovate.yml` wird automatisch jeden Montag um 6:00 Uhr ausgeführt oder kann manuell getriggert werden.

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
- Wenn Sie möchten, dass Renovate PRs automatisch gemerged werden:
  - `platformAutomerge: true` ist bereits in renovate.json konfiguriert
  - Die PRs werden nach bestandenen Status-Checks automatisch gemerged

## 5. Dependabot deaktivieren (Optional)

Sie haben jetzt beide Tools konfiguriert:
- **Dependabot** (`.github/dependabot.yml`)
- **Renovate** (`.github/workflows/renovate.yml` und `renovate.json`)

### Empfehlung:
Deaktivieren Sie Dependabot, um Duplikate zu vermeiden:

1. Löschen oder umbenennen Sie `.github/dependabot.yml` zu `.github/dependabot.yml.disabled`
2. Oder passen Sie die Konfigurationen an, um verschiedene Package-Ecosystems zu verwalten

**Vorteile von Renovate:**
- Flexiblere Konfiguration
- Bessere Gruppierung von Updates
- Auto-Merge direkt in der Konfiguration
- Dependency Dashboard
- Unterstützung für mehr Package Managers
- Manuelles Triggern über GitHub Actions möglich

## 6. Notification-Einstellungen

1. Navigieren Sie zu: `Settings` → `Notifications`
2. Konfigurieren Sie Benachrichtigungen für:
   - Pull Request Reviews
   - Pull Request Merges
   - Dependency Updates

## 7. Labels erstellen (Optional)

Renovate verwendet folgende Labels. Erstellen Sie diese optional vorab:
- `dependencies`
- `renovate`
- `security`
- `major-update`
- `production`

Navigieren Sie zu: `Issues` → `Labels` → `New label`

## 8. Testing der Konfiguration

Nach der Einrichtung:

1. **Renovate manuell auslösen**:
   - Gehen Sie zu `Actions` → `Renovate` → `Run workflow`
   - Optional: Setzen Sie `dryRun` auf `true` für einen Test-Durchlauf ohne tatsächliche PRs
   - Optional: Setzen Sie `logLevel` auf `debug` für detaillierte Logs

2. **Prüfen Sie das Dependency Dashboard**:
   - Renovate erstellt automatisch ein Issue mit dem Titel "Renovate Dashboard"
   - Dort sehen Sie alle ausstehenden Updates und deren Status

3. **Testen Sie Auto-Merge**:
   - Warten Sie auf einen Patch-Update PR von Renovate
   - Prüfen Sie, ob dieser automatisch gemerged wird (nach bestandenen Tests)
   - Bei Problemen: Prüfen Sie die Branch Protection Rules und Auto-Merge Einstellungen

## Zusammenfassung der Dateien

- ✅ `renovate.json` - Renovate Konfiguration mit Auto-Merge Regeln
- ✅ `.github/workflows/renovate.yml` - Renovate GitHub Actions Workflow (PAT)
- ✅ `.github/CODEOWNERS` - Code Ownership Definition
- ✅ `package.json` - Aktualisierte Dependencies (ESLint 8.57.1)
- ℹ️ `.github/dependabot.yml` - Bestehende Dependabot Config (Deaktivierung empfohlen)

## Schnellstart-Checkliste

1. ✅ PAT erstellen und als `RENOVATE_TOKEN` Secret hinzufügen
2. ✅ Branch Protection Rules für `main` aktivieren
3. ✅ Auto-Merge in Repository Settings aktivieren
4. ✅ CODEOWNERS Review Requirement aktivieren
5. ⚠️ Dependabot deaktivieren (optional)
6. ✅ Renovate Workflow manuell testen

## Support

Bei Fragen oder Problemen:
- [Renovate Dokumentation](https://docs.renovatebot.com/)
- [GitHub Branch Protection Docs](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [CODEOWNERS Dokumentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
