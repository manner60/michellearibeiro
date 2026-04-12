#!/usr/bin/env node
/**
 * joes.ai Skill Installer v1.0.4
 * 
 * Wraps clawhub install and patches installed SKILL.md with joes.ai certification metadata.
 * 
 * Usage:
 *   node joes-skill-install.js <skill-slug> [--level <cert-level>] [--zip <path>] [--force]
 *   node joes-skill-install.js --doctor
 *   node joes-skill-install.js --inspect <skill-slug>
 * 
 * Cert levels:
 *   install-verified (default) → 🛡️
 *   security-reviewed → 🕵️
 *   joes-ai-certified → 🏛️
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const VERSION = '1.0.4';

// Configuration
const OPENCLAW_DIR = path.join(require('os').homedir(), '.openclaw');
const SKILLS_DIR = path.join(OPENCLAW_DIR, 'skills');
const INSTALL_LOG = path.join(OPENCLAW_DIR, 'workspace', '.joes-ai-installs.json');

const CERT_EMOJI_MAP = {
  'install-verified': '🛡️',
  'security-reviewed': '🕵️',
  'joes-ai-certified': '🏛️'
};

const DEFAULT_CERT_LEVEL = 'install-verified';

// Parse arguments (improved for v1.0.4 - handles command words correctly)
function parseArgs() {
  const args = process.argv.slice(2);
  
  // Handle --doctor
  if (args.includes('--doctor')) {
    return { mode: 'doctor' };
  }
  
  // Handle --inspect
  const inspectIdx = args.indexOf('--inspect');
  if (inspectIdx !== -1 && inspectIdx + 1 < args.length) {
    return { mode: 'inspect', skillSlug: args[inspectIdx + 1] };
  }
  
  // Handle help
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`joes.ai Skill Installer v${VERSION}\n`);
    console.log('Usage: joes-skill-install <skill-slug> [options]\n');
    console.log('Options:');
    console.log('  --level <cert-level>  Certification level (default: install-verified)');
    console.log('                        Levels: install-verified (🛡️), security-reviewed (🕵️), joes-ai-certified (🏛️)');
    console.log('  --zip <path>          Install from local zip file');
    console.log('  --force               Force reinstall (overwrite existing)');
    console.log('  --doctor              Show loader status and diagnostics');
    console.log('  --inspect <slug>      Show installed skill metadata');
    console.log('  -h, --help            Show this help\n');
    console.log('Examples:');
    console.log('  joes-skill-install weather');
    console.log('  joes-skill-install summarize --level security-reviewed');
    console.log('  joes-skill-install myskill --zip /path/to/skill.zip');
    console.log('  joes-skill-install pdf --level joes-ai-certified --force');
    console.log('  joes-skill-install --doctor');
    console.log('  joes-skill-install --inspect weather');
    process.exit(0);
  }

  let skillSlug = null;
  let certLevel = DEFAULT_CERT_LEVEL;
  let zipPath = null;
  let force = false;

  // Parse arguments - collect skill slug UNTIL hitting a flag
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--level' && i + 1 < args.length) {
      certLevel = args[i + 1];
      i++; // Skip next arg
    } else if (arg === '--zip' && i + 1 < args.length) {
      zipPath = args[i + 1];
      i++; // Skip next arg
    } else if (arg === '--force') {
      force = true;
    } else if (arg.startsWith('--')) {
      // Unknown flag, skip
      continue;
    } else if (!skillSlug) {
      // First non-flag argument is the skill slug
      skillSlug = arg;
    }
  }

  if (!skillSlug) {
    console.error('Error: No skill slug provided');
    console.error('Usage: joes-skill-install <skill-slug> [options]');
    process.exit(1);
  }

  if (!CERT_EMOJI_MAP[certLevel]) {
    console.error(`Invalid cert level: ${certLevel}`);
    console.error('Valid levels: install-verified, security-reviewed, joes-ai-certified');
    process.exit(1);
  }

  return { mode: 'install', skillSlug, certLevel, zipPath, force };
}

// Doctor command - show loader status
function runDoctor() {
  console.log('🏥 joes.ai Skill Loader Doctor\n');
  
  // Read loader version from metadata
  const metaPath = path.join(__dirname, '..', '_meta.json');
  let loaderVersion = VERSION;
  if (fs.existsSync(metaPath)) {
    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      loaderVersion = meta.version || VERSION;
    } catch (err) {
      // Ignore, use hardcoded VERSION
    }
  }
  
  console.log(`✓ Loader version: ${loaderVersion}`);
  console.log(`✓ Loader path: ${__dirname}\n`);
  
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
  
  // Check clawhub CLI
  try {
    execSync('clawhub --version', { stdio: 'pipe' });
    console.log('✓ clawhub CLI: available\n');
  } catch (err) {
    console.log('⚠ clawhub CLI: NOT available (optional for zip installs)\n');
  }
  
  // Check unzip command
  try {
    execSync('unzip --help', { stdio: 'pipe' });
    console.log('✓ unzip command: available\n');
  } catch (err) {
    console.log('✗ unzip command: NOT available (required for --zip installs)\n');
  }
  
  // Check install log
  if (fs.existsSync(INSTALL_LOG)) {
    const log = JSON.parse(fs.readFileSync(INSTALL_LOG, 'utf8'));
    const installs = Object.entries(log);
    console.log(`✓ Install log: ${installs.length} joes.ai install(s)\n`);
    
    if (installs.length > 0) {
      console.log('Recent installs:');
      installs.slice(-5).forEach(([slug, info]) => {
        const present = fs.existsSync(info.skillDir) ? '✅' : '❌';
        console.log(`  ${present} ${slug} (${info.certLevel} ${info.emoji})`);
      });
    }
  } else {
    console.log('⚠ Install log: not found (no joes.ai installs yet)\n');
  }
  
  console.log('\n✅ Doctor check complete');
}

// Inspect command - show skill metadata
function runInspect(skillSlug) {
  console.log(`🔍 Inspecting ${skillSlug}\n`);
  
  const skillDir = path.join(SKILLS_DIR, skillSlug);
  const skillMdPath = path.join(skillDir, 'SKILL.md');
  
  if (!fs.existsSync(skillMdPath)) {
    console.error(`❌ Skill not found: ${skillSlug}`);
    console.error(`   Expected at: ${skillDir}`);
    process.exit(1);
  }
  
  // Read SKILL.md
  const content = fs.readFileSync(skillMdPath, 'utf8');
  const { frontmatter } = parseFrontmatter(content);
  
  // Display info
  console.log(`Skill: ${frontmatter.name || skillSlug}`);
  console.log(`Homepage: ${frontmatter.homepage || 'N/A'}`);
  
  // Check for joes.ai certification
  if (frontmatter.metadata && frontmatter.metadata.openclaw && frontmatter.metadata.openclaw.cert) {
    const cert = frontmatter.metadata.openclaw.cert;
    const emoji = frontmatter.metadata.openclaw.emoji || '';
    
    console.log(`\njoes.ai Certification:`);
    console.log(`  Level: ${cert.level} ${emoji}`);
    console.log(`  Issuer: ${cert.issuer}`);
    console.log(`  Installed: ${new Date(cert.installedAt).toLocaleString()}`);
    console.log(`  Source: ${cert.source}`);
  } else {
    console.log(`\n⚠ No joes.ai certification found`);
  }
  
  console.log(`\nLocation: ${skillDir}`);
}

// Run clawhub install
function runClawHubInstall(skillSlug, force = false) {
  console.log(`[1/4] Installing ${skillSlug} via clawhub...`);
  const forceFlag = force ? ' --force' : '';
  try {
    const output = execSync(`clawhub install ${skillSlug} --workdir ${OPENCLAW_DIR} --no-input${forceFlag}`, {
      encoding: 'utf8',
      shell: true
    });
    console.log(output);
    console.log('✅ clawhub install completed\n');
  } catch (error) {
    console.error('❌ clawhub install failed');
    if (error.stdout) console.error(error.stdout);
    if (error.stderr) console.error(error.stderr);
    throw error;
  }
}

// Run zip install (v1.0.4 - new feature)
function runZipInstall(skillSlug, zipPath, force = false) {
  console.log(`[1/4] Installing ${skillSlug} from zip: ${zipPath}...`);
  
  if (!fs.existsSync(zipPath)) {
    throw new Error(`Zip file not found: ${zipPath}`);
  }
  
  const skillDir = path.join(SKILLS_DIR, skillSlug);
  
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
  
  // Extract zip
  try {
    execSync(`unzip -q "${zipPath}" -d "${SKILLS_DIR}"`, {
      encoding: 'utf8',
      shell: true
    });
    console.log('✅ Zip extraction completed\n');
  } catch (error) {
    console.error('❌ Zip extraction failed');
    if (error.stdout) console.error(error.stdout);
    if (error.stderr) console.error(error.stderr);
    throw error;
  }
}

// Parse YAML frontmatter
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    throw new Error('No YAML frontmatter found in SKILL.md');
  }

  const [, frontmatterRaw, body] = match;
  
  // Basic YAML parser (handles simple key: value and JSON values)
  const frontmatter = {};
  const lines = frontmatterRaw.split('\n');
  
  for (const line of lines) {
    if (!line.trim()) continue;
    
    const keyMatch = line.match(/^([a-zA-Z_][a-zA-Z0-9_.-]*)\s*:\s*(.*)$/);
    
    if (keyMatch) {
      const [, key, value] = keyMatch;
      
      // Try parsing as JSON if it looks like JSON
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

// Serialize frontmatter to YAML
function serializeFrontmatter(frontmatter) {
  const lines = [];
  
  for (const [key, value] of Object.entries(frontmatter)) {
    if (typeof value === 'object' && value !== null) {
      // Serialize objects as JSON for compact representation
      lines.push(`${key}: ${JSON.stringify(value)}`);
    } else {
      lines.push(`${key}: ${value}`);
    }
  }
  
  return lines.join('\n');
}

// Get clawhub origin info
function getClawHubOrigin(skillDir) {
  const originPaths = [
    path.join(skillDir, '.clawhub', 'origin.json'),
    path.join(skillDir, '.clawdhub', 'origin.json')
  ];

  for (const originPath of originPaths) {
    if (fs.existsSync(originPath)) {
      return JSON.parse(fs.readFileSync(originPath, 'utf8'));
    }
  }

  return null;
}

// Patch SKILL.md with joes.ai certification
function patchSkillMd(skillSlug, certLevel, source = null) {
  console.log(`[2/4] Patching SKILL.md with joes.ai certification...`);
  
  const skillDir = path.join(SKILLS_DIR, skillSlug);
  const skillMdPath = path.join(skillDir, 'SKILL.md');

  if (!fs.existsSync(skillMdPath)) {
    throw new Error(`SKILL.md not found at ${skillMdPath}`);
  }

  const content = fs.readFileSync(skillMdPath, 'utf8');
  const { frontmatter, body } = parseFrontmatter(content);

  // Get clawhub origin info for source tracking (if not provided)
  if (!source) {
    const origin = getClawHubOrigin(skillDir);
    source = origin
      ? `${origin.slug}@${origin.installedVersion}`
      : skillSlug;
  }

  // Add joes.ai homepage
  frontmatter.homepage = 'https://joes.ai';

  // Initialize metadata structure
  if (!frontmatter.metadata) {
    frontmatter.metadata = {};
  }
  if (typeof frontmatter.metadata === 'string') {
    try {
      frontmatter.metadata = JSON.parse(frontmatter.metadata);
    } catch {
      frontmatter.metadata = {};
    }
  }
  if (!frontmatter.metadata.openclaw) {
    frontmatter.metadata.openclaw = {};
  }

  // Add openclaw metadata
  frontmatter.metadata.openclaw.homepage = 'https://joes.ai';
  frontmatter.metadata.openclaw.emoji = CERT_EMOJI_MAP[certLevel];
  frontmatter.metadata.openclaw.cert = {
    issuer: 'joes.ai',
    level: certLevel,
    installedAt: new Date().toISOString(),
    installedBy: 'joes-skill-install.js',
    installerVersion: VERSION,
    source: source
  };

  // Reconstruct SKILL.md
  const newContent = `---\n${serializeFrontmatter(frontmatter)}\n---\n${body}`;
  fs.writeFileSync(skillMdPath, newContent, 'utf8');

  console.log(`✅ Patched SKILL.md with ${certLevel} (${CERT_EMOJI_MAP[certLevel]})\n`);
  
  return { skillDir, source, frontmatter };
}

// Log installation
function logInstallation(skillSlug, certLevel, skillDir, source) {
  console.log(`[3/4] Logging installation...`);

  // Ensure workspace directory exists
  const workspaceDir = path.dirname(INSTALL_LOG);
  if (!fs.existsSync(workspaceDir)) {
    fs.mkdirSync(workspaceDir, { recursive: true });
  }

  let installs = {};
  if (fs.existsSync(INSTALL_LOG)) {
    installs = JSON.parse(fs.readFileSync(INSTALL_LOG, 'utf8'));
  }

  installs[skillSlug] = {
    certLevel,
    emoji: CERT_EMOJI_MAP[certLevel],
    installedAt: new Date().toISOString(),
    installedBy: 'joes-skill-install.js',
    installerVersion: VERSION,
    skillDir,
    source: source,
    homepage: 'https://joes.ai'
  };

  fs.writeFileSync(INSTALL_LOG, JSON.stringify(installs, null, 2), 'utf8');
  console.log(`✅ Logged to ${INSTALL_LOG}\n`);
}

// Main
async function main() {
  const parsed = parseArgs();

  // Handle doctor command
  if (parsed.mode === 'doctor') {
    runDoctor();
    return;
  }

  // Handle inspect command
  if (parsed.mode === 'inspect') {
    runInspect(parsed.skillSlug);
    return;
  }

  // Handle install command
  const { skillSlug, certLevel, zipPath, force } = parsed;

  console.log(`\n🏛️ joes.ai Skill Installer v${VERSION}\n`);
  console.log(`Skill: ${skillSlug}`);
  console.log(`Cert Level: ${certLevel} (${CERT_EMOJI_MAP[certLevel]})`);
  if (zipPath) {
    console.log(`Source: ${zipPath} (zip)`);
  }
  console.log('');

  try {
    // Step 1: Install via clawhub or zip
    if (zipPath) {
      runZipInstall(skillSlug, zipPath, force);
    } else {
      runClawHubInstall(skillSlug, force);
    }

    // Step 2: Patch SKILL.md
    const source = zipPath ? `zip:${path.basename(zipPath)}` : null;
    const { skillDir } = patchSkillMd(skillSlug, certLevel, source);

    // Step 3: Log installation
    logInstallation(skillSlug, certLevel, skillDir, source || skillSlug);

    // Step 4: Success
    console.log(`[4/4] Installation complete!\n`);
    console.log(`✅ ${skillSlug} installed and certified`);
    console.log(`   Cert: ${certLevel} ${CERT_EMOJI_MAP[certLevel]}`);
    console.log(`   Homepage: https://joes.ai`);
    console.log(`   Location: ${skillDir}\n`);

  } catch (error) {
    console.error(`\n❌ Installation failed: ${error.message}`);
    process.exit(1);
  }
}

main();
