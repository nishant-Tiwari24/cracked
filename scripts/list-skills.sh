#!/usr/bin/env bash
# Print the skill catalog: bucket, name, invocation and short description.
#   scripts/list-skills.sh          # aligned table
#   scripts/list-skills.sh --md     # Markdown table (for docs and PRs)
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
MD=0; [[ "${1:-}" == "--md" ]] && MD=1

field() { # file key
  awk -v k="$2" 'NR==1 && $0!="---"{exit} NR>1 && $0=="---"{exit} index($0, k":")==1 {sub("^" k ":[ ]*", ""); print; exit}' "$1"
}

rows=()
while IFS= read -r -d '' f; do
  dir="$(dirname "$f")"; name="$(basename "$dir")"; bucket="$(basename "$(dirname "$dir")")"
  invoked="model"; [[ "$(field "$f" disable-model-invocation)" == "true" ]] && invoked="user"
  short="$(sed -n 's/^  short_description: "\(.*\)"$/\1/p' "$dir/agents/openai.yaml" 2>/dev/null)"
  rows+=("$bucket|$name|$invoked|$short")
done < <(find "$REPO/skills" -name SKILL.md -print0 | sort -z)

if (( MD )); then
  echo "| Bucket | Skill | Invoked by | What it does |"
  echo "|---|---|---|---|"
  for r in "${rows[@]}"; do IFS='|' read -r b n i s <<< "$r"; echo "| $b | \`/$n\` | $i | $s |"; done
else
  printf '%-10s %-20s %-6s %s\n' BUCKET SKILL BY DESCRIPTION
  for r in "${rows[@]}"; do IFS='|' read -r b n i s <<< "$r"; printf '%-10s %-20s %-6s %s\n' "$b" "$n" "$i" "$s"; done
fi
echo "${#rows[@]} skills" >&2
