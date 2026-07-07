#!/usr/bin/env python3
"""
daily-post.py — Toolblip daily blog post generator (Mon-Sat).
Picks 1 topic → researches → generates → humanizes → commits → submits to GSC.
"""
import json, os, re, subprocess, sys
from pathlib import Path
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parent.parent
LOG_FILE = Path("/tmp/toolblip-daily-post.log")
GENERATED_FILE = Path("/tmp/generated-posts.json")
BLOG_DIR = ROOT / "src" / "content" / "blog"
STRATEGY_FILE = ROOT / "src" / "content" / "seo-strategy.md"
QUEUE_FILE = ROOT / "pseo-queue.json"

def log(msg):
    ts = datetime.now().strftime("%H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line, file=sys.stderr)
    with open(LOG_FILE, "a") as f:
        f.write(line + "\n")

def run(cmd, timeout=300, **kwargs):
    """Run a command, log it, return (stdout, returncode)."""
    log(f"  Running: {' '.join(str(c) for c in cmd)[:120]}")
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout, **kwargs)
        return r.stdout, r.returncode
    except subprocess.TimeoutExpired:
        log("  TIMEOUT")
        return "", 124

def claude_ok():
    """Check if claude daemon is available."""
    r = subprocess.run(["tmux", "has-session", "-t", "claude"], capture_output=True, text=True)
    if r.returncode == 0:
        return True
    r = subprocess.run(["pgrep", "-f", "claude.*daemon"], capture_output=True, text=True)
    return r.returncode == 0

def pick_topic():
    """Pick 1 topic from queue, return topic string."""
    out, rc = run(["python3", "scripts/pick-topics.py", "1"], cwd=ROOT)
    if rc != 0:
        return None
    topics = [l.strip() for l in out.split("\n") if l.strip() and not l.startswith("Refilled")]
    return topics[0] if topics else None

def complete_topic(topic):
    run(["python3", "scripts/complete-topic.py", topic], cwd=ROOT)

def gsc_keywords(topic):
    """Get GSC keyword suggestions for a topic."""
    out, rc = run(["python3", "scripts/seo-content-generator.py", "keywords", topic], timeout=30, cwd=ROOT)
    # Filter out stderr-like lines (FutureWarning, RESEACHING, etc.) — keep only JSON array
    lines = [l.strip() for l in out.split("\n") if l.strip().startswith("[") or l.strip().startswith("\"") or l.strip().startswith("  \"") or l.strip() == "]"]
    clean = "\n".join(lines)
    if not clean.startswith("["):
        clean = "[" + clean
    if not clean.endswith("]"):
        clean = clean + "]"
    try:
        data = json.loads(clean)
        kws = data if isinstance(data, list) else data.get("keywords", [])
        return [k for k in kws if len(k.split()) >= 2][:8]
    except json.JSONDecodeError:
        return []

def research_keywords(topic):
    """Research best keyword for topic. Returns (best_keyword, related_keywords_str)."""
    log("STEP 2: Keyword research...")
    gsc_kw_list = gsc_keywords(topic)
    gsc_kw = "\n".join(gsc_kw_list) if gsc_kw_list else topic

    strategy = ""
    if STRATEGY_FILE.exists():
        strategy = STRATEGY_FILE.read_text()

    prompt = f"""You are a keyword research assistant for a developer tools blog (toolblip.com).

Topic: {topic}
Existing SEO strategy (if any):
{strategy}

From this topic and GSC data below, select the SINGLE best long-tail keyword to target.
Then list 5-7 related long-tail keywords that support the main keyword.

GSC data:
{gsc_kw}

Format:
BEST: [single best keyword]
RELATED: [comma-separated related keywords]"""

    if claude_ok():
        kw_result, rc = run([
            "./claude.sh", "-p", prompt, "--", "--model", "sonnet", "--max-turns", "3"
        ], cwd=ROOT)
    else:
        kw_result = ""

    if not kw_result or "BEST:" not in kw_result:
        kw_result = f"BEST: {topic}\nRELATED: {gsc_kw}"

    best = ""
    related = ""
    for line in kw_result.split("\n"):
        if line.startswith("BEST:"):
            best = line.replace("BEST:", "", 1).strip().strip('"')
        elif line.startswith("RELATED:"):
            related = line.replace("RELATED:", "", 1).strip().strip('"')

    if not best:
        best = topic

    log(f"  Keyword: {best}")
    best = re.sub(r'[\n\r]+', '', best)  # strip any embedded newlines
    return best, related

