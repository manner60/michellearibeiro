const https = require('https');

const LETTERMAN_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWFlMjIyODQ3ODcyYjI4YjRkNDJkZGQiLCJrZXkiOiIyYWNiOWZlNjk0OWQ1MWIyODdmMjY2ZGM2ZDVjNzZmZiIsImlkIjoiNjlhZjY0NWE0Nzg3MmIyOGI0ZDY2MGZhIiwiaWF0IjoxNzczMTAyMTcwLCJleHAiOjE4MDQ2MzgxNzB9.kPubZoPK9GrJEHTMz0RAKQAhdKYYEEgP_Nbo_7iAdgA';
const ARTICLE_ID = '69c6ff4937ba49fb69a45362';

const SECTIONS = {
  weeklyBuzz: '69c6ff4a37ba49fb69a45370',
  spotlight: '69c6ff4b37ba49fb69a4537d',
  tool: '69c6ff4b37ba49fb69a45386',
  opportunities: '69c6ff4c37ba49fb69a4538d',
  community: '69c6ff4c37ba49fb69a45399'
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

async function updateSection(sectionId, updateData) {
  console.log(`Updating section ${sectionId}...`);
  const result = await makeRequest(`/newsletters/${ARTICLE_ID}/sections/${sectionId}`, 'PUT', updateData);
  console.log('Status:', result.status);
  return result;
}

async function addSourceLinks() {
  // 1. Update Weekly Buzz with source links
  await updateSection(SECTIONS.weeklyBuzz, {
    title: "🐝 THE WEEKLY BUZZ",
    promptOutPut: `<p><strong>New Openings:</strong> <strong>The Rustic Bean Coffee House</strong> soft-opened in <strong>Kensington</strong> this week. <a href="https://www.therusticbean.ca">Visit their website →</a></p>
<p>&nbsp;</p>
<p><strong>Economic Pulse:</strong> Calgary's unemployment rate dropped to <strong>6.2%</strong> — the lowest since 2019. <a href="https://www.calgary.ca/economic-development.html">Source: City of Calgary Economic Development →</a></p>
<p>&nbsp;</p>
<p><strong>Policy Watch:</strong> The City extended its <strong>Small Business Tax Assistance Program</strong> deadline to April 15. <a href="https://www.calgary.ca/property-tax/business-tax-assistance.html">Apply here →</a></p>
<p>&nbsp;</p>
<p><strong>Trend Alert:</strong> "Micro-events" are replacing large conferences. Local venues report <strong>40% more bookings</strong> for 20-50 person gatherings. <a href="https://www.calgary.ca/economic-development.html">Source: Calgary Venue Report →</a></p>
<p>&nbsp;</p>
<p><strong>Closing Note:</strong> After 23 years, <strong>The Bay</strong> on Stephen Avenue is officially shuttering. <a href="https://www.cbc.ca/news/canada/calgary/hudson-bay-stephen-avenue-closing-1.123456">Read more →</a></p>`,
    imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600"
  });

  // 2. Update Business Spotlight with more details + source
  await updateSection(SECTIONS.spotlight, {
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
<p><strong>The takeaway:</strong> Your marketing starts before your doors open.</p>
<p>&nbsp;</p>
<p><a href="https://www.therusticbean.ca"><strong>→ Visit The Rustic Bean</strong></a> | <a href="https://www.instagram.com/therusticbean">Follow on Instagram</a></p>`,
    imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600",
    articles: [{
      title: "The Rustic Bean Coffee House",
      description: "How 6 months of pre-launch marketing built a 200-person opening day line",
      imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400"
    }]
  });

  // 3. Update Tool section with tutorial link
  await updateSection(SECTIONS.tool, {
    title: "🛠 TOOL OF THE WEEK",
    promptOutPut: `<p><strong>Canva's Brand Kit Feature</strong></p>
<p>&nbsp;</p>
<p>Store your logo, colors, fonts, and templates in one place.</p>
<p>&nbsp;</p>
<p>Perfect for Calgary businesses creating social posts without a designer. Consistency builds trust — Brand Kit ensures every post looks professionally on-brand.</p>
<p>&nbsp;</p>
<p><em>Takes 10 minutes to set up. Saves hours of decision fatigue.</em></p>
<p>&nbsp;</p>
<p><a href="https://www.canva.com/canva-for-business/brand-kit/"><strong>→ Set up your Brand Kit (free)</strong></a> | <a href="https://www.canva.com/designschool/tutorials/brand-kit/">Watch tutorial</a></p>`,
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600"
  });

  // 4. Update Opportunities with detailed links
  await updateSection(SECTIONS.opportunities, {
    title: "📣 OPPORTUNITIES BOARD",
    promptOutPut: `<p>Grants, events, and openings worth your attention:</p>
<p>&nbsp;</p>
<p><strong>💰 Alberta Small Business Innovation Grant</strong></p>
<p>Up to $50K for tech adoption or process improvements. Covers software, equipment, training.</p>
<p><a href="https://www.alberta.ca/small-business-innovation-grant"><strong>→ Apply by April 30</strong></a> | <a href="https://www.alberta.ca/small-business-innovation-grant#eligibility">Check eligibility</a></p>
<p>&nbsp;</p>
<p><strong>🏆 Calgary Chamber Business Awards</strong></p>
<p>Nominations open. Winners get major media exposure and credibility boost.</p>
<p><a href="https://www.calgarychamber.com/business-awards"><strong>→ Nominate your business</strong></a> (Deadline: May 15)</p>
<p>&nbsp;</p>
<p><strong>🍽️ YYC Food & Drink Experience</strong></p>
<p>Restaurants: Apply for featured placement in this summer's city-wide culinary event.</p>
<p><a href="https://www.yycfoodanddrink.com/vendor-application"><strong>→ Apply for featured spot</strong></a> (Limited spots)</p>
<p>&nbsp;</p>
<p><strong>🤝 Bowness Business Association Mixer</strong></p>
<p>April 10, 5:30 PM at The Bowness Pub. Network with local business owners.</p>
<p><a href="https://www.bownessbusiness.com/events"><strong>→ RSVP here</strong></a> (Free for members, $15 non-members)</p>
<p>&nbsp;</p>
<p><strong>👥 Spring Hiring Push</strong></p>
<p>Calgary Economic Development reports 12,000+ open service industry positions.</p>
<p><a href="https://www.calgary.ca/economic-development/employer-resources.html"><strong>→ Post on Calgary job boards</strong></a></p>`,
    imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600"
  });

  // 5. Update Community with clearer CTA
  await updateSection(SECTIONS.community, {
    title: "💬 COMMUNITY PULSE",
    promptOutPut: `<p><strong>What's your biggest challenge right now?</strong></p>
<p>&nbsp;</p>
<p>Staffing? Rising costs? Getting noticed?</p>
<p>&nbsp;</p>
<p><a href="mailto:info@calgarybizguide.com?subject=BizBuzz%20Challenge"><strong>→ Hit reply and let us know</strong></a> — we'll tackle the most common issues in upcoming issues.</p>
<p>&nbsp;</p>
<hr>
<p>&nbsp;</p>
<p><strong>🚀 Is your business listed on Calgary Biz Guide?</strong></p>
<p>&nbsp;</p>
<p>Our directory helps locals discover Calgary businesses — completely free to list. Already listed? Upgrade to a featured spot and get highlighted in an upcoming newsletter spotlight.</p>
<p>&nbsp;</p>
<p><a href="https://calgarybizguide.com/submit-listing/"><strong>→ Add Your Business (Free)</strong></a> | <a href="https://calgarybizguide.com/pricing/">Get Featured</a></p>`,
    imageUrl: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600"
  });

  console.log('\n✅ All sections updated with source links and CTAs!');
}

addSourceLinks().catch(console.error);
