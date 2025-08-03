const { nanoid } = require('nanoid');

/**
 * Generate a random short code for URL shortening
 * @param {number} length - Length of the short code (default: 6)
 * @returns {string} - Random alphanumeric short code
 */
function generateShortCode(length = 6) {
  return nanoid(length);
}

/**
 * Validate if a short code is valid
 * @param {string} code - The short code to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidShortCode(code) {
  // Check if code is alphanumeric and within length limits
  const validPattern = /^[a-zA-Z0-9]{1,10}$/;
  return validPattern.test(code);
}

/**
 * Generate a custom short code (for future use)
 * @param {string} customCode - Custom code provided by user
 * @returns {string|null} - Validated custom code or null if invalid
 */
function generateCustomShortCode(customCode) {
  if (!customCode || !isValidShortCode(customCode)) {
    return null;
  }
  return customCode.toLowerCase();
}

module.exports = {
  generateShortCode,
  isValidShortCode,
  generateCustomShortCode
};