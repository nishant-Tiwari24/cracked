# Working on this repo

This repo is a pack of Agent Skills for tech placement and interview prep. It's documentation-as-code: every skill is a Markdown file.

- Read `CONTRIBUTING.md` for conventions before editing a skill.
- After any change, run `node scripts/validate.mjs`. It must pass.
- Keep `version` identical in `package.json` and `.claude-plugin/plugin.json`, and add a `CHANGELOG.md` entry.
- Don't add dependencies. The validator is intentionally zero-dependency.
