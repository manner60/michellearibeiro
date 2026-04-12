/**
 * PopLinks Manager - Example Command Implementations
 * 
 * These examples show how to use lib-credentials.js to automatically
 * handle missing credentials and prompt users when needed.
 */

const axios = require('axios');
const { loadAndValidate } = require('./lib-credentials');

const API_BASE = 'https://api.poplinks.io/api/ai';

/**
 * Example 1: List PopLinks
 * 
 * Usage: node example-commands.js list-poplinks
 */
async function listPopLinks() {
  try {
    // Automatically loads credentials, prompts if missing, validates API connection
    const creds = await loadAndValidate();
    
    console.log('📋 Fetching your PopLinks...\n');
    
    const response = await axios.get(`${API_BASE}/poplinks`, {
      headers: { 'Authorization': `Bearer ${creds.API_TOKEN}` }
    });
    
    const poplinks = response.data.data;
    
    if (poplinks.length === 0) {
      console.log('No PopLinks found. Create your first one!\n');
      return;
    }
    
    console.log(`Found ${poplinks.length} PopLink(s):\n`);
    
    poplinks.forEach((link, i) => {
      console.log(`${i + 1}. ${link.name}`);
      console.log(`   URL: ${link.visible_url}`);
      console.log(`   Destination: ${link.destination_url}`);
      console.log(`   Clicks: ${link.clicks || 0}`);
      console.log('');
    });
    
  } catch (error) {
    if (error.response) {
      console.error(`\n❌ API Error: ${error.response.status}`);
      console.error(error.response.data);
    } else {
      console.error(`\n❌ Error: ${error.message}`);
    }
    process.exit(1);
  }
}

/**
 * Example 2: Create PopLink
 * 
 * Usage: node example-commands.js create-poplink "Link Name" "https://destination.com" "slug"
 */
