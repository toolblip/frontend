'use client';

import { useState } from 'react';

export default function XmlToJsonClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const convert = (xml: string) => {
    if (!xml.trim()) {
      setOutput('');
      setError('');
      return;
    }
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, 'text/xml');

      const parseError = doc.querySelector('parsererror');
      if (parseError) {
        throw new Error('Invalid XML syntax');
      }

      const jsonObj = xmlToJson(doc.documentElement);
      setOutput(JSON.stringify(jsonObj, null, 2));
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed');
      setOutput('');
    }
  };

  const xmlToJson = (node: Element): unknown => {
    const obj: Record<string, unknown> = {};

    if (node.attributes) {
      for (let i = 0; i < node.attributes.length; i++) {
        const attr = node.attributes[i];
        if (attr.name.startsWith('xmlns')) continue;
        obj[`@${attr.name}`] = attr.value;
      }
    }

    const children = Array.from(node.childNodes).filter(
      (n) => n.nodeType === Node.ELEMENT_NODE || n.nodeType === Node.TEXT_NODE
    );

    if (children.length === 0) {
      const text = node.textContent?.trim() ?? '';
      return text || null;
    }

    children.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent?.trim() ?? '';
        if (text && Object.keys(obj).length === 0) {
          return text;
        }
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
        <span className="tb-v2-tool-label">XML Input</span>
      </div>
      <textarea
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          convert(e.target.value);
        }}
        placeholder="Paste your XML here..."
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label="XML input"
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">JSON Output</span>
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
