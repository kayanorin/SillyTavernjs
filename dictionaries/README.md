# Dictionaries

This directory contains dictionary files with lookup data for SillyTavern.

## Usage

Dictionary files can be in JSON or JavaScript format and contain data structures for:
- Character presets
- Response templates
- Keyword mappings
- Configuration presets

## Example Dictionaries

- `keywords.json` - Keyword mappings for quick responses
- `presets.json` - Character personality presets
- `templates.json` - Message templates

## Format

### JSON Format
```json
{
  "key1": "value1",
  "key2": "value2"
}
```

### JavaScript Format
```javascript
module.exports = {
  key1: "value1",
  key2: "value2"
};
```
