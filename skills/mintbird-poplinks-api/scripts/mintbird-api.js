/**
 * MintBird / Poplinks API Core Functions
 * Handles all API interactions with MintBird
 */

const BASE_URL = 'https://api.poplinks.io/api/ai';

// Load API key from credentials
function getApiKey() {
  try {
    const fs = require('fs');
    const content = fs.readFileSync('credentials/titanium-api-keys.txt', 'utf8');
    const match = content.match(/MintBird API Key:\s*(.+)/i);
    return match ? match[1].trim() : null;
  } catch (e) {
    return null;
  }
}

// Make API request
async function mintbirdRequest(endpoint, method = 'GET', data = null) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('MintBird API key not found in credentials/titanium-api-keys.txt');
  }

  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  };

  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    
    if (!response.ok) {
      throw {
        status: response.status,
        message: result.message || 'API request failed',
        endpoint: url,
        data: result
      };
    }
    
    return result;
  } catch (error) {
    if (error.status) throw error;
    throw {
      status: 0,
      message: error.message || 'Network error',
      endpoint: url
    };
  }
}

// ==================== HELPER ENDPOINTS ====================

async function getSystemDomains() {
  return mintbirdRequest('/system-domains');
}

async function getDomains() {
  return mintbirdRequest('/domains');
}

async function getGroups() {
  return mintbirdRequest('/groups');
}

async function getVendors() {
  return mintbirdRequest('/vendors');
}

async function getTemplates() {
  return mintbirdRequest('/templates');
}

async function getCategories() {
  return mintbirdRequest('/categories');
}

// ==================== POPLINKS ====================

async function createPoplink(data) {
  return mintbirdRequest('/poplinks', 'POST', data);
}

async function updatePoplink(id, data) {
  return mintbirdRequest(`/poplinks/${id}`, 'PUT', data);
}

async function getPoplinks() {
  return mintbirdRequest('/poplinks');
}

async function getPoplink(id) {
  return mintbirdRequest(`/poplinks/${id}`);
}

// ==================== LEAD PAGES ====================

async function createLeadPage(data) {
  return mintbirdRequest('/lead-pages', 'POST', data);
}

async function updateLeadPage(id, data) {
  return mintbirdRequest(`/lead-pages/${id}`, 'PUT', data);
}

async function updateLeadPageField(id, field, value) {
  return mintbirdRequest(`/lead-pages/${id}/${field}`, 'PUT', { [field]: value });
}

async function cloneLeadPage(id) {
  return mintbirdRequest(`/lead-pages/${id}/clone`, 'POST');
}

// ==================== BRIDGE PAGES ====================

async function createBridgePage(data) {
  return mintbirdRequest('/bridge-pages', 'POST', data);
}

async function updateBridgePage(id, data) {
  return mintbirdRequest(`/bridge-pages/${id}`, 'PUT', data);
}

// ==================== SALES FUNNELS ====================

async function createFunnel(data) {
  return mintbirdRequest('/sales-funnels', 'POST', data);
}

async function updateFunnel(id, data) {
  return mintbirdRequest(`/sales-funnels/${id}`, 'PUT', data);
}

async function deleteFunnel(id) {
  return mintbirdRequest(`/sales-funnels/${id}`, 'DELETE');
}

async function getFunnelSteps(id) {
  return mintbirdRequest(`/sales-funnels/${id}/steps`);
}

async function addFunnelStep(data) {
  return mintbirdRequest('/steps', 'POST', data);
}

// ==================== SALES PAGES ====================

async function createSalesPage(data) {
  return mintbirdRequest('/sales-pages', 'POST', data);
}

async function updateSalesPage(id, data) {
  return mintbirdRequest(`/sales-pages/${id}`, 'PUT', data);
}

async function deleteSalesPage(id) {
  return mintbirdRequest(`/sales-pages/${id}`, 'DELETE');
}

async function linkProductToSalesPage(data) {
  return mintbirdRequest('/sales-pages/link-product', 'POST', data);
}

// ==================== AI GENERATION ====================

async function generateAISalesPage(data) {
  return mintbirdRequest('/sales-page/generate', 'POST', data);
}

async function checkGenerationStatus() {
  return mintbirdRequest('/sales-page/generation-status');
}

// ==================== PRODUCTS ====================

async function getProducts() {
  return mintbirdRequest('/products');
}

async function createProduct(data) {
  return mintbirdRequest('/products', 'POST', data);
}

async function updateProduct(id, data) {
  return mintbirdRequest(`/products/${id}`, 'PUT', data);
}

async function updateProductRedirect(id, data) {
  return mintbirdRequest(`/products/${id}/redirect-settings`, 'PUT', data);
}

async function updateProductImage(id, imageUrl) {
  return mintbirdRequest(`/products/${id}/image/url`, 'PUT', { image_url: imageUrl });
}

// ==================== STATS ====================

async function getStatsOverview() {
  return mintbirdRequest('/stats/overview');
}

async function getFunnelStats() {
  return mintbirdRequest('/stats/funnel');
}

async function getLeads() {
  return mintbirdRequest('/leads');
}

// ==================== EXPORTS ====================

module.exports = {
  // Helpers
  getSystemDomains,
  getDomains,
  getGroups,
  getVendors,
  getTemplates,
  getCategories,
  
  // Poplinks
  createPoplink,
  updatePoplink,
  getPoplinks,
  getPoplink,
  
  // Lead Pages
  createLeadPage,
  updateLeadPage,
  updateLeadPageField,
  cloneLeadPage,
  
  // Bridge Pages
  createBridgePage,
  updateBridgePage,
  
  // Sales Funnels
  createFunnel,
  updateFunnel,
  deleteFunnel,
  getFunnelSteps,
  addFunnelStep,
  
  // Sales Pages
  createSalesPage,
  updateSalesPage,
  deleteSalesPage,
  linkProductToSalesPage,
  
  // AI Generation
  generateAISalesPage,
  checkGenerationStatus,
  
  // Products
  getProducts,
  createProduct,
  updateProduct,
  updateProductRedirect,
  updateProductImage,
  
  // Stats
  getStatsOverview,
  getFunnelStats,
  getLeads,
  
  // Core
  mintbirdRequest
};
