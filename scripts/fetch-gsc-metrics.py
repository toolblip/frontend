#!/usr/bin/env python3
"""Fetch GSC performance data for a specific URL."""
import sys
import json
import os
import warnings
warnings.filterwarnings('ignore')

GSC_QUEUE_FILE = '/Users/ray/Work/toolblip/gsc-queue.json'

if len(sys.argv) < 2:
    print("Usage: fetch-gsc-metrics.py <post_url>", file=sys.stderr)
    sys.exit(1)

post_url = sys.argv[1]

# Load service account from .env
for line in open('.env'):
    if line.startswith('GSC_SERVICE_ACCOUNT='):
        val = line.split('=', 1)[1].strip()
        os.environ['GSC_SERVICE_ACCOUNT'] = val

from google.oauth2 import service_account
from googleapiclient.discovery import build
from datetime import datetime, timezone, timedelta

info = json.loads(os.environ['GSC_SERVICE_ACCOUNT'])
creds = service_account.Credentials.from_service_account_info(
    info,
    scopes=['https://www.googleapis.com/auth/webmasters']
)
gsc = build('searchconsole', 'v1', credentials=creds)

now = datetime.now(timezone.utc)
start = (now - timedelta(days=7)).strftime('%Y-%m-%d')
end = now.strftime('%Y-%m-%d')

try:
    result = gsc.searchanalytics().query(
        siteUrl='sc-domain:toolblip.com',
        body={
            'startDate': start,
            'endDate': end,
            'dimensions': ['page', 'query'],
            'dimensionFilterGroups': [{
                'filters': [{
                    'dimension': 'page',
                    'expression': post_url
                }]
            }],
            'rowCount': 20,
            'aggregationType': 'byPage'
        }
    ).execute()
    print(json.dumps(result.get('rows', [])))
except Exception as e:
    print('[]')
