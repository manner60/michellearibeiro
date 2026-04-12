# PASS 8 — OPENCLAW SKILL WRAPPER PLAN

## GlobalControl.SafeClient

### Overview
A safe, structured wrapper for the Global Control API that handles authentication, rate limiting, pagination, response normalization, and security redaction.

---

## 1. INPUTS

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `api_token` | string | YES | - | API key for authentication |
| `auth_mode` | enum | NO | `"x-api-key"` | One of: `"x-api-key"`, `"bearer"`, `"auto"` |
| `base_url` | string | NO | `"https://api.globalcontrol.io/api"` | Override for custom deployments |
| `timeout_ms` | number | NO | `30000` | Request timeout in milliseconds |
| `retry_enabled` | boolean | NO | `true` | Enable automatic retry with backoff |
| `max_retries` | number | NO | `3` | Maximum retry attempts |

### Auth Mode Behavior
- **`x-api-key`**: Always use `X-API-KEY: {token}` header (RECOMMENDED)
- **`bearer`**: Always use `Authorization: Bearer {token}` header
- **`auto`**: Try `x-api-key` first, fallback to `bearer` on 401, cache successful method

---

## 2. REQUEST BUILDER

### Header Construction
```
function buildHeaders(authMode, token, contentType = null):
  headers = {}
  
  if authMode == "x-api-key" or authMode == "auto":
    headers["X-API-KEY"] = token
  else if authMode == "bearer":
    headers["Authorization"] = "Bearer " + token
  
  if contentType:
    headers["Content-Type"] = contentType
  
  return headers
```

### URL Construction
```
function buildUrl(baseUrl, path, pathParams, queryParams):
  # Replace path parameters
  url = baseUrl + "/" + path
  for param in pathParams:
    url = url.replace("{" + param.name + "}", param.value)
    url = url.replace("{{" + param.name + "}}", param.value)
  
  # Append query parameters (skip null/undefined)
  queryString = []
  for param in queryParams:
    if param.value != null:
      queryString.append(param.name + "=" + encodeURIComponent(param.value))
  
  if queryString.length > 0:
    url = url + "?" + queryString.join("&")
  
  return url
```

### Timeouts
- Default: 30 seconds
- Broadcast email sends: 60 seconds (larger payloads)
- List endpoints with high limits: 45 seconds

### Idempotency Notes
- **GET**: Safe to retry
- **POST (creates)**: NOT idempotent - may create duplicates if retried
- **PUT (updates)**: Idempotent - safe to retry
- **DELETE**: Idempotent - safe to retry

**Recommendation**: For POST creates, check for duplicates by email/name before retrying.

---

## 3. RETRY / BACKOFF STRATEGY

### Rate Limit Handling (429)
```
function handleRateLimit(response):
  resetHeader = response.headers["X-RateLimit-Reset"]
  
  if resetHeader:
    resetTime = parseInt(resetHeader)
    waitMs = (resetTime - Date.now()/1000) * 1000 + 1000  # +1s jitter
    return max(waitMs, 1000)  # minimum 1 second
  else:
    return null  # Use exponential backoff
```

### Exponential Backoff
```
function calculateBackoff(attempt, baseDelayMs = 1000, maxDelayMs = 60000):
  delay = baseDelayMs * (2 ^ attempt)
  jitter = random(0, delay * 0.1)  # 10% jitter
  return min(delay + jitter, maxDelayMs)
```

### Retry Logic
```
function shouldRetry(statusCode, attempt, maxRetries):
  if attempt >= maxRetries:
    return false
  
  # Retry on these status codes
  retryable = [429, 500, 502, 503, 504]
  return statusCode in retryable
```

### Full Retry Flow
```
function executeWithRetry(request, maxRetries):
  for attempt in range(0, maxRetries):
    response = execute(request)
    
    if response.status == 429:
      waitMs = handleRateLimit(response)
      if waitMs == null:
        waitMs = calculateBackoff(attempt)
      sleep(waitMs)
      continue
    
    if shouldRetry(response.status, attempt, maxRetries):
      sleep(calculateBackoff(attempt))
      continue
    
    return response
  
  return lastResponse  # Return last response even if failed
```

---

## 4. PAGINATION HELPER

### For `/contacts` Endpoint
```
function paginateContacts(queryParams, onPage):
  page = 1
  limit = queryParams.limit or 100
  total = null
  
  while true:
    params = {...queryParams, page: page, limit: limit}
    response = client.contacts_list(params)
    
    if not response.ok:
      return response  # Return error
    
    onPage(response.data.contacts, page)
    
    total = response.data.total
    fetched = page * limit
    
    if fetched >= total:
      break
    
    page++
  
  return {ok: true, total: total, pages: page}
```

