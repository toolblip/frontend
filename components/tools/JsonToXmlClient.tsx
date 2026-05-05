'use client';

import { useState } from 'react';

export default function JsonToXmlClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [rootElement, setRootElement] = useState('root');

  const convert = (json: string) => {
    if (!json.trim()) {
      setOutput('');
      setError('');
      return;
    }
    try {
      const obj = JSON.parse(json);
      const xml = jsonToXml(obj, rootElement);
      setOutput(xml);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
      setOutput('');
    }
  };

  const escapeXml = (str: string): string => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  const jsonToXml = (obj: unknown, root: string, indent = 0): string => {
    const spaces = '  '.repeat(indent);
    const spacesChild = '  '.repeat(indent + 1);

    if (obj === null || obj === undefined) {
      return `${spaces}<${root}/>`;
    }

    if (typeof obj === 'boolean' || typeof obj === 'number') {
      return `${spaces}<${root}>${obj}</${root}>`;
    }

    if (typeof obj === 'string') {
      return `${spaces}<${root}>${escapeXml(obj)}</${root}>`;
    }

    if (Array.isArray(obj)) {
      return obj
        .map((item) => {
          const itemName = root.endsWith('s') ? root.slice(0, -1) : 'item';
          return `${spaces}<${itemName}>\n${jsonToXml(item, itemName, indent + 1)}\n${spaces}</${itemName}>`;
        })
        .join('\n');
    }

    if (typeof obj === 'object') {
      const entries = Object.entries(obj as Record<string, unknown>);
      if (entries.length === 0) {
        return `${spaces}<${root}/>`;
      }

      let xml = `${spaces}<${root}`;
      const childEntries: [string, unknown][] = [];
      const attrEntries: [string, unknown][] = [];

      entries.forEach(([key, value]) => {
        if (key.startsWith('@')) {
          attrEntries.push([key.slice(1), value]);
        } else {
          childEntries.push([key, value]);
        }
      });

      attrEntries.forEach(([key, value]) => {
        xml += ` ${key}="${escapeXml(String(value))}"`;
      });

      if (childEntries.length === 0) {
        return xml + '/>';
      }

      xml += '>\n';
      childEntries.forEach(([key, value]) => {
        xml += `${spacesChild}<${key}>${jsonToXml(value, key, indent + 1).trim()}</${key}>\n`;
      });
      xml += `${spaces}</${root}>`;
      return xml;
    }

    return `${spaces}<${root}/>`;
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
        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Root element:</span>
        <input
          type="text"
          value={rootElement}
          onChange={(e) => {
            setRootElement(e.target.value || 'root');
            convert(input);
          }}
          className="tb-v2-mode-tab"
          style={{ padding: '0.25rem 0.5rem', minWidth: 80 }}
          aria-label="Root element name"
        />
      </div>
      <textarea
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          convert(e.target.value);
        }}
        placeholder='{"key": "value"}'
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label="JSON input"
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">XML Output</span>
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
