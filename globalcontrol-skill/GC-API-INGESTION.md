# GLOBAL CONTROL API — COMPREHENSIVE INGESTION REPORT
**Generated:** 2026-03-12  
**Source:** https://api.globalcontrol.io/ai-api-docs  
**Status:** Complete multi-pass ingestion

---

## PASS 1 — STRUCTURE DISCOVERY ✓

### Documentation Skeleton

**Total Sections:** 12  
**Total Endpoints:** 75+

**Section Map:**
1. **Basics** (Authentication, Base URL)
2. **User** (1 endpoint)
3. **Contacts** (13 endpoints)
4. **Tag Groups** (5 endpoints)
5. **Tags Labels** (5 endpoints)
6. **Tags** (8 endpoints)
7. **Integrations** (3 endpoints)
8. **Sub Users** (5 endpoints)
9. **Custom Field Groups** (5 endpoints)
10. **Custom Fields** (5 endpoints)
11. **Workflow Groups** (5 endpoints)
12. **Workflows** (9 endpoints)
13. **Domains** (6 endpoints)
14. **Broadcast Email** (9 endpoints)
15. **Email Reports** (3 endpoints)

---

## PASS 2 — AUTH + TRANSPORT EXTRACTION ✓

### GLOBAL_TRANSPORT_RULES

```yaml
authentication:
  type: header
  header_name: X-API-KEY
  format: "{api_key}"
  location: All requests

base_url: https://api.globalcontrol.io/api/ai

content_type:
  request: application/json
  response: application/json

response_envelope:
  success:
    type: response
    data: <payload>
  
  error:
    type: error
    error:
      name: string
      message: string
      time: ISO8601
      status: number
      code: string
      details: string
      description: string
      errorData: any
      logoutUser: boolean

trailing_slash: not required

http_methods: GET, POST, PUT, DELETE
```

**Auth Header Example:**
```
X-API-KEY: your_api_key_here
```

**Success Response Wrapper:**
```json
{
  "type": "response",
  "data": {
    // actual payload here
  }
}
```

**Error Response Wrapper:**
```json
{
  "type": "error",
  "error": {
    "name": "ErrorMessage",
    "message": "Something Went Wrong",
    "time": "2026-02-18T20:56:24.539Z",
    "status": 400,
    "code": "",
    "details": "",
    "description": "Something Went Wrong",
    "errorData": "",
    "logoutUser": false
  }
}
```

---

## PASS 3 — ENDPOINT EXTRACTION

### User Endpoints (1)

#### GET /me
**Title:** Get Authenticated User  
**Method:** GET  
**Path:** `/me`  
**Auth:** Required  
**Params:** None  
**Response:** User object with platform info

---

### Contacts Endpoints (13)

#### GET /contacts
**Title:** Get all Contacts  
**Method:** GET  
**Path:** `/contacts`  
**Auth:** Required  
**Query Params:**
- `page` (number, optional) - Page number
- `limit` (number, optional) - Results per page
- `search` (string, optional) - Search term

**Response:** Paginated list of contacts

#### GET /contacts/active-open
**Title:** Get Active Open Contacts  
**Method:** GET  
**Path:** `/contacts/active-open`  
**Description:** Contacts who have opened emails

#### GET /contacts/active-click
**Title:** Get Active Click Contacts  
**Method:** GET  
**Path:** `/contacts/active-click`  
**Description:** Contacts who have clicked links in emails

#### GET /contacts/inactive
**Title:** Get In-Active Contacts  
**Method:** GET  
**Path:** `/contacts/inactive`  
**Description:** Contacts with no recent engagement

#### GET /contacts/passive
**Title:** Get Passive Contacts  
**Method:** GET  
**Path:** `/contacts/passive`  
**Description:** Contacts with minimal engagement

#### GET /contacts/new
**Title:** Get New Contacts  
**Method:** GET  
**Path:** `/contacts/new`  
**Description:** Recently added contacts

#### GET /contacts/undeliverable
**Title:** Get Undeliverable Contacts  
**Method:** GET  
**Path:** `/contacts/undeliverable`  
**Description:** Contacts with delivery failures

#### GET /contacts/dead
**Title:** Get Dead Contacts  
**Method:** GET  
**Path:** `/contacts/dead`  
**Description:** Inactive/unengaged contacts

#### GET /contacts/:contactId
**Title:** Get a Contact  
**Method:** GET  
**Path:** `/contacts/{contactId}`  
**Path Params:**
- `contactId` (string, required) - Contact ID

