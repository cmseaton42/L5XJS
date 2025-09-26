

<p align="center"><img width="250" src="https://i.imgur.com/wEVLMKA.png" alt="L5XJS Logo"></p>

<div align="center">
  <p>
  <a href="https://www.npmjs.com/package/l5x-js"><img src="https://img.shields.io/npm/v/l5x-js.svg?style=flat-square" alt="npm" /></a>
  <a href="https://gitter.im/L5XJS/Lobby"><img src="https://img.shields.io/gitter/room/L5XJS/nw.js.svg?style=flat-square" alt="Gitter" /></a>
  <a href="https://github.com/cmseaton42/L5XJS/blob/master/LICENSE"><img src="https://img.shields.io/github/license/cmseaton42/L5XJS.svg?style=flat-square" alt="license" /></a>
</p>
</div>

# L5XJS

A modern TypeScript library for building and parsing Allen Bradley *.L5X* files to automate PLC code generation.

## 🚀 Version 2.0 - Now with TypeScript!

This major release brings full TypeScript support, modern ES2020 syntax, improved type safety, and a cleaner API.

## Prerequisites

- Node.js 16+ 
- TypeScript 4.5+ (for development)

## Installation

```bash
npm install l5x-js
```

## Quick Start

```typescript
import { Document, Tag } from 'l5x-js';

// Create a new L5X document
const doc = new Document();

// Create tags
const boolTag = new Tag({
  name: 'StartButton',
  datatype: 'BOOL',
  description: 'Start button input'
});

const intTag = new Tag({
  name: 'Counter',
  datatype: 'DINT',
  description: 'Production counter'
});

// Add tags to document
doc.addTag(boolTag);
doc.addTag(intTag);

// Generate L5X XML
console.log(doc.toString());
```

## API Documentation

### Document Class

The main class for creating and manipulating L5X files.

#### Constructor

```typescript
new Document(filepath?: string)
```

**Parameters:**
- `filepath` (optional): Path to existing L5X file to load

**Examples:**
```typescript
// Create new document
const doc = new Document();

// Load existing document
const doc = new Document('./existing.L5X');
```

#### Methods

##### `addTag(tag: Tag): void`

Adds a tag to the controller.

```typescript
const tag = new Tag({ name: 'MyTag', datatype: 'BOOL' });
doc.addTag(tag);
```

##### `getTags(): Tag[]`

Returns all tags in the document.

```typescript
const tags = doc.getTags();
tags.forEach(tag => console.log(tag.name));
```

##### `toString(): string`

Generates the L5X XML string.

```typescript
const xmlContent = doc.toString();
```

##### `findOne(type: string, attributes?: object): XmlElement | null`

Finds the first element of specified type.

```typescript
const controller = doc.findOne('Controller');
const specificTag = doc.findOne('Tag', { Name: 'MyTag' });
```

##### `findAll(type: string, attributes?: object): XmlElement[]`

Finds all elements of specified type.

```typescript
const allTags = doc.findAll('Tag');
const boolTags = doc.findAll('Tag', { DataType: 'BOOL' });
```

### Tag Class

Represents PLC tags with type safety and validation.

#### Constructor

```typescript
new Tag(options: TagOptions)
```

**TagOptions Interface:**
```typescript
interface TagOptions {
  name: string;           // Tag name
  datatype: string;       // PLC data type (BOOL, DINT, REAL, etc.)
  description?: string;   // Optional description
  alias?: string;         // Optional alias reference
  safety?: boolean;       // Safety tag flag
  dimension?: number;     // Array dimension
}
```

**Examples:**
```typescript
// Basic tag
const tag = new Tag({
  name: 'Motor1_Run',
  datatype: 'BOOL'
});

// Tag with all options
const tag = new Tag({
  name: 'Temperature',
  datatype: 'REAL',
  description: 'Reactor temperature in °C',
  safety: false,
  dimension: 10
});

// Alias tag
const alias = new Tag({
  name: 'START_BTN',
  datatype: 'BOOL',
  alias: 'Local:1:I.Data.0'
});
```

