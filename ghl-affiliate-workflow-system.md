# 🚀 COMPLETE GO HIGH LEVEL AFFILIATE EMAIL WORKFLOW SYSTEM
## Reusable Automation Framework for Any Affiliate Offer

---

# PART 1: CAMPAIGN STRATEGY OVERVIEW

## Campaign Objective
Drive affiliate conversions through a behavior-triggered, multi-touch email sequence that nurtures leads from initial awareness to purchase decision using psychological persuasion principles.

## Funnel Type: "The Affiliate Ascension Sequence"
This is a **value-first nurture-to-sale sequence** that:
1. Captures attention with curiosity and relevance
2. Builds trust through education and storytelling
3. Agitates pain points the offer solves
4. Introduces the solution (affiliate offer) as the logical next step
5. Uses urgency and scarcity to drive immediate action

## Core Psychological Drivers

| Driver | How It's Used | Example Application |
|--------|--------------|---------------------|
| **Curiosity** | Open loops, incomplete information | "The AI tool that actually *does* the work" |
| **Urgency** | Deadline-based scarcity | "48 hours left" / "Final day" |
| **Authority** | Case studies, proof, expertise | "Sarah had an idea... 24 hours later..." |
| **FOMO** | Missing out on opportunity | "Everyone will be using AI... get ahead now" |
| **Relatability** | Addressing objections directly | "Is this beginner-friendly?" |
| **Value Stacking** | Bonuses, added benefits | "$438 in bonuses free" |

## Flow of Persuasion

```
HOOK (Curiosity) → PROBLEM (Agitation) → STORY (Relatability) 
     → VALUE (Education) → OFFER (Solution) → PROOF (Authority) 
          → OBJECTIONS (Trust) → URGENCY (Action) → CLOSE (Decision)
```

---

# PART 2: GO HIGH LEVEL WORKFLOW BUILD

## 🔹 TRIGGER CONFIGURATION

**Primary Trigger:** `Tag Added: "Affiliate Lead - [OFFER NAME]"`

**Alternative Triggers:**
- Form Submitted: "[Offer Name] Opt-in"
- Tag Added: "Webinar Registered - [Offer Name]"
- Tag Added: "Lead Magnet Downloaded - [Offer Name]"

**How to Set Up:**
1. Go to Automation → Workflows
2. Click "Create Workflow"
3. Select "Tag" as trigger type
4. Choose "Tag Added"
5. Select/create tag: `Affiliate Lead - [OFFER NAME]`

---

## 🔹 INITIAL ACTIONS (First 5 Minutes)

**Step 0A: Apply Tag**
- Action: Apply Tag
- Tag: `Sequence - Active - [Offer Name]`
- Purpose: Track who is currently in sequence

**Step 0B: Apply Tag** 
- Action: Apply Tag
- Tag: `Lead - New`
- Purpose: Segment for future campaigns

**Step 0C: Internal Notification (Optional)**
- Action: Send Internal Notification
- To: [Your Email]
- Subject: "New Affiliate Lead: [Contact Name]"
- Message: "[Contact Name] just entered the [Offer Name] sequence."

**Step 0D: Remove Tag (Safety)**
- Action: Remove Tag
- Tag: `Sequence - Completed - [Offer Name]`
- Purpose: Prevent duplicate entry issues

---

## 🔹 CORE WORKFLOW STEPS

### EMAIL SEQUENCE TIMING (8-Email Model)

| Step | Action | Timing | Purpose | Tag Applied |
|------|--------|--------|---------|-------------|
| 1 | Send Email 1 | Immediately | Hook + Curiosity | - |
| 2 | Wait | 12 hours | - | - |
| 3 | Send Email 2 | Day 1 Evening | Problem + Benefits | - |
| 4 | Wait | 12 hours | - | - |
| 5 | Send Email 3 | Day 2 Morning | Authority + Differentiation | - |
| 6 | Wait | 12 hours | - | - |
| 7 | Send Email 4 | Day 2 Evening | Story + Relatability | - |
| 8 | Wait | 12 hours | - | - |
| 9 | Send Email 5 | Day 3 Morning | Urgency + Bonus Stack | - |
| 10 | Wait | 8 hours | - | - |
| 11 | Send Email 6 | Day 3 Evening | Objection Handling | - |
| 12 | Wait | 12 hours | - | - |
| 13 | Send Email 7 | Day 4 Morning | Final Hours | - |
| 14 | Wait | 8 hours | - | - |
| 15 | Send Email 8 | Day 4 Evening | Last Call | - |
| 16 | Wait | 1 hour | - | - |
| 17 | Apply Tag | End of Sequence | `Sequence - Completed` | - |
| 18 | Remove Tag | End of Sequence | `Sequence - Active` | - |

