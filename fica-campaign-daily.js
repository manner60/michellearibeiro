#!/usr/bin/env node
/**
 * FICA Campaign - Warm-Up Compliant Batch Tagger
 * Auto-calculates safe daily volume based on warming rules
 */

const { execSync } = require('child_process');
const fs = require('fs');

const STATE_PATH = './fica-campaign-state.json';

const CONFIG = {
  apiKey: '4a83641a5205fb631b9032c9fe66b48aab190fb1d37afdf99660882e3c1ed474',
  baseUrl: 'https://api.globalcontrol.io',
  sourceTagName: 'mrm-fica',
  targetTagName: 'fica prospect'
};

function loadState() {
  if (!fs.existsSync(STATE_PATH)) {
    throw new Error(`Missing state file: ${STATE_PATH}`);
  }
  const state = JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
  if (!Number.isInteger(state.warmupDay) || !Number.isInteger(state.currentDailyVolume)) {
    throw new Error('State file is not initialized. Set warmupDay and currentDailyVolume in fica-campaign-state.json first.');
  }
  return state;
}

function saveState(state) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + '\n', 'utf8');
}

// Warm-up scaling logic per skill
function calculateSafeVolume(state) {
  const day = state.warmupDay;
  const current = state.currentDailyVolume;
  
  let maxIncreasePerInbox;
  if (day <= 14) maxIncreasePerInbox = 5;
  else if (day <= 21) maxIncreasePerInbox = 10;
  else maxIncreasePerInbox = 15;
  
  const maxAllowedIncrease = Math.floor(current * 0.20);
  const allowedIncrease = Math.min(maxIncreasePerInbox, maxAllowedIncrease);
  const nextVolume = current + allowedIncrease;
  
  return {
    currentVolume: current,
    maxIncreasePerInbox,
    maxAllowedIncrease,
    allowedIncrease,
    nextVolume,
    totalSystemVolume: nextVolume * state.numberOfInboxes
  };
}

function apiGet(endpoint) {
  const cmd = `curl -s -H "X-API-KEY: ${CONFIG.apiKey}" "${CONFIG.baseUrl}${endpoint}"`;
  const result = execSync(cmd, { encoding: 'utf8', timeout: 30000 });
  const parsed = JSON.parse(result);
  return parsed.type === 'response' ? parsed.data : parsed;
}

function apiPost(endpoint, data) {
  const tempFile = `/tmp/api-post-${Date.now()}.json`;
  fs.writeFileSync(tempFile, JSON.stringify(data), 'utf8');
  
  try {
    const cmd = `curl -s -X POST -H "X-API-KEY: ${CONFIG.apiKey}" -H "Content-Type: application/json" --data-binary "@${tempFile}" "${CONFIG.baseUrl}${endpoint}"`;
    const result = execSync(cmd, { encoding: 'utf8', timeout: 30000 });
    fs.unlinkSync(tempFile);
    return { success: true, result };
  } catch (error) {
    try { fs.unlinkSync(tempFile); } catch (e) {}
    return { success: false, error: error.message };
  }
}

async function getTagMap() {
  const data = apiGet('/api/ai/tags');
  const map = {};
  data.forEach(tag => {
    map[tag._id] = tag.name;
    map[tag.name] = tag._id;
  });
  return map;
}

async function getEligibleContacts(sourceTagId, targetTagId, limit) {
  const allContacts = [];
  const seenEmails = new Set();
  let page = 1;
  const maxPages = 200; // Increased from 10 to 200 (20,000 contacts max)
  
  console.log(`  Scanning contacts (up to ${maxPages * 100} total)...`);
  
  while (allContacts.length < limit && page <= maxPages) {
    const data = apiGet(`/api/ai/contacts?page=${page}&limit=100`);
    if (!data || !data.contacts) break;
    
    const eligible = data.contacts.filter(c => {
      const tags = c.tags || [];
      const email = (c.email || '').trim().toLowerCase();
      if (!email) return false;
      if (!tags.includes(sourceTagId) || tags.includes(targetTagId)) return false;
      if (seenEmails.has(email)) return false;
      seenEmails.add(email);
      return true;
    });
    
    allContacts.push(...eligible);
    
    if (page % 10 === 0) {
      console.log(`    Page ${page}: ${allContacts.length} eligible found so far...`);
    }
    
    if (data.contacts.length < 100) break;
    page++;
  }
  
  if (page > maxPages) {
    console.log(`  WARNING: Reached max page limit (${maxPages}). There may be more eligible contacts.`);
  }
  
  console.log(`  Scanned ${(page - 1) * 100} contacts, found ${allContacts.length} eligible`);
  return allContacts.slice(0, limit);
}

