# MintBird / Poplinks API Skill

## Purpose

Use the MintBird API to create, update, and manage:
- Poplinks
- Lead pages
- Bridge pages
- Confirmation pages
- Sales funnels
- Sales pages
- Products
- Categories
- Stats and reporting
- Payment integrations and checkout setup
- AI-generated sales pages

This skill should act as a structured API operator that:
1. understands the user's marketing asset request,
2. maps it to the correct MintBird endpoint,
3. validates required parameters,
4. resolves any required IDs,
5. makes the API request,
6. returns a clean human-readable result,
7. surfaces validation or API errors clearly,
8. completes related downstream setup when needed.

---

## API Basics

### Authentication
All MintBird API requests require:

Authorization: Bearer {{api_key}}

### Base URL
Use:

{{base_url}}/api/ai

Default production base URL:

https://api.poplinks.io/api/ai

### Common Error Handling
Handle these gracefully:
- 401 Unauthorized
- 404 Resource not found
- 422 Validation error
- 500 Server error

When errors occur:
- show the endpoint called,
- show the status code,
- summarize the error in plain English,
- preserve the original API response when useful.

---

## Core Behavior

When a user asks for a MintBird-related action, follow this decision logic.

### 1. Detect intent
Map the request to one of these action types:
- create poplink
- update poplink
- list domains
- list groups
- list vendors
- list templates
- create lead page
- update lead page
- clone lead page
- create bridge page
- update bridge page
- create funnel
- update funnel
- create sales page
- update sales page
- create product
- update product
- assign payment gateway
- assign payment plan
- link product to sales page
- link product to funnel step
- generate AI sales page
- check AI generation status
- fetch stats
- fetch leads
- fetch products
- manage categories

### 2. Resolve dependencies first
Before creating or updating assets, fetch supporting IDs when needed:
- system domains
- personal domains
- groups
- vendors
- templates
- categories
- products
- funnels
- sales pages
- payment integrations
- payment plans

### 3. Validate before request
Do not send incomplete API calls.

Check for:
- required names
- valid URLs
- valid domain type
- required IDs
- valid page types
- valid payment types
- valid gateway selection
- valid prompt presence for AI generation
- unique slug or keyword when required

### 4. Ask only when essential
If a user request is missing required info:
- fetch available choices first,
- use the safest default only when one obvious valid option exists,
- otherwise ask the user for the missing selection.

### 5. Complete the workflow
When the request implies a complete selling asset, do not stop too early.

Examples:
- If creating a product for checkout, complete payment gateway assignment.
- If linking a product to a sales page, complete the product-to-page association.
- If creating a funnel intended to sell, suggest the next linking step immediately.

### 6. Return structured results
Always return:
- action completed
- endpoint used
- key IDs created or updated
- public URLs or slugs if returned
- payment setup status if relevant
- recommended next step

---

## Supported Endpoints

## Helpers

Use these helper endpoints before creation workflows:

- GET /system-domains
- GET /domains
- GET /groups
- GET /vendors
- GET /templates
- GET /pending-pages
- GET /complete-pages
- GET /categories
- GET /payment-integrations

Use them whenever IDs, templates, domain values, or payment integrations are needed.

---

## Poplinks

### Create Poplink
Endpoint:
POST /poplinks

Use when the user wants a tracked redirect link.

Required fields:
- name
- destination_url
- visible_url
- domain_id

Optional:
- domain_type = personal or system
- group_id
- vendor_id
- isAdvanced
- is_clocked
- start_date
- end_date

Rules:
- visible_url must be unique on the chosen domain
- if domain_type = system, domain_id must be a system domain URL
- if domain_type = personal, domain_id must be a personal domain ID

### Update Poplink
Endpoint:
PUT /poplinks/:id

Use when changing destination, slug, dates, group, vendor, or settings.

### Get Poplinks
Endpoints:
- GET /poplinks
- GET /poplinks/:id
- GET /poplinks/:id/clicks

Use to list links, inspect one link, or fetch click activity.

---

## Lead Pages

### Create Lead Page
Endpoint:
POST /lead-pages

Required:
- name

Optional:
- template_id
- category_id

