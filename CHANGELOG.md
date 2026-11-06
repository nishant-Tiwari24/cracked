# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [1.2.0] - 2026-11-06

### Fixed
- `/mock-interview` now does what the README promises: it builds and executes a reference **and** a brute-force solution plus a random input generator before presenting the problem, then grades with edge cases, random differential testing (2,000–20,000 inputs, time-capped) and a max-size input. Correctness & Testing is scored from that run.
- No instruction depends on the agent noticing silence any more. Sessions start by telling the candidate to say `stuck` or `time`, gaps are measured between turns, and the time left is shown once 90% of the round has passed (`/mock-interview`, `/system-design-mock`).
- Agents without a Skill tool: every skill that hands off to another now says to open the named `SKILL.md` instead, and the README explains this.

### Added
- `skills/interview/oa-sim/RUNNER.md`: shared compile and run commands for C++, C, Java, Python, JavaScript and Go, per-language time multipliers, a portable Python timeout runner (macOS and Windows), a clock fallback, and the differential-testing procedure.
- `/setup-cracked` checks the profile language's toolchain and `timeout`/`gtimeout`, and notes Windows fallbacks.
- Eval `mock-interview-differential`: a greedy coin-change submission must be caught by random testing against a brute force.

## [1.1.0] - 2026-11-06

### Added
- `/github-glowup` Style E: a neofetch-style profile README with the candidate's photo rendered as braille ASCII art, plus a credited reference example.
- `skills/profile/github-glowup/scripts/image-to-ascii.py`: zero-dependency photo-to-ASCII converter (braille or classic ramp, dithering, invert and contrast controls).
- `skills/profile/github-glowup/scripts/cutout.swift`: optional on-device background removal with Apple Vision (macOS).
- Animated demos for `/mock-interview` (Coin Change), `/oa-sim`, `/roast-my-resume`, `/github-glowup` (two), and `/company-intel` (real data), shown in the README and on each skill's page.

## [1.0.0] - 2026-11-06

First public release.

### Added
- **Company mode**: `/company-intel` builds cached company briefs (rounds, OA format, published values, resume bar) with frequency-ranked, community-reported LeetCode questions for 470+ companies, via a zero-dependency fetch script. Every skill adapts when a company is named.
- `/resume-blueprint`: company-specific resume plan and skeleton built from the candidate's real experience.
- `/mock-interview` voice mode (dictation in, OS text-to-speech out), per-phase monitoring of timing and reactions, and integrity checks with an explain-and-modify probe.
- **Interview rounds**: `/mock-interview`, `/oa-sim`, `/pattern-coach`, `/core-viva`, `/system-design-mock`, `/hr-round`, `/defend-my-project`.
- **Profile and applications**: `/roast-my-resume` (level and market calibrated, ATS score), `/jd-match`, `/github-glowup`, `/make-it-hireable`, `/referral-dm`.
- **Strategy**: `/prep-plan`, `/rejection-review`, `/offer-decode`.
- `/setup-cracked`: one-time setup (profile, company briefs, environment check, first sessions).
- Logo and wordmark (light and dark).
- `cracked-profile`: the shared local profile, journal and scorecard format in `~/.cracked/` (override with `CRACKED_HOME`).
- Claude Code plugin and marketplace manifests; Codex metadata for every skill.
- Structural validator, CI workflow, and a behavioural eval suite.

[1.2.0]: https://github.com/nishant-Tiwari24/cracked/releases/tag/v1.2.0
[1.1.0]: https://github.com/nishant-Tiwari24/cracked/releases/tag/v1.1.0
[1.0.0]: https://github.com/nishant-Tiwari24/cracked/releases/tag/v1.0.0
