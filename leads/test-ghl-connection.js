#!/usr/bin/env node

const https = require('https');

const GHL_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IjdvTzlMY1o0RXlZUENBdVU5d2RIIiwidmVyc2lvbiI6MSwiaWF0IjoxNzczMTgxMjQ5ODMxLCJzdWIiOiJmaVVFQklGNGFCMEN6RFAzampFWCJ9.H0YUECZV2moP8YzTh5TPKVuKJSTVPooSxeNTlKSmvLQ';
const LOCATION_ID = '7oO9LcZ4EyYPCAuU9wdH';

// Test contact
const testContact = {
  firstName: 'Test',
  lastName: 'Restaurant',
  email: 'test@example.com',
  phone: '+17135551234',
  address1: '123 Main St',
  city: 'Houston',
  state: 'TX',
  postalCode: '77002',
  country: 'US',
  tags: ['FICA Test']
};

const data = JSON.stringify(testContact);

const options = {
  hostname: 'services.leadconnectorhq.com',
  path: `/contacts/`,
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${GHL_API_KEY}`,
    'Content-Type': 'application/json',
    'Version': '2021-07-28'
  }
};

console.log('🔍 Testing GHL API connection...\n');

const req = https.request(options, (res) => {
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Response: ${responseData}\n`);
    
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log('✅ GHL API connection successful!');
      console.log('Ready to upload your 11,497 restaurant leads.');
    } else {
      console.log('❌ GHL API error - needs troubleshooting before bulk upload');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Connection error:', error);
});

req.write(data);
req.end();
