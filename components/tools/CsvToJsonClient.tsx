'use client';

import { useState, useCallback } from 'react';

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

export default function CsvToJsonClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const convert = useCallback(() => {
    setError('');
    setOutput('');
    if (!input.trim()) return;
    try {
      setOutput(csvToJson(input));
    } catch {
      setError('Invalid CSV format. Ensure you have headers and rows separated by commas.');
    }
  }, [input]);

  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
  }, []);

  const swap = useCallback(() => {
    setInput(output);
    setOutput('');
    setError('');
  }, [output]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">CSV Input</label>
          {output && (
            <button onClick={swap} className="text-xs text-red-600 dark:text-red-400 hover:underline">
              Use output as input ↕
            </button>
          )}
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="name,age,city&#10;John,30,NYC&#10;Jane,25,LA"
          className="w-full h-40 px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-mono text-sm placeholder-gray-400 focus:outline-none focus:border-red-500 resize-y"
        />
      </div>

      <button
        onClick={convert}
        className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 font-medium transition-colors"
      >
        Convert CSV → JSON
      </button>

      {error && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {output && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">JSON Output</label>
            <button onClick={() => copy(output)} className="text-xs text-red-600 dark:text-red-400 hover:underline">
              Copy
            </button>
          </div>
          <pre className="w-full h-60 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-mono text-sm overflow-auto">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