#### POST /contacts
**Title:** Create a Contact  
**Method:** POST  
**Path:** `/contacts`  
**Body:**
```json
{
  "email": "string (required)",
  "firstName": "string",
  "lastName": "string",
  "phone": "string",
  "tags": ["tag_id_1", "tag_id_2"],
  "customFields": [
    {
      "customFieldId": "string",
      "value": "string"
    }
  ]
}
```

#### PUT /contacts/:contactId
**Title:** Update a Contact  
**Method:** PUT  
**Path:** `/contacts/{contactId}`  
**Body:** Same as create (all fields optional)

#### DELETE /contacts/:contactId
**Title:** Delete a Contact  
**Method:** DELETE  
**Path:** `/contacts/{contactId}`

#### GET /contacts/:contactId/details
**Title:** Get Contact Details  
**Method:** GET  
**Path:** `/contacts/{contactId}/details`  
**Description:** Full contact details including activity history

---

### Tag Groups Endpoints (5)

#### GET /tag-groups
**Title:** Get all groups  
**Method:** GET  
**Path:** `/tag-groups`

#### GET /tag-groups/:groupId
**Title:** Get a group  
**Method:** GET  
**Path:** `/tag-groups/{groupId}`

#### POST /tag-groups
**Title:** Create a Group  
**Method:** POST  
**Path:** `/tag-groups`  
**Body:**
```json
{
  "name": "string (required)",
  "description": "string"
}
```

#### PUT /tag-groups/:groupId
**Title:** Update a Group  
**Method:** PUT  
**Path:** `/tag-groups/{groupId}`

#### DELETE /tag-groups/:groupId
**Title:** Delete a Group  
**Method:** DELETE  
**Path:** `/tag-groups/{groupId}`

---

### Tags Labels Endpoints (5)

#### GET /tags/labels
**Title:** Get Labels  
**Method:** GET  
**Path:** `/tags/labels`

#### GET /tags/labels/:labelId
**Title:** Get a Label  
**Method:** GET  
**Path:** `/tags/labels/{labelId}`

#### POST /tags/labels
**Title:** Create a Label  
**Method:** POST  
**Path:** `/tags/labels`

#### PUT /tags/labels/:labelId
**Title:** Update a Label  
**Method:** PUT  
**Path:** `/tags/labels/{labelId}`

#### DELETE /tags/labels/:labelId
**Title:** Delete a Label  
**Method:** DELETE  
**Path:** `/tags/labels/{labelId}`

---

### Tags Endpoints (8)

#### GET /tags
**Title:** Get all Tags  
**Method:** GET  
**Path:** `/tags`  
**Response:** Array of tag objects

#### GET /tags/:tagId
**Title:** Get a Tag  
**Method:** GET  
**Path:** `/tags/{tagId}`

#### POST /tags
**Title:** Create a Tag  
**Method:** POST  
**Path:** `/tags`  
**Body:**
```json
{
  "name": "string (required)",
  "description": "string",
  "groupId": "string",
  "isHot": boolean
}
```

#### POST /tags/fire-tag/:tagId
**Title:** Fire a Tag  
**Method:** POST  
**Path:** `/tags/fire-tag/{tagId}`  
**Body:**
```json
{
  "email": "string (required)",
  "firstName": "string",
  "lastName": "string"
}
```
**Note:** Auto-creates contact if email doesn't exist

#### POST /tags/fire-multiple-tags
**Title:** Fire Multiple Tags  
**Method:** POST  
**Path:** `/tags/fire-multiple-tags`  
**Body:**
```json
{
  "email": "string (required)",
  "firstName": "string",
  "lastName": "string",
  "tagIds": ["tag_id_1", "tag_id_2"]
}
```

#### PUT /tags/:tagId
**Title:** Update a Tag  
**Method:** PUT  
**Path:** `/tags/{tagId}`

#### DELETE /tags/:tagId
**Title:** Delete a Tag  
**Method:** DELETE  
**Path:** `/tags/{tagId}`

#### GET /tags/contact-status
**Title:** Get Tags with Contact Status  
**Method:** GET  
**Path:** `/tags/contact-status`  
**Description:** Tags with associated contact counts

---

### Integrations Endpoints (3)

#### GET /integrations
**Title:** Get all Integrations  
**Method:** GET  
**Path:** `/integrations`

#### GET /platform/connected-integrations
**Title:** Get Connected Integrations  
**Method:** GET  
**Path:** `/platform/connected-integrations`

