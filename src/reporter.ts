import type {
  AggregatedResult,
  Config,
  TestContext,
  Reporter,
} from "@jest/reporters";
import * as github from "@actions/github";
import * as core from "@actions/core";
import { createComment, findPreviousComment, updateComment } from "./comment";
import {
  extractMetadataFromAncestors,
  cleanAncestorTitles,
  parseTitleMetadata,
} from "./metadata";

/**
 * Options for configuring the Jest PR Reporter.
 */
interface ReporterOptions {
  /**
   * GitHub token for authentication.
   */
  githubToken: string;

  /**
   * GitHub repository owner (e.g., "EndBug").
   */
  owner: string;

  /**
   * GitHub repository name (e.g., "jest-pr-reporter").
   */
  repo: string;

  /**
   * Pull request number.
   */
  prNumber: number;

  /**
   * GitHub commit SHA.
   */
  sha: string;

  /**
   * GitHub workspace path (optional, used for normalizing test file paths).
   */
  workspace?: string;

  /**
   * Footer text to add to the comment when the tests fail.
   * @example "Need help? Check the [Jest documentation](https://jestjs.io/docs/getting-started) or ask in the team chat."
   */
  footerFailed?: string;

  /**
   * Footer text to add to the comment when the tests pass.
   * @example "Need help? Check the [Jest documentation](https://jestjs.io/docs/getting-started) or ask in the team chat."
   */
  footerSuccess?: string;

  /**
   * Whether to hide the project tag from the comment.
   * @default false
   */
  hideProjectTag?: boolean;

  /**
   * Whether to fail the build if comment creation fails.
   * @default false
   */
  failOnError?: boolean;
}

export default class JestReporter implements Reporter {
  private _error?: Error;
  protected _globalConfig: Config.GlobalConfig;
  protected _options: ReporterOptions;
  private _octokit: ReturnType<typeof github.getOctokit>;

  // GitHub comment body limit is 65536 characters, leave some buffer
  private readonly MAX_COMMENT_LENGTH = 60000;

  constructor(globalConfig: Config.GlobalConfig, options: ReporterOptions) {
    this._globalConfig = globalConfig;
    this._options = options;

    if (!options.githubToken) {
      throw new Error("GitHub token is required");
    }

    this._octokit = github.getOctokit(options.githubToken);
  }

