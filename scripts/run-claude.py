#!/usr/bin/env python3
"""Run claude -p with a prompt from a file, avoiding shell quoting issues.

Uses --append-system-prompt-file to pass the prompt so that claude receives
the exact content without any shell quote mangling or stdin conflicts.
"""
import subprocess
import sys
import os
import tempfile
import shutil

if len(sys.argv) < 2:
    print("Usage: run-claude.py <prompt_file> [claude args...]", file=sys.stderr)
    sys.exit(1)

prompt_file = sys.argv[1]
claude_args = sys.argv[2:]

# Copy prompt to a temp file that we'll pass via --append-system-prompt-file
# We need to do this because --append-system-prompt-file requires a REAL file
with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as tmp:
    with open(prompt_file) as f:
        shutil.copyfileobj(f, tmp)
    tmp_path = tmp.name

try:
    # Use --append-system-prompt-file to pass the prompt (no stdin conflict)
    cmd = ['claude', '-p', 'USE_PROMPT_FILE', '--append-system-prompt-file', tmp_path,
           '--dangerously-skip-permissions'] + claude_args
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
finally:
    try:
        os.unlink(tmp_path)
    except:
        pass
