'use client';

import { useState, useCallback } from 'react';

export default function TimestampConverterClient() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<{ label: string; value: string }[]>([]);
  const [error, setError] = useState('');

  const convert = useCallback(() => {
    setError('');
    const trimmed = input.trim();
    if (!trimmed) { setError('Please enter a timestamp or date'); return; }

    const isNumeric = /^\d+$/.test(trimmed);
    const results: { label: string; value: string }[] = [];

    if (isNumeric) {
      const ts = parseInt(trimmed);
      const d = new Date(ts < 1e12 ? ts * 1000 : ts);
      if (isNaN(d.getTime())) { setError('Invalid timestamp'); return; }
      results.push({ label: 'Date (local)', value: d.toLocaleString() });
      results.push({ label: 'UTC', value: d.toUTCString() });
      results.push({ label: 'ISO 8601', value: d.toISOString() });
      results.push({ label: 'Unix (seconds)', value: Math.floor(d.getTime() / 1000).toString() });
      results.push({ label: 'Unix (ms)', value: d.getTime().toString() });
    } else {
      const d = new Date(trimmed);
      if (isNaN(d.getTime())) { setError('Invalid date format'); return; }
      results.push({ label: 'Unix (seconds)', value: Math.floor(d.getTime() / 1000).toString() });
      results.push({ label: 'Unix (ms)', value: d.getTime().toString() });
      results.push({ label: 'ISO 8601', value: d.toISOString() });
      results.push({ label: 'UTC', value: d.toUTCString() });
    }

    setResults(results);
  }, [input]);

  const now = useCallback(() => {
    const d = new Date();
    setInput(Math.floor(d.getTime() / 1000).toString());
    convert();
  }, [convert]);

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Timestamp or Date</span>
        <button type="button" onClick={now} className="tb-v2-mode-tab" style={{ fontSize: 12 }}>Now</button>
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && convert()}
        placeholder="Unix timestamp (e.g. 1704067200) or date string..."
        className="tb-v2-tool-input"
        aria-label="Timestamp input"
      />
      <button type="button" onClick={convert} className="tb-v2-primary-btn" style={{ width: '100%', marginTop: 12, marginBottom: 12 }}>
        Convert
      </button>

      {error && <div style={{ color: 'var(--tb-accent)', fontSize: 13, marginBottom: 8 }}>{error}</div>}

      {results.length > 0 && (
        <div className="tb-v2-tool-output-head">
          <span className="tb-v2-tool-label">Results</span>
        </div>
      )}
      {results.length > 0 && (
        <div className="tb-v2-tool-output-body">
          {results.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 8, fontSize: 13 }}>
              <span style={{ minWidth: 100, color: 'var(--tb-text-secondary)' }}>{r.label}</span>
              <code style={{ fontFamily: 'var(--f-mono)', flex: 1 }}>{r.value}</code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
