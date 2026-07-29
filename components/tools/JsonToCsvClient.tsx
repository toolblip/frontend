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

  const swap = useCallback(() => {
    setInput(output);
    setOutput('');
    setError('');
  }, [output]);

  return (
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:20,padding:"20px"}}>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="tb-v2-tool-label">JSON Input</label>
          {output && (
            <button onClick={swap} className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm" style={{color:"var(--red)",fontSize:12}}>
              Use output as input ↕
            </button>
          )}
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='[{"name":"John","age":30},{"name":"Jane","age":25}]'
          className="tb-v2-tool-textarea"
        />
      </div>

      <button
        onClick={convert}
        className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg"
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
            <label className="tb-v2-tool-label">CSV Output</label>
            <button onClick={() => copy(output)} className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm" style={{color:"var(--red)",fontSize:12}}>
              Copy
            </button>
          </div>
          <pre className="w-full h-40 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-mono text-sm overflow-auto">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
