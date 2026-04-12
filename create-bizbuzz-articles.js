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

async function createArticles() {
  console.log('Creating Article 1: Alberta Small Business Grants Guide...');
  const article1 = await createArticle({
    headline: "Alberta Small Business Grants: Your Complete 2025 Guide to Free Funding",
    subHeadline: "From $50K innovation grants to training reimbursements — here's what's available and how to apply",
    content: `<p><strong>Original Analysis by BizBuzz Calgary</strong></p>
<p>&nbsp;</p>
<p>Every year, millions of dollars in Alberta small business grants go unclaimed. Not because businesses don't qualify — but because they don't know the programs exist.</p>
<p>&nbsp;</p>
<p>We've done the research. Here are the grants with real deadlines you need to know about:</p>
<p>&nbsp;</p>
<h3>🎯 Alberta Small Business Innovation Grant</h3>
<p><strong>Amount:</strong> Up to $50,000<br>
<strong>Deadline:</strong> April 30, 2025<br>
<strong>Best for:</strong> Tech adoption, process improvements, R&D</p>
<p>&nbsp;</p>
<p>This is the big one. If you're investing in technology to improve efficiency or developing new products, this grant can cover a significant portion of your costs.</p>
<p>&nbsp;</p>
<p><em>Source: <a href="https://www.alberta.ca/small-business-resources">Alberta.ca Small Business Resources</a></em></p>
<p>&nbsp;</p>
<h3>🎓 Canada-Alberta Productivity Grant</h3>
<p><strong>Amount:</strong> 50% of training costs up to $5,000 per existing employee; 75% up to $10,000 for unemployed Albertans<br>
<strong>Use for:</strong> Employee upskilling, certifications, productivity training</p>
<p>&nbsp;</p>
<p>Most businesses overlook training grants. If you're hiring or upskilling, this effectively cuts your training costs in half.</p>
<p>&nbsp;</p>
<p><em>Source: <a href="https://www.alberta.ca/canada-alberta-productivity-grant">Alberta.ca Productivity Grant</a></em></p>
<p>&nbsp;</p>
<h3>💡 Alberta Innovates Funding Programs</h3>
<p><strong>Amount:</strong> Varies by program<br>
<strong>Best for:</strong> Tech startups, clean tech, health innovation</p>
<p>&nbsp;</p>
<p>Alberta Innovates offers multiple streams for businesses solving provincial challenges. If you're in tech or clean energy, this should be on your radar.</p>
<p>&nbsp;</p>
<p><em>Source: <a href="https://albertainnovates.ca/funding/">Alberta Innovates</a></em></p>
<p>&nbsp;</p>
<h3>🔧 Futurpreneur Canada</h3>
<p><strong>Amount:</strong> Up to $75,000<br>
<strong>Who qualifies:</strong> Entrepreneurs ages 18-39</p>
<p>&nbsp;</p>
<p>Loans plus mentoring for young entrepreneurs. If you're under 40 and starting or growing a business, this combines capital with guidance.</p>
<p>&nbsp;</p>
<p><em>Source: <a href="https://futurpreneur.ca">Futurpreneur.ca</a></em></p>
<p>&nbsp;</p>
<hr>
<p>&nbsp;</p>
<h3>📰 This Week's Grant News</h3>
<p>&nbsp;</p>
<p><strong>City of Calgary Extends Small Business Tax Assistance Deadline</strong></p>
<p>The deadline for Calgary's Small Business Tax Assistance Program has been extended to April 15. If property tax increases are impacting your cash flow, this program offers relief. <em>Source: <a href="https://www.calgary.ca">Calgary.ca</a></em></p>
<p>&nbsp;</p>
<hr>
<p>&nbsp;</p>
<h3>💼 BizBuzz Take</h3>
<p>Grant writing is a skill. If you're serious about securing funding, consider:</p>
<p>&nbsp;</p>
<p>1. <strong>Hiring a grant writer</strong> — They typically charge 10-15% of successful grants<br>
2. <strong>Attending workshops</strong> — Alberta Innovates and Community Futures offer free grant writing sessions<br>
3. <strong>Applying early</strong> — Most programs review on a rolling basis</p>
<p>&nbsp;</p>
<p>The businesses that get funded aren't always the most deserving — they're the ones that apply.</p>
<p>&nbsp;</p>
<p><em>Last updated: March 30, 2025. Grant programs change frequently. Verify deadlines before applying.</em></p>`,
    keywords: ["alberta grants", "small business funding", "calgary business", "innovation grant", "business loans"],
    imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200"
  });
  console.log('Article 1 created:', article1.data._id);

  console.log('\nCreating Article 2: Google Business Profile Guide...');
  const article2 = await createArticle({
    headline: "The Complete Guide to Google Business Profile Optimization for Calgary Businesses",
    subHeadline: "How to turn your free Google listing into a customer-generating machine",
    content: `<p><strong>Original Analysis by BizBuzz Calgary</strong></p>
<p>&nbsp;</p>
<p>Here's a stat that should get your attention: <strong>82% of local searches happen on mobile devices</strong> (Google, 2023). When someone searches "dentist near me" or "best coffee shop Calgary," they're usually ready to buy — and they're looking at Google Business Profiles.</p>
<p>&nbsp;</p>
<p>If your profile is incomplete or outdated, you're invisible to these high-intent customers.</p>
<p>&nbsp;</p>
<p>Here's how to fix that:</p>
<p>&nbsp;</p>
<h3>1. Post Weekly Updates</h3>
<p>Google rewards active profiles. Treat your Business Profile like a social media account:</p>
<p>&nbsp;</p>
<ul>
<li>Share promotions and sales</li>
<li>Announce new products or services</li>
<li>Post about events or special hours</li>
<li>Update COVID-19 protocols if relevant</li>
</ul>
<p>&nbsp;</p>
<p><strong>Frequency:</strong> At least once per week<br>
<strong>Best time:</strong> Thursday or Friday for weekend traffic</p>
<p>&nbsp;</p>
<h3>2. Maximize Photos</h3>
<p>Businesses with complete photo galleries get more engagement. Here's what to upload:</p>
<p>&nbsp;</p>
<ul>
<li><strong>Exterior shots</strong> — Help customers find you</li>
<li><strong>Interior photos</strong> — Set expectations</li>
<li><strong>Product/service photos</strong> — Showcase what you sell</li>
<li><strong>Team photos</strong> — Build trust</li>
<li><strong>Customer photos</strong> — Social proof (with permission)</li>
</ul>
<p>&nbsp;</p>
<p><strong>Target:</strong> 10+ new photos per month</p>
<p>&nbsp;</p>
<h3>3. Enable and Monitor Messaging</h3>
<p>Google Business Profile has a built-in chat feature. When enabled, customers can message you directly from search results.</p>
<p>&nbsp;</p>
<p><strong>Best practices:</strong></p>
<ul>
<li>Respond within 5 minutes during business hours</li>
<li>Set up auto-replies for after-hours</li>
<li>Use saved responses for common questions</li>
</ul>
<p>&nbsp;</p>
<h3>4. Strategic Review Generation</h3>
<p>Reviews are social proof and ranking factors. Here's the right way to get them:</p>
<p>&nbsp;</p>
<ul>
<li>Ask within 24 hours of a positive interaction</li>
<li>Provide a direct review link (generate one in your GBP dashboard)</li>
<li>Respond to every review — positive and negative</li>
<li>Aim for 10+ new reviews monthly</li>
</ul>
<p>&nbsp;</p>
<p><strong>Pro tip:</strong> Include keywords naturally in your responses. When you reply "Thanks for choosing [Your Business] for [service] in Calgary," you reinforce relevance signals.</p>
<p>&nbsp;</p>
<hr>
<p>&nbsp;</p>
<h3>🛠 Tool Recommendation: Canva</h3>
<p>&nbsp;</p>
<p>For creating consistent, on-brand Google Business Profile posts without a designer, we recommend <strong>Canva</strong>.</p>
<p>&nbsp;</p>
<p>Their <strong>Brand Kit</strong> feature lets you store your logo, colors, and fonts in one place. Create templates for weekly posts, then customize in minutes.</p>
<p>&nbsp;</p>
<p><em>[Affiliate link: Canva Pro]</em></p>
<p>&nbsp;</p>
<hr>
<p>&nbsp;</p>
<h3>📰 Related News</h3>
<p>&nbsp;</p>
<p><strong>Google Rolls Out New Business Profile Features for 2025</strong></p>
<p>Google continues to add features to Business Profiles, including enhanced product catalogs and service menus. If you haven't updated your profile recently, now is the time.</p>
<p>&nbsp;</p>
<hr>
<p>&nbsp;</p>
<h3>💼 BizBuzz Take</h3>
<p>Google Business Profile optimization is the highest-ROI marketing activity most local businesses ignore. It's free, it works 24/7, and your competitors are probably doing it poorly.</p>
<p>&nbsp;</p>
<p>Spend 30 minutes this week auditing your profile. The customers are already searching — make sure they can find you.</p>
<p>&nbsp;</p>
<p><em>Source: Google Search Statistics 2023</em></p>`,
    keywords: ["google business profile", "local seo", "calgary marketing", "small business marketing", "google my business"],
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200"
  });
  console.log('Article 2 created:', article2.data._id);

  console.log('\nCreating Article 3: Calgary Economic Pulse...');
  const article3 = await createArticle({
    headline: "Calgary Economic Pulse: What Business Owners Should Know This Quarter",
    subHeadline: "Labor market trends, commercial real estate shifts, and opportunities in the current climate",
    content: `<p><strong>Original Analysis by BizBuzz Calgary</strong></p>
<p>&nbsp;</p>
<p>The Calgary business landscape is shifting. Here's what's happening and what it means for you.</p>
<p>&nbsp;</p>
<h3>📊 Labor Market Trends</h3>
<p>Calgary's job market has shown resilience, with service industry hiring remaining active. Calgary Economic Development reports continued demand in hospitality, healthcare, and professional services.</p>
<p>&nbsp;</p>
<p><strong>What this means for business owners:</strong></p>
<ul>
<li>Competition for talent remains high</li>
<li>Wage pressure continues in skilled roles</li>
<li>Employee retention should be a priority</li>
</ul>
<p>&nbsp;</p>
<p><em>Source: Calgary Economic Development</em></p>
<p>&nbsp;</p>
<h3>🏢 Commercial Real Estate Shifts</h3>
<p>The Bay's closure on Stephen Avenue after 23 years signals broader changes in downtown retail. For businesses, this creates both challenges and opportunities:</p>
<p>&nbsp;</p>
<p><strong>Challenges:</strong></p>
<ul>
<li>Reduced foot traffic in core areas</li>
<li>Shifting consumer patterns</li>
</ul>
<p>&nbsp;</p>
<p><strong>Opportunities:</strong></p>
<ul>
<li>Potential lease renegotiations</li>
<li>Space availability for expansion</li>
<li>Neighborhood retail growth</li>
</ul>
<p>&nbsp;</p>
<h3>📈 Event Industry Evolution</h3>
<p>A notable trend: corporate events are getting smaller and more frequent. Instead of annual conferences, companies are booking quarterly micro-events of 20-50 people.</p>
<p>&nbsp;</p>
<p><strong>Winners:</strong> Boutique venues, caterers, AV companies, event planners<br>
<strong>Strategy:</strong> Package services for smaller, recurring events</p>
<p>&nbsp;</p>
<hr>
<p>&nbsp;</p>
<h3>📰 This Week in Calgary Business</h3>
<p>&nbsp;</p>
<p><strong>Calgary Chamber Business Awards Open for Nominations</strong></p>
<p>The annual Calgary Chamber Business Awards are accepting nominations through May 15. Winners receive significant media exposure and networking opportunities. <em>Source: <a href="https://www.calgarychamber.com">Calgary Chamber of Commerce</a></em></p>
<p>&nbsp;</p>
<p><strong>Bowness Business Association Mixer — April 10</strong></p>
<p>Networking event at The Bowness Pub, 5:30 PM. Free for members, $15 for non-members. <em>Source: Bowness Business Association</em></p>
<p>&nbsp;</p>
<hr>
<p>&nbsp;</p>
<h3>💼 BizBuzz Take</h3>
<p>Economic uncertainty creates opportunity for prepared businesses. Three actions to take this quarter:</p>
<p>&nbsp;</p>
<p>1. <strong>Audit your expenses</strong> — Inflation may be cooling, but costs remain elevated</p>
<p>2. <strong>Invest in retention</strong> — Replacing employees is more expensive than keeping them</p>
<p>3. <strong>Explore grants</strong> — Government funding is designed to stimulate exactly this type of economy</p>
<p>&nbsp;</p>
<p>The businesses that thrive in transitions are the ones that adapt quickly.</p>
<p>&nbsp;</p>
<p><em>Last updated: March 30, 2025</em></p>`,
    keywords: ["calgary economy", "calgary business", "economic trends", "commercial real estate", "calgary jobs"],
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200"
  });
  console.log('Article 3 created:', article3.data._id);

  console.log('\n✅ All articles created successfully!');
  console.log('\nArticle IDs:');
  console.log('1. Alberta Grants Guide:', article1.data._id);
  console.log('2. Google Business Profile Guide:', article2.data._id);
  console.log('3. Calgary Economic Pulse:', article3.data._id);
}

async function createArticle({ headline, subHeadline, content, keywords, imageUrl }) {
  const articleData = {
    storageId: BIZBUZZ_STORAGE_ID,
    type: "ARTICLE",
    articleOptions: {
      contentFrom: "CONTENT",
      keepOriginal: true,
      headline: headline,
      subHeadline: subHeadline,
      content: content,
      keywords: keywords,
      imageUrl: imageUrl,
      summary: {
        title: headline,
        description: subHeadline,
        imageUrl: imageUrl,
        content: content.substring(0, 200) + "..."
      }
    }
  };

  const result = await makeRequest('/newsletters', 'POST', articleData);
  return result;
}

createArticles().catch(console.error);
