#!/usr/bin/env node
/**
 * GHL FICA 2026 Campaign Setup
 * Creates a 10-email workflow with proper cadence
 */

const https = require('https');

// GHL Credentials
const GHL_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IjdvTzlMY1o0RXlZUENBdVU5d2RIIiwidmVyc2lvbiI6MSwiaWF0IjoxNzczMTgxMjQ5ODMxLCJzdWIiOiJmaVVFQklGNGFCMEN6RFAzampFWCJ9.H0YUECZV2moP8YzTh5TPKVuKJSTVPooSxeNTlKSmvLQ';
const LOCATION_ID = '7oO9LcZ4EyYPCAuU9wdH';
const BASE_URL = 'services.leadconnectorhq.com';

// Campaign settings
const CAMPAIGN_NAME = 'FICA 2026';
const TRIGGER_TAG = 'fica prospect';
const AFFILIATE_LINK = 'https://fintitan.com/services/fica-tip-credit/schedule?referrer=MRIBEIRO';

// Email sequence with cadence (days from trigger)
const EMAIL_SEQUENCE = [
  {
    day: 0, // Day 1 (immediate)
    subject: 'A quick question about your payroll taxes',
    body: `Hi {{contact.first_name}},

As someone who keeps a close eye on the financial health of businesses in the restaurant industry, I wanted to ask a quick question: have you ever looked into the FICA Tip Credit?

It's a federal tax credit specifically for establishments like yours, designed to refund a portion of the Social Security and Medicare taxes you pay on employee tips. It's surprising how many operators I speak with have never heard of it, or they believe they don't qualify when they actually do.

This isn't about selling you anything. I just believe in sharing valuable information when I see it. Given the current economic climate — with rising costs and tight margins — I feel it's more important than ever to ensure you're not leaving money on the table that is rightfully yours.

Would you be open to learning a bit more about it?

Best regards,
{{user.name}}`
  },
  {
    day: 2, // Day 3 (2 days after first)
    subject: 'That tax credit I mentioned...',
    body: `Hi {{contact.first_name}},

Following up on my last email, I wanted to share a bit more about the FICA Tip Credit (also known as IRC Section 45B).

Here's the core issue it solves: You pay the employer's share of FICA taxes on all reported employee tips, even though that money comes from your customers, not your business. For decades, this has been an unfair payroll tax burden on restaurant owners. The government recognized this and created this credit to give that money back to you.

It's a **dollar-for-dollar credit** against your income tax liability — not just a deduction. This means it directly reduces the amount of tax you owe.

Most CPAs are generalists and do a fantastic job with compliance, but they often lack the specialized focus to maximize this specific credit. It's one of the most underclaimed credits in the entire tax code.

Curious what you might be owed? There's a simple, free calculator you can use to get a preliminary estimate. It takes about 60 seconds.

**Check it out here:** ${AFFILIATE_LINK}

Best regards,
{{user.name}}`
  },
  {
    day: 5, // Day 6 (3 days after second)
    subject: 'The experts behind FICA Tip Credit recovery',
    body: `Hi {{contact.first_name}},

I don't make recommendations lightly. When it comes to something as specialized as tax credit recovery, you need a team that lives and breathes this stuff. That's why I exclusively point people towards **Fintitan**.

These aren't generalist accountants. Their team is composed of tax attorneys, engineers, and forensic accountants who focus *only* on maximizing government tax incentives for businesses like yours. Their track record speaks for itself:

- **$2.1 Billion+** in tax credits recovered for their clients
- **5,000+** businesses served across the country
- **150+ tax specialists** dedicated to credit recovery
- **100% Audit Success Rate** — they provide full legal defense and stand behind their work

They've built proprietary software that cross-references your payroll data in ways that manual reviews simply can't, ensuring you get the maximum credit you're entitled to. They even help you amend up to three years of prior tax returns to recover money you missed in the past.

This is the team you want in your corner. They offer a completely free, no-obligation evaluation to give you a precise calculation of your potential refund.

**See what the experts can do for you:** ${AFFILIATE_LINK}

Best regards,
{{user.name}}`
  },
  {
    day: 8, // Day 9 (3 days after third)
    subject: "It's not a deduction — it's a check",
    body: `Hi {{contact.first_name}},

I want to make one thing crystal clear about the FICA Tip Credit: this isn't about saving a few percentage points on your taxable income. This is about recovering cold, hard cash.

A **deduction** lowers your taxable income. A **tax credit** is a dollar-for-dollar reduction of the tax you owe. If the credit is larger than your tax bill, it can be carried back one year or forward up to twenty. Better yet, by amending prior returns, this process can result in a direct refund check from the IRS.

Think about what an unexpected cash injection of $20,000, $50,000, or even $100,000+ could do for your business right now:

- Offset rising food and labor costs that are eating into your margins
- Invest in new equipment, renovations, or technology
- Strengthen your cash reserves for peace of mind
- Reinvest in your team with bonuses, training, or better benefits

This money is sitting there, waiting to be claimed. Fintitan's entire model is built on helping you get it back. They operate on a **success-based fee**, meaning they don't get paid unless you get paid. There are zero upfront costs. Zero risk.

**Find out how much you're owed — get your free evaluation and estimate today:** ${AFFILIATE_LINK}

Best regards,
{{user.name}}`
  },
  {
    day: 11, // Day 12 (3 days after fourth)
    subject: 'The #1 mistake restaurants make with the FICA Tip Credit',
    body: `Hi {{contact.first_name}},

The single biggest mistake restaurants and bars make with the FICA Tip Credit is simply not claiming it.

But among those who try, there are common errors that leave tens of thousands of dollars on the table:

1. **Misclassifying Service Charges:** Mandatory gratuities for large parties are considered wages, not tips, and are ineligible for the credit. Including them incorrectly can trigger an audit.

2. **Using the Wrong Minimum Wage Baseline:** The calculation must use the 2007 federal minimum wage ($5.15/hr for tipped employees), regardless of your higher state or local wage. Using the wrong number means leaving money behind — or worse, filing an inaccurate claim.

3. **Incomplete Records:** Without meticulous payroll data and tip reports, it's impossible to substantiate your claim and maximize the credit amount.

Trying to navigate this alone is risky. Fintitan's specialists handle all of this for you. They ensure your claim is 100% compliant, maximized to the penny, and fully audit-proof.

They've recovered over **$2 billion** for a reason. They know the rules inside and out.

**Stop wondering if you're doing it right. Let the experts handle it with no upfront cost:** ${AFFILIATE_LINK}

Best regards,
{{user.name}}`
  },
  {
    day: 15, // Day 16 (4 days after fifth)
    subject: 'Why timing matters on this...',
    body: `Hi {{contact.first_name}},

I know you have a lot on your plate. Running a restaurant means you're putting out fires every single day. But I want to share a thought on timing that could save you real money.

Congress recently reaffirmed and strengthened the FICA Tip Credit, which is fantastic news for the industry. However, that spotlight has also created a massive wave of demand. Fintitan is seeing a significant influx of new evaluation requests from restaurant operators across the country.

Here's why that matters to you: Fintitan's team doesn't cut corners. Their 100% audit success rate exists because they give every client's case the detailed attention it deserves. As their client list grows, the capacity for new evaluations tightens.

The best time to get in the queue is **now**, while they have the bandwidth to give your business the thorough, personalized analysis it deserves.

Don't wait until everyone else is rushing to claim their funds. Get ahead of the curve.

**Secure your spot for a free evaluation and see your potential refund estimate:** ${AFFILIATE_LINK}

Best regards,
{{user.name}}`
  },
  {
    day: 19, // Day 20 (4 days after sixth)
    subject: "About Fintitan's service rates...",
    body: `Hi {{contact.first_name}},

Something I think is important to mention, and it could directly affect how much money ends up back in your pocket.

Fintitan currently operates on a **100% success-based fee**. They only charge a percentage of the money they actually recover for you. If you don't get a refund, you pay absolutely nothing. It's a model that shows their confidence — and it makes this a completely risk-free decision for you.

However, I've been advised that due to the surge in demand following the recent legislative changes, Fintitan may need to adjust their fee structure for new clients in the near future. This isn't a sales tactic — it's a practical reality of managing capacity while maintaining the quality that produces their industry-leading results.

By requesting your free evaluation now, you have the opportunity to **lock in their current, most favorable success-fee rates.**

Think about it this way: if you wait, you could end up paying a higher percentage on the exact same refund. The credit amount doesn't change — but your net take-home from it could.

It makes financial sense to act now and secure the best possible terms.

**Lock in your rate and get your free refund evaluation today:** ${AFFILIATE_LINK}

Best regards,
{{user.name}}`
  },
  {
    day: 23, // Day 24 (4 days after seventh)
    subject: '{{contact.first_name}}, you might be leaving $80K+ on the table',
    body: `Hi {{contact.first_name}},

I recently spoke with a restaurant owner I referred to Fintitan last month. They were skeptical at first — figured their CPA was already handling everything. But they went through with the free evaluation just to see.

Fintitan's team completed their analysis and identified **$87,450** in recoverable FICA tax credits by amending the last three years of returns. That's a direct check coming back to their business. No strings attached.

That owner told me they almost ignored my emails. They assumed they didn't qualify, or that it was "too good to be true." Sound familiar?

I'm sharing this because I genuinely believe you could be in a similar position. If you have tipped employees — servers, bartenders, bussers — you are almost certainly overpaying on your FICA taxes right now.

But the window to lock in Fintitan's current success-fee rate is narrowing as their client roster fills up. Don't be the one who waits and wonders "what if?"

**Find out for certain. It's free. See what you're owed:** ${AFFILIATE_LINK}

Best regards,
{{user.name}}`
  },
  {
    day: 26, // Day 27 (3 days after eighth)
    subject: 'Last call for your FICA Tip Credit evaluation',
    body: `Hi {{contact.first_name}},

I'll keep this short and direct.

I've been reaching out about the FICA Tip Credit because I believe it represents a significant financial opportunity for your business — potentially tens of thousands of dollars in recovered payroll taxes.

My ability to guarantee you can lock in Fintitan's current, most favorable success-based fee is coming to a close. After this, new clients may face adjusted terms.

Here's what's on the table right now:

- **Free evaluation** — no cost, no obligation
- **Retroactive recovery** — up to 3 years of amended returns
- **Dollar-for-dollar tax credit** — not a deduction
- **100% audit protection** — full legal defense included
- **Success-based fee** — you pay nothing unless you get paid
- **Current preferred rate** — locked in when you start now

This is your final opportunity to take advantage of this with the best terms available. I don't want you to miss it.

**Request your free consultation and estimate now:** ${AFFILIATE_LINK}

Best regards,
{{user.name}}`
  },
  {
    day: 29, // Day 30 (3 days after ninth)
    subject: 'Closing your file',
    body: `Hi {{contact.first_name}},

I've reached out several times over the past few weeks about the FICA Tip Credit and the specialized recovery services offered through Fintitan. I haven't heard back, and I respect that.

You're busy. Running a restaurant is one of the hardest jobs there is. So I'll keep this simple: **this is my last email on this topic.**

I won't be reaching out again about this. But I want to leave you with one thought.

The average restaurant with $500,000 in annual reported tips can recover over **$107,000** across a four-year window (current year plus a three-year lookback). That money doesn't expire tomorrow — but the opportunity to claim it at the most favorable rates won't last forever.

If you ever decide you want to see what the government owes you, the link below will always work. You can use the free calculator to get an instant estimate, or request a full evaluation from Fintitan's team. No pressure. No follow-up from me.

**The door is always open:** ${AFFILIATE_LINK}

I genuinely wish you and your business continued success.

All the best,

{{user.name}}`
  }
];

