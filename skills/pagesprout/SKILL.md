# Page Sprout Skill

**Commands:** `/poplink`, `/leadstep`, `/bridge page`

Manage Page Sprout (formerly PopLinks) - link shortener, lead pages, and bridge pages via the Page Sprout API.

**Product:** Page Sprout (poplinks.io)  
**Formerly known as:** PopLinks

---

## Authentication

**API Base URL:** `https://api.poplinks.io/api/ai`

**Headers:**
```
Authorization: Bearer YOUR_API_TOKEN
Content-Type: application/json
```

**Get API Token:**
1. Login to PopLinks or MintBird dashboard
2. Settings → API Access
3. Generate/copy token

---

## Command 1: /poplink

**Purpose:** Create, list, or manage PopLinks (shortened URLs)

### List All PopLinks
```
GET /poplinks
```

**Response:**
```json
{
  "type": "response",
  "data": [
    {
      "id": 12345,
      "name": "My Link",
      "destination_url": "https://example.com",
      "visible_url": "my-link",
      "domain_id": 1977,
      "domain_type": "personal",
      "status": 1,
      "clicks": 42
    }
  ]
}
```

### Create PopLink
```
POST /poplinks
```

**Body:**
```json
{
  "name": "Link Name",
  "destination_url": "https://destination.com",
  "visible_url": "slug",
  "domain_id": YOUR_DOMAIN_ID,
  "domain_type": "personal"
}
```

**Fields:**
- `name` — Internal name for the link
- `destination_url` — Full URL with https:// (where traffic goes)
- `visible_url` — The slug/path (no leading slash)
- `domain_id` — ID from `/domains` endpoint
- `domain_type` — `"personal"` or `"system"`
- `status` — 1 = active, 0 = inactive (optional)

**Result:** Creates `yourdomain.com/slug` → `https://destination.com`

### Get Domains
```
GET /domains              # Personal domains
GET /system-domains       # Shared domains (zipbeam, flexylinks, etc.)
```

---

## Command 2: /leadstep

**Purpose:** Manage Lead Pages (lead capture funnels)

### List All Lead Pages
```
GET /lead-pages
```

**Response:**
```json
{
  "type": "response",
  "data": [
    {
      "id": 12345,
      "name": "Lead Page Name",
      "leadpage_keyword": "my-lead-page",
      "conf_keyword": "thank-you",
      "domain_id": 1977,
      "template_id": 5,
      "category_id": 100,
      "main_headline": "Get Your Free Guide",
      "sub_headline": "Limited Time Offer",
      "leads_count": 150
    }
  ]
}
```

### Get Single Lead Page
```
GET /lead-pages/:id
```

### Create Lead Page
```
POST /lead-pages
```

**Body:**
```json
{
  "name": "My Lead Page",
  "template_id": null,
  "category_id": null
}
```

**Note:** Beta users limited to 5 lead pages. Auto-generates landing page, confirmation page, popup, and funnel links.

### Clone Lead Page
```
POST /lead-pages/:id/clone
```

Clones ALL settings, appends "(Copy)" to name.

### Update Lead Page URL
```
PUT /lead-pages/:id/url
```

**Body:**
```json
{
  "leadpage_keyword": "my-updated-slug",
  "conf_keyword": "my-updated-conf-slug",
  "domain_id": YOUR_DOMAIN_ID,
  "domain_type": "personal",
  "redirect_type": "conf_page"
}
```

**Important:** `leadpage_keyword` and `conf_keyword` must be different. Keywords must be unique across poplinks, funnels, links on same domain.

### Update Lead Page Headline
```
PUT /lead-pages/:id/headline
```

**Body:**
```json
{
  "main_headline": "Your New Headline Here"
}
```

### Update Lead Page Video
```
PUT /lead-pages/:id/video
```

**Body:**
```json
{
  "is_video_enabled": true,
  "video_type": "vimeo",
  "video_url": "https://vimeo.com/123456789"
}
```

**Video Types:** `vimeo`, `youtube`, `wistia`, `custom`

### Update Lead Page Bullets
```
PUT /lead-pages/:id/bullets
```

**Body:**
```json
{
  "bullet_title": "What You'll Get:",
  "bullets": [
    { "name": "Benefit one" },
    { "name": "Benefit two", "rotation_number": 1 },
    { "name": "Benefit three", "rotation_number": 2 }
  ]
}
```

**⚠️ WARNING:** This REPLACES all existing bullets. Not a merge.

### Update Lead Page SEO
```
PUT /lead-pages/:id/seo
```

**Body:**
```json
{
  "title": "Page Title",
  "description": "Meta description",
  "keywords": "keyword1, keyword2",
  "author": "Your Name",
  "image": "https://cdn.example.com/image.jpg"
}
```

**Note:** Send as multipart/form-data if uploading image file. Fields set to `"null"` string = null.

### Update Lead Page Template
```
PUT /lead-pages/:id/template
```

**Body:**
```json
{
  "template_id": 5
}
```

Regenerates CSS with new template design.

---

## Command 3: /bridgepage

**Purpose:** Manage Bridge Pages (pre-sell/advertorial pages)

### List All Bridge Pages
```
GET /bridge-pages
```

**Response:**
```json
{
  "type": "response",
  "data": [
    {
      "id": 12345,
      "name": "Bridge Page Name",
      "leadpage_keyword": "my-bridge",
      "redirect_url": "https://offer.com",
      "domain_id": 1977,
      "template_id": 3,
      "category_id": 200,
      "main_headline": "Check This Out",
      "views": 1500
    }
  ]
}
```

