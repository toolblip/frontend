#!/bin/bash
# tmux-claude.sh — Send a prompt to the tmux Claude Code daemon and capture output.
# Usage: ./tmux-claude.sh < prompt.txt
# Reads prompt from stdin, sends it to the tmux daemon, waits for completion.

SESSION_NAME="${CLAUDE_SESSION_NAME:-toolblip-haruns-m4-air}"
PROMPT=$(cat)

if [ -z "$PROMPT" ]; then
    echo "ERROR: No prompt provided (stdin empty)" >&2
    exit 1
fi

# Make sure tmux session exists
if ! tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
    echo "ERROR: tmux session $SESSION_NAME not running" >&2
    exit 1
fi

# Get the current pane content before we start (to capture from after this point)
tmux capture-pane -t "$SESSION_NAME" -p | wc -l > /tmp/tmux-claude-start.txt

# Clear any pending input
tmux send-keys -t "$SESSION_NAME" C-c
sleep 1

# Send each line of the prompt, then Enter
while IFS= read -r line; do
    tmux send-keys -t "$SESSION_NAME" "$line" Enter
    sleep 0.1
done <<< "$PROMPT"

# Wait for Claude to finish by checking for the prompt reappearance
# We'll look for the ❯ character and count lines stabilized
MAX_WAIT=300  # 5 minutes max
WAIT_INTERVAL=5
ELAPSED=0
LAST_LINE_COUNT=0
STABLE_COUNT=0

while [ $ELAPSED -lt $MAX_WAIT ]; do
    sleep $WAIT_INTERVAL
    ELAPSED=$((ELAPSED + WAIT_INTERVAL))
    
    # Capture current pane content
    tmux capture-pane -t "$SESSION_NAME" -p > /tmp/tmux-claude-pane.txt 2>/dev/null
    LINE_COUNT=$(wc -l < /tmp/tmux-claude-pane.txt)
    
    # Check if it looks like Claude is done (prompt visible at bottom)
    if tail -3 /tmp/tmux-claude-pane.txt | grep -q '❯'; then
        if [ "$LINE_COUNT" -eq "$LAST_LINE_COUNT" ]; then
            STABLE_COUNT=$((STABLE_COUNT + 1))
            if [ $STABLE_COUNT -ge 2 ]; then
                # Two consecutive stable checks with prompt visible — done
                break
            fi
        else
            STABLE_COUNT=0
        fi
    fi
    LAST_LINE_COUNT=$LINE_COUNT
    
    if [ $ELAPSED -ge $MAX_WAIT ]; then
        echo "TIMEOUT after ${MAX_WAIT}s" >&2
    fi
done

# Output the pane content
cat /tmp/tmux-claude-pane.txt
