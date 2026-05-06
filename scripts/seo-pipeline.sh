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
    [[ "$utc_hour" -ge 17 && "$utc_hour" -lt 6 ]]
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
    python3 -c "
import json, sys

with open('$QUEUE_FILE', 'r') as f:
    q = json.load(f)

pending = q.get('pending', [])
in_progress = q.get('in_progress', [])

picked = []
while len(picked) < $count and pending:
    picked.append(pending.pop(0))

q['pending'] = pending
q['in_progress'] = in_progress + picked

with open('$QUEUE_FILE', 'w') as f:
    json.dump(q, f, indent=2)

for topic in picked:
    print(topic)
"
}

# Mark a topic as done (move from in_progress → done)
complete_topic() {
    local topic="$1"
    python3 -c "
import json
with open('$QUEUE_FILE', 'r') as f:
    q = json.load(f)
q['in_progress'] = [t for t in q.get('in_progress', []) if t != '$topic']
q['done'] = q.get('done', [])
q['done'].insert(0, {'topic': '$topic', 'completed_at': '$(date -u +%Y-%m-%dT%H:%M:%SZ)'})
with open('$QUEUE_FILE', 'w') as f:
    json.dump(q, f, indent=2)
"
}

# Add a new topic to the pending queue (used by self-improve when new topics emerge)
enqueue_topic() {
    local topic="$1"
    python3 -c "
import json
with open('$QUEUE_FILE', 'r') as f:
    q = json.load(f)
pending = q.get('pending', [])
# Avoid duplicates
if '$topic' not in pending and '$topic' not in q.get('in_progress', []):
    pending.append('$topic')
    q['pending'] = pending
    with open('$QUEUE_FILE', 'w') as f:
        json.dump(q, f, indent=2)
    print('Queued: $topic')
"
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
    python3 -c "
import json
path = '$GSC_QUEUE_FILE'
try:
    with open(path, 'r') as f:
        q = json.load(f)
except:
    q = {'pending': [], 'submitted': [], 'failed': []}
q['pending'].append({'url': '$url', 'topic': '$topic', 'enqueued_at': '$(date -u +%Y-%m-%dT%H:%M:%SZ)'})
with open(path, 'w') as f:
    json.dump(q, f, indent=2)
"
}

mark_gsc_submitted() {
    local url="$1"
    python3 -c "
import json
with open('$GSC_QUEUE_FILE', 'r') as f:
    q = json.load(f)
q['pending'] = [x for x in q.get('pending', []) if x.get('url') != '$url']
q['submitted'] = q.get('submitted', [])
q['submitted'].append({'url': '$url', 'submitted_at': '$(date -u +%Y-%m-%dT%H:%M:%SZ)'})
with open('$GSC_QUEUE_FILE', 'w') as f:
    json.dump(q, f, indent=2)
"
}

