#!/usr/bin/env python3
"""Run claude -p with a prompt from a file, avoiding shell quoting issues.

Uses subprocess with shell=False and passes the prompt as stdin to avoid
ALL shell quoting issues with double quotes and special characters.
"""
import subprocess
import sys
import os

if len(sys.argv) < 2:
    print("Usage: run-claude.py <prompt_file> [claude args...]", file=sys.stderr)
    sys.exit(1)

prompt_file = sys.argv[1]
claude_args = sys.argv[2:]

# Read prompt content
with open(prompt_file) as f:
    prompt = f.read()

# Build claude command
cmd = ['claude', '-p'] + claude_args

proc = subprocess.Popen(
    cmd,
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True,
    cwd='/Users/ray/Work/toolblip',
)
try:
    out, _ = proc.communicate(input=prompt, timeout=240)
    sys.stdout.write(out)
    sys.stdout.flush()
except subprocess.TimeoutExpired:
    proc.kill()
    sys.stdout.write("TIMEOUT\n")
    sys.stdout.flush()
    sys.exit(124)
