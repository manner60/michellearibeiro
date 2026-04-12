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
  const articleData = {
    storageId: BIZBUZZ_STORAGE_ID,
    type: "ARTICLE",
    articleOptions: {
      contentFrom: "CONTENT",
      keepOriginal: true,
      headline: "The $50K Grant You Might Be Missing + Why Kensington's Newest Cafe is Crushing It",
      subHeadline: "Your weekly pulse on Calgary's business scene — grants, growth tips, and local success stories",
      content: `<p><strong>New Openings:</strong> The Rustic Bean Coffee House soft-opened in Kensington this week, joining a wave of independent cafes betting on Calgary's post-downtown recovery.</p>
<p>&nbsp;</p>
<p><strong>Economic Pulse:</strong> Calgary's unemployment rate dropped to 6.2% in February — the lowest since 2019 — signaling stronger consumer spending ahead for local businesses.</p>
<p>&nbsp;</p>
<p><strong>Policy Watch:</strong> The City of Calgary extended its Small Business Tax Assistance Program deadline to April 15. If you're struggling with property tax hikes, apply now.</p>
<p>&nbsp;</p>
<p><strong>Trend Alert:</strong> "Micro-events" are replacing large conferences. Local venues report 40% more bookings for 20-50 person corporate gatherings.</p>
<p>&nbsp;</p>
<p><strong>Closing Note:</strong> After 23 years, Stephen Avenue's iconic The Bay department store is officially shuttering. Retailers nearby should prepare for foot traffic shifts.</p>
<p>&nbsp;</p>
<h2>Growth Tip of the Week</h2>
<p>&nbsp;</p>
<p><strong>Turn Your Google Business Profile Into a Lead Machine</strong></p>
<p>&nbsp;</p>
<p>Most Calgary businesses have a Google listing. Few optimize it. Here's how to stand out:</p>
<p>&nbsp;</p>
<p><strong>Post weekly updates</strong> — Treat it like social media. Share promotions, events, or new products directly on your listing</p>
<p>&nbsp;</p>
<p><strong>Add photos monthly</strong> — Businesses with 100+ photos get 520% more calls than those with none. Snap your space, team, and products</p>
<p>&nbsp;</p>
<p><strong>Enable messaging</strong> — 82% of local searches happen on mobile. Let customers text you directly from Google</p>
<p>&nbsp;</p>
<p><strong>Request reviews strategically</strong> — Ask happy customers within 24 hours of service. Include a direct link to make it effortless</p>
<p>&nbsp;</p>
<h2>Local Business Spotlight</h2>
<p>&nbsp;</p>
<p><strong>The Rustic Bean Coffee House — Kensington</strong></p>
<p>&nbsp;</p>
<p><em>What they do:</em> Independent specialty coffee shop with rotating local roasters and a "third place" community focus.</p>
<p>&nbsp;</p>
<p><em>What they're doing well:</em></p>
<p>&nbsp;</p>
<p>Before opening, they spent 6 months building an Instagram following by documenting their build-out, introducing their roaster partners, and crowdsourcing menu ideas. Result? 200+ people lined up on opening day.</p>
<p>&nbsp;</p>
<p>Their "Neighbourhood Regular" program — a simple punch card with a free drink every 10 visits — has already driven 40% repeat customer rate in week one.</p>
<p>&nbsp;</p>
<p><em>Why it matters:</em> They didn't wait for opening day to start marketing. By building anticipation and community before launch, they turned opening week into an event. The takeaway? Your marketing starts before your doors open.</p>
<p>&nbsp;</p>
<h2>Tool of the Week</h2>
<p>&nbsp;</p>
<p><strong>Canva's Brand Kit Feature</strong></p>
<p>&nbsp;</p>
<p>A free tool to store your logo, colors, fonts, and templates in one place. Perfect for Calgary businesses creating social posts, flyers, or email graphics without a designer. Consistency builds trust — Brand Kit ensures every Instagram post looks professionally on-brand.</p>
<p>&nbsp;</p>
<h2>Opportunities Board</h2>
<p>&nbsp;</p>
<p><strong>Alberta Small Business Innovation Grant</strong> — Up to $50K for tech adoption or process improvements. Deadline: April 30.</p>
<p>&nbsp;</p>
<p><strong>Calgary Chamber Business Awards</strong> — Nominations open. Winners get major media exposure. Deadline: May 15.</p>
<p>&nbsp;</p>
<p><strong>YYC Food & Drink Experience</strong> — Local restaurants can apply for featured placement in this summer's city-wide culinary event. Limited spots.</p>
<p>&nbsp;</p>
<p><strong>Bowness Business Association Mixer</strong> — April 10, 5:30 PM at The Bowness Pub. Free for members, $15 for non-members.</p>
<p>&nbsp;</p>
<p><strong>Spring Hiring Push</strong> — Calgary Economic Development reports 12,000+ open service industry positions.</p>
<p>&nbsp;</p>
<h2>Community Pulse</h2>
<p>&nbsp;</p>
<p><strong>What's the biggest challenge you're facing right now?</strong></p>
<p>&nbsp;</p>
<p>Staffing? Rising costs? Getting noticed? Hit reply and let us know — we'll tackle the most common issues in upcoming issues.</p>
<p>&nbsp;</p>
<h2>Get Listed</h2>
<p>&nbsp;</p>
<p>Is your business on Calgary Biz Guide? Our directory helps locals discover and support Calgary businesses — completely free to list. Already listed? Upgrade to a featured spot and get highlighted in an upcoming newsletter spotlight.</p>`,
      keywords: ["calgary business", "small business grants", "local business", "kensington", "google business profile", "calgary economic news"],
      imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200",
      summary: {
        title: "BizBuzz Calgary - Issue #1",
        description: "The $50K grant you might be missing, plus why Kensington's newest cafe is crushing it",
        imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600",
        content: "<p>This week: Alberta's $50K small business grant, Calgary unemployment hits 6.2%, and how The Rustic Bean Coffee House built a 200-person opening day line.</p>"
      }
    }
  };

  console.log('Creating article in BizBuzz Calgary...');
  const result = await makeRequest('/newsletters', 'POST', articleData);
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  
  if (result.data && result.data._id) {
    console.log('\n✅ Article created successfully!');
    console.log('Article ID:', result.data._id);
    console.log('State:', result.data.state);
    
    // Update SEO settings
    await updateSEO(result.data._id);
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

  console.log('\nUpdating SEO settings...');
  const result = await makeRequest(`/newsletters/update-seo-settings/${articleId}`, 'POST', seoData);
  console.log('SEO Update Status:', result.status);
  console.log('SEO Response:', JSON.stringify(result.data, null, 2));
}

createArticle().catch(console.error);
