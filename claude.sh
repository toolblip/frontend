#!/usr/bin/env bash
# claude.sh — run Claude Code as a background daemon in a tmux session.
#
# What it does
#   • Launches `claude` inside a detached tmux session so it keeps running
#     after you close the terminal.
#   • Uses system HOME for shared Claude auth.
#   • Defaults to a tmux session name matching the canonical toolblip session.
#
# Usage
#   ./claude.sh              start daemon in background
#   ./claude.sh a            attach to running session (Ctrl-b d to detach)
#   ./claude.sh rd           restart daemon (kill + fresh start)
#   ./claude.sh st           show daemon status
#
# Requirements: claude, tmux.

set -euo pipefail

REAL_HOME="$(eval echo ~"$USER")"
export PATH="$REAL_HOME/.local/bin:$PATH"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SESSION_NAME="${CLAUDE_SESSION_NAME:-toolblip-haruns-m4-air}"

AUTO_MODE=true
BYPASS_PERMS=true
ATTACH=false
RESTART_DAEMON=false

for arg in "$@"; do
    case "$arg" in
        a|-a|--attach)        ATTACH=true ;;
        rd|-rd|--rd)          RESTART_DAEMON=true ;;
        st|-st|--status|status)
            echo "▶ claude.sh status"
            if tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
                echo "  daemon             : running  (session: $SESSION_NAME)"
                echo "  attach             : ./claude.sh a"
            else
                echo "  daemon             : stopped"
                echo "  start              : ./claude.sh"
            fi
            exit 0 ;;
    esac
done

if [ "$ATTACH" = true ]; then
    if tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
        exec tmux attach-session -t "$SESSION_NAME"
    else
        echo "Daemon is not running. Start it with: ./claude.sh" >&2
        exit 1
    fi
fi

if [ "$RESTART_DAEMON" = true ] && tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
    echo "  restart-daemon     : killing session $SESSION_NAME"
    tmux kill-session -t "$SESSION_NAME"
fi

BASE_ARGS=(--dangerously-skip-permissions --enable-auto-mode)
RESUME_CMD="claude -c ${BASE_ARGS[*]}"
FRESH_CMD="claude ${BASE_ARGS[*]}"
CLAUDE_CMD="$RESUME_CMD || $FRESH_CMD"

echo "▶ claude.sh (toolblip)"
echo "  tmux session       : $SESSION_NAME"

if tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
    echo "✓ Daemon already running."
    echo "  Attach : ./claude.sh a"
else
    RESTART_LOOP="while true; do export HOME='$REAL_HOME'; $CLAUDE_CMD; printf '\\n[auto-restart] Claude exited — restarting in 5s\\n'; sleep 5; done"
    tmux new-session -d -s "$SESSION_NAME" -c "$SCRIPT_DIR"
    tmux send-keys -t "$SESSION_NAME" "export HOME='$REAL_HOME'" Enter
    tmux send-keys -t "$SESSION_NAME" "cd '$SCRIPT_DIR'" Enter
    tmux send-keys -t "$SESSION_NAME" "$RESTART_LOOP" Enter
    echo "✓ Daemon started."
    echo "  Attach : ./claude.sh a"
    echo "  Detach : Ctrl-b d"
fi
