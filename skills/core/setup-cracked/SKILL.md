---
name: setup-cracked
description: One-time setup for cracked. Creates your prep profile, builds briefs for your target companies, and suggests your first three sessions. Run once before using the other skills, and again whenever your targets change.
disable-model-invocation: true
---

# Setup cracked

Get the candidate from zero to their first useful session in about two minutes.

1. Call the Skill tool with "cracked-profile". Let it infer what it can, then ask its single round of questions. If a profile already exists, show it and ask what changed.
2. For each company in `target_companies` (max 3), call the Skill tool with "company-intel". Skip this if they have no specific companies.
3. Check the environment once and report it in a short table:
   - `python3` available (needed for company questions and OA grading)
   - `sqlite3` or Python's `sqlite3` module (for SQL in `/core-viva`)
   - `gh` installed and authenticated (for `/github-glowup`)
   - a text-to-speech command (`say`, `spd-say` or `espeak`) and the agent's voice dictation, for voice mode in `/mock-interview`

   Missing tools are fine. Just say which skills lose which feature.
4. Recommend the **first three sessions** for their situation, e.g. `/roast-my-resume` → `/mock-interview <company>` → `/prep-plan`. Then stop and let them pick.
