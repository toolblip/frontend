#!/usr/bin/env bash
# claude.sh — run Claude Code as a background daemon in a tmux session.
#
# Toolblip launcher for M4Air.
#
# Usage:
#   ./claude.sh            start daemon in background
#   ./claude.sh a          attach to running session
#   ./claude.sh rd         restart daemon (kill + fresh start)
#   ./claude.sh st         show daemon/launchd status
#   ./claude.sh id         show launchd install status
#   ./claude.sh ud         uninstall launchd agent
#   ./claude.sh dp         disable --dangerously-skip-permissions
#   ./claude.sh da         disable --enable-auto-mode
#   ./claude.sh dc         disable --chrome
#   ./claude.sh h          show help
#
# Requires: claude, tmux, macOS for launchd auto-start.

set -euo pipefail

# Normalize identity for cron/launchd shells.
if [ -z "${USER:-}" ]; then
    USER="$(id -un)"
    export USER
fi
if [ -z "${LOGNAME:-}" ]; then
    LOGNAME="$USER"
    export LOGNAME
fi
REAL_HOME="$(eval echo ~"$USER")"
if [ -z "${HOME:-}" ] || [ "$HOME" != "$REAL_HOME" ]; then
    HOME="$REAL_HOME"
    export HOME
fi

export PATH="$REAL_HOME/.local/bin:$PATH"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_NAME="${CLAUDE_PROJECT_NAME:-toolblip}"
DEVICE_NAME="${CLAUDE_DEVICE_NAME:-M4Air}"
SESSION_NAME="${CLAUDE_SESSION_NAME:-toolblip-haruns-m4-air}"
PLIST_LABEL="${CLAUDE_PLIST_LABEL:-com.${PROJECT_NAME}.claude-scheduler}"
PLIST_PATH="$REAL_HOME/Library/LaunchAgents/$PLIST_LABEL.plist"

AUTO_MODE=true
BYPASS_PERMS=true
CHROME=true
ATTACH=false
RESTART_DAEMON=false
SHOW_STATUS=false
INSTALL_DAEMON=false
UNINSTALL_DAEMON=false

for arg in "$@"; do
    case "$arg" in
        a|-a|--attach) ATTACH=true ;;
        rd|-rd|--rd) RESTART_DAEMON=true ;;
        st|-st|--status|status) SHOW_STATUS=true ;;
        id|-id|--id) INSTALL_DAEMON=true ;;
        ud|-ud|--ud) UNINSTALL_DAEMON=true ;;
        dp|-dp|--dp) BYPASS_PERMS=false ;;
        da|-da|--da) AUTO_MODE=false ;;
        dc|-dc|--dc) CHROME=false ;;
        h|-h|--help|help)
            cat <<HELP
Usage: ./claude.sh [command] [flags]

Commands:
  (none)   Start daemon in background. Installs launchd agent on first run.
  a        Attach to the running session. Detach with Ctrl-b d.
  rd       Restart daemon — kill the existing session and start fresh.
  st       Show daemon and launchd agent status.
  id       Show launchd agent install status.
  ud       Uninstall launchd agent (disables auto-start on login).
  h        Show this help.