### Get Single Bridge Page
```
GET /bridge-pages/:id
```

Includes full settings, links, views, conversion data.

### Create Bridge Page
```
POST /bridge-pages
```

**Body:**
```json
{
  "name": "My Bridge Page",
  "template_id": null,
  "category_id": null
}
```

### Clone Bridge Page
```
POST /bridge-pages/:id/clone
```

Clones ALL settings, appends "(Copy)" to name.

### Rename Bridge Page
```
PUT /bridge-pages/:id/rename
```

**Body:**
```json
{
  "name": "New Name"
}
```

### Update Bridge Page Category
```
PUT /bridge-pages/:id/category
```

**Body:**
```json
{
  "category_id": YOUR_CATEGORY_ID
}
```

### Update Bridge Page URL
```
PUT /bridge-pages/:id/url
```

**Body:**
```json
{
  "leadpage_keyword": "my-url-slug",
  "redirect_url": "https://destination.com",
  "domain_id": YOUR_DOMAIN_ID,
  "domain_type": "personal",
  "redirect_type": "url"
}
```

**Redirect Types:** `url`, `funnel`, `poplink`

### Update Bridge Page Headline
```
PUT /bridge-pages/:id/headline
```

**Body:**
```json
{
  "main_headline": "Check Out This Amazing Offer!"
}
```

### Update Bridge Page Video
```
PUT /bridge-pages/:id/video
```

**Body:**
```json
{
  "is_video_enabled": true,
  "video_type": "vimeo",
  "video_url": "https://vimeo.com/123456789"
}
```

### Update Bridge Page Bullets
```
PUT /bridge-pages/:id/bullets
```

**Body:**
```json
{
  "bullet_title": "Why You Should Act Now:",
  "bullets": [
    { "name": "Limited time offer available" },
    { "name": "Exclusive bonuses included", "rotation_number": 1 },
    { "name": "100% satisfaction guaranteed", "rotation_number": 2 }
  ]
}
```

**⚠️ WARNING:** This REPLACES all existing bullets.

### Update Bridge Page SEO
```
PUT /bridge-pages/:id/seo
```

**Body:**
```json
{
  "title": "Page Title",
  "description": "Meta description",
  "keywords": "keywords here",
  "author": "Your Name",
  "image": "https://cdn.example.com/image.jpg"
}
```

### Update Bridge Page Template
```
PUT /bridge-pages/:id/template
```

**Body:**
```json
{
  "template_id": 3
}
```

---

## Common Endpoints

### Get Categories
```
GET /categories?type=2
```

Returns all categories for organizing pages.

### Get Templates
```
GET /templates
```

Returns template IDs. Note: Names are often empty, use trial and error or check UI for preview.

### Get Stats
```
GET /stats/overview              # Overall account stats
GET /stats/poplinks              # PopLink stats
GET /stats/funnels               # Funnel/page stats
POST /stats/date-range           # Custom date range
```

**Date Range Body:**
```json
{
  "start_date": "2026-01-01",
  "end_date": "2026-01-31"
}
```

---

## Implementation Notes

### Error Handling
- **401 Unauthorized:** Invalid or expired API token
- **404 Not Found:** Invalid endpoint or resource ID
- **422 Unprocessable:** Validation error (check required fields)
- **429 Too Many Requests:** Rate limit hit

### Rate Limits
Check response headers for:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

### Best Practices
1. **Always verify IDs** before updating/deleting
2. **Clone before major changes** to preserve originals
3. **Test with one page** before bulk operations
4. **Keywords must be unique** per domain
5. **Bullet updates are destructive** — fetch existing first if merging

---

## Workflow Examples

### Create a Complete Lead Page
1. `POST /lead-pages` → Create page
2. `PUT /lead-pages/:id/url` → Set URL and domain
3. `PUT /lead-pages/:id/headline` → Set headline
4. `PUT /lead-pages/:id/video` → Add video
5. `PUT /lead-pages/:id/bullets` → Add bullet points
6. `PUT /lead-pages/:id/seo` → Optimize SEO

### Clone and Customize Bridge Page
1. `POST /bridge-pages/:id/clone` → Clone source page
2. `PUT /bridge-pages/:id/rename` → Remove "(Copy)"
3. `PUT /bridge-pages/:id/url` → Update URL slug
4. `PUT /bridge-pages/:id/headline` → Update headline
5. `PUT /bridge-pages/:id/video` → Change video URL

### Create PopLink
1. `GET /domains` → Get your domain ID
2. `POST /poplinks` → Create with domain_id
3. Share: `yourdomain.com/slug`

---

## Configuration Setup

Store your credentials securely:

**credentials/poplinks-api.txt:**
```
API_TOKEN=your_api_token_here
DEFAULT_DOMAIN_ID=your_domain_id
DEFAULT_CATEGORY_ID=your_category_id
```

Load in skill:
```javascript
const fs = require('fs');
const creds = fs.readFileSync('credentials/poplinks-api.txt', 'utf8');
const API_TOKEN = creds.match(/API_TOKEN=(.+)/)[1];
```

---

## API Response Format

All successful responses follow:
```json
{
  "type": "response",
  "data": { ... }
}
```

Error responses:
```json
{
  "type": "error",
  "message": "Error description"
}
```

---

**Documentation:** https://api.poplinks.io/ai-api-docs
