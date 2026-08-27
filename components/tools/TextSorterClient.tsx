'use client';

import { useMemo, useState } from 'react';
import {
  TEXT_SORTER_EXAMPLE,
  formatSortedLines,
  type SortMode,
} from '@/lib/text-sort';

export default function TextSorterClient() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<SortMode>('az');
  const [caseSensitive, setCaseSensitive] = useState(false);

  const output = useMemo(
    () => formatSortedLines(input, mode, caseSensitive),
    [input, mode, caseSensitive],
  );

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).catch(() => {});
  };

  return (
    <div className="tb-v2-section" style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 20px' }}>
      <div className="tb-v2-mode-tabs">
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as SortMode)}
          className="tb-v2-select"
          aria-label="Sort mode"
        >
          <option value="az">A → Z</option>
          <option value="za">Z → A</option>
          <option value="numeric">Numeric</option>
          <option value="length-asc">Shortest first</option>
          <option value="length-desc">Longest first</option>
          <option value="reverse">Reverse order</option>
          <option value="random">Random order</option>
          <option value="unique">Remove duplicates</option>
        </select>
        <label className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="rounded"
          />
          Case sensitive
        </label>
      </div>
      <div className="tb-v2-grid-2">
        <div>
          <div className="tb-v2-tool-input-head">
            <label className="tb-v2-tool-label" htmlFor="text-sorter-input">
              Input (one item per line, or a single space- or comma-separated line)
            </label>
            <button
              type="button"
              onClick={() => setInput(TEXT_SORTER_EXAMPLE)}
              className="tb-v2-btn-sm"
            >
              Load Example
            </button>
          </div>
          <textarea
            id="text-sorter-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste one item per line, or a single space- or comma-separated line…"
            rows={8}
            className="tb-v2-tool-textarea"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400" htmlFor="text-sorter-output">
              Output
            </label>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!output}
              className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm"
              style={{ color: 'var(--red)' }}
            >
              Copy output
            </button>
          </div>
          <textarea
            id="text-sorter-output"
            value={output}
            readOnly
            rows={8}
            placeholder="Sorted lines appear here as you type, or load an example."
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm resize-none"
          />
        </div>
      </div>
    </div>
  );
}
