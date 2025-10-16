/**
 * Character Utilities for SillyTavern
 * Helper functions for managing character data
 */

/**
 * Generates a random character name
 * @param {string} prefix - Optional prefix for the name
 * @returns {string} Generated character name
 */
function generateCharacterName(prefix = '') {
  const names = ['Alex', 'Sam', 'Jordan', 'Morgan', 'Casey', 'Riley', 'Taylor', 'Avery'];
  const randomName = names[Math.floor(Math.random() * names.length)];
  return prefix ? `${prefix} ${randomName}` : randomName;
}

/**
 * Validates character data structure
 * @param {object} character - Character object to validate
 * @returns {boolean} True if valid, false otherwise
 */
function validateCharacter(character) {
  if (!character || typeof character !== 'object') {
    return false;
  }
  
  const requiredFields = ['name'];
  return requiredFields.every(field => character.hasOwnProperty(field));
}

/**
 * Formats character information for display
 * @param {object} character - Character object
 * @returns {string} Formatted character information
 */
function formatCharacterInfo(character) {
  if (!validateCharacter(character)) {
    return 'Invalid character data';
  }
  
  let info = `Name: ${character.name}`;
  if (character.description) {
    info += `\nDescription: ${character.description}`;
  }
  if (character.personality) {
    info += `\nPersonality: ${character.personality}`;
  }
  
  return info;
}

// Export functions for use in SillyTavern
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateCharacterName,
    validateCharacter,
    formatCharacterInfo
  };
}
