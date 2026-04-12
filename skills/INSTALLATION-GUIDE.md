# MintBird & Page Sprout Skills Installation Guide

## 📦 What's Included

This package contains TWO separate skills for TWO products:

### 1. **MintBird Skill** (`mintbird/`)
For users of **MintBird** (mintbird.com)
- Sales funnels
- Products
- Order management
- AI sales page generation

### 2. **Page Sprout Skill** (`pagesprout/`)
For users of **Page Sprout** (poplinks.io - formerly PopLinks)
- PopLinks (link shortening)
- Lead capture pages
- Bridge pages
- Link tracking & analytics

**Important:** These are TWO DIFFERENT PRODUCTS. You need accounts/API keys from the respective platforms.

---

## 🔐 API Keys Required

**Both skills use the same API endpoint but serve different products.**

### Get Your API Key

**For MintBird:**
1. Log into https://app.mintbird.com
2. Settings → API Access
3. Generate/copy your API key

**For Page Sprout (PopLinks):**
1. Log into https://app.poplinks.io
2. Settings → API Access
3. Generate/copy your API key

*(They share infrastructure, so if you have both products, one API key may work for both)*

---

## 📥 Installation

### Option 1: Install Both Skills

If you use both MintBird AND Page Sprout:

1. Copy both folders to: `~/.openclaw/workspace/skills/`
   - `skills/mintbird/`
   - `skills/pagesprout/`

2. Create credentials file: `credentials/titanium-api-keys.txt`

```
Mintbird: YOUR_MINTBIRD_API_KEY_HERE
PageSprout: YOUR_PAGESPROUT_API_KEY_HERE
```

3. Restart OpenClaw

### Option 2: Install Only What You Need

**Just MintBird?**
- Copy only `mintbird/` folder
- Add only Mintbird API key

**Just Page Sprout?**
- Copy only `pagesprout/` folder  
- Add only PageSprout API key

---

## 🚀 Available Commands

### MintBird Commands
```
/mbsalespage - Generate AI sales pages
/funnel - Create complete sales funnels
/product - Manage products
```
*(See mintbird/SKILL.md for full list)*

### Page Sprout Commands
```
/poplink - Create shortened tracking links
/leadstep - Create lead capture pages
/bridge page - Create bridge/advertorial pages
```
*(See pagesprout/SKILL.md for full list)*

---

## 🧪 Test Your Setup

**MintBird:**
```powershell
curl.exe -H "Authorization: Bearer YOUR_KEY" "https://api.poplinks.io/api/ai/system-domains"
```

**Page Sprout:**
```powershell
curl.exe -H "Authorization: Bearer YOUR_KEY" "https://api.poplinks.io/api/ai/poplinks"
```

---

## ⚠️ Security

- Keep your API keys private
- Never commit credentials to version control
- Use `.gitignore` for credentials folder
- Rotate keys regularly

---

## 🆘 Support

**MintBird:** https://mintbird.com/support  
**Page Sprout:** https://poplinks.io/support  
**API Docs:** https://api.poplinks.io/ai-api-docs

---

**Ready to build amazing funnels and pages! 🚀**
