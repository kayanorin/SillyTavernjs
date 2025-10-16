/**
 * API Helper Functions for SillyTavern
 * Utilities for API interactions
 */

/**
 * Creates a safe API request configuration
 * @param {string} endpoint - API endpoint
 * @param {object} options - Request options
 * @returns {object} Request configuration
 */
function createApiConfig(endpoint, options = {}) {
  return {
    url: endpoint,
    method: options.method || 'GET',
    headers: options.headers || {
      'Content-Type': 'application/json'
    },
    timeout: options.timeout || 30000
  };
}

/**
 * Formats API error messages
 * @param {Error} error - Error object
 * @returns {string} Formatted error message
 */
function formatApiError(error) {
  if (error.response) {
    return `API Error ${error.response.status}: ${error.response.statusText}`;
  } else if (error.request) {
    return 'Network Error: No response received';
  } else {
    return `Error: ${error.message}`;
  }
}

/**
 * Validates API response
 * @param {object} response - API response object
 * @returns {boolean} True if valid, false otherwise
 */
function validateApiResponse(response) {
  return response && 
         typeof response === 'object' && 
         response.status >= 200 && 
         response.status < 300;
}

/**
 * Delays execution for specified milliseconds
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} Promise that resolves after delay
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Export functions for use in SillyTavern
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createApiConfig,
    formatApiError,
    validateApiResponse,
    delay
  };
}
