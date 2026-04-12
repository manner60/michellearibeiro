#!/usr/bin/env node
/**
 * GHL FICA 2026 WORKFLOW Setup
 * Creates a workflow automation with 10 emails
 */

const https = require('https');

// GHL Credentials - NEW API ENDPOINT
const GHL_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IjdvTzlMY1o0RXlZUENBdVU5d2RIIiwidmVyc2lvbiI6MSwiaWF0IjoxNzczNjczODI3NzUyLCJzdWIiOiJmaVVFQklGNGFCMEN6RFAzampFWCJ9.5a5JkqsuxWoPjihe1K90tM4lsU35VRu1Ul7XKHSqqms';
const LOCATION_ID = '7oO9LcZ4EyYPCAuU9wdH';
const BASE_URL = 'rest.gohighlevel.com';

// Campaign settings
const WORKFLOW_NAME = 'FICA 2026';
const TRIGGER_TAG = 'fica prospect';
const AFFILIATE_LINK = 'https://fintitan.com/services/fica-tip-credit/schedule?referrer=MRIBEIRO';

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

// Create workflow
async function createWorkflow() {
  console.log('🚀 Creating FICA 2026 WORKFLOW...\n');
  
  // First, let's check existing workflows
  const listOptions = {
    hostname: BASE_URL,
    path: `/v1/workflows/?locationId=${LOCATION_ID}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${GHL_API_KEY}`,
      'Content-Type': 'application/json',
      'Version': '2021-07-28'
    }
  };

  try {
    console.log('📋 Checking existing workflows...');
    const listResult = await makeRequest(listOptions);
    console.log(`Status: ${listResult.status}`);
    
    if (listResult.status === 200 && listResult.data) {
      console.log(`Found workflows:`, listResult.data.workflows ? listResult.data.workflows.length : 'N/A');
    }
    
    // Create workflow payload
    const workflowPayload = {
      name: WORKFLOW_NAME,
      locationId: LOCATION_ID,
      status: 'published',
      trigger: {
        type: 'tag',
        name: TRIGGER_TAG
      },
      steps: [
        // Email 1 - Day 1 (immediate)
        {
          type: 'email',
          name: 'Email 1 - Gentle Introduction',
          subject: 'A quick question about your payroll taxes',
          body: `Hi {{contact.first_name}},\n\nAs someone who keeps a close eye on the financial health of businesses in the restaurant industry, I wanted to ask a quick question: have you ever looked into the FICA Tip Credit?\n\nIt's a federal tax credit specifically for establishments like yours, designed to refund a portion of the Social Security and Medicare taxes you pay on employee tips. It's surprising how many operators I speak with have never heard of it, or they believe they don't qualify when they actually do.\n\nThis isn't about selling you anything. I just believe in sharing valuable information when I see it. Given the current economic climate — with rising costs and tight margins — I feel it's more important than ever to ensure you're not leaving money on the table that is rightfully yours.\n\nWould you be open to learning a bit more about it?\n\nBest regards,\n{{user.name}}`,
          delay: 0
        },
        // Wait 2 days
        { type: 'wait', name: 'Wait 2 days', delay: 172800 },
        // Email 2 - Day 3
        {
          type: 'email',
          name: 'Email 2 - Educational Deep Dive',
          subject: 'That tax credit I mentioned...',
          body: `Hi {{contact.first_name}},\n\nFollowing up on my last email, I wanted to share a bit more about the FICA Tip Credit (also known as IRC Section 45B).\n\nHere's the core issue it solves: You pay the employer's share of FICA taxes on all reported employee tips, even though that money comes from your customers, not your business. For decades, this has been an unfair payroll tax burden on restaurant owners. The government recognized this and created this credit to give that money back to you.\n\nIt's a **dollar-for-dollar credit** against your income tax liability — not just a deduction. This means it directly reduces the amount of tax you owe.\n\nMost CPAs are generalists and do a fantastic job with compliance, but they often lack the specialized focus to maximize this specific credit. It's one of the most underclaimed credits in the entire tax code.\n\nCurious what you might be owed? There's a simple, free calculator you can use to get a preliminary estimate. It takes about 60 seconds.\n\n**Check it out here:** ${AFFILIATE_LINK}\n\nBest regards,\n{{user.name}}`
        },
        // Wait 3 days
        { type: 'wait', name: 'Wait 3 days', delay: 259200 },
        // Email 3 - Day 6
        {
          type: 'email',
          name: 'Email 3 - Introducing the Specialist',
          subject: 'The experts behind FICA Tip Credit recovery',
          body: `Hi {{contact.first_name}},\n\nI don't make recommendations lightly. When it comes to something as specialized as tax credit recovery, you need a team that lives and breathes this stuff. That's why I exclusively point people towards **Fintitan**.\n\nThese aren't generalist accountants. Their team is composed of tax attorneys, engineers, and forensic accountants who focus *only* on maximizing government tax incentives for businesses like yours. Their track record speaks for itself:\n\n- **$2.1 Billion+** in tax credits recovered for their clients\n- **5,000+** businesses served across the country\n- **150+ tax specialists** dedicated to credit recovery\n- **100% Audit Success Rate** — they provide full legal defense and stand behind their work\n\nThey've built proprietary software that cross-references your payroll data in ways that manual reviews simply can't, ensuring you get the maximum credit you're entitled to. They even help you amend up to three years of prior tax returns to recover money you missed in the past.\n\nThis is the team you want in your corner. They offer a completely free, no-obligation evaluation to give you a precise calculation of your potential refund.\n\n**See what the experts can do for you:** ${AFFILIATE_LINK}\n\nBest regards,\n{{user.name}}`
        },
        // Wait 3 days
        { type: 'wait', name: 'Wait 3 days', delay: 259200 },
        // Email 4 - Day 9
        {
          type: 'email',
          name: 'Email 4 - Value Proposition',
          subject: "It's not a deduction — it's a check",
          body: `Hi {{contact.first_name}},\n\nI want to make one thing crystal clear about the FICA Tip Credit: this isn't about saving a few percentage points on your taxable income. This is about recovering cold, hard cash.\n\nA **deduction** lowers your taxable income. A **tax credit** is a dollar-for-dollar reduction of the tax you owe. If the credit is larger than your tax bill, it can be carried back one year or forward up to twenty. Better yet, by amending prior returns, this process can result in a direct refund check from the IRS.\n\nThink about what an unexpected cash injection of $20,000, $50,000, or even $100,000+ could do for your business right now:\n\n- Offset rising food and labor costs that are eating into your margins\n- Invest in new equipment, renovations, or technology\n- Strengthen your cash reserves for peace of mind\n- Reinvest in your team with bonuses, training, or better benefits\n\nThis money is sitting there, waiting to be claimed. Fintitan's entire model is built on helping you get it back. They operate on a **success-based fee**, meaning they don't get paid unless you get paid. There are zero upfront costs. Zero risk.\n\n**Find out how much you're owed — get your free evaluation and estimate today:** ${AFFILIATE_LINK}\n\nBest regards,\n{{user.name}}`
        },
        // Wait 3 days
        { type: 'wait', name: 'Wait 3 days', delay: 259200 },
        // Email 5 - Day 12
        {
          type: 'email',
          name: 'Email 5 - Common Mistakes',
          subject: 'The #1 mistake restaurants make with the FICA Tip Credit',
          body: `Hi {{contact.first_name}},\n\nThe single biggest mistake restaurants and bars make with the FICA Tip Credit is simply not claiming it.\n\nBut among those who try, there are common errors that leave tens of thousands of dollars on the table:\n\n1. **Misclassifying Service Charges:** Mandatory gratuities for large parties are considered wages, not tips, and are ineligible for the credit. Including them incorrectly can trigger an audit.\n\n2. **Using the Wrong Minimum Wage Baseline:** The calculation must use the 2007 federal minimum wage ($5.15/hr for tipped employees), regardless of your higher state or local wage. Using the wrong number means leaving money behind — or worse, filing an inaccurate claim.\n\n3. **Incomplete Records:** Without meticulous payroll data and tip reports, it's impossible to substantiate your claim and maximize the credit amount.\n\nTrying to navigate this alone is risky. Fintitan's specialists handle all of this for you. They ensure your claim is 100% compliant, maximized to the penny, and fully audit-proof.\n\nThey've recovered over **$2 billion** for a reason. They know the rules inside and out.\n\n**Stop wondering if you're doing it right. Let the experts handle it with no upfront cost:** ${AFFILIATE_LINK}\n\nBest regards,\n{{user.name}}`
        },
        // Wait 4 days
        { type: 'wait', name: 'Wait 4 days', delay: 345600 },
        // Email 6 - Day 16
        {
          type: 'email',
          name: 'Email 6 - Urgency Angle',
          subject: 'Why timing matters on this...',
          body: `Hi {{contact.first_name}},\n\nI know you have a lot on your plate. Running a restaurant means you're putting out fires every single day. But I want to share a thought on timing that could save you real money.\n\nCongress recently reaffirmed and strengthened the FICA Tip Credit, which is fantastic news for the industry. However, that spotlight has also created a massive wave of demand. Fintitan is seeing a significant influx of new evaluation requests from restaurant operators across the country.\n\nHere's why that matters to you: Fintitan's team doesn't cut corners. Their 100% audit success rate exists because they give every client's case the detailed attention it deserves. As their client list grows, the capacity for new evaluations tightens.\n\nThe best time to get in the queue is **now**, while they have the bandwidth to give your business the thorough, personalized analysis it deserves.\n\nDon't wait until everyone else is rushing to claim their funds. Get ahead of the curve.\n\n**Secure your spot for a free evaluation and see your potential refund estimate:** ${AFFILIATE_LINK}\n\nBest regards,\n{{user.name}}`
        },
        // Wait 4 days
        { type: 'wait', name: 'Wait 4 days', delay: 345600 },
        // Email 7 - Day 20
        {
          type: 'email',
          name: 'Email 7 - Lock In Your Rate',
          subject: "About Fintitan's service rates...",
          body: `Hi {{contact.first_name}},\n\nSomething I think is important to mention, and it could directly affect how much money ends up back in your pocket.\n\nFintitan currently operates on a **100% success-based fee**. They only charge a percentage of the money they actually recover for you. If you don't get a refund, you pay absolutely nothing. It's a model that shows their confidence — and it makes this a completely risk-free decision for you.\n\nHowever, I've been advised that due to the surge in demand following the recent legislative changes, Fintitan may need to adjust their fee structure for new clients in the near future. This isn't a sales tactic — it's a practical reality of managing capacity while maintaining the quality that produces their industry-leading results.\n\nBy requesting your free evaluation now, you have the opportunity to **lock in their current, most favorable success-fee rates.**\n\nThink about it this way: if you wait, you could end up paying a higher percentage on the exact same refund. The credit amount doesn't change — but your net take-home from it could.\n\nIt makes financial sense to act now and secure the best possible terms.\n\n**Lock in your rate and get your free refund evaluation today:** ${AFFILIATE_LINK}\n\nBest regards,\n{{user.name}}`
        },
        // Wait 4 days
        { type: 'wait', name: 'Wait 4 days', delay: 345600 },
        // Email 8 - Day 24
        {
          type: 'email',
          name: 'Email 8 - Final Warning',
          subject: '{{contact.first_name}}, you might be leaving $80K+ on the table',
          body: `Hi {{contact.first_name}},\n\nI recently spoke with a restaurant owner I referred to Fintitan last month. They were skeptical at first — figured their CPA was already handling everything. But they went through with the free evaluation just to see.\n\nFintitan's team completed their analysis and identified **$87,450** in recoverable FICA tax credits by amending the last three years of returns. That's a direct check coming back to their business. No strings attached.\n\nThat owner told me they almost ignored my emails. They assumed they didn't qualify, or that it was "too good to be true." Sound familiar?\n\nI'm sharing this because I genuinely believe you could be in a similar position. If you have tipped employees — servers, bartenders, bussers — you are almost certainly overpaying on your FICA taxes right now.\n\nBut the window to lock in Fintitan's current success-fee rate is narrowing as their client roster fills up. Don't be the one who waits and wonders "what if?"\n\n**Find out for certain. It's free. See what you're owed:** ${AFFILIATE_LINK}\n\nBest regards,\n{{user.name}}`
        },
        // Wait 3 days
        { type: 'wait', name: 'Wait 3 days', delay: 259200 },
        // Email 9 - Day 27
        {
          type: 'email',
          name: 'Email 9 - Last Chance',
          subject: 'Last call for your FICA Tip Credit evaluation',
          body: `Hi {{contact.first_name}},\n\nI'll keep this short and direct.\n\nI've been reaching out about the FICA Tip Credit because I believe it represents a significant financial opportunity for your business — potentially tens of thousands of dollars in recovered payroll taxes.\n\nMy ability to guarantee you can lock in Fintitan's current, most favorable success-based fee is coming to a close. After this, new clients may face adjusted terms.\n\nHere's what's on the table right now:\n\n- **Free evaluation** — no cost, no obligation\n- **Retroactive recovery** — up to 3 years of amended returns\n- **Dollar-for-dollar tax credit** — not a deduction\n- **100% audit protection** — full legal defense included\n- **Success-based fee** — you pay nothing unless you get paid\n- **Current preferred rate** — locked in when you start now\n\nThis is your final opportunity to take advantage of this with the best terms available. I don't want you to miss it.\n\n**Request your free consultation and estimate now:** ${AFFILIATE_LINK}\n\nBest regards,\n{{user.name}}`
        },
        // Wait 3 days
        { type: 'wait', name: 'Wait 3 days', delay: 259200 },
        // Email 10 - Day 30
        {
          type: 'email',
          name: 'Email 10 - Breakup Email',
          subject: 'Closing your file',
          body: `Hi {{contact.first_name}},\n\nI've reached out several times over the past few weeks about the FICA Tip Credit and the specialized recovery services offered through Fintitan. I haven't heard back, and I respect that.\n\nYou're busy. Running a restaurant is one of the hardest jobs there is. So I'll keep this simple: **this is my last email on this topic.**\n\nI won't be reaching out again about this. But I want to leave you with one thought.\n\nThe average restaurant with $500,000 in annual reported tips can recover over **$107,000** across a four-year window (current year plus a three-year lookback). That money doesn't expire tomorrow — but the opportunity to claim it at the most favorable rates won't last forever.\n\nIf you ever decide you want to see what the government owes you, the link below will always work. You can use the free calculator to get an instant estimate, or request a full evaluation from Fintitan's team. No pressure. No follow-up from me.\n\n**The door is always open:** ${AFFILIATE_LINK}\n\nI genuinely wish you and your business continued success.\n\nAll the best,\n\n{{user.name}}`
        }
      ]
    };

    // Try to create workflow
    console.log('\n🔧 Creating workflow...');
    const createOptions = {
      hostname: BASE_URL,
      path: '/v1/workflows/',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GHL_API_KEY}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      }
    };

    const createResult = await makeRequest(createOptions, JSON.stringify(workflowPayload));
    console.log(`Status: ${createResult.status}`);
    
    if (createResult.status === 200 || createResult.status === 201) {
      console.log('✅ WORKFLOW CREATED SUCCESSFULLY!');
      console.log('Workflow ID:', createResult.data.id || createResult.data.workflow?.id);
      console.log('\nWorkflow Details:');
      console.log('- Name:', WORKFLOW_NAME);
      console.log('- Trigger: Tag "fica prospect"');
      console.log('- 10 emails with proper wait times');
      return createResult.data;
    } else {
      console.log('❌ Failed to create workflow');
      console.log('Response:', JSON.stringify(createResult.data, null, 2));
      
      // Check if workflows API has different structure
      console.log('\n📋 Trying alternative workflow creation...');
      
      // Try with simplified payload
      const simplePayload = {
        name: WORKFLOW_NAME,
        locationId: LOCATION_ID,
        status: 'published'
      };
      
      const simpleResult = await makeRequest(createOptions, JSON.stringify(simplePayload));
      console.log(`Simple create status: ${simpleResult.status}`);
      console.log('Response:', JSON.stringify(simpleResult.data, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Main execution
console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║     FICA 2026 WORKFLOW Setup for GoHighLevel              ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

createWorkflow().then((result) => {
  if (!result) {
    console.log('\n⚠️  Automated workflow creation failed.');
    console.log('The GHL API may require manual workflow setup.');
  }
});