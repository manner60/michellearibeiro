# Letterman API Reference

**Base URL:** `https://api.letterman.ai/api`  
**Auth:** `Authorization: Bearer {jwt_token}`

---

## Table of Contents

1. [User](#user)
2. [Publications](#publications)
3. [Articles](#articles)

---

## User

### Get Current User
```
GET /user
```
Retrieves the current authenticated user's information.

**Response:**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "User Name"
}
```

---

## Publications

### List Publications
```
GET /newsletters-storage
```
Retrieves list of all publications (newsletter storage containers).

**Response:**
```json
{
  "data": [
    {
      "id": "pub_id",
      "name": "My Newsletter",
      "description": "Newsletter description"
    }
  ]
}
```

---

## Articles

### List Articles
```
GET /newsletters-storage/{storageId}/newsletters?state=DRAFT&type=ARTICLE
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `state` | string | Filter by state: `DRAFT`, `PUBLISHED`, `ARCHIVED` |
| `type` | string | Filter by type: `ARTICLE` |

**Response:**
```json
{
  "data": [
    {
      "id": "article_id",
      "title": "Article Title",
      "state": "DRAFT",
      "type": "ARTICLE"
    }
  ]
}
```

### Get Article
```
GET /newsletters/:id
```
Retrieves a specific article by ID.

### Create Article
```
POST /newsletters
```
Creates a new article using AI generation.

**Request Body:**
```json
{
  "storageId": "publication_id",
  "type": "ARTICLE",
  "articleOptions": {
    "contentFrom": "URL",
    "url": "https://source-article.com/page",
    "wordsCount": 500,
    "keywords": "keyword1,keyword2",
    "imageUrl": "https://example.com/image.jpg",
    "aiModel": "OPEN_AI"
  }
}
```

**Required Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `storageId` | string | Publication ID |
| `type` | string | Must be `"ARTICLE"` |
| `articleOptions.contentFrom` | string | `"URL"` or `"CONTENT"` |
| `articleOptions.aiModel` | string | AI model to use (e.g., `"OPEN_AI"`) |

**Optional Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `articleOptions.url` | string | Source URL (required if contentFrom is "URL") |
| `articleOptions.content` | string | Source text (required if contentFrom is "CONTENT") |
| `articleOptions.wordsCount` | number | Target word count |
| `articleOptions.keywords` | string | Comma-separated keywords |
| `articleOptions.imageUrl` | string | Article image URL |

### Check URL Path
```
POST /newsletters/check-url-path
```
Checks if a URL path/slug is available.

**Request Body:**
```json
{
  "urlPath": "my-article-slug",
  "newsletterId": "article_id"
}
```

### Update SEO Settings
```
POST /newsletters/update-seo-settings/:id
```
Updates SEO settings for an article.

**Request Body:**
```json
{
  "urlPath": "my-article-slug",
  "title": "SEO Title",
  "description": "Meta description for search engines",
  "noIndex": false
}
```

| Field | Type | Description |
|-------|------|-------------|
| `urlPath` | string | URL slug |
| `title` | string | SEO title |
| `description` | string | Meta description |
| `noIndex` | boolean | If true, tells search engines not to index |

### Update Article Summary
```
POST /newsletters/update-article-summary/:id
```
Updates article summary/preview.

**Request Body:**
```json
{
  "summary": {
    "title": "Article Title",
    "description": "Article description",
    "imageUrl": "https://example.com/image.jpg",
    "content": "Summary content text"
  }
}
```

### Update Add To Newsletter Cue
```
POST /newsletters/update-add-to-newsletter-cue/:id
```
Controls whether article is queued for newsletter.

**Request Body:**
```json
{
  "addToCue": true
}
```

### Update Add To News Feed
```
POST /newsletters/update-add-to-news-feed/:id
```
Controls whether article appears in news feed.

**Request Body:**
```json
{
  "addToNewsFeed": true
}
```

### Get Suggested Article Keywords
```
POST /newsletters/get-suggested-article-keywords
```
Gets AI-suggested keywords for article content.

**Request Body:**
```json
{
  "articleOptions": {
    "location": "US",
    "contentFrom": "URL",
    "url": "https://source-article.com/page",
    "aiModel": "OPEN_AI"
  }
}
```

For content-based suggestions:
```json
{
  "articleOptions": {
    "location": "US",
    "contentFrom": "CONTENT",
    "content": "Your article content here...",
    "aiModel": "OPEN_AI"
  }
}
```

---

## Common Response Format

**Success:**
```json
{
  "success": true,
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
| 401 | Unauthorized — invalid/expired JWT token |
| 404 | Resource not found |
| 422 | Validation error — check required fields |
| 500 | Server error |
