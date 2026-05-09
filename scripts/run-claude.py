#!/usr/bin/env python3
"""Run claude -p with a prompt from a file, avoiding shell quoting issues."""
import os
import subprocess
import sys

if len(sys.argv) < 2:
    print("Usage: run-claude.py <prompt_file> [claude args...]", file=sys.stderr)
    sys.exit(1)

prompt_file = sys.argv[1]
claude_args = sys.argv[2:]
with open(prompt_file) as f:
    prompt = f.read()

cmd = ['claude', '-p', '--input-format', 'text'] + claude_args
proc = subprocess.Popen(
    cmd,
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True,
    cwd='/Users/ray/Work/toolblip',
    env=os.environ.copy(),
)
try:
    out, _ = proc.communicate(input=prompt, timeout=300)
except subprocess.TimeoutExpired:
    proc.kill()
    sys.stdout.write('TIMEOUT\n')
    sys.exit(124)

sys.stdout.write(out)
sys.exit(proc.returncode)
