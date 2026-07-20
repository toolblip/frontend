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
#   ./claude.sh -p <text>    send a one-shot prompt to the daemon, print response
#   ./claude.sh -p < <file>  send a prompt from stdin
#
# Requirements: claude, tmux.

set -euo pipefail

REAL_HOME="$(eval echo ~"$USER")"
export PATH="$REAL_HOME/.local/bin:$PATH"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SESSION_NAME="${CLAUDE_SESSION_NAME:-toolblip-haruns-m4-air}"
BASE_ARGS=(--dangerously-skip-permissions --enable-auto-mode)

ATTACH=false
RESTART_DAEMON=false
PROMPT=""

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

# ─── Prompt mode (one-shot) ──────────────────────────────────────────
# -p consumes the next arg as prompt text if it doesn't start with -.
# Otherwise reads from stdin (pipe / redirect).
next_is_prompt=false
prompt_text=""
claude_args=()
after_sep=false
for arg in "$@"; do
    if [ "$after_sep" = true ]; then
        claude_args+=("$arg")
        continue
    fi
    if [ "$arg" = "--" ]; then
        after_sep=true
        continue
    fi
    if [ "$next_is_prompt" = true ] && [ -z "$prompt_text" ]; then
        if [[ "$arg" == -* ]]; then
            prompt_text="STDIN"
            PROMPT="$(cat)"
        else
            prompt_text="$arg"
            PROMPT="$arg"
        fi
        next_is_prompt=false
        continue
    fi
    if [ "$arg" = "-p" ] || [ "$arg" = "--prompt" ]; then
        next_is_prompt=true
    fi
done

if [ "$next_is_prompt" = true ]; then
    PROMPT="$(cat)"
fi

if [ -n "$PROMPT" ]; then
    CLAUDE_BIN="${CLAUDE_BIN:-/Users/ray/.local/bin/claude}"
    # Ensure daemon is running
    if ! tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
        RESTART_LOOP="while true; do export HOME='$REAL_HOME'; claude -c ${BASE_ARGS[*]}; printf '\\\\n[auto-restart] Claude exited — restarting in 5s\\\\n'; sleep 5; done"
        tmux new-session -d -s "$SESSION_NAME" -c "$SCRIPT_DIR"
        tmux send-keys -t "$SESSION_NAME" "export HOME='$REAL_HOME'" Enter
        tmux send-keys -t "$SESSION_NAME" "cd '$SCRIPT_DIR'" Enter
        tmux send-keys -t "$SESSION_NAME" "$RESTART_LOOP" Enter
        sleep 3
    fi
    exec $CLAUDE_BIN -c -p "$PROMPT" "${BASE_ARGS[@]}" ${claude_args[@]+"${claude_args[@]}"}
fi

# ─── Attach mode ─────────────────────────────────────────────────────
if [ "$ATTACH" = true ]; then
    if tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
        exec tmux attach-session -t "$SESSION_NAME"
    else
        echo "Daemon is not running. Start it with: ./claude.sh" >&2
        exit 1
    fi
fi

# ─── Restart mode ────────────────────────────────────────────────────
if [ "$RESTART_DAEMON" = true ] && tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
    echo "  restart-daemon     : killing session $SESSION_NAME"
    tmux kill-session -t "$SESSION_NAME"
fi

# ─── Daemon start ────────────────────────────────────────────────────
RESUME_CMD="claude -c ${BASE_ARGS[*]}"
FRESH_CMD="claude ${BASE_ARGS[*]}"
CLAUDE_CMD="$RESUME_CMD || $FRESH_CMD"

echo "▶ claude.sh (toolblip)"
echo "  tmux session       : $SESSION_NAME"

if tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
    echo "✓ Daemon already running."
    echo "  Attach : ./claude.sh a"
else
    RESTART_LOOP="while true; do export HOME='$REAL_HOME'; $CLAUDE_CMD; printf '\\\\n[auto-restart] Claude exited — restarting in 5s\\\\n'; sleep 5; done"
    tmux new-session -d -s "$SESSION_NAME" -c "$SCRIPT_DIR"
    tmux send-keys -t "$SESSION_NAME" "export HOME='$REAL_HOME'" Enter
    tmux send-keys -t "$SESSION_NAME" "cd '$SCRIPT_DIR'" Enter
    tmux send-keys -t "$SESSION_NAME" "$RESTART_LOOP" Enter
    echo "✓ Daemon started."
    echo "  Attach : ./claude.sh a"
    echo "  Detach : Ctrl-b d"
fi
