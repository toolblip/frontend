# Self-Improvement System — How It Works

## Overview
After every significant project interaction, tb agent captures what happened so the *next* session starts smarter.

## What Gets Learned
Three knowledge files:
- `CODE_PATTERNS.md` — architecture and coding patterns that work well
- `BUG_PATTERNS.md` — recurring bugs and their fixes
- `CONVENTIONS.md` — project rules, preferences, and constraints from Harun

## How It Updates
A script at `.learnings/update.sh` runs after each interaction. It prompts the agent to:
1. Review what happened in this session
2. Decide if anything new was learned worth capturing
3. Append new entries to the relevant knowledge file

The script is idempotent — if nothing new happened, it exits cleanly.

## How Sessions Pick It Up
At the start of every session, the agent reads the three knowledge files and factors them into decisions.

## What Qualifies as "Worth Recording"
- A bug was fixed — write the pattern so it never comes back
- A code approach worked well — note it for reuse
- Harun gave a preference or constraint — capture it
- A deployment/pipeline approach succeeded — document it
- Something failed in a new way — record the failure + fix

## What Doesn't Need Recording
- Routine tasks that completed normally
- Anything easily re-discovered from code inspection
- Single-use throwaway experiments

## When It Runs
- After every coding, config, deployment, or debugging session
- After any significant project decision
- The agent triggers it proactively when something goes right or wrong

## Skills
- `tb-learnings` — the skill that loads and applies the learnings at session start
- `tb-learnings-update` — the skill that triggers the update after each interaction
