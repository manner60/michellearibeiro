#!/usr/bin/env node
/**
 * joes.ai Skill Installer v2.0.0
 * 
 * Certified Catalog Edition
 * - Install from certified catalog (default)
 * - Fallback to clawhub or manual zip
 * - Automatic preset installs
 * 
 * Usage:
 *   joes-skill-install <skill-id> [--version <ver>] [--level <cert-level>] [--force]
 *   joes-skill-install --preset <name>
 *   joes-skill-install --catalog [--verbose]
 *   joes-skill-install --doctor
 *   joes-skill-install --inspect <skill-slug>
 * 
 * Cert levels:
 *   install-verified (default) → 🛡️
 *   security-reviewed → 🕵️
 *   joes-ai-certified → 🏛️
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const catalogManager = require('../lib/catalog-manager');

// Helper: Read version from _meta.json at runtime (single source of truth)
function getMetaVersion() {
  try {
    // _meta.json lives in the skill root alongside SKILL.md and the JS files
    const metaPath = path.join(__dirname, '..', '_meta.json');
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    if (meta && meta.version) return String(meta.version);
  } catch (e) {
    // ignore + fallback
  }
  return 'unknown';
}

const VERSION = getMetaVersion();

// Configuration
const OPENCLAW_DIR = path.join(os.homedir(), '.openclaw');
const SKILLS_DIR = path.join(OPENCLAW_DIR, 'skills');
const INSTALL_LOG = path.join(OPENCLAW_DIR, 'workspace', '.joes-ai-installs.json');
const TEMP_DIR = path.join(OPENCLAW_DIR, '.temp-skill-downloads');

const CERT_EMOJI_MAP = {
  'install-verified': '🛡️',
  'security-reviewed': '🕵️',
  'joes-ai-certified': '🏛️'
};

const DEFAULT_CERT_LEVEL = 'install-verified';

// Parse arguments
function parseArgs() {
  const args = process.argv.slice(2);
  
  // Handle --doctor
  if (args.includes('--doctor')) {
    return { mode: 'doctor' };
  }
  
  // Handle --catalog
  if (args.includes('--catalog')) {
    return { 
      mode: 'catalog',
      verbose: args.includes('--verbose') || args.includes('-v')
    };
  }
  
  // Handle --preset
  const presetIdx = args.indexOf('--preset');
  if (presetIdx !== -1 && presetIdx + 1 < args.length) {
    return { 
      mode: 'preset', 
      presetName: args[presetIdx + 1],
      force: args.includes('--force')
    };
  }
  
  // Handle --inspect
  const inspectIdx = args.indexOf('--inspect');
  if (inspectIdx !== -1 && inspectIdx + 1 < args.length) {
    return { mode: 'inspect', skillSlug: args[inspectIdx + 1] };
  }
  
  // Handle help
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`joes.ai Skill Installer v${VERSION} (Certified Catalog Edition)\n`);
    console.log('Usage: joes-skill-install <skill-id> [options]\n');
    console.log('Commands:');
    console.log('  joes-skill-install <skill-id>        Install skill from certified catalog');
    console.log('  joes-skill-install --preset <name>   Install preset (default, full)');
    console.log('  joes-skill-install --catalog         List certified skills');
    console.log('  joes-skill-install --doctor          Show loader status');
    console.log('  joes-skill-install --inspect <slug>  Show installed skill metadata\n');
    console.log('Install Options:');
    console.log('  --version <ver>       Install specific version (e.g., v2026-04-01_p1)');
    console.log('  --level <cert-level>  Certification level (default: install-verified)');
    console.log('  --zip <path>          Install from local zip (bypasses catalog)');
    console.log('  --force               Force reinstall (overwrite existing)\n');
    console.log('Catalog Options:');
    console.log('  --verbose, -v         Show detailed catalog info\n');
    console.log('Certification Levels:');
    console.log('  install-verified 🛡️   Basic installation verified');
    console.log('  security-reviewed 🕵️  Security audit completed');
    console.log('  joes-ai-certified 🏛️  Full joes.ai certification\n');
    console.log('Examples:');
    console.log('  joes-skill-install memory-bank');
    console.log('  joes-skill-install memory-bank --version v2026-04-01_p1');
    console.log('  joes-skill-install --preset default');
    console.log('  joes-skill-install --catalog --verbose');
    console.log('  joes-skill-install myskill --zip /path/to/skill.zip');
    process.exit(0);
  }

  let skillId = null;
  let version = 'latest';
  let certLevel = DEFAULT_CERT_LEVEL;
  let zipPath = null;
  let force = false;

  // Parse install arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--version' && i + 1 < args.length) {
      version = args[i + 1];
      i++;
    } else if (arg === '--level' && i + 1 < args.length) {
      certLevel = args[i + 1];
      i++;
    } else if (arg === '--zip' && i + 1 < args.length) {
      zipPath = args[i + 1];
      i++;
    } else if (arg === '--force') {
      force = true;
    } else if (arg.startsWith('--')) {
      continue; // Skip unknown flags
    } else if (!skillId) {
      skillId = arg;
    }
  }

  if (!skillId) {
    console.error('Error: No skill ID provided');
    console.error('Usage: joes-skill-install <skill-id> [options]');
    console.error('Try: joes-skill-install --help');
    process.exit(1);
  }

  if (!CERT_EMOJI_MAP[certLevel]) {
    console.error(`Invalid cert level: ${certLevel}`);
    console.error('Valid levels: install-verified, security-reviewed, joes-ai-certified');
    process.exit(1);
  }

  return { mode: 'install', skillId, version, certLevel, zipPath, force };
}

// Show catalog
function showCatalog(verbose = false) {
  console.log('📚 joes.ai Certified Skills Catalog\n');
  
  try {
    const catalog = catalogManager.loadCatalog();
    const skills = catalogManager.listSkills(catalog);
    
    console.log(`Catalog version: ${catalog.version}`);
    console.log(`Last updated: ${new Date(catalog.last_updated).toLocaleString()}`);
    console.log(`Skills available: ${skills.length}\n`);
    
    console.log('Certified Skills:');
    skills.forEach(skill => {
      const defaultBadge = skill.default_install ? ' [default]' : '';
      console.log(`  • ${skill.name} (${skill.id})${defaultBadge}`);
      if (verbose) {
        console.log(`    ${skill.description}`);
        console.log(`    Latest: ${skill.latest}`);
      }
    });
    
    console.log('\nPresets:');
    Object.entries(catalog.presets).forEach(([name, preset]) => {
      console.log(`  • ${name}: ${preset.name} (${preset.skills.length} skills)`);
      if (verbose) {
        console.log(`    ${preset.description}`);
        console.log(`    Skills: ${preset.skills.join(', ')}`);
      }
    });
    
    console.log('\nInstall: joes-skill-install <skill-id>');
    console.log('Install preset: joes-skill-install --preset <name>');
    
  } catch (err) {
    console.error(`❌ Failed to load catalog: ${err.message}`);
    process.exit(1);
  }
}

// Install preset
function installPreset(presetName, force = false) {
  console.log(`📦 Installing preset: ${presetName}\n`);
  
  try {
    const catalog = catalogManager.loadCatalog();
    const preset = catalogManager.getPreset(catalog, presetName);
    
    console.log(`${preset.name}: ${preset.description}`);
    console.log(`Skills to install: ${preset.skills.length}\n`);
    
    let installed = 0;
    let failed = 0;
    
    for (const skillId of preset.skills) {
      console.log(`\n[${ installed + failed + 1}/${preset.skills.length}] Installing ${skillId}...`);
      try {
        installFromCatalog(skillId, 'latest', DEFAULT_CERT_LEVEL, force);
        installed++;
      } catch (err) {
        console.error(`❌ Failed to install ${skillId}: ${err.message}`);
        failed++;
      }
    }
    
    console.log(`\n✅ Preset install complete: ${installed} installed, ${failed} failed`);
    
  } catch (err) {
    console.error(`❌ Failed to install preset: ${err.message}`);
    process.exit(1);
  }
}

// Install from catalog
function installFromCatalog(skillId, version, certLevel, force = false) {
  const catalog = catalogManager.loadCatalog();
  const skill = catalogManager.findSkill(catalog, skillId);
  
  if (!skill) {
    throw new Error(`Skill not found in catalog: ${skillId}`);
  }
  
  const versionEntry = catalogManager.getVersion(skill, version);
  
  if (!versionEntry) {
    throw new Error(`Version not found: ${version} for skill ${skillId}`);
  }
  
  console.log(`📥 Downloading ${skill.name} ${versionEntry.version} from certified catalog...`);
  console.log(`   Source: ${versionEntry.commit_url || versionEntry.commit}`);
  
  // Create temp directory
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }
  
  const tempZip = path.join(TEMP_DIR, `${skillId}_${versionEntry.version}.zip`);
  
  // Download zip
  catalogManager.downloadFile(versionEntry.zip_url, tempZip)
    .then(() => {
      console.log('✅ Download complete');
      
      // Verify checksum if present
      if (versionEntry.sha256) {
        console.log(`🔐 Verifying checksum...`);
        const valid = catalogManager.verifyChecksum(tempZip, versionEntry.sha256);
        if (!valid) {
          throw new Error('Checksum verification failed');
        }
        console.log('✅ Checksum verified');
      }
      
      // Install from downloaded zip
      runZipInstall(skillId, tempZip, force);
      
      // Patch with certification
      patchSkillMd(skillId, certLevel, `catalog:${versionEntry.version}`);
      
      // Log installation
      logInstall(skillId, certLevel, `catalog:${skillId}:${versionEntry.version}`);
      
      // Cleanup
      fs.unlinkSync(tempZip);
      
      console.log(`\n✅ ${skill.name} installed successfully!`);
      console.log(`   Version: ${versionEntry.version}`);
      console.log(`   Certification: ${certLevel} ${CERT_EMOJI_MAP[certLevel]}`);
      
    })
    .catch(err => {
      if (fs.existsSync(tempZip)) {
        fs.unlinkSync(tempZip);
      }
      throw new Error(`Download failed: ${err.message}`);
    });
}

// Run zip install (from v1.0.4)
function runZipInstall(skillId, zipPath, force = false) {
  if (!fs.existsSync(zipPath)) {
    throw new Error(`Zip file not found: ${zipPath}`);
  }
  
  const skillDir = path.join(SKILLS_DIR, skillId);
  
  // Check if skill already exists
  if (fs.existsSync(skillDir) && !force) {
    throw new Error(`Skill already exists at ${skillDir}. Use --force to overwrite.`);
  }
  
  // Remove existing skill if force
  if (fs.existsSync(skillDir) && force) {
    console.log(`Removing existing skill at ${skillDir}...`);
    fs.rmSync(skillDir, { recursive: true, force: true });
  }
  
  // Create skills directory if needed
  if (!fs.existsSync(SKILLS_DIR)) {
    fs.mkdirSync(SKILLS_DIR, { recursive: true });
  }
  
  // Extract zip (cross-platform)
  console.log(`📦 Extracting skill...`);
  try {
    const isWindows = process.platform === 'win32';
    
    if (isWindows) {
      // Use PowerShell Expand-Archive on Windows
      execSync(`powershell -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${SKILLS_DIR}' -Force"`, {
        encoding: 'utf8',
        shell: true
      });
    } else {
      // Use unzip on Unix-like systems
      execSync(`unzip -q "${zipPath}" -d "${SKILLS_DIR}"`, {
        encoding: 'utf8',
        shell: true
      });
    }
    console.log('✅ Extraction complete');
  } catch (error) {
    console.error('❌ Extraction failed');
    if (error.stdout) console.error(error.stdout);
    if (error.stderr) console.error(error.stderr);
    throw error;
  }
}

// Patch SKILL.md (simplified from v1.0.4)
function patchSkillMd(skillSlug, certLevel, source) {
  const skillDir = path.join(SKILLS_DIR, skillSlug);
  const skillMdPath = path.join(skillDir, 'SKILL.md');
  
  if (!fs.existsSync(skillMdPath)) {
    throw new Error(`SKILL.md not found at ${skillMdPath}`);
  }
  
  // Read SKILL.md
  let content = fs.readFileSync(skillMdPath, 'utf8');
  const { frontmatter, body } = parseFrontmatter(content);
  
  // Add certification metadata
  if (!frontmatter.metadata) frontmatter.metadata = {};
  if (!frontmatter.metadata.openclaw) frontmatter.metadata.openclaw = {};
  
  frontmatter.metadata.openclaw.cert = {
    level: certLevel,
    issuer: 'joes.ai',
    installedAt: new Date().toISOString(),
    source: source
  };
  frontmatter.metadata.openclaw.emoji = CERT_EMOJI_MAP[certLevel];
  
  // Ensure homepage
  if (!frontmatter.homepage) {
    frontmatter.homepage = 'https://joes.ai';
  }
  
  // Write back
  const newContent = `---\n${serializeFrontmatter(frontmatter)}\n---\n${body}`;
  fs.writeFileSync(skillMdPath, newContent, 'utf8');
  
  console.log(`✅ Certification metadata added`);
}

// Parse YAML frontmatter (from v1.0.4)
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    throw new Error('No YAML frontmatter found in SKILL.md');
  }

  const [, frontmatterRaw, body] = match;
  
  const frontmatter = {};
  const lines = frontmatterRaw.split('\n');
  
  for (const line of lines) {
    if (!line.trim()) continue;
    
    const keyMatch = line.match(/^([a-zA-Z_][a-zA-Z0-9_.-]*)\s*:\s*(.*)$/);
    
    if (keyMatch) {
      const [, key, value] = keyMatch;
      
      if (value.startsWith('{') || value.startsWith('[')) {
        try {
          frontmatter[key] = JSON.parse(value);
        } catch {
          frontmatter[key] = value;
        }
      } else {
        frontmatter[key] = value;
      }
    }
  }

  return { frontmatter, body };
}

// Serialize frontmatter (from v1.0.4)
function serializeFrontmatter(frontmatter) {
  const lines = [];
  
  for (const [key, value] of Object.entries(frontmatter)) {
    if (typeof value === 'object' && value !== null) {
      lines.push(`${key}: ${JSON.stringify(value)}`);
    } else {
      lines.push(`${key}: ${value}`);
    }
  }
  
  return lines.join('\n');
}

// Log installation (from v1.0.4)
function logInstall(skillSlug, certLevel, source) {
  const skillDir = path.join(SKILLS_DIR, skillSlug);
  
  let log = {};
  if (fs.existsSync(INSTALL_LOG)) {
    log = JSON.parse(fs.readFileSync(INSTALL_LOG, 'utf8'));
  }
  
  log[skillSlug] = {
    installedAt: new Date().toISOString(),
    certLevel: certLevel,
    emoji: CERT_EMOJI_MAP[certLevel],
    source: source,
    skillDir: skillDir
  };
  
  const logDir = path.dirname(INSTALL_LOG);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  fs.writeFileSync(INSTALL_LOG, JSON.stringify(log, null, 2), 'utf8');
}

// Main
function main() {
  const opts = parseArgs();
  
  if (opts.mode === 'doctor') {
    console.log('🏥 joes.ai Skill Loader Doctor\n');
    console.log(`[OK] Loader version: ${VERSION} (Certified Catalog Edition)\n`);
    
    // Check catalog
    try {
      const catalog = catalogManager.loadCatalog();
      console.log(`✓ Certified catalog: ${catalog.skills.length} skills available`);
      console.log(`  Last updated: ${new Date(catalog.last_updated).toLocaleString()}\n`);
    } catch (err) {
      console.log(`✗ Certified catalog: ${err.message}\n`);
    }
    
    // Check skills directory
    if (fs.existsSync(SKILLS_DIR)) {
      const skills = fs.readdirSync(SKILLS_DIR).filter(f => 
        fs.statSync(path.join(SKILLS_DIR, f)).isDirectory()
      );
      console.log(`✓ Skills directory: ${SKILLS_DIR}`);
      console.log(`  ${skills.length} skill(s) installed\n`);
    } else {
      console.log(`✗ Skills directory: NOT found\n`);
    }
    
    console.log('✅ Doctor check complete');
    
  } else if (opts.mode === 'catalog') {
    showCatalog(opts.verbose);
    
  } else if (opts.mode === 'preset') {
    installPreset(opts.presetName, opts.force);
    
  } else if (opts.mode === 'install') {
    if (opts.zipPath) {
      // Manual zip install
      console.log(`Installing ${opts.skillId} from local zip...\n`);
      runZipInstall(opts.skillId, opts.zipPath, opts.force);
      patchSkillMd(opts.skillId, opts.certLevel, `zip:${opts.zipPath}`);
      logInstall(opts.skillId, opts.certLevel, `manual-zip`);
      console.log(`\n✅ ${opts.skillId} installed!`);
    } else {
      // Catalog install
      installFromCatalog(opts.skillId, opts.version, opts.certLevel, opts.force);
    }
  }
}

main();
