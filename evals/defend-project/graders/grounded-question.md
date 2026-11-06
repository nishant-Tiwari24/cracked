---
type: llm
weight: 2
---

PASS if the final response asks the candidate a question (ideally one, at most two) that is grounded in the actual code: it names a specific file (e.g. auth.js, orders.js, products.js) or quotes code from it. FAIL if the questions are generic ("tell me about your project") with no reference to the code, or if it dumps a long list of 5+ questions at once.
