'use client';

import React, { useState } from 'react';

export default function TsvToJsonClient() {
  const [tsvInput, setTsvInput] = useState<string>('');
  const [jsonOutput, setJsonOutput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [useHeaders, setUseHeaders] = useState<boolean>(true);
  const [compact, setCompact] = useState<boolean>(false);

  const parseTsv = () => {
    if (!tsvInput.trim()) {
      setJsonOutput('');
      setError('');
      return;
    }

    try {
      const lines = tsvInput.trim().split('\n');
      
      if (lines.length === 0) {
        setError('No data to parse');
        setJsonOutput('');
        return;
      }

      let headers: string[];
      let dataLines: string[];

      if (useHeaders) {
        headers = lines[0].split('\t').map((h) => h.trim());
        dataLines = lines.slice(1);
      } else {
        // Generate column names
        const firstLine = lines[0].split('\t');
        headers = firstLine.map((_, i) => `column${i + 1}`);
        dataLines = lines;
      }

      if (headers.length === 0 || headers.every((h) => !h)) {
        setError('No valid headers found');
        setJsonOutput('');
        return;
      }

      const jsonArray = dataLines
        .filter((line) => line.trim())
        .map((line) => {
          const values = line.split('\t');
          const obj: Record<string, string> = {};
          headers.forEach((header, index) => {
            obj[header] = values[index]?.trim() || '';
          });
          return obj;
        });

      const jsonString = compact
        ? JSON.stringify(jsonArray)
        : JSON.stringify(jsonArray, null, 2);

      setJsonOutput(jsonString);
      setError('');
    } catch (err) {
      setError(`Parse error: ${err instanceof Error ? err.message : 'Invalid TSV format'}`);
      setJsonOutput('');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonOutput);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadJson = () => {
    const blob = new Blob([jsonOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const sampleTsv = `name\tage\tcity\tcountry
John Smith\t28\tNew York\tUSA
Sarah Johnson\t34\tLos Angeles\tUSA
Michael Chen\t42\tToronto\tCanada
Emma Wilson\t25\tLondon\tUK
David Brown\t31\tSydney\tAustralia`;

  const loadSample = () => {
    setTsvInput(sampleTsv);
  };

  const clearAll = () => {
    setTsvInput('');
    setJsonOutput('');
    setError('');
  };

  return (
    <div className="tb-v2-card">
      <div className="tb-v2-card-header">
        <h2 className="tb-v2-card-title">TSV to JSON Converter</h2>
        <p className="tb-v2-card-description">
          Parse tab-separated values (TSV) and convert to JSON array format
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="tb-v2-form-group">
          <div className="flex justify-between items-center mb-2">
            <label className="tb-v2-label mb-0">TSV Input</label>
            <div className="tb-v2-mode-tabs">
              <button
                onClick={loadSample}
                className="tb-v2-button tb-v2-button-secondary text-xs py-1 px-2"
              >
                Load Sample
              </button>
              <button
                onClick={clearAll}
                className="tb-v2-button tb-v2-button-secondary text-xs py-1 px-2 text-red-600"
              >
                Clear
              </button>
            </div>
          </div>
          <textarea
            value={tsvInput}
            onChange={(e) => setTsvInput(e.target.value)}
            className="tb-v2-input font-mono text-sm h-64 resize-none"
            placeholder="Paste your TSV data here...&#10;&#10;name	age	city&#10;John	30	NYC&#10;Jane	25	LA"
          />
        </div>

        <div className="tb-v2-form-group">
          <div className="flex justify-between items-center mb-2">
            <label className="tb-v2-label mb-0">JSON Output</label>
            <div className="tb-v2-mode-tabs">
              <button
                onClick={copyToClipboard}
                className="tb-v2-button tb-v2-button-secondary text-xs py-1 px-2"
                disabled={!jsonOutput}
              >
                Copy
              </button>
              <button
                onClick={downloadJson}
                className="tb-v2-button tb-v2-button-secondary text-xs py-1 px-2"
                disabled={!jsonOutput}
              >
                Download
              </button>
            </div>
          </div>
          <textarea
            value={jsonOutput}
            readOnly
            className="tb-v2-input font-mono text-sm h-64 resize-none bg-gray-50"
            placeholder="JSON output will appear here..."
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <div className="tb-v2-form-group flex items-center gap-2">
          <input
            type="checkbox"
            id="useHeaders"
            checked={useHeaders}
            onChange={(e) => setUseHeaders(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="useHeaders" className="text-sm cursor-pointer">
            First row as headers
          </label>
        </div>

        <div className="tb-v2-form-group flex items-center gap-2">
          <input
            type="checkbox"
            id="compact"
            checked={compact}
            onChange={(e) => setCompact(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="compact" className="text-sm cursor-pointer">
            Compact output
          </label>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={parseTsv} className="tb-v2-button tb-v2-button-primary flex-1">
          Convert TSV to JSON
        </button>
      </div>

      {error && (
        <div className="tb-v2-card p-4 bg-red-50 border-red-200 mb-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {jsonOutput && !error && (
        <div className="tb-v2-card p-4 bg-green-50 border-green-200 mb-4">
          <p className="text-green-600 text-sm">
            Successfully converted {tsvInput.trim().split('\n').length - (useHeaders ? 1 : 0)} rows to JSON
          </p>
        </div>
      )}

      <div className="tb-v2-form-group">
        <div className="tb-v2-label">Format Guide</div>
        <div className="tb-v2-card p-4 text-sm space-y-2">
          <p>
            <strong>TSV (Tab-Separated Values)</strong> uses tab characters to separate fields and newlines to separate records.
          </p>
          <p>
            <strong>With headers:</strong> First line is treated as column names, each row becomes an object with named properties.
          </p>
          <p>
            <strong>Without headers:</strong> Column names are auto-generated as column1, column2, etc.
          </p>
          <div className="mt-3">
            <p className="font-semibold mb-2">Example:</p>
            <div className="tb-v2-grid-2">
              <div>
                <p className="text-xs text-gray-500 mb-1">TSV Input:</p>
                <pre className="bg-gray-100 p-2 rounded text-xs font-mono overflow-x-auto">
name	age	city
John	30	NYC
Jane	25	LA
                </pre>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">JSON Output:</p>
                <pre className="bg-gray-100 p-2 rounded text-xs font-mono overflow-x-auto">
{`[
  {
    "name": "John",
    "age": "30",
    "city": "NYC"
  },
  {
    "name": "Jane",
    "age": "25",
    "city": "LA"
  }
]`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tb-v2-form-group">
        <div className="tb-v2-label">Tips</div>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Use tabs (\t) as separators, not spaces</li>
          <li>• Make sure each row has the same number of tabs/columns</li>
          <li>• Empty cells will be converted to empty strings</li>
          <li>• All values are converted to strings in the JSON output</li>
        </ul>
      </div>
    </div>
  );
}
