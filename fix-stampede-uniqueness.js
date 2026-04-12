const fs=require('fs'); const https=require('https');
const api=fs.readFileSync('/root/.openclaw/workspace/credentials/titanium-api-keys.txt','utf8').match(/Letterman:\s*(\S+)/)[1];
const newsletterId='69d13ced37ba49fb69b3d623';
function req(path,method='GET',data={}){return new Promise((resolve,reject)=>{const body=JSON.stringify(data);const r=https.request({hostname:'api.letterman.ai',path:'/api/ai'+path,method,headers:{Authorization:`Bearer ${api}`,'Content-Type':'application/json','Content-Length':Buffer.byteLength(body)}},res=>{let out='';res.on('data',c=>out+=c);res.on('end',()=>{try{out=JSON.parse(out)}catch{} resolve({status:res.statusCode,data:out});});});r.on('error',reject);r.write(body);r.end();});}
(async()=>{
  const current=(await req(`/newsletters/${newsletterId}/sections`,'GET',{})).data;

  // 1) Remove all ARTICLE_CUE blocks so we can add one clean empty one
  for (const s of current.filter(x=>x.type==='ARTICLE_CUE')) {
    await req(`/newsletters/${newsletterId}/sections/${s._id}`,'DELETE',{});
  }

  // 2) Rewrite newsletter content to be unique and not mirror article drafts
  const updates={
    '69d13f0537ba49fb69b3dc7c': {
      title:'👋 Welcome to Stampede City Buzz',
      promptOutPut:`<p><strong>Stampede City Buzz is meant to feel like a better kind of local check-in.</strong></p><p>&nbsp;</p><p>Not a pile of headlines. Not a generic event list. And not a recycled city summary pretending to be community.</p><p>&nbsp;</p><p>This newsletter is for people who want a sharper sense of what Calgary feels like right now — where the energy is showing up, what kinds of places are drawing people in, and what small signals are worth noticing before they become obvious.</p><p>&nbsp;</p><p>Think of it as a curated local read: part city moodboard, part neighbourhood radar, part reminder that Calgary is more interesting when you actually pay attention.</p>`,
      style:{width:'600','object-fit':'contain',marginBottom:'10'}, showTitle:true
    },
    '69d13f0637ba49fb69b3dc83': {
      title:'<p>🐝 This Week in Calgary</p>',
      subTitle:'A quick read on the city’s current rhythm',
      promptOutPut:`<p><strong>Calgary feels more outward-facing again.</strong> People are leaving winter mode behind and looking for lighter, more social ways to spend time in the city.</p><p>&nbsp;</p><p>The interesting shift is not just that more is happening — it’s <strong>how</strong> it’s happening. Smaller experiences are carrying more weight. A good café, a low-key event, a local market, or a neighbourhood walk now feels more valuable than an overbuilt plan.</p><p>&nbsp;</p><p>That matters because it changes what gets attention. The places and events that feel easy, human, and local are often the ones people remember most — and talk about afterwards.</p>`,
      style:{width:'600','object-fit':'contain',marginBottom:'10'}, hasBorder:true, showTitle:true
    },
    '69d13f0637ba49fb69b3dc8a': {
      title:'🌟 Community Spotlight',
      promptOutPut:`<p><strong>One of the best things about Calgary is that so much of its momentum still comes from regular people.</strong></p><p>&nbsp;</p><p>Not polished campaigns. Not institutions trying to look community-minded. Actual people deciding to host something, gather people, support a cause, or create space where there wasn’t much before.</p><p>&nbsp;</p><p>The city benefits from that kind of initiative constantly, even when it doesn’t always name it clearly. Community life gets stronger every time someone chooses to organize, welcome, promote, or simply keep showing up.</p><p>&nbsp;</p><p>That’s the kind of contribution worth spotlighting here.</p>`,
      style:{width:'600','object-fit':'contain',marginBottom:'10'}, showTitle:true
    },
    '69d13f0737ba49fb69b3dc91': {
      title:'<p>📅 What’s Happening This Week</p>',
      promptOutPut:`<p><strong>If you’re deciding what’s worth doing this week, start simple.</strong></p><p>&nbsp;</p><p>Look for the things that make the city feel more alive without asking for too much effort: neighbourhood events, small creative gatherings, local shopping moments, casual meetups, and family-friendly outings that feel easy to say yes to.</p><p>&nbsp;</p><p>That’s usually where Calgary is at its best — not necessarily in the biggest event on the calendar, but in the places where people can actually linger, talk, discover something, and feel connected to where they live.</p>`,
      style:{width:'600','object-fit':'contain',marginBottom:'10'}, hasBorder:true, showTitle:true
    },
    '69d13f0737ba49fb69b3dc98': {
      title:'❤️ Local Love',
      promptOutPut:`<p><strong>Every city has places people recommend with a certain tone in their voice.</strong></p><p>&nbsp;</p><p>Not because those places are the loudest or trendiest, but because they’ve earned loyalty the old-fashioned way: through consistency, atmosphere, and the feeling they give people when they walk in.</p><p>&nbsp;</p><p>Those places are part of Calgary’s character. They make neighbourhoods feel distinct. They give people their own version of “our spot.” And they often become the backdrop for the kinds of everyday moments that make a city feel personal.</p>`,
      style:{width:'600','object-fit':'contain',marginBottom:'10'}, showTitle:true
    },
    '69d13f0737ba49fb69b3dc9f': {
      title:'🙌 Good News / City Pride',
      promptOutPut:`<p><strong>Good city energy is often cumulative.</strong></p><p>&nbsp;</p><p>It builds when enough people keep contributing to the same direction — supporting local, showing up in person, helping something small succeed, or sharing what deserves attention instead of only what’s wrong.</p><p>&nbsp;</p><p>Calgary has more of that energy than it sometimes gets credit for. The challenge is less about whether it exists and more about whether people pause long enough to notice it.</p><p>&nbsp;</p><p>That’s part of what this publication should keep doing: noticing the city in a way that feels useful, grounded, and worth returning to.</p>`,
      style:{width:'600','object-fit':'contain',marginBottom:'10'}, showTitle:true
    },
    '69d13f0837ba49fb69b3dca6': {
      title:'📣 Get Involved',
      promptOutPut:`<p><strong>Stampede City Buzz gets better when it reflects what locals are actually seeing and caring about.</strong></p><p>&nbsp;</p><p>If there’s a neighbourhood event worth mentioning, a business people should know about, a local space you think deserves more attention, or someone doing community-minded work, send it in.</p><p>&nbsp;</p><p>The goal isn’t just to publish at people. It’s to build a better local read over time — one that gets smarter, more relevant, and more connected with every issue.</p>`,
      style:{width:'600','object-fit':'contain',marginBottom:'10'}, showTitle:true
    }
  };

  for (const [id, body] of Object.entries(updates)) {
    await req(`/newsletters/${newsletterId}/sections/${id}`,'PUT',body);
  }

  // 3) Add one empty ARTICLE_CUE block for Michelle to test manually
  const created = await req(`/newsletters/${newsletterId}/sections`,'POST',{
    type:'ARTICLE_CUE',
    index:16,
    title:'Featured Article Cue',
    promptOutPut:'',
    articles:[],
    style:{marginBottom:'10'},
    showTitle:true
  });

  const final=(await req(`/newsletters/${newsletterId}/sections`,'GET',{})).data;
  console.log(JSON.stringify({
    addedCue: created.data && {id: created.data._id, type: created.data.type, title: created.data.title},
    cueCount: final.filter(x=>x.type==='ARTICLE_CUE').length,
    totalSections: final.length
  }, null, 2));
})();
