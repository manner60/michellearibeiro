const https = require('https');

const LETTERMAN_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWFlMjIyODQ3ODcyYjI4YjRkNDJkZGQiLCJrZXkiOiIyYWNiOWZlNjk0OWQ1MWIyODdmMjY2ZGM2ZDVjNzZmZiIsImlkIjoiNjlhZjY0NWE0Nzg3MmIyOGI0ZDY2MGZhIiwiaWF0IjoxNzczMTAyMTcwLCJleHAiOjE4MDQ2MzgxNzB9.kPubZoPK9GrJEHTMz0RAKQAhdKYYEEgP_Nbo_7iAdgA';

const newsletter = {
  name: "BizBuzz Calgary - Issue #1",
  subject: "The $50K Grant You Might Be Missing + Why Kensington's Newest Cafe is Crushing It",
  from_name: "Calgary Biz Guide",
  from_email: "info@calgarybizguide.com",
  reply_to: "info@calgarybizguide.com",
  text_content: `📰 HEADLINE:
The $50K Grant You Might Be Missing + Why Kensington's Newest Cafe is Crushing It

---

🐝 THE WEEKLY BUZZ

New Openings: The Rustic Bean Coffee House soft-opened in Kensington this week, joining a wave of independent cafes betting on Calgary's post-downtown recovery.

Economic Pulse: Calgary's unemployment rate dropped to 6.2% in February — the lowest since 2019 — signaling stronger consumer spending ahead for local businesses.

Policy Watch: The City of Calgary extended its Small Business Tax Assistance Program deadline to April 15. If you're struggling with property tax hikes, apply now.

Trend Alert: "Micro-events" are replacing large conferences. Local venues report 40% more bookings for 20-50 person corporate gatherings.

Closing Note: After 23 years, Stephen Avenue's iconic The Bay department store is officially shuttering. Retailers nearby should prepare for foot traffic shifts.

---

📈 GROWTH TIP OF THE WEEK

Turn Your Google Business Profile Into a Lead Machine

Most Calgary businesses have a Google listing. Few optimize it. Here's how to stand out:

• Post weekly updates — Treat it like social media. Share promotions, events, or new products directly on your listing
• Add photos monthly — Businesses with 100+ photos get 520% more calls than those with none. Snap your space, team, and products
• Enable messaging — 82% of local searches happen on mobile. Let customers text you directly from Google
• Request reviews strategically — Ask happy customers within 24 hours of service. Include a direct link to make it effortless

---

🔦 LOCAL BUSINESS SPOTLIGHT

The Rustic Bean Coffee House — Kensington

What they do: Independent specialty coffee shop with rotating local roasters and a "third place" community focus.

What they're doing well:

Before opening, they spent 6 months building an Instagram following by documenting their build-out, introducing their roaster partners, and crowdsourcing menu ideas. Result? 200+ people lined up on opening day.

Their "Neighbourhood Regular" program — a simple punch card with a free drink every 10 visits — has already driven 40% repeat customer rate in week one.

Why it matters: They didn't wait for opening day to start marketing. By building anticipation and community before launch, they turned opening week into an event. The takeaway? Your marketing starts before your doors open.

---

🛠 TOOL OR RESOURCE

Canva's "Brand Kit" Feature

What it is: A free tool to store your logo, colors, fonts, and templates in one place.

Who it's for: Any Calgary business creating social posts, flyers, or email graphics without a designer.

Why it's valuable: Consistency builds trust. Brand Kit ensures every Instagram post, menu update, or promotional flyer looks professionally on-brand — even when your niece is making it. Takes 10 minutes to set up, saves hours of decision fatigue.

---

📣 OPPORTUNITIES BOARD

Alberta Small Business Innovation Grant — Up to $50K for tech adoption or process improvements. Deadline: April 30. Apply via Alberta.ca

Calgary Chamber Business Awards — Nominations open. Winners get major media exposure. Deadline: May 15.

YYC Food & Drink Experience — Local restaurants can apply for featured placement in this summer's city-wide culinary event. Limited spots.

Bowness Business Association Mixer — April 10, 5:30 PM at The Bowness Pub. Free for members, $15 for non-members.

Spring Hiring Push — Calgary Economic Development reports 12,000+ open service industry positions. Post on Calgary-specific job boards (not just Indeed) to stand out.

---

💬 COMMUNITY PULSE

What's the biggest challenge you're facing right now?

Staffing? Rising costs? Getting noticed? Hit reply and let us know — we'll tackle the most common issues in upcoming issues.

---

🚀 CALL TO ACTION

Is your business listed on Calgary Biz Guide?

Our directory helps locals discover and support Calgary businesses — and it's completely free to list. Already listed? Upgrade to a featured spot and get highlighted in an upcoming newsletter spotlight.

Add Your Business | Get Featured

---

BizBuzz Calgary is your weekly pulse on the local business scene. Forward to a fellow business owner who needs this.

Published by Calgary Biz Guide`,
  html_content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BizBuzz Calgary - Issue #1</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <h1 style="color: #1a1a1a; font-size: 28px; margin-bottom: 5px;">📰 BizBuzz Calgary</h1>
  <p style="color: #666; font-size: 14px; margin-top: 0;">Issue #1 | Your weekly pulse on the Calgary business scene</p>
  
  <hr style="border: none; border-top: 2px solid #e0e0e0; margin: 20px 0;">
  
  <h2 style="color: #d32f2f; font-size: 22px; margin-bottom: 15px;">The $50K Grant You Might Be Missing + Why Kensington's Newest Cafe is Crushing It</h2>
  
  <h3 style="color: #f57c00; font-size: 18px; margin-top: 25px;">🐝 THE WEEKLY BUZZ</h3>
  
  <p><strong>New Openings:</strong> The Rustic Bean Coffee House soft-opened in Kensington this week, joining a wave of independent cafes betting on Calgary's post-downtown recovery.</p>
  
  <p><strong>Economic Pulse:</strong> Calgary's unemployment rate dropped to 6.2% in February — the lowest since 2019 — signaling stronger consumer spending ahead for local businesses.</p>
  
  <p><strong>Policy Watch:</strong> The City of Calgary extended its Small Business Tax Assistance Program deadline to April 15. If you're struggling with property tax hikes, apply now.</p>
  
  <p><strong>Trend Alert:</strong> "Micro-events" are replacing large conferences. Local venues report 40% more bookings for 20-50 person corporate gatherings.</p>
  
  <p><strong>Closing Note:</strong> After 23 years, Stephen Avenue's iconic The Bay department store is officially shuttering. Retailers nearby should prepare for foot traffic shifts.</p>
  
  <h3 style="color: #f57c00; font-size: 18px; margin-top: 25px;">📈 GROWTH TIP OF THE WEEK</h3>
  
  <p><strong>Turn Your Google Business Profile Into a Lead Machine</strong></p>
  
  <p>Most Calgary businesses have a Google listing. Few optimize it. Here's how to stand out:</p>
  
  <ul>
    <li><strong>Post weekly updates</strong> — Treat it like social media. Share promotions, events, or new products directly on your listing</li>
    <li><strong>Add photos monthly</strong> — Businesses with 100+ photos get 520% more calls than those with none. Snap your space, team, and products</li>
    <li><strong>Enable messaging</strong> — 82% of local searches happen on mobile. Let customers text you directly from Google</li>
    <li><strong>Request reviews strategically</strong> — Ask happy customers within 24 hours of service. Include a direct link to make it effortless</li>
  </ul>
  
  <h3 style="color: #f57c00; font-size: 18px; margin-top: 25px;">🔦 LOCAL BUSINESS SPOTLIGHT</h3>
  
  <p><strong>The Rustic Bean Coffee House — Kensington</strong></p>
  
  <p><em>What they do:</em> Independent specialty coffee shop with rotating local roasters and a "third place" community focus.</p>
  
  <p><em>What they're doing well:</em></p>
  
  <p>Before opening, they spent 6 months building an Instagram following by documenting their build-out, introducing their roaster partners, and crowdsourcing menu ideas. Result? 200+ people lined up on opening day.</p>
  
  <p>Their "Neighbourhood Regular" program — a simple punch card with a free drink every 10 visits — has already driven 40% repeat customer rate in week one.</p>
  
  <p><em>Why it matters:</em> They didn't wait for opening day to start marketing. By building anticipation and community before launch, they turned opening week into an event. The takeaway? Your marketing starts before your doors open.</p>
  
  <h3 style="color: #f57c00; font-size: 18px; margin-top: 25px;">🛠 TOOL OR RESOURCE</h3>
  
  <p><strong>Canva's "Brand Kit" Feature</strong></p>
  
  <p><strong>What it is:</strong> A free tool to store your logo, colors, fonts, and templates in one place.</p>
  
  <p><strong>Who it's for:</strong> Any Calgary business creating social posts, flyers, or email graphics without a designer.</p>
  
  <p><strong>Why it's valuable:</strong> Consistency builds trust. Brand Kit ensures every Instagram post, menu update, or promotional flyer looks professionally on-brand — even when your niece is making it. Takes 10 minutes to set up, saves hours of decision fatigue.</p>
  
  <h3 style="color: #f57c00; font-size: 18px; margin-top: 25px;">📣 OPPORTUNITIES BOARD</h3>
  
  <ul>
    <li><strong>Alberta Small Business Innovation Grant</strong> — Up to $50K for tech adoption or process improvements. Deadline: April 30. <a href="https://alberta.ca">Apply via Alberta.ca</a></li>
    <li><strong>Calgary Chamber Business Awards</strong> — Nominations open. Winners get major media exposure. Deadline: May 15.</li>
    <li><strong>YYC Food & Drink Experience</strong> — Local restaurants can apply for featured placement in this summer's city-wide culinary event. Limited spots.</li>
    <li><strong>Bowness Business Association Mixer</strong> — April 10, 5:30 PM at The Bowness Pub. Free for members, $15 for non-members.</li>
    <li><strong>Spring Hiring Push</strong> — Calgary Economic Development reports 12,000+ open service industry positions. Post on Calgary-specific job boards (not just Indeed) to stand out.</li>
  </ul>
  
  <h3 style="color: #f57c00; font-size: 18px; margin-top: 25px;">💬 COMMUNITY PULSE</h3>
  
  <p><strong>What's the biggest challenge you're facing right now?</strong></p>
  
  <p>Staffing? Rising costs? Getting noticed? Hit reply and let us know — we'll tackle the most common issues in upcoming issues.</p>
  
  <h3 style="color: #f57c00; font-size: 18px; margin-top: 25px;">🚀 CALL TO ACTION</h3>
  
  <p><strong>Is your business listed on Calgary Biz Guide?</strong></p>
  
  <p>Our directory helps locals discover and support Calgary businesses — and it's completely free to list. Already listed? Upgrade to a featured spot and get highlighted in an upcoming newsletter spotlight.</p>
  
  <p><a href="https://calgarybizguide.com/submit-listing/" style="color: #d32f2f; text-decoration: none; font-weight: bold;">Add Your Business</a> | <a href="https://calgarybizguide.com/pricing/" style="color: #d32f2f; text-decoration: none; font-weight: bold;">Get Featured</a></p>
  
  <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
  
  <p style="color: #666; font-size: 12px; text-align: center;"><em>BizBuzz Calgary is your weekly pulse on the local business scene. Forward to a fellow business owner who needs this.</em></p>
  
  <p style="color: #666; font-size: 12px; text-align: center;">Published by <a href="https://calgarybizguide.com" style="color: #d32f2f;">Calgary Biz Guide</a></p>
  
</body>
</html>`
};

const postData = JSON.stringify(newsletter);

const options = {
  hostname: 'api.letterman.app',
  port: 443,
  path: '/v1/newsletters',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${LETTERMAN_API_KEY}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', JSON.stringify(res.headers, null, 2));
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response Body:');
    try {
      const parsed = JSON.parse(data);
      console.log(JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log(data);
    }
  });
});

req.on('error', (e) => {
  console.error('Request Error:', e.message);
});

req.write(postData);
req.end();
