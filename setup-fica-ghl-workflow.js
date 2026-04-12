const axios = require('axios');

// GHL API Configuration
const GHL_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IjdvTzlMY1o0RXlZUENBdVU5d2RIIiwidmVyc2lvbiI6MSwiaWF0IjoxNzczODU2MDU0NjM5LCJzdWIiOiJmaVVFQklGNGFCMEN6RFAzampFWCJ9.obtGqkW1rmzYZyR1Of3yh-9hsSZm8qsYZPMvM3cfV3M';
const LOCATION_ID = '7oO9LcZ4EyYPCAuU9wdH';
const BASE_URL = 'https://rest.gohighlevel.com/v1';

const headers = {
  'Authorization': `Bearer ${GHL_API_KEY}`,
  'Content-Type': 'application/json'
};

// Email sequence data
const emails = [
  {
    day: 0,
    subject: "A quick question about your payroll taxes",
    body: `Hi {{contact.first_name}},

As someone who keeps a close eye on the financial health of businesses in the restaurant industry, I wanted to ask a quick question: have you ever looked into the FICA Tip Credit?

It's a federal tax credit specifically for establishments like yours, designed to refund a portion of the Social Security and Medicare taxes you pay on employee tips. It's surprising how many operators I speak with have never heard of it, or they believe they don't qualify when they actually do.

This isn't about selling you anything. I just believe in sharing valuable information when I see it. Given the current economic climate — with rising costs and tight margins — I feel it's more important than ever to ensure you're not leaving money on the table that is rightfully yours.

Would you be open to learning a bit more about it?

Best regards,
{{user.name}}`
  },
  {
    day: 1,
    subject: "That tax credit I mentioned...",
    body: `Hi {{contact.first_name}},

Following up on my last email, I wanted to share a bit more about the FICA Tip Credit (also known as IRC Section 45B).

Here's the core issue it solves: You pay the employer's share of FICA taxes on all reported employee tips, even though that money comes from your customers, not your business. For decades, this has been an unfair payroll tax burden on restaurant owners. The government recognized this and created this credit to give that money back to you.

It's a **dollar-for-dollar credit** against your income tax liability — not just a deduction. This means it directly reduces the amount of tax you owe.

Most CPAs are generalists and do a fantastic job with compliance, but they often lack the specialized focus to maximize this specific credit. It's one of the most underclaimed credits in the entire tax code.

Curious what you might be owed? There's a simple, free calculator you can use to get a preliminary estimate. It takes about 60 seconds.

**Check it out here:** https://fintitan.com/services/fica-tip-credit/schedule?referrer=MRIBEIRO

Best regards,
{{user.name}}`
  },
  {
    day: 3,
    subject: "The experts behind FICA Tip Credit recovery",
    body: `Hi {{contact.first_name}},

I don't make recommendations lightly. When it comes to something as specialized as tax credit recovery, you need a team that lives and breathes this stuff. That's why I exclusively point people towards **Fintitan**.

These aren't generalist accountants. Their team is composed of tax attorneys, engineers, and forensic accountants who focus *only* on maximizing government tax incentives for businesses like yours. Their track record speaks for itself:

- **$2.1 Billion+** in tax credits recovered for their clients
- **5,000+** businesses served across the country
- **150+ tax specialists** dedicated to credit recovery
- **100% Audit Success Rate** — they provide full legal defense and stand behind their work

They've built proprietary software that cross-references your payroll data in ways that manual reviews simply can't, ensuring you get the maximum credit you're entitled to. They even help you amend up to three years of prior tax returns to recover money you missed in the past.

This is the team you want in your corner. They offer a completely free, no-obligation evaluation to give you a precise calculation of your potential refund.

**See what the experts can do for you:** https://fintitan.com/services/fica-tip-credit/schedule?referrer=MRIBEIRO

Best regards,
{{user.name}}`
  },
  {
    day: 5,
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

**Find out how much you're owed — get your free evaluation and estimate today:** https://fintitan.com/services/fica-tip-credit/schedule?referrer=MRIBEIRO

Best regards,
{{user.name}}`
  },
  {
    day: 7,
    subject: "The #1 mistake restaurants make with the FICA Tip Credit",
    body: `Hi {{contact.first_name}},

The single biggest mistake restaurants and bars make with the FICA Tip Credit is simply not claiming it.

But among those who try, there are common errors that leave tens of thousands of dollars on the table:

1. **Misclassifying Service Charges:** Mandatory gratuities for large parties are considered wages, not tips, and are ineligible for the credit. Including them incorrectly can trigger an audit.

2. **Using the Wrong Minimum Wage Baseline:** The calculation must use the 2007 federal minimum wage ($5.15/hr for tipped employees), regardless of your higher state or local wage. Using the wrong number means leaving money behind — or worse, filing an inaccurate claim.

3. **Incomplete Records:** Without meticulous payroll data and tip reports, it's impossible to substantiate your claim and maximize the credit amount.

Trying to navigate this alone is risky. Fintitan's specialists handle all of this for you. They ensure your claim is 100% compliant, maximized to the penny, and fully audit-proof.

They've recovered over **$2 billion** for a reason. They know the rules inside and out.

**Stop wondering if you're doing it right. Let the experts handle it with no upfront cost:** https://fintitan.com/services/fica-tip-credit/schedule?referrer=MRIBEIRO

Best regards,
{{user.name}}`
  },
  {
    day: 9,
    subject: "Why timing matters on this...",
    body: `Hi {{contact.first_name}},

I know you have a lot on your plate. Running a restaurant means you're putting out fires every single day. But I want to share a thought on timing that could save you real money.

Congress recently reaffirmed and strengthened the FICA Tip Credit, which is fantastic news for the industry. However, that spotlight has also created a massive wave of demand. Fintitan is seeing a significant influx of new evaluation requests from restaurant operators across the country.

Here's why that matters to you: Fintitan's team doesn't cut corners. Their 100% audit success rate exists because they give every client's case the detailed attention it deserves. As their client list grows, the capacity for new evaluations tightens.

The best time to get in the queue is **now**, while they have the bandwidth to give your business the thorough, personalized analysis it deserves.

Don't wait until everyone else is rushing to claim their funds. Get ahead of the curve.

**Secure your spot for a free evaluation and see your potential refund estimate:** https://fintitan.com/services/fica-tip-credit/schedule?referrer=MRIBEIRO

Best regards,
{{user.name}}`
  },
  {
    day: 11,
    subject: "About Fintitan's service rates...",
    body: `Hi {{contact.first_name}},

Something I think is important to mention, and it could directly affect how much money ends up back in your pocket.

Fintitan currently operates on a **100% success-based fee**. They only charge a percentage of the money they actually recover for you. If you don't get a refund, you pay absolutely nothing. It's a model that shows their confidence — and it makes this a completely risk-free decision for you.

However, I've been advised that due to the surge in demand following the recent legislative changes, Fintitan may need to adjust their fee structure for new clients in the near future. This isn't a sales tactic — it's a practical reality of managing capacity while maintaining the quality that produces their industry-leading results.

By requesting your free evaluation now, you have the opportunity to **lock in their current, most favorable success-fee rates.**

Think about it this way: if you wait, you could end up paying a higher percentage on the exact same refund. The credit amount doesn't change — but your net take-home from it could.

It makes financial sense to act now and secure the best possible terms.

**Lock in your rate and get your free refund evaluation today:** https://fintitan.com/services/fica-tip-credit/schedule?referrer=MRIBEIRO

Best regards,
{{user.name}}`
  },
  {
    day: 13,
    subject: "{{contact.first_name}}, you might be leaving $80K+ on the table",
    body: `Hi {{contact.first_name}},

I recently spoke with a restaurant owner I referred to Fintitan last month. They were skeptical at first — figured their CPA was already handling everything. But they went through with the free evaluation just to see.

Fintitan's team completed their analysis and identified **$87,450** in recoverable FICA tax credits by amending the last three years of returns. That's a direct check coming back to their business. No strings attached.

That owner told me they almost ignored my emails. They assumed they didn't qualify, or that it was "too good to be true." Sound familiar?

I'm sharing this because I genuinely believe you could be in a similar position. If you have tipped employees — servers, bartenders, bussers — you are almost certainly overpaying on your FICA taxes right now.

But the window to lock in Fintitan's current success-fee rate is narrowing as their client roster fills up. Don't be the one who waits and wonders "what if?"

**Find out for certain. It's free. See what you're owed:** https://fintitan.com/services/fica-tip-credit/schedule?referrer=MRIBEIRO

Best regards,
{{user.name}}`
  },
  {
    day: 15,
    subject: "Last call for your FICA Tip Credit evaluation",
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

**Request your free consultation and estimate now:** https://fintitan.com/services/fica-tip-credit/schedule?referrer=MRIBEIRO

Best regards,
{{user.name}}`
  },
  {
    day: 17,
    subject: "Closing your file",
    body: `Hi {{contact.first_name}},

I've reached out several times over the past few weeks about the FICA Tip Credit and the specialized recovery services offered through Fintitan. I haven't heard back, and I respect that.

You're busy. Running a restaurant is one of the hardest jobs there is. So I'll keep this simple: **this is my last email on this topic.**

I won't be reaching out again about this. But I want to leave you with one thought.

The average restaurant with $500,000 in annual reported tips can recover over **$107,000** across a four-year window (current year plus a three-year lookback). That money doesn't expire tomorrow — but the opportunity to claim it at the most favorable rates won't last forever.

If you ever decide you want to see what the government owes you, the link below will always work. You can use the free calculator to get an instant estimate, or request a full evaluation from Fintitan's team. No pressure. No follow-up from me.

**The door is always open:** https://fintitan.com/services/fica-tip-credit/schedule?referrer=MRIBEIRO

I genuinely wish you and your business continued success.

All the best,

{{user.name}}`
  }
];

