#!/usr/bin/env node
/**
 * FICA Batch Tagging - Global Control API
 * Tags contacts with 'mrm-fica' but not 'fica prospect'
 * Handles pagination for large contact lists
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  apiKey: '4a83641a5205fb631b9032c9fe66b48aab190fb1d37afdf99660882e3c1ed474',
  baseUrl: 'https://api.globalcontrol.io',
  sourceTagName: 'mrm-fica',
  targetTagName: 'fica prospect',
  batchSize: 50
};

function apiGet(endpoint) {
  const cmd = `curl -s -H "X-API-KEY: ${CONFIG.apiKey}" "${CONFIG.baseUrl}${endpoint}"`;
  const result = execSync(cmd, { encoding: 'utf8', timeout: 30000 });
  const parsed = JSON.parse(result);
  return parsed.type === 'response' ? parsed.data : parsed;
}

function apiPost(endpoint, data) {
  const tempFile = path.join('/tmp', `api-post-${Date.now()}.json`);
  fs.writeFileSync(tempFile, JSON.stringify(data), 'utf8');
  
  try {
    const cmd = `curl -s -X POST -H "X-API-KEY: ${CONFIG.apiKey}" -H "Content-Type: application/json" --data-binary "@${tempFile}" "${CONFIG.baseUrl}${endpoint}"`;
    const result = execSync(cmd, { encoding: 'utf8', timeout: 30000 });
    fs.unlinkSync(tempFile);
    try {
      return JSON.parse(result);
    } catch (e) {
      return { success: true, raw: result };
    }
  } catch (error) {
    try { fs.unlinkSync(tempFile); } catch (e) {}
    throw error;
  }
}

async function getAllTags() {
  console.log(`[${new Date().toISOString()}] Fetching tags...`);
  const data = apiGet('/api/ai/tags');
  
  if (!Array.isArray(data)) {
    throw new Error('Failed to fetch tags: ' + JSON.stringify(data).substring(0, 200));
  }
  
  const tagMap = {};
  data.forEach(tag => {
    tagMap[tag._id] = tag.name;
    tagMap[tag.name] = tag._id;
  });
  
  console.log(`Found ${data.length} tags`);
  console.log(`Source tag '${CONFIG.sourceTagName}': ${tagMap[CONFIG.sourceTagName] || 'NOT FOUND'}`);
  console.log(`Target tag '${CONFIG.targetTagName}': ${tagMap[CONFIG.targetTagName] || 'NOT FOUND'}`);
  
  return tagMap;
}

async function getAllContacts() {
  const allContacts = [];
  let page = 1;
  let hasMore = true;
  
  console.log(`\n[${new Date().toISOString()}] Fetching contacts (paginated)...`);
  
  while (hasMore && page <= 50) { // Safety limit
    const data = apiGet(`/api/ai/contacts?page=${page}&limit=100`);
    
    if (!data || !data.contacts || !Array.isArray(data.contacts)) {
      console.log(`Page ${page}: No contacts data`);
      break;
    }
    
    const contacts = data.contacts;
    console.log(`Page ${page}: Retrieved ${contacts.length} contacts`);
    
    if (contacts.length === 0) {
      hasMore = false;
      break;
    }
    
    allContacts.push(...contacts);
    
    if (contacts.length < 100) {
      hasMore = false;
    } else {
      page++;
    }
  }
  
  console.log(`Total contacts fetched: ${allContacts.length}`);
  return allContacts;
}

function filterEligibleContacts(contacts, sourceTagId, targetTagId) {
  const eligible = contacts.filter(contact => {
    const tagIds = contact.tags || [];
    
    const hasSource = tagIds.includes(sourceTagId);
    const hasTarget = tagIds.includes(targetTagId);
    
    return hasSource && !hasTarget;
  });
  
  console.log(`\nEligible contacts (has '${CONFIG.sourceTagName}', no '${CONFIG.targetTagName}'): ${eligible.length}`);
  return eligible.slice(0, CONFIG.batchSize);
}

async function tagContact(contact, tagId) {
  const payload = {
    email: contact.email,
    firstName: contact.firstName || '',
    lastName: contact.lastName || ''
  };
  
  try {
    const result = apiPost(`/api/ai/tags/fire-tag/${tagId}`, payload);
    return { success: true, result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log(`[${new Date().toISOString()}] Starting FICA batch tagging...`);
  console.log(`Source tag: ${CONFIG.sourceTagName}`);
  console.log(`Target tag: ${CONFIG.targetTagName}`);
  console.log(`Batch size: ${CONFIG.batchSize}`);
  console.log('---');
  
  try {
    // Step 1: Get tag mappings
    const tagMap = await getAllTags();
    const sourceTagId = tagMap[CONFIG.sourceTagName];
    const targetTagId = tagMap[CONFIG.targetTagName];
    
    if (!sourceTagId) {
      throw new Error(`Source tag '${CONFIG.sourceTagName}' not found`);
    }
    if (!targetTagId) {
      throw new Error(`Target tag '${CONFIG.targetTagName}' not found`);
    }
    
    // Step 2: Get all contacts (paginated)
    const allContacts = await getAllContacts();
    
    // Step 3: Filter eligible contacts
    const eligible = filterEligibleContacts(allContacts, sourceTagId, targetTagId);
    
    if (eligible.length === 0) {
      console.log('\nNo eligible contacts found for tagging.');
      return;
    }
    
    // Step 4: Tag contacts
    console.log(`\n[${new Date().toISOString()}] Tagging ${eligible.length} contacts...`);
    
    const results = [];
    for (let i = 0; i < eligible.length; i++) {
      const contact = eligible[i];
      const name = `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || contact.email;
      
      process.stdout.write(`[${i + 1}/${eligible.length}] ${contact.email}... `);
      
      const result = await tagContact(contact, targetTagId);
      results.push({
        email: contact.email,
        name: name,
        success: result.success,
        error: result.error
      });
      
      process.stdout.write(result.success ? '✓\n' : `✗ (${result.error})\n`);
      
      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 300));
    }
    
    // Summary
    const successful = results.filter(r => r.success);
    console.log('\n--- SUMMARY ---');
    console.log(`Total processed: ${results.length}`);
    console.log(`Successfully tagged: ${successful.length}`);
    console.log(`Failed: ${results.length - successful.length}`);
    
    if (successful.length > 0) {
      console.log('\nTagged contacts:');
      successful.forEach(r => console.log(`  ✓ ${r.name} (${r.email})`));
    }
    
  } catch (error) {
    console.error(`\n[ERROR] ${error.message}`);
    process.exit(1);
  }
}

main();
