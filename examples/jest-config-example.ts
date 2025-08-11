// Example Jest configuration using @endbug/jest-pr-reporter (TypeScript)
// This shows how to configure the reporter with environment variables and proper TypeScript types

import type { ReporterOptions } from "@endbug/jest-pr-reporter";
import type { JestConfigWithTsJest } from "ts-jest";

const reporterOptions: ReporterOptions = {
  githubToken: process.env.GH_TOKEN!,
  owner: process.env.GITHUB_REPOSITORY_OWNER!,
  repo:
    process.env.GITHUB_REPOSITORY &&
    process.env.GITHUB_REPOSITORY.split("/")[1],
  prNumber: Number(process.env.PR_NUMBER),
  sha: process.env.GITHUB_SHA!,
  workspace: process.env.GITHUB_WORKSPACE,
  workflowRunId: process.env.GITHUB_RUN_ID!,
  jobName: process.env.GITHUB_JOB!,
  header: "jest-tests",
  footerFailed: `## 🛠️ Next Steps

1. **Review** the failing tests above
2. **Fix** your files so that the tests pass
3. **Push changes** and ensure CI passes

> [!TIP]
> Need help? Check the [README](https://github.com/campus-experts/campus-experts.github.io#readme) or ask in the Discord.
`.trim(),
};

const config: JestConfigWithTsJest = {
  preset: "ts-jest",
  testEnvironment: "node",
  globalSetup: "<rootDir>/_scripts/jest-global-setup.ts",
  setupFilesAfterEnv: ["<rootDir>/_scripts/jest-setup.ts"],
  reporters:
    process.env.CI === "true"
      ? [["@endbug/jest-pr-reporter", reporterOptions], "summary"]
      : ["default"],
};

export default config;
