#!/usr/bin/env bash
# Run the behavioural eval suite (needs the `claude` CLI; costs API usage).
#   scripts/eval.sh                      # every case, once, with and without the plugin
#   scripts/eval.sh roast-resume         # one case
#   RUNS=3 scripts/eval.sh               # repeat runs to check consistency
#   BASELINE=0 scripts/eval.sh           # skip the no-plugin comparison arm
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
command -v claude >/dev/null || { echo "error: the claude CLI is required (https://code.claude.com)" >&2; exit 1; }

args=(plugin eval "$REPO" --trust-plugin --runs "${RUNS:-1}" -j "${JOBS:-4}" --allow-tools Bash Write Edit --no-publish)
[[ "${BASELINE:-1}" == "0" ]] && args+=(--ablation none)
[[ -n "${1:-}" ]] && args+=(--case "$1")

echo "→ claude ${args[*]}" >&2
claude "${args[@]}"
