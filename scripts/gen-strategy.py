#!/usr/bin/env python3
"""Generate the SEO strategy update content."""
import sys
import subprocess
import os
from datetime import datetime

if len(sys.argv) < 6:
    print("Usage: gen-strategy.py <topic> <post_keyword> <ctr> <position> <impressions> <strategy_file>", file=sys.stderr)
    sys.exit(1)

topic = sys.argv[1]
post_keyword = sys.argv[2]
ctr = float(sys.argv[3])
position = float(sys.argv[4])
impressions = int(sys.argv[5])
strategy_file = sys.argv[6]

# Read existing strategy sections
def get_section(filename, section_name, default="(none yet)"):
    try:
        if os.path.exists(filename):
            result = subprocess.run(
                f'grep -A 20 "^{section_name}" "{filename}" 2>/dev/null | head -20 || echo "{default}"',
                shell=True, capture_output=True, text=True
            )
            return result.stdout.strip()
    except:
        pass
    return default

winning = get_section(strategy_file, "## Winning Patterns", "(none yet)")
improvement = get_section(strategy_file, "## Improvement Needed", "(none yet)")
content_rules = get_section(strategy_file, "## Content Rules", "(none yet)")
queue_notes = get_section(strategy_file, "## Queue Notes", "(none yet)")

# Build winning/improvement blocks
winning_block = ""
improvement_block = ""

if ctr >= 3:
    winning_block = f"- {post_keyword}: CTR {ctr}% ({impressions} impressions, pos {position}) — HIGH_PERFORMER\n"
elif ctr < 1 and impressions > 20:
    improvement_block = f"- {post_keyword}: CTR {ctr}% ({impressions} impressions, pos {position}) — NEEDS_IMPROVEMENT\n"

# Content rules
content_rule = ""
if ctr > 0:
    if ctr < 1:
        content_rule = f"- Keyword '{post_keyword}' at position {position} with CTR {ctr}%: titles must match exact search intent\n"
    elif ctr > 3:
        content_rule = f"- Keyword '{post_keyword}' at position {position} with CTR {ctr}%: this structure/title pattern works — use for similar topics\n"

# Timestamp
timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")

# Build the strategy file content
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

print(strategy_content)
