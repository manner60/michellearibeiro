# PopLinks Manager - Setup Guide

This guide walks you through gathering all required credentials and IDs.

---

## Prerequisites

1. Account on [PopLinks](https://app.poplinks.io) or [MintBird](https://app.mintbird.com)
2. Access to Settings â†’ API Access section

---

## Step 1: Get Your API Token

### Via PopLinks/MintBird Dashboard

1. Login to https://app.poplinks.io (or app.mintbird.com)
2. Click **Settings** in sidebar
3. Navigate to **API Access**
4. Click **Generate API Token** (or copy existing)
5. Copy the token (long string like: `YOUR_API_KEY_HERE`)

### Test Your Token

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.poplinks.io/api/ai/me

# Should return your user info (200 OK)
# If 401 Unauthorized, token is invalid
```

---

## Step 2: Get Your Domain ID

### List Your Domains

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.poplinks.io/api/ai/domains
```

**Response example:**
```json
{
  "type": "response",
  "data": [
    {
      "id": 1977,
      "domain": "yourdomain.com",
      "status": "active",
      "domain_type": "personal"
    },
    {
      "id": 1978,
      "domain": "anotherdomain.com",
      "status": "active",
      "domain_type": "personal"
    }
  ]
}
```

**Find the `id` of the domain you want to use by default.**

### No Personal Domains?

You can use system domains:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.poplinks.io/api/ai/system-domains
```

System domains include: zipbeam.com, flexylinks.com, etc.

---

## Step 3: Get Your Category ID (Optional)

Categories help organize your pages. If you don't use categories, you can skip this or set to `null`.

### List Your Categories

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.poplinks.io/api/ai/categories?type=2
```

**Response example:**
```json
{
  "type": "response",
  "data": [
    {
      "id": 1945,
      "name": "Newsletter Hour",
      "type": 2
    },
    {
      "id": 1442,
      "name": "Webinar Replays",
      "type": 2
    }
  ]
}
```

**Find the `id` of your default category.**

---

## Step 4: Get Template IDs (Optional)

Templates control page design. You can start without this and set later.

### List Available Templates

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.poplinks.io/api/ai/templates
```

**Note:** Template names are often empty in API response. You may need to test different IDs or check the UI.

**Common template IDs:** 1, 3, 4, 5, 7 (try these first)

---

## Step 5: Create Credentials File

Create: `credentials/poplinks-api.txt`

```
API_TOKEN=your_actual_token_here
DEFAULT_DOMAIN_ID=1977
DEFAULT_CATEGORY_ID=1945
DEFAULT_LEADPAGE_TEMPLATE=5
DEFAULT_BRIDGEPAGE_TEMPLATE=3
```

**Replace placeholders with your actual values from steps above.**

---

## Step 6: Verify Setup

### Test API Connection

```bash
# Load credentials
source credentials/poplinks-api.txt

# Test API access
curl -H "Authorization: Bearer $API_TOKEN" \
  https://api.poplinks.io/api/ai/me

# Should return your user info
```

### Test Domain Access

```bash
curl -H "Authorization: Bearer $API_TOKEN" \
  https://api.poplinks.io/api/ai/domains

# Should list your domains including the one with your DEFAULT_DOMAIN_ID
```

---

## Troubleshooting

### "401 Unauthorized"
- Token is invalid or expired
- Generate new token from dashboard
- Verify no extra spaces/characters in token

### "Cannot find domain"
- Domain ID doesn't exist
- Re-run Step 2 to get correct domain ID
- Make sure domain is active in your account

### "Category not found"
- Category ID doesn't exist or was deleted
- Set `DEFAULT_CATEGORY_ID=null` to skip categories
- Or re-run Step 3 to find valid category ID

### "Template not found"
- Template ID doesn't exist
- Set template to `null` to use default
- Or try common IDs: 3, 5, 7

---

## Security Checklist

âœ… **DO:**
- Store credentials in `credentials/` folder
- Add `credentials/` to `.gitignore`
- Regenerate tokens if accidentally exposed
- Use environment variables in production

âŒ **DON'T:**
- Commit credentials to git
- Share tokens publicly
- Store tokens in code files
- Screenshot tokens

---

## Quick Setup Script

Save as `setup.sh` (Linux/Mac) or `setup.ps1` (Windows):

### Bash Version (Linux/Mac)

```bash
#!/bin/bash

echo "PopLinks Manager - Setup Wizard"
echo "================================"
echo ""

read -p "Enter your API Token: " API_TOKEN
echo ""

echo "Fetching your domains..."
DOMAINS=$(curl -s -H "Authorization: Bearer $API_TOKEN" \
  https://api.poplinks.io/api/ai/domains)

echo "$DOMAINS" | jq '.data[] | "\(.id): \(.domain)"'
echo ""

read -p "Enter your default Domain ID: " DOMAIN_ID
echo ""

echo "Fetching your categories..."
CATEGORIES=$(curl -s -H "Authorization: Bearer $API_TOKEN" \
  https://api.poplinks.io/api/ai/categories?type=2)

echo "$CATEGORIES" | jq '.data[] | "\(.id): \(.name)"'
echo ""

read -p "Enter your default Category ID (or press Enter to skip): " CATEGORY_ID
CATEGORY_ID=${CATEGORY_ID:-null}
echo ""

# Create credentials file
mkdir -p credentials

cat > credentials/poplinks-api.txt <<EOF
API_TOKEN=$API_TOKEN
DEFAULT_DOMAIN_ID=$DOMAIN_ID
DEFAULT_CATEGORY_ID=$CATEGORY_ID
DEFAULT_LEADPAGE_TEMPLATE=5
DEFAULT_BRIDGEPAGE_TEMPLATE=3
EOF

echo "âœ… Credentials saved to: credentials/poplinks-api.txt"
echo ""
echo "Run 'cat credentials/poplinks-api.txt' to verify"
```

### PowerShell Version (Windows)

```powershell
# setup.ps1

Write-Host "PopLinks Manager - Setup Wizard" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$API_TOKEN = Read-Host "Enter your API Token"
Write-Host ""

Write-Host "Fetching your domains..." -ForegroundColor Yellow
$domains = Invoke-RestMethod -Uri "https://api.poplinks.io/api/ai/domains" `
  -Headers @{"Authorization"="Bearer $API_TOKEN"}

foreach ($domain in $domains.data) {
    Write-Host "$($domain.id): $($domain.domain)"
}
Write-Host ""

$DOMAIN_ID = Read-Host "Enter your default Domain ID"
Write-Host ""

Write-Host "Fetching your categories..." -ForegroundColor Yellow
$categories = Invoke-RestMethod -Uri "https://api.poplinks.io/api/ai/categories?type=2" `
  -Headers @{"Authorization"="Bearer $API_TOKEN"}

foreach ($category in $categories.data) {
    Write-Host "$($category.id): $($category.name)"
}
Write-Host ""

$CATEGORY_ID = Read-Host "Enter your default Category ID (or press Enter to skip)"
if ([string]::IsNullOrWhiteSpace($CATEGORY_ID)) {
    $CATEGORY_ID = "null"
}
Write-Host ""

# Create credentials file
New-Item -ItemType Directory -Force -Path "credentials" | Out-Null

$credContent = @"
API_TOKEN=$API_TOKEN
DEFAULT_DOMAIN_ID=$DOMAIN_ID
DEFAULT_CATEGORY_ID=$CATEGORY_ID
DEFAULT_LEADPAGE_TEMPLATE=5
DEFAULT_BRIDGEPAGE_TEMPLATE=3
"@

$credContent | Out-File -FilePath "credentials/poplinks-api.txt" -Encoding UTF8

Write-Host "âœ… Credentials saved to: credentials/poplinks-api.txt" -ForegroundColor Green
Write-Host ""
Write-Host "Run 'Get-Content credentials/poplinks-api.txt' to verify" -ForegroundColor Cyan
```

---

## Next Steps

After setup:
1. Review [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for common tasks
2. Try creating your first PopLink
3. Explore [EXAMPLES.md](EXAMPLES.md) for workflows
4. Read [SKILL.md](SKILL.md) for complete API reference

---

**Setup complete! You're ready to use PopLinks Manager. ðŸš€**
