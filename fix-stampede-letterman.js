const fs = require('fs');
const https = require('https');

const creds = fs.readFileSync('/root/.openclaw/workspace/credentials/titanium-api-keys.txt','utf8');
const API_KEY = creds.match(/Letterman:\s*(\S+)/)[1];
const STAMPEDE_ID = '69b67eb447872b28b4e043dc';
const BIZ_ID = '69c6f96237ba49fb69a44b52';

function request(path, method='GET', data=null) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.letterman.ai',
      port: 443,
      path: `/api/ai${path}`,
      method,
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try { body = JSON.parse(body); } catch {}
        resolve({ status: res.statusCode, data: body });
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function createNewsletter() {
  const data = {
    storageId: STAMPEDE_ID,
    type: 'NEWSLETTER',
    articleOptions: {
      contentFrom: 'CONTENT',
      keepOriginal: true,
      headline: 'Good People, Hidden Gems & What’s Happening in Calgary This Week',
      subHeadline: 'The first issue of Stampede City Buzz — community stories, local energy, and simple reasons to love Calgary a little more.',
      content: `<p><strong>Welcome to Stampede City Buzz.</strong></p>
<p>&nbsp;</p>
<p>This is a community-first roundup of what’s happening, who’s making a difference, and where Calgary is showing its best side.</p>
<p>&nbsp;</p>
<p><strong>This week in Calgary:</strong> spring markets are starting to return, neighborhood patios are preparing to open, and smaller community events are drawing more attention again.</p>
<p>&nbsp;</p>
<p><strong>Community spotlight:</strong> the people who organize local meetups, support neighborhood projects, and quietly make Calgary feel more connected deserve more recognition.</p>
<p>&nbsp;</p>
<p><strong>What’s happening:</strong> community markets, arts and culture events, family-friendly outings, and local pop-ups are all worth watching this week.</p>
<p>&nbsp;</p>
<p><strong>Local love:</strong> independent coffee shops, bookstores, restaurants, parks, and neighborhood gems continue to shape the city’s personality.</p>
<p>&nbsp;</p>
<p><strong>Good news / city pride:</strong> Calgary keeps getting stronger when people support local, show up for each other, and contribute to the neighborhoods they care about.</p>
<p>&nbsp;</p>
<p><strong>Get involved:</strong> submit a local event, nominate a community builder, or share a hidden gem for a future issue.</p>`,
      keywords: ['Stampede City Buzz','Calgary community','Calgary events','hidden gems Calgary','local Calgary newsletter'],
      imageUrl: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1200',
      summary: {
        title: 'Stampede City Buzz - Issue #1',
        description: 'Good people, hidden gems, and what’s happening in Calgary this week.',
        imageUrl: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1200',
        content: '<p>A community-first roundup of Calgary events, neighbourhood pride, hidden gems, and the people who make the city feel alive.</p>'
      }
    }
  };
  const created = await request('/newsletters', 'POST', data);
  if (!created.data || !created.data._id) throw new Error(`Newsletter create failed: ${JSON.stringify(created.data)}`);
  await request(`/newsletters/update-seo-settings/${created.data._id}`, 'POST', {
    urlPath: 'issue-1-good-people-hidden-gems-calgary-this-week',
    title: 'Stampede City Buzz Issue #1 | Good People, Hidden Gems & What’s Happening in Calgary',
    description: 'The first issue of Stampede City Buzz featuring Calgary community stories, local events, hidden gems, and neighborhood pride.',
    previewImageUrl: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1200',
    archiveThumbnailImageUrl: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400',
    noIndex: false
  });
  return created.data;
}

async function createArticle({title, desc, slug, content, imageUrl, keywords}) {
  const created = await request('/newsletters', 'POST', {
    storageId: STAMPEDE_ID,
    type: 'ARTICLE',
    articleOptions: {
      contentFrom: 'CONTENT',
      keepOriginal: true,
      headline: title,
      subHeadline: desc,
      content,
      keywords,
      imageUrl,
      summary: { title, description: desc, imageUrl, content: content.slice(0,200) + '...' }
    }
  });
  if (!created.data || !created.data._id) throw new Error(`Article create failed for ${title}: ${JSON.stringify(created.data)}`);
  const id = created.data._id;
  await request(`/newsletters/update-seo-settings/${id}`, 'POST', {
    urlPath: slug,
    title: `${title} | Stampede City Buzz`,
    description: desc,
    previewImageUrl: imageUrl,
    archiveThumbnailImageUrl: imageUrl.replace('w=1200','w=400'),
    noIndex: false
  });
  await request(`/newsletters/update-add-to-newsletter-cue/${id}`, 'POST', { addToCue: true });
  await request(`/newsletters/update-add-to-news-feed/${id}`, 'POST', { addToNewsFeed: true });
  return created.data;
}

