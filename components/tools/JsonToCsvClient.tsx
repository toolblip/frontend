'use client';

import { useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';
import ToolContextControls from '@/components/tools/ToolContextControls';
import { useToolContext } from '@/components/tools/useToolContext';

const EXAMPLE = `[{"name": "John", "age": 30, "email": "john@example.com"}, {"name": "Jane", "age": 25, "email": "jane@example.com"}]`;

function jsonToCsv(json: string): string {
  const data = JSON.parse(json);
  if (!Array.isArray(data)) throw new Error('JSON must be an array of objects');
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];

  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      const stringValue = String(value ?? '');
      return stringValue.includes(',') || stringValue.includes('"')
        ? `"${stringValue.replace(/"/g, '""')}"`
        : stringValue;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

function convert(input: string): { result: string; error: string } {
  if (!input.trim()) return { result: '', error: '' };
  try {
    return { result: jsonToCsv(input), error: '' };
  } catch {
    return {
      result: '',
      error: 'Invalid JSON. Ensure it is an array of objects: [{...}, {...}]',
    };
  }
}

type JsonToCsvContext = { delimiter: string };

export default function JsonToCsvClient() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const toolContext = useToolContext<JsonToCsvContext>('json-to-csv');

  const { result, error } = useMemo(() => convert(input), [input]);

  const rowCount = useMemo(() => {
    if (!result) return 0;
    return result.split('\n').length - 1;
  }, [result]);

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const download = () => {
    if (!result) return;
    const blob = new Blob([result], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tb-v2-tool-card">
      <ToolContextControls
        isPaid={toolContext.isPaid}
        hasSaved={toolContext.hasSaved}
        description="delimiter"
        onSave={() => toolContext.save({ delimiter: ',' })}
        onClear={toolContext.clear}
      />

      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">JSON Input</span>
        <ToolExampleClearActions
          onExample={() => setInput(EXAMPLE)}
          onClear={() => setInput('')}
          canClear={input.length > 0}
        />
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='[{"name": "John", "age": 30}, {"name": "Jane", "age": 25}]'
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)', fontSize: 13 }}
        rows={6}
        aria-label="JSON input"
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">
          CSV Output{result ? ` (${rowCount} rows)` : ''}
        </span>
        {result ? (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button type="button" onClick={download} className="tb-v2-mode-tab">
              Download
            </button>
            <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
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
