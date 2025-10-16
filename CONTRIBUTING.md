# Contributing to SillyTavernjs

Thank you for your interest in contributing! This guide will help you add your own custom scripts and dictionaries.

## 📝 Adding Scripts

### Creating a New Script

1. Create a new `.js` file in the `scripts/` directory
2. Follow this template:

```javascript
/**
 * Your Script Name
 * Brief description of what it does
 */

/**
 * Function description
 * @param {type} paramName - Parameter description
 * @returns {type} Return value description
 */
function yourFunction(paramName) {
  // Your code here
  return result;
}

// Export for use in SillyTavern
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    yourFunction
  };
}
```

3. Document your functions with JSDoc comments
4. Export your functions using CommonJS format

### Script Guidelines

- Keep functions focused and single-purpose
- Use descriptive names for functions and variables
- Add proper error handling
- Include JSDoc documentation
- Test your functions before committing

## 📚 Adding Dictionaries

### Creating a New Dictionary

1. Create a new `.json` file in the `dictionaries/` directory
2. Use a clear, hierarchical structure:

```json
{
  "category": {
    "key": "value",
    "anotherKey": "anotherValue"
  }
}
```

### Dictionary Guidelines

- Use clear, descriptive keys
- Organize data hierarchically
- Keep values consistent in type
- Validate JSON syntax before committing
- Document the purpose of each dictionary

## 🧪 Testing

Before committing, test your additions:

```bash
# Test your script
node -e "const myScript = require('./scripts/my-script.js'); console.log(myScript.myFunction());"

# Test your dictionary
node -e "const myDict = require('./dictionaries/my-dict.json'); console.log(myDict);"

# Run the comprehensive test
node examples/test-all.js
```

## 📖 Documentation

Update documentation when adding new features:

1. Add your script/dictionary to the main README.md
2. Update the relevant directory README.md
3. Add usage examples if applicable

## 🔄 Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Add your scripts/dictionaries
4. Test your changes
5. Update documentation
6. Submit a pull request

## 💡 Ideas for Contributions

- Date/time utilities
- Random generators
- Validation helpers
- Data transformation functions
- Language-specific dictionaries
- Theme presets
- Response variations

## 📧 Questions?

If you have questions or need help, please open an issue!
