# Jest PR Reporter

[![jest](https://jestjs.io/img/jest-badge.svg)](https://github.com/facebook/jest)

An opinionated Jest reporter that creates GitHub PR comments with test results.

## Features

- ✅ Creates GitHub PR comments with test results
- ✅ Updates existing comments automatically
- ✅ Shows detailed test failure information
- ✅ Configurable footers for success/failure cases
- ✅ No dependency on GitHub Actions environment variables

## Installation

```bash
npm install @endbug/jest-pr-reporter
# or
yarn add @endbug/jest-pr-reporter
```

## Configuration

Add the reporter to your Jest configuration:

```javascript
// jest.config.js
module.exports = {
  reporters: [
    "default",
    [
      "@endbug/jest-pr-reporter",
      {
        githubToken: process.env.GITHUB_TOKEN,
        owner: process.env.GITHUB_REPOSITORY_OWNER,
        repo:
          process.env.GITHUB_REPOSITORY &&
          process.env.GITHUB_REPOSITORY.split("/")[1],
        prNumber: Number(process.env.PR_NUMBER), // Set this in your workflow or pass as env
        sha: process.env.GITHUB_SHA,
        workspace: process.env.GITHUB_WORKSPACE, // optional
        workflowRunId: process.env.GITHUB_RUN_ID,
        jobName: process.env.GITHUB_JOB,
        footerSuccess: "🎉 All tests passed!",
        footerFailed: "❌ Please fix the failing tests.",
        hideProjectTag: false, // optional, defaults to false
        failOnError: false, // optional, defaults to false
      },
    ],
  ],
};
```

### Options

| Option           | Type      | Required | Description                                             |
| ---------------- | --------- | -------- | ------------------------------------------------------- |
| `githubToken`    | `string`  | ✅       | GitHub personal access token or GitHub App token        |
| `owner`          | `string`  | ✅       | GitHub repository owner (username or organization)      |
| `repo`           | `string`  | ✅       | GitHub repository name                                  |
| `prNumber`       | `number`  | ✅       | Pull request number                                     |
| `sha`            | `string`  | ✅       | Commit SHA for linking to specific files                |
| `workflowRunId`  | `string`  | ✅       | GitHub workflow run ID for linking to the specific run  |
| `jobName`        | `string`  | ✅       | GitHub job name (numeric ID is automatically extracted) |
| `workspace`      | `string`  | ❌       | Workspace path for normalizing test file paths          |
| `footerSuccess`  | `string`  | ❌       | Custom footer text when tests pass                      |
| `footerFailed`   | `string`  | ❌       | Custom footer text when tests fail                      |
| `hideProjectTag` | `boolean` | ❌       | Whether to hide the project attribution tag             |
| `failOnError`    | `boolean` | ❌       | Whether to fail the build if comment creation fails     |
| `header`         | `string`  | ❌       | Custom string to append to the HTML comment header      |

## Usage Examples

### Basic Usage

```javascript
// jest.config.js
module.exports = {
  reporters: [
    "default",
    [
      "@endbug/jest-pr-reporter",
      {
        githubToken: process.env.GITHUB_TOKEN,
        owner: "EndBug",
        repo: "jest-pr-reporter",
        prNumber: 1,
        sha: process.env.GITHUB_SHA,
        workflowRunId: process.env.GITHUB_RUN_ID,
        jobName: process.env.GITHUB_JOB,
      },
    ],
  ],
};
```

### With Custom Footers

```javascript
// jest.config.js
module.exports = {
  reporters: [
    "default",
    [
      "@endbug/jest-pr-reporter",
      {
        githubToken: process.env.GITHUB_TOKEN,
        owner: "EndBug",
        repo: "jest-pr-reporter",
        prNumber: 1,
        sha: process.env.GITHUB_SHA,
        workflowRunId: process.env.GITHUB_RUN_ID,
        jobName: process.env.GITHUB_JOB,
        footerSuccess: "🎉 Tests are passing! You can merge this PR.",
        footerFailed:
          "❌ Please review and fix the failing tests before merging.",
      },
    ],
  ],
};
```

### With Custom Header

```javascript
// jest.config.js
module.exports = {
  reporters: [
    "default",
    [
      "@endbug/jest-pr-reporter",
      {
        githubToken: process.env.GITHUB_TOKEN,
        owner: "EndBug",
        repo: "jest-pr-reporter",
        prNumber: 1,
        sha: process.env.GITHUB_SHA,
        workflowRunId: process.env.GITHUB_RUN_ID,
        jobName: process.env.GITHUB_JOB,
        header: "my-tests", // Results in: <!-- Sticky Pull Request Comment jest-pr-reporter: my-tests -->
      },
    ],
  ],
};
```

### Advanced Configuration with Environment Variables

For more complex setups, you can separate the reporter options and use environment variables:

```javascript
// jest.config.js
/** @type {import('@endbug/jest-pr-reporter').ReporterOptions} */
const reporterOptions = {
  githubToken: process.env.GH_TOKEN,
  owner: process.env.GITHUB_REPOSITORY_OWNER,
  repo:
    process.env.GITHUB_REPOSITORY &&
    process.env.GITHUB_REPOSITORY.split("/")[1],
  prNumber: Number(process.env.PR_NUMBER),
  sha: process.env.GITHUB_SHA,
  workspace: process.env.GITHUB_WORKSPACE,
  workflowRunId: process.env.GITHUB_RUN_ID,
  jobName: process.env.GITHUB_JOB,
  customHeader: "jest-tests",
  footerFailed: `## 🛠️ Next Steps

1. **Review** the failing tests above
2. **Fix** your files so that the tests pass
3. **Push changes** and ensure CI passes

> [!TIP]
> Need help? Check the [README](https://github.com/campus-experts/campus-experts.github.io#readme) or ask in the Discord.
`.trim(),
};

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  reporters:
    process.env.CI === "true"
      ? [["@endbug/jest-pr-reporter", reporterOptions], "summary"]
      : ["default"],
};
```

### In GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests
on: [pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "18"
      - run: npm ci
      - run: npm test
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          PR_NUMBER: ${{ github.event.pull_request.number }}
```

## Examples

Check the [`examples/`](./examples/) directory for more detailed examples:

- [`jest-config-example.js`](./examples/jest-config-example.js) - JavaScript configuration with environment variables
- [`jest-config-example.ts`](./examples/jest-config-example.ts) - TypeScript configuration with proper typing
- [`using-metadata.test.ts`](./examples/using-metadata.test.ts) - Examples of using metadata in tests
- [`metadata-merging.test.ts`](./examples/metadata-merging.test.ts) - Examples of metadata inheritance and merging

## How It Works

The reporter:

1. Runs after Jest completes all tests
2. Creates a detailed comment with test results
3. Shows passing/failing test counts and summaries
4. Links to specific test files and line numbers
5. Includes links to the specific workflow run for traceability
6. Updates existing comments automatically
7. Provides configurable footers for different scenarios
8. Uses HTML comments with customizable headers for comment identification

## License

MIT
