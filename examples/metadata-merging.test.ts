// Example demonstrating metadata merging from multiple sources
// This shows how metadata from describe blocks and test titles are combined

import { createTitleWithMetadata } from "../src/metadata";

// Example 1: Basic metadata inheritance
describe(
  createTitleWithMetadata("User Management System", {
    targetFile: "src/models/User.ts",
    category: "user-management",
    environment: "production",
  }),
  () => {
    test("should create new user", () => {
      // This test inherits all metadata from the describe block:
      // - targetFile: "src/models/User.ts"
      // - category: "user-management"
      // - environment: "production"
      expect(true).toBe(true);
    });

    test("should update existing user", () => {
      // Same inherited metadata
      expect(true).toBe(true);
    });
  },
);

// Example 2: Nested describe blocks with metadata merging
describe(
  createTitleWithMetadata("API Layer", {
    targetFile: "src/api/BaseAPI.ts",
    version: "v1",
    timeout: 5000,
  }),
  () => {
    describe(
      createTitleWithMetadata("User API", {
        targetFile: "src/api/UserAPI.ts",
        endpoint: "/users",
      }),
      () => {
        test("should get user by ID", () => {
          // This test has merged metadata from both describe blocks:
          // - targetFile: "src/api/UserAPI.ts" (from inner describe - higher priority)
          // - endpoint: "/users" (from inner describe)
          // - version: "v1" (from outer describe)
          // - timeout: 5000 (from outer describe)
          expect(true).toBe(true);
        });

        test(
          createTitleWithMetadata("should create user with validation", {
            targetFile: "src/api/UserAPI.ts",
            priority: "high",
            requiresAuth: true,
          }),
          () => {
            // This test has metadata merged from all three sources:
            // - targetFile: "src/api/UserAPI.ts" (from test - highest priority)
            // - priority: "high" (from test)
            // - requiresAuth: true (from test)
            // - endpoint: "/users" (from inner describe)
            // - version: "v1" (from outer describe)
            // - timeout: 5000 (from outer describe)
            expect(true).toBe(true);
          },
        );
      },
    );

    describe(
      createTitleWithMetadata("Auth API", {
        targetFile: "src/api/AuthAPI.ts",
        endpoint: "/auth",
        security: "high",
      }),
      () => {
        test("should authenticate user", () => {
          // Merged metadata:
          // - targetFile: "src/api/AuthAPI.ts" (from inner describe)
          // - endpoint: "/auth" (from inner describe)
          // - security: "high" (from inner describe)
          // - version: "v1" (from outer describe)
          // - timeout: 5000 (from outer describe)
          expect(true).toBe(true);
        });
      },
    );
  },
);

// Example 3: Complex nested structure with property overrides
describe(
  createTitleWithMetadata("Database Operations", {
    targetFile: "src/database/BaseDB.ts",
    connectionPool: 10,
    retryAttempts: 3,
  }),
  () => {
    describe(
      createTitleWithMetadata("User Database", {
        targetFile: "src/database/UserDB.ts",
        table: "users",
        retryAttempts: 5, // Override the outer retryAttempts
      }),
      () => {
        describe(
          createTitleWithMetadata("User Queries", {
            targetFile: "src/database/queries/UserQueries.ts",
            queryTimeout: 10000,
          }),
          () => {
            test(
              createTitleWithMetadata("should find user by email", {
                targetFile: "src/database/queries/UserQueries.ts",
                priority: "critical",
                queryTimeout: 15000, // Override the describe block timeout
              }),
              () => {
                // Final merged metadata:
                // - targetFile: "src/database/queries/UserQueries.ts" (from test - highest priority)
                // - priority: "critical" (from test)
                // - queryTimeout: 15000 (from test - overrides describe block)
                // - table: "users" (from middle describe)
                // - retryAttempts: 5 (from middle describe - overrides outer)
                // - connectionPool: 10 (from outer describe)
                expect(true).toBe(true);
              },
            );
          },
        );
      },
    );
  },
);

// Example 4: Metadata with different property types
describe(
  createTitleWithMetadata("Configuration Tests", {
    targetFile: "src/config/AppConfig.ts",
    settings: {
      debug: true,
      logLevel: "info",
    },
    tags: ["config", "app"],
  }),
  () => {
    test(
      createTitleWithMetadata("should load environment variables", {
        targetFile: "src/config/EnvConfig.ts",
        settings: {
          debug: false, // Override the debug setting
          logLevel: "debug", // Override the log level
          newSetting: "value", // Add new setting
        },
        tags: ["env", "config"], // Replace tags completely
      }),
      () => {
        // Final merged metadata:
        // - targetFile: "src/config/EnvConfig.ts" (from test)
        // - settings: { debug: false, logLevel: "debug", newSetting: "value" } (merged)
        // - tags: ["env", "config"] (from test - replaces completely)
        expect(true).toBe(true);
      },
    );
  },
);

// Example 5: No metadata inheritance
describe("Simple Test Suite", () => {
  test("should work without metadata", () => {
    // No metadata from anywhere
    expect(true).toBe(true);
  });

  test(
    createTitleWithMetadata("should work with only test metadata", {
      targetFile: "src/SimpleService.ts",
      complexity: "low",
    }),
    () => {
      // Only metadata from test title:
      // - targetFile: "src/SimpleService.ts"
      // - complexity: "low"
      expect(true).toBe(true);
    },
  );
});