---

## 🔹 CONDITIONAL LOGIC (CRITICAL BRANCHING)

### Branch 1: Link Click Engagement

**IF: Link Clicked in Any Email**
```
Action: Apply Tag
Tag: Engaged - Clicked

Action: Apply Tag  
Tag: Hot Lead - [Offer Name]

[Optional] Action: Send Internal Notification
To: [Your Email]
Subject: "🔥 HOT LEAD: [Contact Name] clicked affiliate link"
```

### Branch 2: Email Open (No Click)

**IF: Email Opened (but no link click after 24 hours)**
```
Action: Apply Tag
Tag: Engaged - Opened

[Continue in main sequence]
```

### Branch 3: No Engagement

**IF: No Email Opened (after 3 emails)**
```
Action: Apply Tag
Tag: Unresponsive - [Offer Name]

Action: Remove From Workflow

[Optional] Action: Add to Re-engagement Campaign
```

### Branch 4: Purchase/Conversion (Exit Trigger)

**IF: Tag Added: "Buyer - [Offer Name]"**
```
Action: Remove From Workflow

Action: Apply Tag
Tag: Buyer - [Offer Name]

Action: Remove Tag
Tag: Sequence - Active - [Offer Name]

Action: Add to Workflow
Workflow: Buyer Onboarding / Thank You Sequence
```

### Branch 5: SMS Engagement (If Phone Available)

**IF: Phone Number Exists AND No Email Open After 24 Hours**
```
Action: Send SMS
Timing: 24 hours after Email 2
Message: "Hey [First Name]! Did you see my email about [Offer Name]? Check it out: [LINK]"
```

---

## 🔹 EXIT CONDITIONS

A contact exits this workflow when ANY of the following occur:

1. **Purchase Detected:** Tag `Buyer - [Offer Name]` is applied
2. **Sequence Complete:** All emails sent (Day 4, Email 8)
3. **Manual Removal:** User manually removed from workflow
4. **Unresponsive:** No opens after 3 emails (moved to re-engagement)
5. **Opt-out:** Contact unsubscribes

---

# PART 3: EMAIL SEQUENCE TEMPLATES

## 📧 EMAIL 1: THE HOOK
**Send:** Immediately  
**Purpose:** Curiosity + Pattern Interrupt  
**Tag if clicked:** `Engaged - Clicked`

**Email Name (GHL):** `[OFFER] - Email 1 - Hook`

**Subject Lines:**
1. The [OFFER TYPE] that actually *does* the work
2. Everyone's talking about this [OFFER TYPE]
3. I was skeptical until I saw this...

**Preview Text:** This changes everything about [TOPIC]...

**Body:**
```
Hey [First Name],

I've seen a lot of [OFFER CATEGORY] come and go.

Most of them are just [COMMON COMPLAINT].

They [LIMITATION 1]. They [LIMITATION 2]. But when it comes to actually [DESIRED OUTCOME]?

You're still doing 90% of the work.

[OFFER NAME] is different.

This isn't [OLD WAY]. It's [NEW WAY].

[KEY DIFFERENTIATOR 1]. [KEY DIFFERENTIATOR 2]. [KEY DIFFERENTIATOR 3].

While you [BENEFIT].

Think about that for a second...

[COMPELLING QUESTION]

[TRANSITION TO OFFER]

See what [OFFER NAME] can do for you:
[CTA LINK]

To your success,
[YOUR NAME]

P.S. [URGENCY ELEMENT OR BONUS MENTION]
```

---

## 📧 EMAIL 2: PROBLEM AGITATION
**Send:** 12 hours later (Day 1 Evening)  
**Purpose:** Address objections + Present solution  
**Tag if clicked:** `Engaged - Clicked`

**Email Name (GHL):** `[OFFER] - Email 2 - Problem`

**Subject Lines:**
1. [NUMBER] [THINGS]. 1 [SOLUTION]. Zero [OBJECTION].
2. What's stopping you from [DESIRED OUTCOME]?
3. The [OBJECTION] problem (solved)

