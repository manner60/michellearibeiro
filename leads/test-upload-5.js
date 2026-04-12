#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

const GHL_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IjdvTzlMY1o0RXlZUENBdVU5d2RIIiwidmVyc2lvbiI6MSwiaWF0IjoxNzczMTgxMjQ5ODMxLCJzdWIiOiJmaVVFQklGNGFCMEN6RFAzampFWCJ9.H0YUECZV2moP8YzTh5TPKVuKJSTVPooSxeNTlKSmvLQ';
const CSV_FILE = path.join(__dirname, 'restaurant-leads-updated.csv');
const TEST_COUNT = 5;

// Parse CSV
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  const rows = [];
  for (let i = 1; i < lines.length && i <= TEST_COUNT; i++) {
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

// Map CSV to GHL contact
function mapToGHLContact(row) {
  // Split name into first/last
  const nameParts = row.name ? row.name.split(' ') : [''];
  const firstName = nameParts.slice(0, -1).join(' ') || row.name || '';
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
  
  const contact = {
    // Standard GHL fields
    firstName: firstName,
    lastName: lastName,
    name: row.name || '',
    email: row.email || '',
    phone: row.phone || '',
    address1: row.address || '',
    city: row.city || '',
    state: row.state || '',
    postalCode: row.zip || '',
    country: row.country || 'US',
    website: row.website || '',
    source: 'FICA Campaign Import',
    tags: ['Restaurant', 'FICA Prospect', row.search_city || ''].filter(Boolean)
  };
  
  // Custom fields - only include if they have values
  const customFields = [];
  
  const customFieldMappings = {
    'category': row.category,
    'facebook_url': row.facebook_url,
    'instagram_url': row.instagram_url,
    'twitter_url': row.twitter_url,
    'linkedin_url': row.linkedin_url,
    'googlestars': row.googlestars,
    'googlereviewscount': row.googlereviewscount,
    'yelpstars': row.yelpstars,
    'yelpreviewscount': row.yelpreviewscount,
    'instagram_followers': row.instagram_followers,
    'instagram_name': row.instagram_name,
    'search_city': row.search_city
  };
  
  for (const [key, value] of Object.entries(customFieldMappings)) {
    if (value && value.trim()) {
      customFields.push({ key, value });
    }
  }
  
  if (customFields.length > 0) {
    contact.customField = customFields;
  }
  
  return contact;
}

// Upload single contact
async function uploadContact(contact, num) {
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
          console.log(`✅ ${num}/${TEST_COUNT}: ${contact.name} - SUCCESS`);
          resolve({ success: true, data: responseData });
        } else {
          console.error(`❌ ${num}/${TEST_COUNT}: ${contact.name} - FAILED (${res.statusCode})`);
          console.error(`Response: ${responseData.substring(0, 300)}`);
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

// Main
async function main() {
  console.log(`🧪 TEST UPLOAD - First ${TEST_COUNT} contacts\n`);
  
  console.log('📖 Reading CSV...');
  const leads = parseCSV(CSV_FILE);
  console.log(`✅ Loaded ${leads.length} test leads\n`);
  
  console.log('🔄 Converting to GHL format...');
  const contacts = leads.map(mapToGHLContact);
  
  console.log(`\n📋 Sample contact structure:`);
  console.log(JSON.stringify(contacts[0], null, 2));
  console.log(`\n⏳ Starting test upload...\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < contacts.length; i++) {
    const result = await uploadContact(contacts[i], i + 1);
    
    if (result.success) {
      successCount++;
    } else {
      failCount++;
    }
    
    // Wait 500ms between uploads
    if (i < contacts.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  console.log(`\n✨ Test Complete!\n`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  
  if (successCount === TEST_COUNT) {
    console.log(`\n🎉 All test uploads successful! Ready to upload all 11,497 leads.`);
  } else {
    console.log(`\n⚠️ Some uploads failed. Review errors above before full upload.`);
  }
}

main().catch(console.error);
