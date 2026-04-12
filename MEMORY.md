# MEMORY.md - Long-Term Memory

*Last updated: 2026-03-10*

## Who I Am
- **Role:** AI assistant to Michelle Ribeiro
- **Reference hygiene rule:** For FICA / Global Control work, do not use GoHighLevel as a reference point. Use Global Control only unless Michelle explicitly says otherwise.

## Who You Are
- **Name:** Michelle Ribeiro
- **Location:** Calgary, Alberta, Canada
- **Timezone:** America/Edmonton (Mountain Time)
- **Work:** Affiliate marketing and lead generation specialist
- **Current Focus:** FICA Tip Tax Credit campaign for hospitality businesses

## Important Lessons Learned
*(I'll add lessons as I learn them)*

### When Michelle Requests Mintbird/Marketing Automation Work
**ALWAYS ask these questions FIRST before doing anything:**

1. **Domain preference:** "Which domain should I use for checkout URLs?" (system domain vs personal domain)
2. **Payment gateway:** "Which payment gateway and account should I set up?" (Stripe, PayPal, etc.)
3. **Payment integration ID:** "What is your connected payment integration ID?" (required for checkout to work)
4. **Pricing structure:** "What prices do you want for these products?" (don't assume)
5. **Payment plans:** "Do you want payment plan options (3-pay, etc.) or just one-time?" (ask before creating)
6. **Fulfillment:** "How should products be delivered after purchase?" (email, download, manual)
7. **Images:** "Do you want product images uploaded?" (can't be done via API - requires web interface)
8. **Free vs Paid:** "Should any of these be free, or all paid?" (don't assume free offers)

**NEVER assume or add my own spin:**
- Don't create payment plans without explicit approval
- Don't label things as "free" or "starter" without direction
- Don't use personal domain until explicitly confirmed it's configured
- Don't claim work is complete until verified

### Mintbird Product Creation Checklist
- [ ] Get domain preference (system vs personal)
- [ ] Get payment gateway preference
- [ ] Get payment integration ID from /payment-integrations endpoint
- [ ] Get pricing for each product
- [ ] Create products with correct prices
- [ ] Set payment gateway with integration ID
- [ ] Activate all products
- [ ] Update website with correct checkout URLs
- [ ] Verify checkout works before claiming complete

### Model Preferences (CRITICAL - NEVER FORGET)
- **PRIMARY/DEFAULT MODEL:** Kimi (moonshot/kimi-k2.5) — use this ALWAYS unless explicitly asked otherwise
- **Claude Sonnet:** Only use when Michelle specifically requests it
- **MANDATORY:** Set moonshot/kimi-k2.5 at session start AUTOMATICALLY - do NOT wait for Michelle to ask
- **This is non-negotiable** — Michelle should never have to remind me about this

## Key Workflows
- **Temporary travel note:** Michelle is in **Toronto, Ontario** through **Friday, April 10, 2026**. Until then, use Toronto for weather/check-in relevance; after that, resume Calgary unless she says otherwise.
- **OpenClaw skills storefront pricing rule:** every skill listed in the shop/catalog should have a valid price. Free access belongs in the separate lead-capture free-skills funnel, and coupons can be used to discount or comp products when needed.

- **Letterman publication IDs (Michelle):**
  - Stampede City Buzz → `69b67eb447872b28b4e043dc`
  - BizBuzz Calgary → `69c6f96237ba49fb69a44b52`
- **Rule:** For future Letterman work, use only approved Michelle publication/storage IDs from local notes/memory unless Michelle explicitly provides a new one.
- **Maintenance rule:** When Michelle adds a new Letterman publication, add its ID to local notes/memory before using it as a default in future work.
- **Newsletter structure preference:** Michelle wants **4 ARTICLE_CUE blocks in every newsletter** by default when relevant draft articles exist.
- **Article workflow preference:** when articles are ready for Michelle to place via cue blocks, set them to **PUBLISHED** and **In Article Cue / Add To Newsletter Cue** by default.

*(I'll document workflows as I master them)*

---
*This is my curated long-term memory.*
