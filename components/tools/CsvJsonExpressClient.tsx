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

function tsvToJson(tsv: string): string {
  const lines = tsv.trim().split('\n');
  if (lines.length < 2) return '[]';
  
  const headers = lines[0].split('\t').map(h => h.trim());
  const data: Record<string, string | number>[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split('\t').map(v => v.trim());
    const row: Record<string, string | number> = {};
    headers.forEach((header, index) => {
      const value = values[index] || '';
      row[header] = isNaN(Number(value)) ? value : Number(value);
    });
    data.push(row);
  }
  
  return JSON.stringify(data, null, 2);
}

function jsonToCsv(json: string): string {
  try {
    const data = JSON.parse(json);
    if (!Array.isArray(data) || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvLines = [headers.join(',')];
    
    for (const row of data) {
      const values = headers.map(h => {
        const val = row[h];
        if (val === null || val === undefined) return '';
        const str = String(val);
        return str.includes(',') || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str;
      });
      csvLines.push(values.join(','));
    }
    
    return csvLines.join('\n');
  } catch {
    throw new Error('Invalid JSON. Provide a JSON array.');
  }
}

function jsonToTsv(json: string): string {
  try {
    const data = JSON.parse(json);
    if (!Array.isArray(data) || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const tsvLines = [headers.join('\t')];
    
    for (const row of data) {
      const values = headers.map(h => {
        const val = row[h];
        return val === null || val === undefined ? '' : String(val);
      });
      tsvLines.push(values.join('\t'));
    }
    
    return tsvLines.join('\n');
  } catch {
    throw new Error('Invalid JSON. Provide a JSON array.');
  }
}

type Mode = 'csv-json' | 'tsv-json' | 'json-csv' | 'json-tsv';

export default function CsvJsonExpressClient() {
  const [mode, setMode] = useState<Mode>('csv-json');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const process = useCallback(() => {
    setError('');
    setOutput('');
    if (!input.trim()) return;
    
    try {
      switch (mode) {
        case 'csv-json':
          setOutput(csvToJson(input));
          break;
        case 'tsv-json':
          setOutput(tsvToJson(input));
          break;
        case 'json-csv':
          setOutput(jsonToCsv(input));
          break;
        case 'json-tsv':
          setOutput(jsonToTsv(input));
          break;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed');
    }
  }, [input, mode]);

  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  const swap = useCallback(() => {
    const newMode = mode.includes('json') 
      ? (mode === 'json-csv' ? 'csv-json' : 'tsv-json')
      : (mode === 'csv-json' ? 'json-csv' : 'json-tsv');
    setMode(newMode);
    setInput(output);
    setOutput('');
    setError('');
  }, [mode, output]);

  const inputPlaceholder = mode === 'csv-json' || mode === 'tsv-json'
    ? 'Paste CSV or TSV data here...'
    : 'Paste JSON array here...';

  const inputLabel = mode === 'csv-json' || mode === 'tsv-json' ? 'Input Data' : 'JSON Input';
  const outputLabel = mode === 'csv-json' || mode === 'tsv-json' ? 'JSON Output' : 'Output Data';

  return (
    <div className="tb-v2-tool-card">
      <h1 className="text-2xl font-bold">CSV/TSV/JSON Converter</h1>
      
      <div className="tb-v2-mode-tabs">
        <button
          onClick={() => setMode('csv-json')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'csv-json' 
              ? 'bg-indigo-500 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          CSV → JSON
        </button>
        <button
          onClick={() => setMode('tsv-json')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'tsv-json' 
              ? 'bg-indigo-500 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          TSV → JSON
        </button>
        <button
          onClick={() => setMode('json-csv')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'json-csv' 
              ? 'bg-indigo-500 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          JSON → CSV
        </button>
        <button
          onClick={() => setMode('json-tsv')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'json-tsv' 
              ? 'bg-indigo-500 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          JSON → TSV
        </button>
      </div>

      <div className="space-y-2">
        <label className="tb-v2-tool-label">{inputLabel}</label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          className="tb-v2-input"
          placeholder={inputPlaceholder}
        />
      </div>

      <button
        onClick={process}
        className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 font-medium"
      >
        Convert
      </button>

      {error && (
        <div className="tb-v2-banner tb-v2-banner-err">
          {error}
        </div>
      )}

      {output && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="tb-v2-tool-label">{outputLabel}</label>
            <div className="tb-v2-mode-tabs">
              <button 
                onClick={swap}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Swap ↕
              </button>
              <button 
                onClick={() => copy(output)}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Copy
              </button>
            </div>
          </div>
          <textarea
            value={output}
            readOnly
            className="tb-v2-input"
          />
        </div>
      )}
    </div>
  );
}