Behavior:
- creates landing page settings
- creates confirmation page
- creates popup settings
- auto-generates funnel links or slugs

### Update Lead Page Fields
Use these endpoints for targeted changes:
- PUT /lead-pages/:id/url
- PUT /lead-pages/:id/rename
- PUT /lead-pages/:id/category
- PUT /lead-pages/:id/seo
- PUT /lead-pages/:id/pre-headline
- PUT /lead-pages/:id/headline
- PUT /lead-pages/:id/post-headline
- PUT /lead-pages/:id/video
- PUT /lead-pages/:id/description
- PUT /lead-pages/:id/bullets
- PUT /lead-pages/:id/template
- POST /lead-pages/:id/change-template
- PUT /lead-pages/:id/step-settings
- GET /lead-pages/:id/popup-settings
- PUT /lead-pages/:id/popup-content
- PUT /lead-pages/:id/popup-form-fields

### Clone Lead Page
Endpoint:
POST /lead-pages/:id/clone

Use when the user wants a duplicate starting point.

---

## Bridge Pages

### Create Bridge Page
Endpoint:
POST /bridge-pages

### Update Bridge Page
Use:
- PUT /bridge-pages/:id/url
- PUT /bridge-pages/:id/rename
- PUT /bridge-pages/:id/category
- PUT /bridge-pages/:id/seo
- PUT /bridge-pages/:id/pre-headline
- PUT /bridge-pages/:id/headline
- PUT /bridge-pages/:id/post-headline
- PUT /bridge-pages/:id/video
- PUT /bridge-pages/:id/description
- PUT /bridge-pages/:id/bullets
- PUT /bridge-pages/:id/template
- POST /bridge-pages/:id/change-template

Use bridge pages when the user wants a pre-sell or transition page before an offer.

---

## Confirmation Pages

Use these for thank-you or confirmation step updates:
- GET /conf-pages
- GET /conf-pages/:id
- PUT /conf-pages/:id/pre-headline
- PUT /conf-pages/:id/headline
- PUT /conf-pages/:id/post-headline
- PUT /conf-pages/:id/video
- PUT /conf-pages/:id/button-text
- PUT /conf-pages/:id/redirect-url
- PUT /conf-pages/:id/bullets
- PUT /conf-pages/:id/template

---

## Image Management

### Images
- PUT /lead-pages/:id/image/url
- POST /lead-pages/:id/image/upload
- PUT /bridge-pages/:id/image/url
- PUT /conf-pages/:id/image/url

### Backgrounds
- PUT /lead-pages/:id/background
- PUT /bridge-pages/:id/background
- PUT /conf-pages/:id/background

Use URL-based image methods first unless the user specifically provides a file upload workflow.

---

## Leads and Stats

### Leads
- GET /leads
- GET /leads/funnel/:id

Use for reporting captured leads globally or by funnel.

### Stats
- GET /stats/overview
- GET /stats/global-sales
- GET /stats/poplinks
- GET /stats/funnel
- POST /stats/date-range

Use when the user asks for campaign or funnel performance.

---

## Categories

Use these to organize pages and funnels:
- GET /categories
- POST /categories
- PUT /categories/:id
- DELETE /categories/:id

---

## Products

Use products when a sales page or funnel needs something to sell.

Main endpoints:
- GET /products
- GET /products/list
- GET /products/:id
- POST /products
- PUT /products/:id
- DELETE /products/:id
- PUT /products/:id/payment-gateway
- POST /products/:id/payment-plan
- DELETE /products/:id/payment-plan/:planId
- PUT /products/:id/image
- PUT /products/:id/redirect-settings
- PUT /products/:id/status
- POST /products/:id/stats
- POST /products/:id/customers
- POST /products/:id/orders

### Product Checkout Completion Rule

Whenever a user asks to create a product for sale, the skill should treat checkout setup as incomplete until:
- a payment gateway is selected,
- a connected payment integration is chosen,
- the payment type is assigned,
- and any required payment plan is added or linked.

### Payment Gateway Selection for Products and Checkout

Before completing any product intended for checkout, the skill must configure payment processing.

#### Step 1: Fetch available payment integrations
Endpoint:
GET /payment-integrations

Purpose:
Retrieve all configured payment integrations for the authenticated user.

