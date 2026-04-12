#!/usr/bin/env node

/**
 * joes-ai-skill - Official joes.ai skill installer
 * 
 * Usage:
 *   joes-ai-skill install <skill-slug> [--level <level>] [--force]
 *   joes-ai-skill --version
 *   joes-ai-skill doctor
 *   joes-ai-skill self-update
 * 
 * Cert levels:
 *   --level install-verified     (default, 🛡️)
 *   --level security-reviewed    (🕵️)
 *   --level joes-ai-certified    (🏛️)
 */

const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const https = require('https');

const VERSION = '2.0.1';

// Get the directory where this script lives
const binDir = __dirname;
const installerPath = path.join(binDir, 'joes-skill-install.js');

// Parse command
const args = process.argv.slice(2);

// Handle --version
if (args.length === 0 || args[0] === '--version' || args[0] === '-v') {
  console.log(`joes-ai-skill v${VERSION}`);
  console.log('Official skill installer for joes.ai certified OpenClaw skills');
  process.exit(0);
}

// Handle doctor command
if (args[0] === 'doctor') {
  console.log('🏥 joes-ai-skill Doctor\n');
  
  // Check Node version
  const nodeVersion = process.version;
  console.log(`✓ Node.js: ${nodeVersion}`);
  
  // Check if clawhub is installed
  try {
    execSync('clawhub --version', { stdio: 'pipe' });
    console.log('✓ clawhub: installed');
  } catch (err) {
    console.log('✗ clawhub: NOT installed');
    console.log('  Install: npm install -g clawhub');
  }
  
  // Check OpenClaw directory
  const openclawDir = path.join(require('os').homedir(), '.openclaw');
  if (fs.existsSync(openclawDir)) {
    console.log(`✓ OpenClaw dir: ${openclawDir}`);
    
    const skillsDir = path.join(openclawDir, 'skills');
    if (fs.existsSync(skillsDir)) {
      const skills = fs.readdirSync(skillsDir).filter(f => 
        fs.statSync(path.join(skillsDir, f)).isDirectory()
      );
      console.log(`✓ Skills dir: ${skills.length} skill(s) installed`);
    } else {
      console.log('⚠ Skills dir: not found');
    }
  } else {
    console.log('✗ OpenClaw dir: NOT found');
  }
  
  // Check workspace
  const workspaceDir = path.join(openclawDir, 'workspace');
  if (fs.existsSync(workspaceDir)) {
    console.log(`✓ Workspace: ${workspaceDir}`);
    
    const installLog = path.join(workspaceDir, '.joes-ai-installs.json');
    if (fs.existsSync(installLog)) {
      const log = JSON.parse(fs.readFileSync(installLog, 'utf8'));
      const count = Object.keys(log).length;
      console.log(`✓ Install log: ${count} joes.ai install(s)`);
    } else {
      console.log('⚠ Install log: not found (no joes.ai installs yet)');
    }
  } else {
    console.log('✗ Workspace: NOT found');
  }
  
  console.log('\n✅ Doctor check complete');
  process.exit(0);
}

// Handle self-update command
if (args[0] === 'self-update') {
  console.log('🔄 Checking for updates...\n');
  
  const GITHUB_API = 'https://api.github.com/repos/JoeTheGoatFarmer/joes-ai-skill/releases/latest';
  
  https.get(GITHUB_API, { headers: { 'User-Agent': 'joes-ai-skill' } }, (res) => {
    let data = '';
    
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      try {
        const release = JSON.parse(data);
        const latestVersion = release.tag_name.replace(/^v/, '');
        
        console.log(`Current version: ${VERSION}`);
        console.log(`Latest version:  ${latestVersion}`);
        
        if (latestVersion === VERSION) {
          console.log('\n✅ Already up to date!');
          process.exit(0);
        }
        
        console.log('\n📦 New version available!');
        console.log(`\nTo update, run:\n  npm install -g joes-ai-skill@latest`);
        console.log(`\nOr download from: ${release.html_url}`);
        process.exit(0);
        
      } catch (err) {
        console.error('❌ Failed to check for updates:', err.message);
        process.exit(1);
      }
    });
  }).on('error', (err) => {
    console.error('❌ Failed to check for updates:', err.message);
    process.exit(1);
  });
  
  return;
}

// Handle install command
if (args[0] !== 'install') {
  console.error('Usage: joes-ai-skill install <skill-slug> [--level <level>] [--force]');
  console.error('       joes-ai-skill --version');
  console.error('       joes-ai-skill doctor');
  console.error('       joes-ai-skill self-update');
  console.error('\nCert levels:');
  console.error('  --level install-verified     (default, 🛡️)');
  console.error('  --level security-reviewed    (🕵️)');
  console.error('  --level joes-ai-certified    (🏛️)');
  process.exit(1);
}

// Remove "install" and pass everything else to the installer
const installerArgs = args.slice(1);

// Run the installer
const proc = spawn('node', [installerPath, ...installerArgs], {
  stdio: 'inherit',
  cwd: binDir
});

proc.on('exit', (code) => {
  process.exit(code || 0);
});
