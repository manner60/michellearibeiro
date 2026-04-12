#!/usr/bin/env node
/**
 * GHL Workflow Builder for OpenClaw Cracked Launch
 * Creates complete 8-email affiliate sequence with conditional logic
 */

const https = require('https');

// GHL Configuration
const GHL_CONFIG = {
  locationId: '7oO9LcZ4EyYPCAuU9wdH',
  apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IjdvTzlMY1o0RXlZUENBdVU5d2RIIiwidmVyc2lvbiI6MSwiaWF0IjoxNzczODU2MDU0NjM5LCJzdWIiOiJmaVVFQklGNGFCMEN6RFAzampFWCJ9.obtGqkW1rmzYZyR1Of3yh-9hsSZm8qsYZPMvM3cfV3M',
  baseUrl: 'rest.gohighlevel.com'
};

// Email Templates
const EMAILS = [
  {
    name: 'OpenClaw - Email 1 - Hook',
    subject: 'The AI tool that actually *does* the work (not just answers questions)',
    body: `Hey {{contact.first_name}},

I've seen a lot of AI tools come and go.

Most of them are just chatbots with better marketing.

They answer questions. They write content. But when it comes to actually *building* something?

You're still doing 90% of the work.

OpenClaw Cracked is different.

This isn't an AI that thinks. It's an AI that *acts*.

It logs into systems. Builds pages. Writes copy. Drives traffic. Generates revenue.

While you sleep.

Think about that for a second...

An AI that doesn't just suggest what you should do—it actually does it.

Deploys a fully automated online business without you writing a single line of code.

I've put together an exclusive bonus package for you that makes this even more powerful (worth $438, yours free).

But this offer ends March 21st. After that, the price goes up and my bonuses disappear.

See what OpenClaw Cracked can do for you:
https://redeyedeal.com/oc_cracked

To your success,
Michelle

P.S. The "Cracked" version simplifies everything to under 2 minutes setup. No coding. No confusion. Just results.`
  },
  {
    name: 'OpenClaw - Email 2 - Problem',
    subject: '10 business models. 1 AI. Zero technical skills.',
    body: `{{contact.first_name}},

Quick question:

What's stopping you from launching an online business right now?

• Don't know what to build?
• Don't know how to build it?
• Don't have technical skills?
• Don't have time?

OpenClaw Cracked eliminates ALL of those excuses.

It comes with 10 proven money-making models:
→ Local Lead Generation
→ Amazon FBA
→ Digital Products
→ Freelance Services
→ And 6 more...

The AI builds everything for you.

You just pick a model, and OpenClaw executes.

Landing pages? Done.
Sales copy? Done.
Traffic generation? Done.

This is your chance to stop being an AI "prompter" and start being an AI-powered entrepreneur.

My exclusive bonus package (worth $438) is only available until March 21st:
https://redeyedeal.com/oc_cracked

Talk soon,
Michelle`
  },
  {
    name: 'OpenClaw - Email 3 - Authority',
    subject: 'The unfair advantage (why this beats every other AI tool)',
    body: `{{contact.first_name}},

Yesterday I told you about OpenClaw Cracked.

Today I want to explain WHY it's different from every other AI tool on the market.

Most AI tools are like hiring a brilliant consultant who gives you great advice...

But then YOU have to do all the work.

OpenClaw is like hiring an entire team that actually EXECUTES.

It has:
→ Eyes (it can see and analyze web pages)
→ Ears (it can process information)
→ Hands (it can click, type, build, and deploy)

While other AI tools are still "thinking" about what to do...

OpenClaw has already built your business, written your copy, and started driving traffic.

This is the difference between:
• An AI that *can* help you
• An AI that *does* help you

The launch special ends March 21st. Price goes up. My bonuses disappear.

Get the unfair advantage here:
https://redeyedeal.com/oc_cracked

Cheers,
Michelle

P.S. My bonus package includes the "AI Business-in-a-Box" Launch Kit with 5 ready-to-deploy templates. You could have a business live today.`
  },
  {
    name: 'OpenClaw - Email 4 - Story',
    subject: '[Case Study] From idea to live business in 24 hours',
    body: `{{contact.first_name}},

Let me paint you a picture...

Sarah had an idea for a local lead generation business.

She knew the model worked. She knew the potential was huge.

But she got stuck on the "how."

→ How do I build the landing page?
→ How do I write the copy?
→ How do I find clients?
→ How do I automate it?

Then she discovered OpenClaw Cracked.

Within 24 hours:
• Her landing page was live
• Her sales copy was written
• Her traffic system was running
• She had her first qualified lead

She didn't write a single line of code.
She didn't hire a developer.
She didn't spend weeks figuring it out.

The AI did everything.

This is what happens when you stop trying to figure out HOW...

And start letting AI handle the execution.

You can get the same results:
https://redeyedeal.com/oc_cracked

But only if you act before March 21st.

To your success,
Michelle`
  },
  {
    name: 'OpenClaw - Email 5 - Urgency',
    subject: '48 hours left (then this disappears)',
    body: `{{contact.first_name}},

This is your 48-hour warning.

The OpenClaw Cracked launch special ends tomorrow night.

When the clock hits zero:
→ The price increases
→ My exclusive bonus package disappears
→ You miss out on the unfair advantage

What exactly do you get with my bonuses?

1. AI Business-in-a-Box Launch Kit ($97 value)
   5 ready-to-deploy templates for the most profitable business models

2. AI Organizer Access (Up to $97 value)
   Save, search, and reuse all your AI conversations and prompts

3. AI Traffic Tsunami Checklist ($47 value)
   Step-by-step guide to automating free traffic streams

4. Local Lead Gen Goldmine Pack ($67 value)
   10 untapped niches + email templates + sales scripts

5. Freelance Arbitrage Accelerator ($47 value)
   How to find high-paying clients on Upwork/Fiverr

Total value: $438. Yours free with OpenClaw Cracked.

But only if you act before the deadline.

Lock in your bonuses now:
https://redeyedeal.com/oc_cracked

Don't wait until it's too late.

Michelle`
  },
  {
    name: 'OpenClaw - Email 6 - Objections',
    subject: 'The question everyone asks before the deadline...',
    body: `{{contact.first_name}},

As we approach the March 21st deadline, I'm getting the same question over and over:

"Is OpenClaw Cracked really beginner-friendly?"

Here's my honest answer:

Yes. That's literally the point of the "Cracked" version.

The original OpenClaw was powerful but complex.

The "Cracked" version was specifically designed to take that power and make it accessible to complete beginners.

Setup takes under 2 minutes.

No coding.
No technical skills.
No confusion.

The AI guides you through everything.

If you can click a mouse, you can deploy an AI-powered business.

The real question isn't "Can I do this?"

The real question is "Will I do this before the opportunity passes?"

You have less than 24 hours to decide.

Get OpenClaw Cracked + all my bonuses:
https://redeyedeal.com/oc_cracked

To your success,
Michelle

P.S. Still on the fence? Remember, you get my entire bonus package ($438 value) free. That's like getting paid to try it.`
  },
  {
    name: 'OpenClaw - Email 7 - Final Hours',
    subject: 'FINAL HOURS (ends tonight at midnight)',
    body: `{{contact.first_name}},

This is it.

The final day.

Tonight at midnight, the OpenClaw Cracked launch special ends.

The price goes up.
My bonuses disappear.
And you miss your chance to get the unfair advantage.

Let me be direct with you...

In a few months, everyone will be using AI to build businesses.

The people who get in NOW will be ahead of the curve.

The people who wait will be playing catch-up.

Which group do you want to be in?

OpenClaw Cracked gives you:
→ An AI that executes (not just thinks)
→ 10 proven business models
→ Zero technical complexity
→ My $438 bonus package (free)

All for one low price... but only until midnight tonight.

This is your moment.

Don't let it pass.

Claim your unfair advantage:
https://redeyedeal.com/oc_cracked

Talk soon,
Michelle`
  },
  {
    name: 'OpenClaw - Email 8 - Last Call',
    subject: '[CLOSING TONIGHT] Last chance for OpenClaw Cracked + $438 bonuses',
    body: `{{contact.first_name}},

The countdown is almost over.

In just a few hours, this page comes down:
https://redeyedeal.com/oc_cracked

When it does:
→ OpenClaw Cracked price increases
→ My exclusive bonus package is gone forever
→ You pay more and get less

I've done everything I can to show you the power of this tool.

I've explained the unfair advantage.
I've shared the case studies.
I've offered you $438 in custom bonuses.

Now it's your turn to act.

Click here before it's too late:
https://redeyedeal.com/oc_cracked

This is your final reminder.

After tonight, I won't be able to offer these bonuses again.

Don't miss out.

To your success,
Michelle

P.S. The biggest regret I hear from people? "I wish I had started sooner." Don't let that be you. Act now: https://redeyedeal.com/oc_cracked`
  }
];

