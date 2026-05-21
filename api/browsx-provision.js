const https = require('https');
const querystring = require('querystring');

const BASE = 'https://browsx.com';
const MY_ACCOUNT = BASE + '/my-account/';
const RESELLER = BASE + '/reseller-dashboard/';
const AJAX = BASE + '/wp-admin/admin-ajax.php';
const PARENT_ID = '503';  // AI Organizer reseller license

const LICENSE_MAP = {
  'basic': 'standard',
  'standard': 'standard',
  'pro': 'enhanced',
  'professional': 'enhanced',
  'enhanced': 'enhanced',
  'enterprise': 'ultimate',
  'ultimate': 'ultimate',
  '1': 'standard',
  '3': 'enhanced',
  '5': 'ultimate',
};

function get(url, cookie) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Cookie': cookie || ''
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ body: data, headers: res.headers }));
    });
    req.on('error', reject);
  });
}

function post(url, data, cookie) {
  return new Promise((resolve, reject) => {
    const postData = querystring.stringify(data);
    const req = https.request(url, {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
        'Cookie': cookie || ''
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ body: data, headers: res.headers }));
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function login(username, password) {
  const { body: html } = await get(MY_ACCOUNT);
  
  const nonceMatch = html.match(/name="woocommerce-login-nonce" value="([^"]+)"/);
  const refMatch = html.match(/name="_wp_http_referer" value="([^"]+)"/);
  
  if (!nonceMatch) throw new Error('Could not find login nonce');
  
  const payload = {
    username: username,
    password: password,
    'woocommerce-login-nonce': nonceMatch[1],
    '_wp_http_referer': refMatch ? refMatch[1] : '/my-account/',
    login: 'Log in'
  };
  
  const { body, headers } = await post(MY_ACCOUNT, payload);
  
  // Extract cookies from response
  const cookies = headers['set-cookie'];
  if (!cookies) throw new Error('Login failed - no cookies');
  
  const cookieString = Array.isArray(cookies) 
    ? cookies.map(c => c.split(';')[0]).join('; ')
    : cookies.split(';')[0];
    
  // Verify login
  const { body: acctHtml } = await get(MY_ACCOUNT, cookieString);
  if (!acctHtml.includes('customer-logout') && !acctHtml.includes('woocommerce-MyAccount-navigation')) {
    throw new Error('Login verification failed');
  }
  
  return cookieString;
}

async function getNonce(cookie) {
  const { body: html } = await get(RESELLER, cookie);
  const match = html.match(/var celmData = \{"ajaxUrl":"[^"]+","nonce":"([^"]+)"\}/);
  if (!match) throw new Error('Could not find nonce');
  return match[1];
}

async function provision(cookie, nonce, email, licenseType) {
  const payload = {
    action: 'celm_generate_sublicense',
    nonce: nonce,
    parent_license_id: PARENT_ID,
    license_type: licenseType,
    customer_email: email,
    send_email: '1',
    notify_customer: '1'
  };
  
  const { body } = await post(AJAX, payload, cookie);
  
  try {
    return JSON.parse(body);
  } catch (e) {
    throw new Error('Invalid JSON response: ' + body.substring(0, 200));
  }
}

async function provisionLicense(email, tier) {
  const licenseType = LICENSE_MAP[tier.toLowerCase()];
  if (!licenseType) throw new Error('Unknown tier: ' + tier);
  
  const username = process.env.BROWSX_USER;
  const password = process.env.BROWSX_PASS;
  
  if (!username || !password) {
    throw new Error('BROWSX_USER and BROWSX_PASS must be set');
  }
  
  const cookie = await login(username, password);
  const nonce = await getNonce(cookie);
  const result = await provision(cookie, nonce, email, licenseType);
  
  return result;
}

module.exports = { provisionLicense };