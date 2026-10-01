// Next.js locks `.next/dev` so a second `next dev` exits while the first is
// still alive. Leftover servers (a closed terminal, another port, a previous
// agent run) make every later start fail. This stops that one server before
// the new process takes the lock. It will not touch a Next process whose
// working directory is a different checkout.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function readText(command, args) {
  try {
    return execFileSync(command, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

function defaultAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function defaultParent(pid) {
  const value = Number(readText('ps', ['-p', String(pid), '-o', 'ppid=']));
  return Number.isInteger(value) && value > 1 ? value : 0;
}

function defaultCwd(pid) {
  const output = readText('lsof', ['-a', '-p', String(pid), '-d', 'cwd', '-Fn']);
  const line = output.split('\n').find((entry) => entry.startsWith('n'));
  return line ? line.slice(1) : '';
}

function defaultChildren(pid) {
  return readText('pgrep', ['-P', String(pid)])
    .split('\n')
    .map((entry) => Number(entry))
    .filter((entry) => Number.isInteger(entry) && entry > 1);
}

function inProject(cwd, projectRoot) {
  return cwd === projectRoot || cwd.startsWith(projectRoot + path.sep);
}

function relatedToSelf(lockPid, io) {
  if (lockPid === io.self) return true;
  const seen = new Set();
  let current = io.parent(io.self);
  while (current > 1 && !seen.has(current)) {
    if (current === lockPid) return true;
    seen.add(current);
    current = io.parent(current);
  }
  seen.clear();
  current = lockPid;
  while (current > 1 && !seen.has(current)) {
    if (current === io.self) return true;
    seen.add(current);
    current = io.parent(current);
  }
  return false;
}

function descendants(pid, io, seen = new Set()) {
  const found = [];
  for (const child of io.children(pid)) {
    if (seen.has(child)) continue;
    seen.add(child);
    found.push(child, ...descendants(child, io, seen));
  }
  return found;
}

function waitUntil(predicate, timeoutMs) {
  const buffer = new Int32Array(new SharedArrayBuffer(4));
  const start = Date.now();
  while (!predicate()) {
    if (Date.now() - start >= timeoutMs) return false;
    Atomics.wait(buffer, 0, 0, 50);
  }
  return true;
}

export function reclaimStaleDevServer(overrides = {}) {
  const io = {
    root,
    self: process.pid,
    readLock() {
      try {
        return readFileSync(path.join(root, '.next/dev/lock'), 'utf8');
      } catch {
        return '';
      }
    },
    alive: defaultAlive,
    parent: defaultParent,
    cwd: defaultCwd,
    children: defaultChildren,
    kill(pid) {
      try {
        process.kill(pid, 'SIGTERM');
      } catch {
        // Already gone.
      }
    },
    force(pid) {
      try {
        process.kill(pid, 'SIGKILL');
      } catch {
        // Already gone.
      }
    },
    wait: waitUntil,
    log(message) {
      console.error(message);
    },
    ...overrides,
  };

  let info;
  try {
    info = JSON.parse(io.readLock() || '');
  } catch {
    return 'none';
  }
  const lockPid = Number(info?.pid);
  if (!Number.isInteger(lockPid) || lockPid <= 1 || !io.alive(lockPid)) return 'none';
  if (relatedToSelf(lockPid, io)) return 'none';
  if (!inProject(io.cwd(lockPid), io.root)) return 'none';

  // Stop only the process recorded in the lock. Signaling its parent `next`
  // or npm sends that signal to the whole process group.
  const targets = [lockPid, ...descendants(lockPid, io)].reverse();
  for (const pid of targets) io.kill(pid);
  const stopped = io.wait(() => !io.alive(lockPid), 4000);
  if (!stopped) {
    for (const pid of targets) io.force(pid);
    io.wait(() => !io.alive(lockPid), 1000);
  }
  const where = typeof info.appUrl === 'string' ? ` (${info.appUrl})` : '';
  io.log(`Stopped the Next dev server already running for this project${where}.`);
  return 'stopped';
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  reclaimStaleDevServer();
}
