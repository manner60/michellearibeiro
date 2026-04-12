const https = require('https');

const LETTERMAN_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWFlMjIyODQ3ODcyYjI4YjRkNDJkZGQiLCJrZXkiOiIyYWNiOWZlNjk0OWQ1MWIyODdmMjY2ZGM2ZDVjNzZmZiIsImlkIjoiNjlhZjY0NWE0Nzg3MmIyOGI0ZDY2MGZhIiwiaWF0IjoxNzczMTAyMTcwLCJleHAiOjE4MDQ2MzgxNzB9.kPubZoPK9GrJEHTMz0RAKQAhdKYYEEgP_Nbo_7iAdgA';
const ARTICLE_ID = '69c6ff4937ba49fb69a45362';

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
  // Get current sections
  const sectionsResult = await makeRequest(`/newsletters/${ARTICLE_ID}/sections`, 'GET', {});
  const sections = sectionsResult.data;
  
  console.log('Found sections:', sections.length);
  
  // Update each section with images
  for (const section of sections) {
    console.log(`\nUpdating section: ${section.title} (${section.type})`);
    
    let updateData = {};
    
    switch(section.type) {
      case 'HEADLINE_COMBO':
        updateData = {
          title: section.title,
          promptOutPut: section.promptOutPut,
          imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200" // Calgary skyline/business district
        };
        break;
        
      case 'TEXT':
        if (section.title.includes('WEEKLY BUZZ')) {
          updateData = {
            title: section.title,
            promptOutPut: section.promptOutPut,
            imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600" // Business meeting/news
          };
        } else if (section.title.includes('COMMUNITY')) {
          updateData = {
            title: section.title,
            promptOutPut: section.promptOutPut,
            imageUrl: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600" // Business community
          };
        }
        break;
        
      case 'BULLETS':
        // Growth Tip section - add image
        updateData = {
          title: section.title,
          promptOutPut: section.promptOutPut,
          imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600", // Google/search/growth
          points: section.points || []
        };
        break;
        
      case 'ARTICLE_SUMMARY':
        // Business Spotlight - coffee shop image
        updateData = {
          title: section.title,
          promptOutPut: section.promptOutPut,
          imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600", // Coffee shop
          articles: [{
            title: "The Rustic Bean Coffee House",
            description: "How 6 months of pre-launch marketing built a 200-person opening day line",
            imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400"
          }]
        };
        break;
        
      case 'FEATURED':
        // Tool of the Week - Canva/design image
        updateData = {
          title: section.title,
          promptOutPut: section.promptOutPut,
          imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600" // Design/branding
        };
        break;
        
      case 'LINK_SUMMARY':
        // Opportunities - money/grants image
        updateData = {
          title: section.title,
          promptOutPut: section.promptOutPut,
          imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600", // Money/finance
          links: section.links || []
        };
        break;
    }
    
    if (Object.keys(updateData).length > 0) {
      const result = await makeRequest(`/newsletters/${ARTICLE_ID}/sections/${section._id}`, 'PUT', updateData);
      console.log('Update status:', result.status);
    }
  }
  
  console.log('\n✅ All sections updated with images!');
}

updateSections().catch(console.error);
