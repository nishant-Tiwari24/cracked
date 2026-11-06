#!/usr/bin/env bash
# Symlink every cracked skill into your local agent skill directories, so
# edits in this repo are live immediately. Maintainer/dev tool, not the
# supported installer (see README → Installation).
#
#   scripts/link-skills.sh            # link into ~/.claude/skills and ~/.agents/skills
#   scripts/link-skills.sh --unlink   # remove only the links this script created
#   DESTS="$HOME/.cursor/skills" scripts/link-skills.sh
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
read -r -a DESTS <<< "${DESTS:-$HOME/.claude/skills $HOME/.agents/skills}"
MODE="link"
[[ "${1:-}" == "--unlink" ]] && MODE="unlink"

linked=0; skipped=0; removed=0
while IFS= read -r -d '' skill_md; do
  src="$(dirname "$skill_md")"
  name="$(basename "$src")"
  for dest in "${DESTS[@]}"; do
    target="$dest/$name"
    if [[ "$MODE" == "unlink" ]]; then
      if [[ -L "$target" && "$(readlink "$target")" == "$src" ]]; then
        rm "$target"; removed=$((removed + 1))
      fi
      continue
    fi
    mkdir -p "$dest"
    if [[ -L "$target" ]]; then
      [[ "$(readlink "$target")" == "$src" ]] && continue
      echo "skip  $target (symlink to somewhere else)" >&2; skipped=$((skipped + 1)); continue
    fi
    if [[ -e "$target" ]]; then
      echo "skip  $target (a real directory exists; not overwriting)" >&2; skipped=$((skipped + 1)); continue
    fi
    ln -s "$src" "$target"; linked=$((linked + 1))
  done
done < <(find "$REPO/skills" -name SKILL.md -print0 | sort -z)

if [[ "$MODE" == "unlink" ]]; then
  echo "removed $removed link(s)"
else
  echo "linked $linked · skipped $skipped · into: ${DESTS[*]}"
fi
