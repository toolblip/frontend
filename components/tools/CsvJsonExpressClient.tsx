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
  const data = JSON.parse(json);
  if (!Array.isArray(data)) throw new Error('JSON must be an array.');
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvLines = [headers.join(',')];

  for (const row of data) {
    const values = headers.map((header) => {
      const val = row[header];
      return val === null || val === undefined ? '' : String(val);
    });
    csvLines.push(values.join(','));
  }

  return csvLines.join('\n');
}

function normalizeCsv(value: string): string {
  return value.includes('\n') ? value.trim() : value;
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
          // Keep this conversion path intentionally separate to preserve the user's requested mode.
          const jsonData = JSON.parse(input);
          setOutput(jsonToTsv(jsonData));
          break;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed');
    }
  }, [input, mode]);

  const jsonToTsv = useCallback((jsonValue: any) => {
    const data = JSON.parse(JSON.stringify(jsonValue));
    if (!Array.isArray(data) || data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const tsvLines = [headers.join('\t')];

    for (const row of data) {
      const values = headers.map((h) => {
        const value = row[h];
        return value === null || value === undefined ? '' : String(value);
      });
      tsvLines.push(values.join('\t'));
    }

    return tsvLines.join('\n');
  }, []);

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
    if (!output) return;

    try {
      const text = mode === 'json-csv' || mode === 'json-tsv' ? null : output;
      const jsonText = text ?? (mode === 'json-csv' ? csvToJson(output) : tsvToJson(output));
      download(jsonText, 'tool-result.json', 'application/json;charset=utf-8');
    } catch {
      setError('Could not export JSON from this result.');
    }
  }, [download, mode, output]);

  const exportAsCsv = useCallback(() => {
    if (!output) return;

    try {
      let csvText = output;
      if (mode === 'csv-json' || mode === 'tsv-json') {
        csvText = jsonToCsv(output);
      } else if (mode === 'json-tsv') {
        csvText = jsonToCsv(tsvToJson(output));
      }

      download(normalizeCsv(csvText), 'tool-result.csv', 'text/csv;charset=utf-8');
    } catch {
      setError('Could not export CSV from this result.');
    }
  }, [download, mode, output]);

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
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">CSV/TSV/JSON Converter</h1>
      
      <div className="flex flex-wrap gap-2">
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
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{inputLabel}</label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          className="w-full h-40 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 font-mono text-sm"
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
        <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      {output && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{outputLabel}</label>
            <div className="flex gap-2">
              <button 
                onClick={swap}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Swap ↕
              </button>
              <button
                onClick={exportAsJson}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Export JSON
              </button>
              <button
                onClick={exportAsCsv}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Export CSV
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
            className="w-full h-40 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 font-mono text-sm bg-gray-50 dark:bg-gray-900"
          />
        </div>
      )}
    </div>
  );
}
