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

// Example 2: Test with multiple metadata properties
test(
  createTitleWithMetadata("should handle complex validation", {
    targetFile: "src/services/ValidationService.ts",
    priority: "high",
    category: "security",
    estimatedTime: "2h",
  }),
  () => {
    expect(true).toBe(true);
  },
);

// Example 3: Test with nested metadata properties
test(
  createTitleWithMetadata("should process user data", {
    targetFile: "src/processors/UserProcessor.ts",
    config: {
      batchSize: 100,
      timeout: 5000,
    },
    tags: ["user", "processing"],
  }),
  () => {
    expect(true).toBe(true);
  },
);

// Example 4: Describe block with metadata (inherited by all tests)
describe(
  createTitleWithMetadata("API validation", {
    targetFile: "src/api/ValidationService.ts",
    version: "v1",
    environment: "test",
  }),
  () => {
    test("should validate API response format", () => {
      // This test inherits the metadata from the describe block:
      // - targetFile: "src/api/ValidationService.ts"
      // - version: "v1"
      // - environment: "test"
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
    category: "user-management",
    priority: "medium",
  }),
  () => {
    test(
      createTitleWithMetadata("should create new user", {
        targetFile: "src/services/UserService.ts", // Override the inherited targetFile
        priority: "high", // Override the inherited priority
        requiresAuth: true, // Add new property
      }),
      () => {
        // This test has merged metadata:
        // - targetFile: "src/services/UserService.ts" (from test - overrides describe)
        // - priority: "high" (from test - overrides describe)
        // - requiresAuth: true (from test - new property)
        // - category: "user-management" (from describe - preserved)
        expect(true).toBe(true);
      },
    );

    test("should update existing user", () => {
      // This test uses the inherited metadata from the describe block:
      // - targetFile: "src/models/User.ts"
      // - category: "user-management"
      // - priority: "medium"
      expect(true).toBe(true);
    });
  },
);

// Example 6: Nested describe blocks with metadata inheritance
describe(
  createTitleWithMetadata("Database operations", {
    targetFile: "src/database/BaseDB.ts",
    connectionPool: 10,
    retryAttempts: 3,
  }),
  () => {
    describe(
      createTitleWithMetadata("User database", {
        targetFile: "src/database/UserDB.ts", // Override targetFile
        table: "users",
        retryAttempts: 5, // Override retryAttempts
      }),
      () => {
        test("should find user by ID", () => {
          // This test has metadata merged from both describe blocks:
          // - targetFile: "src/database/UserDB.ts" (from inner describe - higher priority)
          // - table: "users" (from inner describe)
          // - retryAttempts: 5 (from inner describe - overrides outer)
          // - connectionPool: 10 (from outer describe - preserved)
          expect(true).toBe(true);
        });

        test(
          createTitleWithMetadata("should create user with validation", {
            targetFile: "src/database/queries/UserQueries.ts", // Override again
            priority: "critical",
            queryTimeout: 10000,
          }),
          () => {
            // This test has metadata merged from all three sources:
            // - targetFile: "src/database/queries/UserQueries.ts" (from test - highest priority)
            // - priority: "critical" (from test)
            // - queryTimeout: 10000 (from test)
            // - table: "users" (from inner describe)
            // - retryAttempts: 5 (from inner describe)
            // - connectionPool: 10 (from outer describe)
            expect(true).toBe(true);
          },
        );
      },
    );
  },
);

// Example 7: Complex metadata with object merging
describe(
  createTitleWithMetadata("Configuration tests", {
    targetFile: "src/config/AppConfig.ts",
    settings: {
      debug: true,
      logLevel: "info",
      maxConnections: 100,
    },
    tags: ["config", "app"],
  }),
  () => {
    test(
      createTitleWithMetadata("should load environment variables", {
        targetFile: "src/config/EnvConfig.ts",
        settings: {
          debug: false, // Override debug setting
          logLevel: "debug", // Override log level
          newSetting: "value", // Add new setting
          // maxConnections: 100 is preserved from describe block
        },
        tags: ["env", "config"], // Replace tags completely
      }),
      () => {
        // Final merged metadata:
        // - targetFile: "src/config/EnvConfig.ts" (from test)
        // - settings: { debug: false, logLevel: "debug", newSetting: "value", maxConnections: 100 }
        // - tags: ["env", "config"] (from test)
        expect(true).toBe(true);
      },
    );
  },
);