**Preview Text:** This eliminates every excuse...

**Body:**
```
[First Name],

Quick question:

What's stopping you from [DESIRED OUTCOME] right now?

• Don't know [COMMON BLOCK 1]?
• Don't have [COMMON BLOCK 2]?
• Don't [COMMON BLOCK 3]?
• Don't [COMMON BLOCK 4]?

[OFFER NAME] eliminates ALL of those excuses.

It comes with [KEY FEATURE 1]:
→ [BENEFIT 1]
→ [BENEFIT 2]
→ [BENEFIT 3]

[KEY FEATURE 2]:
→ [RESULT 1]
→ [RESULT 2]

This is your chance to stop being [CURRENT STATE] and start being [DESIRED STATE].

[TRANSITION TO CTA]

[CTA LINK]

Talk soon,
[YOUR NAME]
```

---

## 📧 EMAIL 3: AUTHORITY + DIFFERENTIATION
**Send:** Day 2 Morning  
**Purpose:** Why this beats alternatives  
**Tag if clicked:** `Engaged - Clicked`

**Email Name (GHL):** `[OFFER] - Email 3 - Authority`

**Subject Lines:**
1. The unfair advantage (why this beats [ALTERNATIVE])
2. [ALTERNATIVE] vs [OFFER NAME] (honest comparison)
3. Why I'm switching to [OFFER NAME]

**Preview Text:** This is the difference that matters...

**Body:**
```
[First Name],

Yesterday I told you about [OFFER NAME].

Today I want to explain WHY it's different from [ALTERNATIVE].

[ALTERNATIVE] is like [ANALOGY - LIMITATION].

[OFFER NAME] is like [ANALOGY - BENEFIT].

It has:
→ [UNIQUE FEATURE 1]
→ [UNIQUE FEATURE 2]
→ [UNIQUE FEATURE 3]

While [ALTERNATIVE] is still [OLD WAY]...

[OFFER NAME] is already [NEW WAY].

This is the difference between:
• [LIMITED OUTCOME]
• [SUPERIOR OUTCOME]

[DEADLINE MENTION]

[CTA LINK]

Cheers,
[YOUR NAME]

P.S. [BONUS REMINDER]
```

---

## 📧 EMAIL 4: STORY + RELATABILITY
**Send:** Day 2 Evening  
**Purpose:** Social proof through narrative  
**Tag if clicked:** `Engaged - Clicked`

**Email Name (GHL):** `[OFFER] - Email 4 - Story`

**Subject Lines:**
1. [Case Study] From [STARTING POINT] to [RESULT] in [TIMEFRAME]
2. How [PERSON NAME] [ACHIEVED RESULT] (without [OBJECTION])
3. Real results: [TIMEFRAME] to [OUTCOME]

**Preview Text:** This is what happens when you stop trying to figure out HOW...

**Body:**
```
[First Name],

Let me paint you a picture...

[PERSON NAME] had [SITUATION/DESIRE].

[HE/SHE] knew [POTENTIAL]. [HE/SHE] knew [OPPORTUNITY].

But [HE/SHE] got stuck on the "how."

→ How do I [TASK 1]?
→ How do I [TASK 2]?
→ How do I [TASK 3]?
→ How do I [TASK 4]?

Then [HE/SHE] discovered [OFFER NAME].

Within [TIMEFRAME]:
• [RESULT 1]
• [RESULT 2]
• [RESULT 3]
• [RESULT 4]

[HE/SHE] didn't [COMMON OBJECTION 1].
[HE/SHE] didn't [COMMON OBJECTION 2].
[HE/SHE] didn't [COMMON OBJECTION 3].

[OFFER NAME] did everything.

This is what happens when you stop trying to figure out HOW...

And start letting [SOLUTION] handle [OUTCOME].

You can get the same results:
[CTA LINK]

But only if you act before [DEADLINE].

To your success,
[YOUR NAME]
```

---

## 📧 EMAIL 5: URGENCY + BONUS STACK
**Send:** Day 3 Morning  
**Purpose:** Deadline warning + Value reinforcement  
**Tag if clicked:** `Engaged - Clicked`

**Email Name (GHL):** `[OFFER] - Email 5 - Urgency`

