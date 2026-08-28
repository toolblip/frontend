'use client';

import { useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE = `<person name="Ada">
  <age>36</age>
  <city>London</city>
</person>`;

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
}

function convert(xml: string): { result: string; error: string } {
  if (!xml.trim()) return { result: '', error: '' };
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');

    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      throw new Error('Invalid XML syntax');
    }

    const jsonObj = xmlToJson(doc.documentElement);
    return { result: JSON.stringify(jsonObj, null, 2), error: '' };
  } catch (e) {
    return { result: '', error: e instanceof Error ? e.message : 'Conversion failed' };
  }
}

export default function XmlToJsonClient() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const { result, error } = useMemo(() => convert(input), [input]);

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">XML Input</span>
        <ToolExampleClearActions
          onExample={() => setInput(EXAMPLE)}
          onClear={() => setInput('')}
          canClear={input.length > 0}
        />
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your XML here..."
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label="XML input"
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">JSON Output</span>
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
