# Contributing to cracked

Thanks for helping candidates prepare better. A few rules keep the skills sharp.

## Layout

```
skills/<category>/<skill-name>/
  SKILL.md            # the skill: frontmatter (name, description) + instructions
  agents/openai.yaml  # Codex picker metadata (display_name, short_description)
  *.md                # reference files the skill links to (rubrics, catalogs)
```

Categories: `core` (shared infrastructure), `interview`, `profile`, `strategy`.

## Conventions

- **`name` equals the folder name**, in kebab-case.
- **Invocation**: skills are model-invoked by default. A skill only a human should start sets `disable-model-invocation: true` in its frontmatter **and** `policy.allow_implicit_invocation: false` in `agents/openai.yaml`; the validator checks that the two agree. Skills never call a user-invoked skill.
- **`description` is model-facing**: say what the skill does, then "Use when the user …" with the phrases a candidate would actually type. Max 1024 characters.
- **Keep `SKILL.md` under 500 lines.** Move long material (rubrics, question banks, tax tables) into sibling files and link them.
- **Skills call each other explicitly**: `Call the Skill tool with "cracked-profile"`. Every skill that reads or writes `~/.cracked/` must load the profile first.
- **Scorecards** follow the format defined in `skills/core/cracked-profile/SKILL.md`. Don't invent a new one.
- **Never fabricate.** Skills must not invent candidate experience, metrics, or "real" company questions. Numbers that change over time (tax slabs, character limits) must name their source year and tell the agent to verify.

## Maintainer scripts

| Script | What it does |
|---|---|
| `scripts/link-skills.sh` | Symlink every skill into `~/.claude/skills` and `~/.agents/skills`, so edits are live (`--unlink` to undo; `DESTS=…` to choose other directories) |
| `scripts/list-skills.sh` | Print the catalog (`--md` for a Markdown table) |
| `scripts/eval.sh [case]` | Run the eval suite (`RUNS=3`, `BASELINE=0`, `JOBS=4`) |
| `scripts/release.sh <version>` | Bump versions, check the changelog, validate, commit and tag |

## Before you open a PR

```bash
npm run validate          # structural checks (CI runs this)
npm run validate:plugin   # Claude Code manifest validation (needs the claude CLI)
scripts/eval.sh           # behavioural evals (needs the claude CLI; uses API credits)
```

If you add a skill, add it to `.claude-plugin/plugin.json`, the README tables, and `CHANGELOG.md`, and add at least one eval case under `evals/`.