  async onRunComplete(
    test?: Set<TestContext>,
    runResults?: AggregatedResult,
  ): Promise<void> {
    if (!runResults) return;

    const passingTestSuites = runResults.testResults.filter(
      (test) => test.numFailingTests === 0,
    );
    const passingTests = runResults.testResults.flatMap((test) =>
      test.testResults.filter((test) => test.status === "passed"),
    );

    const failedTestSuites = runResults.testResults.filter(
      (test) => test.numFailingTests > 0,
    );
    const failedTests = failedTestSuites.flatMap((test) =>
      test.testResults.filter((test) => test.status === "failed"),
    );

    // Debug: Log what we're actually filtering
    core.startGroup("🔍 Jest Reporter Debug Info");
    core.info("What tests are we finding?");
    failedTestSuites.forEach((suite, suiteIndex) => {
      core.info(`Suite ${suiteIndex + 1}: ${suite.testFilePath}`);
      suite.testResults.forEach((test, testIndex) => {
        const metadata = extractMetadataFromAncestors(test.ancestorTitles);
        const targetFile = metadata?.targetFile;
        core.info(
          `  Test ${testIndex + 1}: "${test.title}" - Status: "${test.status}"${targetFile ? ` - Target File: ${targetFile}` : ""}`,
        );
        // Debug: Log the full metadata object work if present
        if (metadata) {
          core.info("    metadata: " + JSON.stringify(metadata));
        }
        if (test.status === "failed") {
          core.info(`    ^^^ This test is marked as FAILED`);
        }
      });
    });
    core.endGroup();

    const status = failedTestSuites.length === 0 ? "success" : "failure";

    const projectTag = `<p align="right">Created with <a href="https://github.com/EndBug/jest-pr-reporter"><code>EndBug/jest-pr-reporter</code></a> version ${require("../package.json").version}</p>`;

    const newBody =
      status === "success"
        ? `# ✅ Content tests passing

All content tests are passing. If the other CI checks are passing too, you can merge this PR yourself.

## 📊 Test Summary

| Metric            | Count     |
| ----------------- | --------- |
| **Passing tests** | ${passingTests.length} / ${runResults.numTotalTests} |
| **Passing test suites**   | ${passingTestSuites.length} / ${runResults.numTotalTestSuites} |
| **Status**        | ✅ Passed |

${this._options?.footerSuccess ? `\n\n${this._options.footerSuccess}` : ""}

${this._options?.hideProjectTag ? "" : projectTag}
`.trim()
        : `# 🚨 Content tests failed

> [!IMPORTANT]
> **${failedTests.length} failing tests** were detected in **${failedTestSuites.length} test suites**. Please review and fix these issues before merging.

This comment will be updated automatically as you push new commits.

## 📊 Test Summary

| Metric            | Count     |
| ----------------- | --------- |
| **Passing tests** | ${passingTests.length} / ${runResults.numTotalTests} |
| **Passing test suites**   | ${passingTestSuites.length} / ${runResults.numTotalTestSuites} |
| **Status**        | ❌ Failed |

## 🔍 Failing Test Details

${(() => {
  const suitesToShow = failedTestSuites.slice(0, 20); // Show up to 20 failing suites
  const isTruncated = failedTestSuites.length > 20;

  let truncationMessage = "";
  if (isTruncated) {
    truncationMessage = `> [!NOTE]
> **Note:** Only the first 20 test suites are shown due to comment length limits. There are ${failedTestSuites.length - 20} additional failing test suites that need review.

`;
  }

  return (() => {
    let cumulativeLength = 0;
    let totalTestsShown = 0;
    let totalTestsSkipped = 0;
    const MAX_TOTAL_TESTS = 20; // Maximum total tests to show across all suites

    // Build the test details while tracking cumulative length
    const testDetails = suitesToShow
      .map((suite) => {
        const normalizedPath = this._options.workspace
          ? suite.testFilePath.replace(this._options.workspace + "/", "")
          : suite.testFilePath;

        const failedTestsInSuite = suite.testResults.filter(
          (test) => test.status === "failed",
        );

        let suiteContent = `### Test Suite: [\`${normalizedPath}\`](https://github.com/${this._options.owner}/${this._options.repo}/blob/${this._options.sha}/${normalizedPath})\n\n<ul>\n`;

        let testsInThisSuite = 0;
        let testsSkippedInThisSuite = 0;

        for (const test of failedTestsInSuite) {
          // Stop if we've reached the total test limit
          if (totalTestsShown >= MAX_TOTAL_TESTS) {
            testsSkippedInThisSuite =
              failedTestsInSuite.length - testsInThisSuite;
            totalTestsSkipped += testsSkippedInThisSuite;
            break;
          }

          // Check if test has custom metadata with targetFile
          const metadata = extractMetadataFromAncestors(
            test.ancestorTitles,
            test.title,
          );
          const fileToLink = metadata?.targetFile;
          const cleanAncestors = cleanAncestorTitles(test.ancestorTitles);
          const cleanTestTitle = parseTitleMetadata(test.title).title;

          const testContent = `<li><strong><code>${cleanAncestors.join(" > ")} | ${cleanTestTitle}</code></strong>
${fileToLink ? `<br>🎯 **Fix needed in:** [\`${fileToLink}\`](https://github.com/${this._options.owner}/${this._options.repo}/blob/${this._options.sha}/${fileToLink})<br>` : ""}
<details>
<summary>📋 Error Details</summary>

\`\`\`
${test.failureMessages.map((msg) => msg.replace(/    at/, "\n    at")).join("\n\n---\n\n")}
\`\`\`

</details>

${
  metadata
    ? `<details>
<summary>🛠️ Metadata</summary>

\`\`\`json
${JSON.stringify(metadata, null, 2)}
\`\`\`

</details>`
    : ""
}

</li>`;

          // Check if adding this test would exceed the limit
          if (cumulativeLength + testContent.length > this.MAX_COMMENT_LENGTH) {
            testsSkippedInThisSuite =
              failedTestsInSuite.length - testsInThisSuite;
            totalTestsSkipped += testsSkippedInThisSuite;
            break;
          }

          suiteContent += testContent + "\n\n";
          cumulativeLength += testContent.length;
          testsInThisSuite++;
          totalTestsShown++;
        }

        suiteContent += "</ul>";

        // Add suite truncation message if tests were skipped
        if (testsSkippedInThisSuite > 0) {
          suiteContent += `\n\n> [!NOTE]\n> **Note:** ${testsInThisSuite === 0 ? "No failing tests are being shown for this suite, to keep this comment within GitHub's character limit." : `Only the first ${testsInThisSuite} failing tests are shown for this suite.`} There are ${testsSkippedInThisSuite} additional failing tests in this suite.`;
        }

        return suiteContent;
      })
      .filter((suiteContent) => suiteContent.length > 0);

    // Add overall truncation message if any tests were skipped
    let overallTruncationMessage = "";
    if (totalTestsSkipped > 0) {
      overallTruncationMessage = `\n\n> [!WARNING]\n> **Test limit reached:** Only ${totalTestsShown} failing tests are shown (limited to ${MAX_TOTAL_TESTS} for manual review). There are ${totalTestsSkipped} additional failing tests that need manual review.\n\n`;
    }

    return (
      truncationMessage + overallTruncationMessage + testDetails.join("\n\n")
    );
  })();
})()}

${this._options?.footerFailed ? `\n\n${this._options.footerFailed}` : ""}

${this._options?.hideProjectTag ? "" : projectTag}
`.trim();

    const repo = {
      owner: this._options.owner,
      repo: this._options.repo,
    };

    try {
      const previous = await findPreviousComment(
        this._octokit,
        repo,
        this._options.prNumber,
        "",
      );

      if (!previous) {
        await createComment(
          this._octokit,
          repo,
          this._options.prNumber,
          newBody,
          "",
        );
        return;
      } else {
        await updateComment(this._octokit, previous.id, newBody, "");
      }
    } catch (error) {
      console.error(error);
    }
  }

  getLastError(): Error | undefined {
    return this._error;
  }

  protected _setError(error: Error): void {
    this._error = error;
  }
}
