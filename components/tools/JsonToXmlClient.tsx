'use client';

import { useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE = `{
  "name": "Ada",
  "age": 36,
  "city": "London"
}`;

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function jsonToXml(obj: unknown, root: string, indent = 0): string {
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
}

function convert(json: string, rootElement: string): { result: string; error: string } {
  if (!json.trim()) return { result: '', error: '' };
  try {
    const obj = JSON.parse(json);
    return { result: jsonToXml(obj, rootElement), error: '' };
  } catch (e) {
    return { result: '', error: e instanceof Error ? e.message : 'Invalid JSON' };
  }
}

export default function JsonToXmlClient() {
  const [input, setInput] = useState('');
  const [rootElement, setRootElement] = useState('root');
  const [copied, setCopied] = useState(false);

  const { result, error } = useMemo(
    () => convert(input, rootElement || 'root'),
    [input, rootElement],
  );

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">JSON Input</span>
        <ToolExampleClearActions
          onExample={() => setInput(EXAMPLE)}
          onClear={() => setInput('')}
          canClear={input.length > 0}
        />
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='{"key": "value"}'
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label="JSON input"
      />

      <div
        style={{
          display: 'flex',
          gap: 12,
          padding: '12px 20px',
          flexWrap: 'wrap',
          alignItems: 'center',
          borderTop: '1px solid var(--line)',
        }}
      >
        <label style={{ fontSize: 13, color: 'var(--tb-text-secondary)' }} htmlFor="json-to-xml-root">
          Root element
        </label>
        <input
          id="json-to-xml-root"
          type="text"
          value={rootElement}
          onChange={(e) => setRootElement(e.target.value || 'root')}
          className="tb-v2-mode-tab"
          style={{ padding: '0.25rem 0.5rem', minWidth: 80 }}
          aria-label="Root element name"
        />
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">XML Output</span>
        {result ? (
          <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        ) : null}
      </div>
      <div className="tb-v2-tool-output-body">
        {error ? (
          <p className="tb-v2-error" role="alert">
            {error}
          </p>
        ) : (
          <pre className="tb-v2-tool-pre">{result || ' - '}</pre>
        )}
      </div>
    </div>
  );
}
