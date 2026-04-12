const fs = require('fs');
const https = require('https');
const creds = fs.readFileSync('/root/.openclaw/workspace/credentials/titanium-api-keys.txt','utf8');
const API_KEY = creds.match(/Letterman:\s*(\S+)/)[1];
const STORAGE_ID = '69b67eb447872b28b4e043dc';
const NEWSLETTER_ID = '69d13ced37ba49fb69b3d623';

function req(path, method='GET', data=null) {
  return new Promise((resolve, reject) => {
    const body = data ? JSON.stringify(data) : null;
    const r = https.request({
      hostname: 'api.letterman.ai',
      port: 443,
      path: `/api/ai${path}`,
      method,
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': body ? Buffer.byteLength(body) : 0
      }
    }, res => {
      let out = '';
      res.on('data', c => out += c);
      res.on('end', () => {
        try { out = JSON.parse(out); } catch {}
        resolve({status: res.statusCode, data: out});
      });
    });
    r.on('error', reject);
    if (body) r.write(body);
    r.end();
  });
}

async function ensureNewsletterContent() {
  const sectionsRes = await req(`/newsletters/${NEWSLETTER_ID}/sections`);
  const existing = Array.isArray(sectionsRes.data) ? sectionsRes.data : [];
  for (const s of existing) {
    if (s && s._id) await req(`/newsletters/${NEWSLETTER_ID}/sections/${s._id}`, 'DELETE', {});
  }

  const sections = [
    {
      type: 'AI_ARTICLE',
      index: 0,
      title: '👋 Welcome to Stampede City Buzz',
      promptOutPut: `<p><strong>Welcome to the very first issue of Stampede City Buzz</strong> — a community-first roundup of what’s happening, who’s making a difference, and where Calgary is showing its best side.</p><p>&nbsp;</p><p>This isn’t just another city newsletter stuffed with headlines. It’s a local pulse check: a place to spotlight neighbourhood energy, community wins, events worth showing up for, and the people quietly making this city feel more connected.</p><p>&nbsp;</p><p>If you love Calgary, want to discover more of it, or just want one simple way to stay in the loop, you’re in the right place.</p>`,
      style: { width: '600', 'object-fit': 'contain', marginBottom: '10' }
    },
    {
      type: 'CUSTOM_COMBO',
      index: 1,
      title: '<p>🐝 This Week in Calgary</p>',
      subTitle: 'Local energy is picking up again',
      promptOutPut: `<p><strong>Spring is finally starting to wake the city up.</strong> Community markets are coming back, neighborhood patios are preparing to open, and event calendars are filling up again after a long winter stretch.</p><p>&nbsp;</p><p><strong>Local momentum is shifting back to in-person connection.</strong> Smaller community events, vendor pop-ups, family activities, and grassroots gatherings are getting more attention than massive one-off experiences.</p><p>&nbsp;</p><p><strong>Neighbourhood pride is on the rise.</strong> More local groups are spotlighting hidden gems, supporting small initiatives, and creating tighter hyper-local networks.</p><p>&nbsp;</p><p><strong>Calgarians are looking for simple things to do close to home.</strong> Think markets, walks, cafés, local events, and affordable experiences that feel easy, social, and worth leaving the house for.</p>`,
      style: { width: '600', 'object-fit': 'contain', marginBottom: '10' },
      hasBorder: true,
      showTitle: true
    },
    {
      type: 'AI_ARTICLE',
      index: 2,
      title: '🌟 Community Spotlight',
      promptOutPut: `<p><strong>The people who build community rarely ask for attention — but they deserve it.</strong></p><p>&nbsp;</p><p>Across Calgary, some of the most important city-building happens quietly. It happens through volunteers who organize local cleanups, market organizers who create space for makers, and neighborhood connectors who know everyone by name and make new people feel welcome.</p><p>&nbsp;</p><p>This issue’s spotlight is really for that whole category of people: the community builders.</p><p>&nbsp;</p><p>The ones who start with a simple idea — a meetup, a pop-up, a local fundraiser, a support group, a street-level event, or even just a post asking neighbours to show up.</p><p>&nbsp;</p><p>If you know someone in Calgary who is bringing people together, creating local energy, or making a neighborhood better, we want to hear about them.</p>`,
      style: { width: '600', 'object-fit': 'contain', marginBottom: '10' }
    },
    {
      type: 'CUSTOM_COMBO',
      index: 3,
      title: '<p>📅 What’s Happening This Week</p>',
      promptOutPut: `<p><strong>Community Markets</strong> — Spring markets are beginning to return, bringing local makers, artists, food vendors, and small businesses together in one place.</p><p>&nbsp;</p><p><strong>Arts &amp; Culture Events</strong> — Gallery shows, live performances, comedy nights, and community arts programming continue to give Calgary its creative pulse.</p><p>&nbsp;</p><p><strong>Family-Friendly Outings</strong> — Weekend family events, library programming, recreation activities, and neighborhood gatherings are always worth watching.</p><p>&nbsp;</p><p><strong>Casual Meetups &amp; Pop-Ups</strong> — Small pop-ups, café events, and community-led hangouts are increasingly where some of the best city energy shows up first.</p>`,
      style: { width: '600', 'object-fit': 'contain', marginBottom: '10' },
      hasBorder: true,
      showTitle: true
    },
    {
      type: 'AI_ARTICLE',
      index: 4,
      title: '❤️ Local Love',
      promptOutPut: `<p><strong>There’s something special about discovering a place that feels like it belongs to the city — not just in it.</strong></p><p>&nbsp;</p><p>That could be a cozy independent coffee shop, a bookstore with personality, a locally-owned shop with loyal regulars, a family-run restaurant people swear by, or a park and pathway spot locals love but rarely advertise.</p><p>&nbsp;</p><p>The point of Stampede City Buzz is to surface more of those places.</p><p>&nbsp;</p><p>Not every highlight has to be the biggest or the loudest. Sometimes the places that matter most are simply the ones that make people feel welcome, remembered, and more connected to their corner of Calgary.</p>`,
      style: { width: '600', 'object-fit': 'contain', marginBottom: '10' }
    },
    {
      type: 'SPECIAL_PROMPT',
      subType: 'QUOTE_OF_THE_DAY',
      index: 5,
      title: 'Quote of the Day',
      prompt: 'Give me a warm, community-focused quote about local pride and showing up for each other. Return response only without any prefix.',
      promptPhrase: 'Calgary community local pride',
      promptOutPut: `<p><strong>“A city becomes home when people choose to care for it — and for each other.”</strong></p>`,
      style: { marginBottom: '10' }
    },
    {
      type: 'AI_ARTICLE',
      index: 6,
      title: '🙌 Good News / City Pride',
      promptOutPut: `<p>It’s easy to focus on what’s broken in a city. It takes more intention to notice what’s working.</p><p>&nbsp;</p><p>But Calgary gives us plenty to be proud of: neighbors showing up for each other, volunteers giving their time, local creators putting work into the community, small businesses taking chances, grassroots events bringing people out, and people choosing local over convenient.</p><p>&nbsp;</p><p>Cities are shaped by repetition. Every time someone supports local, attends a community event, helps a neighbor, or shares something worth noticing, they help shape the version of Calgary we all get to live in.</p>`,
      style: { width: '600', 'object-fit': 'contain', marginBottom: '10' }
    },
    {
      type: 'AI_ARTICLE',
      index: 7,
      title: '📣 Get Involved',
      promptOutPut: `<p>Want to help shape future issues of <strong>Stampede City Buzz</strong>?</p><p>&nbsp;</p><p>We’d love for readers to:</p><ul><li><strong>Submit a local event</strong></li><li><strong>Nominate a community builder</strong></li><li><strong>Share a hidden gem</strong></li><li><strong>Recommend a local business or creator</strong></li><li><strong>Send us feel-good Calgary stories</strong></li></ul><p>The more people contribute, the more this becomes a real community publication instead of just another newsletter.</p><p>&nbsp;</p><p><strong>Stampede City Buzz is here to notice the good stuff.</strong></p>`,
      style: { width: '600', 'object-fit': 'contain', marginBottom: '10' }
    }
  ];

  for (const section of sections) {
    await req(`/newsletters/${NEWSLETTER_ID}/sections`, 'POST', section);
  }
}

