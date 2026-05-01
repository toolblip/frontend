#!/bin/bash
# Railway GraphQL API wrapper
# Usage: ./railway.sh <query>
#   Query must be a valid JSON object with "query" field
#   Example: ./railway.sh '{"query":"query { me { email } }"}'

TOKEN="$(cat "$(dirname "$0")/.railway_token" | tr -d '[:space:]')"

exec curl -s -X POST "https://backboard.railway.app/graphql/v2" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    -d "$1"