async function main() {
  const results = { created: {}, deleted: [] };

  results.created.newsletter = await createNewsletter();

  const articles = [
    {
      title: 'Why Small Community Events Are Becoming Calgary’s Real Social Scene',
      desc: 'Big-ticket events still matter, but Calgary’s strongest local energy is showing up in smaller neighborhood gatherings.',
      slug: 'why-small-community-events-are-becoming-calgarys-real-social-scene',
      imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200',
      keywords: ['Calgary events','community events Calgary','local social scene','neighbourhood events'],
      content: `<p><strong>Some of Calgary’s best moments are getting smaller — and that’s a good thing.</strong></p><p>&nbsp;</p><p>Large festivals and city-wide attractions still matter, but more of the real day-to-day energy in Calgary is happening through neighborhood markets, local meetups, pop-ups, community halls, and small public gatherings.</p><p>&nbsp;</p><p>These events feel easier to attend, easier to enjoy, and more personal than massive all-day commitments. People can drop in, support something local, and still feel connected without turning it into a production.</p><p>&nbsp;</p><p>That shift matters. Smaller events create repeat connections. They help local vendors get discovered. They give residents more reasons to spend time close to home. And they make communities feel alive in a way large events can’t always replicate.</p><p>&nbsp;</p><p>For Calgary, this is less about replacing big events and more about balancing them. The city still loves major moments — but more people are building their social life around local, walkable, lower-pressure experiences.</p><p>&nbsp;</p><p>That’s where a lot of Calgary’s real social scene is now taking shape.</p>`
    },
    {
      title: 'The Community Builders of Calgary: The People Who Bring Others Together',
      desc: 'A tribute to the organizers, volunteers, connectors, and local leaders who quietly make Calgary feel more connected.',
      slug: 'the-community-builders-of-calgary-the-people-who-bring-others-together',
      imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200',
      keywords: ['Calgary community builders','Calgary volunteers','community leaders Calgary'],
      content: `<p><strong>Every city has people who make things happen without asking for much credit.</strong></p><p>&nbsp;</p><p>In Calgary, community builders show up in many forms: the volunteer organizing a cleanup, the market founder creating space for local makers, the person who starts a meetup, the neighbor who welcomes newcomers, or the organizer who keeps a small event going month after month.</p><p>&nbsp;</p><p>They may not always have official titles, but they shape how a city feels. They make neighborhoods more welcoming. They create momentum where there wasn’t any. They help strangers become regulars, and regulars become community.</p><p>&nbsp;</p><p>What makes these people special is consistency. They keep showing up. They send the messages, book the rooms, make the introductions, and do the invisible work that turns an idea into something real.</p><p>&nbsp;</p><p>Calgary benefits from these people every day. They are part of what makes the city feel warm, resilient, and full of possibility.</p><p>&nbsp;</p><p>Community doesn’t build itself. Someone always goes first — and Calgary has more of those people than it gets credit for.</p>`
    },
    {
      title: 'Calgary Hidden Gems: The Local Places People Quietly Love',
      desc: 'The spots that become neighborhood favourites are not always the loudest — just the most loved.',
      slug: 'calgary-hidden-gems-the-local-places-people-quietly-love',
      imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200',
      keywords: ['Calgary hidden gems','local Calgary spots','Calgary neighbourhood favourites'],
      content: `<p><strong>Every Calgarian seems to have a place they almost don’t want to tell people about.</strong></p><p>&nbsp;</p><p>Not because they want to keep it secret forever, but because part of its charm comes from feeling discovered. It might be a café with personality, a bookstore with loyal regulars, a park pathway that feels calmer than it should, or a family-run restaurant people recommend with unusual confidence.</p><p>&nbsp;</p><p>These places don’t always dominate headlines or trend online. They become favourites through repetition, word of mouth, and the feeling they give people when they walk in.</p><p>&nbsp;</p><p>That matters in a city like Calgary. Hidden gems are part of how neighborhoods develop identity. They help people feel more rooted. They give residents something local to care about and something worth recommending.</p><p>&nbsp;</p><p>Sometimes the best places aren’t the biggest, newest, or most polished. They’re simply the ones that feel welcoming, consistent, and unmistakably part of the city.</p><p>&nbsp;</p><p>Those are the places people quietly love — and they deserve more attention.</p>`
    },
    {
      title: 'Calgary Good News: The Stories Worth Paying More Attention To',
      desc: 'A city feels different when you notice the local wins, small acts of care, and community momentum that often get overlooked.',
      slug: 'calgary-good-news-the-stories-worth-paying-more-attention-to',
      imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200',
      keywords: ['Calgary good news','positive Calgary stories','community wins Calgary'],
      content: `<p><strong>Not every important story arrives as breaking news.</strong></p><p>&nbsp;</p><p>Sometimes the stories that matter most are the quieter ones: a successful fundraiser, a neighborhood initiative, a local business finding its footing, volunteers improving a shared space, or a community event that simply makes people feel more connected.</p><p>&nbsp;</p><p>These stories don’t always get the biggest attention, but they shape daily life in Calgary in meaningful ways. They remind people the city is more than traffic, headlines, and big debates. It is also made of gestures, effort, and momentum.</p><p>&nbsp;</p><p>Paying attention to good news is not about ignoring problems. It’s about noticing what is working so those things can grow. It’s about seeing the people and projects that are helping Calgary feel more hopeful, local, and human.</p><p>&nbsp;</p><p>There is more good happening in this city than most people hear about. The challenge is not whether it exists. The challenge is whether we take the time to notice it.</p>`
    }
  ];

  results.created.articles = [];
  for (const article of articles) {
    results.created.articles.push(await createArticle(article));
  }

  const wrongIds = [
    '69cc2f2637ba49fb69ac8e7e',
    '69cc2f2837ba49fb69ac8e90',
    '69cc2f2a37ba49fb69ac8e9c',
    '69cc2f2b37ba49fb69ac8ead'
  ];

  for (const id of wrongIds) {
    const del = await request(`/newsletters/${id}`, 'DELETE');
    results.deleted.push({ id, status: del.status, data: del.data });
  }

  console.log(JSON.stringify(results, null, 2));
}

main().catch(err => { console.error(err); process.exit(1); });
