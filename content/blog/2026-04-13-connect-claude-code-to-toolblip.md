---
title: How to Connect Claude Code to Toolblip in 5 Minutes
description: >-
  Give Claude Code access to every Toolblip developer tool - JSON formatter,
  Base64 encoder, regex tester, and more - via the MCP protocol.
slug: connect-claude-code-to-toolblip
date: 2026-04-13T00:00:00.000Z
category: Tutorial
tags:
  - MCP
  - Claude Code
  - Tutorial
  - Developer Tools
  - AI Tools
author: Toolblip Team
readingTime: 7 min
coverImage: /images/blog/connect-claude-code-cover.png
featuredImage: 'https://placehold.co/1200x630/374151/FFFFFF?text=Toolblip+Blog'
---

# How to Connect Claude Code to Toolblip in 5 Minutes

Every developer has those repetitive moments - formatting a JSON response, generating a UUID for a test record, validating a cron expression before shipping a deployment script. They only take a few seconds each, but they add up, and they break your flow.

Now imagine Claude Code handling those tasks for you - without you leaving the editor, copying anything to a browser, or context-switching at all. With the Model Context Protocol (MCP) and Toolblip's MCP server, that workflow is real and it takes about 5 minutes to set up.

This guide walks you through every step, from installation to your first real-world use case.

## What Is MCP, and Why Does It Matter Here?

MCP - the Model Context Protocol - is an open standard that lets AI assistants connect to external tools and data sources in a structured, secure way. Rather than relying on ad-hoc prompts or fragile screen-scraping, MCP defines a contract: the AI knows exactly what tools are available, what arguments they take, and how to interpret the results.

When Claude Code connects to Toolblip via MCP, it gains access to a suite of client-side developer utilities - things like JSON formatters, hash generators, and regex testers - as if they were native capabilities. The difference is that these tools run entirely in your browser. No data leaves your machine.

## Prerequisites

Before you start, make sure you have:

- **Claude Code** installed and working (`npx @anthropic/claude-code` or via the Claude.ai desktop app)
- **Node.js 18+** - required to run the MCP server package
- **npm or yarn** - for installing the package
- A terminal and about 5 minutes

That's it. No accounts, no API keys, no server to deploy.

## Step 1: Install the Toolblip MCP Package

The Toolblip MCP package wraps every tool on toolblip.com as an MCP-compatible tool. Install it globally with npm:

```bash
npm install -g @toolblip/mcp
```

If you get an `EACCES` permission error on macOS or Linux, use:

```bash
sudo npm install -g @toolblip/mcp
```

Or better yet, fix your npm permissions so you don't need `sudo` in the future.

Verify the installation:

```bash
npx @toolblip/mcp --version
```

You should see a version number printed to the terminal. If you do, you're ready to configure Claude Code.

## Step 2: Configure Claude Code

Claude Code reads its MCP server configuration from a settings file. On macOS and Linux, this lives at:

```
~/.claude/settings.json
```

On Windows, it's:

```
%USERPROFILE%\.claude\settings.json
```

Open this file in your editor. If it doesn't exist yet, create it. Then add the `toolblip` MCP server entry:

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

A few things to note about this configuration:

- The key `"toolblip"` is the server name. You can rename it to anything - it's how Claude Code refers to this server in logs and debugging.
- Using `"command": "npx"` means the package is fetched and run on demand. This keeps the config clean but requires an internet connection on first run.
- If you installed the package globally and want to skip the network fetch, you can point directly to the binary:

```json
{
  "mcpServers": {
    "toolblip": {
      "command": "/usr/local/bin/toolblip-mcp"
    }
  }
}
```

Save the file.

## Step 3: Restart Claude Code

If Claude Code is already running, quit it completely and reopen it. New MCP servers are discovered on startup - a running instance won't pick up config changes automatically.

When Claude Code starts, you should see the Toolblip server loaded in the startup log. It looks something like this:

```
[Toolblip] MCP server initialized
```

If you don't see this, run `claude-code` with verbose logging:

```bash
CLAUDE_DEBUG=1 claude-code
```

And look for any errors related to the `toolblip` server entry.

## Step 4: Start Using It

That's the entire setup. Now Claude Code can call Toolblip tools directly. Here's what that looks like in practice.

### Example 1: Format and Validate JSON

Paste this into Claude Code:

```
Format and validate this JSON. If it's invalid, tell me what's wrong:
{"name":"Toolblip","version":"1.0","active":true,"users":["Alice","Bob","Carol"],"config":{"theme":"dark","notifications":true}}
```

Claude Code will recognize the intent, call the `json_formatter` tool through the MCP server, and return clean, indented JSON. If the JSON had a syntax error, it would tell you exactly where - same as toolblip.com's validator.

### Example 2: Generate a UUID

```
Generate a UUID v4 for a new user record in our users table.
```

