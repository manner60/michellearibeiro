---
name: Letterman Newsletter Manager
slug: letterman-newsletter
author: Michelle Ribeiro / OpenClaw Community
source: https://github.com/openclaw/skills/letterman-newsletter
description: Create, manage, and publish newsletter articles via the Letterman API. Supports article creation, publication management, subscriber handling, and newsletter sending. Works with BizBuzz Calgary, Stampede City Buzz, and other Letterman publications.
version: 1.0.0
---

# Letterman Newsletter Manager

## Purpose

Create, manage, and publish newsletter articles via the Letterman API.

## When to Use

✅ **USE this skill when:**
- Creating new newsletter articles
- Managing publication content
- Sending newsletters to subscribers
- Checking publication status
- Listing articles or subscribers

❌ **DON'T use this skill when:**
- Working with other newsletter platforms (Substack, Beehiiv, etc.)
- Managing non-newsletter content

## Configuration

### API Credentials

The following credentials are required:

```javascript
const LETTERMAN_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Your API key
const PUBLICATION_ID = '69c6f96237ba49fb69a44b52'; // BizBuzz Calgary storage ID
```

**To find your credentials:**
1. Log into https://app.letterman.ai
2. Go to Settings → API Access
3. Copy your API key
4. Get your publication/storage ID from the URL or settings

### Publication IDs

| Publication | Storage ID |
|-------------|------------|
| BizBuzz Calgary | `69c6f96237ba49fb69a44b52` |
| Stampede City Buzz | `69b67eb447872b28b4e043dc` |

## Commands

### 1. Create Article

Create a new article in draft status.

**Required Parameters:**
- `headline` — Article title
- `subHeadline` — Brief description
- `content` — Full HTML content
- `storageId` — Publication ID

**Optional Parameters:**
- `keywords` — Array of SEO tags
- `imageUrl` — Featured image URL

**Example:**
```javascript
const articleData = {
  storageId: '69c6f96237ba49fb69a44b52',
  type: "ARTICLE",
  articleOptions: {
    contentFrom: "CONTENT",
    keepOriginal: true,
    headline: "Your Article Title",
    subHeadline: "Brief description",
    content: `<p>Your HTML content here...</p>`,
    keywords: ["calgary", "business", "grants"],
    imageUrl: "https://example.com/image.jpg"
  }
};
```

**API Call:**
```javascript
POST https://api.letterman.ai/api/ai/newsletters
Authorization: Bearer {API_KEY}
Content-Type: application/json
```

### 2. List Publications

Get all available publications.

**API Call:**
```javascript
GET https://api.letterman.ai/api/ai/newsletters-storage
Authorization: Bearer {API_KEY}
```

### 3. List Articles

Get articles in a publication.

**API Call:**
```javascript
GET https://api.letterman.ai/api/ai/newsletters?storageId={PUBLICATION_ID}
Authorization: Bearer {API_KEY}
```

### 4. Get Article

Retrieve a specific article.

**API Call:**
```javascript
GET https://api.letterman.ai/api/ai/newsletters/{ARTICLE_ID}
Authorization: Bearer {API_KEY}
```

## Article Content Format

### HTML Structure

Use standard HTML tags:

```html
<p>Paragraph text</p>
<p>&nbsp;</p> <!-- Spacer -->
<h2>Section Heading</h2>
<h3>Subheading</h3>
<ul>
  <li>Bullet point</li>
</ul>
<strong>Bold text</strong>
<em>Italic text</em>
<a href="https://example.com">Link text</a>
```

### Best Practices

1. **Use `&nbsp;`** between sections for spacing
2. **Keep paragraphs short** — 2-3 sentences max
3. **Use headers** — H2 for sections, H3 for subsections
4. **Include links** — To sources, resources, related content
5. **Add images** — Featured image + inline images as needed

## Workflow

### Creating a Weekly Article

1. **Draft content** in markdown or HTML
2. **Convert to HTML** if needed
3. **Create article** via API or dashboard
4. **Review in dashboard** — Check formatting, links
5. **Edit if needed**
6. **For Michelle's approved article workflow:** set the article to **PUBLISHED** and **Add To Newsletter Cue / In Article Cue** so it is easy to select from Article Cue blocks later
7. **Get article URL** for newsletter linking
8. **Add to newsletter** — Use Article Cue blocks where appropriate

### Article Statuses

- **DRAFT** — Created, not yet published
- **PUBLISHED** — Live and accessible
- **ARCHIVED** — No longer visible

## Example: Complete Article Creation

```javascript
const https = require('https');

const LETTERMAN_API_KEY = 'your-api-key';
const BIZBUZZ_STORAGE_ID = '69c6f96237ba49fb69a44b52';

function createArticle(articleData) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.letterman.ai',
      port: 443,
      path: '/api/ai/newsletters',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LETTERMAN_API_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(articleData));
    req.end();
  });
}

// Create article
const article = {
  storageId: BIZBUZZ_STORAGE_ID,
  type: "ARTICLE",
  articleOptions: {
    contentFrom: "CONTENT",
    keepOriginal: true,
    headline: "Alberta Small Business Grants: Your 2025 Guide",
    subHeadline: "From $50K innovation grants to training reimbursements",
    content: `<p>Every year, millions in Alberta grants go unclaimed...</p>`,
    keywords: ["alberta", "grants", "small business"],
    imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200"
  }
};

createArticle(article)
  .then(result => console.log('Article created:', result.data._id))
  .catch(err => console.error('Error:', err));
```

## References

- Letterman Dashboard: https://app.letterman.ai
- API Base URL: https://api.letterman.ai/api/ai

## Version History

- 1.0.0 — Initial release with article creation and management
