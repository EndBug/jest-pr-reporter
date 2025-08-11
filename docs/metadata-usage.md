# Using Metadata in Jest PR Reporter

The Jest PR Reporter supports custom metadata to specify which files actually need to be fixed when tests fail. This is especially useful when the test file path doesn't match the file that needs changes.

## Quick Start

### Basic Usage

Simply set the metadata property on your test object:

```typescript
test("should validate user data", () => {
  (test as any).metadata = {
    targetFile: "src/models/User.ts",
  };

  // Your test logic here
  expect(true).toBe(true);
});
```

### Advanced Metadata

You can add any custom properties you want:

```typescript
test("should handle complex validation", () => {
  (test as any).metadata = {
    targetFile: "src/services/ValidationService.ts",
    priority: "high",
    category: "security",
    estimatedTime: "2h",
  };

  expect(complexValidation(data)).toBe(true);
});
```

## Configuration

### TypeScript Configuration

To avoid type casting, you can extend Jest's types in your project:

```typescript
// types/jest.d.ts
declare global {
  namespace jest {
    interface It {
      metadata?: {
        targetFile?: string;
        [key: string]: any;
      };
    }
  }
}

export {};
```

Then you can use it without type casting:

```typescript
test("should work", () => {
  test.metadata = { targetFile: "src/types/User.ts" };
  expect(true).toBe(true);
});
```

## Examples

### Basic Usage

```typescript
describe("User validation", () => {
  test("should validate email format", () => {
    (test as any).metadata = {
      targetFile: "src/validators/EmailValidator.ts",
    };
    expect(validateEmail("test@example.com")).toBe(true);
  });
});
```

### Multiple Tests with Different Targets

```typescript
describe("API endpoints", () => {
  test("should validate user creation", () => {
    (test as any).metadata = {
      targetFile: "src/controllers/UserController.ts",
    };
    expect(createUser(userData)).toBeDefined();
  });

  test("should handle validation errors", () => {
    (test as any).metadata = {
      targetFile: "src/middleware/ValidationMiddleware.ts",
    };
    expect(handleValidationError(error)).toBeDefined();
  });
});
```

## Available Metadata Properties

- `targetFile?: string` - The file path that needs to be fixed
- `[key: string]: any` - Any additional custom properties

## Benefits

- **Flexible** - Support for custom properties beyond just targetFile
- **Easy to use** - Simple object assignment
- **Backward compatible** - Works with existing tests
- **Debug friendly** - Metadata is logged during test runs

## How It Works

When you set `test.metadata.targetFile`, the reporter will:

1. Display "🎯 **Fix needed in:** [filename]" above the error details
2. Link to the specified file instead of just the test file
3. Fall back to the test file path if no targetFile is specified
4. Log the metadata in debug output for troubleshooting
