# Letterman API Reference

Base URL: `https://api.letterman.app/v1`

Authentication: JWT Bearer token from `credentials/titanium_software.txt`

## Newsletters

### Create Newsletter
`POST /newsletters`

```json
{
  "name": "Newsletter Name",
  "subject": "Email Subject",
  "from_name": "Sender Name",
  "from_email": "sender@domain.com",
  "reply_to": "reply@domain.com",
  "html_content": "<html>...</html>",
  "text_content": "Plain text version",
  "list_ids": ["list-id-1", "list-id-2"]
}
```

### Get Newsletter
`GET /newsletters/{id}`

### Update Newsletter
`PUT /newsletters/{id}`

### Delete Newsletter
`DELETE /newsletters/{id}`

### Send Newsletter
`POST /newsletters/{id}/send`

```json
{
  "send_at": "2026-03-15T10:00:00Z"  // Optional: schedule for later
}
```

### Test Send
`POST /newsletters/{id}/test`

```json
{
  "emails": ["test@example.com"]
}
```

## Lists

### Create List
`POST /lists`

```json
{
  "name": "List Name",
  "description": "List Description"
}
```

### Get Lists
`GET /lists`

### Get List
`GET /lists/{id}`

### Update List
`PUT /lists/{id}`

### Delete List
`DELETE /lists/{id}`

## Subscribers

### Add Subscriber
`POST /subscribers`

```json
{
  "email": "subscriber@example.com",
  "name": "Subscriber Name",
  "tags": ["tag1", "tag2"],
  "list_ids": ["list-id"],
  "custom_fields": {
    "company": "Company Name",
    "industry": "Restaurant"
  }
}
```

### Get Subscribers
`GET /subscribers?list_id={list_id}&page=1&limit=100`

### Get Subscriber
`GET /subscribers/{id}`

### Update Subscriber
`PUT /subscribers/{id}`

### Delete Subscriber
`DELETE /subscribers/{id}`

### Bulk Import
`POST /subscribers/bulk`

```json
{
  "list_id": "list-id",
  "subscribers": [
    {"email": "user1@example.com", "name": "User 1"},
    {"email": "user2@example.com", "name": "User 2"}
  ]
}
```

## Templates

### Create Template
`POST /templates`

```json
{
  "name": "Template Name",
  "html_content": "<html>...</html>",
  "text_content": "Plain text version"
}
```

### Get Templates
`GET /templates`

### Get Template
`GET /templates/{id}`

### Use Template
When creating newsletter, reference template:

```json
{
  "name": "Newsletter",
  "template_id": "template-id",
  "variables": {
    "header_text": "Special Offer",
    "cta_url": "https://example.com"
  }
}
```

## Analytics

### Get Newsletter Stats
`GET /newsletters/{id}/stats`

Returns:
```json
{
  "sent": 1000,
  "delivered": 980,
  "opened": 450,
  "clicked": 120,
  "bounced": 20,
  "unsubscribed": 5,
  "open_rate": 45.9,
  "click_rate": 12.2
}
```

### Get Subscriber Activity
`GET /subscribers/{id}/activity`

## Common Patterns

### Newsletter Setup Workflow

1. **Create a list**
```bash
POST /lists
{ "name": "FICA Prospects" }
```

2. **Import subscribers**
```bash
POST /subscribers/bulk
{
  "list_id": "list-id",
  "subscribers": [...]
}
```

3. **Create newsletter**
```bash
POST /newsletters
{
  "name": "FICA Tax Credit Info",
  "list_ids": ["list-id"],
  ...
}
```

4. **Test send**
```bash
POST /newsletters/{id}/test
{ "emails": ["your-email@domain.com"] }
```

5. **Send or schedule**
```bash
POST /newsletters/{id}/send
{ "send_at": "2026-03-15T10:00:00Z" }
```

### Variables & Personalization

Use variables in content:
```html
<p>Hi {{name}},</p>
<p>Your company: {{custom_fields.company}}</p>
```

Variables are automatically populated from subscriber data.

## Error Handling

Common error codes:
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid API key)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Server Error

Rate limits:
- 100 requests per minute
- Bulk operations: 1000 subscribers per request
