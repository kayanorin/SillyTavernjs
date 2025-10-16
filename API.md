# API Documentation

## Scripts

### Text Utils (`scripts/text-utils.js`)

#### `truncateText(text, maxLength)`
Truncates text to specified length with ellipsis.
- **Parameters:**
  - `text` (string): The text to truncate
  - `maxLength` (number): Maximum length of the text
- **Returns:** (string) Truncated text
- **Example:**
  ```javascript
  truncateText('Hello World!', 8) // Returns: 'Hello...'
  ```

#### `countWords(text)`
Counts words in a text string.
- **Parameters:**
  - `text` (string): The text to count words in
- **Returns:** (number) Word count
- **Example:**
  ```javascript
  countWords('Hello World') // Returns: 2
  ```

#### `capitalizeWords(text)`
Capitalizes the first letter of each word.
- **Parameters:**
  - `text` (string): The text to capitalize
- **Returns:** (string) Capitalized text
- **Example:**
  ```javascript
  capitalizeWords('hello world') // Returns: 'Hello World'
  ```

#### `cleanWhitespace(text)`
Removes extra whitespace from text.
- **Parameters:**
  - `text` (string): The text to clean
- **Returns:** (string) Cleaned text
- **Example:**
  ```javascript
  cleanWhitespace('hello   world') // Returns: 'hello world'
  ```

---

### Character Utils (`scripts/character-utils.js`)

#### `generateCharacterName(prefix)`
Generates a random character name.
- **Parameters:**
  - `prefix` (string, optional): Optional prefix for the name
- **Returns:** (string) Generated character name
- **Example:**
  ```javascript
  generateCharacterName('Dr.') // Returns: 'Dr. Alex'
  ```

#### `validateCharacter(character)`
Validates character data structure.
- **Parameters:**
  - `character` (object): Character object to validate
- **Returns:** (boolean) True if valid, false otherwise
- **Example:**
  ```javascript
  validateCharacter({ name: 'Test' }) // Returns: true
  ```

#### `formatCharacterInfo(character)`
Formats character information for display.
- **Parameters:**
  - `character` (object): Character object
- **Returns:** (string) Formatted character information
- **Example:**
  ```javascript
  formatCharacterInfo({ name: 'Test', description: 'A test character' })
  // Returns: 'Name: Test\nDescription: A test character'
  ```

---

### API Helpers (`scripts/api-helpers.js`)

#### `createApiConfig(endpoint, options)`
Creates a safe API request configuration.
- **Parameters:**
  - `endpoint` (string): API endpoint
  - `options` (object, optional): Request options
- **Returns:** (object) Request configuration
- **Example:**
  ```javascript
  createApiConfig('/api/test', { method: 'POST' })
  // Returns: { url: '/api/test', method: 'POST', headers: {...}, timeout: 30000 }
  ```

#### `formatApiError(error)`
Formats API error messages.
- **Parameters:**
  - `error` (Error): Error object
- **Returns:** (string) Formatted error message
- **Example:**
  ```javascript
  formatApiError(new Error('Test')) // Returns: 'Error: Test'
  ```

#### `validateApiResponse(response)`
Validates API response.
- **Parameters:**
  - `response` (object): API response object
- **Returns:** (boolean) True if valid, false otherwise
- **Example:**
  ```javascript
  validateApiResponse({ status: 200 }) // Returns: true
  ```

#### `delay(ms)`
Delays execution for specified milliseconds.
- **Parameters:**
  - `ms` (number): Milliseconds to delay
- **Returns:** (Promise) Promise that resolves after delay
- **Example:**
  ```javascript
  await delay(1000) // Waits 1 second
  ```

---

## Dictionaries

### Keywords (`dictionaries/keywords.json`)

Contains common keyword mappings:
- **greetings**: hello, hi, hey, good morning, good evening
- **farewells**: goodbye, bye, see you, good night
- **affirmations**: yes, ok, sure, alright
- **negations**: no, nope, not really, maybe later

**Example:**
```javascript
const keywords = require('./dictionaries/keywords.json');
console.log(keywords.greetings.hello); // "Hello! How can I assist you today?"
```

### Presets (`dictionaries/presets.json`)

Contains personality and scenario presets:
- **personalities**: friendly, professional, playful, wise
- **scenarios**: adventure, mystery, slice_of_life

**Example:**
```javascript
const presets = require('./dictionaries/presets.json');
console.log(presets.personalities.friendly.traits); // ["kind", "helpful", "empathetic"]
```

### Templates (`dictionaries/templates.json`)

Contains message and narrative templates:
- **messageTemplates**: greeting, introduction, question, response, farewell
- **narrativeTemplates**: action, emotion, thought, description
- **responseVariations**: acknowledgments, transitions, fillers

**Example:**
```javascript
const templates = require('./dictionaries/templates.json');
console.log(templates.messageTemplates.greeting); // "Hello {{name}}! {{greeting_message}}"
```

---

## Usage Examples

### Basic Usage

```javascript
// Import all utilities
const st = require('sillytavernjs');

// Use text utilities
const truncated = st.textUtils.truncateText('Long text', 10);
const wordCount = st.textUtils.countWords('Hello World');

// Use character utilities
const character = { name: 'Bot', description: 'Helpful assistant' };
const isValid = st.characterUtils.validateCharacter(character);

// Use dictionaries
const greeting = st.keywords.greetings.hello;
const personality = st.presets.personalities.friendly;
```

### Advanced Usage

```javascript
// Import specific utilities
const { textUtils, characterUtils } = require('sillytavernjs');

// Chain operations
const processedText = textUtils.cleanWhitespace(
  textUtils.capitalizeWords('hello   world')
);

// Generate and format character
const name = characterUtils.generateCharacterName('Dr.');
const character = { name, description: 'A scientist' };
console.log(characterUtils.formatCharacterInfo(character));
```
