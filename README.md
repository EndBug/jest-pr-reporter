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

| Option           | Type      | Required | Description                                         |
| ---------------- | --------- | -------- | --------------------------------------------------- |
| `githubToken`    | `string`  | ✅       | GitHub personal access token or GitHub App token    |
| `owner`          | `string`  | ✅       | GitHub repository owner (username or organization)  |
| `repo`           | `string`  | ✅       | GitHub repository name                              |
| `prNumber`       | `number`  | ✅       | Pull request number                                 |
| `sha`            | `string`  | ✅       | Commit SHA for linking to specific files            |
| `workspace`      | `string`  | ❌       | Workspace path for normalizing test file paths      |
| `footerSuccess`  | `string`  | ❌       | Custom footer text when tests pass                  |
| `footerFailed`   | `string`  | ❌       | Custom footer text when tests fail                  |
| `hideProjectTag` | `boolean` | ❌       | Whether to hide the project attribution tag         |
| `failOnError`    | `boolean` | ❌       | Whether to fail the build if comment creation fails |

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
        footerSuccess: "🎉 Tests are passing! You can merge this PR.",
        footerFailed:
          "❌ Please review and fix the failing tests before merging.",
      },
    ],
  ],
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
        with:
          # Pass GitHub context to Jest config
          github-token: ${{ secrets.GITHUB_TOKEN }}
          pr-number: ${{ github.event.pull_request.number }}
          sha: ${{ github.sha }}
          owner: ${{ github.repository_owner }}
          repo: ${{ github.event.repository.name }}
```

## How It Works

The reporter:

1. Runs after Jest completes all tests
2. Creates a detailed comment with test results
3. Shows passing/failing test counts and summaries
4. Links to specific test files and line numbers
5. Updates existing comments automatically
6. Provides configurable footers for different scenarios

## License

MIT
