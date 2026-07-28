#!/usr/bin/env python3
"""Get detailed GSC indexing error reasons."""
import os, json
from google.oauth2 import service_account
from googleapiclient.discovery import build

# Load credentials from .env file
creds_json = None
with open('.env', 'r') as f:
    for line in f:
        if line.startswith('GSC_SERVICE_ACCOUNT='):
            creds_json = line.split('=', 1)[1].strip()
            # Remove surrounding quotes if present
            if creds_json.startswith('"') and creds_json.endswith('"'):
                creds_json = creds_json[1:-1]
            elif creds_json.startswith("'") and creds_json.endswith("'"):
                creds_json = creds_json[1:-1]
            break

if not creds_json:
    print("ERROR: No GSC credentials found")
    exit(1)

# Parse JSON
try:
    creds_dict = json.loads(creds_json)
except json.JSONDecodeError as e:
    print(f"ERROR: Invalid JSON: {e}")
    print(f"First 100 chars: {creds_json[:100]}")
    exit(1)

credentials = service_account.Credentials.from_service_account_info(
    creds_dict, scopes=['https://www.googleapis.com/auth/webmasters.readonly']
)

# Build service
service = build('searchconsole', 'v1', credentials=credentials)
site_url = 'sc-domain:toolblip.com'

# Get URL inspection results for sample URLs
print("=== URL INSPECTION ===")
sample_urls = [
    'https://toolblip.com/',
    'https://toolblip.com/tools/json-formatter',
    'https://toolblip.com/tools/countdown-timer',
    'https://toolblip.com/blog',
    'https://toolblip.com/pricing',
]

for url in sample_urls:
    try:
        result = service.urlInspection().index().inspect(
            body={'inspectionUrl': url, 'siteUrl': site_url}
        ).execute()
        
        inspection = result.get('inspectionResult', {})
        index_status = inspection.get('indexStatusResult', {})
        
        print(f"\n{url}")
        print(f"  Verdict: {index_status.get('verdict', 'unknown')}")
        print(f"  Coverage: {index_status.get('coverageState', 'unknown')}")
        print(f"  Crawled as: {index_status.get('crawledAs', 'unknown')}")
        print(f"  Robots.txt: {index_status.get('robotsTxtState', 'unknown')}")
        print(f"  Page fetch: {index_status.get('pageFetchState', 'unknown')}")
        print(f"  Indexing: {index_status.get('indexingState', 'unknown')}")
        print(f"  Last crawl: {index_status.get('lastCrawlTime', 'unknown')}")
        
    except Exception as e:
        print(f"\n{url}")
        print(f"  Error: {e}")
