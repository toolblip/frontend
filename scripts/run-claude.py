#!/usr/bin/env python3
"""Run claude -p with a prompt from a file, avoiding shell quoting issues.

Key insight: pass prompt as a DIRECT ARGUMENT (not stdin) with stdin=DEVNULL.
This prevents claude from waiting for stdin when also receiving a prompt argument.
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

# Pass prompt as DIRECT ARGUMENT (not stdin) with stdin=DEVNULL
# This prevents claude from reading stdin and getting confused
cmd = ['claude', '-p', prompt] + claude_args

proc = subprocess.Popen(
    cmd,
    stdin=subprocess.DEVNULL,
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True,
    cwd='/Users/ray/Work/toolblip',
    env=os.environ.copy()
)
try:
    out, _ = proc.communicate(timeout=240)
    sys.stdout.write(out)
    sys.stdout.flush()
except subprocess.TimeoutExpired:
    proc.kill()
    sys.stdout.write("TIMEOUT\n")
    sys.stdout.flush()
    sys.exit(124)
