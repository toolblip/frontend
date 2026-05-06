#!/usr/bin/env python3
"""Generate the humanizer prompt for a given article file."""
import sys

if len(sys.argv) < 2:
    print("Usage: humanizer-prompt.py <article_file>", file=sys.stderr)
    sys.exit(1)

article_file = sys.argv[1]

prompt = f"""You are a content editor. Remove AI-sounding patterns from this article.

Remove/fix:
- "delve", "game-changer", "excited to announce", "revolutionize"
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

File: {article_file}"""

print(prompt)
