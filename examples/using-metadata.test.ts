// Example of how to use the targetFile metadata in your tests

import { createTitleWithMetadata } from "../src/metadata";

// Example 1: Basic test with metadata
test(
  createTitleWithMetadata("should validate user profile data", {
    targetFile: "src/models/UserProfile.ts",
  }),
  () => {
    // Your test logic here
    expect(true).toBe(true);
  },
);

// Example 2: Test with complex metadata
test(
  createTitleWithMetadata("should handle empty profile data", {
    targetFile: "src/services/ProfileService.ts",
    priority: "high",
  }),
  () => {
    // Your test logic here
    expect(true).toBe(true);
  },
);

// Example 3: Test without metadata - will use the test file path as default
test("should handle profile permissions", () => {
  expect(true).toBe(true);
});

// Example 4: Describe block with metadata
describe(
  createTitleWithMetadata("API validation", {
    targetFile: "src/api/ValidationService.ts",
  }),
  () => {
    test("should validate API response format", () => {
      // This test inherits the metadata from the describe block
      expect(true).toBe(true);
    });

    test("should handle API errors", () => {
      // This test also inherits the metadata from the describe block
      expect(true).toBe(true);
    });
  },
);

// Example 5: Override metadata at the test level
describe(
  createTitleWithMetadata("User management", {
    targetFile: "src/models/User.ts",
  }),
  () => {
    test(
      createTitleWithMetadata("should create new user", {
        targetFile: "src/services/UserService.ts", // Override the inherited metadata
      }),
      () => {
        expect(true).toBe(true);
      },
    );

    test("should update existing user", () => {
      // This test uses the inherited metadata from the describe block
      expect(true).toBe(true);
    });
  },
);
