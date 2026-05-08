#!/bin/bash
# Toolblip Health Check — silent on healthy, log always, alert on failure
set -e

LOGFILE="/Users/ray/Work/toolblip/health-logs/health-check.log"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S %Z")

# Check landing (Cloudflare Pages)
LANDING_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://toolblip.com --max-time 10)

# Check API (Railway)
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://api.toolblip.com/api/health --max-time 10)

# Always log
echo "[$TIMESTAMP] landing:$LANDING_STATUS api:$API_STATUS" >> "$LOGFILE"

# If healthy, do nothing (silent)
if [[ "$LANDING_STATUS" == "200" ]] && [[ "$API_STATUS" == "200" || "$API_STATUS" == "302" ]]; then
    exit 0
fi

# Something is down — send Telegram alert
BOT_TOKEN="8791944434:AAE0yjUitWZYZ287OjdjxwY9ccChNWeouG4"
MSG="🚨 Toolblip DOWN — landing: $LANDING_STATUS, api: $API_STATUS | $(date +"%-l:%M %P")"
curl -s "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
    -d chat_id="-1003905269197" \
    -d message_thread_id=3 \
    -d text="${MSG}" > /dev/null

# Check Railway if API is down
if [[ "$API_STATUS" != "200" && "$API_STATUS" != "302" ]]; then
    PROJECT_TOKEN=$(grep TOOLBLIP_PROJECT_TOKEN ~/.openclaw/secrets/tb.env | cut -d= -f2)
    SERVICE_INFO=$(curl -s -X POST https://backboard.railway.com/graphql/v2 \
        -H "Project-Access-Token: $PROJECT_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"query":"{ project(id: \"47a4e2f0-d3ad-41d7-b68a-6c4cf549b12d\") { services { edges { node { id name status } } } } }"}')
    echo "[$TIMESTAMP] Railway check: $SERVICE_INFO" >> "$LOGFILE"
fi
