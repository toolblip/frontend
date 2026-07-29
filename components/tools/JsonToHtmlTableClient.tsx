'use client';

import { useState } from 'react';

export default function JsonToHtmlTableClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const transform = () => {
    try {
      const data = JSON.parse(input);
      const arr = Array.isArray(data) ? data : [data];
      if (arr.length === 0) { setOutput('No data'); return; }

      const keys = Object.keys(arr[0]);
      let html = '<table>\n<thead>\n<tr>';
      for (const k of keys) html += `<th>${k}</th>`;
      html += '</tr>\n</thead>\n<tbody>\n';
      for (const row of arr) {
        html += '<tr>';
        for (const k of keys) html += `<td>${row[k] ?? ''}</td>`;
        html += '</tr>\n';
      }
      html += '</tbody>\n</table>';
      setOutput(html);
    } catch {
      setOutput('Invalid JSON');
    }
  };

  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder='[{"name":"Alice","age":30},{"name":"Bob","age":25}]'
        rows={6}
        className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-sm font-mono focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-y"
      />
      <button
        onClick={transform}
        className="w-full bg-red-600 hover:bg-red-500 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
      >
        Convert to HTML Table
      </button>
      {output && (
        <div className="relative">
          <pre className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-3 text-sm font-mono whitespace-pre-wrap break-all">{output}</pre>
          <button
            onClick={copy}
            className="absolute top-2 right-2 px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  );
}
