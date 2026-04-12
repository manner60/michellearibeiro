# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

## MintBird & PageSprout Skills

**Installed:** March 15, 2026
**Location:** `/usr/local/lib/node_modules/openclaw/skills/`

### API Credentials
**File:** `credentials/titanium-api-keys.txt`

Get your API keys from:
- **MintBird:** https://app.mintbird.com → Settings → API Access
- **PageSprout:** https://app.poplinks.io → Settings → API Access

### Available Commands
- `/poplink` - Create/manage shortened tracking links
- `/leadstep` - Create/manage lead capture pages
- `/bridgepage` - Create/manage bridge/advertorial pages

### API Base URL
`https://api.poplinks.io/api/ai`

---

## Letterman

**Status:** ✅ Credentials available  
**API Access:** Yes (can create articles, manage publications)  
**Credentials File:** `credentials/titanium-api-keys.txt`  
**Approved Publications Only:**
- Stampede City Buzz → `69b67eb447872b28b4e043dc`
- BizBuzz Calgary → `69c6f96237ba49fb69a44b52`

**Rule:** For Michelle's Letterman work, use only these approved publication/storage IDs unless Michelle explicitly provides a new one.

**When Michelle adds a new Letterman publication:** add it here first, then treat it as approved for future work.

**Newsletter build preference:** every Letterman newsletter should include **4 ARTICLE_CUE blocks** by default when relevant draft articles exist.

**Article status preference:** when articles are ready for Michelle to use in Stampede City Buzz or BizBuzz Calgary, default them to **PUBLISHED** and **In Article Cue / Add To Newsletter Cue** so they are easy to select inside cue blocks.

**Note:** Newsletter/article management platform for content creation and publishing.

---

Add whatever helps you do your job. This is your cheat sheet.

## Temporary Travel Notes

- Michelle is in **Toronto, Ontario** through **Friday, April 10, 2026**.
- While she is away, treat **Toronto** as the active city for weather/check-in relevance.
- Resume normal Calgary-based assumptions after **Friday, April 10, 2026** unless Michelle says otherwise.
