/**
 * PopLinks Manager - Credentials Library
 * 
 * Provides credential loading and validation for all commands.
 * Automatically prompts user if credentials are missing or invalid.
 * 
 * Usage:
 *   const { loadCredentials } = require('./lib-credentials');
 *   
 *   async function myCommand() {
 *     const creds = await loadCredentials();
 *     // Use creds.API_TOKEN, creds.DEFAULT_DOMAIN_ID, etc.
 *   }
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials', 'poplinks-api.txt');
const SETUP_GUIDE = 'skills/poplinks-manager/SETUP.md';

/**
 * Parse credentials file
 */
function parseCredentials(content) {
  const creds = {};
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      // Skip empty or placeholder values
      if (value && !value.includes('your_') && !value.includes('YOUR_')) {
        creds[key.trim()] = value;
      }
    }
  }
  
  return creds;
}

/**
 * Show setup instructions
 */
function showSetupInstructions() {
  console.error('\n' + '='.repeat(60));
  console.error('⚠️  CREDENTIALS NOT CONFIGURED');
  console.error('='.repeat(60));
  console.error('\nPopLinks Manager needs API credentials to work.\n');
  
  console.error('📋 Quick Setup (Recommended):');
  console.error('   1. Run the setup wizard:');
  console.error('      bash setup.sh        (Linux/Mac)');
  console.error('      powershell setup.ps1 (Windows)\n');
  
  console.error('📖 Manual Setup:');
  console.error('   1. Read the setup guide:');
  console.error(`      cat ${SETUP_GUIDE}\n`);
  console.error('   2. Copy the template:');
  console.error('      cp skills/poplinks-manager/credentials.template.txt \\');
  console.error('         credentials/poplinks-api.txt\n');
  console.error('   3. Edit and fill in your values:');
  console.error(`      nano ${CREDENTIALS_PATH}\n`);
  
  console.error('❓ Need help getting credentials?');
  console.error('   • API Token: PopLinks Dashboard → Settings → API Access');
  console.error('   • Domain ID: See SETUP.md Step 2');
  console.error('   • Category ID: See SETUP.md Step 3 (optional)\n');
  
  console.error('='.repeat(60) + '\n');
}

/**
 * Prompt user for missing credential
 */
