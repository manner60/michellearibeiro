# MintBird / PopLinks API Reference

**Base URL:** `https://api.poplinks.io/api/v1`  
**Auth:** `Authorization: Bearer {api_key}`

---

## Table of Contents

1. [Domains](#domains)
2. [Groups & Vendors](#groups--vendors)
3. [Templates](#templates)
4. [PopLinks](#poplinks)
5. [Lead Pages](#lead-pages)
6. [Bridge Pages](#bridge-pages)
7. [Leads](#leads)
8. [Categories](#categories)
9. [Stats](#stats)
10. [Ad Campaign Stats](#ad-campaign-stats)
11. [Products & Orders](#products--orders)

---

## Domains

### Get System Domains
```
GET /system-domains
```
Returns shared domains (redeyedeal.com, poplinks.io, etc.)

### Get Personal Domains
```
GET /domains
```
Returns user's custom domains with IDs.

**Response:**
```json
{
  "domains": [
    { "id": 1667, "domain": "chadnicely.com", "user_id": 17727 }
  ]
}
```

---

## Groups & Vendors

### Get Groups
```
GET /groups
```

### Get Vendors
```
GET /vendors
```

---

## Templates

### Get Templates
```
GET /templates
```
Returns available templates for lead/bridge pages.

---

## PopLinks

### List All PopLinks
```
GET /poplinks
```
Returns all poplinks with click stats.

**Response fields:**
- `id`, `name`, `destination_url`, `visible_url`
- `domain_id`, `domain_type` ("personal" | "system")
- `status`: 1=Active, 2=Pending, 4=Inactive
- `stats.total_clicks`, `stats.unique_visitors`, `stats.desktop`, `stats.mobile`

### Get Single PopLink
```
GET /poplinks/:id
```
Includes tier breakdown: `stats.tier_1` through `stats.tier_5`

### Get PopLink Clicks
```
GET /poplinks/:id/clicks?page=1
```
Paginated (50/page). Returns country, city, device, tier, timestamp.

### Create PopLink
```
POST /poplinks
```

**Body:**
```json
{
  "name": "My Link",
  "destination_url": "https://example.com/page",
  "visible_url": "my-slug",
  "domain_id": 1667,
  "domain_type": "personal",
  "group_id": null,
  "vendor_id": null,
  "isAdvanced": 0,
  "is_clocked": 0,
  "start_date": null,
  "end_date": null
}
```

**Required:** `name`, `destination_url`, `visible_url`, `domain_id`

**Validation:** `visible_url` must be unique on the domain.

---

## Lead Pages

### List Lead Pages
```
GET /lead-pages
```

### Get Single Lead Page
```
GET /lead-pages/:id
```
Includes bullets, funnel_links, views, leads.

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

### Update Lead Page URL
```
PUT /lead-pages/:id/url
```

**Body:**
```json
{
  "leadpage_keyword": "my-slug",
  "conf_keyword": "my-conf-slug",
  "domain_id": 1667,
  "domain_type": "personal",
  "redirect_type": "conf_page"
}
```

### Clone Lead Page
```
POST /lead-pages/:id/clone
```
Clones all settings. Name gets "(Copy)" suffix. Stats reset to 0.

---

## Bridge Pages

### List Bridge Pages
```
GET /bridge-pages
```

### Get Single Bridge Page
```
GET /bridge-pages/:id
```

### Create Bridge Page
```
POST /bridge-pages
```

**Body:**
```json
{
  "name": "My Bridge Page",
  "template_id": null,
  "category_id": 1945
}
```

### Update Bridge Page URL
```
PUT /bridge-pages/:id/url
```

**Body:**
```json
{
  "leadpage_keyword": "my-slug",
  "domain_id": 1667,
  "domain_type": "personal",
  "redirect_type": "url",
  "redirect_url": "https://destination.com"
}
```

### Clone Bridge Page
```
POST /bridge-pages/:id/clone
```
Clones all settings including CSS, bullets, top bar, footer, banner, SEO.

---

## Leads

### Get All Leads
```
GET /leads?page=1
```
Paginated (20/page).

### Get Leads by Funnel
```
GET /leads/funnel/:funnel_id?page=1
```

---

## Categories

### List Categories
```
GET /categories?type=2
```
- `type=1` — Lead page categories
- `type=2` — Bridge page categories

### Create Category
```
POST /categories
```

**Body:**
```json
{
  "name": "My Category",
  "type": "2",
  "domain_id": null
}
```

### Update Category
```
PUT /categories/:id
```

### Delete Category
```
DELETE /categories/:id
```
Cannot delete if funnels are assigned.

---

## Stats

### Stats Overview
```
GET /stats/overview
```
Returns totals for poplinks (count, clicks) and funnels (count, views, leads).

### PopLink Stats
```
GET /stats/poplinks
```
Returns raw/unique clicks per poplink.

### Funnel Stats
```
GET /stats/funnels
```
Returns views/leads per funnel.

### Stats by Date Range
```
POST /stats/date-range
```

**Body:**
```json
{
  "start_date": "2026-01-01",
  "end_date": "2026-01-31"
}
```

---

## Ad Campaign Stats

### List All Ad Campaigns
```
GET /ad-stats/campaigns
```

**Response:**
```json
{
  "campaigns": [
    {
      "id": 118,
      "name": "Local Newsletter Hustle",
      "meta_campaign_type": "sales_funnel",
      "campaign_setups": [...],
      "funnel_setups": [...]
    }
  ]
}
```

### Get Single Campaign
```
GET /ad-stats/campaigns/:id
```

### Get Campaign Plans
```
GET /ad-stats/campaigns/:id/plans
```

### Get Campaign Insights (Stats)
```
GET /ad-stats/campaigns/:id/insights?date_range=yesterday&status=ALL
```

**date_range options:**
- `yesterday` ✅ (works correctly)
- `today` ✅
- `last_7_days` ⚠️ (may return all-time)
- `last_30_days` ⚠️
- `all`
- Custom dates ⚠️ (not reliable)

**Response:**
```json
{
  "campaign_id": "118",
  "campaign_name": "Local Newsletter Hustle",
  "date_range": {
    "date_start": "2026-02-08",
    "date_stop": "2026-02-08"
  },
  "ad_sets": [...],
  "totals": {
    "spend": 197.47,
    "clicks": 165,
    "impressions": 3451,
    "leads_count": 10,
    "sales_count": 2,
    "sales_amount": 44,
    "ctr": 4.78,
    "cpc": 1.20,
    "cpl": 19.75,
    "cpa": 98.74,
    "profit": -153.47
  }
}
```

**Calculated metrics:**
- **AOV** = sales_amount / sales_count
- **ROAS** = sales_amount / spend

---

## Products & Orders

### Get Products
```
GET /products?type=physical
```

### Get Orders
```
POST /orders?page=1
```

**Body:**
```json
{
  "product_ids": [1, 2, 3]
}
```

---

## Common Response Format

**Success:**
```json
{
  "success": true,
  "message": "Resource fetched successfully.",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

## Error Codes

| Code | Meaning |
|------|---------|
| 401 | Unauthorized — invalid API key |
| 404 | Resource not found |
| 422 | Validation error — check required fields |
| 500 | Server error |
