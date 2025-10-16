/**
 * SillyTavernjs - Main Entry Point
 * Exports all utility functions and dictionaries
 */

// Export all script utilities
const textUtils = require('./scripts/text-utils');
const characterUtils = require('./scripts/character-utils');
const apiHelpers = require('./scripts/api-helpers');

// Export dictionaries
const keywords = require('./dictionaries/keywords.json');
const presets = require('./dictionaries/presets.json');
const templates = require('./dictionaries/templates.json');

module.exports = {
  // Scripts
  textUtils,
  characterUtils,
  apiHelpers,
  
  // Dictionaries
  keywords,
  presets,
  templates
};
