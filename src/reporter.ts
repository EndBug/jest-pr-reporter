import type {
  AggregatedResult,
  Config,
  TestContext,
  Reporter,
} from "@jest/reporters";
import { GitHub } from "@actions/github/lib/utils";
import * as github from "@actions/github";
import * as core from "@actions/core";
import { createComment, findPreviousComment, updateComment } from "./comment";

/**
 * Options for configuring the Jest PR Reporter.
 */
interface ReporterOptions {
  /**
   * GitHub token for authentication.
   * @default process.env.GITHUB_TOKEN
   */
  githubToken?: string;

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
  protected _options?: ReporterOptions;
  private _octokit: InstanceType<typeof GitHub>;

  constructor(globalConfig: Config.GlobalConfig, options?: ReporterOptions) {
    this._globalConfig = globalConfig;
    this._options = options;

    const token = options?.githubToken ?? process.env.GITHUB_TOKEN;
    if (!token) {
      throw new Error("GitHub token is required");
    }

    this._octokit = github.getOctokit(token);
  }

  async onRunComplete(
    test?: Set<TestContext>,
    runResults?: AggregatedResult,
  ): Promise<void> {
    if (!runResults) return;
    if (process.env.GITHUB_ACTIONS !== "true") return;

    const prNumber = github.context.payload.pull_request?.number;
    if (!prNumber) {
      core.warning("This reporter must be used in a pull request. Exiting...");
      return;
    }

    const failedTestSuites = runResults.testResults.filter(
      (test) => test.numFailingTests > 0,
    );
    const failedTests = failedTestSuites.flatMap((test) =>
      test.testResults.filter((test) => test.status === "failed"),
    );

    const status = failedTestSuites.length === 0 ? "success" : "failure";

    const projectTag = `<hr><p align="right">Created with <a href="https://github.com/EndBug/jest-pr-reporter"><code>EndBug/jest-pr-reporter</code></a> version ${require("../package.json").version}</p>`;

    const newBody =
      status === "success"
        ? `# ✅ Content tests passing

All content tests are passing. If the other CI checks are passing too, you can merge this PR yourself.

${this._options?.footerSuccess ? `\n\n${this._options.footerSuccess}` : ""}

${this._options?.hideProjectTag ? "" : projectTag}
`.trim()
        : `# 🚨 Content tests failed

> [!WARNING]
> **${failedTests.length} failing tests** were detected in **${failedTestSuites.length} test suites**. Please review and fix these issues before merging.

This comment will be updated automatically as you push new commits.

## 📊 Test Summary

| Metric            | Count     |
| ----------------- | --------- |
| **Failing Tests** | ${failedTests.length} |
| **Test Suites**   | ${failedTestSuites.length} |
| **Status**        | ❌ Failed |

## 🔍 Failing Test Details

${failedTestSuites
  .map((suite) => {
    const normalizedPath = process.env.GITHUB_WORKSPACE
      ? suite.testFilePath.replace(process.env.GITHUB_WORKSPACE + "/", "")
      : suite.testFilePath;

    return `### Test Suite: [\`${normalizedPath}\`](https://github.com/${process.env.GITHUB_REPOSITORY}/blob/${process.env.GITHUB_SHA}/${normalizedPath})

<ul>
${suite.testResults
  .map((test) => {
    return `<li><strong><code>${test.ancestorTitles.join(" > ")} | ${test.title}</code></strong>

<details>
<summary>📋 Error Details</summary>

\`\`\`
${test.failureMessages.map((msg) => msg.replace(/    at/, "\n    at")).join("\n\n---\n\n")}
\`\`\`

</details>
</li>`;
  })
  .join("\n\n")} 
</ul>`;
  })
  .join("\n\n")}

${this._options?.footerFailed ? `\n\n${this._options.footerFailed}` : ""}

${this._options?.hideProjectTag ? "" : projectTag}
`.trim();

    const repo = {
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
    };

    const previous = await findPreviousComment(
      this._octokit,
      repo,
      prNumber,
      "",
    );

    if (!previous) {
      await createComment(this._octokit, repo, prNumber, newBody, "");
      return;
    } else {
      await updateComment(
        this._octokit,
        previous.id,
        newBody,
        "",
        previous.body,
      );
    }
  }

  getLastError(): Error | undefined {
    return this._error;
  }

  protected _setError(error: Error): void {
    this._error = error;
  }
}
