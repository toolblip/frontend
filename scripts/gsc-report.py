#!/usr/bin/env python3
"""
gsc-report.py — Toolblip Google Search Console daily performance report.
Queries GSC for last 7 days of data and outputs a summary.
"""
import json, os, sys
from datetime import datetime, timedelta, timezone
from google.oauth2 import service_account
from googleapiclient.discovery import build

SCOPE = "https://www.googleapis.com/auth/webmasters.readonly"
SITE_URL = "sc-domain:toolblip.com"
STATE_DIR = "/tmp/toolblip-seo-state"

def load_env():
    """Load GSC creds from tb.env secrets file."""
    tb_env = os.path.expanduser("~/.hermes/secrets/tb.env")
    if os.path.exists(tb_env):
        for line in open(tb_env):
            line = line.strip()
            if line.startswith("GSC_SERVICE_ACCOUNT="):
                val = line.split("=", 1)[1].strip().strip("'").strip('"')
                os.environ["GSC_SERVICE_ACCOUNT"] = val
                return
    # Fallback .env
    for path in [".env", "../.env"]:
        if os.path.exists(path):
            for line in open(path):
                line = line.strip()
                if line.startswith("GSC_SERVICE_ACCOUNT="):
                    val = line.split("=", 1)[1].strip().strip("'").strip('"')
                    os.environ["GSC_SERVICE_ACCOUNT"] = val
                    return

def get_gsc():
    load_env()
    creds_raw = os.environ.get("GSC_SERVICE_ACCOUNT")
    if not creds_raw:
        print("❌ GSC_SERVICE_ACCOUNT not configured")
        sys.exit(1)
    creds_raw = creds_raw.strip()
    # Handle base64-encoded credentials (common in migrated env files)
    try:
        creds_info = json.loads(creds_raw)
    except (json.JSONDecodeError, ValueError):
        import base64
        creds_info = json.loads(base64.b64decode(creds_raw))
    if isinstance(creds_info, str):
        creds_info = json.loads(creds_info)
    credentials = service_account.Credentials.from_service_account_info(
        creds_info, scopes=[SCOPE]
    )
    return build("searchconsole", "v1", credentials=credentials, cache_discovery=False)

def fmt(n):
    """Format number with commas."""
    if n is None:
        return "0"
    return f"{int(n):,}"

def main():
    os.makedirs(STATE_DIR, exist_ok=True)

    gsc = get_gsc()
    now = datetime.now(timezone.utc)
    end = now.strftime("%Y-%m-%d")
    start_7d = (now - timedelta(days=7)).strftime("%Y-%m-%d")
    start_28d = (now - timedelta(days=28)).strftime("%Y-%m-%d")

    print("📊 **Toolblip GSC Performance Report**")
    print(f"   {end}\n")

    # ─── 7-day summary ───────────────────────────────────────────────────────
    try:
        body = {
            "startDate": start_7d,
            "endDate": end,
            "dimensions": ["query", "page"],
            "rowCount": 20,
            "aggregationType": "byPage",
        }
        resp = gsc.searchanalytics().query(siteUrl=SITE_URL, body=body).execute()
        rows = resp.get("rows", [])

        total_clicks = sum(r.get("clicks", 0) for r in rows)
        total_impressions = sum(r.get("impressions", 0) for r in rows)
        avg_ctr = (total_clicks / total_impressions * 100) if total_impressions else 0
        # Position is weighted by impressions
        avg_position = sum(r.get("position", 0) * r.get("impressions", 0) for r in rows) / total_impressions if total_impressions else 0

        print(f"**Last 7 days:** {fmt(total_clicks)} clicks · {fmt(total_impressions)} impressions · {avg_ctr:.1f}% CTR · avg pos {avg_position:.1f}\n")

        if rows:
            print("**Top queries:**")
            for r in rows[:10]:
                query = r["keys"][0][:50]
                page = r["keys"][1].replace("https://toolblip.com", "")[:40]
                cl = int(r.get("clicks", 0))
                im = int(r.get("impressions", 0))
                ctr = (cl / im * 100) if im else 0
                pos = r.get("position", 0)
                print(f"  · {query:<45} {cl:>4} clicks  {im:>5} imps  {ctr:>4.1f}% CTR  pos {pos:.1f}")
            print()
    except Exception as e:
        print(f"⚠️ 7-day query error: {e}\n")

    # ─── 28-day trend ────────────────────────────────────────────────────────
    try:
        body28 = {
            "startDate": start_28d,
            "endDate": end,
            "dimensions": ["date"],
            "rowCount": 28,
            "aggregationType": "byPage",
        }
        trend = gsc.searchanalytics().query(siteUrl=SITE_URL, body=body28).execute()
        trend_rows = trend.get("rows", [])
        if trend_rows:
            last_week_clicks = sum(r.get("clicks", 0) for r in trend_rows[-7:])
            prev_week_clicks = sum(r.get("clicks", 0) for r in trend_rows[:7])
            change = ((last_week_clicks - prev_week_clicks) / prev_week_clicks * 100) if prev_week_clicks else 0
            direction = "📈 up" if change > 0 else "📉 down" if change < 0 else "➡️ flat"
            print(f"**28-day trend:** Last week {fmt(last_week_clicks)} clicks vs prev week {fmt(prev_week_clicks)} — {direction} {abs(change):.0f}%\n")
    except Exception as e:
        print(f"⚠️ Trend query error: {e}\n")

    # ─── Coverage / sitemap status ───────────────────────────────────────────
    try:
        sitemaps = gsc.sitemaps().list(siteUrl=SITE_URL).execute()
        sitemap_list = sitemaps.get("sitemap", [])
        if sitemap_list:
            submitted = sitemap_list[0].get("contents", [{}])
            print("**Sitemap coverage:**")
            for c in submitted:
                stype = c.get("type", "?")
                sub = fmt(c.get("submitted", 0))
                idx = fmt(c.get("indexed", 0))
                print(f"  · {stype}: {sub} submitted, {idx} indexed")
            print()
    except Exception as e:
        print(f"⚠️ Sitemap query error: {e}\n")

    # ─── Blog count ──────────────────────────────────────────────────────────
    blog_dir = os.path.join(os.path.dirname(__file__), "..", "src", "content", "blog")
    blog_count = 0
    if os.path.exists(blog_dir):
        blog_count = len([f for f in os.listdir(blog_dir) if f.endswith(".md")])

    print(f"**Blog posts:** {blog_count} published")
    print(f"**Date:** {end}")

if __name__ == "__main__":
    main()
