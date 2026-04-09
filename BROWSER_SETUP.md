# Browser Setup for Toolblip

OpenClaw is configured with a dedicated `toolblip` browser profile that persists logins in this workspace.

## Profile Config

The profile is registered in `~/.openclaw/openclaw.json` under `browser.profiles.toolblip`.

## One-Time Setup

Launch Chrome with the workspace profile once to log in:

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --user-data-dir=/Users/ray/Work/toolblip/.browser/profile \
  --remote-debugging-port=9223
```

Log into all required sites (Toolblip dashboard, Cloudflare, analytics, etc.).

## Attaching OpenClaw

With Chrome running on port 9223:

```bash
openclaw browser --browser-profile toolblip start
```

## Auto-Start (Recommended)

To keep Chrome running between restarts, create a LaunchAgent:

```bash
cat > ~/Library/LaunchAgents/com.toolblip.browser.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "...">
<plist version="1.0">
<dict>
  <label>com.toolblip.browser</label>
  <ProgramArguments>
    <string>/Applications/Google Chrome.app/Contents/MacOS/Google Chrome</string>
    <string>--user-data-dir=/Users/ray/Work/toolblip/.browser/profile</string>
    <string>--remote-debugging-port=9223</string>
    <string>--no-first-run</string>
  </ProgramArguments>
  <RunAtLoad/>
  <KeepAlive/>
</dict>
</plist>
EOF
launchctl load ~/Library/LaunchAgents/com.toolblip.browser.plist
```

## Verification

```bash
openclaw browser --browser-profile toolblip status
openclaw browser --browser-profile toolblip tabs
```

## Switching Between Browser Profiles

- `openclaw`: OpenClaw's isolated managed browser
- `user`: Your personal Chrome with all regular logins
- `toolblip`: Workspace-persistent profile (this workspace)

## Notes

- `.browser/` is gitignored (binary profile data, never commit)
- Keep Chrome running for the profile to stay attached
- If attach fails: make sure Chrome is open with the correct `--remote-debugging-port`
