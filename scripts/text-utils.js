/**
 * Text Utilities for SillyTavern
 * Collection of helper functions for text manipulation
 */

/**
 * Truncates text to specified length with ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length of the text
 * @returns {string} Truncated text
 */
function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Counts words in a text string
 * @param {string} text - The text to count words in
 * @returns {number} Word count
 */
function countWords(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).length;
}

/**
 * Capitalizes the first letter of each word
 * @param {string} text - The text to capitalize
 * @returns {string} Capitalized text
 */
function capitalizeWords(text) {
  if (!text) return '';
  return text.replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Removes extra whitespace from text
 * @param {string} text - The text to clean
 * @returns {string} Cleaned text
 */
function cleanWhitespace(text) {
  if (!text) return '';
  return text.replace(/\s+/g, ' ').trim();
}

// Export functions for use in SillyTavern
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    truncateText,
    countWords,
    capitalizeWords,
    cleanWhitespace
  };
}
