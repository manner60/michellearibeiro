# Global Control API Reference

## Authentication
```
X-API-KEY: 9ee9d1006f37fe14b3b9fe06b15ce39d207e3b61d765914a1b6bc7a2f8030219
```

## Base URL
```
https://api.globalcontrol.io/api/ai
```

---

## Contacts

### Search Contacts (RECOMMENDED)
```http
GET /contacts?search=search_term
```

**Example:**
```http
GET /contacts?search=John%20Doe
GET /contacts?search=john@example.com
```

**Why use ?search=:**
- Searches all 42k+ contacts efficiently
- No pagination needed
- Searches name, email, phone

### Get Contact by ID
```http
GET /contacts/{contactId}
```

### Create Contact
```http
POST /contacts
Content-Type: application/json

{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "555-0100"
}
```

---

## Tags

### Get All Tags
```http
GET /tags
```

### Fire Tag (Apply to Contact)
```http
POST /tags/fire-tag/{tagId}
Content-Type: application/json

{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

**CRITICAL:** Use file-based JSON with curl --data-binary

```powershell
# Write to file first
@{email="user@example.com";firstName="John";lastName="Doe"} | ConvertTo-Json | Out-File "tag-fire.json" -Encoding UTF8

# Then fire with curl
curl.exe -X POST -H "X-API-KEY: ..." -H "Content-Type: application/json" --data-binary "@tag-fire.json" "https://api.globalcontrol.io/api/ai/tags/fire-tag/TAG_ID"
```

**Why file-based?**
- Inline JSON fails with "Invalid Json Format"
- PowerShell Invoke-RestMethod fails
- File-based works reliably

---

## Workflows

### Get All Workflows
```http
GET /workflows
```

### Get Workflow by ID
```http
GET /workflows/{workflowId}
```

### Create Workflow
```http
POST /workflows
Content-Type: application/json

{
  "name": "Workflow Name",
  "workflowGroupId": "group_id_here"
}
```

### Update Workflow (ADDS flows, doesn't replace!)
```http
PUT /workflows/{workflowId}
Content-Type: application/json

{
  "name": "Workflow Name",
  "workflowGroupId": "group_id_here",
  "flows": [
    {
      "type": "SEND_EMAIL",
      "index": 0,
      "data": {
        "name": "Email 1",
        "subject": "Subject Line",
        "body": "<p>HTML content</p>",
        "from_email": "chad",
        "from_name": "Chad Nicely",
        "reply_to": "support@nicelysupport.com"
      }
    },
    {
      "type": "TIMER",
      "index": 1,
      "data": {
        "waitFor": "1",
        "timeIn": "days"
      }
    }
  ]
}
```

**CRITICAL:** PUT appends flows, doesn't replace!

**Safe Pattern:**
1. GET current workflow
2. Add new flow to existing array
3. PUT complete array

**Encoding for PUT:**
```powershell
$json = Get-Content "workflow.json" -Raw
$bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
Invoke-RestMethod -Uri "..." -Method Put -Headers $headers -Body $bytes
```

---

## Broadcast Emails (BROKEN)

### Send Broadcast (NOT WORKING)
```http
POST /broadcast-emails/process-emails-beta
```

**Status:** Returns 401 "Not Authorized" even with correct API key

**Workaround:**
- Create workflow that sends email
- Fire tag to trigger workflow
- Email sends via workflow

---

## Domains

### Get All Domains
```http
GET /domains
```

### Get Integration Domains
```http
POST /domains/smtp-domain-list
```

---

## Custom Fields

### Get All Custom Fields
```http
GET /custom-fields
```

### Get Custom Field Groups
```http
GET /custom-field-groups
```

---

## Tag Groups

### Get All Tag Groups
```http
GET /tag-groups
```

---

## Flow Types

| Type | Purpose |
|------|---------|
| `SEND_EMAIL` | Send an email |
| `TIMER` | Add delay between emails |
| `ADD_TAG` | Add tag to contact |
| `REMOVE_TAG` | Remove tag from contact |

---

## Timer Options

**timeIn values:**
- "days"
- "hours" 
- "minutes"

**Example:**
```json
{
  "type": "TIMER",
  "index": 1,
  "data": {
    "waitFor": "2",
    "timeIn": "days"
  }
}
```

---

## Common Issues & Solutions

### "Invalid Json Format"
**Cause:** Inline JSON or PowerShell encoding
**Fix:** Use file-based JSON with curl --data-binary

### "Not Authorized" (401)
**Cause:** Broadcast emails endpoint requires different permissions
**Fix:** Use workflow + tag firing workaround

### Flows Not Updating
**Cause:** PUT appends instead of replaces
**Fix:** GET current state, modify array, PUT complete array

### Contact Search Slow
**Cause:** Paginating through all contacts
**Fix:** Use ?search= parameter

