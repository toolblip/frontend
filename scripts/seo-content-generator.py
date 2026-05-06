#!/usr/bin/env python3
"""
Google Search Console SEO Pipeline for Toolblip.
Handles: keyword research, URL submission, error checking, issue resolution.
"""

import json
import sys
import os
import subprocess
from datetime import datetime, timezone
from google.oauth2 import service_account
from googleapiclient.discovery import build

SCOPE = "https://www.googleapis.com/auth/webmasters"
SITE_URL = "https://toolblip.com/"

def load_env():
    """Load GSC creds from .env."""
    env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
    if os.path.exists(env_path):
        for line in open(env_path):
            line = line.strip()
            if line.startswith("GSC_SERVICE_ACCOUNT=") and not line.startswith("#"):
                val = line.split("=", 1)[1].strip()
                os.environ["GSC_SERVICE_ACCOUNT"] = val
                return
    # Fallback: check tb.env
    tb_env = os.path.expanduser("~/.openclaw/secrets/tb.env")
    if os.path.exists(tb_env):
        for line in open(tb_env):
            line = line.strip()
            if line.startswith("GSC_SERVICE_ACCOUNT=") and not line.startswith("#"):
                val = line.split("=", 1)[1].strip()
                os.environ["GSC_SERVICE_ACCOUNT"] = val
                return

def get_gsc():
    """Build GSC service account connection."""
    load_env()
    creds_raw = os.environ.get("GSC_SERVICE_ACCOUNT")
    if not creds_raw:
        print("ERROR: GSC_SERVICE_ACCOUNT env var not set")
        sys.exit(1)

    creds_info = json.loads(creds_raw)
    credentials = service_account.Credentials.from_service_account_info(
        creds_info, scopes=[SCOPE]
    )
    return build("searchconsole", "v1", credentials=credentials, cache_discovery=False)

