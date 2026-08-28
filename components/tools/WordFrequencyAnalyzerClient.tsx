'use client';

import { useState, useMemo } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE =
  'Search engine optimization helps websites rank higher in search results. Good SEO practices include keyword research, on page optimization, and quality content. Search engine optimization is an ongoing process that requires monitoring search rankings and adjusting your SEO strategy over time.';

interface WordCount {
  word: string;
  count: number;
  percentage: number;
}

const COMMON_WORDS = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
  'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
  'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
  'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
  'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
]);

export default function WordFrequencyAnalyzerClient() {
  const [text, setText] = useState('');
  const [excludeCommon, setExcludeCommon] = useState(true);
  const [minLength, setMinLength] = useState(0);
  const [sortBy, setSortBy] = useState<'count' | 'alphabetical'>('count');
  const [copied, setCopied] = useState(false);

  const wordCounts = useMemo<WordCount[]>(() => {
    if (!text.trim()) return [];

    const words = text
      .toLowerCase()
      .replace(/[^a-zA-Z\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length >= minLength)
      .filter((w) => !excludeCommon || !COMMON_WORDS.has(w));

    const counts: Record<string, number> = {};
    words.forEach((word) => {
      counts[word] = (counts[word] || 0) + 1;
    });

    const total = words.length || 1;
    return Object.entries(counts)
      .map(([word, count]) => ({
        word,
        count,
        percentage: Math.round((count / total) * 100 * 10) / 10,
      }))
      .sort((a, b) =>
        sortBy === 'count' ? b.count - a.count : a.word.localeCompare(b.word),
      );
  }, [text, excludeCommon, minLength, sortBy]);

  const handleCopy = () => {
    const output = wordCounts.map((w) => `${w.word}: ${w.count} (${w.percentage}%)`).join('\n');
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Enter text</span>
        <ToolExampleClearActions
          onExample={() => setText(EXAMPLE)}
          onClear={() => setText('')}
          canClear={text.length > 0}
        />
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="tb-v2-tool-textarea"
        placeholder="Paste or type your text here..."
        rows={6}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          padding: '16px 20px',
          borderTop: '1px solid var(--line)',
        }}
      >
        <div>
          <label className="tb-v2-tool-label">Min word length</label>
          <input
            type="number"
            value={minLength}
            onChange={(e) => setMinLength(Math.max(0, parseInt(e.target.value) || 0))}
            className="tb-v2-input"
            min={0}
            max={20}
          />
        </div>
        <div>
          <label className="tb-v2-tool-label">Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'count' | 'alphabetical')}
            className="tb-v2-select"
          >
            <option value="count">Frequency</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>
      </div>
      <div style={{ padding: '0 20px 16px' }}>
        <label className="tb-v2-checkbox-row">
          <input
            type="checkbox"
            checked={excludeCommon}
            onChange={(e) => setExcludeCommon(e.target.checked)}
          />
          Exclude common words
        </label>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">
          {wordCounts.length > 0
            ? `${wordCounts.length} unique words`
            : 'Word Frequencies'}
        </span>
        {wordCounts.length > 0 ? (
          <button type="button" onClick={handleCopy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        ) : null}
      </div>
      <div className="tb-v2-tool-output-body">
        {!text.trim() ? (
          <p className="tb-v2-empty">Paste text or load the example to see word frequencies.</p>
        ) : wordCounts.length === 0 ? (
          <div className="tb-v2-banner tb-v2-banner-warn">
            No words match the current filters. Try adjusting the minimum word length or disabling
            exclude common words.
          </div>
        ) : (
          <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--fg-2)', fontSize: 11, textTransform: 'uppercase' }}>
                <th style={{ padding: '4px 8px 4px 0' }}>Word</th>
                <th style={{ padding: '4px 8px', textAlign: 'right' }}>Count</th>
                <th style={{ padding: '4px 0', textAlign: 'right' }}>%</th>
              </tr>
            </thead>
            <tbody>
              {wordCounts.map((item) => (
                <tr key={item.word} style={{ borderTop: '1px solid var(--line)' }}>
                  <td style={{ padding: '5px 8px 5px 0', fontFamily: 'var(--f-mono)' }}>{item.word}</td>
                  <td style={{ padding: '5px 8px', textAlign: 'right' }}>{item.count}</td>
                  <td style={{ padding: '5px 0', textAlign: 'right', color: 'var(--fg-2)' }}>
                    {item.percentage}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
