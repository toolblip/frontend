#!/usr/bin/env python3
"""Add internal links to a blog post."""
import sys, os, re, subprocess

def add_related_links(new_file: str, blog_dir: str) -> bool:
    """Add 'Related Tools and Articles' section to new_file using recent posts."""

    # Get recent posts (last 30 days, up to 10)
    try:
        result = subprocess.run(
            ['find', blog_dir, '-name', '*.md', '-mtime', '-30'],
            capture_output=True, text=True, check=True
        )
        all_files = sorted(result.stdout.strip().split('\n'))
    except:
        all_files = []

    if not all_files or new_file not in [f for f in all_files if f]:
        return False

    # Get title of new file
    try:
        with open(new_file) as f:
            content = f.read()
        title_match = re.search(r'^title:\s*(.+?)\s*$', content, re.MULTILINE)
        new_slug = os.path.basename(new_file, '.md')
        new_slug = re.sub(r'^[0-9]+-', '', new_slug)
        new_title = title_match.group(1).strip('"') if title_match else new_slug
    except:
        return False

    # Build related links from other recent posts
    related_lines = []
    count = 0
    for f in all_files:
        if not f or f == new_file:
            continue
        try:
            with open(f) as fh:
                fc = fh.read()
            tm = re.search(r'^title:\s*(.+?)\s*$', fc, re.MULTILINE)
            slug = os.path.basename(f, '.md')
            slug = re.sub(r'^[0-9]+-', '', slug)
            title = tm.group(1).strip('"') if tm else slug
            related_lines.append(f'- [{title}](https://toolblip.com/blog/{slug})')
            count += 1
            if count >= 3:
                break
        except:
            continue

    if not related_lines:
        return False

    related_text = '\n'.join(related_lines)

    # Check if already has "Related Tools" section
    if '## Related Tools and Articles' in content or '## Related Articles' in content:
        return False

    # Append after frontmatter (after the second ---)
    parts = content.split('---', 2)
    if len(parts) < 3:
        return False

    frontmatter = parts[0] + '---' + parts[1] + '---'
    body = parts[2]

    new_content = frontmatter + '\n\n## Related Tools and Articles\n\n' + related_text + '\n' + body

    try:
        with open(new_file, 'w') as f:
            f.write(new_content)
        return True
    except:
        return False

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Usage: add-internal-links.py <new_file> <blog_dir>")
        sys.exit(1)
    new_file = sys.argv[1]
    blog_dir = sys.argv[2]
    if add_related_links(new_file, blog_dir):
        print(f"Added related links to: {new_file}")
    else:
        print("No changes made")
