#!/usr/bin/env bash
# review_pr.sh — Automated PR review using gh CLI + local build tools
set -euo pipefail

OWNER_REPO="${1:-}"
PR_NUM="${2:-}"

if [[ -z "$OWNER_REPO" || -z "$PR_NUM" ]]; then
  echo "Usage: review_pr.sh <owner/repo> <pr_number>"
  exit 1
fi

REPO="$OWNER_REPO"
echo "=== PR #$PR_NUM review: $REPO ==="

echo ""
echo "--- PR metadata ---"
gh pr view "$PR_NUM" --repo "$REPO" \
  --json title,body,state,mergeable,additions,deletions,changedFiles,author,headRefName \
  --template 'Title: {{.title}}
State: {{.state}}
Branch: {{.headRefName}}
Author: {{.author.login}}
Files: {{.changedFiles}}
+{{.additions}} / -{{.deletions}}
Mergeable: {{.mergeable}}
'

echo ""
echo "--- CI checks ---"
gh pr checks "$PR_NUM" --repo "$REPO" 2>&1 || echo "(no checks or checks pending)"

echo ""
echo "--- Diff preview (first 20 files) ---"
gh pr diff "$PR_NUM" --repo "$REPO" --name-only 2>&1 | head -30

echo ""
echo "--- Secrets scan (gitleaks dry-run) ---"
if command -v gitleaks &>/dev/null; then
  gitleaks protect --source . --no-git --fair-sensitivity 2>&1 || true
else
  echo "(gitleaks not available — install: brew install gitleaks)"
fi
