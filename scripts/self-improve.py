#!/usr/bin/env python3
"""
Self-improve after posting: fetch GSC metrics, update strategy, enqueue related topics.
"""
import sys
import json
import os
import warnings
import subprocess
from datetime import datetime, timezone, timedelta

warnings.filterwarnings('ignore')

TOOLBLIP_DIR = '/Users/ray/Work/toolblip'
GENERATED_FILE = '/tmp/generated-posts.json'
STRATEGY_FILE = '/Users/ray/Work/toolblip/src/content/seo-strategy.md'
STATE_DIR = '/tmp/toolblip-seo-state'

def load_env():
    for line in open(f'{TOOLBLIP_DIR}/.env'):
        if line.startswith('GSC_SERVICE_ACCOUNT='):
            val = line.split('=', 1)[1].strip()
            os.environ['GSC_SERVICE_ACCOUNT'] = val
            return

def fetch_gsc_data(post_url):
    load_env()
    from google.oauth2 import service_account
    from googleapiclient.discovery import build

    info = json.loads(os.environ['GSC_SERVICE_ACCOUNT'])
    creds = service_account.Credentials.from_service_account_info(
        info,
        scopes=['https://www.googleapis.com/auth/webmasters']
    )
    gsc = build('searchconsole', 'v1', credentials=creds)

    now = datetime.now(timezone.utc)
    start = (now - timedelta(days=7)).strftime('%Y-%m-%d')
    end = now.strftime('%Y-%m-%d')

    try:
        result = gsc.searchanalytics().query(
            siteUrl='sc-domain:toolblip.com',
            body={
                'startDate': start,
                'endDate': end,
                'dimensions': ['page', 'query'],
                'dimensionFilterGroups': [{
                    'filters': [{
                        'dimension': 'page',
                        'expression': post_url
                    }]
                }],
                'rowCount': 20,
                'aggregationType': 'byPage'
            }
        ).execute()
        return result.get('rows', [])
    except:
        return []

def compute_metrics(rows):
    if not rows:
        return 0, 0, 999, 0.0
    clicks = sum(r.get('clicks', 0) for r in rows)
    impressions = sum(r.get('impressions', 0) for r in rows)
    positions = [r.get('position', 999) for r in rows if r.get('position')]
    position = min(positions) if positions else 999
    ctr = round(clicks / max(impressions, 1) * 100, 2)
    return clicks, impressions, position, ctr

def get_last_keyword(generated_file, fallback_topic):
    """Get the last generated keyword from the generated-posts.json."""
    try:
        if os.path.exists(generated_file):
            with open(generated_file) as f:
                posts = json.load(f)
            if posts:
                return posts[-1].get('keyword', fallback_topic)
    except:
        pass
    return fallback_topic

def get_strategy_section(filename, section_name, default="(none yet)"):
    if not os.path.exists(filename):
        return default
    result = subprocess.run(
        f'grep -A 20 "^{section_name}" "{filename}" 2>/dev/null | head -20 || echo "{default}"',
        shell=True, capture_output=True, text=True
    )
    return result.stdout.strip() if result.stdout.strip() else default

def update_strategy(topic, post_keyword, ctr, position, impressions):
    winning = get_strategy_section(STRATEGY_FILE, "## Winning Patterns", "(none yet)")
    improvement = get_strategy_section(STRATEGY_FILE, "## Improvement Needed", "(none yet)")
    content_rules = get_strategy_section(STRATEGY_FILE, "## Content Rules", "(none yet)")
    queue_notes = get_strategy_section(STRATEGY_FILE, "## Queue Notes", "(none yet)")

    winning_block = ""
    improvement_block = ""
    content_rule = ""

    if ctr >= 3:
        winning_block = f"- {post_keyword}: CTR {ctr}% ({impressions} impressions, pos {position}) — HIGH_PERFORMER\n"
    elif ctr < 1 and impressions > 20:
        improvement_block = f"- {post_keyword}: CTR {ctr}% ({impressions} impressions, pos {position}) — NEEDS_IMPROVEMENT\n"

    if ctr > 0:
        if ctr < 1:
            content_rule = f"- Keyword '{post_keyword}' at position {position} with CTR {ctr}%: titles must match exact search intent\n"
        elif ctr > 3:
            content_rule = f"- Keyword '{post_keyword}' at position {position} with CTR {ctr}%: this structure/title pattern works — use for similar topics\n"

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
    strategy_content = f"""# Toolblip SEO Strategy
Auto-generated: {timestamp} — updated after {topic}

## Winning Patterns (replicate these)
{winning}
{winning_block}

## Improvement Needed
{improvement}
{improvement_block}

## Content Rules (accumulated learning)
{content_rules}
{content_rule}

## Queue Notes
{queue_notes}
"""
    os.makedirs(os.path.dirname(STRATEGY_FILE), exist_ok=True)
    with open(STRATEGY_FILE, 'w') as f:
        f.write(strategy_content)

def enqueue_related_topics(topic, post_keyword, ctr):
    """Ask Claude for related sub-topics and enqueue them."""
    prompt = f"""Given the topic '{topic}' and keyword '{post_keyword}' which achieved CTR {ctr}%, suggest 2-3 specific sub-topics or long-tail variations that would naturally follow. These should be follow-up articles that someone reading about '{post_keyword}' would want to read next.

Format (one per line, no explanation):
[sub-topic 1]
[sub-topic 2]
[sub-topic 3]"""

    result = subprocess.run(
        ['claude', '-p', prompt, '--model', 'sonnet', '--maxTurns', '3'],
        capture_output=True, text=True, cwd=TOOLBLIP_DIR
    )
    output = result.stdout.strip()

    enqueue_script = f'{TOOLBLIP_DIR}/scripts/enqueue-topic.py'
    for line in output.split('\n'):
        line = line.strip()
        if line and len(line) >= 5:
            subprocess.run(['python3', enqueue_script, line],
                         capture_output=True)

def main():
    if len(sys.argv) < 5:
        print("Usage: self-improve.py <post_url> <post_keyword> <topic> <generated_file>", file=sys.stderr)
        sys.exit(1)

    post_url = sys.argv[1]
    post_keyword = sys.argv[2]
    topic = sys.argv[3]
    generated_file = sys.argv[4]

    # Use last keyword if not provided
    if not post_keyword or post_keyword == '(none)':
        post_keyword = get_last_keyword(generated_file, topic)

    # Fetch GSC data
    rows = fetch_gsc_data(post_url)
    clicks, impressions, position, ctr = compute_metrics(rows)

    print(f"7-day performance: {clicks} clicks, {impressions} impressions, CTR {ctr}%, pos {position}")

    # Update strategy
    update_strategy(topic, post_keyword, ctr, position, impressions)
    print("Strategy updated")

    # Self-improve queue if high CTR
    if ctr >= 2:
        print(f"High CTR ({ctr}%) — researching related sub-topics...")
        enqueue_related_topics(topic, post_keyword, ctr)
        print("Related topics enqueued")

if __name__ == '__main__':
    main()
