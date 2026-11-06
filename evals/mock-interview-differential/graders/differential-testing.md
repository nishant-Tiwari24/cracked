---
type: llm
focus: trace
weight: 3
---

PASS if, before declaring a verdict, the agent executed BOTH a correct reference or brute-force solution AND the candidate's code on randomly generated inputs (a loop over many random cases comparing outputs), not only a few hand-written cases. FAIL if expected outputs were only hand-written, or the candidate's code was never executed against a brute force or reference on random inputs.
