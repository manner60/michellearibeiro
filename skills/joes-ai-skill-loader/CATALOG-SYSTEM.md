# Certified Skills Catalog System

## Overview

The joes.ai Skill Installer v2.0.0 introduces a **Certified Skills Catalog** — a curated, version-controlled registry of skills with canonical artifact URLs, checksums, and certification levels.

**Key benefits:**
- No more drag/drop zips for certified skills
- Single source of truth for approved versions
- Automatic version pinning and rollback
- Built-in integrity verification (SHA-256)
- Default preset installs for new users

## Catalog Structure

### File: `certified-skills.json`

```json
{
  "version": "1.0.0",
  "catalog_url": "https://raw.githubusercontent.com/...",
  "last_updated": "2026-04-01T21:29:00Z",
  "skills": [
    {
      "skill_id": "memory-bank",
      "name": "Memory Bank",
      "description": "Personal memory management system",
      "homepage": "https://joes.ai/skills/memory-bank",
      "latest": "v2026-04-01_p1",
      "default_install": true,
      "versions": [
        {
          "version": "v2026-04-01_p1",
          "date": "2026-04-01",
          "patch": 1,
          "zip_url": "https://raw.githubusercontent.com/.../memory-bank-skill_v2026-04-01_p1.zip",
          "commit": "5426208",
          "commit_url": "https://github.com/joethegoatfarmer/joes-ai-skill-installer/commit/5426208",
          "sha256": null,
          "notes": "Initial certified release"
        }
      ]
    }
  ],
  "presets": {
    "default": {
      "name": "Default Certified Set",
      "description": "Essential skills for most users",
      "skills": ["memory-bank"]
    }
  }
}
```

### Skill Entry Fields

- **skill_id**: Unique identifier (matches directory name)
- **name**: Human-readable skill name
- **description**: Brief description
- **homepage**: Skill homepage (joes.ai preferred)
- **latest**: Latest stable version tag
- **default_install**: Include in default preset (boolean)
- **versions[]**: Array of available versions

### Version Entry Fields

- **version**: Version tag (format: `vYYYY-MM-DD_p<N>`)
- **date**: Release date (YYYY-MM-DD)
- **patch**: Patch number for that day
- **zip_url**: Direct download URL for certified zip
- **commit**: Git commit hash
- **commit_url**: Link to commit on GitHub
- **sha256**: Checksum (null = skip verification, optional)
- **notes**: Release notes

## Install Modes

### 1. Catalog Install (Default)

Install latest version from catalog:

```bash
joes-skill-install memory-bank
```

Install specific version:

```bash
joes-skill-install memory-bank --version v2026-04-01_p1
```

### 2. Preset Install

Install all skills in a preset:

```bash
joes-skill-install --preset default
joes-skill-install --preset full
```

### 3. Manual Zip Install (Fallback)

For non-cataloged skills or local testing:

```bash
joes-skill-install myskill --zip /path/to/skill.zip
```

## Commands

### List Catalog

```bash
joes-skill-install --catalog
joes-skill-install --catalog --verbose
```

Shows:
- Available certified skills
- Latest versions
- Presets
- Last catalog update

### Doctor Check

```bash
joes-skill-install --doctor
```

