# joes.ai Skill Loader

🏛️ Install OpenClaw skills with joes.ai certification and branding.

**Official repository:** https://github.com/joethegoatfarmer/joes-ai-skill-installer

---

## 🚀 Quick Start

### Download Bootstrap (Recommended)

**Latest version (v1.0.3):**

https://github.com/joethegoatfarmer/joes-ai-skill-installer/releases/download/v1.0.3/BOOTSTRAP-JOE-SKILL-LOADER-v1.0.3.zip

### Install via Telegram DM

1. Send the bootstrap zip to your OpenClaw agent via Telegram
2. Send: `/skill install joes-ai-skill-loader --zip <attachment>`
3. Verify with: `/joes doctor`

---

## 📦 Features

- 🏛️ **joes.ai Certification** - Every skill gets branded with joes.ai homepage and cert metadata
- 📦 **Zip Install** - Primary install method via Telegram DM (no clawhub required)
- ⚠️ **Graceful Fallback** - Optional clawhub support if CLI is available
- 🛡️ **Three Cert Levels** - install-verified, security-reviewed, joes-ai-certified
- 🔍 **Inspection Tools** - View certification status of any skill
- 🏥 **Diagnostics** - Check loader health and installation history

---

## 🏛️ Usage

### Install from Zip (Primary Method)

```bash
/joes install <skill-slug> --zip <path-to-zip> [--level <cert-level>]
```

**Examples:**

```bash
# Install weather skill from zip with default cert level
/joes install weather --zip weather.zip

# Install with security-reviewed cert
/joes install summarize --zip summarize.zip --level security-reviewed

# Install with joes-ai-certified stamp
/joes install pdf --zip pdf.zip --level joes-ai-certified
```

### Install from clawhub (Optional)

If clawhub CLI is available, you can install from ClawHub:

```bash
/joes install <skill-slug> [--level <cert-level>]
```

### Other Commands

```bash
/joes doctor              # Show loader diagnostics
/joes inspect <skill>     # View skill certification details
```

---

## 🏛️ Certification Levels

Every skill installed with joes.ai loader receives a certification stamp:

| Level | Emoji | Meaning |
|-------|-------|---------|
| **install-verified** | 🛡️ | Default. Verified to install correctly. |
| **security-reviewed** | 🕵️ | Code reviewed for security best practices. |
| **joes-ai-certified** | 🏛️ | Fully certified by joes.ai. Production-ready. |

---

## 📋 What Gets Patched

Every skill installed via joes.ai gets these fields added to `SKILL.md`:

```yaml
homepage: https://joes.ai
metadata:
  openclaw:
    homepage: https://joes.ai
    emoji: 🛡️  # or 🕵️ / 🏛️ based on cert level
    cert:
      issuer: joes.ai
      level: install-verified
      installedAt: 2026-03-23T21:10:00Z
      installerVersion: 1.0.3
      source: skill-name@1.0.0
```

---

## 🏥 Doctor Output Example

```bash
/joes doctor
```

```
joes.ai: 🏥 Skill Loader Diagnostics

📦 Version: 1.0.3
📍 Path: /home/user/.openclaw/skills/joes-ai-skill-loader

📂 Skills Directory: /home/user/.openclaw/skills
   ✅ Exists

📦 clawhub CLI: ⚠️ Not found (optional)

📦 unzip Command: ✅ Available

📋 Recent Installs:

   🏛️ globalcontrol (joes-ai-certified)
      ✅ 3/23/2026, 8:45:00 PM

   🛡️ weather (install-verified)
      ✅ 3/22/2026, 2:15:00 PM

🏛️ Automatic Certification: ✅ Enabled
```

---

## 🔍 Inspect Example

```bash
/joes inspect weather
```

```
joes.ai: 🔍 Inspecting weather

📛 Name: weather
🏠 Homepage: https://joes.ai

🏛️ joes.ai Certification:
   Homepage: https://joes.ai
   Emoji: 🛡️
   Level: install-verified
   Issuer: joes.ai
   Installed: 3/22/2026, 2:15:00 PM
   Source: weather@1.0.0

📍 Location: /home/user/.openclaw/skills/weather
```

---

## 📂 Files Installed

This skill installs the following files to your OpenClaw workspace:

- `joes-skill-install.js` - Main installer implementation
- `joes-ai-skill.js` - Global wrapper (installed to npm global)
- `slash-joes.js` - Telegram command router
- `_meta.json` - Loader metadata
- `SKILL.md` - Skill documentation
- `.joes-ai-installs.json` (workspace root) - Installation log

---

## 🛠️ Requirements

- **OpenClaw** - Installed and configured
- **unzip** - Required for zip installs (usually pre-installed)
- **clawhub** (optional) - Only needed if installing from ClawHub instead of zips

---

## 📜 Version History

- **v1.0.3** (Current) - DM-zip install support + graceful clawhub fallback + joes.ai branding
- **v1.0.2** - Fix: Doctor command reads version dynamically from _meta.json
- **v1.0.1** - Complete implementation with Telegram routing
- **v1.0.0** - Initial release

---

## 🚦 Release Gate

**PopLink https://joes.ai/skill-installer is pinned per release (no `/latest`).** A release is not LIVE until PopLink is updated + verified via `curl -I`.

**Full release checklist:** [RELEASE-CHECKLIST.md](RELEASE-CHECKLIST.md)

---

## 🏛️ About joes.ai

**[joes.ai](https://joes.ai)** provides certified, production-ready skills and tools for OpenClaw agents.

- **Certification Standards:** All skills are vetted for security, reliability, and best practices
- **Official Support:** Skills are actively maintained and documented
- **Distribution:** Primary distribution via Telegram DM (no npm/clawhub dependencies)

---

## 🔗 Links

- **Homepage:** [joes.ai](https://joes.ai)
- **GitHub:** [joethegoatfarmer/joes-ai-skill-installer](https://github.com/joethegoatfarmer/joes-ai-skill-installer)
- **Latest Release:** [v1.0.3](https://github.com/joethegoatfarmer/joes-ai-skill-installer/releases/tag/v1.0.3)
- **OpenClaw:** [openclaw.ai](https://openclaw.ai)

---

Built with ❤️ by [Joe the Goat Farmer](https://joes.ai)