**Subject Lines:**
1. [TIME REMAINING] left (then this disappears)
2. Your [TIME REMAINING] warning
3. Ends [DEADLINE]: [OFFER NAME] + $[BONUS VALUE] bonuses

**Preview Text:** When the clock hits zero...

**Body:**
```
[First Name],

This is your [TIME REMAINING] warning.

The [OFFER NAME] [PROMOTION TYPE] ends [DEADLINE].

When the clock hits zero:
→ [CONSEQUENCE 1]
→ [CONSEQUENCE 2]
→ [CONSEQUENCE 3]

What exactly do you get with my bonuses?

[BONUS 1 NAME] ($[VALUE] value)
[BONUS 1 DESCRIPTION]

[BONUS 2 NAME] ($[VALUE] value)
[BONUS 2 DESCRIPTION]

[BONUS 3 NAME] ($[VALUE] value)
[BONUS 3 DESCRIPTION]

Total value: $[TOTAL]. Yours free with [OFFER NAME].

But only if you act before the deadline.

Lock in your bonuses now:
[CTA LINK]

Don't wait until it's too late.

[YOUR NAME]
```

---

## 📧 EMAIL 6: OBJECTION HANDLING
**Send:** Day 3 Evening  
**Purpose:** Address #1 objection  
**Tag if clicked:** `Engaged - Clicked`

**Email Name (GHL):** `[OFFER] - Email 6 - Objections`

**Subject Lines:**
1. The question everyone asks before the deadline...
2. "Is this [OBJECTION]?" (honest answer)
3. Before you decide (read this)

**Preview Text:** Here's my honest answer...

**Body:**
```
[First Name],

As we approach the [DEADLINE], I'm getting the same question over and over:

"Is [OFFER NAME] really [OBJECTION HANDLING]?"

Here's my honest answer:

[ANSWER WITH PROOF/REASONING]

[SPECIFIC DETAIL 1]
[SPECIFIC DETAIL 2]
[SPECIFIC DETAIL 3]

The real question isn't "[SURFACE OBJECTION]?"

The real question is "[DEEPER QUESTION]?"

You have [TIME REMAINING] to decide.

Get [OFFER NAME] + all my bonuses:
[CTA LINK]

To your success,
[YOUR NAME]

P.S. [RISK REVERSAL OR GUARANTEE MENTION]
```

---

## 📧 EMAIL 7: FINAL HOURS
**Send:** Day 4 Morning  
**Purpose:** Maximum urgency  
**Tag if clicked:** `Engaged - Clicked`

**Email Name (GHL):** `[OFFER] - Email 7 - Final Hours`

**Subject Lines:**
1. FINAL HOURS (ends tonight at [TIME])
2. [TIME REMAINING] hours left
3. This is it (ends tonight)

**Preview Text:** This is your final warning...

**Body:**
```
[First Name],

This is it.

The final day.

Tonight at [TIME], the [OFFER NAME] [PROMOTION TYPE] ends.

The price goes up.
My bonuses disappear.
And you miss your chance to get [KEY BENEFIT].

Let me be direct with you...

In [TIMEFRAME], everyone will be [TREND].

The people who get in NOW will be ahead of the curve.

The people who wait will be playing catch-up.

Which group do you want to be in?

[OFFER NAME] gives you:
→ [BENEFIT 1]
→ [BENEFIT 2]
→ [BENEFIT 3]
→ [BONUS STACK REMINDER]

All for [PRICE]... but only until [TIME] tonight.

This is your moment.

Don't let it pass.

Claim your [KEY BENEFIT]:
[CTA LINK]

Talk soon,
[YOUR NAME]
```

---

## 📧 EMAIL 8: LAST CALL
**Send:** Day 4 Evening (3-4 hours before deadline)  
**Purpose:** Final decision push  
**Tag if clicked:** `Engaged - Clicked`

**Email Name (GHL):** `[OFFER] - Email 8 - Last Call`

**Subject Lines:**
1. [CLOSING TONIGHT] Last chance for [OFFER NAME]
2. Final hours: [OFFER NAME] closes at [TIME]
3. [FIRST NAME], this comes down in [TIME REMAINING]

**Preview Text:** After tonight, I won't be able to offer this again...