Shows:
- Loader version
- Catalog status (# skills available)
- Installed skills count
- System dependencies

### Inspect Installed Skill

```bash
joes-skill-install --inspect memory-bank
```

## Certification Workflow

### Adding a New Skill to Catalog

1. **Build certified zip** with canonical naming:
   ```
   <skill-id>_vYYYY-MM-DD_p<N>.zip
   ```

2. **Upload to GitHub** (or canonical artifact host):
   ```
   alex-shared/shared-context/artifacts/<skill-id>/vYYYY-MM-DD_p<N>/
   ```

3. **Optional: Generate SHA-256**:
   ```bash
   sha256sum memory-bank-skill_v2026-04-01_p1.zip
   ```

4. **Add entry to `certified-skills.json`**:
   ```json
   {
     "skill_id": "memory-bank",
     "versions": [
       {
         "version": "v2026-04-01_p1",
         "date": "2026-04-01",
         "patch": 1,
         "zip_url": "https://raw.githubusercontent.com/.../memory-bank-skill_v2026-04-01_p1.zip",
         "commit": "5426208",
         "sha256": "abc123...",
         "notes": "Initial release"
       }
     ]
   }
   ```

5. **Update `latest` tag** to point to new version

6. **Commit and push** `certified-skills.json`

### Artifact Source of Truth

**Canonical location:** `joethegoatfarmer/joes-ai-skill-installer` repository

**Path structure:**
```
alex-shared/shared-context/artifacts/
├── memory-bank-skill/
│   ├── v2026-04-01_p1/
│   │   ├── memory-bank-skill_v2026-04-01_p1.zip
│   │   └── SHA256SUMS (optional)
│   └── v2026-04-01_p2/
│       └── ...
└── other-skill/
    └── ...
```

## Install Flow

```
User runs: joes-skill-install memory-bank

↓

1. Load certified-skills.json
2. Find skill entry (memory-bank)
3. Resolve version (latest → v2026-04-01_p1)
4. Download zip from zip_url
5. [Optional] Verify SHA-256 checksum
6. Extract to ~/.openclaw/skills/memory-bank
7. Patch SKILL.md with certification metadata
8. Log install to .joes-ai-installs.json
9. Cleanup temp files
```

## Version Pinning

Users can pin specific versions:

```bash
joes-skill-install memory-bank --version v2026-03-15_p2
```

**Rollback example:**
```bash
joes-skill-install memory-bank --version v2026-03-01_p1 --force
```

## Preset System

Presets allow bundling related skills:

### Built-in Presets

- **default**: Essential skills for most users
- **full**: All certified skills

### Preset Install

```bash
joes-skill-install --preset default
```

Installs all skills in preset with default certification level.

## Future Enhancements

### Multi-Channel Support

Add `channel` field to catalog entries:

```json
{
  "skill_id": "memory-bank",
  "channel": "stable",
  "versions": [...]
}
```

Channels:
- `stable` - Production-ready releases
- `beta` - Early access / testing
- `dev` - Development builds

### Auto-Update Check

```bash
joes-skill-install --update-check
```

Compares installed versions against catalog and shows available updates.

### Pre-Installer Hook

Add to bot bootstrap process:

```javascript
// Auto-install default preset on first run
if (!fs.existsSync('~/.openclaw/skills')) {
  execSync('joes-skill-install --preset default');
}
```

## Security

### Checksum Verification

When `sha256` is present:
- Installer downloads zip
- Computes SHA-256 hash
- Compares against catalog value
- Aborts if mismatch

### Artifact Hosting

- GitHub raw URLs are signed by GitHub
- Commit hash provides tamper evidence
- Version tags are immutable once released

## Maintenance

### Updating Catalog

1. Test new skill version locally
2. Build certified zip with proper naming
3. Upload to canonical artifact path
4. Add version entry to `certified-skills.json`
5. Update `latest` if stable
6. Commit with message: `chore: add <skill-id> v<version>`

### Deprecating Versions

Don't remove old versions from catalog. Mark as deprecated:

```json
{
  "version": "v2026-01-01_p1",
  "deprecated": true,
  "deprecation_reason": "Security vulnerability fixed in v2026-02-01_p1"
}
```

## Migration from v1.0.4

v2.0.0 is backward-compatible:

- `--zip` installs still work
- clawhub fallback still available
- Existing install log preserved

**New users:** Use catalog-first workflow

**Existing users:** Continue with current workflow or migrate to catalog

## Attribution

All skill metadata (name, description, homepage) comes from the packaged `SKILL.md` frontmatter, not from installer UI.

Catalog metadata is for:
- Version management
- Download URLs
- Integrity checks

**Branding remains in the skill package, not the installer.**
