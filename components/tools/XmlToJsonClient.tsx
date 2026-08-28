'use client';

import { useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

type Mode = 'x2j' | 'j2x';

const EXAMPLE_XML = `<person name="Ada">
  <age>36</age>
  <city>London</city>
</person>`;

const EXAMPLE_JSON = `{
  "name": "Ada",
  "age": 36,
  "city": "London"
}`;

function xmlToJson(node: Element): unknown {
  const obj: Record<string, unknown> = {};

  if (node.attributes) {
    for (let i = 0; i < node.attributes.length; i++) {
      const attr = node.attributes[i];
      if (attr.name.startsWith('xmlns')) continue;
      obj[`@${attr.name}`] = attr.value;
    }
  }

  const children = Array.from(node.childNodes).filter(
    (n) => n.nodeType === Node.ELEMENT_NODE || n.nodeType === Node.TEXT_NODE,
  );

  if (children.length === 0) {
    const text = node.textContent?.trim() ?? '';
    return text || null;
  }

  children.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent?.trim() ?? '';
      if (text) obj['#text'] = text;
    } else {
      const childElement = child as Element;
      const childName = childElement.nodeName;
      const childValue = xmlToJson(childElement);

      if (obj[childName]) {
        if (!Array.isArray(obj[childName])) {
          obj[childName] = [obj[childName]];
        }
        (obj[childName] as unknown[]).push(childValue);
      } else {
        obj[childName] = childValue;
      }
    }
  });

  return obj;
}

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

  if (obj === null || obj === undefined) return `${spaces}<${root}/>`;
  if (typeof obj === 'boolean' || typeof obj === 'number') return `${spaces}<${root}>${obj}</${root}>`;
  if (typeof obj === 'string') return `${spaces}<${root}>${escapeXml(obj)}</${root}>`;

  if (Array.isArray(obj)) {
    return obj
      .map((item) => {
        const itemName = root.endsWith('s') ? root.slice(0, -1) : 'item';
        return jsonToXml(item, itemName, indent);
      })
      .join('\n');
  }

  if (typeof obj === 'object') {
    const entries = Object.entries(obj as Record<string, unknown>);
    if (entries.length === 0) return `${spaces}<${root}/>`;

    let xml = `${spaces}<${root}`;
    const childEntries: [string, unknown][] = [];
    const attrEntries: [string, unknown][] = [];

    entries.forEach(([key, value]) => {
      if (key.startsWith('@')) attrEntries.push([key.slice(1), value]);
      else childEntries.push([key, value]);
    });

    attrEntries.forEach(([key, value]) => {
      xml += ` ${key}="${escapeXml(String(value))}"`;
    });

    if (childEntries.length === 0) return xml + '/>';

    xml += '>\n';
    childEntries.forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        xml += `${jsonToXml(value, key, indent + 1)}\n`;
      } else if (Array.isArray(value)) {
        value.forEach((item) => {
          xml += `${jsonToXml(item, key, indent + 1)}\n`;
        });
      } else {
        xml += `${spacesChild}<${key}>${escapeXml(String(value ?? ''))}</${key}>\n`;
      }
    });
    xml += `${spaces}</${root}>`;
    return xml;
  }

  return `${spaces}<${root}/>`;
}

function convertXmlToJson(xml: string): { result: string; error: string } {
  if (!xml.trim()) return { result: '', error: '' };
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    if (doc.querySelector('parsererror')) throw new Error('Invalid XML syntax');
    return { result: JSON.stringify(xmlToJson(doc.documentElement), null, 2), error: '' };
  } catch (e) {
    return { result: '', error: e instanceof Error ? e.message : 'Conversion failed' };
  }
}

function convertJsonToXml(json: string, root: string): { result: string; error: string } {
  if (!json.trim()) return { result: '', error: '' };
  try {
    const obj = JSON.parse(json);
    return { result: jsonToXml(obj, root || 'root'), error: '' };
  } catch (e) {
    return { result: '', error: e instanceof Error ? e.message : 'Invalid JSON' };
  }
}

export default function XmlToJsonClient() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('x2j');
  const [rootElement, setRootElement] = useState('root');
  const [copied, setCopied] = useState(false);

  const { result, error } = useMemo(
    () => (mode === 'x2j' ? convertXmlToJson(input) : convertJsonToXml(input, rootElement)),
    [input, mode, rootElement],
  );

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const swap = () => {
    if (!result) return;
    setInput(result);
    setMode((m) => (m === 'x2j' ? 'j2x' : 'x2j'));
  };

  const inputLbl = mode === 'x2j' ? 'XML' : 'JSON';
  const outputLbl = mode === 'x2j' ? 'JSON' : 'XML';

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">{inputLbl}</span>
        <ToolExampleClearActions
          onExample={() => setInput(mode === 'x2j' ? EXAMPLE_XML : EXAMPLE_JSON)}
          onClear={() => setInput('')}
          canClear={input.length > 0}
        />
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === 'x2j' ? 'Paste your XML here...' : '{"key": "value"}'}
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label={`${inputLbl} input`}
      />

      <div
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          padding: '12px 20px',
          borderTop: '1px solid var(--line)',
          alignItems: 'center',
        }}
      >
        <div className="tb-v2-mode-tabs" role="tablist" aria-label="Conversion direction">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'x2j'}
            onClick={() => setMode('x2j')}
            className={`tb-v2-mode-tab ${mode === 'x2j' ? 'on' : ''}`}
          >
            XML → JSON
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'j2x'}
            onClick={() => setMode('j2x')}
            className={`tb-v2-mode-tab ${mode === 'j2x' ? 'on' : ''}`}
          >
            JSON → XML
          </button>
          <button type="button" onClick={swap} className="tb-v2-mode-tab" disabled={!result} aria-label="Swap">
            ⇅ Swap
          </button>
        </div>
        {mode === 'j2x' ? (
          <>
            <label style={{ fontSize: 13, color: 'var(--tb-text-secondary)' }} htmlFor="xml-json-root">
              Root
            </label>
            <input
              id="xml-json-root"
              type="text"
              value={rootElement}
              onChange={(e) => setRootElement(e.target.value || 'root')}
              className="tb-v2-mode-tab"
              style={{ padding: '0.25rem 0.5rem', minWidth: 80 }}
              aria-label="Root element name"
            />
          </>
        ) : null}
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">{outputLbl}</span>
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
