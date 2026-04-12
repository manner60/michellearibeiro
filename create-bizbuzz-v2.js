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

async function createArticle() {
  // Step 1: Create base article
  const articleData = {
    storageId: BIZBUZZ_STORAGE_ID,
    type: "ARTICLE",
    articleOptions: {
      contentFrom: "CONTENT",
      keepOriginal: true,
      headline: "The $50K Grant You Might Be Missing + Why Kensington's Newest Cafe is Crushing It",
      subHeadline: "Your weekly pulse on Calgary's business scene",
      content: "<p>Welcome to Issue #1 of BizBuzz Calgary.</p>",
      keywords: ["calgary business", "small business grants", "local business", "kensington", "google business profile"],
      imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200",
      summary: {
        title: "BizBuzz Calgary - Issue #1",
        description: "The $50K grant you might be missing, plus why Kensington's newest cafe is crushing it",
        imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600",
        content: "<p>This week: Alberta's $50K small business grant, Calgary unemployment hits 6.2%, and how The Rustic Bean Coffee House built a 200-person opening day line.</p>"
      }
    }
  };

  console.log('Creating article...');
  const result = await makeRequest('/newsletters', 'POST', articleData);
  console.log('Article created:', result.data._id);
  
  const articleId = result.data._id;
  
  // Step 2: Add sections
  await addSections(articleId);
  
  // Step 3: Update SEO
  await updateSEO(articleId);
  
  console.log('\n✅ Article recreated with proper sections!');
  console.log('Article ID:', articleId);
}

