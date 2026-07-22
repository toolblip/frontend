#!/usr/bin/env python3
"""
gsc-submit-urls.py — Submit URLs to Google Search Console & IndexNow (Bing).
Notifies search engines about new/updated pages for faster indexing.

Usage:
  python3 scripts/gsc-submit-urls.py                    # Submit all sitemap URLs via IndexNow
  python3 scripts/gsc-submit-urls.py --url <url>        # Submit a single URL
  python3 scripts/gsc-submit-urls.py --gsc-report       # Just run the GSC coverage report
  python3 scripts/gsc-submit-urls.py --gsc-inspect <url> # Inspect a single URL via GSC
"""

import json, os, sys, re, urllib.request, urllib.error
from datetime import datetime, timezone

BASE_URL = "https://toolblip.com"
STATE_DIR = "/tmp/toolblip-seo-state"

def load_env():
    """Load secrets from .env"""
    env_paths = [
        os.path.expanduser("~/.hermes/secrets/tb.env"),
        os.path.join(os.path.dirname(__file__), "..", ".env"),
    ]
    for path in env_paths:
        if os.path.exists(path):
            for line in open(path):
                line = line.strip()
                if line.startswith("BING_WEBMASTER_API_KEY="):
                    val = line.split("=", 1)[1].strip().strip("'").strip('"')
                    os.environ["BING_WEBMASTER_API_KEY"] = val
                elif line.startswith("GSC_SERVICE_ACCOUNT="):
                    val = line.split("=", 1)[1].strip().strip("'").strip('"')
                    os.environ["GSC_SERVICE_ACCOUNT"] = val

def get_sitemap_urls():
    """Fetch all URLs from the sitemap."""
    import xml.etree.ElementTree as ET
    try:
        resp = urllib.request.urlopen(f"{BASE_URL}/sitemap.xml", timeout=15)
        tree = ET.parse(resp)
        ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        urls = [url.find("sm:loc", ns).text for url in tree.findall("sm:url", ns)]
        return urls
    except Exception as e:
        print(f"⚠️ Failed to fetch sitemap: {e}")
        return []

def submit_indexnow(urls, api_key=None):
    """Submit URLs via IndexNow protocol (Bing, Yandex, Seznam)."""
    if not api_key:
        api_key = os.environ.get("BING_WEBMASTER_API_KEY")
    if not api_key:
        print("⚠️ No IndexNow API key found (set BING_WEBMASTER_API_KEY)")
        return False

    host = BASE_URL.replace("https://", "").replace("http://", "")
    key_location = f"{BASE_URL}/{api_key}.txt"

    # Submit in batches of 10
    batch_size = 10
    total = len(urls)
    success = 0

    for i in range(0, total, batch_size):
        batch = urls[i:i+batch_size]
        payload = json.dumps({
            "host": host,
            "key": api_key,
            "keyLocation": key_location,
            "urlList": batch,
        }).encode("utf-8")

        req = urllib.request.Request(
            "https://api.indexnow.org/indexnow",
            data=payload,
            headers={"Content-Type": "application/json; charset=utf-8"},
            method="POST",
        )
        try:
            resp = urllib.request.urlopen(req, timeout=10)
            if resp.status == 200:
                success += len(batch)
                print(f"  ✓ Submitted {len(batch)} URLs (IndexNow HTTP 200)")
            else:
                print(f"  ⚠️ IndexNow returned HTTP {resp.status} for batch {i//batch_size}")
        except urllib.error.HTTPError as e:
            print(f"  ⚠️ IndexNow HTTP {e.code}: {e.reason}")
        except Exception as e:
            print(f"  ⚠️ IndexNow error: {e}")

    print(f"\n  IndexNow: {success}/{total} URLs submitted")
    return success > 0

def gsc_inspect_url(url):
    """Inspect a URL via GSC URL Inspection API."""
    from google.oauth2 import service_account
    from googleapiclient.discovery import build

    creds_raw = os.environ.get("GSC_SERVICE_ACCOUNT")
    if not creds_raw:
        print("⚠️ GSC_SERVICE_ACCOUNT not configured")
        return

    creds_raw = creds_raw.strip()
    try:
        creds_info = json.loads(creds_raw)
    except (json.JSONDecodeError, ValueError):
        import base64
        creds_info = json.loads(base64.b64decode(creds_raw))
    if isinstance(creds_info, str):
        creds_info = json.loads(creds_info)

    credentials = service_account.Credentials.from_service_account_info(
        creds_info, scopes=["https://www.googleapis.com/auth/webmasters.readonly"]
    )
    gsc = build("searchconsole", "v1", credentials=credentials, cache_discovery=False)

    try:
        insp = gsc.urlInspection().index().inspect(
            body={"inspectionUrl": url, "siteUrl": "sc-domain:toolblip.com"}
        ).execute()
        ii = insp.get("inspectionResult", {})
        isr = ii.get("indexStatusResult", {})
        print(f"\n{'='*60}")
        print(f"URL: {url}")
        print(f"{'='*60}")
        print(f"  Verdict:           {isr.get('verdict', '?')}")
        print(f"  Coverage:          {isr.get('coverageState', '?')}")
        print(f"  Indexing state:    {isr.get('indexingState', '?')}")
        print(f"  Crawl allowed:     {isr.get('robotsTxtState', '?')}")
        print(f"  Page fetch:        {isr.get('pageFetchState', '?')}")
        print(f"  Google canonical:  {isr.get('googleCanonical', '?')}")
        print(f"  Crawled as:        {isr.get('crawledAs', '?')}")
        if isr.get("referringUrls"):
            print(f"  Referring URLs:   {isr['referringUrls'][:3]}")
        return isr
    except Exception as e:
        print(f"  Error inspecting {url}: {e}")
        return None