async function createPopLink(name, destinationUrl, slug) {
  try {
    const creds = await loadAndValidate();
    
    console.log('✨ Creating PopLink...\n');
    
    const response = await axios.post(`${API_BASE}/poplinks`, {
      name: name,
      destination_url: destinationUrl,
      visible_url: slug,
      domain_id: parseInt(creds.DEFAULT_DOMAIN_ID),
      domain_type: 'personal',
      status: 1
    }, {
      headers: {
        'Authorization': `Bearer ${creds.API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    const poplink = response.data.data;
    
    console.log('✅ PopLink created successfully!\n');
    console.log(`   Name: ${poplink.name}`);
    console.log(`   URL: ${poplink.full_url || 'yourdomain.com/' + poplink.visible_url}`);
    console.log(`   Destination: ${poplink.destination_url}\n`);
    
  } catch (error) {
    if (error.response) {
      console.error(`\n❌ Failed to create PopLink: ${error.response.status}`);
      console.error(error.response.data);
    } else {
      console.error(`\n❌ Error: ${error.message}`);
    }
    process.exit(1);
  }
}

/**
 * Example 3: List Bridge Pages
 * 
 * Usage: node example-commands.js list-bridges
 */
async function listBridgePages() {
  try {
    const creds = await loadAndValidate();
    
    console.log('📋 Fetching your Bridge Pages...\n');
    
    const response = await axios.get(`${API_BASE}/bridge-pages`, {
      headers: { 'Authorization': `Bearer ${creds.API_TOKEN}` }
    });
    
    const pages = response.data.data;
    
    if (pages.length === 0) {
      console.log('No Bridge Pages found. Create your first one!\n');
      return;
    }
    
    console.log(`Found ${pages.length} Bridge Page(s):\n`);
    
    pages.forEach((page, i) => {
      console.log(`${i + 1}. ${page.name} (ID: ${page.id})`);
      console.log(`   URL: ${page.leadpage_keyword}`);
      console.log(`   Headline: ${page.main_headline || '(not set)'}`);
      console.log(`   Views: ${page.views || 0}`);
      console.log('');
    });
    
  } catch (error) {
    if (error.response) {
      console.error(`\n❌ API Error: ${error.response.status}`);
      console.error(error.response.data);
    } else {
      console.error(`\n❌ Error: ${error.message}`);
    }
    process.exit(1);
  }
}

/**
 * Example 4: Clone Bridge Page
 * 
 * Usage: node example-commands.js clone-bridge 12345
 */
async function cloneBridgePage(pageId) {
  try {
    const creds = await loadAndValidate();
    
    console.log(`✨ Cloning Bridge Page ${pageId}...\n`);
    
    const response = await axios.post(`${API_BASE}/bridge-pages/${pageId}/clone`, {}, {
      headers: { 'Authorization': `Bearer ${creds.API_TOKEN}` }
    });
    
    const newPage = response.data.data;
    
    console.log('✅ Bridge Page cloned successfully!\n');
    console.log(`   New ID: ${newPage.id}`);
    console.log(`   Name: ${newPage.name}`);
    console.log(`   URL: ${newPage.leadpage_keyword}\n`);
    
    console.log('💡 Tip: Update the name to remove "(Copy)":');
    console.log(`   node example-commands.js rename-bridge ${newPage.id} "New Name"\n`);
    
  } catch (error) {
    if (error.response) {
      console.error(`\n❌ Failed to clone: ${error.response.status}`);
      console.error(error.response.data);
    } else {
      console.error(`\n❌ Error: ${error.message}`);
    }
    process.exit(1);
  }
}

/**
 * Example 5: Rename Bridge Page
 * 
 * Usage: node example-commands.js rename-bridge 12345 "New Name"
 */
async function renameBridgePage(pageId, newName) {
  try {
    const creds = await loadAndValidate();
    
    console.log(`✏️  Renaming Bridge Page ${pageId}...\n`);
    
    await axios.put(`${API_BASE}/bridge-pages/${pageId}/rename`, {
      name: newName
    }, {
      headers: {
        'Authorization': `Bearer ${creds.API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Bridge Page renamed successfully!\n');
    console.log(`   New Name: ${newName}\n`);
    
  } catch (error) {
    if (error.response) {
      console.error(`\n❌ Failed to rename: ${error.response.status}`);
      console.error(error.response.data);
    } else {
      console.error(`\n❌ Error: ${error.message}`);
    }
    process.exit(1);
  }
}

// CLI Router
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (!command) {
    console.log('PopLinks Manager - Example Commands\n');
    console.log('Usage: node example-commands.js <command> [args]\n');
    console.log('Commands:');
    console.log('  list-poplinks                    - List all PopLinks');
    console.log('  list-bridges                     - List all Bridge Pages');
    console.log('  create-poplink <name> <url> <slug> - Create new PopLink');
    console.log('  clone-bridge <id>                - Clone Bridge Page');
    console.log('  rename-bridge <id> <name>        - Rename Bridge Page\n');
    console.log('Example:');
    console.log('  node example-commands.js list-poplinks');
    console.log('  node example-commands.js create-poplink "Test" "https://example.com" "test"\n');
    process.exit(0);
  }
  
  switch (command) {
    case 'list-poplinks':
      await listPopLinks();
      break;
      
    case 'list-bridges':
      await listBridgePages();
      break;
      
    case 'create-poplink':
      if (args.length < 4) {
        console.error('Usage: create-poplink <name> <destination-url> <slug>');
        process.exit(1);
      }
      await createPopLink(args[1], args[2], args[3]);
      break;
      
    case 'clone-bridge':
      if (args.length < 2) {
        console.error('Usage: clone-bridge <page-id>');
        process.exit(1);
      }
      await cloneBridgePage(args[1]);
      break;
      
    case 'rename-bridge':
      if (args.length < 3) {
        console.error('Usage: rename-bridge <page-id> <new-name>');
        process.exit(1);
      }
      await renameBridgePage(args[1], args[2]);
      break;
      
    default:
      console.error(`Unknown command: ${command}`);
      console.error('Run without arguments to see available commands.');
      process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  });
}

module.exports = {
  listPopLinks,
  createPopLink,
  listBridgePages,
  cloneBridgePage,
  renameBridgePage
};
