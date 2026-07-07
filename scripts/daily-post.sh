#!/bin/bash
# daily-post.sh — Toolblip daily blog post generator (Mon-Sat daytime)
# Picks 1 topic from queue → researches → generates → humanizes → commits → submits to GSC
set -euo pipefail

# Normalize env for cron
export USER="${USER:-$(id -un 2>/dev/null || echo ray)}"
export LOGNAME="${LOGNAME:-$USER}"
export HOME=/Users/ray
export PATH="$HOME/.local/bin:/opt/homebrew/bin:$PATH"

WORK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$WORK_DIR"

LOCKFILE="/tmp/toolblip-daily-post.lock"
LOGFILE="/tmp/toolblip-daily-post.log"
GENERATED_FILE="/tmp/generated-posts.json"
BLOG_DIR="$WORK_DIR/src/content/blog"
STRATEGY_FILE="$WORK_DIR/src/content/seo-strategy.md"
QUEUE_FILE="$WORK_DIR/pseo-queue.json"
GSC_QUEUE_FILE="$WORK_DIR/gsc-queue.json"

log() { echo "[$(date '+%H:%M:%S')] $1" | tee -a "$LOGFILE" >&2; }
die() { log "FATAL: $1"; release_lock; exit 1; }

# ─── Lock ─────────────────────────────────────────────────────────────────────
check_lock() {
    if [[ -f "$LOCKFILE" ]]; then
        local pid=$(cat "$LOCKFILE")
        if kill -0 "$pid" 2>/dev/null; then
            log "Lock active (PID $pid). Exiting."
            exit 0
        fi
        log "Stale lock removed."
    fi
    echo $$ > "$LOCKFILE"
}
release_lock() { rm -f "$LOCKFILE"; }
trap release_lock EXIT

# ─── Day-of-week check (skip Sunday) ──────────────────────────────────────────
check_day() {
    local dow
    dow=$(date +%u)  # 1=Mon, 6=Sat, 7=Sun
    if [[ "$dow" == "7" ]]; then
        log "Sunday — skipping (no posts on Sundays)."
        exit 0
    fi
    log "Day $dow — posting day ✓"
}

# ─── Helper: claude logged in? ────────────────────────────────────────────────
claude_ok() {
    ./claude.sh -p "ok" 2>/dev/null | grep -qi "ok"
}

# ─── Step 1: Pick topic ───────────────────────────────────────────────────────
pick_topic() {
    log "STEP 1: Picking topic..."
    local topic
    topic=$(python3 scripts/pick-topics.py 1 2>/dev/null | head -1)
    if [[ -z "$topic" ]]; then
        log "No topics available in queue."
        exit 0
    fi
    echo "$topic"
    log "  Topic: $topic"
}

