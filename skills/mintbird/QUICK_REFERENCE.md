# Quick Reference Guide

## Most Common Tasks

### 1. Create a PopLink (Shortened URL)

```bash
curl -X POST https://api.poplinks.io/api/ai/poplinks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Link",
    "destination_url": "https://example.com",
    "visible_url": "mylink",
    "domain_id": YOUR_DOMAIN_ID,
    "domain_type": "personal"
  }'
```

**Result:** Creates `yourdomain.com/mylink` → `https://example.com`

---

### 2. Clone a Bridge Page

```bash
curl -X POST https://api.poplinks.io/api/ai/bridge-pages/12345/clone \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Result:** Creates exact copy with "(Copy)" appended to name

---

### 3. Update Bridge Page Headline

```bash
curl -X PUT https://api.poplinks.io/api/ai/bridge-pages/12345/headline \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "main_headline": "New Headline Here"
  }'
```

---

### 4. Change Bridge Page URL Slug

```bash
curl -X PUT https://api.poplinks.io/api/ai/bridge-pages/12345/url \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "leadpage_keyword": "new-slug",
    "redirect_url": "https://offer.com",
    "domain_id": YOUR_DOMAIN_ID,
    "domain_type": "personal",
    "redirect_type": "url"
  }'
```

---

### 5. Update Bridge Page Video

```bash
curl -X PUT https://api.poplinks.io/api/ai/bridge-pages/12345/video \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "is_video_enabled": true,
    "video_type": "vimeo",
    "video_url": "https://vimeo.com/123456789"
  }'
```

---

### 6. List All Your Bridge Pages

```bash
curl https://api.poplinks.io/api/ai/bridge-pages \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 7. Get Your Domain ID

```bash
curl https://api.poplinks.io/api/ai/domains \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 8. Get Your Categories

```bash
curl https://api.poplinks.io/api/ai/categories?type=2 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 9. Create Lead Page

```bash
curl -X POST https://api.poplinks.io/api/ai/lead-pages \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Lead Page",
    "template_id": null,
    "category_id": null
  }'
```

---

### 10. Update Lead Page Bullets

```bash
curl -X PUT https://api.poplinks.io/api/ai/lead-pages/12345/bullets \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bullet_title": "What You Get:",
    "bullets": [
      {"name": "Benefit one"},
      {"name": "Benefit two"},
      {"name": "Benefit three"}
    ]
  }'
```

**⚠️ WARNING:** This REPLACES all existing bullets!

---

## PowerShell Examples

### Create PopLink
```powershell
$headers = @{
    "Authorization" = "Bearer YOUR_TOKEN"
    "Content-Type" = "application/json"
}

$body = @{
    name = "Test Link"
    destination_url = "https://example.com"
    visible_url = "test"
    domain_id = YOUR_DOMAIN_ID
    domain_type = "personal"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://api.poplinks.io/api/ai/poplinks" `
  -Method Post -Headers $headers -Body $body
```

### Clone Bridge Page
```powershell
$headers = @{
    "Authorization" = "Bearer YOUR_TOKEN"
}

Invoke-RestMethod -Uri "https://api.poplinks.io/api/ai/bridge-pages/12345/clone" `
  -Method Post -Headers $headers
```

---

## JavaScript/Node.js Examples

### Create PopLink
```javascript
const axios = require('axios');

const response = await axios.post(
  'https://api.poplinks.io/api/ai/poplinks',
  {
    name: 'Test Link',
    destination_url: 'https://example.com',
    visible_url: 'test',
    domain_id: YOUR_DOMAIN_ID,
    domain_type: 'personal'
  },
  {
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN',
      'Content-Type': 'application/json'
    }
  }
);

console.log(response.data);
```

### Update Bridge Page Headline
```javascript
const response = await axios.put(
  'https://api.poplinks.io/api/ai/bridge-pages/12345/headline',
  {
    main_headline: 'New Headline'
  },
  {
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN',
      'Content-Type': 'application/json'
    }
  }
);
```

---

## Common Workflows

### Complete Bridge Page Setup
1. Clone existing page → `POST /bridge-pages/:id/clone`
2. Rename → `PUT /bridge-pages/:id/rename`
3. Update URL → `PUT /bridge-pages/:id/url`
4. Change headline → `PUT /bridge-pages/:id/headline`
5. Update video → `PUT /bridge-pages/:id/video`
6. Update bullets → `PUT /bridge-pages/:id/bullets`

### Complete Lead Page Setup
1. Create page → `POST /lead-pages`
2. Set URL → `PUT /lead-pages/:id/url`
3. Add headline → `PUT /lead-pages/:id/headline`
4. Add video → `PUT /lead-pages/:id/video`
5. Add bullets → `PUT /lead-pages/:id/bullets`
6. Set SEO → `PUT /lead-pages/:id/seo`

---

## Tips & Tricks

✅ **DO:**
- Test with one page before bulk operations
- Clone pages before major changes
- Use descriptive names for easy management
- Keep slugs short and memorable

❌ **DON'T:**
- Use duplicate keywords on same domain
- Update bullets without fetching existing first (if merging)
- Delete pages without backing up
- Share API tokens publicly

---

## Troubleshooting

**401 Unauthorized**
- Check API token is correct
- Token may have expired, generate new one

**404 Not Found**
- Verify resource ID exists
- Check endpoint spelling

**422 Validation Error**
- Check all required fields present
- Verify field formats (URLs, etc.)

**Slug already exists**
- Keywords must be unique per domain
- Check existing pages/poplinks first

---

For complete documentation, see [SKILL.md](SKILL.md)
