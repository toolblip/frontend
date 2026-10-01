import path from 'node:path';
import { expect, it } from 'vitest';
import { reclaimStaleDevServer } from './reclaim-next-dev.mjs';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

function harness(processes: Record<number, { command: string; cwd: string; ppid: number }>, lockPid: number) {
  const killed: number[] = [];
  const alive = new Set(Object.keys(processes).map(Number));
  const result = reclaimStaleDevServer({
    root,
    self: 100,
    readLock: () => JSON.stringify({ pid: lockPid, appUrl: 'http://localhost:8500' }),
    alive: (pid: number) => alive.has(pid),
    command: (pid: number) => processes[pid]?.command ?? '',
    cwd: (pid: number) => processes[pid]?.cwd ?? '',
    parent: (pid: number) => processes[pid]?.ppid ?? 0,
    children: (pid: number) =>
      Object.entries(processes)
        .filter(([, process]) => process.ppid === pid)
        .map(([id]) => Number(id)),
    kill(pid: number) {
      killed.push(pid);
      alive.delete(pid);
    },
    force(pid: number) {
      alive.delete(pid);
    },
    wait: (predicate: () => boolean) => predicate(),
    log() {},
  });
  return { result, killed };
}

it('stops the leftover server process without signaling npm or the terminal', () => {
  const { result, killed } = harness(
    {
      7: { command: '/bin/zsh -c npx next dev -p 8500', cwd: root, ppid: 1 },
      8: { command: 'npm exec next dev -p 8500', cwd: root, ppid: 7 },
      9: { command: `node ${root}/node_modules/.bin/next dev -p 8500`, cwd: root, ppid: 8 },
      10: { command: 'next-server (v16.2.4)', cwd: root, ppid: 9 },
    },
    10,
  );
  expect(result).toBe('stopped');
  expect(killed).toEqual([10]);
});

it('leaves a server in another checkout alone', () => {
  const other = '/tmp/other-checkout';
  const { result, killed } = harness(
    {
      10: { command: 'next-server (v16.2.4)', cwd: other, ppid: 1 },
    },
    10,
  );
  expect(result).toBe('none');
  expect(killed).toEqual([]);
});

it('does not stop the server this process just started', () => {
  const { result, killed } = harness(
    {
      100: { command: `node ${root}/node_modules/.bin/next dev`, cwd: root, ppid: 1 },
      101: { command: 'next-server (v16.2.4)', cwd: root, ppid: 100 },
    },
    101,
  );
  expect(result).toBe('none');
  expect(killed).toEqual([]);
});

it('ignores a lock whose process has already exited', () => {
  const result = reclaimStaleDevServer({
    readLock: () => JSON.stringify({ pid: 404 }),
    alive: () => false,
    kill() {
      throw new Error('should not kill');
    },
  });
  expect(result).toBe('none');
});
