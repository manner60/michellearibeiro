# Usage Examples

Real-world examples of common PopLinks Manager tasks.

---

## Example 1: Weekly Newsletter Bridge Page Workflow

**Scenario:** You run a weekly newsletter. Each week you need to clone last week's bridge page and update it with new content.

### Step 1: Clone Last Week's Page
```bash
# Clone Newsletter #26 to create #27
curl -X POST https://api.poplinks.io/api/ai/bridge-pages/9876/clone \
  -H "Authorization: Bearer YOUR_TOKEN"

# Response includes new page ID, e.g., 9877
```

### Step 2: Rename to Remove "(Copy)"
```bash
curl -X PUT https://api.poplinks.io/api/ai/bridge-pages/9877/rename \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "27. Newsletter Hour"}'
```

### Step 3: Update URL Slug
```bash
curl -X PUT https://api.poplinks.io/api/ai/bridge-pages/9877/url \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "leadpage_keyword": "27a",
    "redirect_url": "https://yoursite.com/newsletter-27",
    "domain_id": 1977,
    "domain_type": "personal",
    "redirect_type": "url"
  }'
```

### Step 4: Update Headline with This Week's Date
```bash
curl -X PUT https://api.poplinks.io/api/ai/bridge-pages/9877/headline \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"main_headline": "Newsletter Hour - February 24, 2026"}'
```

### Step 5: Update Video URL
```bash
curl -X PUT https://api.poplinks.io/api/ai/bridge-pages/9877/video \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "is_video_enabled": true,
    "video_type": "vimeo",
    "video_url": "https://vimeo.com/987654321"
  }'
```

**Result:** New page ready at `yourdomain.com/27a`

---

## Example 2: Create Affiliate PopLinks in Bulk

**Scenario:** You have 10 affiliate offers to promote. Create clean tracking links for all.

```javascript
const offers = [
  { name: 'FlexiFunnels', url: 'https://flexifunnels.com/?aff=123', slug: 'flexifunnels' },
  { name: 'ClickMagick', url: 'https://clickmagick.com/go/123', slug: 'clickmagick' },
  { name: 'Kajabi', url: 'https://kajabi.com/ref/123', slug: 'kajabi' }
];

const axios = require('axios');

const DOMAIN_ID = 1977;
const TOKEN = 'YOUR_TOKEN';

for (const offer of offers) {
  try {
    const response = await axios.post(
      'https://api.poplinks.io/api/ai/poplinks',
      {
        name: offer.name,
        destination_url: offer.url,
        visible_url: offer.slug,
        domain_id: DOMAIN_ID,
        domain_type: 'personal',
        status: 1
      },
      {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log(`✅ Created: yourdomain.com/${offer.slug}`);
  } catch (error) {
    console.error(`❌ Failed: ${offer.name}`, error.message);
  }
}
```

---

## Example 3: Lead Page for Course Launch

**Scenario:** Launch a new course with lead capture page.

### Create the Page
```bash
curl -X POST https://api.poplinks.io/api/ai/lead-pages \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "AI Automation Course Launch",
    "template_id": 5,
    "category_id": 100
  }'

# Returns new page ID, e.g., 5555
```

### Set URL and Domain
```bash
curl -X PUT https://api.poplinks.io/api/ai/lead-pages/5555/url \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "leadpage_keyword": "ai-automation-free",
    "conf_keyword": "ai-automation-thanks",
    "domain_id": 1977,
    "domain_type": "personal",
    "redirect_type": "conf_page"
  }'
```

### Add Headline
```bash
curl -X PUT https://api.poplinks.io/api/ai/lead-pages/5555/headline \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"main_headline": "Get Free AI Automation Training"}'
```

### Add Pre-Headline
```bash
curl -X PUT https://api.poplinks.io/api/ai/lead-pages/5555/pre-headline \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"sub_headline": "Limited Time Offer"}'
```

### Add Video
```bash
curl -X PUT https://api.poplinks.io/api/ai/lead-pages/5555/video \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "is_video_enabled": true,
    "video_type": "vimeo",
    "video_url": "https://vimeo.com/123456789"
  }'
```

### Add Benefits Bullets
```bash
curl -X PUT https://api.poplinks.io/api/ai/lead-pages/5555/bullets \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bullet_title": "What You'll Learn:",
    "bullets": [
      {"name": "Build AI agents that work for you 24/7"},
      {"name": "Automate repetitive tasks in minutes"},
      {"name": "Save 20+ hours per week"}
    ]
  }'
```

### Set SEO
```bash
curl -X PUT https://api.poplinks.io/api/ai/lead-pages/5555/seo \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Free AI Automation Training | Get Started Today",
    "description": "Learn how to build AI agents that automate your business. Free training + bonuses.",
    "keywords": "ai automation, ai agents, business automation",
    "author": "Your Name"
  }'
```

**Result:** Complete lead page at `yourdomain.com/ai-automation-free`

---

## Example 4: Check Stats Before Campaign

**Scenario:** Before launching new campaign, check current PopLink performance.