Claude Code calls `uuid_generate` and returns a valid v4 UUID like `a1b2c3d4-e5f6-7890-abcd-ef1234567890`.

### Example 3: Validate a Cron Expression

Before adding a cron schedule to your deployment pipeline, ask:

```
Is this cron expression valid: 0 30 8 * * 1-5? What does it evaluate to?
```

Claude Code calls `cron_parse` and returns the human-readable interpretation - "At 8:30 AM on every weekday" - along with a confirmation that the expression is syntactically valid.

### Example 4: Hash a String

```
Generate an SHA-256 hash of this API secret for our config file:
my-super-secret-key-12345
```

Claude Code calls `hash_generate` with the `sha256` algorithm and returns the hex digest.

### Example 5: Test a Regex Pattern

```
Test this regex against the sample inputs. Does it match emails correctly?
Pattern: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$
Inputs: "user@example.com", "not-an-email", "test@sub.domain.org"
```

Claude Code runs `regex_test` and reports which inputs matched and which didn't.

## The Full Tool Library

Here's every tool currently available through the Toolblip MCP server:

| Tool | Description |
|------|-------------|
| `json_format` | Format, minify, or validate JSON |
| `json_minify` | Remove whitespace from JSON |
| `base64_encode` | Encode a string to Base64 |
| `base64_decode` | Decode a Base64 string |
| `url_encode` | URL-encode a string |
| `url_decode` | URL-decode a string |
| `hash_generate` | Generate MD5, SHA-1, SHA-256, SHA-512 hashes |
| `cron_parse` | Parse and validate cron expressions |
| `cron_to_human` | Convert cron expression to human-readable text |
| `uuid_generate` | Generate a UUID v4 |
| `regex_test` | Test a regex pattern against text |
| `yaml_to_json` | Convert YAML to JSON |
| `json_to_yaml` | Convert JSON to YAML |
| `html_escape` | Escape HTML special characters |
| `html_unescape` | Unescape HTML entities |

New tools are added with each Toolblip release.

## How It Works Under the Hood

Understanding the flow helps when something goes wrong.

When you ask Claude Code to format JSON, the following happens in sequence:

1. Claude Code's reasoning engine recognizes the request matches the `json_format` tool
2. It serializes the JSON string as a tool argument and sends it to the Toolblip MCP server
3. The MCP server passes the input to the client-side Toolblip tool (running in the browser or Node.js)
4. The tool processes the input and returns the result to Claude Code
5. Claude Code incorporates the result into its response

No network request is made to a third-party API. The tool logic is bundled in the `@toolblip/mcp` npm package, which runs locally.

## Troubleshooting Common Issues

### "MCP server not found" or "Unknown server"

The most common cause is an invalid `settings.json` file. JSON is strict - trailing commas, missing quotes, and mismatched braces will silently break the file.

Run your settings.json through a JSON validator before saving it. VS Code has this built in - look for the red squiggles.

### "Tool returned no output"

Some tools require specific input formats. For example, `hash_generate` expects a `text` and an `algorithm` argument:

```
hash_generate(text="hello", algorithm="sha256")
```

Check the tool description in Claude Code by asking:

```
What arguments does the json_format tool take?
```

### "Permission denied" on npm install

This is almost always an npm ownership issue. Fix it by following [npm's official guide](https://docs.npmjs.com/resolving-eACCES-permissions-errors-when-installing-packages-globally) - or just use `npx` in the config, which avoids global installation entirely.

### Slow first run with npx

When using `"command": "npx"`, the first invocation downloads the package. This can take 10-20 seconds. After that, `npx` caches it locally. If you want instant startup, install globally and point `command` to the binary path directly.

## What to Build With This

Once the connection is working, here are some workflows that genuinely save time:

- **API debugging** - paste a raw API response and ask Claude to format, validate, and summarize it
- **Config file validation** - validate JSON or YAML config files before deploying
- **Test data generation** - generate UUIDs, hashes, and encoded strings directly in your test files
- **Cron scheduling** - validate deployment schedules before committing them to your pipeline
- **Regex development** - iterate on regex patterns with live test feedback

The less time you spend context-switching to a browser tab for a 3-second task, the more you stay in flow.

## Get Started

Ready to connect? The setup takes 5 minutes and requires no account.

1. Install: `npm install -g @toolblip/mcp`
2. Add the config to `~/.claude/settings.json`
3. Restart Claude Code
4. Try it: `Format this JSON: {"key":"value"}`

For more MCP resources, tutorials, and a directory of MCP-compatible tools, visit [toolblip.com](/).

---

*Want to understand MCP from the ground up? Read [What is an MCP Server? A Practical Guide for Developers](/blog/what-is-an-mcp-server)*
*Looking for more MCP servers to connect? Browse the [Toolblip MCP Directory →](/directory)*
