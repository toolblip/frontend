#!/bin/bash
# daily-post.sh — Toolblip daily blog post generator (wrapper)
# Delegates to daily-post.py for robustness
# Uses launchctl asuser to access the macOS keychain (Claude auth) from cron
set -euo pipefail
export USER="${USER:-$(id -un 2>/dev/null || echo ray)}"
export LOGNAME="${LOGNAME:-$USER}"
export HOME=/Users/ray
export PATH="$HOME/.local/bin:/opt/homebrew/bin:$PATH"
cd "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Wrap claude calls with launchctl asuser so the macOS keychain (Claude OAuth)
# is accessible from the cron context.
export CLAUDE_CMD_PREFIX="launchctl asuser $(id -u)"

exec python3 scripts/daily-post.py
