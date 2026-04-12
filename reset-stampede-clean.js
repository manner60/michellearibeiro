const fs=require('fs'); const https=require('https');
const api=fs.readFileSync('/root/.openclaw/workspace/credentials/titanium-api-keys.txt','utf8').match(/Letterman:\s*(\S+)/)[1];
const storageId='69b67eb447872b28b4e043dc';
const oldNewsletterId='69d13ced37ba49fb69b3d623';
const articleIds=[
 '69d13cee37ba49fb69b3d631','69d13cef37ba49fb69b3d649','69d13cf137ba49fb69b3d661','69d13cf237ba49fb69b3d67d',
 '69d13e9437ba49fb69b3da5c','69d13e9537ba49fb69b3da72','69d13e9637ba49fb69b3da89','69d13e9837ba49fb69b3daa0','69d13e9937ba49fb69b3dab7','69d13e9a37ba49fb69b3dad0'
];
function req(path,method='GET',data={}){return new Promise((resolve,reject)=>{const body=JSON.stringify(data);const r=https.request({hostname:'api.letterman.ai',path:'/api/ai'+path,method,headers:{Authorization:`Bearer ${api}`,'Content-Type':'application/json','Content-Length':Buffer.byteLength(body)}},res=>{let out='';res.on('data',c=>out+=c);res.on('end',()=>{try{out=JSON.parse(out)}catch{} resolve({status:res.statusCode,data:out});});});r.on('error',reject);r.write(body);r.end();});}
async function createNewsletter(){
  const data={
    storageId,
    type:'NEWSLETTER',
    articleOptions:{
      contentFrom:'CONTENT',
      keepOriginal:true,
      headline:'Stampede City Buzz Issue #1 | Good People, Hidden Gems & What’s Happening in Calgary',
      subHeadline:'A cleaner first issue with unique editorial content and room for article cue placements.',
      content:'<p>Welcome to Stampede City Buzz.</p>',
      keywords:['Stampede City Buzz','Calgary community','Calgary events','Calgary local culture'],
      imageUrl:'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1200',
      summary:{
        title:'Stampede City Buzz Issue #1',
        description:'A cleaner first issue with unique editorial content and space for article cue placements.',
        imageUrl:'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600',
        content:'<p>A community-first Calgary issue with original newsletter content and four empty article cue blocks.</p>'
      }
    }
  };
  const created=await req('/newsletters','POST',data);
  if(!created.data || !created.data._id) throw new Error('failed create newsletter');
  const id=created.data._id;
  await req(`/newsletters/update-seo-settings/${id}`,'POST',{
    urlPath:'issue-1-good-people-hidden-gems-calgary-this-week',
    title:'Stampede City Buzz Issue #1 | Good People, Hidden Gems & What’s Happening in Calgary',
    description:'A cleaner first issue with unique editorial content and space for article cue placements.',
    previewImageUrl:'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1200',
    archiveThumbnailImageUrl:'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400',
    noIndex:false
  });
  return id;
}
async function addSection(newsletterId, data){return req(`/newsletters/${newsletterId}/sections`,'POST',data)}
(async()=>{
  // set articles back to draft
  const articleResults=[];
  for(const id of articleIds){
    const r=await req(`/newsletters/${id}`,'PUT',{state:'DRAFT'});
    articleResults.push({id,status:r.status,state:r.data&&r.data.state});
  }
  // delete old messy draft newsletter
  const del=await req(`/newsletters/${oldNewsletterId}`,'DELETE',{});
  // create new clean newsletter
  const newsletterId=await createNewsletter();
  const sections=[
    {type:'IMAGE',index:0,title:'',imageUrl:'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1400',style:{width:'600','object-fit':'cover',marginBottom:'12'},showTitle:false},
    {type:'AI_ARTICLE',index:1,title:'👋 Welcome to Stampede City Buzz',promptOutPut:'<p><strong>Stampede City Buzz is meant to feel like a better kind of local check-in.</strong></p><p>&nbsp;</p><p>Not a pile of headlines. Not a generic event list. And not a recycled city summary pretending to be community.</p><p>&nbsp;</p><p>This newsletter is for people who want a sharper sense of what Calgary feels like right now — where the energy is showing up, what kinds of places are drawing people in, and what small signals are worth noticing before they become obvious.</p><p>&nbsp;</p><p>Think of it as a curated local read: part city moodboard, part neighbourhood radar, part reminder that Calgary is more interesting when you actually pay attention.</p>',style:{width:'600','object-fit':'contain',marginBottom:'10'},showTitle:true},
    {type:'IMAGE',index:2,title:'',imageUrl:'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200',style:{width:'600','object-fit':'cover',marginBottom:'12'},showTitle:false},
    {type:'CUSTOM_COMBO',index:3,title:'<p>🐝 This Week in Calgary</p>',subTitle:'A quick read on the city’s current rhythm',promptOutPut:'<p><strong>Calgary feels more outward-facing again.</strong> People are leaving winter mode behind and looking for lighter, more social ways to spend time in the city.</p><p>&nbsp;</p><p>The interesting shift is not just that more is happening — it’s <strong>how</strong> it’s happening. Smaller experiences are carrying more weight. A good café, a low-key event, a local market, or a neighbourhood walk now feels more valuable than an overbuilt plan.</p><p>&nbsp;</p><p>That matters because it changes what gets attention. The places and events that feel easy, human, and local are often the ones people remember most — and talk about afterwards.</p>',style:{width:'600','object-fit':'contain',marginBottom:'10'},hasBorder:true,showTitle:true},
    {type:'IMAGE',index:4,title:'',imageUrl:'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200',style:{width:'600','object-fit':'cover',marginBottom:'12'},showTitle:false},
    {type:'AI_ARTICLE',index:5,title:'🌟 Community Spotlight',promptOutPut:'<p><strong>One of the best things about Calgary is that so much of its momentum still comes from regular people.</strong></p><p>&nbsp;</p><p>Not polished campaigns. Not institutions trying to look community-minded. Actual people deciding to host something, gather people, support a cause, or create space where there wasn’t much before.</p><p>&nbsp;</p><p>The city benefits from that kind of initiative constantly, even when it doesn’t always name it clearly. Community life gets stronger every time someone chooses to organize, welcome, promote, or simply keep showing up.</p><p>&nbsp;</p><p>That’s the kind of contribution worth spotlighting here.</p>',style:{width:'600','object-fit':'contain',marginBottom:'10'},showTitle:true},
    {type:'CUSTOM_COMBO',index:6,title:'<p>📅 What’s Happening This Week</p>',promptOutPut:'<p><strong>If you’re deciding what’s worth doing this week, start simple.</strong></p><p>&nbsp;</p><p>Look for the things that make the city feel more alive without asking for too much effort: neighbourhood events, small creative gatherings, local shopping moments, casual meetups, and family-friendly outings that feel easy to say yes to.</p><p>&nbsp;</p><p>That’s usually where Calgary is at its best — not necessarily in the biggest event on the calendar, but in the places where people can actually linger, talk, discover something, and feel connected to where they live.</p>',style:{width:'600','object-fit':'contain',marginBottom:'10'},hasBorder:true,showTitle:true},
    {type:'IMAGE',index:7,title:'',imageUrl:'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200',style:{width:'600','object-fit':'cover',marginBottom:'12'},showTitle:false},
    {type:'AI_ARTICLE',index:8,title:'❤️ Local Love',promptOutPut:'<p><strong>Every city has places people recommend with a certain tone in their voice.</strong></p><p>&nbsp;</p><p>Not because those places are the loudest or trendiest, but because they’ve earned loyalty the old-fashioned way: through consistency, atmosphere, and the feeling they give people when they walk in.</p><p>&nbsp;</p><p>Those places are part of Calgary’s character. They make neighbourhoods feel distinct. They give people their own version of “our spot.” And they often become the backdrop for the kinds of everyday moments that make a city feel personal.</p>',style:{width:'600','object-fit':'contain',marginBottom:'10'},showTitle:true},
    {type:'IMAGE',index:9,title:'',imageUrl:'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200',style:{width:'600','object-fit':'cover',marginBottom:'12'},showTitle:false},
    {type:'AI_ARTICLE',index:10,title:'🙌 Good News / City Pride',promptOutPut:'<p><strong>Good city energy is often cumulative.</strong></p><p>&nbsp;</p><p>It builds when enough people keep contributing to the same direction — supporting local, showing up in person, helping something small succeed, or sharing what deserves attention instead of only what’s wrong.</p><p>&nbsp;</p><p>Calgary has more of that energy than it sometimes gets credit for. The challenge is less about whether it exists and more about whether people pause long enough to notice it.</p><p>&nbsp;</p><p>That’s part of what this publication should keep doing: noticing the city in a way that feels useful, grounded, and worth returning to.</p>',style:{width:'600','object-fit':'contain',marginBottom:'10'},showTitle:true},
    {type:'AI_ARTICLE',index:11,title:'📣 Get Involved',promptOutPut:'<p><strong>Stampede City Buzz gets better when it reflects what locals are actually seeing and caring about.</strong></p><p>&nbsp;</p><p>If there’s a neighbourhood event worth mentioning, a business people should know about, a local space you think deserves more attention, or someone doing community-minded work, send it in.</p><p>&nbsp;</p><p>The goal isn’t just to publish at people. It’s to build a better local read over time — one that gets smarter, more relevant, and more connected with every issue.</p>',style:{width:'600','object-fit':'contain',marginBottom:'10'},showTitle:true},
    {type:'ARTICLE_CUE',index:12,title:'Featured Article Cue 1',promptOutPut:'',articles:[],style:{marginBottom:'10'},showTitle:true},
    {type:'ARTICLE_CUE',index:13,title:'Featured Article Cue 2',promptOutPut:'',articles:[],style:{marginBottom:'10'},showTitle:true},
    {type:'ARTICLE_CUE',index:14,title:'Featured Article Cue 3',promptOutPut:'',articles:[],style:{marginBottom:'10'},showTitle:true},
    {type:'ARTICLE_CUE',index:15,title:'Featured Article Cue 4',promptOutPut:'',articles:[],style:{marginBottom:'10'},showTitle:true}
  ];
  const createdSections=[];
  for(const s of sections){const r=await addSection(newsletterId,s); createdSections.push({id:r.data&&r.data._id,type:r.data&&r.data.type,title:r.data&&r.data.title,status:r.status});}
  const counts={
    draftNews:(await req(`/newsletters-storage/${storageId}/newsletters?state=DRAFT&type=NEWSLETTER`,'GET',{})).data.length,
    publishedNews:(await req(`/newsletters-storage/${storageId}/newsletters?state=PUBLISHED&type=NEWSLETTER`,'GET',{})).data.length,
    draftArticles:(await req(`/newsletters-storage/${storageId}/newsletters?state=DRAFT&type=ARTICLE`,'GET',{})).data.length,
    publishedArticles:(await req(`/newsletters-storage/${storageId}/newsletters?state=PUBLISHED&type=ARTICLE`,'GET',{})).data.length,
  };
  console.log(JSON.stringify({newsletterId,deletedOld:del.status,articleResults,counts,sectionCount:createdSections.length},null,2));
})();
