---
name: letterman-newsletter
description: Create, manage, and send newsletters using Letterman (Titanium Software). Use when working with email newsletters, subscriber lists, campaigns, or any Letterman newsletter tasks including setup, content creation, scheduling, and analytics.
---

# Letterman Newsletter Management

This skill provides workflows for managing newsletters with Letterman, part of the Titanium Software suite.

## Quick Start

Letterman API credentials are stored in `credentials/titanium_software.txt`.

Base API endpoint: `https://api.letterman.app/v1`

## Core Workflows

### 1. Create a Newsletter

Create a new newsletter campaign:

```bash
POST /newsletters
{
  "name": "Newsletter Name",
  "subject": "Email Subject",
  "from_name": "Your Name",
  "from_email": "youremail@domain.com",
  "reply_to": "reply@domain.com"
}
```

### 2. Add Subscribers

Add subscribers to a list:

```bash
POST /subscribers
{
  "email": "subscriber@example.com",
  "name": "Subscriber Name",
  "tags": ["tag1", "tag2"],
  "custom_fields": {
    "field1": "value1"
  }
}
```

### 3. Send Newsletter

Send or schedule a newsletter:

```bash
POST /newsletters/{id}/send
{
  "send_at": "2026-03-15T10:00:00Z"  // Optional: schedule for later
}
```

### 4. List Management

Create and manage subscriber lists:

```bash
POST /lists
{
  "name": "List Name",
  "description": "List Description"
}
```

## API Reference

For complete API documentation, see `references/api.md`.

## Helper Scripts

- `scripts/create_newsletter.js` - Interactive newsletter creation
- `scripts/import_subscribers.js` - Bulk subscriber import from CSV

## Common Tasks

**Setting up your first newsletter:**
1. Create a list for your subscribers
2. Import or add subscribers
3. Create newsletter content
4. Test send to yourself
5. Schedule or send immediately

**Best practices:**
- Always test send before broadcasting
- Segment lists for targeted campaigns
- Track open rates and clicks
- Clean inactive subscribers regularly

## Authentication

All API calls require the JWT token from `credentials/titanium_software.txt`:

```javascript
headers: {
  'Authorization': `Bearer ${LETTERMAN_API_KEY}`,
  'Content-Type': 'application/json'
}
```
