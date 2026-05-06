#!/usr/bin/env python3
"""Generate keyword research prompt for a topic."""
import sys
import os

if len(sys.argv) < 4:
    print("Usage: research-prompt.py <topic> <gsc_kw> <strategy_file> <output_file>", file=sys.stderr)
    sys.exit(1)

topic = sys.argv[1]
gsc_kw = sys.argv[2]
strategy_file = sys.argv[3]
output_file = sys.argv[4]

strategy = ""
if os.path.exists(strategy_file):
    with open(strategy_file) as f:
        strategy = f.read()

prompt = f"""You are a keyword research assistant for a developer tools blog (toolblip.com).

Topic: {topic}
Existing SEO strategy (if any):
{strategy}

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
{gsc_kw}"""

with open(output_file, 'w') as f:
    f.write(prompt)
