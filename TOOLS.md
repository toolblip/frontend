# TOOLS.md - Toolblip

## Browser Profile

Use **Toolblip Browser** (port 9225) for Toolblip work.

**Profile:** `Default`
**user-data-dir:** `~/.openclaw/browser/toolblip/user-data`
**profile-directory:** `Default`
**CDP port:** 9225

### Quick Launch
```bash
open -a "Toolblip Browser"
```

Or from terminal:
```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --user-data-dir="$HOME/.openclaw/browser/toolblip/user-data" \
  --no-first-run --no-service-initialize \
  --remote-debugging-port=9225 --remote-allow-origins='*' \
  --disable-popups --no-default-browser-check \
  --profile-directory="Default"
```

### CDP WS URL
`ws://127.0.0.1:9225/devtools/page/<id>`

## Other Browser Apps

| App | Port | Use for |
|-----|------|---------|
| Crontinel Browser | 9224 | Crontinel project |
| Amazing Browser | 9226 | AmazingPlugins |
| Reddit Browser | 9227 | Reddit marketing |
| OpenClaw Browser | 9223 | OpenClaw config |

## Model Preferences

**Primary:** `minimax-portal/MiniMax-M2.7-highspeed`
**Backup:** `zai/glm-5.1`
**For coding:** Always use `zai/glm-5.1`
