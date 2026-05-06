#!/bin/bash
#
# seo-pipeline.sh — Toolblip SEO content pipeline
# Runs: keyword research → Claude Code content generation → publish → GSC submit
#
# Lock prevents concurrent runs. Runs in overnight window only.
#

set -euo pipefail

LOCKFILE="/tmp/toolblip-seo-pipeline.lock"
STATEFILE="/tmp/toolblip-seo-state.json"
LOGFILE="/tmp/toolblip-seo-pipeline.log"
BLOG_DIR="$HOME/Work/toolblip/src/content/blog"
SITE_URL="https://toolblip.com"

# Overnight window: 11PM–6AM Dhaka = 17:00–23:00 UTC
check_overnight_window() {
    local utc_hour
    utc_hour=$(date -u +%H)
    # 11PM Dhaka = 5PM UTC, 6AM Dhaka = 12AM UTC
    # Window: 17:00 UTC to 23:59 UTC
    if [[ "$utc_hour" -ge 17 ]] || [[ "$utc_hour" -lt 0 ]]; then
        return 0
    fi
    echo "[$(date)] Outside overnight window (UTC $utc_hour). Exiting." >> "$LOGFILE"
    exit 0
}

# Check lock
check_lock() {
    if [[ -f "$LOCKFILE" ]]; then
        local pid
        pid=$(cat "$LOCKFILE")
        if kill -0 "$pid" 2>/dev/null; then
            echo "[$(date)] Lock active (PID $pid). Exiting." >> "$LOGFILE"
            exit 0
        else
            echo "[$(date)] Stale lock (PID $pid). Removing." >> "$LOGFILE"
            rm -f "$LOCKFILE"
        fi
    fi
    echo $$ > "$LOCKFILE"
}

release_lock() {
    rm -f "$LOCKFILE"
}

log() {
    local msg="[$(date '+%Y-%m-%d %H:%M:%S')] $1"
    echo "$msg" >> "$LOGFILE"
    echo "$msg"
}

