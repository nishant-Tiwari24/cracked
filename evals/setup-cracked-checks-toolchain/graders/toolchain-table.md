---
type: llm
weight: 2
---

PASS if the response reports an environment check covering python3 and the profile language's toolchain (Python here), mentions timeout/gtimeout or the portable runner, and says which features degrade for anything missing. FAIL if there's no environment check or it ignores the language toolchain.