# ─── Step 2: Keyword research ─────────────────────────────────────────────────
research_keywords() {
    local topic="$1"
    log "STEP 2: Keyword research..."
    python3 scripts/seo-content-generator.py keywords "$topic" > "/tmp/kw-${$}.json" 2>&1 || true

    local gsc_kw
    gsc_kw=$(python3 -c "
import json,sys
try:
    data = json.load(open('/tmp/kw-${$}.json'))
    kws = data if isinstance(data, list) else data.get('keywords', [])
    long_tail = [k for k in kws if len(k.split()) >= 2][:8]
    print('\\n'.join(long_tail))
except: print('')
" 2>/dev/null || echo "")

    [[ -z "$gsc_kw" ]] && gsc_kw="$topic"

    local prompt_file="/tmp/kw-prompt-${$}.txt"
    python3 scripts/research-prompt.py "$topic" "$gsc_kw" "$STRATEGY_FILE" "$prompt_file" >/dev/null 2>&1 || true

    local kw_result
    if claude_ok; then
        kw_result=$(./claude.sh -p "$(cat "$prompt_file")" -- --model sonnet --max-turns 3 2>/dev/null || echo "")
    else
        kw_result=""
    fi
    [[ -z "$kw_result" ]] && kw_result="BEST: $topic\nRELATED: $gsc_kw"

    local best related
    best=$(echo "$kw_result" | grep "^BEST:" | sed 's/BEST: //' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//' | tr -d '"')
    related=$(echo "$kw_result" | grep "^RELATED:" | sed 's/RELATED: //' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//' | tr -d '"')
    [[ -z "$best" ]] && best="$topic"

    echo "$best|$related" > "/tmp/kw-selected-${$}.txt"
    log "  Keyword: $best"
    rm -f "/tmp/kw-${$}.json" "$prompt_file"
}

get_best_kw() { cat "/tmp/kw-selected-${$}.txt" 2>/dev/null | cut -d'|' -f1 || echo "$1"; }
get_related_kw() { cat "/tmp/kw-selected-${$}.txt" 2>/dev/null | cut -d'|' -f2 || echo ""; }

# ─── Step 3: Generate content ─────────────────────────────────────────────────
generate_post() {
    local topic="$1"
    log "STEP 3: Generating content..."
    local best_kw related_kw prompt_file output
    best_kw=$(get_best_kw "$topic")
    related_kw=$(get_related_kw)
    prompt_file=$(mktemp)

    python3 scripts/generate-prompt.py \
        "$topic" "$best_kw" "$related_kw" \
        "$STRATEGY_FILE" "$BLOG_DIR" \
        "$prompt_file" >/dev/null 2>&1 || true

    output="/tmp/claude-${$}.txt"
    rm -f "$output"

    python3 scripts/run-claude.py \
        "$prompt_file" \
        --model opus \
        --allowedTools Read,Write,Edit \
        --max-turns 15 \
        > "$output" 2>&1

    local generated_file url title
    generated_file=$(python3 -c "
import sys
c = open('$output').read()
for l in c.split('\n'):
    if l.startswith('FILE:'): print(l[5:].strip()); break
" 2>/dev/null)

    url=$(python3 -c "
import sys
c = open('$output').read()
for l in c.split('\n'):
    if l.startswith('URL:'): print(l[4:].strip()); break
" 2>/dev/null)

    title=$(python3 -c "
import sys
c = open('$output').read()
for l in c.split('\n'):
    if l.startswith('TITLE:'): print(l[6:].strip()); break
" 2>/dev/null)

    # Fallback — recover from prompt
    if [[ -z "$generated_file" ]]; then
        generated_file=$(python3 -c "
import re, sys
txt = open('$prompt_file').read()
m = re.search(r'^Save to:\s*(.+\.md)', txt, re.M)
if m: print(m.group(1).strip())
" 2>/dev/null)
    fi

    rm -f "$prompt_file" "$output"

    if [[ -n "$generated_file" && -f "$generated_file" ]]; then
        local date_slug=$(date '+%Y-%m-%d')
        local slug=$(echo "$best_kw" | sed 's/[^a-z0-9-]/ /g' | sed 's/  */-/g' | tr '[:upper:]' '[:lower:]' | sed 's/^-//;s/-$//' | cut -c1-60)
        [[ -z "$url" ]] && url="https://toolblip.com/blog/$(basename "$generated_file" .md)"
        echo "{\"file\": \"$generated_file\", \"url\": \"$url\", \"slug\": \"${date_slug}-${slug}\", \"topic\": \"$topic\", \"keyword\": \"$best_kw\"}" >> "$GENERATED_FILE"
        log "  Generated: $url"
        echo "$generated_file|$url|$best_kw|$topic"
    else
        log "  WARNING: Claude did not produce a file"
        die "Generation produced no file"
    fi
}

# ─── Step 4: Humanize ─────────────────────────────────────────────────────────
humanize_post() {
    local file="$1"
    log "STEP 4: Humanizing..."

    local prompt_file="/tmp/humanizer-prompt-${$}.txt"
    python3 scripts/humanizer-prompt.py "$file" > "$prompt_file"

    local article_file="/tmp/article-content-${$}.txt"
    cat "$file" > "$article_file"
    local full_prompt
    full_prompt="$(cat "$prompt_file")\n\nARTICLE:\n$(cat "$article_file")"

    local humanized
    if claude_ok; then
        humanized=$(./claude.sh -p "$full_prompt" -- --model sonnet --max-turns 5 2>/dev/null || echo "")
    else
        humanized=""
    fi

    if [[ -n "$humanized" && ${#humanized} -gt 100 ]]; then
        echo "$humanized" > "/tmp/humanized-${$}.txt"
        python3 scripts/humanize-replace.py "$file" "/tmp/humanized-${$}.txt" >> "$LOGFILE" 2>&1
        log "  Humanized ✓"
    fi
    rm -f "$prompt_file" "$article_file" "/tmp/humanized-${$}.txt"
}

# ─── Step 5: Internal links ───────────────────────────────────────────────────
add_links() {
    local file="$1"
    log "STEP 5: Adding internal links..."
    python3 scripts/add-internal-links.py "$file" "$BLOG_DIR" >> "$LOGFILE" 2>&1 || true
}

# ─── Step 6: Commit & push ────────────────────────────────────────────────────
commit_post() {
    local file="$1"
    local topic="$2"
    log "STEP 6: Committing..."
    git add "$file"
    git commit -m "seo: add $topic article $(date '+%Y-%m-%d')" >> "$LOGFILE" 2>&1 || true
    git push origin main >> "$LOGFILE" 2>&1 || true
    log "  Committed & pushed ✓"
}

# ─── Step 7: Submit to GSC ────────────────────────────────────────────────────
submit_gsc() {
    local url="$1"
    local topic="$2"
    log "STEP 7: Submitting to GSC..."

    # Enqueue for tracking
    python3 scripts/enqueue-gsc.py "$url" "$topic" >> "$LOGFILE" 2>&1 || true

    # Submit via sitemap refresh (most reliable with project token)
    python3 scripts/seo-content-generator.py sitemap >> "$LOGFILE" 2>&1 || true
    log "  Sitemap refreshed + URL queued ✓"
}

# ─── Step 8: Self-improve ─────────────────────────────────────────────────────
self_improve() {
    local url="$1"
    local keyword="$2"
    local topic="$3"
    log "STEP 8: Self-improve..."
    python3 scripts/self-improve.py \
        "$url" "$keyword" "$topic" "$GENERATED_FILE" \
        >> "$LOGFILE" 2>&1 || true
    log "  Self-improvement done ✓"
}

# ─── Step 9: Complete topic ───────────────────────────────────────────────────
complete_topic() {
    local topic="$1"
    local url="$2"
    log "STEP 9: Marking topic done..."
    python3 scripts/complete-topic.py "$topic"
    log "  ✓ $topic"
    echo ""
    echo "═══════════════════════════════════════════════════"
    echo "  ✅ Daily post complete!"
    echo "  Topic: $topic"
    echo "  URL:   $url"
    echo "═══════════════════════════════════════════════════"
}

# ─── Main ──────────────────────────────────────────────────────────────────────
check_lock
check_day

log "=== Daily Post Generator ==="

TOPIC=$(pick_topic)
topic="$TOPIC"

research_keywords "$topic"

result=$(generate_post "$topic")
file=$(echo "$result" | cut -d'|' -f1)
url=$(echo "$result" | cut -d'|' -f2)
keyword=$(echo "$result" | cut -d'|' -f3)
topic=$(echo "$result" | cut -d'|' -f4)

humanize_post "$file"
add_links "$file"
commit_post "$file" "$topic"
submit_gsc "$url" "$topic"
self_improve "$url" "$keyword" "$topic"
complete_topic "$topic" "$url"
