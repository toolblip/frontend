'use client';

import { useState } from 'react';

export default function JsonToPythonClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const convert = (json: string) => {
    if (!json.trim()) {
      setOutput('');
      setError('');
      return;
    }
    try {
      const obj = JSON.parse(json);
      const python = jsonToPython(obj, 'data');
      setOutput(python);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
      setOutput('');
    }
  };

  const jsonToPython = (obj: unknown, varName: string, indent = 0): string => {
    const spaces = '    '.repeat(indent);

    if (obj === null) {
      return `${spaces}${varName} = None`;
    }

    if (typeof obj === 'boolean') {
      return `${spaces}${varName} = ${obj ? 'True' : 'False'}`;
    }

    if (typeof obj === 'number') {
      return `${spaces}${varName} = ${obj}`;
    }

    if (typeof obj === 'string') {
      const escaped = obj
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');
      return `${spaces}${varName} = "${escaped}"`;
    }

    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        return `${spaces}${varName} = []`;
      }
      const items = obj.map((item, i) => jsonToPython(item, `item_${i}`, indent + 1));
      let result = `${spaces}${varName} = [\n`;
      items.forEach((item, idx) => {
        const comma = idx < obj.length - 1 ? ',' : '';
        result += `${item}${comma}\n`;
      });
      result += `${spaces}]`;
      return result;
    }

    if (typeof obj === 'object') {
      const entries = Object.entries(obj as Record<string, unknown>);
      if (entries.length === 0) {
        return `${spaces}${varName} = {}`;
      }

      let result = `${spaces}${varName} = {\n`;
      entries.forEach(([key, value], idx) => {
        const safeKey = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key) ? key : `"${key}"`;
        const comma = idx < entries.length - 1 ? ',' : '';
        result += `${spaces}    ${safeKey}: ${jsonToPython(value, '', indent + 1).trim().replace(/^    /, '')}${comma}\n`;
      });
      result += `${spaces}}`;
      return result;
    }

    return `${spaces}${varName} = None`;
  };

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">JSON Input</span>
      </div>
      <textarea
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          convert(e.target.value);
        }}
        placeholder='{"key": "value", "number": 42, "array": [1, 2, 3]}'
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label="JSON input"
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Python Dict Output</span>
      </div>
      <div className="tb-v2-tool-output-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {error ? (
          <div style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</div>
        ) : (
          <pre className="tb-v2-hash-val" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {output || '—'}
          </pre>
        )}
        {output && (
          <button
            type="button"
            onClick={copy}
            className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
    </div>
  );
}
