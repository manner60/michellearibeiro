const { getLicense } = require('./license-store');

module.exports = (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { email } = req.query;
  
  if (!email) {
    return res.status(400).json({ error: 'Email required' });
  }
  
  const license = getLicense(email);
  
  if (!license) {
    return res.status(404).json({ error: 'License not found' });
  }
  
  res.status(200).json({
    success: true,
    licenseKey: license.licenseKey,
    tier: license.tier,
    createdAt: license.createdAt
  });
};