def generate_post(topic, best_kw, related_kw):
    """Generate blog post via Claude Code. Returns (file_path, url, keyword)."""
    log("STEP 3: Generating content...")

    strategy = STRATEGY_FILE.read_text() if STRATEGY_FILE.exists() else ""
    date_slug = datetime.now().strftime("%Y-%m-%d")
    slug = re.sub(r'[^a-z0-9]+', '-', best_kw.lower()).strip('-')[:60]

    existing_posts = sorted(Path(BLOG_DIR).glob("*.md")) if BLOG_DIR.exists() else []

    prompt = f"""You are the Toolblip SEO content writer.

Generate ONE long-form blog post targeting this keyword: '{best_kw}'

TOPIC: {topic}
KEYWORD: {best_kw}
RELATED KEYWORDS: {related_kw}

Current SEO strategy (read and follow):
{strategy}

The article must:
1. Address the search intent behind '{best_kw}' directly in the first paragraph
2. Use '{best_kw}' naturally in: title (H1), at least 3 H2 headings, first paragraph, and conclusion
3. Include all related keywords naturally throughout
4. Be 1200-1800 words - substantive, not thin
5. Have 5+ H2 sections with descriptive headings that include the keyword or variation
6. Include at least 2 specific code examples or tool usage examples
8. Include a featured image using: https://placehold.co/1200x630/374151/FFFFFF?text=Toolblip+Blog
8. End with a clear CTA linking to a relevant tool on toolblip.com

Save the file to: {BLOG_DIR}/{date_slug}-{slug}.md

Format as markdown with frontmatter:
---
title: "YOUR TITLE (50-60 chars, include keyword)"
description: >-
  150-155 char description with CTA, include target keyword naturally
slug: {date_slug}-{slug}
date: {date_slug}T00:00:00.000Z
category: Developer Tools
tags:
  - toolblip
  - [primary keyword]
  - [related keyword]
  - developer tools
---

Then the article body in markdown.

After writing the file, output on the last line:
FILE: {BLOG_DIR}/{date_slug}-{slug}.md
URL: https://toolblip.com/blog/{date_slug}-{slug}
TITLE: [the title you used]"""

    out, rc = run([
        "./claude.sh", "-p", prompt, "--",
        "--model", "opus",
        "--allowedTools", "Read,Write,Edit",
        "--max-turns", "15"
    ], timeout=600, cwd=ROOT)

    # Extract FILE, URL, TITLE from output
    file_path = None
    url = None
    title = None
    for line in out.split("\n"):
        if line.startswith("FILE:"):
            file_path = line[5:].strip()
        elif line.startswith("URL:"):
            url = line[4:].strip()
        elif line.startswith("TITLE:"):
            title = line[6:].strip()

    # Fallback: recover from prompt
    if not file_path:
        m = re.search(r'^Save to:\s*(.+\.md)', prompt, re.M)
        if m:
            file_path = m.group(1).strip()

    found_file = Path(file_path) if file_path else None
    if found_file and found_file.exists():
        if not url:
            url = f"https://toolblip.com/blog/{found_file.stem}"
        record = {
            "file": str(found_file),
            "url": url,
            "slug": f"{date_slug}-{slug}",
            "topic": topic,
            "keyword": best_kw
        }
        with open(GENERATED_FILE, "a") as f:
            f.write(json.dumps(record) + "\n")
        log(f"  Generated: {url}")
        return str(found_file), url, best_kw
    else:
        log("  WARNING: Claude did not produce a file")
        log(f"  Output preview: {out[:500]}")
        return None, None, None