**Body:**
```
[First Name],

The countdown is almost over.

In just [TIME REMAINING], this page comes down:
[CTA LINK]

When it does:
→ [CONSEQUENCE 1]
→ [CONSEQUENCE 2]
→ [CONSEQUENCE 3]

I've done everything I can to show you the power of [OFFER NAME].

I've explained [KEY BENEFIT].
I've shared [PROOF TYPE].
I've offered you [BONUS STACK].

Now it's your turn to act.

Click here before it's too late:
[CTA LINK]

This is your final reminder.

After [DEADLINE], I won't be able to offer [BONUS/PRICE] again.

Don't miss out.

To your success,
[YOUR NAME]

P.S. The biggest regret I hear from people? "I wish I had started sooner." Don't let that be you. Act now: [CTA LINK]
```

---

# PART 4: SMS / OMNI-CHANNEL TOUCHPOINTS

## SMS Sequence (Optional but Recommended)

**Prerequisite:** Contact has phone number and opted in to SMS

### SMS 1: Initial Touch
**Trigger:** 4 hours after Email 1 (if not opened)
**Message:**
```
Hey [First Name]! Did you see my email about [OFFER NAME]? This is different from anything else out there. Check it out: [SHORT LINK]
```

### SMS 2: Mid-Sequence Nudge
**Trigger:** Day 3, 2 hours after Email 5
**Message:**
```
[First Name] - [TIME REMAINING] left to grab [OFFER NAME] with my $[BONUS VALUE] bonus package. Don't miss this: [SHORT LINK]
```

### SMS 3: Final Hours
**Trigger:** Day 4, 2 hours before deadline
**Message:**
```
Final call [First Name]! [OFFER NAME] closes at [TIME] tonight. This is your last chance for the bonuses: [SHORT LINK]
```

## Omni-Channel Best Practices

| Channel | When to Use | Message Length | Tone |
|---------|-------------|----------------|------|
| **Email** | Primary driver | 200-500 words | Conversational, detailed |
| **SMS** | Urgency/reminders | 160 chars max | Direct, urgent |
| **Voicemail** | High-ticket offers | 30-60 seconds | Personal, urgent |

---

# PART 5: TAGGING & SEGMENTATION SYSTEM

## Universal Affiliate Tag Structure

### Lead Stage Tags
| Tag | When Applied | Purpose |
|-----|--------------|---------|
| `Lead - New` | On workflow entry | Identify fresh leads |
| `Lead - Warm` | After 2 email opens | Identify engaged prospects |
| `Lead - Hot` | After link click | Identify high-intent prospects |
| `Buyer - [Offer]` | On purchase | Exclude from future promo |
| `Buyer - Multiple` | After 2nd purchase | VIP segment |

### Engagement Tags
| Tag | When Applied | Purpose |
|-----|--------------|---------|
| `Engaged - Opened` | Opened email (no click) | Nurture further |
| `Engaged - Clicked` | Clicked any link | Hot lead - follow up |
| `Engaged - Multiple` | 3+ link clicks | Very hot - personal outreach |
| `Unresponsive - [Offer]` | No opens after 3 emails | Re-engagement campaign |
| `Unsubscribed` | Opt-out | Suppress from emails |

### Sequence Tags
| Tag | When Applied | Purpose |
|-----|--------------|---------|
| `Sequence - Active - [Offer]` | On workflow entry | Prevent duplicate entry |
| `Sequence - Completed - [Offer]` | End of sequence | Track completion |
| `Sequence - Exited - [Offer]` | Early exit (purchase) | Track conversion |

### Source Tags
| Tag | When Applied | Purpose |
|-----|--------------|---------|
| `Source - [Traffic Source]` | On opt-in | Track channel performance |
| `Campaign - [Campaign Name]` | On opt-in | Track campaign ROI |

## How to Use Tags for Future Campaigns

### Example 1: Exclude Buyers
When promoting the same offer again:
- Filter: Tags do NOT contain `Buyer - [Offer]`

### Example 2: Re-engage Unresponsive
Create re-engagement campaign:
- Trigger: Tag `Unresponsive - [Offer]` added
- Sequence: 3-email "win-back" sequence

### Example 3: VIP Buyer Sequence
When someone buys:
- Add to `Buyer - [Offer]` workflow
- Send thank you + bonus delivery
- Add to `Buyer - Multiple` after 2nd purchase

---

# PART 6: REUSABLE SYSTEM LOGIC

## What Stays Constant (The Framework)

These elements work across ANY affiliate offer:

