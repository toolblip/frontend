#!/usr/bin/env python3
"""
gsc-full-audit.py — Pull indexing status, performance, and opportunities from GSC.

Requires GSC_SERVICE_ACCOUNT in one of:
  - ~/.hermes/secrets/tb.env
  - .secrets/tb.env (workspace)
  - frontend .env

Usage:
  python3 scripts/gsc-full-audit.py
  python3 scripts/gsc-full-audit.py --json /tmp/gsc-audit.json
"""
import argparse
import json
import os
import sys
from datetime import datetime, timedelta, timezone

SCOPE = "https://www.googleapis.com/auth/webmasters.readonly"
SITE_URL = "sc-domain:toolblip.com"


def load_env():
    candidates = [
        os.path.expanduser("~/.hermes/secrets/tb.env"),
        os.path.expanduser("~/.herdr/worktrees/toolblip-workspace/.secrets/tb.env"),
        os.path.join(os.path.dirname(__file__), "..", ".secrets", "tb.env"),
        os.path.join(os.path.dirname(__file__), "..", ".env"),
        ".env",
    ]
    for path in candidates:
        if not os.path.exists(path):
            continue
        for line in open(path):
            line = line.strip()
            if line.startswith("GSC_SERVICE_ACCOUNT="):
                val = line.split("=", 1)[1].strip().strip("'").strip('"')
                os.environ["GSC_SERVICE_ACCOUNT"] = val
                return path
    return None


def get_gsc():
    from google.oauth2 import service_account
    from googleapiclient.discovery import build

    creds_raw = os.environ.get("GSC_SERVICE_ACCOUNT")
    if not creds_raw:
        print("❌ GSC_SERVICE_ACCOUNT not found. Set in tb.env or .env")
        sys.exit(1)
    try:
        creds_info = json.loads(creds_raw)
    except json.JSONDecodeError:
        import base64
        creds_info = json.loads(base64.b64decode(creds_raw))
    if isinstance(creds_info, str):
        creds_info = json.loads(creds_info)
    credentials = service_account.Credentials.from_service_account_info(
        creds_info, scopes=[SCOPE]
    )
    return build("searchconsole", "v1", credentials=credentials, cache_discovery=False)


def query_analytics(gsc, start, end, dimensions, row_count=1000, dimension_filter=None):
    body = {
        "startDate": start,
        "endDate": end,
        "dimensions": dimensions,
        "rowCount": row_count,
        "aggregationType": "byProperty",
    }
    if dimension_filter:
        body["dimensionFilterGroups"] = dimension_filter
    return gsc.searchanalytics().query(siteUrl=SITE_URL, body=body).execute().get("rows", [])


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--json", help="Write full report JSON to path")
    args = parser.parse_args()

    env_path = load_env()
    gsc = get_gsc()
    now = datetime.now(timezone.utc)
    end = now.strftime("%Y-%m-%d")
    start_28d = (now - timedelta(days=28)).strftime("%Y-%m-%d")
    start_7d = (now - timedelta(days=7)).strftime("%Y-%m-%d")

    report = {
        "generated_at": now.isoformat(),
        "site": SITE_URL,
        "credentials_from": env_path,
    }

    print(f"# GSC Full Audit — toolblip.com\n")
    print(f"Generated: {end}\n")

    # ─── Performance summary ───────────────────────────────────────────────
    rows_7d = query_analytics(gsc, start_7d, end, ["query"])
    clicks_7d = sum(r.get("clicks", 0) for r in rows_7d)
    imps_7d = sum(r.get("impressions", 0) for r in rows_7d)
    print(f"## Last 7 days: {int(clicks_7d)} clicks, {int(imps_7d)} impressions\n")

    top_queries = sorted(rows_7d, key=lambda r: r.get("impressions", 0), reverse=True)[:25]
    report["top_queries_7d"] = [
        {
            "query": r["keys"][0],
            "clicks": r.get("clicks", 0),
            "impressions": r.get("impressions", 0),
            "ctr": r.get("ctr", 0),
            "position": r.get("position", 0),
        }
        for r in top_queries
    ]
    print("### Top queries (7d)")
    for r in top_queries[:15]:
        q = r["keys"][0][:55]
        cl = int(r.get("clicks", 0))
        im = int(r.get("impressions", 0))
        pos = r.get("position", 0)
        ctr = (cl / im * 100) if im else 0
        print(f"  {q:<55} {cl:>3} clk  {im:>5} imp  pos {pos:.1f}  CTR {ctr:.1f}%")
    print()

    # ─── Striking distance (pos 11-20, impressions > 50) ───────────────────
    striking = [
        r for r in rows_7d
        if 11 <= r.get("position", 0) <= 20 and r.get("impressions", 0) >= 50
    ]
    striking.sort(key=lambda r: r.get("impressions", 0), reverse=True)
    report["striking_distance"] = [
        {"query": r["keys"][0], "impressions": r["impressions"], "position": r["position"]}
        for r in striking[:30]
    ]
    if striking:
        print("### Striking distance (pos 11–20, 50+ impressions)")
        for r in striking[:15]:
            print(f"  {r['keys'][0][:50]:<50} pos {r['position']:.1f}  {int(r['impressions'])} imp")
        print()

    # ─── Low CTR opportunities ─────────────────────────────────────────────
    low_ctr = [
        r for r in rows_7d
        if r.get("impressions", 0) >= 100 and (r.get("clicks", 0) / r["impressions"]) < 0.02
    ]
    low_ctr.sort(key=lambda r: r.get("impressions", 0), reverse=True)
    report["low_ctr_queries"] = [
        {"query": r["keys"][0], "impressions": r["impressions"], "ctr": r.get("ctr", 0)}
        for r in low_ctr[:30]
    ]
    if low_ctr:
        print("### Low CTR (<2%, 100+ impressions) — title/description fixes")
        for r in low_ctr[:10]:
            print(f"  {r['keys'][0][:50]:<50} {int(r['impressions'])} imp")
        print()

    # ─── Top pages ─────────────────────────────────────────────────────────
    page_rows = query_analytics(gsc, start_28d, end, ["page"], row_count=50)
    page_rows.sort(key=lambda r: r.get("clicks", 0), reverse=True)
    report["top_pages_28d"] = [
        {
            "page": r["keys"][0],
            "clicks": r.get("clicks", 0),
            "impressions": r.get("impressions", 0),
            "position": r.get("position", 0),
        }
        for r in page_rows[:30]
    ]
    print("### Top pages (28d)")
    for r in page_rows[:10]:
        p = r["keys"][0].replace("https://toolblip.com", "")
        print(f"  {p[:45]:<45} {int(r.get('clicks', 0)):>3} clk  pos {r.get('position', 0):.1f}")
    print()

    # ─── Sitemap status ────────────────────────────────────────────────────
    try:
        sitemaps = gsc.sitemaps().list(siteUrl=SITE_URL).execute().get("sitemap", [])
        report["sitemaps"] = sitemaps
        print("### Sitemap status")
        for sm in sitemaps:
            path = sm.get("path", "?")
            for c in sm.get("contents", []):
                print(f"  {path}: {c.get('submitted', 0)} submitted, {c.get('indexed', 0)} indexed ({c.get('type', '?')})")
        print()
    except Exception as e:
        print(f"⚠️ Sitemap error: {e}\n")

    if args.json:
        with open(args.json, "w") as f:
            json.dump(report, f, indent=2)
        print(f"Full JSON written to {args.json}")


if __name__ == "__main__":
    main()
