# 🚨 Jest Tests Failed

> [!WARNING]
> **4 failing tests** were detected in **2 test suites**. Please review and fix these issues before merging.

---

## 📊 Test Summary

| Metric            | Count     |
| ----------------- | --------- |
| **Failing Tests** | 4         |
| **Test Suites**   | 2         |
| **Status**        | ❌ Failed |

---

## 🔍 Failing Test Details

### Test Suite: [`_tests/content.test.ts`](GH_URL)

<ul>
<li><strong><code>Ancestor > titles | should have a valid date</code></strong>

<details>
<summary>📋 Error Details</summary>

```typescript
Error: expect(received).toBe(expected); // Object.is equality

Expected: false;
Received: true;
```

**Stack Trace:**

```
at Object.<anonymous> (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/_tests/content.test.ts:96:57)
at Promise.then.completed (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/utils.js:298:28)
at new Promise (<anonymous>)
at callAsyncCircusFn (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/run.js:231:10)
at _callCircus (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/run.js:316:40)
at processTicksAndRejections (node:internal/process/task_queues:95:5)
at _runTest (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/run.js:252:3)
at _runTestsForDescribeBlock (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/run.js:126:9)
at _runTestsForDescribeBlock (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/run.js:121:9)
at _runTestsForDescribeBlock (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/run.js:121:9)
at _runTestsForDescribeBlock (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/run.js:121:9)
at run (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/run.js:71:3)
at runAndTransformResultsToJestFormat (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:122:21)
at jestAdapter (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:79:19)
at runTestInternal (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-runner/build/runTest.js:367:16)
at runTest (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-runner/build/runTest.js:444:34)
at Object.worker (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-runner/build/testWorker.js:106:12)
```

</details>
</li>

<li><strong><code>Ancestor > titles | should have required fields</code></strong>

<details>
<summary>📋 Error Details</summary>

```typescript
Error: expect(received).toContain(expected); // Array contains

Expected: "title";
Received: ["description", "author", "date"];
```

**Stack Trace:**

```
at Object.<anonymous> (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/_tests/content.test.ts:112:34)
at Promise.then.completed (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/utils.js:298:28)
at new Promise (<anonymous>)
at callAsyncCircusFn (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/run.js:231:10)
at _callCircus (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/run.js:316:40)
at processTicksAndRejections (node:internal/process/task_queues:95:5)
at _runTest (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/run.js:252:3)
at _runTestsForDescribeBlock (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/run.js:126:9)
at _runTestsForDescribeBlock (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/run.js:121:9)
at _runTestsForDescribeBlock (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/run.js:121:9)
at _runTestsForDescribeBlock (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/run.js:121:9)
at run (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/run.js:71:3)
at runAndTransformResultsToJestFormat (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:122:21)
at jestAdapter (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:79:19)
at runTestInternal (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-runner/build/runTest.js:367:16)
at runTest (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-runner/build/runTest.js:444:34)
at Object.worker (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-runner/build/testWorker.js:106:12)
```

</details>
</li>
</ul>

---

### Test Suite: [`_tests/validation.test.ts`](GH_URL)

<ul>
<li><strong><code>Schema validation | should validate required fields</code></strong>

<details>
<summary>📋 Error Details</summary>

```typescript
Error: expect(received).toBeDefined(); // Object is defined

Expected: undefined;
Received: "ValidationError: Missing required field 'title'";
```

**Stack Trace:**

```
at Object.<anonymous> (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/_tests/validation.test.ts:45:23)
at Promise.then.completed (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/utils.js:298:28)
at new Promise (<anonymous>)
at callAsyncCircusFn (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/run.js:231:10)
at _callCircus (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/run.js:316:40)
at processTicksAndRejections (node:internal/process/task_queues:95:5)
at _runTest (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/run.js:252:3)
at _runTestsForDescribeBlock (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/run.js:126:9)
at _runTestsForDescribeBlock (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/run.js:121:9)
at _runTestsForDescribeBlock (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/run.js:121:9)
at _runTestsForDescribeBlock (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/run.js:121:9)
at run (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/run.js:71:3)
at runAndTransformResultsToJestFormat (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:122:21)
at jestAdapter (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:79:19)
at runTestInternal (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-runner/build/runTest.js:367:16)
at runTest (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-runner/build/runTest.js:444:34)
at Object.worker (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-runner/build/testWorker.js:106:12)
```

</details>
</li>

<li><strong><code>Schema validation | should handle invalid data types</code></strong>

<details>
<summary>📋 Error Details</summary>

```typescript
Error: expect(received).toThrow(); // Function throws

Expected: function to throw
Received: function did not throw
```

**Stack Trace:**

```
at Object.<anonymous> (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/_tests/validation.test.ts:67:18)
at Promise.then.completed (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/utils.js:298:28)
at new Promise (<anonymous>)
at callAsyncCircusFn (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/run.js:231:10)
at _callCircus (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/run.js:316:40)
at processTicksAndRejections (node:internal/process/task_queues:95:5)
at _runTest (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/run.js:252:3)
at _runTestsForDescribeBlock (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/run.js:126:9)
at _runTestsForDescribeBlock (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/run.js:121:9)
at _runTestsForDescribeBlock (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/run.js:121:9)
at _runTestsForDescribeBlock (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/run.js:121:9)
at run (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/run.js:71:3)
at runAndTransformResultsToJestFormat (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:122:21)
at jestAdapter (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:79:19)
at runTestInternal (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-runner/build/runTest.js:367:16)
at runTest (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-runner/build/runTest.js:444:34)
at Object.worker (/home/endbug/Coding/GitHub/campus-experts/campus-experts.github.io/node_modules/jest-runner/build/testWorker.js:106:12)
```

</details>
</li>
</ul>

---

## 🛠️ Next Steps

1. **Review** the failing tests above
2. **Fix** the implementation to match the expected behavior
3. **Run tests locally** to verify the fix
4. **Push changes** and ensure CI passes

---

> [!TIP]
> Need help? Check the [Jest documentation](https://jestjs.io/docs/getting-started) or ask in the team chat.