1. **Workflow Structure**
   - 8-email sequence timing
   - Conditional logic branches
   - Tagging system
   - Exit conditions

2. **Email Archetypes**
   - Hook/Curiosity (Email 1)
   - Problem Agitation (Email 2)
   - Authority/Differentiation (Email 3)
   - Story/Relatability (Email 4)
   - Urgency/Bonus Stack (Email 5)
   - Objection Handling (Email 6)
   - Final Hours (Email 7)
   - Last Call (Email 8)

3. **Psychological Sequence**
   - Curiosity → Problem → Authority → Story → Value → Urgency → Close

4. **Tagging Structure**
   - Lead stage tags
   - Engagement tags
   - Sequence status tags

## What Changes (The Variables)

Swap these for each new campaign:

| Element | How to Adapt |
|---------|--------------|
| **Offer Name** | Replace [OFFER NAME] throughout |
| **Key Benefits** | Update in Email 1, 2, 5, 7 |
| **Pain Points** | Customize in Email 2, 4, 6 |
| **Story/Case Study** | Replace with relevant example |
| **Bonuses** | Update values and descriptions |
| **Deadline** | Adjust all urgency references |
| **CTA Links** | Replace with affiliate link |
| **Objections** | Customize based on offer |

## Quick-Start Checklist for New Campaigns

- [ ] Fill in [OFFER NAME] in all emails
- [ ] Update [KEY BENEFITS] in Email 1, 2, 5, 7
- [ ] Customize [PAIN POINTS] in Email 2, 4, 6
- [ ] Replace [STORY] in Email 4
- [ ] Update [BONUS STACK] in Email 5
- [ ] Set [DEADLINE] in all urgency emails
- [ ] Replace [CTA LINK] with affiliate link
- [ ] Customize [OBJECTION] in Email 6
- [ ] Update workflow timing if needed
- [ ] Test all links before going live

---

# PART 7: GO HIGH LEVEL IMPLEMENTATION GUIDE

## Step-by-Step Workflow Creation

### Step 1: Create the Workflow

1. Log into Go High Level
2. Navigate to: **Automation → Workflows**
3. Click: **Create Workflow**
4. Name it: `[OFFER NAME] - Affiliate Sequence`
5. Description: `8-email affiliate sequence with conditional logic`

### Step 2: Set the Trigger

1. Click: **Add Trigger**
2. Select: **Tag**
3. Choose: **Tag Added**
4. Select/Create tag: `Affiliate Lead - [OFFER NAME]`
5. Click: **Save Trigger**

### Step 3: Add Initial Actions

**Action 0A: Apply Tag**
1. Click: **+** (Add Action)
2. Select: **Contacts → Apply Tag**
3. Tag: `Sequence - Active - [OFFER NAME]`
4. Click: **Save**

**Action 0B: Apply Tag**
1. Click: **+**
2. Select: **Contacts → Apply Tag**
3. Tag: `Lead - New`
4. Click: **Save**

**Action 0C: Remove Tag (Safety)**
1. Click: **+**
2. Select: **Contacts → Remove Tag**
3. Tag: `Sequence - Completed - [OFFER NAME]`
4. Click: **Save**

### Step 4: Add Email 1 (Immediate)

1. Click: **+**
2. Select: **Communication → Send Email**
3. Email Builder: Choose **Builder** or **HTML**
4. Subject Line: Copy from template
5. Body: Copy Email 1 template
6. From: Select your sender profile
7. Click: **Save**

**Add Click Tracking:**
1. Click the **Settings** icon on the email action
2. Enable: **Track Links**
3. Click: **Save**

### Step 5: Add Wait Step

1. Click: **+**
2. Select: **Flow Control → Wait**
3. Set: **12 hours**
4. Click: **Save**

### Step 6: Add Email 2

Repeat Step 4 with Email 2 template

### Step 7: Add Conditional Logic (Link Click)

1. Click: **+**
2. Select: **Flow Control → If/Else**
3. Condition: **Contact clicked link in email**
4. Select: **Any email** or **Specific email**
5. Click: **Save**

**YES Path (Clicked):**
1. Click: **+** under YES
2. Select: **Contacts → Apply Tag**
3. Tag: `Engaged - Clicked`
4. Click: **Save**

**NO Path (Not Clicked):**
1. Continue to next email in main flow

### Step 8: Add Purchase Exit Trigger

