# joes.ai Skill Installer v1.0.4

**Official skill installer with certification levels for OpenClaw**

## Installation

### Method 1: Extract to Workspace (Recommended)

1. Extract this zip to your OpenClaw workspace directory
2. The `/joes` command will automatically find `bin/slash-joes.js`

```bash
# Example: Extract to workspace
cd ~/.openclaw/workspace
unzip BOOTSTRAP-JOE-SKILL-LOADER-v1.0.4.zip
```

### Method 2: Global Install (Optional)

```bash
npm install -g joes-ai-skill
```

## Usage

### Via Telegram `/joes` Command

```
/joes install <skill-slug> [--level <cert-level>]
/joes doctor
/joes inspect <skill-slug>
```

### Via CLI

```bash
node bin/joes-skill-install.js <skill-slug> [options]
```

### Via Zip (Telegram DM)

Send a skill zip file via Telegram DM with command:
```
/joes install <skill-slug> --zip <attachment>
```

## Certification Levels

- `install-verified` (default) → 🛡️ Basic verification
- `security-reviewed` → 🕵️ Security audit completed
- `joes-ai-certified` → 🏛️ Full joes.ai certification

## Examples

```bash
# Install weather skill with default certification
/joes install weather

# Install with specific certification level
/joes install summarize --level joes-ai-certified

# Check installation status
/joes doctor

# Inspect installed skill
/joes inspect weather
```

## What's New in v1.0.4

✅ **Fixed:** Command parsing bug (no longer treats "install" as skill slug)  
✅ **Added:** `--zip` flag for local zip file installations  
✅ **Added:** `/joes doctor` command with detailed diagnostics  
✅ **Added:** `/joes inspect <skill>` command to show metadata  
✅ **Improved:** Telegram-native flow (auto-detects zip attachments)

## Requirements

- Node.js 18+
- OpenClaw installed
- `clawhub` CLI (optional, for clawhub installs)
- `unzip` command (required for --zip installs)

## Files

```
bin/
  joes-ai-skill.js        # CLI wrapper
  joes-skill-install.js   # Core installer
  slash-joes.js           # Telegram command handler
  _meta.json              # Version metadata
package.json              # Package manifest
```

## Support

- Homepage: https://joes.ai
- Issues: Report via Telegram to @JoeTheGoatfarmer

---

Built by Joe Heiser | joes.ai
