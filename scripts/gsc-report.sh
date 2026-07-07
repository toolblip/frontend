#!/bin/bash
# gsc-report.sh — Wrapper for daily GSC performance report
set -euo pipefail
export USER="${USER:-$(id -un 2>/dev/null || echo ray)}"
export HOME=/Users/ray
export PATH="$HOME/.local/bin:/opt/homebrew/bin:$PATH"
cd "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
python3 scripts/gsc-report.py
