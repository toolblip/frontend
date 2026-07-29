'use client';

import { useState, useCallback, useMemo } from 'react';
import ToolContextControls from '@/components/tools/ToolContextControls';
import { useToolContext } from '@/components/tools/useToolContext';

const EXAMPLES = [
  {
    label: 'Users',
    data: '[{"name": "John", "age": 30, "email": "john@example.com"}, {"name": "Jane", "age": 25, "email": "jane@example.com"}]',
  },
  {
    label: 'Products',
    data: '[{"id": 1, "name": "Laptop", "price": 999, "inStock": true}, {"id": 2, "name": "Phone", "price": 699, "inStock": false}]',
  },
  {
    label: 'Employees',
    data: '[{"name": "Alice", "department": "Engineering", "salary": 120000}, {"name": "Bob", "department": "Marketing", "salary": 85000}]',
  },
];

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

type JsonToCsvContext = { delimiter: string };

export default function JsonToCsvClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showExamples, setShowExamples] = useState(false);

  const toolContext = useToolContext<JsonToCsvContext>('json-to-csv');

  const convert = useCallback(() => {
    setError('');
    setOutput('');
    if (!input.trim()) return;
    try {
      setOutput(jsonToCsv(input));
    } catch (e) {
      setError('Invalid JSON. Ensure it is an array of objects: [{...}, {...}]');
    }
  }, [input]);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [output]);

  const download = useCallback(() => {
    const blob = new Blob([output], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [output]);

  const loadExample = (data: string) => {
    setInput(data);
    setOutput('');
    setError('');
    setShowExamples(false);
  };

  const rowCount = useMemo(() => {
    if (!output) return 0;
    return output.split('\n').length - 1;
  }, [output]);

  return (
    <div>
      <ToolContextControls
        isPaid={toolContext.isPaid}
        hasSaved={toolContext.hasSaved}
        description="delimiter"
        onSave={() => toolContext.save({ delimiter: ',' })}
        onClear={toolContext.clear}
      />

      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">JSON Input</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            onClick={() => setShowExamples(!showExamples)}
            className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm"
          >
            📋 Examples
          </button>
        </div>
      </div>

      {showExamples && (
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-3 border border-gray-200 dark:border-gray-700">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Load an example:</div>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.label}
                type="button"
                onClick={() => loadExample(ex.data)}
                className="px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='[{"name": "John", "age": 30}, {"name": "Jane", "age": 25}]'
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)', fontSize: 13 }}
        rows={6}
      />

      <button
        onClick={convert}
        className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg w-full"
      >
        Convert JSON → CSV
      </button>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {output && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">CSV Output ({rowCount} rows)</span>
            <div className="flex gap-2">
              <button onClick={download} className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm">
                ⬇️ Download
              </button>
              <button onClick={copy} className="tb-v2-copy-btn">
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          <div className="tb-v2-tool-output-body">
            <pre className="tb-v2-tool-pre text-sm">{output}</pre>
          </div>
        </>
      )}

      {!input && !output && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">📊</div>
          <p>Paste JSON array above to convert to CSV</p>
        </div>
      )}
    </div>
  );
}