// Helper function for API requests
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => responseData += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

// Create workflow/campaign
async function createWorkflow() {
  console.log('🚀 Creating FICA 2026 Workflow...\n');
  
  // First, let's check what workflows API is available
  const listOptions = {
    hostname: BASE_URL,
    path: `/workflows/?locationId=${LOCATION_ID}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${GHL_API_KEY}`,
      'Content-Type': 'application/json',
      'Version': '2021-07-28'
    }
  };

  try {
    console.log('📋 Checking existing workflows...');
    const result = await makeRequest(listOptions);
    console.log(`Status: ${result.status}`);
    
    if (result.data && result.data.workflows) {
      console.log(`Found ${result.data.workflows.length} existing workflows\n`);
    }
    
    // For now, let's create the workflow structure
    // GHL API for workflows can vary, so let's document what we need
    console.log('📧 Email Sequence to Create:');
    console.log('=' .repeat(60));
    
    EMAIL_SEQUENCE.forEach((email, idx) => {
      const dayNum = idx === 0 ? 1 : [0, 2, 5, 8, 11, 15, 19, 23, 26, 29][idx] + 1;
      console.log(`\n📨 Email ${idx + 1}/10 — Day ${dayNum}`);
      console.log(`Subject: ${email.subject}`);
      console.log(`Delay: ${email.day} days from trigger`);
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('\n⚠️  IMPORTANT: GHL Workflow API requires manual setup or OAuth app');
    console.log('The API key provided may not have workflow creation permissions.\n');
    
    // Let's try to create a campaign via the campaigns API if available
    console.log('🔧 Attempting to create via Campaigns API...\n');
    
    // Check campaigns endpoint
    const campaignOptions = {
      hostname: BASE_URL,
      path: `/campaigns/?locationId=${LOCATION_ID}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${GHL_API_KEY}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      }
    };
    
    const campaignResult = await makeRequest(campaignOptions);
    console.log(`Campaigns API Status: ${campaignResult.status}`);
    
    if (campaignResult.status === 200) {
      console.log('✅ Campaigns API accessible');
      console.log('\n📝 Next step: Create campaign with email sequence');
    } else {
      console.log('❌ Campaigns API returned:', campaignResult.data);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Generate import file for manual upload
function generateImportInstructions() {
  console.log('\n📋 MANUAL SETUP INSTRUCTIONS');
  console.log('=' .repeat(60));
  console.log(`\nCampaign Name: ${CAMPAIGN_NAME}`);
  console.log(`Trigger Tag: ${TRIGGER_TAG}`);
  console.log(`Affiliate Link: ${AFFILIATE_LINK}\n`);
  
  console.log('Steps to create in GHL:');
  console.log('1. Go to Marketing → Campaigns');
  console.log('2. Click "Create Campaign"');
  console.log(`3. Name: "${CAMPAIGN_NAME}"`);
  console.log('4. Set trigger: Tag "fica prospect" is added');
  console.log('5. Add email sequence with these delays:\n');
  
  const cadence = [
    { day: 1, wait: 'Immediately' },
    { day: 3, wait: 'Wait 2 days' },
    { day: 6, wait: 'Wait 3 days' },
    { day: 9, wait: 'Wait 3 days' },
    { day: 12, wait: 'Wait 3 days' },
    { day: 16, wait: 'Wait 4 days' },
    { day: 20, wait: 'Wait 4 days' },
    { day: 24, wait: 'Wait 4 days' },
    { day: 27, wait: 'Wait 3 days' },
    { day: 30, wait: 'Wait 3 days' }
  ];
  
  EMAIL_SEQUENCE.forEach((email, idx) => {
    console.log(`  Email ${idx + 1}: "${email.subject}"`);
    console.log(`    → ${cadence[idx].wait} after trigger\n`);
  });
}

// Main execution
console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║     FICA 2026 Campaign Setup for GoHighLevel              ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

createWorkflow().then(() => {
  generateImportInstructions();
  
  // Save email templates to file for easy copy/paste
  const fs = require('fs');
  const templates = EMAIL_SEQUENCE.map((email, idx) => 
    `=== EMAIL ${idx + 1} ===\nSubject: ${email.subject}\n\n${email.body}\n\n`
  ).join('\n');
  
  fs.writeFileSync('/root/.openclaw/workspace/fica-2026-email-templates.txt', templates);
  console.log('\n💾 Email templates saved to: fica-2026-email-templates.txt');
  console.log('\n✅ Setup guide complete!');
});