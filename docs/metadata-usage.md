# Using Metadata in Jest PR Reporter

The Jest PR Reporter supports custom metadata to specify which files actually need to be fixed when tests fail. This is especially useful when the test file path doesn't match the file that needs changes.

## Quick Start

### Basic Usage

Use the `createTitleWithMetadata` utility function to create a test title with embedded metadata:

```typescript
import { createTitleWithMetadata } from "jest-pr-reporter";

test(
  createTitleWithMetadata("should validate user data", {
    targetFile: "src/models/User.ts",
  }),
  () => {
    // Your test logic here
    expect(true).toBe(true);
  },
);
```

### Advanced Metadata

You can add any custom properties you want:

```typescript
test(
  createTitleWithMetadata("should handle complex validation", {
    targetFile: "src/services/ValidationService.ts",
    priority: "high",
    category: "security",
    estimatedTime: "2h",
  }),
  () => {
    expect(complexValidation(data)).toBe(true);
  },
);
```

## Configuration

### Import the Utilities

```typescript
import {
  createTitleWithMetadata,
  parseTitleMetadata,
  extractMetadataFromAncestors,
  cleanAncestorTitles,
} from "jest-pr-reporter";
```

## Examples

### Basic Usage

```typescript
import { createTitleWithMetadata } from "jest-pr-reporter";

describe("User validation", () => {
  test(
    createTitleWithMetadata("should validate email format", {
      targetFile: "src/validators/EmailValidator.ts",
    }),
    () => {
      expect(validateEmail("test@example.com")).toBe(true);
    },
  );
});
```

### Multiple Tests with Different Targets

```typescript
describe("API endpoints", () => {
  test(
    createTitleWithMetadata("should validate user creation", {
      targetFile: "src/controllers/UserController.ts",
    }),
    () => {
      expect(createUser(userData)).toBeDefined();
    },
  );

  test(
    createTitleWithMetadata("should handle validation errors", {
      targetFile: "src/middleware/ValidationMiddleware.ts",
    }),
    () => {
      expect(handleValidationError(error)).toBeDefined();
    },
  );
});
```

### Using in describe blocks

You can also add metadata to describe blocks, which will be inherited by all tests within:

```typescript
describe(
  createTitleWithMetadata("User validation", {
    targetFile: "src/validators/UserValidator.ts",
  }),
  () => {
    test("should validate email", () => {
      // This test will inherit the metadata from the describe block
      expect(validateEmail("test@example.com")).toBe(true);
    });
  },
);
```

## Available Metadata Properties

- `targetFile?: string` - The file path that needs to be fixed
- `[key: string]: any` - Any additional custom properties

## Benefits

- **Flexible** - Support for custom properties beyond just targetFile
- **Easy to use** - Simple function call to create titles with metadata
- **Proper Jest integration** - Works with Jest's test structure
- **Debug friendly** - Metadata is logged during test runs
- **Clean output** - Metadata is automatically hidden from test titles in reports

## How It Works

When you use `createTitleWithMetadata`, the reporter will:

1. Encode the metadata as JSON in the test title after `::meta::`
2. Automatically extract and use the metadata when generating reports
3. Display "🎯 **Fix needed in:** [filename]" above the error details
4. Link to the specified file instead of just the test file
5. Fall back to the test file path if no targetFile is specified
6. Log the metadata in debug output for troubleshooting
7. Hide the metadata from displayed test titles in reports

## Utility Functions

### `createTitleWithMetadata(title, metadata)`

Creates a test title with embedded metadata.

### `parseTitleMetadata(title)`

Parses a title to extract metadata and clean title.

### `extractMetadataFromAncestors(ancestorTitles)`

Extracts metadata from an array of ancestor titles (useful for describe blocks).

### `cleanAncestorTitles(ancestorTitles)`

Removes metadata from ancestor titles for clean display.

## Important Notes

- **Metadata is encoded in titles**: The metadata becomes part of the test title, so it's visible in Jest's output but automatically cleaned in reports
- **Inheritance**: Tests inherit metadata from their parent describe blocks
- **Fallback**: If no metadata is found, the reporter falls back to the test file path
- **JSON format**: Metadata must be valid JSON (strings need quotes, etc.)
