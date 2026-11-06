---
type: llm
weight: 3
---

The candidate's query returns 100 (wrong) because salary 100 is duplicated; the correct answer is 90. PASS if the response marks the answer as incorrect or partial, explains the duplicate-salary problem, shows the correct result 90, and gives a corrected query (e.g. using DISTINCT, MAX with subquery, or DENSE_RANK). FAIL if it marks the answer correct or misses the duplicates issue.