def check_gsc_errors(gsc) -> dict:
    """Check GSC for crawl errors, index coverage issues."""
    print("CHECKING GSC errors and coverage...")
    try:
        # Get sitemaps
        sitemaps = gsc.sitemaps().list(siteUrl=SITE_URL).execute()
        print(f"  Sitemaps: {json.dumps(sitemaps, indent=2)}")

        # Get URL inspection for toolblip.com root
        inspection = gsc.urlInspection().index().inspect(
            body={
                "inspectionUrl": SITE_URL,
                "languageCode": "en-US"
            }
        ).execute()
        print(f"  Index inspection: {json.dumps(inspection, indent=2)}")

        # Get search analytics (errors only)
        now = datetime.now(timezone.utc)
        start = (now.replace(day=1) - __import__('datetime').timedelta(days=1)).strftime("%Y-%m-%d")
        end = now.strftime("%Y-%m-%d")

        analytics = gsc.searchanalytics().query(
            siteUrl=SITE_URL,
            body={
                "startDate": start,
                "endDate": end,
                "dimensions": ["query", "page", "device", "country"],
                "rowCount": 1000,
                "aggregationType": "byPage",
            }
        ).execute()

        errors = []
        if "rows" in analytics:
            for row in analytics["rows"]:
                clicks = row.get("clicks", 0)
                impressions = row.get("impressions", 0)
                position = row.get("position", 999)
                # Flag pages with 0 clicks but high impressions (ranking but not clicking)
                if impressions > 10 and clicks == 0 and position < 20:
                    errors.append({
                        "type": "zero_click_through",
                        "page": row["keys"][1],
                        "query": row["keys"][0],
                        "impressions": impressions,
                        "position": position
                    })

        return {
            "status": "ok",
            "sitemaps": sitemaps.get("sitemap", []),
            "errors": errors,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    except Exception as e:
        print(f"ERROR checking GSC: {e}")
        return {
            "status": "error",
            "error": str(e),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

def submit_url(gsc, url: str) -> dict:
    """Submit a single URL for indexing via GSC URL Inspection API."""
    print(f"SUBMITTING URL: {url}")
    try:
        result = gsc.urlInspection().index().inspect(
            body={
                "inspectionUrl": url,
                "languageCode": "en-US"
            }
        ).execute()

        # Parse result
        inspection_result = result.get("inspectionResult", {})
        index_status = inspection_result.get("indexStatusResult", {})
        coverage_state = index_status.get("coverageState", "UNKNOWN")

        return {
            "url": url,
            "status": "submitted",
            "coverage_state": coverage_state,
            "raw": inspection_status_to_str(index_status)
        }
    except Exception as e:
        print(f"  ERROR submitting {url}: {e}")
        return {"url": url, "status": "error", "error": str(e)}

def inspection_status_to_str(status: dict) -> str:
    """Flatten inspection status for logging."""
    return json.dumps({
        "coverage": status.get("coverageState", "N/A"),
        "robots_txt": status.get("robotsTxtSource", "N/A"),
        "indexing_allowed": status.get("indexingAllowed", "N/A"),
        "page_fetch": status.get("pageFetchState", "N/A"),
        "google_canonical": status.get("googleCanonical", "N/A"),
        "user_canonical": status.get("userCanonical", "N/A"),
    })

def submit_sitemap(gsc) -> dict:
    """Force-refresh the sitemap via GSC."""
    print("REFRESHING sitemap...")
    try:
        # Re-submit the sitemap
        sitemap_url = SITE_URL + "sitemap.xml"
        result = gsc.sitemaps().submit(
            siteUrl=SITE_URL,
            feedPath=sitemap_url
        ).execute()
        return {"status": "ok", "sitemap": sitemap_url, "response": result}
    except Exception as e:
        return {"status": "error", "error": str(e)}

def research_keywords(gsc, seed_keywords: list) -> list:
    """
    Use GSC search analytics to find related long-tail keywords.
    Pulls top queries driving impressions/clicks for the site.
    """
    print("RESEARCHING keywords from GSC...")
    try:
        now = datetime.now(timezone.utc)
        start = (now - __import__('datetime').timedelta(days=90)).strftime("%Y-%m-%d")
        end = now.strftime("%Y-%m-%d")

        # Get all queries sorted by impressions
        analytics = gsc.searchanalytics().query(
            siteUrl=SITE_URL,
            body={
                "startDate": start,
                "endDate": end,
                "dimensions": ["query"],
                "rowCount": 200,
                "aggregationType": "byPage",
                "order": ["DESC"],
            }
        ).execute()

        keywords = []
        seen = set()
        if "rows" in analytics:
            for row in analytics["rows"]:
                q = row["keys"][0].lower().strip()
                if q and q not in seen and len(q) > 3:
                    seen.add(q)
                    keywords.append({
                        "keyword": q,
                        "clicks": row.get("clicks", 0),
                        "impressions": row.get("impressions", 0),
                        "position": row.get("position", 999),
                    })

        # Deduplicate with seed keywords
        all_kw = list(set([k["keyword"] for k in keywords] + [k.lower() for k in seed_keywords]))
        return all_kw[:50]  # Return top 50

    except Exception as e:
        print(f"  Keyword research error (non-fatal): {e}")
        return seed_keywords

def fix_zero_click_page(gsc, page_url: str, query: str, position: int, impressions: int) -> dict:
    """
    Attempt to fix a zero-click page by re-inspecting and reporting actionable fixes.
    Returns a dict with the diagnosis and recommended actions.
    """
    print(f"FIXING zero-click page: {page_url}")
    print(f"  Query: {query} | Position: {position} | Impressions: {impressions}")
    try:
        inspection = gsc.urlInspection().index().inspect(
            body={
                "inspectionUrl": page_url,
                "languageCode": "en-US"
            }
        ).execute()

        result = inspection.get("inspectionResult", {})
        status = result.get("indexStatusResult", {})

        coverage = status.get("coverageState", "UNKNOWN")
        indexing_allowed = status.get("indexingAllowed", None)
        fetch_state = status.get("pageFetchState", "UNKNOWN")
        google_canonical = status.get("googleCanonical", None)
        user_canonical = status.get("userCanonical", None)
        robots_txt = status.get("robotsTxtSource", "N/A")

        issues = []

        # Diagnose issues
        if fetch_state == "FAILED":
            issues.append("PAGE_FETCH_FAILED: Google could not fetch the page")
        if indexing_allowed is False:
            issues.append(f"INDEXING_BLOCKED: robots meta or headers blocking indexing")
        if robots_txt == "BLOCKED":
            issues.append("ROBOTS_TXT_BLOCKED: sitemap/page blocked by robots.txt")
        if coverage in ["Duplicate", "Not indexed (duplicate)"]:
            issues.append(f"DUPLICATE_CONTENT: canonical={google_canonical}")
        if position <= 10 and impressions > 20:
            issues.append("LOW_CTR_DESPTIE_HIGH_RANKING: title/meta description needs improvement")

        return {
            "page_url": page_url,
            "query": query,
            "position": position,
            "impressions": impressions,
            "coverage_state": coverage,
            "fetch_state": fetch_state,
            "indexing_allowed": indexing_allowed,
            "google_canonical": google_canonical,
            "user_canonical": user_canonical,
            "issues": issues,
            "fix_needed": len(issues) > 0
        }
    except Exception as e:
        return {
            "page_url": page_url,
            "query": query,
            "position": position,
            "error": str(e),
            "fix_needed": False
        }


def fix_page(gsc, page_url: str) -> dict:
    """
    Actively fix a page: re-submit for indexing and refresh sitemap.
    """
    print(f"FIXING page: {page_url}")
    # Re-submit via URL inspection
    try:
        result = gsc.urlInspection().index().inspect(
            body={"inspectionUrl": page_url, "languageCode": "en-US"}
        ).execute()
        return {"url": page_url, "status": "ok", "result": result.get("inspectionResult", {}).get("indexStatusResult", {}).get("coverageState", "UNKNOWN")}
    except Exception as e:
        return {"url": page_url, "status": "error", "error": str(e)}


def main():
    action = sys.argv[1] if len(sys.argv) > 1 else "check"

    gsc = get_gsc()

    if action == "check":
        result = check_gsc_errors(gsc)
        print(json.dumps(result, indent=2))

    elif action == "submit":
        if len(sys.argv) < 3:
            print("Usage: seo-content-generator.py submit <url>")
            sys.exit(1)
        result = submit_url(gsc, sys.argv[2])
        print(json.dumps(result, indent=2))

    elif action == "sitemap":
        result = submit_sitemap(gsc)
        print(json.dumps(result, indent=2))

    elif action == "keywords":
        seed = sys.argv[2:] if len(sys.argv) > 2 else ["toolblip", "developer tools", "online tools"]
        result = research_keywords(gsc, seed)
        print(json.dumps(result, indent=2, ensure_ascii=False))

    elif action == "fix":
        # fix <page_url> — diagnose and fix a specific page
        if len(sys.argv) < 3:
            print("Usage: seo-content-generator.py fix <page_url>")
            sys.exit(1)
        result = fix_page(gsc, sys.argv[2])
        print(json.dumps(result, indent=2))

    elif action == "diagnose":
        # diagnose <page_url> [query] [position] [impressions]
        if len(sys.argv) < 3:
            print("Usage: seo-content-generator.py diagnose <page_url> [query] [position] [impressions]")
            sys.exit(1)
        page_url = sys.argv[2]
        query = sys.argv[3] if len(sys.argv) > 3 else "unknown"
        position = int(sys.argv[4]) if len(sys.argv) > 4 else 999
        impressions = int(sys.argv[5]) if len(sys.argv) > 5 else 0
        result = fix_zero_click_page(gsc, page_url, query, position, impressions)
        print(json.dumps(result, indent=2))

    else:
        print(f"Unknown action: {action}")
        sys.exit(1)

if __name__ == "__main__":
    main()