Flags (can combine with any command):
  dp       Disable --dangerously-skip-permissions (it's ON by default).
  da       Disable --enable-auto-mode (it's ON by default).
  dc       Disable --chrome integration (it's ON by default).

Session: $SESSION_NAME
Plist:   $PLIST_PATH
Log:     $HOME/.claude-home/daemon.log
HELP
            exit 0
            ;;
    esac
done

if [ "$ATTACH" = true ]; then
    if tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
        exec tmux attach-session -t "$SESSION_NAME"
    fi
    echo "Daemon is not running. Start it with: ./claude.sh" >&2
    exit 1
fi

if [ "$INSTALL_DAEMON" = true ]; then
    if [ -f "$PLIST_PATH" ]; then
        echo "✓ Already installed: $PLIST_PATH"
    else
        echo "  Plist will be auto-installed on next ./claude.sh run."
    fi
    echo "  To remove: ./claude.sh ud"
    exit 0
fi

if [ "$UNINSTALL_DAEMON" = true ]; then
    if [ -f "$PLIST_PATH" ]; then
        launchctl unload "$PLIST_PATH" 2>/dev/null || true
        rm -f "$PLIST_PATH"
        echo "✓ Removed: $PLIST_PATH"
    else
        echo "No daemon plist found at $PLIST_PATH."
    fi
    exit 0
fi

if [ "$SHOW_STATUS" = true ]; then
    echo "▶ claude.sh status"
    if tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
        echo "  daemon             : running  (session: $SESSION_NAME)"
        echo "  attach             : ./claude.sh a"
    else
        echo "  daemon             : stopped"
        echo "  start              : ./claude.sh"
    fi
    if [ -f "$PLIST_PATH" ]; then
        echo "  launchd agent      : installed  ($PLIST_PATH)"
    else
        echo "  launchd agent      : not installed (auto-installs on next run)"
    fi
    LOG="$HOME/.claude-home/daemon.log"
    if [ -f "$LOG" ]; then
        echo "  log (last 3 lines) :"
        tail -3 "$LOG" | sed 's/^/    /'
    else
        echo "  log                : none yet"
    fi
    exit 0
fi

ENV_FILE="$SCRIPT_DIR/.env"
if [ -f "$ENV_FILE" ]; then
    while IFS= read -r line || [ -n "$line" ]; do
        case "$line" in
            ''|[[:space:]]*'#'*|'#'*) continue ;;
        esac
        if [[ "$line" =~ ^[[:space:]]*([A-Za-z_][A-Za-z0-9_]*)=(.*)$ ]]; then
            key="${BASH_REMATCH[1]}"
            value="${BASH_REMATCH[2]}"
            if [[ "$value" =~ ^\"(.*)\"$ ]]; then
                value="${BASH_REMATCH[1]}"
            elif [[ "$value" =~ ^\'(.*)\'$ ]]; then
                value="${BASH_REMATCH[1]}"
            fi
            export "$key=$value"
        fi
    done < "$ENV_FILE"
fi

if [ "${CLAUDE_HOME_MODE:-system}" = "isolated" ]; then
    export HOME="$SCRIPT_DIR/.claude-home"
    HOME_MODE="isolated"
else
    export HOME="$REAL_HOME"
    HOME_MODE="system"
fi
mkdir -p "$HOME/.claude-home"

CREDS_FILE="$HOME/.claude/.credentials.json"
BOOTSTRAP_MODE=false
BOOTSTRAP_REASON=""
if [ ! -f "$CREDS_FILE" ]; then
    BOOTSTRAP_MODE=true
    BOOTSTRAP_REASON="no Claude credentials in $CREDS_FILE"
fi

for cmd in claude tmux; do
    if ! command -v "$cmd" &>/dev/null; then
        echo "Error: '$cmd' is not installed or not in PATH" >&2
        exit 1
    fi
done

PLIST_NEEDS_UPDATE=false
if [ ! -f "$PLIST_PATH" ]; then
    PLIST_NEEDS_UPDATE=true
elif ! grep -q 'SuccessfulExit' "$PLIST_PATH" 2>/dev/null; then
    PLIST_NEEDS_UPDATE=true
    launchctl unload "$PLIST_PATH" 2>/dev/null || true
    echo "  launchd agent      : upgrading (adding KeepAlive auto-restart)"
fi
if [ "$PLIST_NEEDS_UPDATE" = true ]; then
    mkdir -p "$(dirname "$PLIST_PATH")"
    CLAUDE_BIN_DIR="$(dirname "$(command -v claude)")"
    PLIST_PATH_VAR="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
    if [[ ":$PLIST_PATH_VAR:" != *":$CLAUDE_BIN_DIR:"* ]]; then
        PLIST_PATH_VAR="$CLAUDE_BIN_DIR:$PLIST_PATH_VAR"
    fi
    cat > "$PLIST_PATH" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>${PLIST_LABEL}</string>
    <key>ProgramArguments</key>
    <array>
        <string>${SCRIPT_DIR}/claude.sh</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>WorkingDirectory</key>
    <string>${SCRIPT_DIR}</string>
    <key>StandardOutPath</key>
    <string>${HOME}/.claude-home/daemon.log</string>
    <key>StandardErrorPath</key>
    <string>${HOME}/.claude-home/daemon.log</string>
    <key>KeepAlive</key>
    <dict>
        <key>SuccessfulExit</key>
        <false/>
    </dict>
    <key>ThrottleInterval</key>
    <integer>15</integer>
    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>${PLIST_PATH_VAR}</string>
    </dict>
</dict>
</plist>
PLIST
    launchctl load "$PLIST_PATH" 2>/dev/null || true
    echo "  launchd agent      : installed (auto-starts on login)"
fi

if [ "$RESTART_DAEMON" = true ] && tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
    echo "  restart-daemon     : killing session $SESSION_NAME"
    tmux kill-session -t "$SESSION_NAME"
fi

if [ "$BOOTSTRAP_MODE" = true ]; then
    BASE_ARGS=()
    if [ "$BYPASS_PERMS" = true ]; then
        BASE_ARGS+=(--dangerously-skip-permissions)
    fi
    CLAUDE_CMD="claude ${BASE_ARGS[*]}"
else
    BASE_ARGS=()
    if [ "$BYPASS_PERMS" = true ]; then
        BASE_ARGS+=(--dangerously-skip-permissions)
    fi
    if [ "$AUTO_MODE" = true ]; then
        BASE_ARGS+=(--enable-auto-mode)
    fi
    if [ "$CHROME" = true ]; then
        BASE_ARGS+=(--chrome)
    fi
    RESUME_CMD="claude -c ${BASE_ARGS[*]}"
    FRESH_CMD="claude ${BASE_ARGS[*]}"
    CLAUDE_CMD="$RESUME_CMD || $FRESH_CMD"
fi

echo "▶ claude.sh ($PROJECT_NAME on $DEVICE_NAME)"
echo "  tmux session       : $SESSION_NAME"
echo "  HOME mode          : $HOME_MODE"
echo "  bypass-permissions : $BYPASS_PERMS"
echo "  auto-mode          : $AUTO_MODE"
echo "  chrome             : $CHROME"
echo "  mode               : $([ "$BOOTSTRAP_MODE" = true ] && echo "BOOTSTRAP" || echo "normal")"
if [ "$BOOTSTRAP_MODE" = true ]; then
    echo "  bootstrap reason   : $BOOTSTRAP_REASON"
fi

echo ""
echo "Checking for updates..."
UPDATE_OUTPUT=$(claude update 2>&1)
echo "  $UPDATE_OUTPUT"

if echo "$UPDATE_OUTPUT" | grep -qi "up to date"; then
    UPDATE_APPLIED=false
else
    UPDATE_APPLIED=true
    echo "  Update applied — restarting claude process..."
fi

if [ "$UPDATE_APPLIED" = true ] && tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
    echo "  Killing session $SESSION_NAME for clean restart with new version..."
    tmux kill-session -t "$SESSION_NAME"
fi

if tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
    echo ""
    echo "✓ Daemon already running."
    echo "  Attach : ./claude.sh a"
else
    RESTART_LOOP="while true; do $CLAUDE_CMD; printf '\n[auto-restart] Claude exited — restarting in 5s\n'; sleep 5; done"
    echo "  command            : $CLAUDE_CMD"
    echo ""
    tmux new-session -d -s "$SESSION_NAME" -c "$SCRIPT_DIR"
    tmux send-keys -t "$SESSION_NAME" "export HOME='$HOME'" Enter
    tmux send-keys -t "$SESSION_NAME" "cd '$SCRIPT_DIR'" Enter
    tmux send-keys -t "$SESSION_NAME" "$RESTART_LOOP" Enter

    echo "✓ Daemon started."
    echo "  Attach : ./claude.sh a"
    echo "  Detach : Ctrl-b d  (from inside the session)"
fi

if [ ! -t 1 ]; then
    while tmux has-session -t "$SESSION_NAME" 2>/dev/null; do
        sleep 10
    done
    exit 1
fi