1. Click: **+** at the START of workflow (parallel path)
2. Select: **Trigger → Tag Added**
3. Tag: `Buyer - [OFFER NAME]`
4. Click: **Save**

**Add Exit Actions:**
1. Click: **+** under this trigger
2. Select: **Flow Control → Remove From Workflow**
3. Select: **This workflow**
4. Click: **Save**

5. Click: **+**
6. Select: **Contacts → Apply Tag**
7. Tag: `Buyer - [OFFER NAME]`
8. Click: **Save**

### Step 9: Complete All Emails

Continue adding:
- Wait steps (12 hours between emails)
- Email 3, 4, 5, 6, 7, 8
- Conditional logic after each email

### Step 10: Add End-of-Sequence Actions

After Email 8:

1. Click: **+**
2. Select: **Flow Control → Wait**
3. Set: **1 hour**
4. Click: **Save**

5. Click: **+**
6. Select: **Contacts → Apply Tag**
7. Tag: `Sequence - Completed - [OFFER NAME]`
8. Click: **Save**

9. Click: **+**
10. Select: **Contacts → Remove Tag**
11. Tag: `Sequence - Active - [OFFER NAME]`
12. Click: **Save**

### Step 11: Test the Workflow

1. Click: **Test** (top right)
2. Select a test contact (use your own email)
3. Click: **Run Test**
4. Check that:
   - Tags are applied correctly
   - Emails send in sequence
   - Timing is correct
   - Links work properly

### Step 12: Publish

1. Click: **Publish** (top right)
2. Confirm: **Publish Workflow**
3. Status changes to: **Active**

---

## How to Add SMS (Optional)

1. Click: **+** where you want SMS
2. Select: **Communication → Send SMS**
3. From: Select your phone number
4. Message: Copy SMS template
5. Click: **Save**

**SMS Conditional:**
- Only send if: Phone number exists
- Add condition: **Contact has phone number**

---

## How to Configure Delays

**Standard Timing:**
- Email 1: Immediate (0 delay)
- Email 2: 12 hours after Email 1
- Email 3: 12 hours after Email 2
- Email 4: 12 hours after Email 3
- Email 5: 12 hours after Email 4
- Email 6: 8 hours after Email 5
- Email 7: 12 hours after Email 6
- Email 8: 8 hours after Email 7

**Adjust for Your Deadline:**
- Work backward from your deadline
- Ensure Email 8 sends 3-4 hours before close
- Adjust wait times accordingly

---

## How to Apply Tags Correctly

**Manual Tag Application:**
1. Go to: **Contacts**
2. Select contact(s)
3. Click: **Actions → Apply Tag**
4. Select tag
5. Click: **Apply**

**Bulk Tag Application:**
1. Go to: **Contacts**
2. Filter contacts
3. Select all
4. Click: **Actions → Apply Tag**
5. Select tag
6. Click: **Apply**

**Tag Removal:**
Same process, choose **Remove Tag** instead

---

## Testing Checklist

Before going live, verify:

- [ ] Trigger works (test contact enters workflow)
- [ ] Email 1 sends immediately
- [ ] Wait times are correct
- [ ] All 8 emails send in sequence
- [ ] Link clicks are tracked
- [ ] Tags apply correctly
- [ ] Purchase exit removes from workflow
- [ ] Unsubscribe stops sequence
- [ ] All links go to correct affiliate URL
- [ ] Emails render correctly on mobile

---

# APPENDIX: OPENCLAW CRACKED EXAMPLE

## Filled-In Template Example

**Offer Name:** OpenClaw Cracked  
**Offer Type:** Software/Launch  
**Target Audience:** Entrepreneurs, marketers, beginners  
**Campaign Goal:** Direct sales  
**Tone:** Conversational, curiosity-driven  
**Key Benefits:** AI execution, 10 business models, zero technical skills  
**Pain Points:** Don't know how to build, lack technical skills, no time  
**Offer Details:** $[price], $438 bonuses, ends March 21  
**Affiliate Link:** https://redeyedeal.com/oc_cracked  
**Number of Emails:** 8  
**Trigger:** Tag Added: "Affiliate Lead - OpenClaw"  

See `openclaw-cracked-email-sequence.md` for the complete filled-in emails.

---

**END OF WORKFLOW SYSTEM GUIDE**

*This system is designed to be reusable across any affiliate offer. Simply swap the variables and deploy.*