#### GET /integrations/connected-categories
**Title:** Get Connected Categories  
**Method:** GET  
**Path:** `/integrations/connected-categories`

---

### Sub Users Endpoints (5)

#### GET /sub-users
**Title:** Get all Users  
**Method:** GET  
**Path:** `/sub-users`

#### GET /sub-users/:userId
**Title:** Get a User  
**Method:** GET  
**Path:** `/sub-users/{userId}`

#### POST /sub-users
**Title:** Create a User  
**Method:** POST  
**Path:** `/sub-users`

#### PUT /sub-users/:userId
**Title:** Update a User  
**Method:** PUT  
**Path:** `/sub-users/{userId}`

#### DELETE /sub-users/:userId
**Title:** Delete a User  
**Method:** DELETE  
**Path:** `/sub-users/{userId}`

---

### Custom Field Groups Endpoints (5)

#### GET /custom-field-groups
**Title:** Get All Groups  
**Method:** GET  
**Path:** `/custom-field-groups`

#### GET /custom-field-groups/:groupId
**Title:** Get a Group  
**Method:** GET  
**Path:** `/custom-field-groups/{groupId}`

#### POST /custom-field-groups
**Title:** Create a Group  
**Method:** POST  
**Path:** `/custom-field-groups`

#### PUT /custom-field-groups/:groupId
**Title:** Update a Group  
**Method:** PUT  
**Path:** `/custom-field-groups/{groupId}`

#### DELETE /custom-field-groups/:groupId
**Title:** Delete a Group  
**Method:** DELETE  
**Path:** `/custom-field-groups/{groupId}`

---

### Custom Fields Endpoints (5)

#### GET /custom-fields
**Title:** Get all Fields  
**Method:** GET  
**Path:** `/custom-fields`

#### GET /custom-fields/:customFieldId
**Title:** Get a Field  
**Method:** GET  
**Path:** `/custom-fields/{customFieldId}`

#### POST /custom-fields
**Title:** Create a Field  
**Method:** POST  
**Path:** `/custom-fields`

#### PUT /custom-fields/:customFieldId
**Title:** Update a Field  
**Method:** PUT  
**Path:** `/custom-fields/{customFieldId}`

#### DELETE /custom-fields/:customFieldId
**Title:** Delete a Field  
**Method:** DELETE  
**Path:** `/custom-fields/{customFieldId}`

---

### Workflow Groups Endpoints (5)

#### GET /workflow-groups
**Title:** Get All Groups  
**Method:** GET  
**Path:** `/workflow-groups`

#### GET /workflow-groups/:groupId
**Title:** Get a Group  
**Method:** GET  
**Path:** `/workflow-groups/{groupId}`

#### POST /workflow-groups
**Title:** Create a Group  
**Method:** POST  
**Path:** `/workflow-groups`

#### PUT /workflow-groups/:groupId
**Title:** Update a Group  
**Method:** PUT  
**Path:** `/workflow-groups/{groupId}`

#### DELETE /workflow-groups/:groupId
**Title:** Delete a Group  
**Method:** DELETE  
**Path:** `/workflow-groups/{groupId}`

---

### Workflows Endpoints (9)

#### GET /workflows
**Title:** Get all Workflows  
**Method:** GET  
**Path:** `/workflows`

#### GET /workflows/:workflowId
**Title:** Get a Workflow  
**Method:** GET  
**Path:** `/workflows/{workflowId}`  
**Description:** Returns full workflow with flows, queues, and counts

#### POST /workflows
**Title:** Create a Workflow  
**Method:** POST  
**Path:** `/workflows`

#### PUT /workflows/:workflowId
**Title:** Update a Workflow  
**Method:** PUT  
**Path:** `/workflows/{workflowId}`

#### DELETE /workflows/:workflowId
**Title:** Delete a Workflow  
**Method:** DELETE  
**Path:** `/workflows/{workflowId}`

#### PUT /workflows/flow/:flowId
**Title:** Update a Flow  
**Method:** PUT  
**Path:** `/workflows/flow/{flowId}`

#### DELETE /workflows/flow/:flowId
**Title:** Delete a Flow  
**Method:** DELETE  
**Path:** `/workflows/flow/{flowId}`

#### POST /workflows/release-flow/:flowId
**Title:** Release a Flow  
**Method:** POST  
**Path:** `/workflows/release-flow/{flowId}`  
**Description:** Release contacts waiting in a flow

#### POST /workflows/delete-contact
**Title:** Delete Contact from Workflow  
**Method:** POST  
**Path:** `/workflows/delete-contact`  
**Body:**
```json
{
  "workflowId": "string",
  "contactId": "string"
}
```

