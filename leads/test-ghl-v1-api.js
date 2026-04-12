#!/usr/bin/env node

const https = require('https');

const GHL_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IjdvTzlMY1o0RXlZUENBdVU5d2RIIiwidmVyc2lvbiI6MSwiaWF0IjoxNzczMTgxMjQ5ODMxLCJzdWIiOiJmaVVFQklGNGFCMEN6RFAzampFWCJ9.H0YUECZV2moP8YzTh5TPKVuKJSTVPooSxeNTlKSmvLQ';
const LOCATION_ID = '7oO9LcZ4EyYPCAuU9wdH';

// Try v1 REST API
const options = {
  hostname: 'rest.gohighlevel.com',
  path: `/v1/contacts/?locationId=${LOCATION_ID}`,
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${GHL_API_KEY}`,
    'Content-Type': 'application/json'
  }
};

console.log('🔍 Testing GHL v1 REST API...\n');

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
      console.log('Ready to upload 11,497 leads!');
    } else {
      console.log('❌ Authentication failed with v1 API too');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Connection error:', error);
});

req.end();
