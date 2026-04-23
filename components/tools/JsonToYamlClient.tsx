'use client';

import { useState } from 'react';

export default function JsonToYamlClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [indent, setIndent] = useState(2);

  function toYaml(obj: unknown, depth = 0, indentSize = 2): string {
    const pad = ' '.repeat(depth * indentSize);
    if (obj === null) return 'null';
    if (obj === undefined) return '';
    if (typeof obj === 'string') return obj.includes(':') || obj.includes('#') || obj.includes("'") || obj.includes('"') || obj.includes('\n') ? `"${obj.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"` : obj;
    if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj);
    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]';
      return obj.map(item => {
        const val = toYaml(item, depth + 1, indentSize);
        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
          const lines = val.split('\n');
          return `${pad}- ${lines[0]}\n${lines.slice(1).join('\n')}`;
        }
        return `${pad}- ${val}`;
      }).join('\n');
    }
    const entries = Object.entries(obj as Record<string, unknown>);
    if (entries.length === 0) return '{}';
    return entries.map(([key, value]) => {
      const val = toYaml(value, depth + 1, indentSize);
      if (typeof value === 'object' && value !== null) {
        return `${pad}${key}:\n${val}`;
      }
      return `${pad}${key}: ${val}`;
    }).join('\n');
  }

  const convert = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      setOutput(toYaml(parsed, 0, indent));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
      setOutput('');
    }
  };

  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-sm text-gray-600 dark:text-gray-400">Indent:</label>
        <select value={indent} onChange={e => setIndent(Number(e.target.value))} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-sm">
          <option value={2}>2 spaces</option>
          <option value={4}>4 spaces</option>
        </select>
      </div>
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder='Paste JSON here...' rows={8} className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-sm font-mono focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-y" />
      <button onClick={convert} className="w-full bg-red-600 hover:bg-red-500 text-white font-medium py-2.5 rounded-lg transition-colors text-sm">
        Convert to YAML
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {output && (
        <div className="relative">
          <pre className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-3 text-sm font-mono whitespace-pre-wrap break-all">{output}</pre>
          <button onClick={copy} className="absolute top-2 right-2 px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors">
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  );
}
