#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load Letterman API key
const credsPath = path.join(process.env.HOME, '.openclaw/workspace/credentials/titanium_software.txt');
const credsContent = fs.readFileSync(credsPath, 'utf-8');
const lettermanMatch = credsContent.match(/Letterman:\s*(.+)/);

if (!lettermanMatch) {
  console.error('❌ Letterman API key not found in credentials file');
  process.exit(1);
}

const LETTERMAN_API_KEY = lettermanMatch[1].trim();

// Newsletter configuration
const newsletter = {
  name: process.argv[2] || 'New Newsletter',
  subject: process.argv[3] || 'Newsletter Subject',
  from_name: process.argv[4] || 'Michelle Ribeiro',
  from_email: process.argv[5] || 'leadferret@agentmail.to',
  reply_to: process.argv[6] || 'leadferret@agentmail.to'
};

const data = JSON.stringify(newsletter);

const options = {
  hostname: 'api.letterman.app',
  path: '/v1/newsletters',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${LETTERMAN_API_KEY}`,
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('📧 Creating newsletter...\n');
console.log('Configuration:', newsletter);
console.log('');

const req = https.request(options, (res) => {
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    
    if (res.statusCode >= 200 && res.statusCode < 300) {
      const result = JSON.parse(responseData);
      console.log('✅ Newsletter created successfully!');
      console.log('ID:', result.id);
      console.log('Name:', result.name);
    } else {
      console.log('❌ Failed to create newsletter');
      console.log(responseData);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request error:', error);
});

req.write(data);
req.end();

// Usage info
if (process.argv.length < 3) {
  console.log('\nUsage: node create_newsletter.js <name> [subject] [from_name] [from_email] [reply_to]');
  console.log('Example: node create_newsletter.js "FICA Newsletter" "Your FICA Tax Credit Opportunity"');
}