Important response fields:
- id
- provider
- name
- is_connected

Supported providers may include:
- stripe
- paypal
- razorpay
- epd

#### Step 2: Ask which gateway and account to use
If the user has not specified a gateway, ask:
- "Which payment gateway would you like to use?"
- "Which connected account should I use?"

If only one connected integration exists for the selected provider, use it automatically.

If multiple connected integrations exist for the selected provider, show the available integration names and require selection before proceeding.

If no connected integration exists for the selected provider, stop and tell the user the integration must be connected in MintBird first.

#### Step 3: Set the payment gateway on the product
Endpoint:
PUT /products/:id/payment-gateway

Required payload fields:
- payment_provider
- payment_integration_id
- payment_type

Example:
```json
{
  "payment_provider": "stripe",
  "payment_integration_id": 1,
  "payment_type": "one_time"
}
```

### Product Creation Workflow

When user says: "Create products for my skills"

1. **ASK FIRST:**
   - "Which domain should I use for checkout URLs?" (system vs personal)
   - "What prices do you want for these products?"
   - "Which payment gateway?" (fetch /payment-integrations first)
   - "Do you want payment plan options or just one-time?"

2. **Create products** with correct prices

3. **Set payment gateway** for each product with integration ID

4. **Activate all products**

5. **Update website** with checkout URLs

6. **Verify** checkout works before claiming complete

---

## Sales Funnels

### Create Funnel
Endpoint:
POST /sales-funnels

Required:
- name

Optional:
- category_id

### Update Funnel
Endpoint:
PUT /sales-funnels/:id

### Delete Funnel
Endpoint:
DELETE /sales-funnels/:id

### Funnel Management
Also support:
- PUT /sales-funnels/:id/payment-provider
- PUT /sales-funnels/:id/domain
- POST /sales-funnels/:id/payment-plan
- GET /sales-funnels/:id/payment-plans
- POST /sales-funnels/:id/reset-statistics
- GET /sales-funnels/:id/customers
- GET /sales-funnels/:id/orders
- POST /sales-funnels/:id/footer

---

## Funnel Steps

Use funnel step endpoints when the user wants to assemble or edit funnel flow:
- GET /sales-funnels/:id/steps
- POST /steps
- DELETE /steps/:id
- PUT /steps/:id/link-page
- PUT /steps/:id/url
- PUT /steps/:id/payment
- PUT /steps/:id/footer
- PUT /steps/:id/split-test
- PUT /steps/:id/split-traffic

---

## Sales Pages

### Create Sales Page
Endpoint:
POST /sales-pages

Required:
- name

Optional:
- category_id
- sub_type = salespage, upsell, or downsell

### Update Sales Page
Endpoint:
PUT /sales-pages/:id

Supports:
- name
- category_id
- sub_type
- template_id
- background_type
- background_color
- background_image
- page_pattern_type

### Additional Sales Page Actions
- DELETE /sales-pages/:id
- PUT /sales-pages/:id/status
- POST /sales-pages/link-product
- POST /sales-funnels/link-product
- GET /sales-pages/check-product

---

## AI Sales Page Generation

### Start AI Generation
Endpoint:
POST /sales-page/generate

Required:
- prompt
- name

Optional:
- sub_type
- pipeline (json, html, htmlblock)

Allowed sub_type values:
- salespage
- orderform
- upsell
- downsell
- confpage
- miscpage
- signuppage

### Check Generation Status
Endpoint:
GET /sales-page/generation-status

Use polling after generation starts.
Return the job_key immediately, then check status until complete if the workflow supports waiting.

---

## Skill Operating Rules

### Rule 1: Never invent IDs
Always fetch helper data first if IDs are unknown.

### Rule 2: Preserve user intent
Do not rewrite marketing content unless the user asks.
If the user wants direct API execution, prioritize exact execution.

### Rule 3: Be safe with destructive actions
Before delete actions:
- summarize what will be deleted,
- require explicit confirmation.

### Rule 4: Prefer incremental updates
If the user wants to modify only a headline, bullets, SEO field, or URL, use the specific endpoint instead of full object replacement.

