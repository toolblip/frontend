#!/bin/bash
#
# seo-pipeline.sh — Toolblip SEO content pipeline
# Runs: queue → keyword research → generate → self-improve → submit → fix → link → repeat
#
# Lock prevents concurrent runs. Runs in overnight window only (11PM–6AM Dhaka).
#

set -euo pipefail

LOCKFILE="/tmp/toolblip-seo-pipeline.lock"
LOGFILE="/tmp/toolblip-seo-pipeline.log"
BLOG_DIR="$HOME/Work/toolblip/src/content/blog"
SITE_URL="https://toolblip.com"
QUEUE_FILE="$HOME/Work/toolblip/pseo-queue.json"
GSC_QUEUE_FILE="$HOME/Work/toolblip/gsc-queue.json"
STRATEGY_FILE="$HOME/Work/toolblip/src/content/seo-strategy.md"
GENERATED_FILE="/tmp/generated-posts.json"
STATE_DIR="/tmp/toolblip-seo-state"
INSIGHTS_FILE="/tmp/seo-insights.json"

mkdir -p "$STATE_DIR"

# ─── Time Window ──────────────────────────────────────────────────────────────
in_overnight_window() {
    local utc_hour
    utc_hour=$(date -u +%H)
    # 11PM Dhaka = 5PM UTC, 6AM Dhaka = 12AM UTC
    # Window: 17:00–23:59 UTC (11PM–5:59AM Dhaka)
    [[ "$utc_hour" -ge 17 || "$utc_hour" -lt 6 ]]
}

check_window() {
    if ! in_overnight_window; then
        echo "[$(date)] Outside overnight window. Exiting." >> "$LOGFILE"
        exit 0
    fi
}

# ─── Lock ─────────────────────────────────────────────────────────────────────
check_lock() {
    if [[ -f "$LOCKFILE" ]]; then
        local pid
        pid=$(cat "$LOCKFILE")
        if kill -0 "$pid" 2>/dev/null; then
            echo "[$(date)] Lock active (PID $pid). Exiting." >> "$LOGFILE"
            exit 0
        fi
        echo "[$(date)] Stale lock removed." >> "$LOGFILE"
    fi
    echo $$ > "$LOCKFILE"
}

release_lock() {
    rm -f "$LOCKFILE"
}

log() {
    echo "[$(date '+%H:%M:%S')] $1" | tee -a "$LOGFILE"
}

# ─── Queue Management ──────────────────────────────────────────────────────────
# Move N topics from pending → in_progress in pseo-queue.json
pick_topics() {
    local count="${1:-3}"
    cd "$(dirname "${BASH_SOURCE[0]}")" && python3 pick-topics.py "$count"
}

# Mark a topic as done (move from in_progress → done)
complete_topic() {
    local topic="$1"
    python3 "$HOME/Work/toolblip/scripts/complete-topic.py" "$topic"
}

# Add a new topic to the pending queue (used by self-improve)
enqueue_topic() {
    local topic="$1"
    python3 "$HOME/Work/toolblip/scripts/enqueue-topic.py" "$topic"
}

# Read the current SEO strategy (returns empty if none exists)
read_strategy() {
    if [[ -f "$STRATEGY_FILE" ]]; then
        cat "$STRATEGY_FILE"
    else
        echo ""
    fi
}

# ─── GSC Queue Management ─────────────────────────────────────────────────────
enqueue_gsc_url() {
    local url="$1"
    local topic="$2"
    python3 "$HOME/Work/toolblip/scripts/enqueue-gsc.py" "$url" "$topic"
}

mark_gsc_submitted() {
    local url="$1"
    python3 "$HOME/Work/toolblip/scripts/mark-gsc-submitted.py" "$url"
}