### Auto-Pagination Wrapper
```
function getAllContacts(queryParams):
  allContacts = []
  
  result = paginateContacts(queryParams, (contacts, page) => {
    allContacts.push(...contacts)
  })
  
  if not result.ok:
    return result
  
  return {ok: true, data: allContacts, total: result.total}
```

---

## 5. RESPONSE PARSER

### Normalize to Standard Format
```
function parseResponse(httpResponse):
  body = JSON.parse(httpResponse.body)
  
  # Success case: type == "response"
  if body.type == "response":
    return {
      ok: true,
      data: body.data,
      message: null,
      error_code: null,
      error_message: null,
      raw: body
    }
  
  # Error case: type == "error"
  if body.type == "error":
    return {
      ok: false,
      data: null,
      message: body.error.message or body.error.description,
      error_code: body.error.code or body.error.status,
      error_message: body.error.message,
      raw: body
    }
  
  # Unexpected format
  return {
    ok: httpResponse.status >= 200 and httpResponse.status < 300,
    data: body,
    message: null,
    error_code: "UNKNOWN_FORMAT",
    error_message: "Response did not match expected envelope",
    raw: body
  }
```

### HTTP Error Fallback
```
function parseHttpError(httpResponse):
  return {
    ok: false,
    data: null,
    message: httpResponse.statusText,
    error_code: "HTTP_" + httpResponse.status,
    error_message: httpResponse.statusText,
    raw: httpResponse.body
  }
```

---

## 6. SAFETY / REDACTION

### Sensitive Fields (DO NOT LOG)
```
SENSITIVE_FIELDS = [
  "apiToken",
  "api_token",
  "current_password",
  "password",
  "X-API-KEY",
  "Authorization"
]
```

### PII Fields (Redact in Logs)
```
PII_FIELDS = [
  "email",
  "phone",
  "address",
  "ip"
]
```

### Redaction Functions
```
function redactSensitive(obj, depth = 0):
  if depth > 10: return obj  # Prevent infinite recursion
  
  if typeof obj != "object" or obj == null:
    return obj
  
  result = {}
  for key in obj:
    if key in SENSITIVE_FIELDS:
      result[key] = "[REDACTED]"
    else if key in PII_FIELDS:
      result[key] = redactPII(obj[key], key)
    else if typeof obj[key] == "object":
      result[key] = redactSensitive(obj[key], depth + 1)
    else:
      result[key] = obj[key]
  
  return result

function redactPII(value, fieldType):
  if fieldType == "email":
    parts = value.split("@")
    return parts[0][0] + "***@" + parts[1]  # j***@example.com
  if fieldType == "phone":
    return "***" + value.slice(-4)  # ***1234
  return "[REDACTED]"
```

### Log Wrapper
```
function safeLog(level, message, data):
  redacted = redactSensitive(data)
  log(level, message, redacted)
```

---

## 7. VALIDATION

### Required Parameter Validation
```
function validateRequired(params, requiredFields):
  missing = []
  for field in requiredFields:
    if params[field] == null or params[field] == "":
      missing.push(field)
  
  if missing.length > 0:
    return {
      ok: false,
      error: "Missing required fields: " + missing.join(", ")
    }
  
  return {ok: true}
```

### Destructive Call Protection
```
DESTRUCTIVE_ENDPOINTS = [
  {id: "contacts_delete", confirm: "DELETE_CONTACT"},
  {id: "subusers_delete", confirm: "DELETE_USER"},
  {id: "tags_delete", confirm: "DELETE_TAG"},
  {id: "taggroups_delete", confirm: "DELETE_TAG_GROUP"},
  {id: "taglabels_delete", confirm: "DELETE_TAG_LABEL"},
  {id: "customfields_delete", confirm: "DELETE_CUSTOM_FIELD"},
  {id: "customfieldgroups_delete", confirm: "DELETE_CUSTOM_FIELD_GROUP"},
  {id: "domains_delete", confirm: "DELETE_DOMAIN"},
  {id: "broadcast_send", confirm: "SEND_BROADCAST_EMAIL"}
]

function requireConfirmation(endpointId, confirmationToken):
  endpoint = DESTRUCTIVE_ENDPOINTS.find(e => e.id == endpointId)
  
  if endpoint == null:
    return {ok: true}  # Not destructive
  
  if confirmationToken != endpoint.confirm:
    return {
      ok: false,
      error: "Destructive action requires confirmation. Pass confirm='" + endpoint.confirm + "' to proceed."
    }
  
  return {ok: true}
```

### Email Validation (for creates)
```
function validateEmail(email):
  pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if not pattern.test(email):
    return {ok: false, error: "Invalid email format"}
  return {ok: true}
```

---

## 8. TESTING PLAN

### TEST_PROOF_COMMANDS

