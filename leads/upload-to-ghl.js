#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

// GHL Configuration
const GHL_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IjdvTzlMY1o0RXlZUENBdVU5d2RIIiwidmVyc2lvbiI6MSwiaWF0IjoxNzczMTgxMjQ5ODMxLCJzdWIiOiJmaVVFQklGNGFCMEN6RFAzampFWCJ9.H0YUECZV2moP8YzTh5TPKVuKJSTVPooSxeNTlKSmvLQ';
const LOCATION_ID = '7oO9LcZ4EyYPCAuU9wdH';
const CSV_FILE = path.join(__dirname, 'restaurant-leads.csv');
const BATCH_SIZE = 1; // Upload one at a time for v1 API
const DELAY_MS = 500; // 500ms between requests to respect rate limits

// Parse CSV
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let char of lines[i]) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    const row = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx] || '';
    });
    rows.push(row);
  }
  
  return rows;
}

// Map CSV row to GHL contact
function mapToGHLContact(row) {
  const contact = {
    firstName: row.name ? row.name.split(' ').slice(0, -1).join(' ') || row.name : '',
    lastName: row.name ? row.name.split(' ').slice(-1)[0] || '' : '',
    name: row.name || '',
    email: row.email || '',
    phone: row.phone || '',
    address1: row.address || '',
    city: row.city || '',
    state: row.region || '',
    postalCode: row.zip || '',
    country: row.country || 'US',
    website: row.website || '',
    source: 'FICA Campaign Import',
    tags: ['Restaurant', 'FICA Prospect'],
    customFields: [
      { key: 'category', value: row.category || '' },
      { key: 'google_rating', value: row.googlestars || '' },
      { key: 'google_reviews', value: row.googlereviewscount || '' },
      { key: 'yelp_rating', value: row.yelpstars || '' },
      { key: 'facebook_url', value: row.facebook || '' },
      { key: 'instagram_url', value: row.instagram || '' },
      { key: 'instagram_followers', value: row.instagram_followers || '' },
      { key: 'search_city', value: row.search_city || '' }
    ]
  };
  
  return contact;
}

// Upload single contact to GHL
async function uploadContact(contact, contactNum, total) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(contact);
    
    const options = {
      hostname: 'rest.gohighlevel.com',
      path: `/v1/contacts/`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GHL_API_KEY}`,
        'Content-Type': 'application/json'
      }
    };
    
    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`✅ ${contactNum}/${total}: ${contact.name}`);
          resolve({ success: true, data: responseData });
        } else {
          console.error(`❌ ${contactNum}/${total}: ${contact.name} - ${res.statusCode}`);
          console.error(responseData.substring(0, 200));
          resolve({ success: false, error: responseData });
        }
      });
    });
    
    req.on('error', (error) => {
      console.error(`❌ Request error for ${contact.name}:`, error);
      reject(error);
    });
    
    req.write(data);
    req.end();
  });
}

// Main function
async function main() {
  console.log('🚀 Starting GHL Upload Process...\n');
  
  console.log('📖 Reading CSV file...');
  const leads = parseCSV(CSV_FILE);
  console.log(`✅ Found ${leads.length} leads\n`);
  
  console.log('🔄 Converting to GHL format...');
  const contacts = leads.map(mapToGHLContact);
  
  console.log(`📤 Uploading ${contacts.length} contacts (500ms delay between each)...\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < contacts.length; i++) {
    const result = await uploadContact(contacts[i], i + 1, contacts.length);
    
    if (result.success) {
      successCount++;
    } else {
      failCount++;
    }
    
    // Wait between requests
    if (i < contacts.length - 1) {
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    }
    
    // Progress update every 100 contacts
    if ((i + 1) % 100 === 0) {
      console.log(`\n📊 Progress: ${i + 1}/${contacts.length} (${Math.round((i + 1) / contacts.length * 100)}%)\n`);
    }
  }
  
  console.log('\n✨ Upload Complete!\n');
  console.log(`✅ Successfully uploaded: ${successCount} contacts`);
  if (failCount > 0) {
    console.log(`❌ Failed: ${failCount} contacts`);
  }
}

// Run
main().catch(console.error);
