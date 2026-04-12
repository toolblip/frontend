---
title: "How to Connect Claude Code to Toolblip in 5 Minutes"
description: "Give Claude Code access to every Toolblip developer tool — JSON formatter, Base64 encoder, regex tester, and more — via the MCP protocol."
slug: connect-claude-code-to-toolblip
date: 2026-04-12
category: Tutorial
tags: [MCP, Claude Code, Tutorial, Developer Tools]
author: Toolblip Team
readingTime: 5 min
coverImage: /images/blog/connect-claude-code-cover.png
---

# How to Connect Claude Code to Toolblip in 5 Minutes

Wouldn't it be nice if Claude Code could use your developer tools directly — without you having to copy-paste JSON to format it, or manually encode a string? With MCP (Model Context Protocol), it can.

Here's how to connect Claude Code to Toolblip in about 5 minutes.

## What You Need

- [Claude Code](https://claude.ai/code) installed
- Node.js 18+ on your machine
- A terminal

## Step 1: Install the Toolblip MCP Package

The Toolblip MCP package exposes every tool on Toolblip as an MCP tool. Install it globally:

```bash
npm install -g @toolblip/mcp
```

## Step 2: Configure Claude Code

Open your Claude Code configuration file. You can find it at:

- **macOS/Linux:** `~/.claude/settings.json`
- **Windows:** `%USERPROFILE%\.claude\settings.json`

If it doesn't exist, create it. Add the Toolblip MCP server:

```json
{
  "mcpServers": {
    "toolblip": {
      "command": "npx",
      "args": ["@toolblip/mcp"]
    }
  }
}
```

Save the file.

## Step 3: Restart Claude Code

If Claude Code was already running, quit and reopen it. The MCP server will be discovered automatically on startup.

## Step 4: Start Using It

That's it — Claude Code now has access to every Toolblip tool. Try these prompts:

```
Format this JSON response from our API:
{"name":"Toolblip","version":"1.0","active":true,"users":["Alice","Bob","Carol"]}

Encode this URL parameter:
https://example.com/api?data=hello world&filter=active users

Generate a UUID v4 for this new record

Validate this cron expression: 0 9 * * 1-5
```

Claude Code will recognize the tool, call it with the right arguments, and return the result — all without you leaving the conversation.

## What Tools Are Available?

The Toolblip MCP package exposes all of these tools:

| Tool | What it does |
|------|-------------|
| `json_formatter` | Format, minify, or validate JSON |
| `base64_encode` / `base64_decode` | Encode or decode Base64 strings |
| `url_encode` / `url_decode` | URL-encode/decode components |
| `hash_generate` | Generate MD5, SHA-1, SHA-256, SHA-512 hashes |
| `cron_parse` | Parse and validate cron expressions |
| `uuid_generate` | Generate UUID v4 values |
| `regex_test` | Test regex patterns against input |
| `yaml_to_json` | Convert YAML to JSON |

More tools are added regularly.

## How It Works Under the Hood

When you ask Claude Code to format JSON, it:

1. Recognizes the intent and selects the `json_formatter` tool
2. Calls the Toolblip MCP server with the JSON string as input
3. The MCP server formats the JSON (entirely client-side in your browser)
4. The formatted result is returned to Claude Code
5. Claude Code incorporates it into the response

No data is sent to a third-party server. The tool logic runs client-side — the same as if you opened toolblip.com in your browser and used the tool manually.

## Troubleshooting

### "MCP server not found"

Make sure the `mcpServers` section is valid JSON. Common issues:
- Trailing commas
- Missing quotes around keys
- Wrong path to settings.json

### "Tool not responding"

Some tools require browser APIs (e.g., clipboard access). If a tool fails, try running it manually at [toolblip.com/tools](/tools) to verify it's working.

### "Permission denied" on install

Use `sudo npm install -g @toolblip/mcp` if you get EACCES errors on macOS/Linux.

## What's Next?

Once connected, experiment with including Toolblip tools in your regular Claude Code workflow. A few ideas:

- **Code reviews** — ask Claude to validate JSON configs in PRs
- **CI/CD pipelines** — use cron validation in pipeline scripts
- **Data migration** — format and validate JSON dumps
- **API debugging** — encode/decode payloads on the fly

The combination of Claude Code's reasoning and Toolblip's client-side tools means less context-switching and fewer round-trips to external websites.

---

*Want to build your own MCP server? [Learn how →](/blog/what-is-an-mcp-server)*
*Browse all available MCP servers in the [Toolblip directory →](/directory)*