#### Auth Verification
```bash
# Test X-API-KEY auth (primary)
curl -H "X-API-KEY: YOUR_TOKEN" https://api.globalcontrol.io/api/me

# Expected: 200 + type="response" + data._id present
# Failure: 401 OR type="error"
```

#### Basic CRUD Flow
```bash
# 1. List tags (GET)
curl -H "X-API-KEY: YOUR_TOKEN" https://api.globalcontrol.io/api/tags

# 2. Get tag groups first (needed for create)
curl -H "X-API-KEY: YOUR_TOKEN" https://api.globalcontrol.io/api/tag-groups

# 3. Create tag (POST)
curl -X POST -H "X-API-KEY: YOUR_TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Test Tag","groupId":"GROUP_ID_FROM_STEP_2","isHot":false}' \
  https://api.globalcontrol.io/api/tags

# 4. Update tag (PUT)
curl -X PUT -H "X-API-KEY: YOUR_TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Updated Tag","isHot":true}' \
  https://api.globalcontrol.io/api/tags/TAG_ID_FROM_STEP_3

# 5. Delete tag (DELETE)
curl -X DELETE -H "X-API-KEY: YOUR_TOKEN" \
  https://api.globalcontrol.io/api/tags/TAG_ID_FROM_STEP_3
```

#### Pagination Test
```bash
# Get contacts page 1
curl -H "X-API-KEY: YOUR_TOKEN" "https://api.globalcontrol.io/api/contacts?page=1&limit=10"

# Verify: response.data.total, response.data.page present
```

#### Rate Limit Test
```bash
# Rapid-fire requests to trigger 429
for i in {1..150}; do
  curl -s -o /dev/null -w "%{http_code}\n" -H "X-API-KEY: YOUR_TOKEN" \
    https://api.globalcontrol.io/api/tags &
done
wait

# Look for 429 responses, check headers for X-RateLimit-*
```

#### Error Response Test
```bash
# Invalid ID (should return error envelope)
curl -H "X-API-KEY: YOUR_TOKEN" \
  https://api.globalcontrol.io/api/contacts/invalid_id_12345

# Expected: type="error", error.message present
```

---

## 9. WRAPPER INTERFACE SUMMARY

```typescript
interface GlobalControlClient {
  // Configuration
  constructor(config: {
    api_token: string;
    auth_mode?: "x-api-key" | "bearer" | "auto";
    base_url?: string;
    timeout_ms?: number;
    retry_enabled?: boolean;
    max_retries?: number;
  });

  // User
  getMe(): Promise<NormalizedResponse<User>>;

  // Contacts (with pagination helper)
  getContacts(params?: ContactListParams): Promise<NormalizedResponse<ContactList>>;
  getAllContacts(params?: ContactListParams): Promise<NormalizedResponse<Contact[]>>;
  getContact(contactId: string): Promise<NormalizedResponse<Contact>>;
  createContact(data: CreateContactData): Promise<NormalizedResponse<Contact>>;
  updateContact(contactId: string, data: UpdateContactData): Promise<NormalizedResponse<Contact>>;
  deleteContact(contactId: string, confirm: "DELETE_CONTACT"): Promise<NormalizedResponse<Contact>>;

  // Tags
  getTags(): Promise<NormalizedResponse<Tag[]>>;
  getTag(tagId: string): Promise<NormalizedResponse<Tag>>;
  createTag(data: CreateTagData): Promise<NormalizedResponse<Tag>>;
  updateTag(tagId: string, data: UpdateTagData): Promise<NormalizedResponse<Tag>>;
  deleteTag(tagId: string, confirm: "DELETE_TAG"): Promise<NormalizedResponse<Tag>>;

  // ... similar pattern for all 11 categories

  // Broadcast Email (extra confirmation required)
  sendBroadcastEmail(data: BroadcastEmailData, confirm: "SEND_BROADCAST_EMAIL"): Promise<NormalizedResponse<SendResult>>;
}

interface NormalizedResponse<T> {
  ok: boolean;
  data: T | null;
  message: string | null;
  error_code: string | null;
  error_message: string | null;
  raw: any;
}
```

---

## 10. IMPLEMENTATION PRIORITY

1. **Core Request/Response** - Headers, URL building, response parsing
2. **Auth with auto-detect** - X-API-KEY primary, Bearer fallback
3. **Retry/Backoff** - 429 handling with X-RateLimit-Reset
4. **Validation** - Required params, destructive action confirmation
5. **Redaction** - Safe logging, sensitive field protection
6. **Pagination** - Helper for /contacts
7. **Full Endpoint Coverage** - All 51 endpoints wrapped

---

*Generated: 2026-02-16 | Source: Global Control API Postman Collection v2.1.0*
