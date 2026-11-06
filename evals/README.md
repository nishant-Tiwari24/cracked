# Evals

Behavioural tests for every core flow, run with Claude Code's built-in [`claude plugin eval`](https://code.claude.com/docs/en/plugin-evals). Each case is a realistic candidate request. Graders combine **deterministic checks** (did the right skill fire, was code or SQL actually executed, were the OA files created) with **LLM judges** (no spoilers, no fabricated metrics, correct tax math, and so on).

```bash
npm run eval                                              # whole suite, with and without the plugin
claude plugin eval . --trust-plugin --runs 1 --case roast-resume --allow-tools Bash Write Edit
```

Fixtures live in [`_fixtures/`](_fixtures/): a deliberately weak resume, a backend job description, and a small Express project seeded with real flaws (a hardcoded JWT secret, no pagination, regex injection, a stock race condition).

## Results (v1.0.0, 2026-11-06, Claude Code 2.1.319, default model)

"Without" is the same model and prompt with the plugin removed.

| Case | What it checks | With cracked | Without |
|---|---|---|---|
| `roast-resume` | ATS score with breakdown, calibrated brutal roast, every jab has a fix, **no fabricated metrics** | **1.00** | 0.50 |
| `mock-interview-start` | One problem, no spoilers, interviewer behaviour | **1.00** | 0.25 |
| `mock-interview-company` | Pulls Google's frequently reported questions via the dataset script | **1.00** | 0.33 |
| `oa-sim-generate` | Statement, starter and hidden test files; **expected outputs from an executed reference solution**; no title leak | **1.00** | 0.00 |
| `core-viva-sql-exec` | **Runs the candidate's SQL in SQLite** and catches the duplicate-salary bug | **1.00** | 0.80 |
| `pattern-coach-socratic` | Guides with questions, no solution code | **1.00** | 0.75 |
| `defend-project` | Code-grounded first question; finds real flaws in the project | **1.00** | 0.50 |
| `jd-match` | Transparent match score, gap triage, no fabricated experience, 7-day plan | **1.00** | 0.40 |
| `resume-blueprint-company` | Amazon-specific blueprint with labelled sources, skeleton file, no fabrication | **1.00** | 0.60 |
| `referral-hiring-post` | Chooses the hiring-post comment → DM path; notes under 300 characters; honest | **1.00** | 0.50 |
| `offer-decode-india` | Correct in-hand range under FY 2025-26 rules; flags bond and clawback | **1.00** | 0.86 |
| `live-oa-refusal` | Declines to solve a live assessment | **1.00** | 1.00 |

**12/12 cases pass with cracked. Mean improvement over the bare model: +0.38.**

### Added in v1.2–v1.3 (every skill now has at least one case)

Run once each, with the plugin only (no baseline arm), on 2026-11-06:

| Case | What it checks | Score |
|---|---|---|
| `mock-interview-differential` | A greedy coin-change submission is caught by random testing against a brute force, without giving away the fix | 1.00 |
| `hr-round-no-invented-outcomes` | STAR feedback; the rewrite uses placeholders, never invented results | 1.00 |
| `system-design-requirements-first` | Opens like an interviewer (requirements first), no design dump | 1.00 |
| `prep-plan-uses-real-date` | Runs the date command; the week count matches the deadline; writes `plan.md` | 1.00 |
| `rejection-review-cites-repeats` | Finds edge cases as the repeating root cause in the journal, merging `edgecases` with `edge-cases` | 1.00 |
| `make-it-hireable-plan-first` | Audits and plans before editing; flags the hardcoded secret first | 1.00 |
| `github-glowup-offline-profile` | Leaked key first, pin plan, no invented project facts, asks before applying | 1.00 ×2 (an earlier failure led to the fact-check step) |
| `setup-cracked-checks-toolchain` | Environment check includes the language toolchain and timeout fallback | 1.00 |
| `company-intel-offline-honest` | Alias `Tata Consultancy Services` → `tcs`, or an honest archetype fallback when offline | 1.00 |

Also re-run after changes: `mock-interview-start`, `oa-sim-generate`, `defend-project`, `offer-decode-india`, `referral-hiring-post`, all 1.00.

Notes, for honesty:
- Each case was run once per arm. LLM output varies, so re-run with `--runs 3` before trusting a single number.
- Two cases (`defend-project`, `oa-sim-generate`) first failed because of grader bugs (judges were only shown the final message). After fixing the graders, and making defend-my-project open with a code-grounded question, both pass. These scores are from the re-run.
- The base model already refuses live-assessment cheating. The case stays in the suite as a regression guard.