# ─── Step 1: Keyword Research ───────────────────────────────────────────────
step_keyword_research() {
    log "STEP 1: Keyword Research"
    local kw_output="/tmp/keyword-research.json"

    # Run Python GSC keyword research
    cd "$HOME/Work/toolblip"
    python3 scripts/seo-content-generator.py keywords \
        "online json formatter" \
        "free developer tools browser" \
        "mcp server tools" \
        "cron expression builder" \
        "base64 encoder decoder" \
        "url slug generator" \
        "yaml validator online" \
        "regex tester free" \
        > "$kw_output" 2>&1

    local keywords
    keywords=$(python3 -c "
import json, sys
data = json.load(open('$kw_output'))
kws = data if isinstance(data, list) else data.get('keywords', [])
# Filter: long-tail (>3 words) and relevant
filtered = [k for k in kws if len(k.split()) >= 2][:20]
print('\n'.join(filtered))
" 2>/dev/null || echo "")

    if [[ -z "$keywords" ]]; then
        log "WARNING: No keywords from GSC, using defaults"
        keywords="online developer tools browser based free
mcp server directory finder
best free json formatter validator
cron expression cheat sheet builder
base64 encoder decoder tool online"
    fi

    echo "$keywords" > /tmp/keyword-research.txt
    log "Keywords found: $(echo "$keywords" | wc -l)"
}

# ─── Step 2: Content Generation via Claude Code ──────────────────────────────
step_generate_content() {
    log "STEP 2: Content Generation (Claude Code Opus)"

    local topic
    local slug
    local title
    local keywords_file="/tmp/keyword-research.txt"

    # Pick a keyword from the list (round-robin)
    local all_keywords
    all_keywords=$(cat "$keywords_file" 2>/dev/null | grep . || echo "online developer tools browser based")

    # Use Claude Code to generate content
    local prompt="You are the Toolblip SEO content writer.

Generate 1 long-form blog post (3-5 pieces total, but generate ONE at a time, save it, then confirm). 

Pick the BEST keyword from this list (prioritize long-tail, low-competition):
$(cat $keywords_file)

The blog post should:
1. Be 1200-1800 words
2. Include an introduction, 4-6 sections with subheadings, and a conclusion
3. Naturally integrate the target keyword and 3-5 related long-tail keywords
4. Include a featured image URL using the gradient API: https://api.radtx.com/gradient/6b7280-374151/1200/630 (can vary the colors)
5. End with a brief author bio

Format the file as markdown with frontmatter:
---
title: YOUR TITLE
description: >-
  155 char description for SEO
slug: url-friendly-slug
date: $(date '+%Y-%m-%d')T00:00:00.000Z
category: Developer Tools
tags:
  - Tag1
  - Tag2
  - Tag3
author: Toolblip Team
readingTime: X min
featuredImage: https://api.radtx.com/gradient/6b7280-374151/1200/630
---

# Article Title

Your content here...
---

After saving, write back the full path of the saved file and the URL it will be at (https://toolblip.com/blog/{slug}).

IMPORTANT RULES:
- Write in a semi-formal, authoritative but approachable tone
- No em dashes
- No hashtags  
- No corporate speak
- No "excited to announce" or "game changer"
- Use short paragraphs, 1-3 sentences each
- Include at least 2-3 code blocks or tool examples
- Add a table only if genuinely useful (otherwise avoid)
- Include internal links to other toolblip tools where relevant (e.g. /tools/json-formatter, /tools/regex-tester)
- End with a clear conclusion and call-to-action

Save the file to: $BLOG_DIR/{date}-{slug}.md

After saving, report:
FILE: {full path}
URL: https://toolblip.com/blog/{slug}
TITLE: {title}

Use CLAUDE.md and the project context. Project dir: $HOME/Work/toolblip"

    cd "$HOME/Work/toolblip"

    # Run Claude Code to generate the content
    claude -p "$prompt" \
        --model opus \
        --allowedTools Read,Edit,Write \
        --maxTurns 40 \
        > /tmp/seo-claude-output.txt 2>&1

    local generated_file
    generated_file=$(grep "^FILE:" /tmp/seo-claude-output.txt | head -1 | sed 's/FILE: //' || echo "")

    if [[ -n "$generated_file" && -f "$generated_file" ]]; then
        local slug
        slug=$(grep "^URL:" /tmp/seo-claude-output.txt | head -1 | sed 's|https://toolblip.com/blog/||' || basename "$generated_file" .md)
        local url="https://toolblip.com/blog/$slug"
        echo "{\"file\": \"$generated_file\", \"url\": \"$url\", \"slug\": \"$slug\"}" >> /tmp/generated-posts.json
        log "Generated: $url"
    else
        log "WARNING: Claude Code did not produce a file. Check /tmp/seo-claude-output.txt"
        cat /tmp/seo-claude-output.txt >> "$LOGFILE"
    fi
}

# ─── Step 3: Publish & Commit ────────────────────────────────────────────────
step_publish() {
    log "STEP 3: Publishing (git add + commit)"
    cd "$HOME/Work/toolblip"

    if ! git status --short src/content/blog/ | grep -q .; then
        log "No new blog files to publish"
        return
    fi

    git checkout -b chore/seo-content-$(date '+%Y%m%d') 2>/dev/null || \
        git checkout chore/seo-content-$(date '+%Y%m%d') 2>/dev/null || true

    git add src/content/blog/
    git commit -m "chore: add SEO blog content - $(date '+%Y-%m-%d')" || true
    git push -u origin chore/seo-content-$(date '+%Y%m%d') 2>&1 | tail -5

    # Create PR
    git push -q origin chore/seo-content-$(date '+%Y%m%d') 2>/dev/null || true
    gh pr create --title "chore: add SEO blog content - $(date '+%Y-%m-%d')" \
        --body "Auto-generated SEO content" \
        --base main 2>/dev/null || \
        log "PR creation skipped (gh CLI or existing PR)"
}

# ─── Step 4: GSC URL Submission ──────────────────────────────────────────────
step_submit_gsc() {
    log "STEP 4: GSC URL Submission"

    if [[ ! -f /tmp/generated-posts.json ]]; then
        log "No URLs to submit"
        return
    fi

    cd "$HOME/Work/toolblip"

    while IFS= read -r line; do
        local url
        url=$(echo "$line" | python3 -c "import sys,json; print(json.load(sys.stdin)['url'])" 2>/dev/null || echo "")
        if [[ -n "$url" ]]; then
            python3 scripts/seo-content-generator.py submit "$url" >> "$LOGFILE" 2>&1
            log "Submitted: $url"
        fi
    done < /tmp/generated-posts.json

    # Also refresh sitemap
    python3 scripts/seo-content-generator.py sitemap >> "$LOGFILE" 2>&1
}

# ─── Step 5: GSC Error Check & Auto-fix ─────────────────────────────────────
step_check_and_fix() {
    log "STEP 5: GSC Error Check & Auto-fix"

    local report
    report=$(python3 "$HOME/Work/toolblip/scripts/seo-content-generator.py" check 2>&1)

    echo "$report" >> "$LOGFILE"

    local status
    status=$(echo "$report" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('status','unknown'))" 2>/dev/null || echo "unknown")

    if [[ "$status" == "error" ]]; then
        log "GSC ERROR DETECTED: $report"
        # Auto-fix: re-submit sitemap for coverage issues
        python3 "$HOME/Work/toolblip/scripts/seo-content-generator.py" sitemap >> "$LOGFILE" 2>&1
    fi

    # Check for zero-click-through pages (ranking but not getting clicks)
    local zero_clicks
    zero_clicks=$(echo "$report" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    errs = d.get('errors', [])
    for e in errs:
        print(f\"{e['page']}|{e['query']}|{e['position']}|{e['impressions']}\")
except: pass
" 2>/dev/null || echo "")

    if [[ -n "$zero_clicks" ]]; then
        log "Auto-improving $(echo "$zero_clicks" | wc -l) zero-click pages..."
        echo "$zero_clicks" >> "$LOGFILE"

        # Auto-fix each zero-click page: diagnose + resubmit + trigger title rewrite
        while IFS='|' read -r page query position impressions; do
            if [[ -z "$page" ]]; then continue; fi

            log "AUTO-FIX: Diagnosing $page"

            # Diagnose the page
            local diagnosis
            diagnosis=$(python3 "$HOME/Work/toolblip/scripts/seo-content-generator.py" \
                diagnose "$page" "$query" "$position" "$impressions" 2>&1)

            echo "$diagnosis" >> "$LOGFILE"

            # Check what needs fixing
            local fix_needed coverage_state
            fix_needed=$(echo "$diagnosis" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('fix_needed', False))" 2>/dev/null || echo "false")
            coverage_state=$(echo "$diagnosis" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('coverage_state', 'UNKNOWN'))" 2>/dev/null || echo "UNKNOWN")

            if [[ "$fix_needed" == "True" ]]; then
                # Get the specific issues
                local issues
                issues=$(echo "$diagnosis" | python3 -c "import sys,json; d=json.load(sys.stdin); print(', '.join(d.get('issues', [])))" 2>/dev/null || echo "")
                log "ISSUES on $page: $issues"

                # Fix 1: Re-submit the page for indexing
                if [[ "$coverage_state" != "Valid" ]]; then
                    python3 "$HOME/Work/toolblip/scripts/seo-content-generator.py" fix "$page" >> "$LOGFILE" 2>&1
                    log "Re-submitted for indexing: $page"
                fi

                # Fix 2: If LOW_CTR, trigger title/meta rewrite via Claude Code
                if echo "$issues" | grep -qi "LOW_CTR"; then
                    log "LOW_CTR detected for '$query' at position $position — rewriting title/meta..."
                    rewrite_page_title_meta "$page" "$query" "$position"
                fi
            fi
        done <<< "$zero_clicks"

        # Refresh sitemap after fixes
        python3 "$HOME/Work/toolblip/scripts/seo-content-generator.py" sitemap >> "$LOGFILE" 2>&1
    fi
}

# ─── Step 5b: Rewrite page title/meta via Claude Code ────────────────────────
rewrite_page_title_meta() {
    local page_url="$1"
    local query="$2"
    local position="$3"

    # Extract slug from URL
    local slug
    slug=$(echo "$page_url" | sed 's|https://toolblip.com/blog/||')

    # Find the blog post file
    local blog_file
    blog_file=$(find "$BLOG_DIR" -name "*${slug}*.md" 2>/dev/null | head -1)

    if [[ -z "$blog_file" || ! -f "$blog_file" ]]; then
        log "Could not find blog file for slug: $slug"
        return
    fi

    log "Rewriting title/meta for $blog_file (target query: '$query', position: $position)"

    local prompt="You are the Toolblip SEO editor.

A blog post has good rankings (position $position) for the query '$query' but low CTR (zero clicks).

File: $blog_file

Your task:
1. Read the current frontmatter title and description
2. Rewrite ONLY the title and description in frontmatter to improve CTR
3. Keep the same slug and date
4. The new title should: be 50-60 chars, include the query keyword near the start, create curiosity
5. The new description should: be 150-155 chars, include a call-to-action or specific benefit, include the keyword

Rules:
- Do NOT rewrite the article body — only frontmatter
- Keep the same slug and date
- Output ONLY the updated frontmatter block (the lines between --- markers)

Start your response with --- and end with ---"

    local rewrite_output
    rewrite_output=$(claude -p "$prompt" \
        --model sonnet \
        --maxTurns 10 \
        2>&1 || echo "CLAUDE_FAILED")

    if echo "$rewrite_output" | grep -q "CLAUDE_FAILED\|Error"; then
        log "Title/meta rewrite failed for $blog_file"
        return
    fi

    # Extract frontmatter from output
    local new_frontmatter
    new_frontmatter=$(echo "$rewrite_output" | sed -n '/^---$/,/^---$/p' | sed '1d;$d')

    if [[ -n "$new_frontmatter" ]]; then
        log "New frontmatter for $blog_file:"
        echo "$new_frontmatter" >> "$LOGFILE"
        # Apply the frontmatter update using Python (more reliable than sed for YAML)
        python3 -c "
import re, sys
with open('$blog_file', 'r') as f:
    content = f.read()
# Replace frontmatter
new_fm = '''---
$new_frontmatter
---'''
# Replace existing frontmatter block
content = re.sub(r'^---\n.*?\n---', '---\n' + '''$new_frontmatter''' + '\n---', content, flags=re.DOTALL)
with open('$blog_file', 'w') as f:
    f.write(content)
print('Frontmatter updated')
" 2>&1 >> "$LOGFILE"
        log "Frontmatter updated for $blog_file"
    else
        log "Could not extract new frontmatter for $blog_file"
    fi
}

# ─── Step 6: Internal Linking Pass ───────────────────────────────────────────
step_internal_linking() {
    log "STEP 6: Internal Linking Pass"

    # Collect all recently generated posts
    local recent_posts
    recent_posts=$(find "$BLOG_DIR" -name "*.md" -mtime -7 2>/dev/null | sort -t'-' -k1 -r | head -5)

    if [[ -z "$recent_posts" ]]; then
        log "No recent posts for internal linking"
        return
    fi

    local slugs_and_urls=""
    while IFS= read -r post_file; do
        if [[ -f "$post_file" ]]; then
            local slug title url
            slug=$(basename "$post_file" .md | sed 's/^[0-9]*-//')
            title=$(grep "^title:" "$post_file" 2>/dev/null | sed 's/title: //' | tr -d '"' || echo "")
            url="https://toolblip.com/blog/$slug"
            slugs_and_urls="$slugs_and_urls|$slug|$title|$url"
        fi
    done <<< "$recent_posts"

    # For each recent post, add internal links to other recent posts
    while IFS= read -r post_file; do
        if [[ -f "$post_file" ]]; then
            local slug
            slug=$(basename "$post_file" .md | sed 's/^[0-9]*-//')

            # Build a related links section
            local related=""
            while IFS='|' read -r s t u; do
                if [[ -n "$s" && "$s" != "$slug" && -n "$t" ]]; then
                    related="$related- [$t]($u)\n"
                fi
            done <<< "$slugs_and_urls"

            if [[ -n "$related" ]]; then
                # Append to the file before the last --- (if article ends with ---)
                local updated_content
                updated_content=$(cat "$post_file" | sed "/^---$/,\${
                    /^---$/d
                    a\\
\\
## Related Tools and Articles\\
\\
$related
}" 2>/dev/null || cat "$post_file")

                if [[ "$updated_content" != "$(cat "$post_file")" ]]; then
                    echo "$updated_content" > "$post_file"
                    log "Added internal links to $(basename $post_file)"
                fi
            fi
        fi
    done <<< "$recent_posts"
}

# ─── Step 7: Self-Improvement Loop ───────────────────────────────────────────
# Pulls 30-day GSC data, identifies winning/failing patterns, adapts strategy.
step_self_improve() {
    log "STEP 7: Self-Improvement Analysis"

    local insights_file="/tmp/seo-insights.json"

    # Pull GSC blog performance data from past 30 days
    local gsc_data
    gsc_data=$(cd "$HOME/Work/toolblip" && python3 -c "
import json, os, sys
sys.path.insert(0, 'scripts')
for line in open('.env'):
    if line.startswith('GSC_SERVICE_ACCOUNT='):
        val = line.split('=', 1)[1].strip()
        os.environ['GSC_SERVICE_ACCOUNT'] = val

from google.oauth2 import service_account
from googleapiclient.discovery import build
from datetime import datetime, timezone

info = json.loads(os.environ['GSC_SERVICE_ACCOUNT'])
creds = service_account.Credentials.from_service_account_info(info, scopes=['https://www.googleapis.com/auth/webmasters'])
gsc = build('searchconsole', 'v1', credentials=creds)

now = datetime.now(timezone.utc)
start = (now - __import__('datetime').timedelta(days=30)).strftime('%Y-%m-%d')
end = now.strftime('%Y-%m-%d')

try:
    result = gsc.searchanalytics().query(
        siteUrl='https://toolblip.com/',
        body={
            'startDate': start,
            'endDate': end,
            'dimensions': ['page', 'query'],
            'rowCount': 500,
            'aggregationType': 'byPage'
        }
    ).execute()
    rows = result.get('rows', [])
    blog_rows = [r for r in rows if '/blog/' in r['keys'][0]]
    print(json.dumps(blog_rows))
except Exception as e:
    print('ERROR:' + str(e))
" 2>&1 | grep -v FutureWarning | grep -v "warnings.warn" | grep -v "^$" || echo "[]")

    if [[ "$gsc_data" == "[]" || -z "$gsc_data" || "$gsc_data" == *"ERROR"* ]]; then
        log "No GSC blog data yet — self-improvement skipped (expected on first runs)"
        return
    fi

    local page_count
    page_count=$(echo "$gsc_data" | python3 -c "import sys,json; d=json.load(sys.stdin); print(len(d))" 2>/dev/null || echo "0")
    log "Analyzing $page_count blog pages from GSC (30-day window)..."

    # Build performance insights
    local insights
    insights=$(echo "$gsc_data" | python3 -c "
import json, sys

data = json.load(sys.stdin)
if not data:
    print('{}')
    sys.exit(0)

high_ctr = []
mid_ctr = []
low_ctr = []

for row in data:
    page = row['keys'][0]
    query = row['keys'][1]
    clicks = row.get('clicks', 0)
    impressions = row.get('impressions', 0)
    position = row.get('position', 999)
    ctr = round(clicks / impressions * 100, 2) if impressions > 0 else 0
    entry = {'page': page, 'query': query, 'clicks': clicks, 'impressions': impressions, 'position': position, 'ctr': ctr}

    if impressions == 0:
        continue
    if ctr > 5:
        high_ctr.append(entry)
    elif ctr >= 1:
        mid_ctr.append(entry)
    else:
        low_ctr.append(entry)

avg_ctr = round(sum(r.get('clicks',0)/r.get('impressions',1)*100 for r in data if r.get('impressions',0)>0) / max(len(data), 1), 2)

insights = {
    'total_pages': len(data),
    'pages_with_clicks': sum(1 for r in data if r.get('clicks', 0) > 0),
    'avg_ctr': avg_ctr,
    'top_pages': sorted(data, key=lambda x: x.get('clicks', 0), reverse=True)[:5],
    'high_ctr_pages': high_ctr[:5],
    'low_ctr_pages': sorted(low_ctr, key=lambda x: x['impressions'], reverse=True)[:5],
    'high_ranking_pages': [r for r in data if r.get('position', 999) <= 10][:5],
    'winning_queries': list(set([r['query'] for r in high_ctr])),
    'failing_queries': list(set([r['query'] for r in sorted(low_ctr, key=lambda x: x['impressions'], reverse=True)])),
    'total_clicks': sum(r.get('clicks',0) for r in data),
    'total_impressions': sum(r.get('impressions',0) for r in data)
}
print(json.dumps(insights, indent=2))
" 2>&1 || echo "{}")

    if [[ -z "$insights" || "$insights" == "{}" ]]; then
        log "Could not generate insights — skipping self-improvement"
        return
    fi

    echo "$insights" > "$insights_file"

    # Log key metrics
    echo "$insights" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print(f\"  Total blog pages tracked: {d.get('total_pages', 0)}\")
print(f\"  Pages with clicks: {d.get('pages_with_clicks', 0)}\")
print(f\"  Average CTR: {d.get('avg_ctr', 0)}%\")
print(f\"  Total clicks (30d): {d.get('total_clicks', 0)}\")
print(f\"  Top winning queries: {d.get('winning_queries', [])[:3]}\")
print(f\"  Failing queries to improve: {d.get('failing_queries', [])[:3]}\")
" 2>/dev/null

    # Apply learnings
    apply_seo_learnings "$insights"

    # If we have winning queries, expand coverage
    local top_winning
    top_winning=$(echo "$insights" | python3 -c "import sys,json; d=json.load(sys.stdin); w=d.get('winning_queries',[]); print(w[0] if w else '')" 2>/dev/null || echo "")

    if [[ -n "$top_winning" ]]; then
        log "Winning query detected: '$top_winning' — generating expansion content..."
        generate_expansion_content "$top_winning" "$insights"
    fi
}

# ─── Step 7b: Apply SEO learnings to future content strategy ──────────────────
apply_seo_learnings() {
    local insights="$1"

    local winning_queries failing_queries avg_ctr total_clicks
    winning_queries=$(echo "$insights" | python3 -c "import sys,json; d=json.load(sys.stdin); print(' | '.join(d.get('winning_queries',[])[:5]))" 2>/dev/null || echo "")
    failing_queries=$(echo "$insights" | python3 -c "import sys,json; d=json.load(sys.stdin); print(' | '.join(d.get('failing_queries',[])[:5]))" 2>/dev/null || echo "")
    avg_ctr=$(echo "$insights" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('avg_ctr','N/A'))" 2>/dev/null || echo "N/A")
    total_clicks=$(echo "$insights" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('total_clicks','0'))" 2>/dev/null || echo "0")

    # Write strategy file that the next content generation step will read
    local strategy_file="$HOME/Work/toolblip/src/content/seo-strategy.md"
    mkdir -p "$(dirname "$strategy_file")"

    cat > "$strategy_file" << EOF
# Toolblip SEO Strategy
Auto-generated: $(date '+%Y-%m-%d %H:%M')

## Current Performance (30-day window)
- Blog pages tracked: see GSC
- Average CTR: $avg_ctr%
- Total clicks: $total_clicks

## What is WORKING (write more of this):
$winning_queries

## What is NOT working (stop / fix):
$failing_queries

## Content rules for next run:
1. Titles must match exact search intent — if CTR is high, title is aligned
2. Use "how to", "vs", "best" prefixes for informational queries (higher CTR)
3. FAQ sections capture People Also Ask — always include for how-to queries
4. If impressions are high but clicks are zero: rewrite title (too generic) or description (no call-to-action)
5. Internal links between blog posts boost crawlability and time-on-site
EOF

    log "SEO strategy updated: $strategy_file"
}

# ─── Step 7c: Expand content for winning queries ───────────────────────────────
generate_expansion_content() {
    local query="$1"
    local insights="$2"

    # Check if we already covered this query well (already have a high-CTR page)
    local existing_pages
    existing_pages=$(echo "$insights" | python3 -c "
import sys, json
d = json.load(sys.stdin)
pages = [r for r in d.get('high_ctr_pages', []) if r['query'].lower() == '$query'.lower()]
for p in pages:
    print(f\"  - {p['page']} (CTR: {p['ctr']}%, pos: {p['position']})\")
" 2>/dev/null || echo "")

    if [[ -n "$existing_pages" ]]; then
        log "Query '$query' already has high-CTR pages, skipping expansion:"
        echo "$existing_pages"
        return
    fi

    log "Generating expansion content for winning query: '$query'"

    local strategy_file="$HOME/Work/toolblip/src/content/seo-strategy.md"
    local strategy_ref=""
    if [[ -f "$strategy_file" ]]; then
        strategy_ref="Current SEO strategy:
$(cat "$strategy_file")"
    fi

    local prompt="You are the Toolblip SEO writer.

Generate ONE in-depth blog post targeting this query: '$query'

This query is already generating impressions and rankings — create the definitive piece that captures more clicks.

$strategy_ref

Requirements:
- 1500-2000 words
- Include FAQ section (schema.org FAQPage markup) to capture People Also Ask
- Use clear H2/H3 hierarchy
- Include a comparison table if comparing tools/approaches
- Add code examples or tool usage examples where relevant
- End with a clear CTA linking to the relevant tool on toolblip.com
- Internal links to other toolblip tools

Format as markdown with frontmatter:
---
title: YOUR TITLE
description: >-
  155 char SEO description
slug: url-slug
date: $(date '+%Y-%m-%d')T00:00:00.000Z
category: Developer Tools
tags:
  - Tag1
  - Tag2
author: Toolblip Team
readingTime: X min
featuredImage: https://api.radtx.com/gradient/6b7280-374151/1200/630
---

After saving, report:
FILE: {full path}
URL: https://toolblip.com/blog/{slug}
TITLE: {title}
QUERY_TARGETED: $query

Project dir: $HOME/Work/toolblip
Save to: $BLOG_DIR/{date}-{slug}.md"

    local output
    output=$(claude -p "$prompt" \
        --model sonnet \
        --maxTurns 15 \
        2>&1 || echo "CLAUDE_FAILED")

    if echo "$output" | grep -q "CLAUDE_FAILED\|Error"; then
        log "Expansion content failed for: $query"
        return
    fi

    local generated_file
    generated_file=$(echo "$output" | grep "^FILE:" | head -1 | sed 's/FILE: //' || echo "")

    if [[ -n "$generated_file" && -f "$generated_file" ]]; then
        local slug
        slug=$(basename "$generated_file" .md)
        local url="https://toolblip.com/blog/$slug"
        echo "{\"file\": \"$generated_file\", \"url\": \"$url\", \"slug\": \"$slug\", \"query\": \"$query\"}" >> /tmp/generated-posts.json
        log "Expansion post generated: $url"

        # Immediately submit to GSC
        cd "$HOME/Work/toolblip"
        python3 scripts/seo-content-generator.py submit "$url" >> "$LOGFILE" 2>&1
        log "Expansion post submitted to GSC: $url"

        # Also commit it
        git add "$generated_file" 2>/dev/null || true
        git commit -m "feat(seo): expansion content for '$query' - $(date '+%Y-%m-%d')" >> "$LOGFILE" 2>&1 || true
    fi
}

# ─── Main ───────────────────────────────────────────────────────────────────
main() {
    mkdir -p "$(dirname "$LOGFILE")"
    touch "$LOGFILE"

    log "=== SEO Pipeline STARTED ==="

    check_overnight_window
    check_lock

    trap release_lock EXIT

    rm -f /tmp/generated-posts.json
    touch /tmp/generated-posts.json

    step_keyword_research

    # Generate 3-5 pieces
    local num_pieces=${1:-3}
    for i in $(seq 1 "$num_pieces"); do
        log "Generating piece $i of $num_pieces"
        step_generate_content
    done

    step_publish
    step_submit_gsc
    step_check_and_fix
    step_internal_linking
    step_self_improve

    log "=== SEO Pipeline COMPLETED ==="
    echo "=== DONE at $(date) ===" >> "$LOGFILE"
}

main "$@"
