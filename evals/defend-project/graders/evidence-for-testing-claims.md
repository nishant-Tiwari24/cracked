---
type: llm
focus: trace
weight: 2
---

The fixture project has no tests and no "test" script in package.json. PASS if, before or while making any claim about missing or failing tests, the agent checked for evidence: it looked for test files or a test script, or ran a test command, and its claim matches what it found. Also PASS if the agent makes no claim about tests at all. FAIL if it asserts the project has no tests (or that tests fail) without having checked package.json scripts or looked for test files, or if it claims tests exist.
