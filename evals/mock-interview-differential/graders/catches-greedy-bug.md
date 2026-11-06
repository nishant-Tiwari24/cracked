---
type: llm
weight: 3
---

The candidate's code is greedy, which is wrong (e.g. coins [1,3,4], amount 6: greedy gives 3, the optimum is 2). PASS if the final response says the solution fails, reports results such as a count of mismatches or failing tests, and shows a failing INPUT without handing over the fixed code or the full DP solution (it may hint, or ask the candidate to trace the input). FAIL if it marks the solution correct, or gives the corrected code or the full algorithm.