def gsc_coverage_report():
    """Print a summary of GSC coverage status."""
    from google.oauth2 import service_account
    from googleapiclient.discovery import build

    creds_raw = os.environ.get("GSC_SERVICE_ACCOUNT")
    if not creds_raw:
        print("⚠️ GSC_SERVICE_ACCOUNT not configured")
        return

    creds_raw = creds_raw.strip()
    try:
        creds_info = json.loads(creds_raw)
    except (json.JSONDecodeError, ValueError):
        import base64
        creds_info = json.loads(base64.b64decode(creds_raw))
    if isinstance(creds_info, str):
        creds_info = json.loads(creds_info)

    credentials = service_account.Credentials.from_service_account_info(
        creds_info, scopes=["https://www.googleapis.com/auth/webmasters.readonly"]
    )
    gsc = build("searchconsole", "v1", credentials=credentials, cache_discovery=False)

    print("\n📊 GSC COVERAGE REPORT")
    print(f"   {datetime.now().strftime('%Y-%m-%d %H:%M')}\n")

    # Sitemap status
    sitemaps = gsc.sitemaps().list(siteUrl="sc-domain:toolblip.com").execute()
    for s in sitemaps.get("sitemap", []):
        contents = s.get("contents", [{}])
        submitted = contents[0].get("submitted", 0) if contents else 0
        indexed = contents[0].get("indexed", 0) if contents else 0
        print(f"  Sitemap: {submitted} submitted, {indexed} indexed")
        if s.get("errors"):
            print(f"    Errors: {s['errors']}")
        if s.get("warnings"):
            print(f"    Warnings: {s['warnings']}")

    # Performance
    now = datetime.now()
    start_7d = (now - __import__('datetime').timedelta(days=7)).strftime("%Y-%m-%d")
    end = now.strftime("%Y-%m-%d")
    
    body = {
        "startDate": start_7d, "endDate": end,
        "dimensions": ["query", "page"], "rowCount": 10,
        "aggregationType": "byPage",
    }
    try:
        resp = gsc.searchanalytics().query(siteUrl="sc-domain:toolblip.com", body=body).execute()
        rows = resp.get("rows", [])
        total_clicks = sum(r.get("clicks", 0) for r in rows)
        total_imps = sum(r.get("impressions", 0) for r in rows)
        print(f"\n  Performance (7d): {total_clicks} clicks, {total_imps} impressions")
    except Exception as e:
        print(f"\n  Performance error: {e}")

    # Sample inspections
    print("\n  Sample inspections:")
    sample_urls = [
        "https://toolblip.com",
        "https://toolblip.com/tools/json-formatter",
        "https://toolblip.com/blog/cron-expressions-explained",
        "https://toolblip.com/tools/base64-encoder",
    ]
    for url in sample_urls:
        try:
            insp = gsc.urlInspection().index().inspect(
                body={"inspectionUrl": url, "siteUrl": "sc-domain:toolblip.com"}
            ).execute()
            ii = insp.get("inspectionResult", {})
            isr = ii.get("indexStatusResult", {})
            coverage = isr.get("coverageState", "?")
            verdict = isr.get("verdict", "?")
            slug = url.replace("https://toolblip.com", "")
            print(f"    {slug:<45} {verdict:<10} {coverage}")
        except:
            print(f"    {url.replace('https://toolblip.com',''):<45} ERROR")

def main():
    load_env()
    os.makedirs(STATE_DIR, exist_ok=True)

    # Parse args
    args = sys.argv[1:]
    
    if "--gsc-report" in args:
        gsc_coverage_report()
        return

    if "--gsc-inspect" in args:
        idx = args.index("--gsc-inspect")
        if idx + 1 < len(args):
            gsc_inspect_url(args[idx + 1])
        else:
            print("Usage: --gsc-inspect <url>")
        return

    if "--url" in args:
        idx = args.index("--url")
        if idx + 1 < len(args):
            single_url = args[idx + 1]
            print(f"\n🔍 Submitting single URL: {single_url}")
            submit_indexnow([single_url])
            gsc_inspect_url(single_url)
        else:
            print("Usage: --url <url>")
        return

    # Default: submit all sitemap URLs via IndexNow
    print("🔍 Fetching sitemap URLs...")
    urls = get_sitemap_urls()
    print(f"   Found {len(urls)} URLs in sitemap")

    print("\n📤 Submitting via IndexNow (Bing)...")
    submit_indexnow(urls)

    print("\n📊 GSC coverage check...")
    gsc_coverage_report()

    print(f"\n✅ Done at {datetime.now().strftime('%H:%M:%S')}")

if __name__ == "__main__":
    main()
