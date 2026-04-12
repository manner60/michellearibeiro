const https = require('https');

const LETTERMAN_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWFlMjIyODQ3ODcyYjI4YjRkNDJkZGQiLCJrZXkiOiIyYWNiOWZlNjk0OWQ1MWIyODdmMjY2ZGM2ZDVjNzZmZiIsImlkIjoiNjlhZjY0NWE0Nzg3MmIyOGI0ZDY2MGZhIiwiaWF0IjoxNzczMTAyMTcwLCJleHAiOjE4MDQ2MzgxNzB9.kPubZoPK9GrJEHTMz0RAKQAhdKYYEEgP_Nbo_7iAdgA';
const NEWSLETTER_ID = '69c7fe1237ba49fb69a58264';

const SECTIONS = {
  welcomeArticle: '69c7fe1437ba49fb69a58286',
  doubleShot: '69c7fe1537ba49fb69a5828d',
  sponsorSpot: '69c7fe1637ba49fb69a5829e'
};

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

async function updateSections() {
  // 1. Update Welcome Article - Community focused, meet the owner angle
  console.log('Updating Welcome Article...');
  await makeRequest(`/newsletters/${NEWSLETTER_ID}/sections/${SECTIONS.welcomeArticle}`, 'PUT', {
    title: "Welcome to BizBuzz Calgary",
    promptOutPut: `<p><strong>Welcome to your new weekly ritual.</strong></p>
<p>&nbsp;</p>
<p>Every week, BizBuzz Calgary introduces you to the <strong>people behind the businesses</strong> that make our city great.</p>
<p>&nbsp;</p>
<p>We believe that when you know the story — the late nights, the risks taken, the passion that drives them — you'll want to support them.</p>
<p>&nbsp;</p>
<p><strong>Here's what you'll discover each week:</strong></p>
<p>&nbsp;</p>
<p>☕ <strong>The Double Shot</strong> — Two local businesses, their origin stories, and what makes them special.</p>
<p>&nbsp;</p>
<p>🎯 <strong>Trivia Tuesday</strong> — Test your Calgary knowledge (answers at the bottom).</p>
<p>&nbsp;</p>
<p>📹 <strong>Meet the Owner</strong> — Video stories from the entrepreneurs building our community.</p>
<p>&nbsp;</p>
<p>🔗 <strong>Local Gems</strong> — Handpicked spots worth checking out.</p>
<p>&nbsp;</p>
<p>📅 <strong>Event Radar</strong> — Networking opportunities, markets, and happenings.</p>
<p>&nbsp;</p>
<p>💬 <strong>Quote of the Day</strong> — Inspiration from those who've been there.</p>
<p>&nbsp;</p>
<p>We're building a community that celebrates local. <strong>Got a business to feature? A hidden gem to share?</strong> Hit reply and let us know.</p>
<p>&nbsp;</p>
<p>Welcome to the buzz. 🐝</p>`
  });

  // 2. Update Double Shot - More "meet the owner" focused
  console.log('Updating Double Shot...');
  await makeRequest(`/newsletters/${NEWSLETTER_ID}/sections/${SECTIONS.doubleShot}`, 'PUT', {
    title: "<p>New in Calgary</p>",
    subTitle: "The Double Shot: Meet the Owners Behind Calgary's Newest Coffee Spots",
    promptOutPut: `<p><strong>Phil & Sebastian Coffee Roasters — Seton</strong></p>
<p>&nbsp;</p>
<p><strong>The Story:</strong> What started as a passion for perfect coffee in a small Calgary garage has grown into one of Canada's most respected roasters. Phil & Sebastian's newest Seton location brings their direct-trade philosophy — building relationships with farmers from Colombia to Ethiopia — to southeast Calgary.</p>
<p>&nbsp;</p>
<p><strong>Why We Love Them:</strong> They're not just selling coffee; they're telling the story of every bean from farm to cup.</p>
<p>&nbsp;</p>
<p><strong>Location:</strong> Seton Urban District | <strong>Must-try:</strong> Seasonal single-origin pour-over</p>
<p>&nbsp;</p>
<hr>
<p>&nbsp;</p>
<p><strong>The Rustic Bean Coffee House — Kensington</strong></p>
<p>&nbsp;</p>
<p><strong>The Story:</strong> When the owners couldn't find their "third place" — somewhere between home and work — they built it. Six months of documenting their journey on Instagram created a community before the doors even opened. Result? 200 people lined up on day one.</p>
<p>&nbsp;</p>
<p><strong>Why We Love Them:</strong> They proved that building relationships beats big marketing budgets.</p>
<p>&nbsp;</p>
<p><strong>Location:</strong> Kensington Road NW | <strong>Must-try:</strong> The "Neighbourhood Regular" punch card</p>
<p>&nbsp;</p>
<p><strong>The Verdict:</strong> Two different approaches, one shared belief — coffee is about community. ☕</p>`,
    imageUrl: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600",
    hasBorder: true,
    includeImage: true,
    showBlockTitle: true,
    blockTitle: "<p style='color: #00D264; font-weight: bold;'>MEET THE OWNERS</p>"
  });

  // 3. Update Sponsor Spot - Strong advertising CTA with link to ad page
  console.log('Updating Sponsor Spot with advertising CTA...');
  await makeRequest(`/newsletters/${NEWSLETTER_ID}/sections/${SECTIONS.sponsorSpot}`, 'PUT', {
    title: "Featured Business",
    subTitle: "This week we're featuring",
    promptOutPut: `<p><strong>Inglewood Family Dental</strong></p>
<p>&nbsp;</p>
<p>Located in the heart of Inglewood at 1420 9 Ave SE, Dr. Smith and team have been keeping Calgary smiling for over 15 years. From routine cleanings to cosmetic dentistry, they combine modern technology with old-fashioned personal care.</p>
<p>&nbsp;</p>
<p><strong>Special offer for BizBuzz readers:</strong> Mention this newsletter for 20% off your first whitening treatment.</p>
<p>&nbsp;</p>
<p><a href="https://calgarybizguide.com/dt_listing/inglewood-family-dental-2/">Learn more →</a></p>
<p>&nbsp;</p>
<hr>
<p>&nbsp;</p>
<p><strong>🚀 Want to see your business here?</strong></p>
<p>&nbsp;</p>
<p>Get featured in BizBuzz Calgary and reach thousands of local readers who care about supporting Calgary businesses.</p>
<p>&nbsp;</p>
<p><strong>What's included:</strong></p>
<p>• Featured spot in weekly newsletter</p>
<p>• Premium listing on Calgary Biz Guide</p>
<p>• Social media promotion</p>
<p>&nbsp;</p>
<p><a href="https://calgarybizguide.com/advertise/"><strong>→ Advertise with us</strong></a></p>`,
    includeButton: true,
    button: {
      text: "Advertise Your Business",
      url: "https://calgarybizguide.com/advertise/",
      type: "solid",
      size: "md",
      style: { color: "#ffffff", backgroundColor: "#4F53D9" }
    }
  });

  console.log('\n✅ All sections updated with community focus and advertising CTA!');
}

updateSections().catch(console.error);
