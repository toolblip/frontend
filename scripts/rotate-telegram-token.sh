#!/usr/bin/env bash
# Rotate Hermes/Toolblip Telegram bot token safely.
# Usage:
#   ./scripts/rotate-telegram-token.sh '123456789:AA...'
# or run without args and paste token at prompt.
set -euo pipefail

TOKEN="${1:-}"
if [[ -z "$TOKEN" ]]; then
  printf "New Telegram bot token: " >&2
  stty -echo
  read -r TOKEN
  stty echo
  printf "\n" >&2
fi

if [[ ! "$TOKEN" =~ ^[0-9]{8,10}:AA[A-Za-z0-9_-]{20,}$ ]]; then
  echo "ERROR: token format does not look like a Telegram bot token" >&2
  exit 1
fi

TMP_JSON="$(mktemp)"
trap 'rm -f "$TMP_JSON"' EXIT
curl -fsS "https://api.telegram.org/bot${TOKEN}/getMe" -o "$TMP_JSON" >/dev/null

BOT_INFO="$(python3 - "$TMP_JSON" <<'PY'
import json, sys
p=sys.argv[1]
d=json.load(open(p))
if not d.get('ok'):
    print('ERROR: Telegram getMe failed', file=sys.stderr)
    sys.exit(2)
r=d.get('result', {})
print(f"{r.get('first_name','')} (@{r.get('username','')}) id={r.get('id','')}")
PY
)"
echo "Validated bot: ${BOT_INFO}"

update_env_file() {
  local file="$1"
  local key="$2"
  mkdir -p "$(dirname "$file")"
  touch "$file"
  chmod 600 "$file" 2>/dev/null || true
  python3 - "$file" "$key" "$TOKEN" <<'PY'
import pathlib, sys
path=pathlib.Path(sys.argv[1])
key=sys.argv[2]
value=sys.argv[3]
lines=path.read_text(errors='ignore').splitlines() if path.exists() else []
out=[]
seen=False
for line in lines:
    if line.startswith(key+'='):
        out.append(f'{key}={value}')
        seen=True
    else:
        out.append(line)
if not seen:
    out.append(f'{key}={value}')
path.write_text('\n'.join(out)+'\n')
PY
}

# Hermes gateway token
update_env_file "$HOME/.hermes/.env" "TELEGRAM_BOT_TOKEN"

# Toolblip local health-check token aliases (ignored/local only)
update_env_file "/Users/ray/Work/toolblip/.env" "TELEGRAM_BOT_TOKEN"
update_env_file "/Users/ray/.openclaw/secrets/tb.env" "TOOLBLIP_TELEGRAM_BOT_TOKEN"

# Keep alert routing defaults available for health script
update_env_file "/Users/ray/.openclaw/secrets/tb.env" "TOOLBLIP_TELEGRAM_CHAT_ID" "-1003905269197"
update_env_file "/Users/ray/.openclaw/secrets/tb.env" "TOOLBLIP_TELEGRAM_THREAD_ID" "3"

echo "Updated local env files (token not printed)."

if command -v hermes >/dev/null 2>&1; then
  echo "Restarting Hermes gateway..."
  hermes gateway restart || {
    echo "WARNING: hermes gateway restart failed. Run: hermes gateway restart" >&2
    exit 3
  }
  echo "Gateway restarted."
else
  echo "Hermes CLI not found. Restart gateway manually after updating token." >&2
fi

echo "Done. Send a Telegram test message to confirm connectivity."
