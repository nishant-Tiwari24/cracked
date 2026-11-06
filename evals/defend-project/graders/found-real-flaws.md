---
type: llm
weight: 1
focus: { source: file, path: 'cracked-home/defense/.hidden/shop-api-attack-list.md' }
---

This is the agent's private attack list for the candidate's project. PASS if it identifies at least two real, specific flaws in the code, each tied to a file, such as: the hardcoded JWT secret "shopkart123" in auth.js; no pagination on GET /products; an unescaped user-supplied regex in /search (ReDoS or injection); the orders route trusting userId from the request body with no auth; N+1 queries or a non-atomic stock update (race condition) in orders.js; no input validation (e.g. negative qty); no tests. FAIL if the file is missing or names no specific code flaw.
