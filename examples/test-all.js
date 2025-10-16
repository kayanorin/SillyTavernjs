/**
 * Comprehensive Test for All SillyTavern Scripts and Dictionaries
 */

console.log('🧪 Testing SillyTavern Scripts and Dictionaries\n');

// Test Text Utils
console.log('=== Text Utils Tests ===');
const textUtils = require('../scripts/text-utils');

console.assert(
  textUtils.truncateText('Hello World', 8) === 'Hello...',
  'truncateText should truncate correctly'
);
console.assert(
  textUtils.countWords('Hello World Test') === 3,
  'countWords should count correctly'
);
console.assert(
  textUtils.capitalizeWords('hello world') === 'Hello World',
  'capitalizeWords should capitalize correctly'
);
console.assert(
  textUtils.cleanWhitespace('hello   world') === 'hello world',
  'cleanWhitespace should clean correctly'
);
console.log('✅ Text Utils: All tests passed\n');

// Test Character Utils
console.log('=== Character Utils Tests ===');
const characterUtils = require('../scripts/character-utils');

const validChar = { name: 'Test' };
const invalidChar = { description: 'No name' };

console.assert(
  characterUtils.validateCharacter(validChar) === true,
  'validateCharacter should validate correctly'
);
console.assert(
  characterUtils.validateCharacter(invalidChar) === false,
  'validateCharacter should reject invalid characters'
);
console.assert(
  characterUtils.generateCharacterName().length > 0,
  'generateCharacterName should return a name'
);
console.assert(
  characterUtils.formatCharacterInfo(validChar).includes('Test'),
  'formatCharacterInfo should format correctly'
);
console.log('✅ Character Utils: All tests passed\n');

// Test API Helpers
console.log('=== API Helpers Tests ===');
const apiHelpers = require('../scripts/api-helpers');

const config = apiHelpers.createApiConfig('/test');
console.assert(
  config.url === '/test',
  'createApiConfig should set URL correctly'
);
console.assert(
  apiHelpers.validateApiResponse({ status: 200 }) === true,
  'validateApiResponse should validate 200 status'
);
console.assert(
  apiHelpers.validateApiResponse({ status: 404 }) === false,
  'validateApiResponse should reject 404 status'
);
console.assert(
  apiHelpers.formatApiError(new Error('Test error')).includes('Error'),
  'formatApiError should format errors'
);
console.log('✅ API Helpers: All tests passed\n');

// Test Dictionaries
console.log('=== Dictionary Tests ===');
const keywords = require('../dictionaries/keywords.json');
const presets = require('../dictionaries/presets.json');
const templates = require('../dictionaries/templates.json');

console.assert(
  keywords.greetings.hello !== undefined,
  'keywords should have greetings'
);
console.assert(
  presets.personalities.friendly !== undefined,
  'presets should have personalities'
);
console.assert(
  templates.messageTemplates.greeting !== undefined,
  'templates should have message templates'
);
console.log('✅ Dictionaries: All tests passed\n');

console.log('🎉 All tests passed successfully!');