# ─── Step 1: Keyword Research (per topic) ──────────────────────────────────────
# Must run BEFORE writing each article — keyword determines article structure
research_keywords_for_topic() {
    local topic="$1"
    local output="/tmp/kw-${$}.json"
    local strategy="$(read_strategy)"

    cd "$HOME/Work/toolblip"

    python3 scripts/seo-content-generator.py keywords "$topic" > "$output" 2>&1

    # Parse keywords from GSC and merge with seed terms
    local gsc_kw
    gsc_kw=$(python3 -c "
import json, sys
try:
    data = json.load(open('$output'))
    kws = data if isinstance(data, list) else data.get('keywords', [])
    long_tail = [k for k in kws if len(k.split()) >= 2][:8]
    print('\n'.join(long_tail))
except:
    print('')
" 2>/dev/null || echo "")

    # If no GSC data yet, use topic as keyword
    if [[ -z "$gsc_kw" ]]; then
        gsc_kw="$topic"
    fi

    # Use Claude to pick the best keyword and find supporting long-tail terms
    local best_kw
    best_kw=$(claude -p "You are a keyword research assistant for a developer tools blog (toolblip.com).

Topic: $topic
Existing SEO strategy (if any):
$strategy

From this topic and GSC data below, select the SINGLE best long-tail keyword to target.
Then list 5-7 related long-tail keywords that support the main keyword.
Format:
BEST: [single best keyword]
RELATED: [comma-separated list]

Rules:
- Best keyword must be specific and low-competition (3-5 words ideal)
- Related keywords should cover supporting sub-topics and questions
- Prioritize 'how to', 'what is', 'best', 'vs' query types
- Ignore generic single-word keywords
- If no GSC data, derive from the topic itself

GSC data:
$gsc_kw" --model sonnet --maxTurns 3 2>/dev/null || echo "BEST: $topic
RELATED: $gsc_kw")

    local best
    best=$(echo "$best_kw" | grep "^BEST:" | sed 's/BEST: //' | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//')
    local related
    related=$(echo "$best_kw" | grep "^RELATED:" | sed 's/RELATED: //' | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//')

    if [[ -z "$best" ]]; then
        best="$topic"
    fi

    echo "$best|$related" > "/tmp/kw-selected-${$}.txt"
    log "  Keyword: $best"

    rm -f "$output"
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
    local keywords_file="/tmp/kw-selected-${$}.txt"

    local best_kw
    best_kw=$(get_best_keyword)
    local related_kw
    related_kw=$(get_related_keywords)
    local strategy
    strategy="$(read_strategy)"

    local slug
    slug=$(echo "$best_kw" | sed 's/[^a-z0-9-]/ /g' | sed 's/  */-/g' | tr '[:upper:]' '[:lower:]' | sed 's/^-//' | sed 's/-$//' | cut -c1-60)
    local date_slug
    date_slug=$(date '+%Y-%m-%d')

    local prompt="You are the Toolblip SEO content writer.

Generate ONE long-form blog post targeting this keyword: '$best_kw'

TOPIC: $topic
KEYWORD: $best_kw
RELATED KEYWORDS: $related_kw

Current SEO strategy (read and follow):
$strategy

The article must:
1. Address the search intent behind '$best_kw' directly in the first paragraph
2. Use '$best_kw' naturally in: title (H1), at least 3 H2 headings, first paragraph, and conclusion
3. Include all related keywords naturally throughout
4. Be 1200-1800 words — substantive, not thin
5. Have 5+ H2 sections with descriptive headings that include the keyword or variation
6. Include at least 2 specific code examples or tool usage examples
7. Include a featured image using: https://api.radtx.com/gradient/6b7280-374151/1200/630
8. End with a clear CTA linking to a relevant tool on toolblip.com (e.g. https://toolblip.com/tools/[tool-name])

Format as markdown with frontmatter:
---
title: \"YOUR TITLE (50-60 chars, include keyword)\"
description: >-
  150-155 char description with CTA, include target keyword naturally
slug: $date_slug-$slug
date: $(date '+%Y-%m-%d')T00:00:00.000Z
category: Developer Tools
tags:
  - $(echo "$topic" | cut -c1-30 | tr ' ' '-')
  - SEO
  - Developer Tools
author: Toolblip Team
readingTime: X min
featuredImage: https://api.radtx.com/gradient/6b7280-374151/1200/630
---

# Article H1 Title (include keyword)

[Content...]

Save to: $BLOG_DIR/${date_slug}-${slug}.md

IMPORTANT rules:
- No em dashes (—)
- No hashtags
- No corporate speak, no "game changer", no "excited to announce"
- Short paragraphs, 1-3 sentences each
- Use --model sonnet style: clear, direct, authoritative
- Internal links to at least 2 other toolblip tools: https://toolblip.com/tools/json-formatter, https://toolblip.com/tools/regex-tester, https://toolblip.com/tools/base64

After saving, output ONLY:
FILE: $BLOG_DIR/${date_slug}-${slug}.md
URL: https://toolblip.com/blog/${date_slug}-${slug}
TITLE: [your title]
SLUG: ${date_slug}-${slug}"

    local output="/tmp/claude-${$}.txt"

    cd "$HOME/Work/toolblip"
    claude -p "$prompt" \
        --model sonnet \
        --allowedTools Read,Write,Edit \
        --maxTurns 15 \
        > "$output" 2>&1

    local generated_file
    generated_file=$(grep "^FILE:" "$output" | head -1 | sed 's/FILE: //' | tr -d '[:space:]')
    local url
    url=$(grep "^URL:" "$output" | head -1 | sed 's/URL: //' | tr -d '[:space:]')
    local title
    title=$(grep "^TITLE:" "$output" | head -1 | sed 's/TITLE: //')

    if [[ -n "$generated_file" && -f "$generated_file" ]]; then
        echo "{\"file\": \"$generated_file\", \"url\": \"$url\", \"slug\": \"${date_slug}-${slug}\", \"topic\": \"$topic\", \"keyword\": \"$best_kw\"}" >> "$GENERATED_FILE"
        log "  Generated: $url"
        echo "$generated_file"
    else
        log "  WARNING: Claude did not produce a file"
        cat "$output" >> "$LOGFILE"
    fi

    rm -f "/tmp/kw-selected-${$}.txt" "/tmp/claude-${$}.txt"
}

# ─── Step 3: Humanize Content ─────────────────────────────────────────────────
# Pass generated content through humanizer skill to strip AI tells
humanize_post() {
    local file="$1"

    if [[ ! -f "$file" ]]; then
        return
    fi

    log "  Humanizing: $(basename $file)"

    # Use humanizer skill via claude
    local prompt="You are a content editor. Remove AI-sounding patterns from this article.

Remove/fix:
- "delve", "game-changer", "game-changer", "excited to announce", "revolutionize"
- "it's worth noting that", "in conclusion", "additionally" (overused transitions)
- Passive voice overuse
- Sentences starting with "This" or "These" to introduce a topic
- Lists where every item starts with the same word
- "Step 1:", "Step 2:" style (use actual subheadings instead)

Preserve:
- All technical content, code examples, URLs
- Article structure and headings
- Frontmatter

Output ONLY the corrected article body (no frontmatter, no explanations).

File: $file"

    local content
    content=$(cat "$file")

    local humanized
    humanized=$(claude -p "$prompt

ARTICLE:
$content" --model sonnet --maxTurns 5 2>/dev/null || echo "")

    if [[ -n "$humanized" && ${#humanized} -gt 100 ]]; then
        # Replace body (keep frontmatter)
        python3 -c "
import re, sys
with open('$file', 'r') as f:
    content = f.read()
# Extract frontmatter
fm_match = re.match(r'(---.*?---\n)', content, re.DOTALL)
if fm_match:
    fm = fm_match.group(1)
    with open('$file', 'w') as f:
        f.write(fm + '\n' + '''$humanized''' + '\n')
print('Humanized')
"
        log "  Humanized: $(basename $file)"
    fi
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

    local current_title
    current_title=$(grep "^title:" "$blog_file" 2>/dev/null | sed 's/title: //' | tr -d '"' || echo "")
    local current_desc
    current_desc=$(grep -A2 "^description:" "$blog_file" 2>/dev/null | tail -1 | sed 's/description: >-//' | tr -d '"' || echo "")

    local prompt="You are the Toolblip SEO editor.

A blog post has good rankings but low CTR. Rewrite ONLY the frontmatter title and description.

Current title: $current_title
Current description: $current_desc
URL: $url

Rules:
- Title: 50-60 chars, include the main keyword near the start, create curiosity/urgency
- Description: 150-155 chars, include a CTA, include the keyword naturally
- Do NOT change the slug, date, or any other frontmatter field
- Do NOT rewrite the article body

Output ONLY the updated frontmatter block (between --- markers):
---
title: \"[new title]\"
description: >-
  [new description]
---
[rest of frontmatter unchanged]"

    local rewrite
    rewrite=$(claude -p "$prompt" --model sonnet --maxTurns 5 2>/dev/null || echo "")

    if [[ -n "$rewrite" && ${#rewrite} -gt 20 ]]; then
        python3 -c "
import re
with open('$blog_file', 'r') as f:
    content = f.read()
# Replace title and description in frontmatter
content = re.sub(r'^title: .*$', 'title: ' + '''$(echo "$rewrite" | grep '^title:' | sed 's/title: //' | tr -d '"')''', content, flags=re.MULTILINE)
with open('$blog_file', 'w') as f:
    f.write(content)
print('Updated')
" 2>/dev/null || true
        git add "$blog_file" 2>/dev/null || true
        git commit -m "fix(seo): rewrite title/meta for $(basename $blog_file)" >> "$LOGFILE" 2>&1 || true
        git push origin main >> "$LOGFILE" 2>&1 || true
        log "  Title/meta rewritten for: $(basename $blog_file)"
    fi
}

# ─── Step 7: Internal Linking ──────────────────────────────────────────────────
add_internal_links() {
    local new_file="$1"
    local all_files
    all_files=$(find "$BLOG_DIR" -name "*.md" -mtime -30 2>/dev/null | sort | tail -10)

    if [[ -z "$all_files" ]]; then
        return
    fi

    # Find related posts by checking for shared tool references or tags
    local new_slug
    new_slug=$(basename "$new_file" .md | sed 's/^[0-9]*-//')
    local new_title
    new_title=$(grep "^title:" "$new_file" 2>/dev/null | sed 's/title: //' | tr -d '"' || echo "$new_slug")

    # Build "Related Articles" section
    local related=""
    local count=0
    while IFS= read -r f; do
        [[ -z "$f" || "$f" == "$new_file" ]] && continue
        local slug
        slug=$(basename "$f" .md | sed 's/^[0-9]*-//')
        local title
        title=$(grep "^title:" "$f" 2>/dev/null | sed 's/title: //' | tr -d '"' || echo "$slug")
        related="$related- [$title](https://toolblip.com/blog/$slug)\n"
        count=$((count + 1))
        [[ $count -ge 3 ]] && break
    done <<< "$all_files"

    if [[ -n "$related" ]]; then
        local new_content
        new_content=$(cat "$new_file" | sed "/^---$/,\${
            /^---$/d
            a\\\\\n\\\\\n## Related Tools and Articles\\\\n\\\\\n\$related
}")
        if [[ "$new_content" != "$(cat "$new_file")" ]]; then
            echo -e "$new_content" > "$new_file"
            git add "$new_file" 2>/dev/null || true
            log "  Added internal links to: $(basename $new_file)"
        fi
    fi
}

# ─── Step 8: Self-Improve (after EACH post) ───────────────────────────────────
# The core loop: analyze what just happened, update strategy, adapt queue
self_improve_after_post() {
    local post_url="$1"
    local post_keyword="$2"
    local topic="$3"

    log "STEP 8: Self-Improve (post: $post_url)"

    local strategy
    strategy="$(read_strategy)"

    # Pull fresh GSC data for just this page
    local page_data
    page_data=$(cd "$HOME/Work/toolblip" && python3 -c "
import json, os, sys, warnings
warnings.filterwarnings('ignore')
for line in open('.env'):
    if line.startswith('GSC_SERVICE_ACCOUNT='):
        val = line.split('=',1)[1].strip()
        os.environ['GSC_SERVICE_ACCOUNT'] = val
from google.oauth2 import service_account
from googleapiclient.discovery import build
from datetime import datetime, timezone, timedelta
info = json.loads(os.environ['GSC_SERVICE_ACCOUNT'])
creds = service_account.Credentials.from_service_account_info(info, scopes=['https://www.googleapis.com/auth/webmasters'])
gsc = build('searchconsole', 'v1', credentials=creds)
now = datetime.now(timezone.utc)
start = (now - timedelta(days=7)).strftime('%Y-%m-%d')
end = now.strftime('%Y-%m-%d')
try:
    result = gsc.searchanalytics().query(
        siteUrl='sc-domain:toolblip.com',
        body={
            'startDate': start, 'endDate': end,
            'dimensions': ['page', 'query'],
            'dimensionFilterGroups': [{'filters': [{'dimension': 'page', 'expression': '$post_url'}]}],
            'rowCount': 20,
            'aggregationType': 'byPage'
        }
    ).execute()
    print(json.dumps(result.get('rows', [])))
except Exception as e:
    print('[]')
" 2>/dev/null | grep -v FutureWarning | grep -v warnings || echo "[]")

    local clicks impressions position ctr
    clicks=$(echo "$page_data" | python3 -c "import sys,json; d=json.load(sys.stdin); print(sum(r.get('clicks',0) for r in d))" 2>/dev/null || echo "0")
    impressions=$(echo "$page_data" | python3 -c "import sys,json; d=json.load(sys.stdin); print(sum(r.get('impressions',0) for r in d))" 2>/dev/null || echo "0")
    position=$(echo "$page_data" | python3 -c "import sys,json; d=json.load(sys.stdin); rows=d if isinstance(d,list) else []; print(min((r.get('position',999) for r in rows), default=999))" 2>/dev/null || echo "999")
    ctr=$(python3 -c "print(round($clicks/max($impressions,1)*100, 2))" 2>/dev/null || echo "0")

    log "  7-day performance: $clicks clicks, $impressions impressions, CTR $ctr%, pos $position"

    # Update strategy file with learnings
    local winning_block=""
    local improvement_block=""

    if python3 -c "exit(0 if $ctr >= 3 else 1)" 2>/dev/null; then
        winning_block="
- '$post_keyword': CTR $ctr% ($clicks clicks/$impressions impressions, pos $position) — **WORKING**, replicate this structure for similar topics"
    elif python3 -c "exit(0 if $ctr < 1 and $impressions > 20 else 1)" 2>/dev/null; then
        improvement_block="
- '$post_keyword': CTR $ctr% ($clicks clicks/$impressions impressions, pos $position) — **LOW CTR**, title/meta need rewriting, or article needs more specific keyword targeting"
    fi

    # Build updated strategy
    local updated_strategy="# Toolblip SEO Strategy
Auto-generated: $(date '+%Y-%m-%d %H:%M') — updated after '$topic'

## Winning Patterns (replicate these)
$(if [[ -f "$STRATEGY_FILE" ]]; then grep -A 20 "^## Winning Patterns" "$STRATEGY_FILE" 2>/dev/null || echo "(none yet)"; fi)
$winning_block

## Improvement Needed
$(if [[ -f "$STRATEGY_FILE" ]]; then grep -A 10 "^## Improvement Needed" "$STRATEGY_FILE" 2>/dev/null || echo "(none yet)"; fi)
$improvement_block

## Content Rules (accumulated learning)
$(if [[ -f "$STRATEGY_FILE" ]]; then grep -A 30 "^## Content Rules" "$STRATEGY_FILE" 2>/dev/null | head -30 || echo "(none yet)"; fi)
$(if [[ "$ctr" -gt 0 ]]; then echo "- Keyword '$post_keyword' at position $position with CTR $ctr%: $(if (( $(echo "$ctr < 1" | bc -l 2>/dev/null || echo 0) )); then echo "LEARNED: titles must match exact search intent"; elif (( $(echo "$ctr > 3" | bc -l 2>/dev/null || echo 0) )); then echo "LEARNED: this structure/title pattern works — use for similar topics"; fi)"; fi)

## Queue Notes
$(if [[ -f "$STRATEGY_FILE" ]]; then grep -A 10 "^## Queue Notes" "$STRATEGY_FILE" 2>/dev/null || echo "(none yet)"; fi)
"

    mkdir -p "$(dirname "$STRATEGY_FILE")"
    echo -e "$updated_strategy" > "$STRATEGY_FILE"
    log "  Strategy updated"

    # Self-improve the queue: if this keyword/topic worked well, enqueue related topics
    if python3 -c "exit(0 if $ctr >= 2 else 1)" 2>/dev/null; then
        log "  High CTR detected — researching related sub-topics..."
        local related_topics
        related_topics=$(claude -p "Given the topic '$topic' and keyword '$post_keyword' which achieved CTR $ctr%, suggest 2-3 specific sub-topics or long-tail variations that would naturally follow. These should be follow-up articles that someone reading about '$post_keyword' would want to read next.

Format (one per line, no explanation):
[sub-topic 1]
[sub-topic 2]
[sub-topic 3]" --model sonnet --maxTurns 3 2>/dev/null || echo "")

        while IFS= read -r rt; do
            [[ -z "$rt" || ${#rt} -lt 5 ]] && continue
            enqueue_topic "$rt"
        done <<< "$related_topics"
    fi
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
    cutoff=$(date -d "180 days ago" +%s 2>/dev/null || python3 -c "from datetime import datetime, timedelta; print((datetime.now()-timedelta(days=180)).strftime('%Y-%m-%d'))" 2>/dev/null)

    local stale_files
    stale_files=$(python3 -c "
import os, re
from datetime import datetime
cutoff = '$cutoff'
cutoff_ts = datetime.strptime(cutoff, '%Y-%m-%d').timestamp()
blog_dir = '$BLOG_DIR'
for f in os.listdir(blog_dir):
    if not f.endswith('.md'): continue
    path = os.path.join(blog_dir, f)
    mtime = os.path.getmtime(path)
    if mtime < cutoff_ts:
        # Check date in frontmatter
        with open(path) as fh:
            content = fh.read()
        date_m = re.search(r'^date:\s*([0-9]{4}-[0-9]{2}-[0-9]{2})', content, re.MULTILINE)
        if date_m:
            d = datetime.strptime(date_m.group(1), '%Y-%m-%d').timestamp()
            if d < cutoff_ts:
                print(path)
" 2>/dev/null || echo "")

    if [[ -z "$stale_files" ]]; then
        log "  No stale content found"
        return
    fi

    while IFS= read -r f; do
        [[ -z "$f" || ! -f "$f" ]] && continue
        local slug
        slug=$(basename "$f" .md | sed 's/^[0-9]*-//')
        local title
        title=$(grep "^title:" "$f" 2>/dev/null | sed 's/title: //' | tr -d '"' || echo "$slug")

        log "  Refreshing stale article: $title"

        # Update date to today
        python3 -c "
import re
with open('$f', 'r') as fh:
    content = fh.read()
content = re.sub(r'^date: .*$', 'date: $(date '+%Y-%m-%d')T00:00:00.000Z', content, flags=re.MULTILINE)
with open('$f', 'w') as fh:
    fh.write(content)
" 2>/dev/null

        # Re-submit to GSC
        python3 scripts/seo-content-generator.py submit "https://toolblip.com/blog/$slug" >> "$LOGFILE" 2>&1 || true
        git add "$f" 2>/dev/null || true
        git commit -m "chore(seo): refresh stale article $slug" >> "$LOGFILE" 2>&1 || true
        git push origin main >> "$LOGFILE" 2>&1 || true
    done <<< "$stale_files"
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
        git commit -m "chore(seo): add internal links to $(basename $generated_file)" >> "$LOGFILE" 2>&1 || true
        git push origin main >> "$LOGFILE" 2>&1 || true

        # 8. Self-improve (after EVERY post — this is the key loop)
        local best_kw
        best_kw=$(python3 -c "import json; d=json.load(open('$GENERATED_FILE')); posts=[p for p in d if 'keyword' in p]; print(posts[-1]['keyword'] if posts else '$topic')" 2>/dev/null || echo "$topic")
        self_improve_after_post "$post_url" "$best_kw" "$topic"

        # 9. Refresh sitemap after each post
        refresh_sitemap

        # Mark topic done
        complete_topic "$topic"

        topic_num=$((topic_num + 1))
    done <<< "$topics"

    # End-of-run: refresh sitemap + check stale content
    refresh_sitemap
    refresh_stale_content

    log "=== SEO Pipeline COMPLETED ==="
}

main "$@"
