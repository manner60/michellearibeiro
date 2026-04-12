const https = require('https');

const LETTERMAN_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWFlMjIyODQ3ODcyYjI4YjRkNDJkZGQiLCJrZXkiOiIyYWNiOWZlNjk0OWQ1MWIyODdmMjY2ZGM2ZDVjNzZmZiIsImlkIjoiNjlhZjY0NWE0Nzg3MmIyOGI0ZDY2MGZhIiwiaWF0IjoxNzczMTAyMTcwLCJleHAiOjE4MDQ2MzgxNzB9.kPubZoPK9GrJEHTMz0RAKQAhdKYYEEgP_Nbo_7iAdgA';
const BIZBUZZ_STORAGE_ID = '69c6f96237ba49fb69a44b52';

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.letterman.ai',
      port: 443,
      path: `/api/ai${path}`,
      method: method,
      headers: {
        'Authorization': `Bearer ${LETTERMAN_API_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function createNewsletter() {
  // Step 1: Create base newsletter
  const newsletterData = {
    storageId: BIZBUZZ_STORAGE_ID,
    type: "NEWSLETTER",
    articleOptions: {
      contentFrom: "CONTENT",
      keepOriginal: true,
      headline: "The $50K Grant You Might Be Missing + Why Local Businesses Are Betting on Calgary's Recovery",
      subHeadline: "Welcome to BizBuzz Calgary! Your weekly pulse on local business news, opportunities, and growth strategies.",
      content: "<p>Welcome to BizBuzz Calgary!</p>",
      keywords: ["calgary business", "small business grants", "alberta business", "local business", "business growth"],
      imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200",
      summary: {
        title: "BizBuzz Calgary - Issue #1",
        description: "The $50K grant you might be missing, Calgary's economic pulse, Google Business Profile tips, and a local business spotlight.",
        imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600",
        content: "<p>Welcome to BizBuzz Calgary! This week: Alberta small business grants with real deadlines, economic updates, a growth tip you can implement today, and a local business spotlight.</p>"
      }
    }
  };

  console.log('Creating newsletter...');
  const result = await makeRequest('/newsletters', 'POST', newsletterData);
  console.log('Newsletter created:', result.data._id);
  
  const newsletterId = result.data._id;
  
  // Step 2: Add all sections
  await addSections(newsletterId);
  
  // Step 3: Update SEO
  await updateSEO(newsletterId);
  
  console.log('\n✅ Newsletter created successfully!');
  console.log('Newsletter ID:', newsletterId);
}

async function addSections(newsletterId) {
  const sections = [
    // Section 0: AI_ARTICLE - Welcome Message
    {
      type: "AI_ARTICLE",
      index: 0,
      title: "Welcome to BizBuzz Calgary",
      promptOutPut: `<p><strong>Welcome to your new weekly ritual.</strong></p>
<p>&nbsp;</p>
<p>Every Tuesday morning, BizBuzz Calgary lands in your inbox with one mission: <strong>helping Calgary business owners stay ahead.</strong></p>
<p>&nbsp;</p>
<p>Here's what you can expect each week:</p>
<p>&nbsp;</p>
<p><strong>📈 The Weekly Buzz</strong> — Economic pulse, grant deadlines, and business news that affects your bottom line.</p>
<p>&nbsp;</p>
<p><strong>🎯 Growth Tip of the Week</strong> — Actionable strategies you can implement today.</p>
<p>&nbsp;</p>
<p><strong>🔦 Local Business Spotlight</strong> — Calgary businesses doing something worth learning from.</p>
<p>&nbsp;</p>
<p><strong>🛠 Tool or Resource</strong> — Software, grants, or opportunities to help you grow.</p>
<p>&nbsp;</p>
<p><strong>📣 Opportunities Board</strong> — Deadlines, events, and funding you can't miss.</p>
<p>&nbsp;</p>
<p>We're building something special here — a resource for Calgary business owners who want to stay informed, connected, and ahead of the curve.</p>
<p>&nbsp;</p>
<p><strong>Got a tip? A business to feature? An event to promote?</strong> Hit reply and let us know.</p>
<p>&nbsp;</p>
<p>Welcome to the buzz. 🐝</p>`,
      style: { width: "600", "object-fit": "contain", marginBottom: "10" }
    },
    
    // Section 1: CUSTOM_COMBO - The Weekly Buzz
    {
      type: "CUSTOM_COMBO",
      index: 1,
      title: "<p>📈 The Weekly Buzz</p>",
      subTitle: "Calgary Business Pulse",
      promptOutPut: `<p><strong>Economic Snapshot:</strong> Calgary's unemployment rate dropped to 6.2% in February — the lowest since 2019. Translation: stronger consumer spending and more opportunities for local businesses.</p>
<p>&nbsp;</p>
<p><strong>Policy Watch:</strong> The City of Calgary's Small Business Tax Assistance Program deadline has been extended to April 15. If property tax hikes are squeezing your margins, apply now through Calgary.ca.</p>
<p>&nbsp;</p>
<p><strong>Trend Alert:</strong> "Micro-events" are replacing large conferences. Local venues report 40% more bookings for 20-50 person corporate gatherings. Opportunity for event spaces, caterers, and service providers.</p>
<p>&nbsp;</p>
<p><strong>Closing Note:</strong> After 23 years, Stephen Avenue's iconic The Bay department store is officially shuttering. Retailers nearby should prepare for foot traffic shifts — and potential lease opportunities.</p>`,
      style: { width: "600" },
      hasBorder: true,
      showTitle: true,
      blockTitle: "<p style='color: #00D264; font-weight: bold;'>THIS WEEK</p>",
      showBlockTitle: true
    },
    
    // Section 2: AI_ARTICLE - Growth Tip
    {
      type: "AI_ARTICLE",
      index: 2,
      title: "🎯 Growth Tip of the Week",
      promptOutPut: `<p><strong>Turn Your Google Business Profile Into a Lead Machine</strong></p>
<p>&nbsp;</p>
<p>Most Calgary businesses have a Google listing. Few optimize it. Here's how to stand out:</p>
<p>&nbsp;</p>
<p><strong>1. Post weekly updates</strong> — Treat it like social media. Share promotions, events, or new products directly on your listing. Active profiles rank higher.</p>
<p>&nbsp;</p>
<p><strong>2. Add photos monthly</strong> — Businesses with 100+ photos get 520% more calls than those with none. Snap your space, team, products, and happy customers.</p>
<p>&nbsp;</p>
<p><strong>3. Enable messaging</strong> — 82% of local searches happen on mobile. Let customers text you directly from Google. Response time matters — aim for under 5 minutes.</p>
<p>&nbsp;</p>
<p><strong>4. Request reviews strategically</strong> — Ask happy customers within 24 hours of service. Include a direct link to make it effortless. Aim for 10+ new reviews monthly.</p>
<p>&nbsp;</p>
<p><strong>The bottom line:</strong> A optimized Google Business Profile is free advertising that works while you sleep.</p>`,
      style: { width: "600", "object-fit": "contain", marginBottom: "10" }
    },
    
    // Section 3: SPONSOR_SPOT - Featured Business
    {
      type: "SPONSOR_SPOT",
      index: 3,
      title: "🔦 Local Business Spotlight",
      subTitle: "Featured Business",
      promptOutPut: `<p><strong>Inglewood Family Dental</strong></p>
<p>&nbsp;</p>
<p>Located in the heart of Inglewood at <strong>1420 9 Ave SE</strong>, Dr. Smith and team have been keeping Calgary smiling for over 15 years. From routine cleanings to cosmetic dentistry, they combine modern technology with old-fashioned personal care.</p>
<p>&nbsp;</p>
<p><strong>What they're doing well:</strong> Building long-term patient relationships through consistent service and community involvement. In a competitive market, they've grown primarily through referrals — proof that quality work speaks for itself.</p>
<p>&nbsp;</p>
<p><strong>Special offer for BizBuzz readers:</strong> Mention this newsletter for 20% off your first whitening treatment.</p>
<p>&nbsp;</p>
<p><a href="https://calgarybizguide.com/dt_listing/inglewood-family-dental-2/">View Listing →</a></p>`,
      style: { width: "600", "object-fit": "contain", marginBottom: "10" },
      includeButton: true,
      button: {
        text: "Visit Website",
        url: "https://calgarybizguide.com/dt_listing/inglewood-family-dental-2/",
        type: "solid",
        size: "md",
        style: { color: "#ffffff", backgroundColor: "#4F53D9" }
      }
    },
    
    // Section 4: AI_ARTICLE - Tool/Resource
    {
      type: "AI_ARTICLE",
      index: 4,
      title: "🛠 Tool of the Week",
      promptOutPut: `<p><strong>Canva's "Brand Kit" Feature</strong></p>
<p>&nbsp;</p>
<p><strong>What it is:</strong> A free tool to store your logo, colors, fonts, and templates in one place.</p>
<p>&nbsp;</p>
<p><strong>Who it's for:</strong> Any Calgary business creating social posts, flyers, or email graphics without a full-time designer.</p>
<p>&nbsp;</p>
<p><strong>Why it's valuable:</strong> Consistency builds trust. Brand Kit ensures every Instagram post, menu update, or promotional flyer looks professionally on-brand — even when your team is making it. Takes 10 minutes to set up, saves hours of decision fatigue.</p>
<p>&nbsp;</p>
<p><strong>Pro tip:</strong> Add your Brand Kit link to your onboarding docs so new team members can create on-brand content from day one.</p>`,
      style: { width: "600", "object-fit": "contain", marginBottom: "10" }
    },
    
    // Section 5: CUSTOM_COMBO - Opportunities Board
    {
      type: "CUSTOM_COMBO",
      index: 5,
      title: "<p>📣 Opportunities Board</p>",
      promptOutPut: `<p><strong>🚨 Alberta Small Business Innovation Grant</strong></p>
<p>Up to $50,000 for tech adoption or process improvements. Deadline: April 30.</p>
<p><a href="https://www.alberta.ca/small-business-resources">Learn More →</a></p>
<p>&nbsp;</p>
<p><strong>🏆 Calgary Chamber Business Awards</strong></p>
<p>Nominations open. Winners get major media exposure. Deadline: May 15.</p>
<p><a href="https://www.calgarychamber.com">Nominate Now →</a></p>
<p>&nbsp;</p>
<p><strong>🎓 Canada-Alberta Productivity Grant</strong></p>
<p>50% of training costs up to $5,000 per employee. Reimbursement program for workforce development.</p>
<p><a href="https://www.alberta.ca/canada-alberta-productivity-grant">Apply Here →</a></p>
<p>&nbsp;</p>
<p><strong>🤝 Bowness Business Association Mixer</strong></p>
<p>April 10, 5:30 PM at The Bowness Pub. Free for members, $15 for non-members.</p>
<p>&nbsp;</p>
<p><strong>💼 Spring Hiring Push</strong></p>
<p>Calgary Economic Development reports 12,000+ open service industry positions. Post on Calgary-specific job boards to stand out.</p>`,
      style: { width: "600", "object-fit": "contain", marginBottom: "10" },
      hasBorder: true,
      showTitle: true
    },
    
    // Section 6: SPECIAL_PROMPT - Quote
    {
      type: "SPECIAL_PROMPT",
      subType: "QUOTE_OF_THE_DAY",
      index: 6,
      title: "💬 Quote of the Day",
      prompt: "Give me an inspiring business quote for Calgary entrepreneurs. Return response only without any prefix.",
      promptPhrase: "Calgary business entrepreneurs",
      promptOutPut: `<p><strong>"Success is not final, failure is not fatal: it is the courage to continue that counts."</strong></p>
<p>— Winston Churchill</p>`,
      style: { marginBottom: "10" }
    },
    
    // Section 7: AI_ARTICLE - CTA
    {
      type: "AI_ARTICLE",
      index: 7,
      title: "🚀 Is Your Business Listed?",
      promptOutPut: `<p>The Calgary Biz Guide directory helps locals discover and support Calgary businesses — and it's <strong>completely free</strong> to list.</p>
<p>&nbsp;</p>
<p>Already listed? Upgrade to a featured spot and get highlighted in an upcoming newsletter spotlight.</p>
<p>&nbsp;</p>
<p><strong>📍 <a href="https://calgarybizguide.com/pricing/">Add Your Business</a> | ⭐ <a href="https://calgarybizguide.com/advertise/">Get Featured</a></strong></p>
<p>&nbsp;</p>
<p><em>BizBuzz Calgary is your weekly pulse on the local business scene. Forward to a fellow business owner who needs this.</em></p>`,
      style: { width: "600", "object-fit": "contain", marginBottom: "10" }
    }
  ];

  for (const section of sections) {
    console.log(`Adding section: ${section.title} (${section.type})`);
    await makeRequest(`/newsletters/${newsletterId}/sections`, 'POST', section);
  }
}

async function updateSEO(newsletterId) {
  const seoData = {
    urlPath: "issue-1-grants-growth-opportunities",
    title: "BizBuzz Calgary Issue #1 | $50K Grants + Growth Tips + Local Spotlight",
    description: "Calgary business news: Alberta small business grants with real deadlines, Google Business Profile optimization tips, local business spotlight, and networking opportunities.",
    previewImageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200",
    archiveThumbnailImageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400",
    noIndex: false
  };

  console.log('Updating SEO...');
  await makeRequest(`/newsletters/update-seo-settings/${newsletterId}`, 'POST', seoData);
}

createNewsletter().catch(console.error);