// Helper function for API calls
function ghlRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: GHL_CONFIG.baseUrl,
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${GHL_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      }
    };

    if (data) {
      const postData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => responseData += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${JSON.stringify(parsed)}`));
          }
        } catch (e) {
          resolve(responseData);
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Create tags first
async function createTags() {
  console.log('🏷️  Creating tags...\n');
  
  const tags = [
    'OCC',
    'Sequence - Active - OpenClaw',
    'Sequence - Completed - OpenClaw',
    'Lead - New',
    'Engaged - Clicked',
    'Engaged - Opened',
    'Buyer - OpenClaw'
  ];

  for (const tag of tags) {
    try {
      await ghlRequest('POST', '/v1/tags', {
        name: tag,
        locationId: GHL_CONFIG.locationId
      });
      console.log(`  ✅ Created tag: ${tag}`);
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log(`  ⚠️  Tag exists: ${tag}`);
      } else {
        console.log(`  ❌ Error creating tag ${tag}: ${err.message}`);
      }
    }
  }
}

// Create email templates
async function createEmails() {
  console.log('\n📧 Creating email templates...\n');
  
  const emailIds = [];
  
  for (const email of EMAILS) {
    try {
      const result = await ghlRequest('POST', '/v1/emails', {
        name: email.name,
        subject: email.subject,
        body: email.body,
        locationId: GHL_CONFIG.locationId,
        type: 'html'
      });
      emailIds.push({ name: email.name, id: result.id });
      console.log(`  ✅ Created email: ${email.name}`);
    } catch (err) {
      console.log(`  ❌ Error creating email ${email.name}: ${err.message}`);
    }
  }
  
  return emailIds;
}

// Create workflow
async function createWorkflow(emailIds) {
  console.log('\n⚙️  Creating workflow...\n');
  
  // Build workflow structure
  const workflow = {
    name: 'OpenClaw Cracked - Launch Sequence',
    locationId: GHL_CONFIG.locationId,
    status: 'published',
    trigger: {
      type: 'tag',
      event: 'added',
      tag: 'OCC'
    },
    actions: []
  };

  // Initial tag actions
  workflow.actions.push(
    { type: 'apply_tag', tag: 'Sequence - Active - OpenClaw' },
    { type: 'apply_tag', tag: 'Lead - New' },
    { type: 'remove_tag', tag: 'Sequence - Completed - OpenClaw' }
  );

  // Add emails with waits
  const waitTimes = [0, 12, 12, 12, 12, 8, 12, 8]; // hours between emails
  
  for (let i = 0; i < emailIds.length; i++) {
    if (waitTimes[i] > 0) {
      workflow.actions.push({
        type: 'wait',
        duration: waitTimes[i],
        unit: 'hours'
      });
    }
    
    workflow.actions.push({
      type: 'send_email',
      emailId: emailIds[i].id,
      trackLinks: true
    });
    
    // Add conditional logic after each email (except last)
    if (i < emailIds.length - 1) {
      workflow.actions.push({
        type: 'if_else',
        condition: 'link_clicked',
        yesActions: [
          { type: 'apply_tag', tag: 'Engaged - Clicked' }
        ],
        noActions: []
      });
    }
  }

  // Final actions
  workflow.actions.push(
    { type: 'wait', duration: 1, unit: 'hours' },
    { type: 'apply_tag', tag: 'Sequence - Completed - OpenClaw' },
    { type: 'remove_tag', tag: 'Sequence - Active - OpenClaw' }
  );

  try {
    const result = await ghlRequest('POST', '/v1/workflows', workflow);
    console.log(`  ✅ Workflow created: ${result.id}`);
    return result.id;
  } catch (err) {
    console.log(`  ❌ Error creating workflow: ${err.message}`);
    throw err;
  }
}

// Main execution
async function main() {
  console.log('🚀 GHL Workflow Builder - OpenClaw Cracked\n');
  console.log('=====================================\n');

  try {
    // Step 1: Create tags
    await createTags();
    
    // Step 2: Create email templates
    const emailIds = await createEmails();
    
    if (emailIds.length === 0) {
      throw new Error('No emails were created successfully');
    }
    
    // Step 3: Create workflow
    const workflowId = await createWorkflow(emailIds);
    
    console.log('\n=====================================');
    console.log('✅ WORKFLOW BUILD COMPLETE!\n');
    console.log(`Workflow ID: ${workflowId}`);
    console.log(`Emails created: ${emailIds.length}`);
    console.log(`Tags created: 7`);
    console.log('\n📋 Next steps:');
    console.log('1. Go to Automation → Workflows in GHL');
    console.log('2. Find "OpenClaw Cracked - Launch Sequence"');
    console.log('3. Review and activate');
    console.log('4. Test with your email address');
    console.log('\n🎯 To start the sequence on a contact:');
    console.log('   Apply tag "OCC" to any contact');
    
  } catch (err) {
    console.error('\n❌ Build failed:', err.message);
    process.exit(1);
  }
}

main();
