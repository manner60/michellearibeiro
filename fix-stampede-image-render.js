const fs=require('fs'); const https=require('https');
const api=fs.readFileSync('/root/.openclaw/workspace/credentials/titanium-api-keys.txt','utf8').match(/Letterman:\s*(\S+)/)[1];
const newsletterId='69d13ced37ba49fb69b3d623';
const updates=[
  {
    id:'69d13f0537ba49fb69b3dc7c',
    body:{
      title:'👋 Welcome to Stampede City Buzz',
      promptOutPut:'<p><strong>Welcome to the very first issue of Stampede City Buzz</strong> — a community-first roundup of what’s happening, who’s making a difference, and where Calgary is showing its best side.</p><p>&nbsp;</p><p>This is a local pulse check: neighbourhood energy, community wins, events worth showing up for, and the people quietly making Calgary feel more connected.</p><p>&nbsp;</p><p>If you love Calgary and want one simple way to stay in the loop, you’re in the right place.</p>',
      imageUrl:'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1400',
      includeImage:true,
      showTitle:true,
      style:{width:'600','object-fit':'cover',marginBottom:'14'}
    }
  },
  {
    id:'69d13f0637ba49fb69b3dc83',
    body:{
      title:'<p>🐝 This Week in Calgary</p>',
      subTitle:'Local energy is picking up again',
      promptOutPut:'<p><strong>Spring is finally starting to wake the city up.</strong> Community markets are coming back, neighborhood patios are preparing to open, and event calendars are filling up again.</p><p>&nbsp;</p><p><strong>Local momentum is shifting back to in-person connection.</strong> Smaller community events, vendor pop-ups, family activities, and grassroots gatherings are getting more attention.</p><p>&nbsp;</p><p><strong>Neighbourhood pride is on the rise.</strong> More local groups are spotlighting hidden gems, supporting small initiatives, and creating tighter hyper-local networks.</p>',
      imageUrl:'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200',
      includeImage:true,
      hasBorder:true,
      showTitle:true,
      blockTitle:'<p style="color: #00D264; font-weight: bold;">CALGARY NOW</p>',
      showBlockTitle:true,
      style:{width:'600','object-fit':'cover',marginBottom:'14'}
    }
  },
  {
    id:'69d13f0637ba49fb69b3dc8a',
    body:{
      title:'🌟 Community Spotlight',
      promptOutPut:'<p><strong>The people who build community rarely ask for attention — but they deserve it.</strong></p><p>&nbsp;</p><p>Across Calgary, some of the most important city-building happens quietly: volunteers who organize local cleanups, market organizers who create space for makers, and neighborhood connectors who make new people feel welcome.</p><p>&nbsp;</p><p>This issue’s spotlight is for the community builders — the people who turn simple ideas into real local energy.</p>',
      imageUrl:'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200',
      includeImage:true,
      showTitle:true,
      style:{width:'600','object-fit':'cover',marginBottom:'14'}
    }
  },
  {
    id:'69d13f0737ba49fb69b3dc98',
    body:{
      title:'❤️ Local Love',
      promptOutPut:'<p><strong>There’s something special about discovering a place that feels like it belongs to the city — not just in it.</strong></p><p>&nbsp;</p><p>That could be a cozy independent coffee shop, a bookstore with personality, a locally-owned shop with loyal regulars, a family-run restaurant, or a park and pathway spot locals love but rarely advertise.</p><p>&nbsp;</p><p>The point of Stampede City Buzz is to surface more of those places.</p>',
      imageUrl:'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200',
      includeImage:true,
      showTitle:true,
      style:{width:'600','object-fit':'cover',marginBottom:'14'}
    }
  },
  {
    id:'69d13f0737ba49fb69b3dc9f',
    body:{
      title:'🙌 Good News / City Pride',
      promptOutPut:'<p>It’s easy to focus on what’s broken in a city. It takes more intention to notice what’s working.</p><p>&nbsp;</p><p>But Calgary gives us plenty to be proud of: neighbors showing up for each other, volunteers giving their time, local creators putting work into the community, small businesses taking chances, and grassroots events bringing people out.</p><p>&nbsp;</p><p>Every time someone supports local, attends a community event, helps a neighbor, or shares something worth noticing, they help shape the version of Calgary we all get to live in.</p>',
      imageUrl:'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200',
      includeImage:true,
      showTitle:true,
      style:{width:'600','object-fit':'cover',marginBottom:'14'}
    }
  }
];
function req(path,method,data){return new Promise((resolve,reject)=>{const body=JSON.stringify(data);const r=https.request({hostname:'api.letterman.ai',path:'/api/ai'+path,method,headers:{Authorization:`Bearer ${api}`,'Content-Type':'application/json','Content-Length':Buffer.byteLength(body)}},res=>{let out='';res.on('data',c=>out+=c);res.on('end',()=>{try{out=JSON.parse(out)}catch{} resolve({status:res.statusCode,data:out});});});r.on('error',reject);r.write(body);r.end();});}
(async()=>{const results=[]; for(const u of updates){results.push(await req(`/newsletters/${newsletterId}/sections/${u.id}`,'PUT',u.body));} console.log(JSON.stringify(results.map(r=>({status:r.status,id:r.data&&r.data._id,includeImage:r.data&&r.data.includeImage,imageUrl:r.data&&r.data.imageUrl,title:r.data&&r.data.title})),null,2));})();
