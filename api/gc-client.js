const https = require('https');

const GC_BASE = 'https://rest.gohighlevel.com/v1';

function gcRequest(path, method, data, apiKey) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null;
    const options = {
      hostname: 'rest.gohighlevel.com',
      path: `/v1${path}`,
      method: method,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    };
    
    if (postData) {
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ raw: data });
        }
      });
    });
    
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function createContact(email, name, apiKey, tags = []) {
  const [firstName, ...lastNameParts] = (name || '').split(' ');
  const lastName = lastNameParts.join(' ') || '';
  
  const data = {
    email: email,
    firstName: firstName || '',
    lastName: lastName,
    tags: tags
  };
  
  return gcRequest('/contacts/', 'POST', data, apiKey);
}

async function addTag(contactId, tag, apiKey) {
  return gcRequest(`/contacts/${contactId}/tags/`, 'POST', { tag: tag }, apiKey);
}

module.exports = { createContact, addTag };
