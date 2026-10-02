"""Public Toolblip URLs for IndexNow.

The key comes from lib/indexnow.mjs. Image tools use /tools/images/<slug>.
"""
import json
import re
import sys
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HOST = 'toolblip.com'
ENDPOINT = 'https://api.indexnow.org/indexnow'


def indexnow_key():
    source = (ROOT / 'lib' / 'indexnow.mjs').read_text()
    match = re.search(r"INDEXNOW_KEY = '([^']+)'", source)
    if not match:
        raise SystemExit('INDEXNOW_KEY is missing from lib/indexnow.mjs')
    return match.group(1)


def catalog_urls():
    urls = []
    seen = set()
    for line in (ROOT / 'data' / 'tools.ts').read_text().splitlines():
        slug = re.search(r"slug: '([a-z0-9-]+)'", line)
        category = re.search(r"category: '([^']+)'", line)
        if not slug or not category:
            continue
        path = (
            f"/tools/images/{slug.group(1)}"
            if category.group(1) == 'Image'
            else f"/tools/{slug.group(1)}"
        )
        url = f'https://{HOST}{path}'
        if url not in seen:
            seen.add(url)
            urls.append(url)
    return urls


def submit(urls, dry_run=False):
    key = indexnow_key()
    body = {
        'host': HOST,
        'key': key,
        'keyLocation': f'https://{HOST}/{key}.txt',
        'urlList': urls,
    }
    if dry_run:
        print(f'{len(urls)} URLs')
        for url in urls[:5]:
            print(url)
        image = next((url for url in urls if url.endswith('/tools/images/qr-code-generator')), None)
        if image:
            print(image)
        return
    payload = json.dumps(body).encode()
    request = urllib.request.Request(
        ENDPOINT,
        data=payload,
        headers={'Content-Type': 'application/json; charset=utf-8'},
        method='POST',
    )
    with urllib.request.urlopen(request) as response:
        print(f'{response.status} {len(urls)} URLs')


def main(argv=None):
    argv = list(sys.argv[1:] if argv is None else argv)
    dry_run = '--dry-run' in argv
    urls = catalog_urls()
    if not urls:
        raise SystemExit('No tool URLs found in data/tools.ts')
    for start in range(0, len(urls), 10000):
        submit(urls[start:start + 10000], dry_run=dry_run)
        if not dry_run and start + 10000 < len(urls):
            time.sleep(1)
