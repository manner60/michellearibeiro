/**
 * Certified Skills Catalog Manager
 * Handles catalog loading, skill resolution, and download
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const crypto = require('crypto');

const CATALOG_PATH = path.join(__dirname, '..', 'certified-skills.json');

/**
 * Load catalog from local file
 */
function loadCatalog() {
  if (!fs.existsSync(CATALOG_PATH)) {
    throw new Error(`Catalog not found: ${CATALOG_PATH}`);
  }
  
  try {
    const content = fs.readFileSync(CATALOG_PATH, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    throw new Error(`Failed to parse catalog: ${err.message}`);
  }
}

/**
 * Find skill in catalog
 */
function findSkill(catalog, skillId) {
  return catalog.skills.find(s => s.skill_id === skillId);
}

/**
 * Get version entry for skill
 */
function getVersion(skill, versionSpec) {
  if (!versionSpec || versionSpec === 'latest') {
    versionSpec = skill.latest;
  }
  
  return skill.versions.find(v => v.version === versionSpec);
}

/**
 * Download file from URL
 */
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const file = fs.createWriteStream(destPath);
    
    protocol.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirect
        file.close();
        fs.unlinkSync(destPath);
        return downloadFile(response.headers.location, destPath)
          .then(resolve)
          .catch(reject);
      }
      
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destPath);
        return reject(new Error(`HTTP ${response.statusCode}: ${url}`));
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve(destPath);
      });
    }).on('error', (err) => {
      fs.unlinkSync(destPath);
      reject(err);
    });
    
    file.on('error', (err) => {
      fs.unlinkSync(destPath);
      reject(err);
    });
  });
}

/**
 * Verify file checksum
 */
function verifyChecksum(filePath, expectedSha256) {
  if (!expectedSha256) {
    return true; // No checksum to verify
  }
  
  const content = fs.readFileSync(filePath);
  const hash = crypto.createHash('sha256').update(content).digest('hex');
  
  return hash === expectedSha256;
}

/**
 * Get preset skills list
 */
function getPreset(catalog, presetName = 'default') {
  const preset = catalog.presets[presetName];
  if (!preset) {
    throw new Error(`Preset not found: ${presetName}`);
  }
  return preset;
}

/**
 * List all skills in catalog
 */
function listSkills(catalog) {
  return catalog.skills.map(s => ({
    id: s.skill_id,
    name: s.name,
    description: s.description,
    latest: s.latest,
    default_install: s.default_install || false
  }));
}

module.exports = {
  loadCatalog,
  findSkill,
  getVersion,
  downloadFile,
  verifyChecksum,
  getPreset,
  listSkills
};
