'use client';

import { useState, useCallback } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE_TS = '1704067200';

function runConvert(raw: string): { results: { label: string; value: string }[]; error: string } {
  const trimmed = raw.trim();
  if (!trimmed) return { results: [], error: 'Please enter a timestamp or date' };

  const isNumeric = /^\d+$/.test(trimmed);
  const results: { label: string; value: string }[] = [];

  if (isNumeric) {
    const ts = parseInt(trimmed);
    const d = new Date(ts < 1e12 ? ts * 1000 : ts);
    if (isNaN(d.getTime())) return { results: [], error: 'Invalid timestamp' };
    results.push({ label: 'Date (local)', value: d.toLocaleString() });
    results.push({ label: 'UTC', value: d.toUTCString() });
    results.push({ label: 'ISO 8601', value: d.toISOString() });
    results.push({ label: 'Unix (seconds)', value: Math.floor(d.getTime() / 1000).toString() });
    results.push({ label: 'Unix (ms)', value: d.getTime().toString() });
  } else {
    const d = new Date(trimmed);
    if (isNaN(d.getTime())) return { results: [], error: 'Invalid date format' };
    results.push({ label: 'Unix (seconds)', value: Math.floor(d.getTime() / 1000).toString() });
    results.push({ label: 'Unix (ms)', value: d.getTime().toString() });
    results.push({ label: 'ISO 8601', value: d.toISOString() });
    results.push({ label: 'UTC', value: d.toUTCString() });
  }

  return { results, error: '' };
}

export default function TimestampConverterClient() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<{ label: string; value: string }[]>([]);
  const [error, setError] = useState('');

  const convert = useCallback((value?: string) => {
    const { results: next, error: err } = runConvert(value ?? input);
    setError(err);
    setResults(next);
  }, [input]);

  const loadExample = useCallback(() => {
    setInput(EXAMPLE_TS);
    const { results: next, error: err } = runConvert(EXAMPLE_TS);
    setError(err);
    setResults(next);
  }, []);

  const clearAll = useCallback(() => {
    setInput('');
    setResults([]);
    setError('');
  }, []);

  const useNow = useCallback(() => {
    const ts = Math.floor(Date.now() / 1000).toString();
    setInput(ts);
    const { results: next, error: err } = runConvert(ts);
    setError(err);
    setResults(next);
  }, []);

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Timestamp or Date</span>
        <ToolExampleClearActions
          exampleCount={1}
          onExample={loadExample}
          onClear={clearAll}
          canClear={input.length > 0 || results.length > 0}
        />
      </div>
      <div style={{ padding: '0 20px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && convert()}
          placeholder="Unix timestamp (e.g. 1704067200) or date string..."
          className="tb-v2-tool-input"
          aria-label="Timestamp input"
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 12, marginBottom: 12 }}>
          <button type="button" onClick={() => convert()} className="tb-v2-primary-btn" style={{ flex: 1 }}>
            Convert
          </button>
          <button type="button" onClick={useNow} className="tb-v2-mode-tab">
            Now
          </button>
        </div>

        {error && <div style={{ color: 'var(--tb-accent)', fontSize: 13, marginBottom: 8 }}>{error}</div>}

        {!results.length && !error && (
          <p className="tb-v2-empty" style={{ marginBottom: 12 }}>
            Enter a timestamp or date, or use Example.
          </p>
        )}
      </div>

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