async function addSections(articleId) {
  const sections = [
    // Section 1: The Weekly Buzz (TEXT with strong formatting)
    {
      type: "TEXT",
      index: 1,
      title: "🐝 THE WEEKLY BUZZ",
      promptOutPut: `<p><strong>New Openings:</strong> <strong>The Rustic Bean Coffee House</strong> soft-opened in <strong>Kensington</strong> this week.</p>
<p>&nbsp;</p>
<p><strong>Economic Pulse:</strong> Calgary's unemployment rate dropped to <strong>6.2%</strong> — the lowest since 2019.</p>
<p>&nbsp;</p>
<p><strong>Policy Watch:</strong> The City extended its <strong>Small Business Tax Assistance Program</strong> deadline to April 15.</p>
<p>&nbsp;</p>
<p><strong>Trend Alert:</strong> "Micro-events" are replacing large conferences. Local venues report <strong>40% more bookings</strong> for 20-50 person gatherings.</p>
<p>&nbsp;</p>
<p><strong>Closing Note:</strong> After 23 years, <strong>The Bay</strong> on Stephen Avenue is officially shuttering.</p>`
    },
    // Section 2: Growth Tip (BULLETS for better visual)
    {
      type: "BULLETS",
      index: 2,
      title: "📈 GROWTH TIP: Turn Your Google Business Profile Into a Lead Machine",
      promptOutPut: `<p>Most Calgary businesses have a Google listing. Few optimize it.</p>
<p>&nbsp;</p>
<p>Here's how to stand out:</p>
<p>&nbsp;</p>
<p><strong>Post weekly updates</strong> — Treat it like social media. Share promotions, events, or new products directly on your listing.</p>
<p>&nbsp;</p>
<p><strong>Add photos monthly</strong> — Businesses with 100+ photos get 520% more calls than those with none.</p>
<p>&nbsp;</p>
<p><strong>Enable messaging</strong> — 82% of local searches happen on mobile. Let customers text you directly from Google.</p>
<p>&nbsp;</p>
<p><strong>Request reviews strategically</strong> — Ask happy customers within 24 hours of service.</p>`,
      points: [
        "Post weekly updates — Treat it like social media",
        "Add photos monthly — 100+ photos = 520% more calls",
        "Enable messaging — 82% of searches are mobile",
        "Request reviews within 24 hours of service"
      ]
    },
    // Section 3: Business Spotlight (ARTICLE_SUMMARY style)
    {
      type: "ARTICLE_SUMMARY",
      index: 3,
      title: "🔦 LOCAL BUSINESS SPOTLIGHT",
      promptOutPut: `<p><strong>The Rustic Bean Coffee House — Kensington</strong></p>
<p>&nbsp;</p>
<p>Independent specialty coffee shop with rotating local roasters and a "third place" community focus.</p>
<p>&nbsp;</p>
<p><strong>What they're doing well:</strong></p>
<p>&nbsp;</p>
<p>Before opening, they spent 6 months building an Instagram following by documenting their build-out and crowdsourcing menu ideas. Result? <strong>200+ people lined up on opening day.</strong></p>
<p>&nbsp;</p>
<p>Their "Neighbourhood Regular" program — a simple punch card — has already driven <strong>40% repeat customer rate</strong> in week one.</p>
<p>&nbsp;</p>
<p><strong>The takeaway:</strong> Your marketing starts before your doors open.</p>`,
      articles: [{
        title: "The Rustic Bean Coffee House",
        description: "How 6 months of pre-launch marketing built a 200-person opening day line",
        imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400"
      }]
    },
    // Section 4: Tool of the Week (FEATURED block)
    {
      type: "FEATURED",
      index: 4,
      title: "🛠 TOOL OF THE WEEK",
      promptOutPut: `<p><strong>Canva's Brand Kit Feature</strong></p>
<p>&nbsp;</p>
<p>Store your logo, colors, fonts, and templates in one place.</p>
<p>&nbsp;</p>
<p>Perfect for Calgary businesses creating social posts without a designer. Consistency builds trust — Brand Kit ensures every post looks professionally on-brand.</p>
<p>&nbsp;</p>
<p><em>Takes 10 minutes to set up. Saves hours of decision fatigue.</em></p>`
    },
    // Section 5: Opportunities (LINK_SUMMARY)
    {
      type: "LINK_SUMMARY",
      index: 5,
      title: "📣 OPPORTUNITIES BOARD",
      promptOutPut: `<p>Grants, events, and openings worth your attention:</p>`,
      links: [
        { title: "Alberta Small Business Innovation Grant", url: "https://alberta.ca", description: "Up to $50K for tech adoption. Deadline: April 30." },
        { title: "Calgary Chamber Business Awards", url: "#", description: "Nominations open. Deadline: May 15." },
        { title: "YYC Food & Drink Experience", url: "#", description: "Apply for featured placement. Limited spots." },
        { title: "Bowness Business Mixer", url: "#", description: "April 10, 5:30 PM at The Bowness Pub" },
        { title: "Spring Hiring Push", url: "#", description: "12,000+ open service industry positions" }
      ]
    },
    // Section 6: Community Pulse + CTA (TEXT)
    {
      type: "TEXT",
      index: 6,
      title: "💬 COMMUNITY PULSE",
      promptOutPut: `<p><strong>What's your biggest challenge right now?</strong></p>
<p>&nbsp;</p>
<p>Staffing? Rising costs? Getting noticed?</p>
<p>&nbsp;</p>
<p>Hit reply and let us know — we'll tackle the most common issues in upcoming issues.</p>
<p>&nbsp;</p>
<hr>
<p>&nbsp;</p>
<p><strong>🚀 Is your business listed on Calgary Biz Guide?</strong></p>
<p>&nbsp;</p>
<p>Our directory helps locals discover Calgary businesses — completely free to list.</p>
<p>&nbsp;</p>
<p><a href="https://calgarybizguide.com/submit-listing/">Add Your Business</a> | <a href="https://calgarybizguide.com/pricing/">Get Featured</a></p>`
    }
  ];

  for (const section of sections) {
    console.log(`Adding section: ${section.title} (${section.type})`);
    await makeRequest(`/newsletters/${articleId}/sections`, 'POST', section);
  }
}

async function updateSEO(articleId) {
  const seoData = {
    urlPath: "issue-1-50k-grant-kensington-cafe",
    title: "The $50K Grant You Might Be Missing + Why Kensington's Newest Cafe is Crushing It | BizBuzz Calgary",
    description: "Calgary business news: Alberta's $50K small business grant, economic updates, Google Business Profile tips, and how The Rustic Bean Coffee House built a 200-person opening day line.",
    previewImageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200",
    archiveThumbnailImageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400",
    noIndex: false
  };

  console.log('Updating SEO...');
  await makeRequest(`/newsletters/update-seo-settings/${articleId}`, 'POST', seoData);
}

createArticle().catch(console.error);