```bash
# Get all PopLinks
curl https://api.poplinks.io/api/ai/poplinks \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get stats for specific date range
curl -X POST https://api.poplinks.io/api/ai/stats/date-range \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "start_date": "2026-02-01",
    "end_date": "2026-02-19"
  }'
```

---

## Example 5: Update All Bridge Pages in Category

**Scenario:** You changed your offer. Update all bridge pages in "February Promo" category to point to new URL.

```javascript
const axios = require('axios');

const TOKEN = 'YOUR_TOKEN';
const CATEGORY_ID = 200;
const NEW_OFFER_URL = 'https://newproduct.com';

// Get all bridge pages
const response = await axios.get(
  'https://api.poplinks.io/api/ai/bridge-pages',
  { headers: { 'Authorization': `Bearer ${TOKEN}` } }
);

// Filter by category
const pages = response.data.data.filter(p => p.category_id === CATEGORY_ID);

console.log(`Found ${pages.length} pages to update`);

// Update each one
for (const page of pages) {
  await axios.put(
    `https://api.poplinks.io/api/ai/bridge-pages/${page.id}/url`,
    {
      leadpage_keyword: page.leadpage_keyword, // Keep same slug
      redirect_url: NEW_OFFER_URL, // New destination
      domain_id: page.domain_id,
      domain_type: page.domain_type,
      redirect_type: 'url'
    },
    { headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' } }
  );
  
  console.log(`✅ Updated: ${page.name}`);
}
```

---

## Example 6: Backup All Pages to JSON

**Scenario:** Export all your pages before making bulk changes.

```javascript
const axios = require('axios');
const fs = require('fs');

const TOKEN = 'YOUR_TOKEN';

async function backupAll() {
  // Get all bridge pages
  const bridges = await axios.get(
    'https://api.poplinks.io/api/ai/bridge-pages',
    { headers: { 'Authorization': `Bearer ${TOKEN}` } }
  );
  
  // Get all lead pages
  const leads = await axios.get(
    'https://api.poplinks.io/api/ai/lead-pages',
    { headers: { 'Authorization': `Bearer ${TOKEN}` } }
  );
  
  // Get all poplinks
  const poplinks = await axios.get(
    'https://api.poplinks.io/api/ai/poplinks',
    { headers: { 'Authorization': `Bearer ${TOKEN}` } }
  );
  
  const backup = {
    timestamp: new Date().toISOString(),
    bridge_pages: bridges.data.data,
    lead_pages: leads.data.data,
    poplinks: poplinks.data.data
  };
  
  const filename = `backup-${Date.now()}.json`;
  fs.writeFileSync(filename, JSON.stringify(backup, null, 2));
  
  console.log(`✅ Backup saved: ${filename}`);
  console.log(`📊 Bridge Pages: ${backup.bridge_pages.length}`);
  console.log(`📊 Lead Pages: ${backup.lead_pages.length}`);
  console.log(`📊 PopLinks: ${backup.poplinks.length}`);
}

backupAll();
```

---

## Example 7: Generate Campaign Report

**Scenario:** End of month, need report on all campaign performance.

```javascript
const axios = require('axios');

const TOKEN = 'YOUR_TOKEN';

async function generateReport(startDate, endDate) {
  // Get date range stats
  const stats = await axios.post(
    'https://api.poplinks.io/api/ai/stats/date-range',
    { start_date: startDate, end_date: endDate },
    { headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' } }
  );
  
  // Get all pages for current data
  const bridges = await axios.get(
    'https://api.poplinks.io/api/ai/bridge-pages',
    { headers: { 'Authorization': `Bearer ${TOKEN}` } }
  );
  
  console.log(`\n📊 Campaign Report: ${startDate} to ${endDate}\n`);
  
  // Sort by views
  const sorted = bridges.data.data.sort((a, b) => b.views - a.views);
  
  console.log('Top 10 Performing Pages:');
  sorted.slice(0, 10).forEach((page, i) => {
    console.log(`${i+1}. ${page.name}: ${page.views} views`);
  });
  
  console.log(`\nTotal Views: ${sorted.reduce((sum, p) => sum + p.views, 0)}`);
}

generateReport('2026-02-01', '2026-02-28');
```

---

## Tips for Production Use

### Rate Limiting
```javascript
// Add delay between bulk operations
async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

for (const item of items) {
  await processItem(item);
  await delay(1000); // 1 second between requests
}
```

### Error Handling
```javascript
try {
  const response = await axios.post(url, data, config);
  return response.data;
} catch (error) {
  if (error.response) {
    // Server responded with error
    console.error(`API Error ${error.response.status}:`, error.response.data);
  } else if (error.request) {
    // No response received
    console.error('Network error - no response');
  } else {
    // Other error
    console.error('Error:', error.message);
  }
  throw error;
}
```

### Retry Logic
```javascript
async function apiCallWithRetry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      console.log(`Retry ${i + 1}/${maxRetries}...`);
      await delay(2000 * (i + 1)); // Exponential backoff
    }
  }
}
```

---

For complete API documentation, see [SKILL.md](SKILL.md)
