#!/usr/bin/env bash
# Build the website as static files and publish them to Vercel (free Hobby plan).
#   scripts/deploy-site.sh            # production
#   PREVIEW=1 scripts/deploy-site.sh  # preview URL only
# First time: npx vercel login
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
SITE_URL="${SITE_URL:-https://cracked-skills.vercel.app}"
PROJECT="${VERCEL_PROJECT:-cracked-skills}"

cd "$REPO/website"
[[ -d node_modules ]] || npm ci
npm run lint
SITE_URL="$SITE_URL" npm run build

STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT
cp -R out/. "$STAGE/"
cd "$STAGE"

args=(deploy --yes --project "$PROJECT" --create-if-missing)
[[ "${PREVIEW:-0}" == "1" ]] || args+=(--prod)
npx -y vercel@latest "${args[@]}"
echo "deployed: $SITE_URL"
