/**
 * Example Usage of SillyTavern Scripts
 * This file demonstrates how to use the utility functions
 */

// Import utilities (if using Node.js)
// const textUtils = require('../scripts/text-utils');
// const characterUtils = require('../scripts/character-utils');
// const apiHelpers = require('../scripts/api-helpers');

// Example 1: Using Text Utilities
console.log('=== Text Utilities Example ===');

const longText = 'This is a very long text that needs to be truncated for display purposes.';
console.log('Original:', longText);
// console.log('Truncated:', textUtils.truncateText(longText, 30));

const sampleText = 'Hello world from SillyTavern!';
// console.log('Word count:', textUtils.countWords(sampleText));
// console.log('Capitalized:', textUtils.capitalizeWords('hello world'));

// Example 2: Using Character Utilities
console.log('\n=== Character Utilities Example ===');

const character = {
  name: 'Assistant',
  description: 'A helpful AI character',
  personality: 'Friendly and knowledgeable'
};

// console.log('Character validation:', characterUtils.validateCharacter(character));
// console.log('Character info:\n', characterUtils.formatCharacterInfo(character));
// console.log('Generated name:', characterUtils.generateCharacterName('Mr.'));

// Example 3: Using API Helpers
console.log('\n=== API Helpers Example ===');

const apiConfig = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  timeout: 5000
};

// console.log('API Config:', apiHelpers.createApiConfig('/api/chat', apiConfig));

// Example 4: Loading Dictionary Data
console.log('\n=== Dictionary Data Example ===');

// In a real implementation, you would load JSON files:
// const keywords = require('../dictionaries/keywords.json');
// console.log('Greeting for "hello":', keywords.greetings.hello);

// const presets = require('../dictionaries/presets.json');
// console.log('Friendly personality:', presets.personalities.friendly);

console.log('\nNote: Uncomment the require statements and function calls to test!');