def humanize_post(file_path):
    """Strip AI-sounding patterns from the article."""
    log("STEP 4: Humanizing...")
    if not file_path or not os.path.exists(file_path):
        return

    content = Path(file_path).read_text()
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

ARTICLE:
{content}"""

    humanized, rc = run([
        "./claude.sh", "-p", prompt, "--",
        "--model", "sonnet", "--max-turns", "5"
    ], timeout=300, cwd=ROOT)

    if humanized and len(humanized) > 100:
        # Replace body while keeping frontmatter
        m = re.match(r'(---.*?---\n)', content, re.DOTALL)
        if m:
            fm = m.group(1)
            Path(file_path).write_text(fm + "\n" + humanized + "\n")
            log("  Humanized ✓")

def add_internal_links(file_path):
    log("STEP 5: Adding internal links...")
    run(["python3", "scripts/add-internal-links.py", file_path, str(BLOG_DIR)],
        timeout=30, cwd=ROOT)

def commit_push(topic):
    log("STEP 6: Committing...")
    run(["git", "add", "-A"], timeout=15, cwd=ROOT)
    run(["git", "commit", "-m", f"seo: add {topic} article {datetime.now().strftime('%Y-%m-%d')}"],
        timeout=15, cwd=ROOT)
    run(["git", "push", "origin", "main"], timeout=30, cwd=ROOT)
    log("  Committed & pushed ✓")

def submit_gsc(url, topic):
    log("STEP 7: Submitting to GSC...")
    run(["python3", "scripts/enqueue-gsc.py", url, topic], timeout=15, cwd=ROOT)
    run(["python3", "scripts/seo-content-generator.py", "sitemap"], timeout=30, cwd=ROOT)
    log("  Sitemap refreshed ✓")

def self_improve(url, keyword, topic):
    log("STEP 8: Self-improve...")
    run(["python3", "scripts/self-improve.py", url, keyword, topic, str(GENERATED_FILE)],
        timeout=30, cwd=ROOT)
    log("  Self-improvement done ✓")

def push_back_to_pending(topic):
    """If generation fails, move topic from in_progress back to pending for retry."""
    log("  Moving topic back to pending for retry...")
    q = json.loads(QUEUE_FILE.read_text())
    q["in_progress"] = [t for t in q.get("in_progress", []) if t != topic]
    if topic not in q.get("pending", []):
        q.setdefault("pending", []).insert(0, topic)
    QUEUE_FILE.write_text(json.dumps(q, indent=2) + "\n")

def main():
    log("=== Daily Post Generator ===")

    # Day check
    dow = datetime.now().isoweekday()  # 1=Mon, 7=Sun
    if dow == 7:
        log("Sunday — skipping (no posts on Sundays).")
        return 0
    log(f"Day {dow} — posting day ✓")

    # Pick topic
    topic = pick_topic()
    if not topic:
        log("No topics available in queue.")
        return 0
    log(f"  Topic: {topic}")

    # Research keywords
    best_kw, related_kw = research_keywords(topic)

    # Generate content
    file_path, url, kw = generate_post(topic, best_kw, related_kw)
    if not file_path:
        log("Generation failed. Topic returned to queue for retry.")
        push_back_to_pending(topic)
        return 1

    # Humanize
    humanize_post(file_path)

    # Internal links
    add_internal_links(file_path)

    # Commit & push
    commit_push(topic)

    # Submit to GSC
    submit_gsc(url, topic)

    # Self-improve
    self_improve(url, kw or best_kw, topic)

    # Mark done
    complete_topic(topic)

    print(f"""
═══════════════════════════════════════════════════
  ✅ Daily post complete!
  Topic: {topic}
  URL:   {url}
═══════════════════════════════════════════════════""")
    return 0

if __name__ == "__main__":
    sys.exit(main())