---

### Domains Endpoints (6)

#### GET /domains
**Title:** Get all Domains  
**Method:** GET  
**Path:** `/domains`

#### GET /domains/:domainId
**Title:** Get a Domain  
**Method:** GET  
**Path:** `/domains/{domainId}`

#### POST /domains/smtp-domain-list
**Title:** Get SMTP Domain List  
**Method:** POST  
**Path:** `/domains/smtp-domain-list`  
**Description:** List SMTP integration domains

#### POST /domains/mailgun-domain-list
**Title:** Get Mailgun Domain List  
**Method:** POST  
**Path:** `/domains/mailgun-domain-list`

#### POST /domains
**Title:** Create a Domain  
**Method:** POST  
**Path:** `/domains`

#### DELETE /domains/:domainId
**Title:** Delete a Domain  
**Method:** DELETE  
**Path:** `/domains/{domainId}`

---

### Broadcast Email Endpoints (9)

#### GET /broadcast-emails/get-fields
**Title:** Get Fields  
**Method:** GET  
**Path:** `/broadcast-emails/get-fields`

#### POST /broadcast-emails/create-field
**Title:** Create a Field  
**Method:** POST  
**Path:** `/broadcast-emails/create-field`

#### POST /broadcast-emails/active-contacts-count
**Title:** Get Active Contacts Count  
**Method:** POST  
**Path:** `/broadcast-emails/active-contacts-count`  
**Note:** Despite POST method, this is a retrieval/reporting endpoint

#### POST /broadcast-emails/inactive-contacts-count
**Title:** Get In-Active Contacts Count  
**Method:** POST  
**Path:** `/broadcast-emails/inactive-contacts-count`

#### POST /broadcast-emails/new-contacts-count
**Title:** Get New Contacts Count  
**Method:** POST  
**Path:** `/broadcast-emails/new-contacts-count`

#### POST /broadcast-emails/passive-contacts-count
**Title:** Get Passive Contacts Count  
**Method:** POST  
**Path:** `/broadcast-emails/passive-contacts-count`

#### POST /broadcast-emails/dead-contacts-count
**Title:** Get Dead Contacts Count  
**Method:** POST  
**Path:** `/broadcast-emails/dead-contacts-count`

#### POST /broadcast-emails/send-email
**Title:** Send Email  
**Method:** POST  
**Path:** `/broadcast-emails/send-email`  
**Description:** Send broadcast email to contact list

#### POST /broadcast-emails/email-report
**Title:** Email Report  
**Method:** POST  
**Path:** `/broadcast-emails/email-report`

---

### Email Reports Endpoints (3)

#### POST /email-reports/broadcast
**Title:** Broadcast Report  
**Method:** POST  
**Path:** `/email-reports/broadcast`

#### POST /email-reports/newsletter
**Title:** Newsletter Report  
**Method:** POST  
**Path:** `/email-reports/newsletter`

#### POST /email-reports/workflow
**Title:** Workflow Report  
**Method:** POST  
**Path:** `/email-reports/workflow`

---

## DOCUMENTATION QUIRKS DETECTED

1. **POST for retrieval:** Many "count" and "report" endpoints use POST despite being read operations
2. **Consistent wrapper:** All responses use `{ type: "response"|"error", data|error: {...} }`
3. **Tag firing:** Auto-creates contacts if email doesn't exist (upsert behavior)
4. **Pagination:** Likely uses `page` and `limit` query params (standard across list endpoints)
5. **Path params:** Use colon notation `:paramName` in docs, actual API uses path segments
6. **Case sensitivity:** API paths are lowercase with hyphens

---

## VERIFICATION CHECKLIST

✓ All 75+ endpoints cataloged  
✓ Auth mechanism documented (X-API-KEY header)  
✓ Base URL confirmed (https://api.globalcontrol.io/api/ai)  
✓ Response envelope format captured  
✓ Error format captured  
✓ HTTP methods cataloged  
✓ Path params identified  
✓ Request body examples captured  
✓ Quirks documented  

---

## NEXT STEPS FOR OPENCLAW SKILL

1. Create normalized wrapper functions for each endpoint family
2. Implement response envelope unwrapping
3. Add error handling for common patterns
4. Build tag firing helper (handles file-based JSON + curl)
5. Create contact management helpers
6. Add workflow interaction functions
7. Generate test suite covering all endpoint families

**Status:** INGESTION COMPLETE - Ready for skill wrapper implementation
