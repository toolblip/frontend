'use client';

import { useState } from 'react';

export default function CurlToPythonClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = () => {
    if (!input.trim()) { setOutput(''); return; }
    try {
      const lines: string[] = ['import requests', ''];
      const cmd = input.trim();

      const urlMatch = cmd.match(/curl\s+(?:[^'\s"]+|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")*\s*(-X|--request)?\s*(\S+)/);
      const url = urlMatch ? urlMatch[2].replace(/^['"]|['"]$/g, '') : 'https://example.com';
      lines.push(`url = "${url}"`);

      const headers: string[] = [];
      const headerMatches = cmd.matchAll(/-H\s+(?:'([^']+)'|"([^"]+)")/g);
      for (const m of headerMatches) {
        const h = (m[1] || m[2] || '');
        const colonIdx = h.indexOf(':');
        if (colonIdx > -1) {
          const key = h.slice(0, colonIdx).trim();
          const val = h.slice(colonIdx + 1).trim();
          headers.push(`    "${key}": "${val}"`);
        }
      }
      if (headers.length > 0) {
        lines.push('headers = {');
        lines.push(headers.join(',\n'));
        lines.push('}');
      }

      const dataMatch = cmd.match(/-d\s+(?:'([^']*)'|"([^"]*)"|(\S+))/);
      if (dataMatch) {
        const data = dataMatch[1] || dataMatch[2] || dataMatch[3] || '';
        lines.push(`data = ${data}`);
      }

      const methodMatch = cmd.match(/-X\s+(\w+)/);
      const method = methodMatch ? methodMatch[1].toUpperCase() : 'GET';
      lines.push('');
      lines.push(`response = requests.${method}(url` + (headers.length > 0 ? ', headers=headers' : '') + (dataMatch ? ', data=data' : '') + ')');
      lines.push('print(response.status_code)');
      lines.push('print(response.text)');

      setOutput(lines.join('\n'));
    } catch {
      setOutput('# Error converting curl command');
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={"curl -X POST https://api.example.com -H 'Content-Type: application/json' -d '{\"key\":\"value\"}'"}
        className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none resize-y"
        rows={5}
      />
      <button onClick={convert} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg transition-colors text-sm">
        Convert to Python
      </button>
      {output && (
        <div className="p-4 bg-gray-900 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg">
          <pre className="text-sm text-green-400 font-mono overflow-x-auto">{output}</pre>
        </div>
      )}
    </div>
  );
}