# ─── Step 1: Keyword Research (per topic) ──────────────────────────────────────
# Must run BEFORE writing each article — keyword determines article structure
research_keywords_for_topic() {
    local topic="$1"
    local kw_output="/tmp/kw-${$}.json"
    local prompt_file="/tmp/kw-prompt-${$}.txt"

    cd "$HOME/Work/toolblip"

    python3 scripts/seo-content-generator.py keywords "$topic" > "$kw_output" 2>&1

    # Parse keywords from GSC
    local gsc_kw
    gsc_kw=$(python3 scripts/seo-content-generator.py keywords "$topic" 2>/dev/null | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    kws = data if isinstance(data, list) else data.get('keywords', [])
    long_tail = [k for k in kws if len(k.split()) >= 2][:8]
    print('\n'.join(long_tail))
except:
    print('')
" 2>/dev/null || echo "")

    if [[ -z "$gsc_kw" ]]; then
        gsc_kw="$topic"
    fi

    # Generate prompt via Python
    python3 "$HOME/Work/toolblip/scripts/research-prompt.py"         "$topic" "$gsc_kw" "$STRATEGY_FILE"         "$prompt_file" > /dev/null 2>&1 || true

    # Claude keyword selection
    local kw_result
    kw_result=$(claude -p "$(cat "$prompt_file")" --model sonnet --maxTurns 3 2>/dev/null || echo "BEST: $topic
RELATED: $gsc_kw")

    rm -f "$prompt_file"

    # Parse best + related keywords
    local best related
    best=$(echo "$kw_result" | grep "^BEST:" | sed 's/BEST: //' | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//' | tr -d '"')
    related=$(echo "$kw_result" | grep "^RELATED:" | sed 's/RELATED: //' | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//' | tr -d '"')

    if [[ -z "$best" ]]; then
        best="$topic"
    fi

    echo "$best|$related" > "/tmp/kw-selected-${$}.txt"
    log "  Keyword: $best"

    rm -f "$kw_output"
}

get_best_keyword() {
    cat "/tmp/kw-selected-${$}.txt" 2>/dev/null | cut -d'|' -f1 || echo "$1"
}

get_related_keywords() {
    cat "/tmp/kw-selected-${$}.txt" 2>/dev/null | cut -d'|' -f2 || echo ""
}

# ─── Step 2: Generate Content (one post per call) ─────────────────────────────
generate_one_post() {
    local topic="$1"

    local best_kw
    best_kw=$(get_best_keyword)
    local related_kw
    related_kw=$(get_related_keywords)

    local prompt_file
    prompt_file=$(mktemp)
    python3 "$HOME/Work/toolblip/scripts/generate-prompt.py" \
        "$topic" "$best_kw" "$related_kw" \
        "$STRATEGY_FILE" "$BLOG_DIR" \
        "$prompt_file" > /dev/null 2>&1 || true

    local output="/tmp/claude-${$}.txt"
    rm -f "$output"

    cd "$HOME/Work/toolblip"
    # Use Python helper with --append-system-prompt-file to avoid stdin/argument conflicts
    python3 "$HOME/Work/toolblip/scripts/run-claude.py" \
        "$prompt_file" \
        --model sonnet \
        --allowedTools Read,Write,Edit \
        --max-turns 10 \
        > "$output" 2>&1

    # Parse Claude output with Python (avoids grep|sed|tr issues with paths containing /)
    local generated_file url title
    generated_file=$(python3 -c "
import sys
content = open('$output').read()
for line in content.split('\n'):
    if line.startswith('FILE:'):
        print(line[5:].strip())
        break
" 2>/dev/null)
    url=$(python3 -c "
import sys
content = open('$output').read()
for line in content.split('\n'):
    if line.startswith('URL:'):
        print(line[4:].strip())
        break
" 2>/dev/null)
    title=$(python3 -c "
import sys
content = open('$output').read()
for line in content.split('\n'):
    if line.startswith('TITLE:'):
        print(line[6:].strip())
        break
" 2>/dev/null)

    if [[ -n "$generated_file" && -f "$generated_file" ]]; then
        local date_slug
        date_slug=$(date '+%Y-%m-%d')
        local slug
        slug=$(echo "$best_kw" | sed 's/[^a-z0-9-]/ /g' | sed 's/  */-/g' | tr '[:upper:]' '[:lower:]' | sed 's/^-//' | sed 's/-$//' | cut -c1-60)
        echo "{\"file\": \"$generated_file\", \"url\": \"$url\", \"slug\": \"${date_slug}-${slug}\", \"topic\": \"$topic\", \"keyword\": \"$best_kw\"}" >> "$GENERATED_FILE"
        log "  Generated: $url"
        echo "$generated_file"
    else
        log "  WARNING: Claude did not produce a file"
        cat "$output" >> "$LOGFILE"
    fi

    rm -f "$output"
}

# ─── Step 3: Humanize Content ─────────────────────────────────────────────────
# Pass generated content through humanizer skill to strip AI tells
humanize_post() {
    local file="$1"

    if [[ ! -f "$file" ]]; then
        return
    fi

    log "  Humanizing: $(basename $file)"

    # Write prompt to temp file (avoids quoting issues)
    local prompt_file="/tmp/humanizer-prompt-${$}.txt"
    python3 "$HOME/Work/toolblip/scripts/humanizer-prompt.py" "$file" > "$prompt_file"

    # Read article content
    local content
    content=$(cat "$file")

    # Write article to temp file
    local article_file="/tmp/article-content-${$}.txt"
    echo "$content" > "$article_file"

    # Build full prompt by appending article
    local full_prompt
    full_prompt=$(cat "$prompt_file")
    full_prompt="$full_prompt

ARTICLE:
$(cat "$article_file")"

    # Run humanizer
    local humanized
    humanized=$(claude -p "$full_prompt" --model sonnet --maxTurns 5 2>/dev/null || echo "")

    local tmp_humanized="/tmp/humanized-${$}.txt"
    echo "$humanized" > "$tmp_humanized"

    if [[ -n "$humanized" && ${#humanized} -gt 100 ]]; then
        python3 "$HOME/Work/toolblip/scripts/humanize-replace.py" "$file" "$tmp_humanized" >> "$LOGFILE" 2>&1
        log "  Humanized: $(basename $file)"
    fi
    rm -f "$prompt_file" "$article_file" "$tmp_humanized"
}

# ─── Step 4: Commit One Post ──────────────────────────────────────────────────
commit_post() {
    local file="$1"
    local topic="$2"

    cd "$HOME/Work/toolblip"
    git add "$file"
    git commit -m "feat(seo): $topic article - $(date '+%Y-%m-%d')" >> "$LOGFILE" 2>&1 || true
    git push origin main >> "$LOGFILE" 2>&1 || true
}

# ─── Step 5: Submit URL to GSC ────────────────────────────────────────────────
submit_to_gsc() {
    local url="$1"
    local topic="$2"

    cd "$HOME/Work/toolblip"
    python3 scripts/seo-content-generator.py submit "$url" >> "$LOGFILE" 2>&1
    enqueue_gsc_url "$url" "$topic"
    mark_gsc_submitted "$url"
    log "  GSC submitted: $url"
}

# ─── Step 6: GSC Error Check & Fix for Single URL ─────────────────────────────
check_and_fix_url() {
    local url="$1"

    local diagnosis
    diagnosis=$(python3 "$HOME/Work/toolblip/scripts/seo-content-generator.py" diagnose "$url" "" "" "" 2>&1 || echo "")

    local fix_needed
    fix_needed=$(echo "$diagnosis" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('fix_needed','false'))" 2>/dev/null || echo "false")

    if [[ "$fix_needed" == "True" ]]; then
        local issues
        issues=$(echo "$diagnosis" | python3 -c "import sys,json; d=json.load(sys.stdin); print(', '.join(d.get('issues',[])))" 2>/dev/null || echo "")
        log "  Fixing: $issues"

        python3 "$HOME/Work/toolblip/scripts/seo-content-generator.py" fix "$url" >> "$LOGFILE" 2>&1 || true

        if echo "$issues" | grep -qi "LOW_CTR\|TITLE\|DESCRIPTION"; then
            rewrite_title_meta_if_needed "$url"
        fi
    fi
}

# ─── Step 6b: Rewrite title/meta via Claude ───────────────────────────────────
rewrite_title_meta_if_needed() {
    local url="$1"
    local slug
    slug=$(echo "$url" | sed 's|https://toolblip.com/blog/||')

    local blog_file
    blog_file=$(find "$BLOG_DIR" -name "*${slug}*.md" 2>/dev/null | head -1)

    if [[ -z "$blog_file" || ! -f "$blog_file" ]]; then
        log "  Cannot find file for: $slug"
        return
    fi

    log "  Rewriting title/meta for: $(basename $blog_file)"

    # Write prompt to temp file to avoid bash interpolation issues
    local prompt_file="/tmp/rewrite-meta-${$}.txt"
    cat > "$prompt_file" << 'PROMPTEOF'
You are the Toolblip SEO editor.

A blog post has good rankings but low CTR. Rewrite ONLY the frontmatter title and description.

Current title: TO_REPLACE_TITLE
Current description: TO_REPLACE_DESC
URL: TO_REPLACE_URL

Rules:
- Title: 50-60 chars, include the main keyword near the start, create curiosity/urgency
- Description: 150-155 chars, include a CTA, include the keyword naturally
- Do NOT change the slug, date, or any other frontmatter field
- Do NOT rewrite the article body

Output ONLY the new frontmatter title and description lines (no --- markers, no explanations):
title: "[new title]"
description: >-
  [new description]
PROMPTEOF

    # Replace placeholders
    sed -i "s|TO_REPLACE_TITLE|$current_title|g" "$prompt_file"
    sed -i "s|TO_REPLACE_DESC|$current_desc|g" "$prompt_file"
    sed -i "s|TO_REPLACE_URL|$url|g" "$prompt_file"

    local rewrite
    rewrite=$(claude -p "$(cat "$prompt_file")" --model sonnet --maxTurns 5 2>/dev/null || echo "")

    rm -f "$prompt_file"

    if [[ -n "$rewrite" && ${#rewrite} -gt 20 ]]; then
        python3 "$HOME/Work/toolblip/scripts/update-frontmatter.py" "$blog_file" "$rewrite" >> "$LOGFILE" 2>&1 || true
        git add "$blog_file" 2>/dev/null || true
        git commit -m "fix(seo): rewrite title/meta for $(basename $blog_file)" >> "$LOGFILE" 2>&1 || true
        git push origin main >> "$LOGFILE" 2>&1 || true
        log "  Title/meta rewritten for: $(basename $blog_file)"
    fi
}

# ─── Step 7: Internal Linking ──────────────────────────────────────────────────
add_internal_links() {
    local new_file="$1"
    python3 "$HOME/Work/toolblip/scripts/add-internal-links.py" "$new_file" "$BLOG_DIR" >> "$LOGFILE" 2>&1
    git add "$new_file" 2>/dev/null || true
}

# ─── Step 8: Self-Improve (after EACH post) ───────────────────────────────────
# The core loop: analyze what just happened, update strategy, adapt queue
self_improve_after_post() {
    local post_url="$1"
    local post_keyword="$2"
    local topic="$3"

    log "STEP 8: Self-Improve (post: $post_url)"

    python3 "$HOME/Work/toolblip/scripts/self-improve.py"         "$post_url" "$post_keyword" "$topic" "$GENERATED_FILE"         >> "$LOGFILE" 2>&1

    log "  Self-improvement complete"
}



# ─── Step 9: Refresh Sitemap ───────────────────────────────────────────────────
refresh_sitemap() {
    cd "$HOME/Work/toolblip"
    python3 scripts/seo-content-generator.py sitemap >> "$LOGFILE" 2>&1
    log "  Sitemap refreshed"
}

# ─── Step 10: Stale Content Refresh ────────────────────────────────────────────
refresh_stale_content() {
    log "STEP 10: Checking for stale content (>180 days)..."

    local cutoff
    cutoff=$(date -d "180 days ago" +%Y-%m-%d 2>/dev/null || python3 -c "from datetime import datetime, timedelta; print((datetime.now()-timedelta(days=180)).strftime('%Y-%m-%d'))" 2>/dev/null)

    local stale_tmp
    stale_tmp=$(mktemp)
    python3 "$HOME/Work/toolblip/scripts/find-stale.py" "$BLOG_DIR" "$cutoff" > "$stale_tmp" 2>/dev/null || true

    if [[ ! -s "$stale_tmp" ]]; then
        log "  No stale content found"
        rm -f "$stale_tmp"
        return
    fi

    while IFS= read -r f; do
        [[ -z "$f" || ! -f "$f" ]] && continue
        local slug
        slug=$(basename "$f" .md | sed 's/^[0-9]*-//')
        local title
        title=$(grep "^title:" "$f" 2>/dev/null | sed 's/title: //' | tr -d '"' || echo "$slug")

        log "  Refreshing stale article: $title"

        python3 "$HOME/Work/toolblip/scripts/update-date.py" "$(date '+%Y-%m-%d')" "$f" >> "$LOGFILE" 2>&1 || true
        python3 scripts/seo-content-generator.py submit "https://toolblip.com/blog/$slug" >> "$LOGFILE" 2>&1 || true
        git add "$f" 2>/dev/null || true
        git commit -m "chore: refresh stale article $slug" >> "$LOGFILE" 2>&1 || true
        git push origin main >> "$LOGFILE" 2>&1 || true
    done < "$stale_tmp"
    rm -f "$stale_tmp"
}

# ─── Main Loop ────────────────────────────────────────────────────────────────
main() {
    mkdir -p "$(dirname "$LOGFILE")"
    touch "$LOGFILE"
    touch "$GENERATED_FILE"

    log "=== SEO Pipeline STARTED ==="

    check_window
    check_lock
    trap release_lock EXIT

    # Read current strategy at start
    local strategy
    strategy="$(read_strategy)"
    if [[ -n "$strategy" ]]; then
        log "Strategy loaded from previous run"
    fi

    # Pick 3-5 topics from queue
    local num_topics="${1:-3}"
    log "Picking $num_topics topics from queue..."
    local topics
    topics=$(pick_topics "$num_topics")

    if [[ -z "$topics" ]]; then
        log "No topics in queue. Add topics to pseo-queue.json to run."
        exit 0
    fi

    local topic_count
    topic_count=$(echo "$topics" | grep -c . 2>/dev/null || echo 0)
    log "Topics picked: $topic_count"

    # Write topics to temp file to avoid bash 3.2 read pipeline issues
    local topics_file="/tmp/topics-${$}.txt"
    echo "$topics" > "$topics_file"

    local topic_num=1
    while IFS= read -r topic; do
        [[ -z "$topic" ]] && continue
        log "--- Topic $topic_num/$topic_count: $topic ---"

        # 1. Keyword research per topic
        log "STEP 1: Keyword research"
        research_keywords_for_topic "$topic"

        # 2. Generate content
        log "STEP 2: Generate content"
        local generated_file
        generated_file=$(generate_one_post "$topic")

        if [[ -z "$generated_file" || ! -f "$generated_file" ]]; then
            log "  Skipping remaining steps — no file generated"
            complete_topic "$topic"
            topic_num=$((topic_num + 1))
            continue
        fi

        # 3. Humanize
        log "STEP 3: Humanize"
        humanize_post "$generated_file"

        # 4. Commit
        log "STEP 4: Commit & push"
        commit_post "$generated_file" "$topic"

        # 5. Submit to GSC
        log "STEP 5: GSC submission"
        local post_url="https://toolblip.com/blog/$(basename $generated_file .md | sed 's/^[0-9]*-//')"
        submit_to_gsc "$post_url" "$topic"

        # 6. Check & fix
        log "STEP 6: GSC check & fix"
        check_and_fix_url "$post_url"

        # 7. Internal linking
        log "STEP 7: Internal linking"
        add_internal_links "$generated_file"
        git add "$generated_file" 2>/dev/null || true
        git commit -m "chore: add internal links to $(basename $generated_file)" >> "$LOGFILE" 2>&1 || true
        git push origin main >> "$LOGFILE" 2>&1 || true

        # 8. Self-improve (after EVERY post — this is the key loop)
        local best_kw
        best_kw=$(python3 "$HOME/Work/toolblip/scripts/get-last-keyword.py" "$GENERATED_FILE" "$topic")
        self_improve_after_post "$post_url" "$best_kw" "$topic"

        # 9. Refresh sitemap after each post
        refresh_sitemap

        # Mark topic done
        complete_topic "$topic"

        topic_num=$((topic_num + 1))
    done < "$topics_file"

    # End-of-run: refresh sitemap + check stale content
    refresh_sitemap
    refresh_stale_content

    log "=== SEO Pipeline COMPLETED ==="
}

main "$@"
