'use client';

import { useState } from 'react';

type DiffOp = { type: 'context' | 'added' | 'removed'; content: string };

function buildLCS(a: string[], b: string[]): string[] {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  const lcs: string[] = [];
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) { lcs.unshift(a[i - 1]); i--; j--; }
    else if (dp[i - 1][j] > dp[i][j - 1]) i--;
    else j--;
  }
  return lcs;
}

function buildOps(oldLines: string[], newLines: string[]): DiffOp[] {
  const lcs = buildLCS(oldLines, newLines);
  const ops: DiffOp[] = [];
  let oldIdx = 0, newIdx = 0, lcsIdx = 0;

  while (oldIdx < oldLines.length || newIdx < newLines.length) {
    if (lcsIdx < lcs.length && oldIdx < oldLines.length && newIdx < newLines.length &&
        oldLines[oldIdx] === lcs[lcsIdx] && newLines[newIdx] === lcs[lcsIdx]) {
      ops.push({ type: 'context', content: oldLines[oldIdx] });
      oldIdx++; newIdx++; lcsIdx++;
    } else if (oldIdx < oldLines.length && (lcsIdx >= lcs.length || oldLines[oldIdx] !== lcs[lcsIdx])) {
      ops.push({ type: 'removed', content: oldLines[oldIdx] });
      oldIdx++;
    } else {
      ops.push({ type: 'added', content: newLines[newIdx] });
      newIdx++;
    }
  }

  return ops;
}

function buildUnifiedDiff(ops: DiffOp[]): string {
  const hunks: string[] = [];
  let oldLine = 0, newLine = 0, i = 0;

  while (i < ops.length) {
    if (ops[i].type === 'context') {
      oldLine++; newLine++; i++;
      continue;
    }

    const hunkOldStart = oldLine + 1;
    const hunkNewStart = newLine + 1;
    const removedLines: string[] = [];
    const addedLines: string[] = [];

    while (i < ops.length && ops[i].type !== 'context') {
      if (ops[i].type === 'removed') { removedLines.push(ops[i].content); oldLine++; }
      else { addedLines.push(ops[i].content); newLine++; }
      i++;
    }

    const header = `@@ -${hunkOldStart},${removedLines.length} +${hunkNewStart},${addedLines.length} @@`;
    const body = [...removedLines.map(l => `-${l}`), ...addedLines.map(l => `+${l}`)].join('\n');
    hunks.push(`${header}\n${body}`);
  }

  return hunks.join('\n\n');
}

function buildSideBySide(oldLines: string[], newLines: string[]): string {
  const maxLen = Math.max(0, ...oldLines.map(l => l.length), ...newLines.map(l => l.length));
  const maxRows = Math.max(oldLines.length, newLines.length);
  const rows: string[] = [];
  for (let r = 0; r < maxRows; r++) {
    rows.push(`${(oldLines[r] ?? '').padEnd(maxLen)} | ${newLines[r] ?? ''}`);
  }
  return rows.join('\n');
}

export default function CodeDiffToolClient() {
  const [oldCode, setOldCode] = useState('');
  const [newCode, setNewCode] = useState('');
  const [diffType, setDiffType] = useState<'unified' | 'side-by-side'>('unified');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const generateDiff = () => {
    const oldLines = oldCode.split('\n');
    const newLines = newCode.split('\n');

    if (diffType === 'unified') {
      const output = buildUnifiedDiff(buildOps(oldLines, newLines));
      setResult(output || 'No differences found');
    } else {
      const output = buildSideBySide(oldLines, newLines);
      setResult(output || 'No differences found');
    }
  };

  const loadExample = () => {
    setOldCode('function greet(name) {\n  console.log("Hello " + name);\n  return true;\n}');
    setNewCode('function greet(name) {\n  if (!name) return false;\n  console.log(`Hello, ${name}!`);\n  return true;\n}');
    setResult('');
  };

  const copyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Code Diff Tool</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div className="tb-v2-mode-tabs">
        <button type="button" onClick={() => setDiffType('unified')} className={`tb-v2-mode-tab ${diffType === 'unified' ? 'on' : ''}`}>
          Unified
        </button>
        <button type="button" onClick={() => setDiffType('side-by-side')} className={`tb-v2-mode-tab ${diffType === 'side-by-side' ? 'on' : ''}`}>
          Side by Side
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="tb-v2-tool-label" style={{ marginBottom: 6, display: 'block' }}>Original</label>
          <textarea
            value={oldCode}
            onChange={(e) => setOldCode(e.target.value)}
            className="tb-v2-tool-textarea"
            style={{ height: 160, fontFamily: 'var(--f-mono)' }}
            placeholder="Original code..."
          />
        </div>
        <div>
          <label className="tb-v2-tool-label" style={{ marginBottom: 6, display: 'block' }}>Modified</label>
          <textarea
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            className="tb-v2-tool-textarea"
            style={{ height: 160, fontFamily: 'var(--f-mono)' }}
            placeholder="Modified code..."
          />
        </div>
      </div>

      <button type="button" onClick={generateDiff} className="tb-v2-btn tb-v2-btn-primary" style={{ alignSelf: 'flex-start' }}>
        Generate Diff
      </button>

      {!result ? (
        <p className="tb-v2-empty">Paste original and modified code above, then generate the diff to see it here.</p>
      ) : (
        <div className="relative">
          <button
            type="button"
            onClick={copyResult}
            className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
            style={{ position: 'absolute', right: 8, top: 8 }}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
          <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-sm font-mono">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}