async function promptForCredential(fieldName, description) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question(`${description}: `, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

/**
 * Interactive credential setup
 */
async function interactiveSetup() {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 PopLinks Manager - Quick Setup');
  console.log('='.repeat(60) + '\n');
  
  console.log('This wizard will help you set up your credentials.\n');
  console.log('💡 Tip: See SETUP.md for detailed instructions on getting these values.\n');
  
  // Get API token
  console.log('1️⃣  API Token');
  console.log('   Get from: PopLinks Dashboard → Settings → API Access\n');
  const apiToken = await promptForCredential('API_TOKEN', 'Enter your API Token');
  
  if (!apiToken) {
    console.error('\n❌ API Token is required. Exiting.\n');
    return null;
  }
  
  // Get domain ID
  console.log('\n2️⃣  Domain ID');
  console.log('   Run this to see your domains:');
  console.log(`   curl -H "Authorization: Bearer ${apiToken.substring(0, 10)}..." \\`);
  console.log('        https://api.poplinks.io/api/ai/domains\n');
  const domainId = await promptForCredential('DEFAULT_DOMAIN_ID', 'Enter your default Domain ID');
  
  if (!domainId) {
    console.error('\n❌ Domain ID is required. Exiting.\n');
    return null;
  }
  
  // Get category ID (optional)
  console.log('\n3️⃣  Category ID (Optional - press Enter to skip)');
  const categoryId = await promptForCredential('DEFAULT_CATEGORY_ID', 'Enter your default Category ID');
  
  // Create credentials file
  const credContent = `# PopLinks API Credentials
# Generated: ${new Date().toISOString()}

API_TOKEN=${apiToken}
DEFAULT_DOMAIN_ID=${domainId}
DEFAULT_CATEGORY_ID=${categoryId || 'null'}
DEFAULT_LEADPAGE_TEMPLATE=5
DEFAULT_BRIDGEPAGE_TEMPLATE=3
`;
  
  // Ensure credentials directory exists
  const credDir = path.dirname(CREDENTIALS_PATH);
  if (!fs.existsSync(credDir)) {
    fs.mkdirSync(credDir, { recursive: true });
  }
  
  // Write credentials
  fs.writeFileSync(CREDENTIALS_PATH, credContent, 'utf8');
  
  console.log('\n✅ Credentials saved to:', CREDENTIALS_PATH);
  console.log('\n🔒 Security reminder:');
  console.log('   • Never commit credentials to git');
  console.log('   • Never share your API token publicly\n');
  
  return parseCredentials(credContent);
}

/**
 * Load credentials with automatic setup prompt
 * 
 * @param {boolean} interactive - If true, prompts user interactively when missing
 * @returns {Promise<Object>} Credentials object
 */
async function loadCredentials(interactive = true) {
  // Check if credentials file exists
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    if (!interactive) {
      showSetupInstructions();
      throw new Error('Credentials not configured');
    }
    
    console.log('\n📋 Credentials file not found. Let\'s set it up!\n');
    const creds = await interactiveSetup();
    
    if (!creds) {
      throw new Error('Setup cancelled');
    }
    
    return creds;
  }
  
  // Read and parse credentials
  const content = fs.readFileSync(CREDENTIALS_PATH, 'utf8');
  const creds = parseCredentials(content);
  
  // Check required fields
  const missing = [];
  
  if (!creds.API_TOKEN) missing.push('API_TOKEN');
  if (!creds.DEFAULT_DOMAIN_ID) missing.push('DEFAULT_DOMAIN_ID');
  
  if (missing.length > 0) {
    if (!interactive) {
      showSetupInstructions();
      throw new Error(`Missing required credentials: ${missing.join(', ')}`);
    }
    
    console.log('\n⚠️  Some credentials are missing or invalid.\n');
    console.log('Would you like to set up now? (y/n)');
    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    return new Promise((resolve, reject) => {
      rl.question('> ', async (answer) => {
        rl.close();
        
        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
          const newCreds = await interactiveSetup();
          if (!newCreds) {
            reject(new Error('Setup cancelled'));
          } else {
            resolve(newCreds);
          }
        } else {
          showSetupInstructions();
          reject(new Error('Credentials not configured'));
        }
      });
    });
  }
  
  return creds;
}

/**
 * Test API connection
 */
async function testConnection(apiToken) {
  try {
    const https = require('https');
    const url = 'https://api.poplinks.io/api/ai/me';
    
    return new Promise((resolve) => {
      const req = https.get(url, {
        headers: { 'Authorization': `Bearer ${apiToken}` }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            try {
              const parsed = JSON.parse(data);
              resolve({ success: true, data: parsed });
            } catch {
              resolve({ success: false, error: 'Invalid response' });
            }
          } else {
            resolve({ success: false, error: `HTTP ${res.statusCode}` });
          }
        });
      });
      
      req.on('error', (err) => {
        resolve({ success: false, error: err.message });
      });
      
      req.end();
    });
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Load credentials and validate API connection
 */
async function loadAndValidate(interactive = true) {
  const creds = await loadCredentials(interactive);
  
  // Test connection
  const result = await testConnection(creds.API_TOKEN);
  
  if (!result.success) {
    console.error('\n❌ API Connection Failed:', result.error);
    console.error('\nYour API token may be invalid or expired.');
    console.error('Please regenerate from: PopLinks Dashboard → Settings → API Access\n');
    throw new Error('API connection failed');
  }
  
  return creds;
}

module.exports = {
  loadCredentials,
  loadAndValidate,
  testConnection,
  parseCredentials,
  CREDENTIALS_PATH
};
