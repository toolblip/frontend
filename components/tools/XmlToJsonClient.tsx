'use client';

import { useCallback, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE_JSON = `{
  "name": "Ada",
  "age": 36,
  "city": "London"
}`;

const EXAMPLE_XML = `<root>
  <name>Ada</name>
  <age>36</age>
  <city>London</city>
</root>`;

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
    return obj.map((item) => jsonToXml(item, root.endsWith('s') ? root.slice(0, -1) : 'item', indent)).join('\n');
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

function xmlToJsonText(input: string): { text: string; error: string } {
  if (!input.trim()) return { text: '', error: '' };
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(input, 'text/xml');
    if (doc.querySelector('parsererror')) throw new Error('Invalid XML syntax');
    return { text: JSON.stringify(xmlToJson(doc.documentElement), null, 2), error: '' };
  } catch (e) {
    return { text: '', error: e instanceof Error ? e.message : 'Invalid XML' };
  }
}

function jsonToXmlText(input: string, root: string): { text: string; error: string } {
  if (!input.trim()) return { text: '', error: '' };
  try {
    return { text: jsonToXml(JSON.parse(input), root || 'root'), error: '' };
  } catch (e) {
    return { text: '', error: e instanceof Error ? e.message : 'Invalid JSON' };
  }
}

export default function XmlToJsonClient() {
  const [json, setJson] = useState('');
  const [xml, setXml] = useState('');
  const [rootElement, setRootElement] = useState('root');
  const [jsonError, setJsonError] = useState('');
  const [xmlError, setXmlError] = useState('');
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedXml, setCopiedXml] = useState(false);

  const applyJson = useCallback(
    (text: string, root = rootElement) => {
      setJson(text);
      if (!text.trim()) {
        setXml('');
        setXmlError('');
        setJsonError('');
        return;
      }
      const { text: converted, error } = jsonToXmlText(text, root);
      if (error) {
        setJsonError(error);
        return;
      }
      setXml(converted);
      setXmlError('');
      setJsonError('');
    },
    [rootElement],
  );

  const applyXml = useCallback((text: string) => {
    setXml(text);
    if (!text.trim()) {
      setJson('');
      setJsonError('');
      setXmlError('');
      return;
    }
    const { text: converted, error } = xmlToJsonText(text);
    if (error) {
      setXmlError(error);
      return;
    }
    setJson(converted);
    setJsonError('');
    setXmlError('');
  }, []);

  const onRootChange = (root: string) => {
    const next = root || 'root';
    setRootElement(next);
    if (json.trim()) applyJson(json, next);
  };

  const clearAll = useCallback(() => {
    setJson('');
    setXml('');
    setJsonError('');
    setXmlError('');
  }, []);

  const copyJson = useCallback(() => {
    if (!json) return;
    navigator.clipboard.writeText(json).catch(() => {});
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 1500);
  }, [json]);

  const copyXml = useCallback(() => {
    if (!xml) return;
    navigator.clipboard.writeText(xml).catch(() => {});
    setCopiedXml(true);
    setTimeout(() => setCopiedXml(false), 1500);
  }, [xml]);

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="tb-v2-tool-label">JSON-XML Converter</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <label style={{ fontSize: 12, color: 'var(--tb-text-secondary)' }} htmlFor="json-xml-root">
            XML root
          </label>
          <input
            id="json-xml-root"
            type="text"
            value={rootElement}
            onChange={(e) => onRootChange(e.target.value)}
            className="tb-v2-mode-tab"
            style={{ padding: '0.25rem 0.5rem', minWidth: 72 }}
            aria-label="XML root element name"
          />
          <ToolExampleClearActions
            onExample={() => applyJson(EXAMPLE_JSON)}
            onClear={clearAll}
            canClear={json.length > 0 || xml.length > 0}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y divide-[var(--line)] md:divide-y-0 md:divide-x">
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 280 }}>
          <div className="tb-v2-tool-input-head">
            <span className="tb-v2-tool-label">JSON</span>
            <button
              type="button"
              onClick={copyJson}
              disabled={!json}
              className={`tb-v2-copy-btn ${copiedJson ? 'done' : ''}`}
            >
              {copiedJson ? 'Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            value={json}
            onChange={(e) => applyJson(e.target.value)}
            placeholder={EXAMPLE_JSON}
            className="tb-v2-tool-textarea"
            style={{
              flex: 1,
              minHeight: 220,
              fontFamily: 'var(--f-mono)',
              border: 'none',
              borderRadius: 0,
              resize: 'vertical',
            }}
            aria-label="JSON input"
            spellCheck={false}
          />
          {jsonError ? (
            <p className="tb-v2-error" role="alert" style={{ margin: '0 16px 12px' }}>
              {jsonError}
            </p>
          ) : null}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 280 }}>
          <div className="tb-v2-tool-input-head">
            <span className="tb-v2-tool-label">XML</span>
            <button
              type="button"
              onClick={copyXml}
              disabled={!xml}
              className={`tb-v2-copy-btn ${copiedXml ? 'done' : ''}`}
            >
              {copiedXml ? 'Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            value={xml}
            onChange={(e) => applyXml(e.target.value)}
            placeholder={EXAMPLE_XML}
            className="tb-v2-tool-textarea"
            style={{
              flex: 1,
              minHeight: 220,
              fontFamily: 'var(--f-mono)',
              border: 'none',
              borderRadius: 0,
              resize: 'vertical',
            }}
            aria-label="XML input"
            spellCheck={false}
          />
          {xmlError ? (
            <p className="tb-v2-error" role="alert" style={{ margin: '0 16px 12px' }}>
              {xmlError}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
