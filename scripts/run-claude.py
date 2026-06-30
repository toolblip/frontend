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
env = os.environ.copy()
# Ensure claude finds macOS Keychain auth regardless of what HOME the caller had.
env['HOME'] = '/Users/ray'
env.setdefault('USER', 'ray')
env.setdefault('LOGNAME', env['USER'])
# Ensure claude binary is findable in stripped cron environments.
path = env.get('PATH', '')
if '/Users/ray/.local/bin' not in path:
    env['PATH'] = f"/Users/ray/.local/bin:/opt/homebrew/bin:{path}"
env.setdefault('PATH', '/Users/ray/.local/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin')
proc = subprocess.Popen(
    cmd,
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True,
    cwd=os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    env=env,
)
try:
    out, _ = proc.communicate(input=prompt, timeout=300)
except subprocess.TimeoutExpired:
    proc.kill()
    sys.stdout.write('TIMEOUT\n')
    sys.exit(124)

sys.stdout.write(out)
sys.exit(proc.returncode)
