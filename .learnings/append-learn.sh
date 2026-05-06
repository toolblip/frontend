#!/bin/bash
# append-learn.sh — append an entry to a learnings file
# Usage: ./append-learn.sh <code|bug|conv> "<entry>"
# Example: ./append-learn.sh bug "Railway build fails if node_modules not locked"

TYPE="$1"
ENTRY="$2"
DATE=$(date '+%Y-%m-%d')

if [ -z "$TYPE" ] || [ -z "$ENTRY" ]; then
  echo "Usage: $0 <code|bug|conv> \"<entry>\""
  exit 1
fi

case "$TYPE" in
  code)  FILE="CODE_PATTERNS.md" ;;
  bug)   FILE="BUG_PATTERNS.md" ;;
  conv)  FILE="CONVENTIONS.md" ;;
  *)     echo "Unknown type: $TYPE (use: code, bug, conv)"; exit 1 ;;
esac

LEARNINGS_DIR="/Users/ray/Work/toolblip/.learnings"
DEST="$LEARNINGS_DIR/$FILE"

if [ ! -f "$DEST" ]; then
  echo "File not found: $DEST"
  exit 1
fi

# Append with date tag for conv type, no date for code/bug
if [ "$TYPE" = "conv" ]; then
  echo "- **$ENTRY** _(added $DATE)_" >> "$DEST"
else
  echo "- $ENTRY" >> "$DEST"
fi

echo "Added to $FILE: $ENTRY"
