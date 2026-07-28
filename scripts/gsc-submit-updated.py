#!/usr/bin/env python3
"""Submit updated URLs to Google for re-indexing."""
import os, json
from google.oauth2 import service_account
from googleapiclient.discovery import build

# Load credentials
creds_json = None
with open('.env', 'r') as f:
    for line in f:
        if line.startswith('GSC_SERVICE_ACCOUNT='):
            creds_json = line.split('=', 1)[1].strip()
            if creds_json.startswith('"') and creds_json.endswith('"'):
                creds_json = creds_json[1:-1]
            elif creds_json.startswith("'") and creds_json.endswith("'"):
                creds_json = creds_json[1:-1]
            break

creds_dict = json.loads(creds_json)
credentials = service_account.Credentials.from_service_account_info(
    creds_dict, scopes=['https://www.googleapis.com/auth/indexing']
)

service = build('indexing', 'v3', credentials=credentials)
site_url = 'https://toolblip.com/'

# Key URLs to submit for re-indexing
urls_to_submit = [
    # Tool pages with unique content
    'https://toolblip.com/tools/json-formatter',
    'https://toolblip.com/tools/countdown-timer',
    'https://toolblip.com/tools/password-generator',
    'https://toolblip.com/tools/color-picker',
    'https://toolblip.com/tools/base64-encoder-decoder',
    'https://toolblip.com/tools/markdown-preview',
    'https://toolblip.com/tools/case-converter',
    'https://toolblip.com/tools/lorem-ipsum-generator',
    'https://toolblip.com/tools/uuid-generator',
    'https://toolblip.com/tools/word-counter',
    # Blog and other pages
    'https://toolblip.com/blog',
    'https://toolblip.com/pricing',
    'https://toolblip.com/tools',
    'https://toolblip.com/about',
    'https://toolblip.com/api-docs',
]

print(f"Submitting {len(urls_to_submit)} URLs for re-indexing...")

for url in urls_to_submit:
    try:
        result = service.urlNotifications().publish(
            body={
                'url': url,
                'type': 'URL_UPDATED'
            }
        ).execute()
        
        print(f"  ✅ {url}")
        print(f"     {result.get('notification', {}).get('type', 'unknown')}")
        
    except Exception as e:
        print(f"  ❌ {url}")
        print(f"     Error: {e}")

print("\nDone! Google will re-crawl these URLs within 24-48 hours.")
