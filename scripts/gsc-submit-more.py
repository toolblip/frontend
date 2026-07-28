#!/usr/bin/env python3
"""Submit more tool pages to Google for re-indexing."""
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

# Get all tool slugs from tools.ts
with open('data/tools.ts', 'r') as f:
    lines = f.readlines()

import re
tool_lines = lines[804:1602]
pattern = r"""\{\s*name:\s*'([^']+)'\s*,\s*slug:\s*'([^']+)'\s*"""
tools = []
for line in tool_lines:
    match = re.search(pattern, line)
    if match:
        tools.append(match.group(2))

print(f"Found {len(tools)} tools")

# Submit first 100 tool pages
urls_to_submit = [f'https://toolblip.com/tools/{slug}' for slug in tools[:100]]

print(f"Submitting {len(urls_to_submit)} URLs for re-indexing...")

success = 0
failed = 0
for url in urls_to_submit:
    try:
        result = service.urlNotifications().publish(
            body={
                'url': url,
                'type': 'URL_UPDATED'
            }
        ).execute()
        success += 1
    except Exception as e:
        failed += 1

print(f"\nDone! {success} submitted, {failed} failed")
