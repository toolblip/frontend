'use client';

import { useState, useMemo } from 'react';

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  lineNum: number;
  content: string;
}

function computeDiff(oldText: string, newText: string): DiffLine[] {
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');
  const result: DiffLine[] = [];

  // Simple LCS-based diff
  const m = oldLines.length;
  const n = newLines.length;
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  let i = m, j = n;
  const temp: DiffLine[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      temp.unshift({ type: 'unchanged', lineNum: j, content: oldLines[i - 1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      temp.unshift({ type: 'added', lineNum: j, content: newLines[j - 1] });
      j--;
    } else {
      temp.unshift({ type: 'removed', lineNum: i, content: oldLines[i - 1] });
      i--;
    }
  }

  return temp;
}

export default function TextDiffCheckerClient() {
  const [oldText, setOldText] = useState('');
  const [newText, setNewText] = useState('');
  const [copied, setCopied] = useState(false);

  const diff = useMemo(() => {
    if (!oldText && !newText) return [];
    return computeDiff(oldText, newText);
  }, [oldText, newText]);

  const stats = useMemo(() => {
    const added = diff.filter(d => d.type === 'added').length;
    const removed = diff.filter(d => d.type === 'removed').length;
    const unchanged = diff.filter(d => d.type === 'unchanged').length;
    return { added, removed, unchanged };
  }, [diff]);

  const copyDiff = () => {
    const text = diff.map(d => {
      if (d.type === 'added') return `+ ${d.content}`;
      if (d.type === 'removed') return `- ${d.content}`;
      return `  ${d.content}`;
    }).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      {/* Input panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="tb-v2-tool-input-head">
            <span className="tb-v2-tool-label">Original Text</span>
            <span className="text-xs text-gray-500">{oldText.split('\n').filter(l => l).length} lines</span>
          </div>
          <textarea
            value={oldText}
            onChange={e => setOldText(e.target.value)}
            className="tb-v2-tool-textarea"
            placeholder="Paste original text here..."
            rows={10}
            style={{ fontFamily: 'var(--f-mono)', fontSize: 13 }}
          />
        </div>
        <div>
          <div className="tb-v2-tool-input-head">
            <span className="tb-v2-tool-label">Modified Text</span>
            <span className="text-xs text-gray-500">{newText.split('\n').filter(l => l).length} lines</span>
          </div>
          <textarea
            value={newText}
            onChange={e => setNewText(e.target.value)}
            className="tb-v2-tool-textarea"
            placeholder="Paste modified text here..."
            rows={10}
            style={{ fontFamily: 'var(--f-mono)', fontSize: 13 }}
          />
        </div>
      </div>

      {/* Stats */}
      {diff.length > 0 && (
        <div className="flex gap-4 text-sm">
          <span className="text-green-600 dark:text-green-400">+{stats.added} added</span>
          <span className="text-red-600 dark:text-red-400">-{stats.removed} removed</span>
          <span className="text-gray-500">{stats.unchanged} unchanged</span>
        </div>
      )}

      {/* Diff output */}
      {diff.length > 0 && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Differences</span>
            <button onClick={copyDiff} className="tb-v2-copy-btn">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body overflow-x-auto">
            <pre className="tb-v2-tool-pre text-sm" style={{ fontFamily: 'var(--f-mono)' }}>
              {diff.map((d, i) => (
                <div
                  key={i}
                  className={`px-2 py-0.5 ${
                    d.type === 'added'
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                      : d.type === 'removed'
                      ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                      : ''
                  }`}
                >
                  <span className="inline-block w-6 text-gray-400">{d.type === 'added' ? '+' : d.type === 'removed' ? '-' : ' '}</span>
                  {d.content}
                </div>
              ))}
            </pre>
          </div>
        </>
      )}

      {!oldText && !newText && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">📝</div>
          <p>Paste text in both panels to see the differences</p>
        </div>
      )}
    </div>
  );
}
