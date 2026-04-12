# Global Control Skill

**🎯 TRIGGER:** `/tag`, `/contact`, `/broadcast`, `/reactivation`, `/workflow`

**⚡ EXECUTION STYLE:** Fast execution, file-based JSON for reliability

---

## Commands

### 1. `/tag`

**Purpose:** Tag a contact in Global Control (auto-creates contact if email doesn't exist)

**THE ONLY QUESTION:** "What's the name, email, and tag name?"

**UNLESS** user specifies a group: "show me tags in [group name]" → List all tags in that group first

**Then execute:**
1. Get tag ID from tag name (call Global Control API)
2. Write JSON to file (NEVER inline - it fails)
3. Fire tag using curl with --data-binary @file
4. Auto-creates contact if email doesn't exist
5. Report success

**THE EXACT METHOD (NEVER DEVIATE):**
```powershell
# Step 1: Get tag ID
$apiKey = "9ee9d1006f37fe14b3b9fe06b15ce39d207e3b61d765914a1b6bc7a2f8030219"
$tags = curl.exe -H "X-API-KEY: $apiKey" "https://api.globalcontrol.io/api/ai/tags" | ConvertFrom-Json
$tagId = ($tags.data | Where-Object { $_.name -eq 'TAG_NAME' })._id

# Step 2: Write JSON to file
@{email="user@example.com";firstName="First";lastName="Last"} | ConvertTo-Json | Out-File "tag-fire.json" -Encoding UTF8

# Step 3: Fire tag
curl.exe -X POST -H "X-API-KEY: $apiKey" -H "Content-Type: application/json" --data-binary "@tag-fire.json" "https://api.globalcontrol.io/api/ai/tags/fire-tag/$tagId"
```

**CRITICAL - WHY THIS FORMAT:**
- ✅ File-based JSON works (inline fails with "Invalid Json Format")
- ✅ Auto-creates contact if email doesn't exist
- ✅ Applies tag immediately
- ❌ PowerShell Invoke-RestMethod fails
- ❌ Inline curl -d '{}' fails

**Example:**
```
User: /tag
Me: What's the name, email, and tag name?
User: John Doe, john@example.com, Interested Lead
Me: ✅ Tag "Interested Lead" applied to john@example.com
```

---

### 2. `/contact`

**Purpose:** Get full contact details from Global Control

**THE ONLY QUESTION:** "What's the person's name or email?"

**Then execute:**
1. Use Global Control API with `?search=` parameter (EFFICIENT - searches all 42k+ contacts)
2. URL encode spaces as %20 (e.g., James Coe becomes James%20Coe)
3. Get full contact details
4. Display ALL available information

**THE EXACT METHOD:**
Search by name or email using: `https://api.globalcontrol.io/api/ai/contacts?search=TERM`
Then get full details by contact ID: `https://api.globalcontrol.io/api/ai/contacts/CONTACT_ID`

**DISPLAY FORMAT:**
- Basic Info: Name, Email, Phone, Contact ID
- Status: Email Valid, Contact Dead (if true), Last Email Sent, Last Active, Created Date
- Location: Country, City, Timezone, IP Address
- Custom Fields: All values
- Engagement: Tag count, Workflow count

**CRITICAL RULES:**
- Always use `?search=` parameter (efficient, searches all 42k+ contacts)
- NEVER manually paginate through contacts
- Show Contact Dead status prominently if true
- Display ALL available data

**Example:**
```
User: /contact
Me: What's the person's name or email?
User: john@example.com
Me: [displays full contact details]
```

---

### 3. `/broadcast`

**Purpose:** Send email broadcast to contacts

**WORKFLOW:**
1. Ask: "What's the main topic/hook?"
2. Ask: "What's the CTA link?"
3. Generate email using Email Formula skill (3 subject lines, 1 preview, 1 email)
4. Create broadcast in Global Control via API
5. Offer: "Want me to send you a test?"
6. Send test email to Chad via GC broadcast API
7. Chad approves
8. Ask: "Do you want to send to: 1. Actives 2. A specific tag"
9. Chad tells me
10. Report: "Sending to X contacts"
11. Chad says: "Send it"
12. Send via GC broadcast API

**CRITICAL API ISSUE (UNRESOLVED):**
- Endpoint: `https://api.globalcontrol.io/api/broadcast-emails/process-emails-beta`
- Returns: "Not Authorized" (401) even with correct API key
- API Key works for other endpoints (contacts, tags, domains)
- Broadcast endpoint requires different auth or permissions

**WORKING ENDPOINTS:**
- GET /api/ai/domains (works)
- GET /api/ai/tags (works)
- POST /api/ai/contacts (works)
- POST /api/ai/tags/fire-tag/{tagId} (works)

**NOT WORKING:**
- POST /api/broadcast-emails/process-emails-beta (401 Not Authorized)
- POST /api/ai/broadcast-emails/send-email (Invalid Json Format)
- POST /api/ai/broadcast-emails/active-contacts-count (Invalid Json Format)

**TEMPORARY WORKAROUND:**
- Create workflow in GC that sends email when tag is fired
- Fire tag via API (this works)
- Email gets sent via workflow

**This workflow is INCOMPLETE until broadcast API authorization is resolved.**

---

### 4. `/reactivation`

**Purpose:** Manage email re-engagement campaigns

**Full protocol documented in:** `skills/reengagement/SKILL.md`

**Overview:**
- Import contacts from CSV/XLS
- Apply progressive sending pace (Mild/Normal/Aggressive)
- 8-hour daily windows
- Auto-tag contacts in GC to trigger workflows
- Pause/resume/cancel controls
- Hourly limits (max 400/hour)
- Saves to JSON, updates Kanban board
- Uses cron jobs for persistent execution

**Key Points:**
- For re-engaging inactive contact lists
- Progressive pace options
- Full control over sending
- Persistent execution via cron

---

### 5. `/workflow`

**Purpose:** Create automated email workflows in Global Control

**Ask these 4 questions (MANDATORY ORDER):**
1. "How many emails?"
2. "How many days apart?"
3. "What's the link to place?"
4. "What's the workflow about?"

**Then build the workflow with full email content using this pattern:**

```json
{
  "name": "Workflow Name",
  "workflowGroupId": "...",
  "flows": [
    {
      "type": "SEND_EMAIL",
      "index": 0,
      "data": {
        "name": "Email Name",
        "subject": "Subject Line",
        "body": "<p>Full HTML content here</p>",
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

**Critical Rules:**
- TIMER flows create delays (NOT dayDelay/hourDelay/minuteDelay properties)
- Each flow needs sequential index (0, 1, 2, 3...)
- Email content goes in `data.body` as HTML
- Always include FULL email content (never placeholders)
- File → UTF8 bytes → PUT request is the only encoding that works reliably

**PUT /workflows/{id} Behavior:**
- PUT **APPENDS** flows instead of replacing them
- If workflow has 3 flows and you PUT with 4 flows → You get 7 flows
- Safe pattern: GET current state → add new flow → PUT complete array

**Example timeIn values:** "days", "hours", "minutes"

**Example:**
```
User: /workflow
Me: How many emails?
User: 3
Me: How many days apart?
User: 2
Me: What's the link to place?
User: https://example.com
Me: What's the workflow about?
User: Dog walking service follow-up
Me: [creates 3-email workflow with 2-day delays between each]
```

---

## API Details

**Base URL:** `https://api.globalcontrol.io/api/ai`

**Authentication:** `X-API-KEY: 9ee9d1006f37fe14b3b9fe06b15ce39d207e3b61d765914a1b6bc7a2f8030219`

### Key Endpoints

| Action | Method | Endpoint |
|--------|--------|----------|
| Get Contacts | GET | `/contacts?search=TERM` |
| Get Contact | GET | `/contacts/{id}` |
| Get Tags | GET | `/tags` |
| Fire Tag | POST | `/tags/fire-tag/{tagId}` |
| Get Workflows | GET | `/workflows` |
| Create Workflow | POST | `/workflows` |
| Update Workflow | PUT | `/workflows/{id}` |
| Get Domains | GET | `/domains` |

---

## Critical Rules (MEMORIZED)

1. **Tag firing:** Always use file-based JSON with curl --data-binary
2. **Contact search:** Always use ?search= parameter (don't paginate)
3. **Workflows:** PUT appends flows (GET first, then add, then PUT)
4. **Broadcasts:** API has auth issues (use workflow workaround)
5. **Reactivation:** Full skill in separate file

**API Key:** 9ee9d1006f37fe14b3b9fe06b15ce39d207e3b61d765914a1b6bc7a2f8030219

**SKILL CREATED:** 2026-03-16
