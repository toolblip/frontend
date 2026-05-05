'use client';

import { useState, useMemo } from 'react';

export default function CharacterFrequencyCounterClient() {
  const [text, setText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [sortBy, setSortBy] = useState<'frequency' | 'character'>('frequency');

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

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const exportAsCsv = () => {
    const csv = frequencyData
      .map(([char, count]) => `"${char}",${count}`)
      .join('\n');
    copyToClipboard(`Character,Frequency\n${csv}`);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Enter text to count character frequency</span>
      </div>

      <div className="tb-v2-input-group">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text here..."
          className="tb-v2-textarea"
          rows={5}
          aria-label="Text input"
        />
      </div>

      <div className="tb-v2-tool-options" style={{ marginTop: '0.75rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <label className="tb-v2-checkbox-label">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
          />
          Case sensitive
        </label>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span className="tb-v2-hint">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'frequency' | 'character')}
            className="tb-v2-select"
          >
            <option value="frequency">Frequency</option>
            <option value="character">Character</option>
          </select>
        </div>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Statistics</span>
      </div>
      <div className="tb-v2-tool-output-body">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
          <div className="tb-v2-stat-box">
            <div className="tb-v2-stat-value">{totalChars}</div>
            <div className="tb-v2-stat-label">Total Characters</div>
          </div>
          <div className="tb-v2-stat-box">
            <div className="tb-v2-stat-value">{uniqueChars}</div>
            <div className="tb-v2-stat-label">Unique Characters</div>
          </div>
        </div>
      </div>

      <div className="tb-v2-tool-output-head">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span className="tb-v2-tool-label">Frequency Distribution</span>
          {frequencyData.length > 0 && (
            <button
              type="button"
              onClick={exportAsCsv}
              className="tb-v2-btn tb-v2-btn-secondary"
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
            >
              Export CSV
            </button>
          )}
        </div>
      </div>
      <div className="tb-v2-tool-output-body">
        {frequencyData.length > 0 ? (
          <div className="tb-v2-frequency-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {frequencyData.map(([char, count]) => (
              <div
                key={char}
                className="tb-v2-frequency-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.25rem 0',
                  borderBottom: '1px solid var(--tb-border-color, #e5e7eb)'
                }}
              >
                <div
                  style={{
                    width: '3rem',
                    textAlign: 'center',
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    fontSize: '1rem'
                  }}
                >
                  {char === ' ' ? '␣' : char === '\n' ? '↵' : char}
                </div>
                <div style={{ flex: 1, position: 'relative' }}>
                  <div
                    className="tb-v2-frequency-bar"
                    style={{
                      height: '1.25rem',
                      width: getBarWidth(count),
                      backgroundColor: 'var(--tb-primary-color, #3b82f6)',
                      borderRadius: '0.25rem',
                      minWidth: '2px'
                    }}
                  />
                </div>
                <div style={{ width: '4rem', textAlign: 'right', fontFamily: 'monospace' }}>
                  {count}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="tb-v2-hint">Enter text to see character frequency distribution</p>
        )}
      </div>
    </div>
  );
}
