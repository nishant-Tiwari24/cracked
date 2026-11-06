---
type: llm
weight: 3
focus: trace
---

PASS if the agent audits the project (a checklist with evidence such as file names) and proposes a prioritised upgrade plan, then waits for approval before editing project source files. Copying the folder and running git init plus an initial commit are fine. FAIL if it starts rewriting or adding project source files before the user approves a plan.
