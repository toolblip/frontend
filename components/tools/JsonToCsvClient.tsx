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

export default function JsonToCsvClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

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

  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
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
    if (!output) return;

    let jsonText = input;
    try {
      const parsed = JSON.parse(input);
      jsonText = JSON.stringify(parsed, null, 2);
    } catch {
      // fallback to raw input if the JSON parser unexpectedly fails
    }

    download(jsonText, 'tool-result.json', 'application/json;charset=utf-8');
  }, [download, input, output]);

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
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">JSON Input</label>
          {output && (
            <button onClick={swap} className="text-xs text-red-600 dark:text-red-400 hover:underline">
              Use output as input ↕
            </button>
          )}
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='[{"name":"John","age":30},{"name":"Jane","age":25}]'
          className="w-full h-40 px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-mono text-sm placeholder-gray-400 focus:outline-none focus:border-red-500 resize-y"
        />
      </div>

      <button
        onClick={convert}
        className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 font-medium transition-colors"
      >
        Convert JSON → CSV
      </button>

      {error && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {output && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">CSV Output</label>
            <div className="flex items-center gap-3">
              <button
                onClick={exportAsJson}
                className="text-xs text-red-600 dark:text-red-400 hover:underline"
              >
                Export JSON
              </button>
              <button
                onClick={exportAsCsv}
                className="text-xs text-red-600 dark:text-red-400 hover:underline"
              >
                Export CSV
              </button>
              <button onClick={() => copy(output)} className="text-xs text-red-600 dark:text-red-400 hover:underline">
                Copy
              </button>
            </div>
          </div>
          <pre className="w-full h-40 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-mono text-sm overflow-auto">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
