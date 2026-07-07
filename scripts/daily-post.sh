#!/bin/bash
# daily-post.sh — Toolblip daily blog post generator (wrapper)
# Delegates to daily-post.py for robustness
set -euo pipefail
export USER="${USER:-$(id -un 2>/dev/null || echo ray)}"
export LOGNAME="${LOGNAME:-$USER}"
export HOME=/Users/ray
export PATH="$HOME/.local/bin:/opt/homebrew/bin:$PATH"
cd "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
exec python3 scripts/daily-post.py