async function tagContact(contact, tagId) {
  const payload = {
    email: contact.email,
    firstName: contact.firstName || '',
    lastName: contact.lastName || ''
  };
  return apiPost(`/api/ai/tags/fire-tag/${tagId}`, payload);
}

async function main() {
  const state = loadState();
  const today = new Date().toISOString().slice(0, 10);

  console.log(`[${new Date().toISOString()}] FICA Campaign - Warm-Up Batch Tagger`);
  console.log(`Warm-up Day: ${state.warmupDay}`);
  console.log(`List Type: ${state.listType}`);
  console.log(`Last successful run date: ${state.lastRunDate || 'none'}`);
  console.log('---');

  if (state.lastRunDate === today) {
    console.error(`ABORT: Campaign already marked successful for ${today}.`);
    process.exit(1);
  }
  
  const calc = calculateSafeVolume(state);
  console.log('SAFE VOLUME CALCULATION:');
  console.log(`  Current daily volume: ${calc.currentVolume}`);
  console.log(`  Max increase (phase-based): ${calc.maxIncreasePerInbox}`);
  console.log(`  Max increase (20% cap): ${calc.maxAllowedIncrease}`);
  console.log(`  Allowed increase: ${calc.allowedIncrease}`);
  console.log(`  → Next daily volume: ${calc.nextVolume}`);
  console.log(`  → Total system volume: ${calc.totalSystemVolume}`);
  console.log('---');
  
  // Get tags
  const tagMap = await getTagMap();
  const sourceTagId = tagMap[CONFIG.sourceTagName];
  const targetTagId = tagMap[CONFIG.targetTagName];
  
  if (!sourceTagId || !targetTagId) {
    console.error('ERROR: Required tags not found');
    process.exit(1);
  }
  
  // Get eligible contacts
  console.log(`Fetching ${calc.nextVolume} eligible contacts...`);
  const eligible = await getEligibleContacts(sourceTagId, targetTagId, calc.nextVolume);
  
  console.log(`Found ${eligible.length} eligible contacts`);
  
  if (eligible.length === 0) {
    console.log('No contacts to tag. Exiting.');
    return;
  }
  
  // Confirm before tagging (safety)
  console.log(`\nREADY TO TAG: ${eligible.length} contacts`);
  console.log('This will trigger the FICA workflow for these contacts.');
  console.log('---');
  
  // Tag contacts
  const results = [];
  for (let i = 0; i < eligible.length; i++) {
    const contact = eligible[i];
    const name = `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || contact.email;
    
    process.stdout.write(`[${i + 1}/${eligible.length}] ${contact.email}... `);
    
    const result = await tagContact(contact, targetTagId);
    results.push({ email: contact.email, name, success: result.success });
    
    process.stdout.write(result.success ? '✓\n' : `✗ (${result.error})\n`);
    await new Promise(r => setTimeout(r, 300));
  }
  
  // Summary
  const successful = results.filter(r => r.success).length;
  console.log('\n--- SUMMARY ---');
  console.log(`Tagged: ${successful}/${results.length}`);

  if (successful === results.length) {
    const nextState = {
      ...state,
      warmupDay: state.warmupDay + 1,
      currentDailyVolume: calc.nextVolume,
      lastRunDate: today,
      lastSuccessfulTagged: successful,
      lastRecommendedNextVolume: calc.nextVolume
    };
    saveState(nextState);
    console.log(`\nSTATE UPDATED:`);
    console.log(`  warmupDay: ${nextState.warmupDay}`);
    console.log(`  currentDailyVolume: ${nextState.currentDailyVolume}`);
    console.log(`  lastRunDate: ${nextState.lastRunDate}`);
  } else {
    console.log(`\nSTATE NOT UPDATED due to partial failure.`);
    console.log(`Recommended manual review before next run.`);
  }
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
