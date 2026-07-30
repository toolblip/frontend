'use client';

import { useState, useMemo } from 'react';

export default function CharacterFrequencyCounterClient() {
  const [text, setText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [sortBy, setSortBy] = useState<'frequency' | 'character'>('frequency');
  const [copied, setCopied] = useState(false);

  const frequencyData = useMemo(() => {
    if (!text) return [];

    const charCount: Record<string, number> = {};

    for (const char of text) {
      const key = caseSensitive ? char : char.toLowerCase();
      if (!charCount[key]) {
        charCount[key] = 0;
      }
      charCount[key]++;
    }

    const entries = Object.entries(charCount);

    if (sortBy === 'frequency') {
      entries.sort((a, b) => b[1] - a[1]);
    } else {
      entries.sort((a, b) => a[0].localeCompare(b[0]));
    }

    return entries;
  }, [text, caseSensitive, sortBy]);

  const totalChars = text.length;
  const uniqueChars = frequencyData.length;
  const maxFrequency = frequencyData.length > 0 ? frequencyData[0][1] : 0;

  const getBarWidth = (count: number) => {
    return `${(count / maxFrequency) * 100}%`;
  };

  const loadExample = () => {
    setText('The quick brown fox jumps over the lazy dog.');
  };

  const exportAsCsv = () => {
    const csv = frequencyData
      .map(([char, count]) => `"${char}",${count}`)
      .join('\n');
    navigator.clipboard.writeText(`Character,Frequency\n${csv}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your text here..."
        className="tb-v2-tool-textarea"
        rows={5}
        aria-label="Text input"
      />

      <div className="flex gap-4 flex-wrap items-center">
        <label className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
          />
          Case sensitive
        </label>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'frequency' | 'character')}
            className="tb-v2-select"
            style={{ width: 'auto' }}
          >
            <option value="frequency">Frequency</option>
            <option value="character">Character</option>
          </select>
        </div>
      </div>

      {!text && (
        <p className="tb-v2-empty">Enter text above to see per-character frequency counts and a distribution chart.</p>
      )}

      {text && (
        <>
          <div className="tb-v2-grid-2">
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-center">
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{totalChars}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Total Characters</div>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-center">
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{uniqueChars}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Unique Characters</div>
            </div>
          </div>

          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Frequency Distribution</span>
            {frequencyData.length > 0 && (
              <button
                type="button"
                onClick={exportAsCsv}
                className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
              >
                {copied ? 'Copied' : 'Export CSV'}
              </button>
            )}
          </div>
          <div className="tb-v2-tool-output-body">
            <div className="flex flex-col gap-1" style={{ maxHeight: 400, overflowY: 'auto' }}>
              {frequencyData.map(([char, count]) => (
                <div key={char} className="flex items-center gap-3 py-1 border-b border-gray-100 dark:border-gray-800">
                  <div className="w-8 text-center font-mono font-semibold">
                    {char === ' ' ? '␣' : char === '\n' ? '↵' : char}
                  </div>
                  <div className="flex-1">
                    <div
                      className="h-5 rounded bg-indigo-500"
                      style={{ width: getBarWidth(count), minWidth: 2 }}
                    />
                  </div>
                  <div className="w-12 text-right font-mono text-sm">{count}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
