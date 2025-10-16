# SillyTavernjs

A collection of custom JavaScript scripts and dictionary files for SillyTavern.

## 📁 Structure

```
SillyTavernjs/
├── scripts/          # JavaScript utility functions
│   ├── text-utils.js        # Text manipulation utilities
│   ├── character-utils.js   # Character management helpers
│   └── api-helpers.js       # API interaction utilities
├── dictionaries/     # Data files and lookup tables
│   ├── keywords.json        # Keyword mappings
│   ├── presets.json         # Character presets and scenarios
│   └── templates.json       # Message templates
└── examples/         # Usage examples
    └── example-usage.js     # Example code
```

## 🚀 Usage

### Scripts

The `scripts/` directory contains reusable JavaScript functions:

```javascript
// Example: Using text utilities
const textUtils = require('./scripts/text-utils');
const truncated = textUtils.truncateText('Long text...', 50);
const wordCount = textUtils.countWords('Hello world');
```

### Dictionaries

The `dictionaries/` directory contains JSON data files:

```javascript
// Example: Loading keywords
const keywords = require('./dictionaries/keywords.json');
console.log(keywords.greetings.hello); // "Hello! How can I assist you today?"
```

## 📚 Features

- **Text Utilities**: Text manipulation, truncation, word counting
- **Character Utilities**: Character validation, formatting, name generation
- **API Helpers**: API configuration, error handling, response validation
- **Keywords Dictionary**: Common greetings, farewells, affirmations
- **Presets Dictionary**: Personality types and scenario templates
- **Templates Dictionary**: Message and narrative templates

## 💡 Contributing

Feel free to add your own custom scripts and dictionaries:

1. Add scripts to the `scripts/` directory
2. Add dictionaries to the `dictionaries/` directory
3. Update documentation as needed

## 📖 Documentation

See individual README files in each directory for detailed information:
- [Scripts Documentation](scripts/README.md)
- [Dictionaries Documentation](dictionaries/README.md)

## 📝 License

MIT