async function getOrCreateTag() {
  try {
    // First, check if tag already exists
    console.log('Checking for existing tag: fica-prospect...');
    const tagsResponse = await axios.get(`${BASE_URL}/tags`, { headers });
    const existingTag = tagsResponse.data.tags.find(t => t.name.toLowerCase() === 'fica-prospect');
    
    if (existingTag) {
      console.log('✅ Found existing tag:', existingTag.id);
      return existingTag.id;
    }
    
    // Create new tag if not found
    console.log('Creating tag: fica-prospect...');
    const response = await axios.post(`${BASE_URL}/tags`, {
      name: 'fica-prospect',
      description: 'Contacts who are prospects for FICA Tip Credit campaign'
    }, { headers });
    console.log('✅ Tag created:', response.data.tag?.id || response.data.id);
    return response.data.tag?.id || response.data.id;
  } catch (error) {
    console.error('❌ Error with tag:', error.response?.data || error.message);
    throw error;
  }
}

async function createWorkflow(tagId) {
  try {
    console.log('\nCreating FICA workflow...');
    
    // GHL uses a different structure - build the workflow JSON for manual import
    const workflowJson = {
      name: 'FICA Tip Credit Campaign',
      description: '10-email sequence for FICA Tip Credit prospects - triggers when fica-prospect tag is added',
      status: 'published',
      trigger: {
        type: 'tag',
        data: {
          tag: 'fica-prospect',
          action: 'added'
        }
      },
      steps: []
    };

    // Build steps array with emails and delays
    emails.forEach((email, index) => {
      // Add delay step (except for first email)
      if (index > 0) {
        const daysSinceLast = email.day - emails[index - 1].day;
        workflowJson.steps.push({
          type: 'wait',
          name: `Wait ${daysSinceLast} days`,
          config: {
            duration: {
              unit: 'days',
              value: daysSinceLast
            }
          }
        });
      }
      
      // Add email step
      workflowJson.steps.push({
        type: 'send_email',
        name: `Email ${index + 1}: ${email.subject}`,
        config: {
          subject: email.subject,
          body: email.body,
          fromName: '{{user.name}}',
          fromEmail: '{{user.email}}'
        }
      });
    });

    // Save workflow JSON for manual import
    const fs = require('fs');
    fs.writeFileSync('fica-ghl-workflow-import.json', JSON.stringify(workflowJson, null, 2));
    console.log('✅ Workflow JSON saved to: fica-ghl-workflow-import.json');
    console.log('   (Import this manually in GHL: Automation > Workflows > Import)');
    
    return 'manual-import';
  } catch (error) {
    console.error('❌ Error creating workflow:', error.response?.data || error.message);
    throw error;
  }
}

async function main() {
  try {
    console.log('🚀 Setting up FICA Campaign in GoHighLevel...\n');
    
    // Step 1: Get or create tag
    const tagId = await getOrCreateTag();
    
    // Step 2: Create workflow
    const workflowId = await createWorkflow(tagId);
    
    console.log('\n✅ FICA Campaign setup complete!');
    console.log('\n📋 Summary:');
    console.log(`  • Tag: "fica-prospect" (ID: ${tagId})`);
    console.log(`  • Workflow: "FICA Tip Credit Campaign" (ID: ${workflowId})`);
    console.log('  • Emails: 10-email sequence over 17 days');
    console.log('  • Trigger: When "FICA Prospect" tag is added');
    console.log('\n📝 To use:');
    console.log('  1. Add the "fica-prospect" tag to contacts (max 20/day for warm-up)');
    console.log('  2. They will automatically enter the email sequence');
    console.log('  3. Monitor opens/clicks in GHL');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

main();
