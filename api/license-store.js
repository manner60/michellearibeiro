const fs = require('fs');
const path = require('path');

const LICENSES_FILE = path.join(__dirname, 'licenses.json');

function readLicenses() {
  try {
    const data = fs.readFileSync(LICENSES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
}

function writeLicenses(licenses) {
  fs.writeFileSync(LICENSES_FILE, JSON.stringify(licenses, null, 2));
}

function storeLicense(email, licenseData) {
  const licenses = readLicenses();
  licenses[email.toLowerCase()] = {
    ...licenseData,
    createdAt: new Date().toISOString()
  };
  writeLicenses(licenses);
  return true;
}

function getLicense(email) {
  const licenses = readLicenses();
  return licenses[email.toLowerCase()] || null;
}

module.exports = { storeLicense, getLicense };
