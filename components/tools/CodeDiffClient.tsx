'use client';

import React, { useState } from 'react';

export default function CodeDiffClient() {
  const [oldCode, setOldCode] = useState('');
  const [newCode, setNewCode] = useState('');
  const [diffOutput, setDiffOutput] = useState<Array<{ type: 'added' | 'removed' | 'context'; content: string; lineNum?: number }>>([]);

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

  const copyToClipboard = () => {
    const text = diffOutput.map(l => {
      if (l.type === 'added') return `+ ${l.content}`;
      if (l.type === 'removed') return `- ${l.content}`;
      return `  ${l.content}`;
    }).join('\n');
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Code Diff</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Original Code</label>
          <textarea
            value={oldCode}
            onChange={(e) => setOldCode(e.target.value)}
            className="w-full h-48 p-3 border rounded font-mono text-sm bg-gray-900 text-green-400 resize-y"
            placeholder="Paste original code here..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Modified Code</label>
          <textarea
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            className="w-full h-48 p-3 border rounded font-mono text-sm bg-gray-900 text-blue-400 resize-y"
            placeholder="Paste modified code here..."
          />
        </div>
      </div>

      <button
        onClick={computeDiff}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-4"
      >
        Compute Diff
      </button>

      {diffOutput.length > 0 && (
        <>
          <div className="flex gap-2 mb-4">
            <button
              onClick={copyToClipboard}
              className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              Copy
            </button>
          </div>
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
