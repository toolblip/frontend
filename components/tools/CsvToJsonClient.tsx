'use client';

import { useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE = `name,age,city
John,30,NYC
Jane,25,LA`;

function csvToJson(csv: string): string {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return '[]';

  const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
  const data: Record<string, string | number>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
    const row: Record<string, string | number> = {};
    headers.forEach((header, index) => {
      const value = values[index] || '';
      row[header] = isNaN(Number(value)) ? value : Number(value);
    });
    data.push(row);
  }

  return JSON.stringify(data, null, 2);
}

function convert(input: string): { result: string; error: string } {
  if (!input.trim()) return { result: '', error: '' };
  try {
    return { result: csvToJson(input), error: '' };
  } catch {
    return {
      result: '',
      error: 'Invalid CSV format. Ensure you have headers and rows separated by commas.',
    };
  }
}

export default function CsvToJsonClient() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const { result, error } = useMemo(() => convert(input), [input]);

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const swap = () => {
    if (!result) return;
    setInput(result);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">CSV Input</span>
        <ToolExampleClearActions
          onExample={() => setInput(EXAMPLE)}
          onClear={() => setInput('')}
          canClear={input.length > 0}
        />
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={"name,age,city\nJohn,30,NYC\nJane,25,LA"}
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label="CSV input"
      />

      {result ? (
        <div
          style={{
            display: 'flex',
            gap: 8,
            padding: '8px 20px',
            borderTop: '1px solid var(--line)',
          }}
        >
          <button type="button" onClick={swap} className="tb-v2-mode-tab">
            Use output as input ↕
          </button>
        </div>
      ) : null}

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">JSON Output</span>
        {result ? (
          <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        ) : null}
      </div>
      <div className="tb-v2-tool-output-body">
        {error ? (
          <p className="tb-v2-error" role="alert">
            {error}
          </p>
        ) : (
          <pre className="tb-v2-tool-pre">{result || ' - '}</pre>
        )}
      </div>
    </div>
  );
}
