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

**Benefits of using describe blocks for metadata:**

- **DRY principle**: Set metadata once for multiple related tests
- **Consistency**: All tests in a suite point to the same target file
- **Maintainability**: Change the target file in one place
- **Cleaner test titles**: Individual test titles remain focused on behavior
- **Better organization**: Group related tests with shared metadata

### Metadata Merging and Priority

The system now supports **metadata merging** from multiple sources with a clear priority order:

```typescript
describe(
  createTitleWithMetadata("API tests", {
    targetFile: "src/api/BaseAPI.ts",
    environment: "test",
  }),
  () => {
    describe(
      createTitleWithMetadata("User endpoints", {
        targetFile: "src/api/UserAPI.ts",
        category: "user-management",
      }),
      () => {
        test(
          createTitleWithMetadata("should create user", {
            targetFile: "src/api/UserAPI.ts",
            priority: "high",
          }),
          () => {
            // This test will have merged metadata:
            // - targetFile: "src/api/UserAPI.ts" (from test - highest priority)
            // - category: "user-management" (from describe block)
            // - environment: "test" (from outer describe block)
            expect(createUser(userData)).toBeDefined();
          },
        );
      },
    );
  },
);
```

**Priority Order (highest to lowest):**

1. **Test title** - Highest priority, overrides all ancestors
2. **Inner describe blocks** - Override outer describe blocks
3. **Outer describe blocks** - Lowest priority, provide base metadata

**How merging works:**

- All metadata sources contribute to the final result
- Later sources (higher priority) override earlier sources
- Properties are merged using `Object.assign()`
- No metadata is lost - only overridden when conflicts exist

### Debug Information

When metadata is merged from multiple sources, the system logs debug information:

```typescript
// Console output when multiple sources are merged:
>>> Merging metadata from multiple sources: ['ancestor[0]', 'ancestor[1]', 'test title']
>>> Final merged metadata: { targetFile: 'src/api/UserAPI.ts', category: 'user-management', priority: 'high', environment: 'test' }
```

For advanced debugging, you can use the `extractMetadataWithDebug` function:

```typescript
import { extractMetadataWithDebug } from "jest-pr-reporter";

const { metadata, debug } = extractMetadataWithDebug(ancestorTitles, testTitle);
console.log(">>> Metadata sources:", debug.sources);
console.log(">>> Merge order:", debug.mergeOrder);
console.log(">>> Individual metadata:", debug.individualMetadata);
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
- **Smart merging** - All metadata sources contribute with proper priority
- **No data loss** - Properties are merged, not replaced

## How It Works

When you use `createTitleWithMetadata`, the reporter will:

1. Encode the metadata as JSON in the test title after `::meta::`
2. **Collect metadata from all sources** (describe blocks and test titles)
3. **Merge metadata with proper priority**:
   - Test title has highest priority
   - Inner describe blocks override outer ones
   - All properties are preserved and merged
4. Automatically extract and use the merged metadata when generating reports
5. Display "🎯 **Fix needed in:** [filename]" above the error details
6. Link to the specified file instead of just the test file
7. Fall back to the test file path if no targetFile is specified
8. Log the metadata merge process in debug output for troubleshooting
9. Hide the metadata from displayed test titles in reports

## Utility Functions

### `createTitleWithMetadata(title, metadata)`

Creates a test title with embedded metadata.

### `parseTitleMetadata(title)`

Parses a title to extract metadata and clean title.

### `extractMetadataFromAncestors(ancestorTitles, testTitle?)`

Extracts and merges metadata from an array of ancestor titles and optionally from the test title itself. All sources contribute to the final metadata with proper priority ordering.

### `extractMetadataWithDebug(ancestorTitles, testTitle?)`

Extracts metadata with detailed debug information about the merge process, including sources, individual metadata objects, and merge order.

### `cleanAncestorTitles(ancestorTitles)`

Removes metadata from ancestor titles for clean display.

## Important Notes

- **Metadata is encoded in titles**: The metadata becomes part of the test title, so it's visible in Jest's output but automatically cleaned in reports
- **Smart inheritance**: Tests inherit metadata from all ancestor describe blocks
- **Priority-based merging**: Later metadata sources override earlier ones
- **No data loss**: All metadata properties are preserved and merged
- **Debug logging**: The system logs when metadata is merged from multiple sources
