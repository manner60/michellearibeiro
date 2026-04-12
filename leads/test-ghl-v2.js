#!/usr/bin/env node

const https = require('https');

const GHL_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IjdvTzlMY1o0RXlZUENBdVU5d2RIIiwidmVyc2lvbiI6MSwiaWF0IjoxNzczMTgxMjQ5ODMxLCJzdWIiOiJmaVVFQklGNGFCMEN6RFAzampFWCJ9.H0YUECZV2moP8YzTh5TPKVuKJSTVPooSxeNTlKSmvLQ';

// Try GET request first to test auth
const options = {
  hostname: 'services.leadconnectorhq.com',
  path: '/contacts/?locationId=7oO9LcZ4EyYPCAuU9wdH&limit=1',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${GHL_API_KEY}`,
    'Version': '2021-07-28',
    'Accept': 'application/json'
  }
};

console.log('🔍 Testing GHL API (GET contacts)...\n');

const req = https.request(options, (res) => {
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Response: ${responseData.substring(0, 500)}\n`);
    
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log('✅ GHL API authenticated successfully!');
    } else {
      console.log('❌ Authentication failed');
      console.log('\nTroubleshooting tips:');
      console.log('1. Make sure this is a Location API Key (not Agency)');
      console.log('2. Check that the key has Contacts permission');
      console.log('3. Verify Location ID matches: 7oO9LcZ4EyYPCAuU9wdH');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Connection error:', error);
});

req.end();
