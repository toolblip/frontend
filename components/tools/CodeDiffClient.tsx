'use client';

import { useState } from 'react';

export default function CodeDiffClient() {
  const [oldCode, setOldCode] = useState('');
  const [newCode, setNewCode] = useState('');
  const [diffOutput, setDiffOutput] = useState<Array<{ type: 'added' | 'removed' | 'context'; content: string; lineNum?: number }>>([]);
  const [copied, setCopied] = useState(false);

  const computeDiff = () => {
    const oldLines = oldCode.split('\n');
    const newLines = newCode.split('\n');
    const result: typeof diffOutput = [];

    // Simple line-by-line diff using LCS approach
    const lcs = buildLCS(oldLines, newLines);
    let oldIdx = 0, newIdx = 0, lcsIdx = 0;

    while (oldIdx < oldLines.length || newIdx < newLines.length) {
      if (lcsIdx < lcs.length && oldIdx < oldLines.length && newIdx < newLines.length &&
          oldLines[oldIdx] === lcs[lcsIdx] && newLines[newIdx] === lcs[lcsIdx]) {
        result.push({ type: 'context', content: oldLines[oldIdx], lineNum: oldIdx + 1 });
        oldIdx++; newIdx++; lcsIdx++;
      } else if (oldIdx < oldLines.length && (lcsIdx >= lcs.length || oldLines[oldIdx] !== lcs[lcsIdx])) {
        result.push({ type: 'removed', content: oldLines[oldIdx], lineNum: oldIdx + 1 });
        oldIdx++;
      } else if (newIdx < newLines.length && (lcsIdx >= lcs.length || newLines[newIdx] !== lcs[lcsIdx])) {
        result.push({ type: 'added', content: newLines[newIdx], lineNum: newIdx + 1 });
        newIdx++;
      }
    }

    setDiffOutput(result);
  };

  const buildLCS = (a: string[], b: string[]): string[] => {
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
  };

  const loadExample = () => {
    setOldCode('function greet(name) {\n  console.log("Hello " + name);\n  return true;\n}');
    setNewCode('function greet(name) {\n  if (!name) return false;\n  console.log(`Hello, ${name}!`);\n  return true;\n}');
    setDiffOutput([]);
  };

  const copyToClipboard = () => {
    if (!diffOutput.length) return;
    const text = diffOutput.map(l => {
      if (l.type === 'added') return `+ ${l.content}`;
      if (l.type === 'removed') return `- ${l.content}`;
      return `  ${l.content}`;
    }).join('\n');
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Code Diff</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="tb-v2-tool-label" style={{ marginBottom: 6, display: 'block' }}>Original Code</label>
          <textarea
            value={oldCode}
            onChange={(e) => setOldCode(e.target.value)}
            className="w-full h-48 p-3 border rounded font-mono text-sm bg-gray-900 text-green-400 resize-y"
            placeholder="Paste original code here..."
          />
        </div>
        <div>
          <label className="tb-v2-tool-label" style={{ marginBottom: 6, display: 'block' }}>Modified Code</label>
          <textarea
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            className="w-full h-48 p-3 border rounded font-mono text-sm bg-gray-900 text-blue-400 resize-y"
            placeholder="Paste modified code here..."
          />
        </div>
      </div>

      <button type="button" onClick={computeDiff} className="tb-v2-btn tb-v2-btn-primary" style={{ alignSelf: 'flex-start' }}>
        Compute Diff
      </button>

      {diffOutput.length === 0 ? (
        <p className="tb-v2-empty">Paste original and modified code above, then compute the diff to see line-by-line changes.</p>
      ) : (
        <>
          <button
            type="button"
            onClick={copyToClipboard}
            className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
            style={{ alignSelf: 'flex-start' }}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
          <div className="bg-gray-900 rounded p-4 font-mono text-sm overflow-x-auto">
            {diffOutput.map((line, i) => (
              <div
                key={i}
                className={`px-2 py-0.5 ${
                  line.type === 'added' ? 'bg-green-900 text-green-300' :
                  line.type === 'removed' ? 'bg-red-900 text-red-300' :
                  'bg-transparent text-gray-400'
                }`}
              >
                <span className="inline-block w-12 text-gray-500">{line.lineNum}</span>
                <span className="mr-2">{line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}</span>
                {line.content}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
