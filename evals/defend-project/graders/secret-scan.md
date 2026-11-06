---
type: llm
focus: { source: file, path: 'cracked-home/defense/.hidden/shop-api-attack-list.md' }
weight: 1
---

PASS if the attack list flags the hardcoded JWT secret ("shopkart123" in auth.js) as a leaked secret, ideally as the top or a top-priority item, with advice to move it to configuration or rotate it. FAIL if the file is missing or the hardcoded secret isn't flagged.
