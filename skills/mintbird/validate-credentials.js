#!/usr/bin/env node

/**
 * PopLinks Manager - Credential Validator
 * 
 * Checks if credentials file exists and contains required values.
 * Prompts user to set up if missing.
 * 
 * Usage:
 *   node validate-credentials.js
 * 
 * Returns:
 *   Exit 0: Credentials valid
 *   Exit 1: Credentials missing or invalid
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials', 'poplinks-api.txt');
const REQUIRED_FIELDS = ['API_TOKEN', 'DEFAULT_DOMAIN_ID'];
const OPTIONAL_FIELDS = ['DEFAULT_CATEGORY_ID', 'DEFAULT_LEADPAGE_TEMPLATE', 'DEFAULT_BRIDGEPAGE_TEMPLATE'];

function parseCredentials(content) {
  const creds = {};
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    // Skip comments and empty lines
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      creds[key.trim()] = valueParts.join('=').trim();
    }
  }
  
  return creds;
}

function checkCredentials() {
  // Check if file exists
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error('\n❌ Credentials file not found!\n');
    console.error(`Expected location: ${CREDENTIALS_PATH}\n`);
    console.error('📋 To set up:\n');
    console.error('1. Copy the template:');
    console.error('   cp skills/poplinks-manager/credentials.template.txt credentials/poplinks-api.txt\n');
    console.error('2. Follow the setup guide:');
    console.error('   cat skills/poplinks-manager/SETUP.md\n');
    console.error('   OR run the setup wizard:');
    console.error('   bash setup.sh  (Linux/Mac)');
    console.error('   powershell setup.ps1  (Windows)\n');
    return false;
  }
  
  // Read and parse credentials
  const content = fs.readFileSync(CREDENTIALS_PATH, 'utf8');
  const creds = parseCredentials(content);
  
  // Check required fields
  const missing = [];
  const placeholder = [];
  
  for (const field of REQUIRED_FIELDS) {
    if (!creds[field]) {
      missing.push(field);
    } else if (creds[field].includes('your_') || creds[field].includes('YOUR_')) {
      placeholder.push(field);
    }
  }
  
  // Report issues
  if (missing.length > 0) {
    console.error('\n❌ Missing required credentials:\n');
    missing.forEach(field => console.error(`   - ${field}`));
    console.error('\n📋 Edit your credentials file and add these values:');
    console.error(`   ${CREDENTIALS_PATH}\n`);
    console.error('📖 See SETUP.md for instructions on how to get these values.\n');
    return false;
  }
  
  if (placeholder.length > 0) {
    console.error('\n⚠️  Credentials contain placeholder values:\n');
    placeholder.forEach(field => console.error(`   - ${field} = ${creds[field]}`));
    console.error('\n📋 Replace placeholders with your actual values:');
    console.error(`   Edit: ${CREDENTIALS_PATH}\n`);
    console.error('📖 See SETUP.md for instructions on how to get these values.\n');
    return false;
  }
  
  // All good!
  console.log('\n✅ Credentials validated!\n');
  console.log('Configuration:');
  console.log(`   API Token: ${creds.API_TOKEN.substring(0, 10)}...`);
  console.log(`   Domain ID: ${creds.DEFAULT_DOMAIN_ID}`);
  
  if (creds.DEFAULT_CATEGORY_ID && creds.DEFAULT_CATEGORY_ID !== 'null') {
    console.log(`   Category ID: ${creds.DEFAULT_CATEGORY_ID}`);
  }
  
  console.log('');
  return true;
}

async function testConnection(creds) {
  try {
    const https = require('https');
    const url = 'https://api.poplinks.io/api/ai/me';
    
    return new Promise((resolve, reject) => {
      const req = https.get(url, {
        headers: {
          'Authorization': `Bearer ${creds.API_TOKEN}`
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            const user = JSON.parse(data);
            console.log('🔗 API Connection: ✅ ONLINE');
            if (user.data && user.data.email) {
              console.log(`   Account: ${user.data.email}`);
            }
            console.log('');
            resolve(true);
          } else {
            console.error('🔗 API Connection: ❌ FAILED');
            console.error(`   Status: ${res.statusCode}`);
            console.error(`   Response: ${data.substring(0, 100)}`);
            console.error('\n⚠️  Your credentials may be invalid or expired.\n');
            resolve(false);
          }
        });
      });
      
      req.on('error', (err) => {
        console.error('🔗 API Connection: ❌ NETWORK ERROR');
        console.error(`   ${err.message}\n`);
        resolve(false);
      });
      
      req.end();
    });
  } catch (error) {
    console.error('Error testing connection:', error.message);
    return false;
  }
}

async function main() {
  console.log('PopLinks Manager - Credential Validator');
  console.log('========================================');
  
  // Check credentials file
  if (!checkCredentials()) {
    process.exit(1);
  }
  
  // Test API connection
  const content = fs.readFileSync(CREDENTIALS_PATH, 'utf8');
  const creds = parseCredentials(content);
  
  const connected = await testConnection(creds);
  
  if (!connected) {
    console.log('💡 To regenerate your API token:');
    console.log('   1. Login to PopLinks/MintBird');
    console.log('   2. Settings → API Access');
    console.log('   3. Generate new token');
    console.log('   4. Update credentials/poplinks-api.txt\n');
    process.exit(1);
  }
  
  console.log('🚀 Ready to use PopLinks Manager!\n');
  process.exit(0);
}

// Run if called directly
if (require.main === module) {
  main();
}

// Export for use in other scripts
module.exports = {
  checkCredentials,
  parseCredentials,
  CREDENTIALS_PATH
};
