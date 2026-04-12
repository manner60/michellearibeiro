# PopLinks Manager Skill

**Version:** 1.0  
**Author:** OpenClaw Community  
**License:** MIT

## Overview

This skill provides three commands for managing PopLinks/MintBird platform:
- `/poplink` — Create and manage shortened links
- `/leadstep` — Create and manage lead capture pages
- `/bridgepage` — Create and manage bridge/advertorial pages

## Installation

1. Copy this folder to your OpenClaw workspace: `skills/poplinks-manager/`
2. Run the setup wizard (OR see manual setup below)

## Quick Setup (Recommended)

### Automatic Setup Wizard

**Linux/Mac:**
```bash
bash setup.sh
```

**Windows:**
```powershell
powershell setup.ps1
```

The wizard will:
- Prompt for your API token
- Fetch your domains and let you choose one
- Fetch your categories (optional)
- Create and save your credentials file
- Validate the connection

### Manual Setup

If you prefer to set up manually:

1. **Read the detailed guide:**
   ```bash
   cat SETUP.md
   ```

2. **Copy the template:**
   ```bash
   cp credentials.template.txt ../../credentials/poplinks-api.txt
   ```

3. **Edit with your values:**
   ```bash
   nano ../../credentials/poplinks-api.txt
   ```

4. **Get your API token:**
   - Login to [PopLinks](https://app.poplinks.io) or [MintBird](https://app.mintbird.com)
   - Settings → API Access → Generate/Copy token

5. **Get your Domain ID:**
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://api.poplinks.io/api/ai/domains
   ```

6. **Validate setup:**
   ```bash
   node validate-credentials.js
   ```

## Automatic Credential Checking

All commands automatically check for credentials and will:
- ✅ Prompt you to set up if missing
- ✅ Validate API connection before running
- ✅ Show helpful error messages with next steps
- ✅ Guide you through the setup process

**You'll never get stuck with cryptic errors!** 🚀

## Usage

Once configured, use the commands in OpenClaw:

### Create a PopLink
```
/poplink create "My Link" https://destination.com my-slug
```

### List Lead Pages
```
/leadstep list
```

### Clone Bridge Page
```
/bridgepage clone 12345
```

## Commands Reference

See [SKILL.md](SKILL.md) for complete API documentation including:
- All available endpoints
- Request/response formats
- Field descriptions
- Workflow examples
- Error handling

## Security Notes

⚠️ **NEVER commit credentials to git**

Add to `.gitignore`:
```
credentials/poplinks-api.txt
credentials/*.txt
```

## Support

- **PopLinks API Docs:** https://api.poplinks.io/ai-api-docs
- **OpenClaw Docs:** https://docs.openclaw.ai
- **Community:** https://discord.com/invite/clawd

## Changelog

### 1.0 (2026-02-19)
- Initial release
- PopLink creation and management
- Lead Page CRUD operations
- Bridge Page CRUD operations
- Complete API documentation
