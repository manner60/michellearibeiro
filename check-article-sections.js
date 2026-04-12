const https = require('https');

const LETTERMAN_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWFlMjIyODQ3ODcyYjI4YjRkNDJkZGQiLCJrZXkiOiIyYWNiOWZlNjk0OWQ1MWIyODdmMjY2ZGM2ZDVjNzZmZiIsImlkIjoiNjlhZjY0NWE0Nzg3MmIyOGI0ZDY2MGZhIiwiaWF0IjoxNzczMTAyMTcwLCJleHAiOjE4MDQ2MzgxNzB9.kPubZoPK9GrJEHTMz0RAKQAhdKYYEEgP_Nbo_7iAdgA';
const ARTICLE_ID = '69c6fe0937ba49fb69a45077';

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

async function getArticleSections() {
  console.log('Fetching article sections...');
  const result = await makeRequest(`/newsletters/${ARTICLE_ID}/sections`, 'GET', {});
  console.log('Status:', result.status);
  console.log('Sections:', JSON.stringify(result.data, null, 2));
}

getArticleSections().catch(console.error);