#### Properties

##### `name: string` (readonly)
Gets the tag name.

##### `datatype: string` (readonly)
Gets the tag data type.

##### `description: string | undefined` (readonly)
Gets the tag description.

#### Static Methods

##### `Tag.isTag(obj: unknown): boolean`
Type guard to check if object is a Tag instance.

```typescript
if (Tag.isTag(someObject)) {
  console.log(someObject.name); // TypeScript knows it's a Tag
}
```

### Element Class

Base class for all L5X elements with XML manipulation capabilities.

#### Methods

##### `findOne(type: string, attributes?: object, ignore?: string[], searchTree?: XmlElement): XmlElement | null`

Finds first matching element.

**Parameters:**
- `type`: Element type to search for
- `attributes`: Optional attribute filters
- `ignore`: Array of element names to ignore
- `searchTree`: Optional subtree to search in

##### `findAll(type: string, attributes?: object, ignore?: string[], searchTree?: XmlElement): XmlElement[]`

Finds all matching elements.

##### `toString(): string`

Converts element to XML string.

### Utility Functions

```typescript
import { Util } from 'l5x-js';

// Generate hash
const id = Util.hash('some-string');

// Validation helpers
Util.validateString(value, 'parameterName');
Util.validateObject(value, 'parameterName');
```

## Type Definitions

The library includes comprehensive TypeScript definitions:

```typescript
interface XmlElement {
  type?: string;
  name?: string;
  attributes?: Record<string, string | number | boolean>;
  elements?: XmlElement[];
  text?: string;
}

interface XmlDocument {
  declaration?: {
    attributes: {
      version: string;
      encoding: string;
      standalone?: string;
    };
  };
  elements: XmlElement[];
}
```

## Common PLC Data Types

| Type | Description | Example |
|------|-------------|---------|
| `BOOL` | Boolean | `true`/`false` |
| `SINT` | Short Integer | `-128` to `127` |
| `INT` | Integer | `-32,768` to `32,767` |
| `DINT` | Double Integer | `-2,147,483,648` to `2,147,483,647` |
| `REAL` | Floating Point | `3.14159` |
| `STRING` | Text String | `"Hello World"` |

## Error Handling

The library provides descriptive error messages with type information:

```typescript
try {
  const tag = new Tag({
    name: 123, // Invalid type
    datatype: 'BOOL'
  });
} catch (error) {
  console.log(error.message); // "Tag name expected type <string> but got <number>"
}
```

## Migration from v1.x

### Breaking Changes

1. **Constructor Changes**: Tag constructor now uses options object
   ```typescript
   // v1.x
   new Tag('MyTag', 'BOOL', 'Description');
   
   // v2.x
   new Tag({ name: 'MyTag', datatype: 'BOOL', description: 'Description' });
   ```

2. **Import Changes**: Now uses ES6 imports
   ```typescript
   // v1.x
   const { Document, Tag } = require('l5x-js');
   
   // v2.x
   import { Document, Tag } from 'l5x-js';
   ```

3. **TypeScript**: Full type safety - invalid usage caught at compile time

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build for production
npm run build

# Lint code
npm run lint
```

## Built With

* [TypeScript](https://www.typescriptlang.org/) - Language & Type Safety
* [Node.js](https://nodejs.org/en/) - Runtime Environment
* [xml-js](https://www.npmjs.com/package/xml-js) - XML Processing
* [Jest](https://jestjs.io/) - Testing Framework

## Contributors

* **Canaan Seaton** - *Original Author* - [GitHub](https://github.com/cmseaton42) - [Website](http://www.canaanseaton.com/)

Want to contribute? Check out our [Contributing Guide](https://github.com/cmseaton42/L5XJS/blob/master/CONTRIBUTING.md)!

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/cmseaton42/L5XJS/blob/master/LICENSE) file for details.
