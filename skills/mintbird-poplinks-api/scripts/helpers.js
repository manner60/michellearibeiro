/**
 * MintBird API Helper Functions
 * Utility functions for common operations
 */

const api = require('./mintbird-api.js');

// Find a system domain (prefer redeyedeal.com or first available)
async function getDefaultSystemDomain() {
  try {
    const result = await api.getSystemDomains();
    const domains = result.data?.domains || [];
    
    // Prefer redeyedeal.com if available
    const preferred = domains.find(d => d.domain?.includes('redeyedeal.com'));
    if (preferred) return preferred;
    
    // Otherwise return first available
    return domains[0] || null;
  } catch (e) {
    return null;
  }
}

// Find a personal domain (prefer aiopenclawskills.com or first available)
async function getDefaultPersonalDomain() {
  try {
    const result = await api.getDomains();
    const domains = result.data?.domains || [];
    
    // Prefer aiopenclawskills.com if available
    const preferred = domains.find(d => d.domain?.includes('aiopenclawskills.com'));
    if (preferred) return preferred;
    
    // Otherwise return first available
    return domains[0] || null;
  } catch (e) {
    return null;
  }
}

// Get first available group
async function getDefaultGroup() {
  try {
    const result = await api.getGroups();
    const groups = result.data?.groups || [];
    return groups[0] || null;
  } catch (e) {
    return null;
  }
}

// Get first available vendor
async function getDefaultVendor() {
  try {
    const result = await api.getVendors();
    const vendors = result.data?.vendors || [];
    return vendors[0] || null;
  } catch (e) {
    return null;
  }
}

// Get first available template
async function getDefaultTemplate() {
  try {
    const result = await api.getTemplates();
    const templates = result.data?.templates || [];
    return templates[0] || null;
  } catch (e) {
    return null;
  }
}

// Format API response for display
function formatResponse(action, endpoint, inputs, result) {
  const output = {
    action,
    endpoint,
    inputs: sanitizeInputs(inputs),
    result: result.status ? 'Success' : 'Failed',
    output: extractKeyData(result),
    nextStep: suggestNextStep(action, result)
  };
  
  return output;
}

// Remove sensitive data from inputs
function sanitizeInputs(inputs) {
  const safe = { ...inputs };
  delete safe.api_key;
  delete safe.password;
  delete safe.token;
  return safe;
}

// Extract key data from API response
function extractKeyData(result) {
  const data = result.data || result;
  
  // Handle different response structures
  if (data.product) {
    return {
      id: data.product.id,
      name: data.product.name,
      price: data.product.price,
      link: data.product.link?.system_domain + '/' + data.product.link?.keyword
    };
  }
  
  if (data.poplink) {
    return {
      id: data.poplink.id,
      name: data.poplink.name,
      url: data.poplink.visible_url,
      fullUrl: data.poplink.system_domain + '/' + data.poplink.visible_url
    };
  }
  
  if (data.lead_page || data.bridge_page) {
    const page = data.lead_page || data.bridge_page;
    return {
      id: page.id,
      name: page.name,
      slug: page.slug
    };
  }
  
  if (data.sales_funnel) {
    return {
      id: data.sales_funnel.id,
      name: data.sales_funnel.name
    };
  }
  
  if (data.sales_page) {
    return {
      id: data.sales_page.id,
      name: data.sales_page.name,
      url: data.sales_page.system_domain + '/' + data.sales_page.keyword
    };
  }
  
  if (data.job_key) {
    return {
      jobKey: data.job_key,
      status: 'Processing'
    };
  }
  
  return data;
}

// Suggest next step based on action
function suggestNextStep(action, result) {
  const steps = {
    'create poplink': 'Test the link or create tracking pixels',
    'create lead page': 'Customize page content, headlines, and images',
    'create bridge page': 'Add pre-sell content and link to offer',
    'create funnel': 'Add funnel steps and link pages',
    'create sales page': 'Customize design and link to product',
    'generate AI sales page': 'Check generation status in a few moments',
    'create product': 'Set up payment gateway and fulfillment',
    'default': 'Review the created asset in your MintBird dashboard'
  };
  
  return steps[action.toLowerCase()] || steps.default;
}

// Format error for display
function formatError(error) {
  return {
    result: 'Failed',
    status: error.status || 0,
    endpoint: error.endpoint,
    message: error.message || 'Unknown error',
    details: error.data || null,
    suggestion: getErrorSuggestion(error.status)
  };
}

// Get suggestion based on error status
function getErrorSuggestion(status) {
  const suggestions = {
    401: 'Check your API key in credentials/titanium-api-keys.txt',
    404: 'Verify the resource ID exists',
    422: 'Check required fields and validation rules',
    500: 'Retry the request or contact MintBird support'
  };
  
  return suggestions[status] || 'Review the error details and try again';
}

// Validate URL format
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Generate slug from name
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Truncate text
function truncate(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

module.exports = {
  getDefaultSystemDomain,
  getDefaultPersonalDomain,
  getDefaultGroup,
  getDefaultVendor,
  getDefaultTemplate,
  formatResponse,
  formatError,
  isValidUrl,
  generateSlug,
  truncate
};
