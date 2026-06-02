#!/usr/bin/env bash
# Guard against accidental promotion of SUPABASE_ANON_KEY / SUPABASE_URL to the
# browser bundle. Imperfect's RLS policies are "FOR ALL USING (true)" on every
# table — security is upheld ONLY by the invariant that the anon key stays
# server-side. If NEXT_PUBLIC_SUPABASE_* ever appears in the repo, the key
# lands in the client JS bundle and anyone on the internet gains full
# read/write to sponsors (PII), revenue, tournaments, etc.
#
# If you legitimately need client-side Supabase access, rewrite the RLS
# policies with real role checks first — do NOT silence this guard.
#
# Exits 0 if clean, 1 if any match is found.
set -euo pipefail

# Search with ripgrep if available (fast, respects .gitignore), else fall back.
if command -v rg >/dev/null 2>&1; then
  matches="$(rg --no-messages --hidden --glob '!node_modules' --glob '!.next' --glob '!.git' --glob "!$(basename "$0")" 'NEXT_PUBLIC_SUPABASE' || true)"
else
  matches="$(grep -rn --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git --exclude="$(basename "$0")" 'NEXT_PUBLIC_SUPABASE' . || true)"
fi

if [ -n "$matches" ]; then
  echo "ERROR: NEXT_PUBLIC_SUPABASE_* found in repo. The Supabase anon key must stay server-only." >&2
  echo "See scripts/check-no-public-supabase.sh for context." >&2
  echo "" >&2
  echo "$matches" >&2
  exit 1
fi

echo "OK: no NEXT_PUBLIC_SUPABASE_* references in repo."