### Rule 5: Surface useful outputs
After create operations, always display:
- record ID
- name
- status
- public URL / keyword / slug if available
- recommended next action

### Rule 6: Ask first, don't assume
When creating products or checkout flows:
- Ask about domain preference
- Ask about payment gateway
- Ask about pricing
- Ask about payment plans
- Don't add "free" labels without direction
- Don't create payment plans without approval

### Rule 7: Complete the workflow
Don't stop at product creation — finish payment gateway setup, verify checkout works, update website URLs.

---

## Suggested User Commands

Examples the skill should understand:

- "List my MintBird system domains."
- "Show my personal domains."
- "Create a poplink called Free Audit pointing to https://example.com/audit using a system domain."
- "Create a lead page called Restaurant Tax Credit Lead Magnet."
- "Rename lead page 12 to FICA Credit Landing Page."
- "Update the headline on lead page 12."
- "Create a new sales funnel called April Webinar Funnel."
- "Create a sales page for my course and link product 9."
- "Generate an AI sales page for a beginner-friendly Facebook ads course."
- "Check the status of AI generation job abc-123."
- "Fetch my funnel stats for this month."
- "Create products for all my OpenClaw skills."

---

## Request Templates

### Template: Create Poplink
Collect:
- name
- destination_url
- visible_url
- domain_type
- domain_id
- optional group_id
- optional vendor_id

Then call:
POST /poplinks

### Template: Create Lead Page
Collect:
- name
- optional template_id
- optional category_id

Then call:
POST /lead-pages

### Template: Create Funnel
Collect:
- name
- optional category_id

Then call:
POST /sales-funnels

### Template: Create Sales Page
Collect:
- name
- optional category_id
- optional sub_type

Then call:
POST /sales-pages

### Template: Generate AI Sales Page
Collect:
- name
- prompt
- optional sub_type
- optional pipeline

Then call:
POST /sales-page/generate

### Template: Create Product with Checkout
Collect:
- name
- price
- description
- domain preference
- payment gateway preference

Steps:
1. POST /products
2. GET /payment-integrations
3. PUT /products/:id/payment-gateway
4. PUT /products/:id/status (activate)
5. Return checkout URL

---

## Response Format

Always respond in this format:

### Action
What was requested.

### Endpoint
Method + endpoint used.

### Inputs
Key fields sent.

### Result
Success or failure summary.

### Output
IDs, names, URLs, job keys, or returned records.

### Next Step
The most logical follow-up action.

---

## Example Behavior

### Example 1
User:
"Create a poplink called Webinar Redirect to https://example.com/webinar using a system domain and slug webinar-now."

Skill should:
1. get system domains if needed,
2. choose or confirm domain,
3. call create poplink,
4. return the resulting link details.

### Example 2
User:
"Generate a sales page for a course teaching restaurant owners how to claim tax credits."

Skill should:
1. call AI generation endpoint with a strong prompt,
2. return job_key,
3. offer to check generation status.

### Example 3
User:
"Create a funnel called FICA Offer Funnel and then create a sales page for it."

Skill should:
1. create funnel,
2. create sales page,
3. return both IDs,
4. suggest linking the page to a funnel step next.

### Example 4
User:
"Create products for my OpenClaw skills."

Skill should:
1. ASK: "Which domain?"
2. ASK: "What prices?"
3. ASK: "Which payment gateway?"
4. GET /payment-integrations
5. Create products
6. Set payment gateway with integration ID
7. Activate products
8. Update website checkout URLs
9. Verify checkout works

---

## Implementation Notes

When coding this skill:
- use JSON requests unless file upload is required,
- use multipart/form-data for image upload when necessary,
- parse validation errors cleanly,
- do not assume undocumented fields,
- use helper endpoints to discover valid IDs and dependencies,
- keep all endpoint paths relative to {{base_url}}/api/ai.

---

## Success Standard

This skill is successful when it can reliably help a user:
- create tracked links,
- create and update pages,
- build funnels,
- manage products and page associations,
- configure payment processing,
- generate AI sales pages,
- fetch useful stats,
- and explain the result in plain English.

---

## Version History

- 1.0.0 - Initial release with full MintBird API coverage
- 1.1.0 - Added payment gateway configuration and checkout setup workflows
