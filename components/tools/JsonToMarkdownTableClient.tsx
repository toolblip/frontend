'use client';

import { useState } from 'react';

interface TableRow {
  [key: string]: string | number | boolean | null | undefined;
}

export default function JsonToMarkdownTableClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const convert = () => {
    setError('');
    try {
      const data = JSON.parse(input);
      const rows = Array.isArray(data) ? data : [data];
      
      if (rows.length === 0) {
        setOutput('');
        return;
      }

      const headers = Object.keys(rows[0]);
      
      // Build markdown table
      let markdown = `| ${headers.join(' | ')} |\n`;
      markdown += `| ${headers.map(() => '---').join(' | ')} |\n`;
      
      rows.forEach((row: TableRow) => {
        const values = headers.map(h => {
          const val = row[h];
          if (val === null || val === undefined) return '';
          return String(val);
        });
        markdown += `| ${values.join(' | ')} |\n`;
      });

      setOutput(markdown);
    } catch (e) {
      setError('Invalid JSON. Please provide valid JSON array or object.');
      setOutput('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <label className="tb-v2-tool-label" style={{marginBottom:8}}>
          JSON Input
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='[{"name": "John", "age": 30}, {"name": "Jane", "age": 25}]'
          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
        />
      </div>

      <button
        onClick={convert}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Convert to Markdown Table
      </button>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          {error}
        </div>
      )}

      {output && (
        <div className="flex-1">
          <label className="tb-v2-tool-label" style={{marginBottom:8}}>
            Markdown Table Output
          </label>
          <pre className="w-full h-48 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md overflow-auto font-mono text-sm">
            {output}
          </pre>
          <button
            onClick={() => navigator.clipboard.writeText(output)}
            className="mt-2 px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
}
