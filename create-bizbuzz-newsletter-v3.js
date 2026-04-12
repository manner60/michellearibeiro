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
      headline: "Double Shot: Two New Coffee Shops Open in Calgary — Sleep Is Overrated Anyway",
      subHeadline: "Welcome to BizBuzz Calgary! Your weekly dose of local business news, events, and opportunities.",
      content: "<p>Welcome to BizBuzz Calgary!</p>",
      keywords: ["calgary business", "coffee shops", "new openings", "local business", "phil and sebastian", "rustic bean"],
      imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200",
      summary: {
        title: "BizBuzz Calgary - Welcome Issue",
        description: "Double Shot: Two new coffee shops open in Calgary. Plus: Welcome message, business trivia, and upcoming events.",
        imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600",
        content: "<p>Welcome to BizBuzz Calgary! This week: Two new coffee shops battle for your morning buzz, Calgary business trivia, and upcoming networking events.</p>"
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
  
  console.log('\n✅ Newsletter recreated with new structure!');
  console.log('Newsletter ID:', newsletterId);
}

async function addSections(newsletterId) {
  const sections = [
    // Section 0: TRIVIA_QUESTION - Calgary Business Trivia
    {
      type: "TRIVIA_QUESTION",
      index: 0,
      title: "Calgary Business Trivia",
      promptOutPut: "What Calgary-based company started in a garage and grew to become one of Canada's largest energy companies?",
      style: { marginBottom: "10" }
    },
    
    // Section 1: VIDEO - Welcome VSL (placeholder for now)
    {
      type: "VIDEO",
      index: 1,
      title: "Welcome to BizBuzz Calgary",
      promptOutPut: "[VIDEO PLACEHOLDER - Welcome VSL will go here]",
      style: { padding: "10px 0px", "video-icon": "round-solid", marginBottom: "10" }
    },
    
    // Section 2: LINK_SUMMARY - Curated Business Links
    {
      type: "LINK_SUMMARY",
      index: 2,
      title: "This Week's Must-Reads",
      promptOutPut: "<p>Handpicked articles for Calgary business owners:</p>",
      style: { width: "600", "object-fit": "contain", marginBottom: "10" },
      links: [
        { url: "https://www.calgary.ca/economic-development.html", title: "Calgary Economic Development Updates", description: "Latest city initiatives for local businesses" },
        { url: "https://www.calgarychamber.com", title: "Calgary Chamber of Commerce", description: "Networking events and business resources" },
        { url: "https://www.alberta.ca/small-business-resources.html", title: "Alberta Small Business Resources", description: "Grants, loans, and support programs" },
        { url: "https://www.calgarybizguide.com", title: "Calgary Biz Guide Directory", description: "Find and support local businesses" }
      ],
      placeCtaAtEnd: true
    },
    
    // Section 3: AI_ARTICLE - Main Feature (Welcome Message)
    {
      type: "AI_ARTICLE",
      index: 3,
      title: "Welcome to BizBuzz Calgary",
      promptOutPut: `<p><strong>Welcome to your new weekly ritual.</strong></p>
<p>&nbsp;</p>
<p>Every Tuesday morning, BizBuzz Calgary lands in your inbox with one mission: <strong>helping Calgary business owners stay ahead.</strong></p>
<p>&nbsp;</p>
<p>Here's what you can expect each week:</p>
<p>&nbsp;</p>
<p><strong>☕ The Double Shot</strong> — Two new businesses, trends, or opportunities you need to know about.</p>
<p>&nbsp;</p>
<p><strong>🎯 Trivia Tuesday</strong> — Test your Calgary business knowledge (answers at the bottom).</p>
<p>&nbsp;</p>
<p><strong>📹 Video Spotlight</strong> — Local business stories, tips, and insights.</p>
<p>&nbsp;</p>
<p><strong>🔗 Curated Reads</strong> — The best articles, resources, and tools for your business.</p>
<p>&nbsp;</p>
<p><strong>📅 Event Radar</strong> — Networking opportunities, workshops, and must-attend happenings.</p>
<p>&nbsp;</p>
<p><strong>💬 Quote of the Day</strong> — Inspiration to fuel your week.</p>
<p>&nbsp;</p>
<p>We're building something special here — a community of Calgary business owners who support, learn from, and grow with each other.</p>
<p>&nbsp;</p>
<p><strong>Got a tip? A business to feature? An event to promote?</strong> Hit reply and let us know.</p>
<p>&nbsp;</p>
<p>Welcome to the buzz. 🐝</p>`,
      style: { width: "600", "object-fit": "contain", marginBottom: "10" }
    },
    
    // Section 4: CUSTOM_COMBO - New in Calgary (Double Shot - Both Coffee Shops)
    {
      type: "CUSTOM_COMBO",
      index: 4,
      title: "<p>New in Calgary</p>",
      subTitle: "The Double Shot: Two Coffee Shops, One City, Zero Sleep",
      promptOutPut: `<p><strong>Phil & Sebastian Coffee Roasters — Seton</strong></p>
<p>&nbsp;</p>
<p>The beloved Calgary roaster opens its newest location in Seton, bringing their signature single-origin beans and expertly crafted espresso to the southeast. Known for their direct-trade relationships with farmers, Phil & Sebastian continues to elevate Calgary's coffee scene.</p>
<p>&nbsp;</p>
<p><strong>Location:</strong> Seton Urban District</p>
<p><strong>Must-try:</strong> Their seasonal single-origin pour-over</p>
<p>&nbsp;</p>
<hr>
<p>&nbsp;</p>
<p><strong>The Rustic Bean Coffee House — Kensington</strong></p>
<p>&nbsp;</p>
<p>This independent specialty coffee shop brings a "third place" community focus to Kensington with rotating local roasters and a cozy atmosphere. Their pre-launch Instagram strategy built a 200-person line on opening day — proof that community-driven marketing works.</p>
<p>&nbsp;</p>
<p><strong>Location:</strong> Kensington Road NW</p>
<p><strong>Must-try:</strong> The "Neighbourhood Regular" punch card program</p>
<p>&nbsp;</p>
<p><strong>The Verdict:</strong> Whether you're team Phil & Sebastian or team Rustic Bean, one thing's clear — Calgary's caffeine game just got stronger. ☕</p>`,
      style: { width: "600" },
      hasBorder: true,
      includeImage: true,
      imageUrl: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600",
      showTitle: true,
      blockTitle: "<p style='color: #00D264; font-weight: bold;'>NOW OPEN</p>",
      showBlockTitle: true
    },
    
    // Section 5: SPECIAL_PROMPT - Quote of the Day
    {
      type: "SPECIAL_PROMPT",
      subType: "QUOTE_OF_THE_DAY",
      index: 5,
      title: "Quote Of The Day",
      prompt: "Give me an inspiring business quote for Calgary entrepreneurs. Return response only without any prefix.",
      promptPhrase: "Calgary business entrepreneurs",
      promptOutPut: `<p><strong>"Success is not final, failure is not fatal: it is the courage to continue that counts."</strong> — Winston Churchill</p>`,
      style: { marginBottom: "10" }
    },
    
    // Section 6: SPONSOR_SPOT - Featured Business from Directory
    {
      type: "SPONSOR_SPOT",
      index: 6,
      title: "Featured Business",
      subTitle: "This week sponsored by",
      promptOutPut: `<p><strong>Inglewood Family Dental</strong></p>
<p>&nbsp;</p>
<p>Located in the heart of Inglewood at 1420 9 Ave SE, Dr. Smith and team have been keeping Calgary smiling for over 15 years. From routine cleanings to cosmetic dentistry, they combine modern technology with old-fashioned personal care.</p>
<p>&nbsp;</p>
<p><strong>Special offer for BizBuzz readers:</strong> Mention this newsletter for 20% off your first whitening treatment.</p>
<p>&nbsp;</p>
<p><a href="https://calgarybizguide.com/dt_listing/inglewood-family-dental-2/">Learn more →</a></p>`,
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
    
    // Section 7: CUSTOM_COMBO - Upcoming Business Events
    {
      type: "CUSTOM_COMBO",
      index: 7,
      title: "<p>Upcoming Business Events In Calgary</p>",
      promptOutPut: `<p><strong>Bowness Business Association Mixer</strong></p>
<p>📅 April 10, 5:30 PM | 📍 The Bowness Pub</p>
<p>Network with local business owners in a relaxed setting. Free for members, $15 for non-members.</p>
<p><a href="#">RSVP Here →</a></p>
<p>&nbsp;</p>
<p><strong>Calgary Chamber Business Awards Nominations</strong></p>
<p>📅 Deadline: May 15</p>
<p>Nominate a deserving business (or yourself!) for the annual Calgary Chamber Business Awards. Winners receive major media exposure.</p>
<p><a href="#">Nominate Now →</a></p>
<p>&nbsp;</p>
<p><strong>Alberta Small Business Innovation Grant</strong></p>
<p>📅 Deadline: April 30</p>
<p>Up to $50,000 for tech adoption and process improvements. Don't leave money on the table!</p>
<p><a href="https://www.alberta.ca/small-business-innovation-grant">Apply Here →</a></p>`,
      style: { width: "600", "object-fit": "contain", marginBottom: "10" },
      hasBorder: true,
      showTitle: true
    },
    
    // Section 8: TRIVIA_QUESTION_ANSWER - Answer Reveal
    {
      type: "TRIVIA_QUESTION_ANSWER",
      index: 8,
      title: "Trivia Answer",
      promptOutPut: "<p><strong>Answer: Canadian Natural Resources Limited (CNRL)</strong></p><p>&nbsp;</p><p>Founded by Murray Edwards and partners in 1973, CNRL started small and grew to become one of Canada's largest independent crude oil and natural gas producers. Today it's a cornerstone of Calgary's energy sector.</p><p>&nbsp;</p><p>Did you get it right? 🎯</p>",
      style: { marginBottom: "10" }
    }
  ];

  for (const section of sections) {
    console.log(`Adding section: ${section.title} (${section.type})`);
    await makeRequest(`/newsletters/${newsletterId}/sections`, 'POST', section);
  }
}

async function updateSEO(newsletterId) {
  const seoData = {
    urlPath: "welcome-double-shot-coffee-wars",
    title: "Welcome to BizBuzz Calgary | Double Shot: Two New Coffee Shops Open",
    description: "Welcome to BizBuzz Calgary! This week: Two new coffee shops battle for your morning buzz, Calgary business trivia, featured business spotlight, and upcoming networking events.",
    previewImageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200",
    archiveThumbnailImageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
    noIndex: false
  };

  console.log('Updating SEO...');
  await makeRequest(`/newsletters/update-seo-settings/${newsletterId}`, 'POST', seoData);
}

createNewsletter().catch(console.error);
