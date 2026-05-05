'use client';

import React, { useState } from 'react';

export default function CodeDiffToolClient() {
  const [oldCode, setOldCode] = useState('');
  const [newCode, setNewCode] = useState('');
  const [diffType, setDiffType] = useState<'unified' | 'side-by-side'>('unified');
  const [result, setResult] = useState('');

  const generateDiff = () => {
    const oldLines = oldCode.split('\n');
    const newLines = newCode.split('\n');
    const hunks = [];

    let i = 0, j = 0;
    let oldStart = 1, newStart = 1;

    while (i < oldLines.length || j < newLines.length) {
      const added: string[] = [];
      const removed: string[] = [];

      while (i < oldLines.length && !newLines.includes(oldLines[i]) && j < newLines.length) {
        removed.push(oldLines[i]);
        i++;
      }
      while (j < newLines.length && !oldLines.includes(newLines[j]) && i < oldLines.length) {
        added.push(newLines[j]);
        j++;
      }

      if (removed.length > 0 || added.length > 0) {
        hunks.push({ oldStart: oldStart, newStart, removed, added, oldCount: removed.length, newCount: added.length });
      }
      oldStart = i + 1;
      newStart = j + 1;
    }

    if (diffType === 'unified') {
      const output = hunks.map(h =>
        `@@ -${h.oldStart},${h.oldCount} +${h.newStart},${h.newCount} @@\n` +
        h.removed.map(l => `-${l}`).join('\n') + (h.removed.length && h.added.length ? '\n' : '') +
        h.added.map(l => `+${l}`).join('\n')
      ).join('\n\n');
      setResult(output || 'No differences found');
    } else {
      const maxLen = Math.max(...oldLines.map(l => l.length), ...newLines.map(l => l.length));
      const output = oldLines.map((l, i) => ` ${l.padEnd(maxLen)} | ${newLines[i] || ''}`).join('\n');
      setResult(output || 'No differences found');
    }
  };

  const copyResult = () => navigator.clipboard.writeText(result);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Code Diff Tool</h1>

      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2">
          <input type="radio" checked={diffType === 'unified'} onChange={() => setDiffType('unified')} />
          Unified
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" checked={diffType === 'side-by-side'} onChange={() => setDiffType('side-by-side')} />
          Side by Side
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Original</label>
          <textarea
            value={oldCode}
            onChange={(e) => setOldCode(e.target.value)}
            className="w-full h-40 p-3 border rounded font-mono text-sm bg-gray-50 resize-y"
            placeholder="Original code..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Modified</label>
          <textarea
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            className="w-full h-40 p-3 border rounded font-mono text-sm bg-gray-50 resize-y"
            placeholder="Modified code..."
          />
        </div>
      </div>

      <button onClick={generateDiff} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-4">
        Generate Diff
      </button>

      {result && (
        <div className="relative">
          <button onClick={copyResult} className="absolute right-2 top-2 px-3 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300">
            Copy
          </button>
          <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-sm font-mono">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}
