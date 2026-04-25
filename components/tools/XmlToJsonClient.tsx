'use client';

import { useMemo, useState } from 'react';

type Mode = 'x2j' | 'j2x';
type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
interface JsonObject { [k: string]: JsonValue }

function nodeToJson(node: Element): JsonValue {
  const obj: JsonObject = {};

  if (node.attributes.length > 0) {
    const attrs: JsonObject = {};
    for (const attr of Array.from(node.attributes)) {
      attrs[attr.name] = attr.value;
    }
    obj['@attributes'] = attrs;
  }

  const childElements = Array.from(node.children);
  const textContent = node.childNodes.length > 0 && childElements.length === 0
    ? node.textContent?.trim() ?? ''
    : '';

  if (childElements.length === 0 && textContent !== '') {
    if (Object.keys(obj).length === 0) return textContent;
    obj['#text'] = textContent;
    return obj;
  }

  for (const child of childElements) {
    const val = nodeToJson(child);
    if (obj[child.tagName] === undefined) {
      obj[child.tagName] = val;
    } else {
      const cur = obj[child.tagName];
      if (Array.isArray(cur)) cur.push(val);
      else obj[child.tagName] = [cur, val];
    }
  }

  return obj;
}

function xmlToJson(xml: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'application/xml');
  const err = doc.querySelector('parsererror');
  if (err) throw new Error(err.textContent || 'Invalid XML');
  const root = doc.documentElement;
  if (!root) throw new Error('Empty XML document');
  const out = { [root.tagName]: nodeToJson(root) };
  return JSON.stringify(out, null, 2);
}

function isJsonObject(v: JsonValue): v is JsonObject {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildXml(name: string, value: JsonValue, depth: number): string {
  const pad = '  '.repeat(depth);
  if (value === null || value === undefined) return `${pad}<${name} />`;
  if (typeof value !== 'object') return `${pad}<${name}>${escapeXml(String(value))}</${name}>`;
  if (Array.isArray(value)) {
    return value.map((v) => buildXml(name, v, depth)).join('\n');
  }

  const obj = value as JsonObject;
  const attrs = isJsonObject(obj['@attributes']) ? obj['@attributes'] : null;
  const text = typeof obj['#text'] === 'string' ? obj['#text'] : null;

  let attrStr = '';
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      attrStr += ` ${k}="${escapeXml(String(v))}"`;
    }
  }

  const childKeys = Object.keys(obj).filter((k) => k !== '@attributes' && k !== '#text');
  if (childKeys.length === 0 && text === null) {
    return `${pad}<${name}${attrStr} />`;
  }
  if (childKeys.length === 0 && text !== null) {
    return `${pad}<${name}${attrStr}>${escapeXml(text)}</${name}>`;
  }

  const children = childKeys.map((k) => buildXml(k, obj[k], depth + 1)).join('\n');
  return `${pad}<${name}${attrStr}>\n${children}\n${pad}</${name}>`;
}

function jsonToXml(json: string): string {
  const parsed: JsonValue = JSON.parse(json);
  if (!isJsonObject(parsed)) {
    throw new Error('JSON must be an object with a single root key');
  }
  const keys = Object.keys(parsed);
  if (keys.length !== 1) {
    throw new Error('JSON must have exactly one root key');
  }
  const root = keys[0];
  const body = buildXml(root, parsed[root], 0);
  return `<?xml version="1.0" encoding="UTF-8"?>\n${body}`;
}

function convert(input: string, mode: Mode): { result: string; error: string } {
  if (!input.trim()) return { result: '', error: '' };
  try {
    return { result: mode === 'x2j' ? xmlToJson(input) : jsonToXml(input), error: '' };
  } catch (e) {
    return { result: '', error: (e as Error).message };
  }
}

export default function XmlToJsonClient() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('x2j');
  const [copied, setCopied] = useState(false);

  const { result, error } = useMemo(() => convert(input, mode), [input, mode]);

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
  const placeholder = mode === 'x2j'
    ? '<book id="1">\n  <title>Hello</title>\n  <author>Toolblip</author>\n</book>'
    : '{\n  "book": {\n    "@attributes": { "id": "1" },\n    "title": "Hello"\n  }\n}';

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">{inputLbl}</span>
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
          <button
            type="button"
            onClick={swap}
            className="tb-v2-mode-tab"
            disabled={!result}
            aria-label="Swap output back to input"
          >
            ⇅ Swap
          </button>
        </div>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label={`${inputLbl} input`}
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">{outputLbl}</span>
        <button
          type="button"
          onClick={copy}
          disabled={!result}
          className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {error ? (
          <p className="tb-v2-error" role="alert">
            <strong>Parse error:</strong> {error}
          </p>
        ) : (
          <pre className="tb-v2-tool-pre">{result || '—'}</pre>
        )}
      </div>
    </div>
  );
}
