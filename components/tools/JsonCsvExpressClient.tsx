'use client';

import { useState, useCallback } from 'react';

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

export default function JsonCsvExpressClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const convert = useCallback(() => {
    setError('');
    setOutput('');
    if (!input.trim()) return;

    try {
      setOutput(jsonToCsv(input));
    } catch {
      setError('Invalid JSON. Ensure it is an array of objects: [{...}, {...}]');
    }
  }, [input]);

  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  const download = useCallback((text: string, filename: string, type: string) => {
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  const exportAsJson = useCallback(() => {
    if (!input) return;

    try {
      const pretty = JSON.stringify(JSON.parse(input), null, 2);
      download(pretty, 'tool-result.json', 'application/json;charset=utf-8');
    } catch {
      download(input, 'tool-result.json', 'application/json;charset=utf-8');
    }
  }, [download, input]);

  const exportAsCsv = useCallback(() => {
    if (!output) return;
    download(output, 'tool-result.csv', 'text/csv;charset=utf-8');
  }, [download, output]);

  const swap = useCallback(() => {
    setInput(output);
    setOutput('');
    setError('');
  }, [output]);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">JSON → CSV</h1>

      <div className="space-y-2">
        <label className="text-sm text-gray-700 dark:text-gray-300 font-medium">JSON Input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-40 p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl font-mono text-sm text-gray-900 dark:text-white"
          placeholder='[{"name":"John","age":30},{"name":"Jane","age":25}]'
        />
      </div>

      <button
        onClick={convert}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
      >
        Convert JSON → CSV
      </button>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      {output && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">CSV Output</label>
            <div className="flex gap-2 items-center">
              <button
                onClick={exportAsJson}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Export JSON
              </button>
              <button
                onClick={exportAsCsv}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Export CSV
              </button>
              <button
                onClick={swap}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Swap ↕
              </button>
              <button
                onClick={() => copy(output)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Copy
              </button>
            </div>
          </div>
          <pre className="w-full h-40 p-4 border rounded-lg dark:bg-gray-800 dark:border-gray-700 font-mono text-sm bg-gray-50 dark:bg-gray-900 overflow-auto">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
