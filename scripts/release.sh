#!/usr/bin/env bash
# Prepare a release: bump the version in package.json and plugin.json, make
# sure CHANGELOG.md has an entry, run every check, then commit and tag.
#   scripts/release.sh 1.1.0
# Pushing stays manual:  git push origin main --follow-tags
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"; cd "$REPO"
VERSION="${1:?usage: scripts/release.sh <version>  (e.g. 1.1.0)}"
[[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || { echo "error: version must be MAJOR.MINOR.PATCH" >&2; exit 1; }
[[ -z "$(git status --porcelain)" ]] || { echo "error: working tree not clean" >&2; exit 1; }
git rev-parse -q --verify "refs/tags/v$VERSION" >/dev/null && { echo "error: tag v$VERSION already exists" >&2; exit 1; }
grep -q "^## \[$VERSION\]" CHANGELOG.md || { echo "error: add a '## [$VERSION]' section to CHANGELOG.md first" >&2; exit 1; }

for f in package.json .claude-plugin/plugin.json; do
  node -e '
    const fs = require("fs"), [f, v] = process.argv.slice(1);
    const j = JSON.parse(fs.readFileSync(f, "utf8")); j.version = v;
    fs.writeFileSync(f, JSON.stringify(j, null, 2) + "\n");' "$f" "$VERSION"
done

node scripts/validate.mjs
if command -v claude >/dev/null; then claude plugin validate . --strict; fi

git add package.json .claude-plugin/plugin.json
git commit -qm "chore(release): v$VERSION"
git tag -a "v$VERSION" -m "v$VERSION"
echo "tagged v$VERSION. Push with: git push origin main --follow-tags"