async function createArticle({title, desc, slug, content, imageUrl, keywords}) {
  const created = await req('/newsletters', 'POST', {
    storageId: STORAGE_ID,
    type: 'ARTICLE',
    articleOptions: {
      contentFrom: 'CONTENT',
      keepOriginal: true,
      headline: title,
      subHeadline: desc,
      content,
      keywords,
      imageUrl,
      summary: { title, description: desc, imageUrl, content: content.slice(0, 220) + '...' }
    }
  });
  const id = created.data._id;
  await req(`/newsletters/update-seo-settings/${id}`, 'POST', {
    urlPath: slug,
    title: `${title} | Stampede City Buzz`,
    description: desc,
    previewImageUrl: imageUrl,
    archiveThumbnailImageUrl: imageUrl.replace('w=1200', 'w=400'),
    noIndex: false
  });
  await req(`/newsletters/update-add-to-newsletter-cue/${id}`, 'POST', {});
  await req(`/newsletters/update-add-to-news-feed/${id}`, 'POST', {});
  return { id, title };
}

async function main() {
  await ensureNewsletterContent();

  const existingRes = await req(`/newsletters-storage/${STORAGE_ID}/newsletters?state=DRAFT&type=ARTICLE`);
  const existingTitles = new Set((Array.isArray(existingRes.data) ? existingRes.data : []).map(x => x.title));

  const remaining = [
    {
      title: 'Family-Friendly Calgary: Low-Key Things to Do Without Overplanning Your Weekend',
      desc: 'A practical guide to easy, lower-pressure family activities around Calgary.',
      slug: 'family-friendly-calgary-low-key-things-to-do-without-overplanning-your-weekend',
      imageUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1200',
      keywords: ['family-friendly Calgary','Calgary weekend ideas','Calgary activities for families'],
      content: `<p><strong>Not every weekend needs to be overbuilt to be enjoyable.</strong></p><p>&nbsp;</p><p>For many Calgary families, the best plans are the simple ones: library programs, neighborhood walks, community events, recreation centres, casual markets, and low-cost outings that don’t require military-grade logistics.</p><p>&nbsp;</p><p>That’s part of what makes this kind of local living work. Families don’t always need a huge attraction. They need options that feel manageable, affordable, and worth leaving the house for.</p><p>&nbsp;</p><p>Calgary offers more of these low-key experiences than people sometimes realize. The trick is not trying to do everything. It’s choosing one or two things that fit the day and letting that be enough.</p><p>&nbsp;</p><p>Simple plans tend to be the ones families remember best — because everyone actually gets to enjoy them.</p>`
    },
    {
      title: 'Why Supporting Local Feels More Personal in Calgary',
      desc: 'Choosing local in Calgary often feels less transactional and more connected to real people and neighbourhoods.',
      slug: 'why-supporting-local-feels-more-personal-in-calgary',
      imageUrl: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1200',
      keywords: ['support local Calgary','Calgary local businesses','community economy Calgary'],
      content: `<p><strong>Supporting local doesn’t just feel good in theory — in Calgary, it often feels personal.</strong></p><p>&nbsp;</p><p>When people choose an independent café, a neighborhood shop, a market vendor, or a family-run restaurant, they’re usually not just buying a product. They’re reinforcing the kind of city they want to live in.</p><p>&nbsp;</p><p>That emotional layer matters. Local businesses often carry more personality, more familiarity, and more visible effort. People remember the owner, the atmosphere, the conversation, or the feeling of being treated like a regular instead of a transaction.</p><p>&nbsp;</p><p>That’s one reason supporting local has such staying power in Calgary. It connects everyday spending with community identity. It turns routine choices into small acts of participation.</p><p>&nbsp;</p><p>And over time, those small choices shape the culture of the city.</p>`
    },
    {
      title: 'Spring in Calgary: Markets, Makers, and the Return of Local Energy',
      desc: 'Spring brings back the markets, makers, and neighbourhood momentum that make Calgary feel lively again.',
      slug: 'spring-in-calgary-markets-makers-and-the-return-of-local-energy',
      imageUrl: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=1200',
      keywords: ['spring Calgary','Calgary markets','local makers Calgary'],
      content: `<p><strong>You can feel the city loosen up when spring starts to arrive.</strong></p><p>&nbsp;</p><p>In Calgary, spring means more than a weather shift. It means local markets begin to reappear, makers come back into public view, patios prepare to reopen, and people start looking for reasons to spend more time out in their neighborhoods.</p><p>&nbsp;</p><p>That seasonal reset brings energy with it. More people are willing to explore, support local, and say yes to small plans. Vendors get more visibility. Community spaces feel more active. The city starts to feel social again.</p><p>&nbsp;</p><p>What makes this period special is how many small things begin happening at once. Calgary doesn’t wake up all in one moment — it wakes up in layers. And that layered return is part of the charm.</p>`
    },
    {
      title: 'Calgary’s Creative Pulse: Why Local Arts Still Matter to Community Life',
      desc: 'Arts and culture continue to shape Calgary’s identity, community mood, and sense of place.',
      slug: 'calgarys-creative-pulse-why-local-arts-still-matter-to-community-life',
      imageUrl: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=1200',
      keywords: ['Calgary arts','Calgary culture','local creativity Calgary'],
      content: `<p><strong>A city without a creative pulse starts to feel flatter than it should.</strong></p><p>&nbsp;</p><p>Local arts matter in Calgary not just because they entertain people, but because they give the city texture. Music, visual art, performances, comedy, galleries, pop-up exhibits, and independent creative events all help shape how a place feels to live in.</p><p>&nbsp;</p><p>Creative work also builds community in quieter ways. It gives people gathering points. It creates shared experiences. It helps neighborhoods feel distinct. And it offers local voices a way to contribute to the city’s identity in public.</p><p>&nbsp;</p><p>When people support local arts, they’re not funding something extra. They’re reinforcing one of the things that makes community life richer and more memorable.</p>`
    },
    {
      title: 'How Neighbourhood Pride Shapes a Better City',
      desc: 'A stronger city often starts with people caring more deeply about the neighbourhoods they live in.',
      slug: 'how-neighbourhood-pride-shapes-a-better-city',
      imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200',
      keywords: ['neighbourhood pride Calgary','community identity','better city Calgary'],
      content: `<p><strong>Big ideas about cities usually start at street level.</strong></p><p>&nbsp;</p><p>Neighbourhood pride is one of the least flashy but most important forces in community life. When people care about their local area — its businesses, parks, events, streets, and social fabric — they tend to participate more, support more, and notice more.</p><p>&nbsp;</p><p>That creates momentum. Neighbors become more willing to help. Local events get stronger attendance. Small improvements matter more. A sense of place gets reinforced instead of fading.</p><p>&nbsp;</p><p>In Calgary, this kind of neighborhood-level care helps make the city feel warmer, more personal, and more livable. A better city doesn’t only come from top-down systems. It also comes from people taking real pride in the places closest to them.</p>`
    },
    {
      title: 'The New Calgary Social Life: Cafés, Pop-Ups, Walkable Events, and Community Spaces',
      desc: 'Calgary’s social life is increasingly being shaped by smaller, easier, more local experiences.',
      slug: 'the-new-calgary-social-life-cafes-pop-ups-walkable-events-and-community-spaces',
      imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200',
      keywords: ['Calgary social life','Calgary pop-ups','community spaces Calgary'],
      content: `<p><strong>Social life in Calgary doesn’t look exactly the way it used to.</strong></p><p>&nbsp;</p><p>More people are building their routines around smaller, easier experiences: a café meet-up, a pop-up market, a walkable event, an informal neighborhood gathering, or a community space that feels low-pressure and genuinely local.</p><p>&nbsp;</p><p>That shift says something important. People still want connection, but increasingly they want it in forms that feel flexible, local, and human-sized. Not every outing needs to be a major production. Sometimes it’s enough to have somewhere worth going and people worth seeing.</p><p>&nbsp;</p><p>This is part of what gives Calgary its current energy. The city is finding more of its social rhythm in the everyday spaces between major events.</p>`
    }
  ];

  const created = [];
  for (const article of remaining) {
    if (!existingTitles.has(article.title)) {
      created.push(await createArticle(article));
    }
  }

  const sectionsCheck = await req(`/newsletters/${NEWSLETTER_ID}/sections`);
  console.log(JSON.stringify({
    newsletterId: NEWSLETTER_ID,
    newsletterSections: Array.isArray(sectionsCheck.data) ? sectionsCheck.data.length : 0,
    createdArticles: created
  }, null, 2));
}

main().catch(err => { console.error(err); process.exit(1); });
