#!/usr/bin/env python3
"""Resubmit tool pages to GSC for re-indexing after content update."""
import json, os, urllib.request, urllib.error

# Load GSC credentials
with open('.env', 'r') as f:
    for line in f:
        if line.startswith('GSC_SERVICE_ACCOUNT='):
            creds = json.loads(line.split('=', 1)[1].strip().strip('"').strip("'"))
            break

# Get access token
import subprocess
result = subprocess.run([
    'python3', '-c', f'''
import json, google.auth, google.auth.transport.requests
from google.oauth2 import service_account

creds = service_account.Credentials.from_service_account_info(
    {json.dumps(creds)},
    scopes=["https://www.googleapis.com/auth/webmasters"]
)
creds.refresh(google.auth.transport.requests.Request())
print(creds.token)
'''
], capture_output=True, text=True)
token = result.stdout.strip()

# Get top 100 tool slugs from tool-content.ts
with open('data/tool-content.ts', 'r') as f:
    content = f.read()

import re
slugs = re.findall(r'"([a-z0-9-]+)":\s*\{', content)
print(f"Found {len(slugs)} tools with content")

# Resubmit to GSC via URL Inspection API (batch)
site_url = 'https://toolblip.com'
submitted = 0
failed = 0

for slug in slugs[:100]:  # Top 100 tools
    url = f"{site_url}/tools/{slug}"
    try:
        req = urllib.request.Request(
            f'https://searchconsole.googleapis.com/v1/sites/{urllib.parse.quote(site_url, safe="")}/urlInspection/index:inspect',
            data=json.dumps({"inspectionUrl": url, "siteUrl": site_url}).encode(),
            headers={
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            },
            method='POST'
        )
        resp = urllib.request.urlopen(req)
        submitted += 1
        if submitted % 20 == 0:
            print(f"  Submitted {submitted} URLs...")
    except Exception as e:
        failed += 1
        if failed <= 3:
            print(f"  Failed {slug}: {e}")

print(f"\nDone: {submitted} submitted, {failed} failed")
