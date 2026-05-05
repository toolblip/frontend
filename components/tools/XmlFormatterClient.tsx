'use client';

import { useMemo, useState } from 'react';

function formatXml(input: string, indent: number): { result: string; error: string } {
  if (!input.trim()) return { result: '', error: '' };
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(input, 'application/xml');
    const err = doc.querySelector('parsererror');
    if (err) {
      return { result: '', error: err.textContent || 'Invalid XML' };
    }
    const formatted = formatNode(doc.documentElement, 0, indent);
    const declaration = '<?xml version="1.0" encoding="UTF-8"?>\n';
    return { result: declaration + formatted, error: '' };
  } catch (e) {
    return { result: '', error: (e as Error).message };
  }
}

function formatNode(node: Element, depth: number, indent: number): string {
  const pad = ' '.repeat(depth * indent);
  const attrs: string[] = [];
  for (const attr of Array.from(node.attributes)) {
    attrs.push(`${attr.name}="${escapeXmlAttr(attr.value)}"`);
  }
  const attrStr = attrs.length > 0 ? ' ' + attrs.join(' ') : '';
  
  if (node.children.length === 0) {
    const text = node.textContent?.trim() || '';
    if (text) {
      return `${pad}<${node.tagName}${attrStr}>${escapeXmlText(text)}</${node.tagName}>`;
    }
    return `${pad}<${node.tagName}${attrStr} />`;
  }
  
  const children: string[] = [];
  for (const child of Array.from(node.children)) {
    children.push(formatNode(child, depth + 1, indent));
  }
  
  if (children.length === 1 && !node.firstElementChild?.nextElementSibling) {
    const childText = node.firstElementChild ? formatNode(node.firstElementChild, depth + 1, indent) : '';
    return `${pad}<${node.tagName}${attrStr}>${childText.includes('\n') ? '\n' + childText + '\n' + pad : escapeXmlText(node.textContent || '')}</${node.tagName}>`;
  }
  
  return `${pad}<${node.tagName}${attrStr}>\n${children.join('\n')}\n${pad}</${node.tagName}>`;
}

function escapeXmlText(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function escapeXmlAttr(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function minifyXml(input: string): { result: string; error: string } {
  if (!input.trim()) return { result: '', error: '' };
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(input, 'application/xml');
    const err = doc.querySelector('parsererror');
    if (err) {
      return { result: '', error: err.textContent || 'Invalid XML' };
    }
    return { result: doc.documentElement.outerHTML.replace(/>\s+</g, '><').trim(), error: '' };
  } catch (e) {
    return { result: '', error: (e as Error).message };
  }
}

type Mode = 'format' | 'minify';

export default function XmlFormatterClient() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('format');
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);

  const { result, error } = useMemo(() => {
    if (!input.trim()) return { result: '', error: '' };
    return mode === 'format' ? formatXml(input, indent) : minifyXml(input);
  }, [input, mode, indent]);

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">XML</span>
        <div className="tb-v2-mode-tabs" role="tablist" aria-label="XML mode">
          {(['format', 'minify'] as Mode[]).map((m) => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={`tb-v2-mode-tab ${mode === m ? 'on' : ''}`}
            >
              {m === 'format' ? 'Format' : 'Minify'}
            </button>
          ))}
        </div>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='<root>\n  <item id="1">Hello</item>\n</root>'
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label="XML input"
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">{mode === 'format' ? 'Formatted' : 'Minified'}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {mode === 'format' && (
            <div className="tb-v2-mode-tabs" role="group" aria-label="Indent size">
              {[2, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setIndent(n)}
                  className={`tb-v2-mode-tab ${indent === n ? 'on' : ''}`}
                  aria-pressed={indent === n}
                >
                  {n}-space
                </button>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={copy}
            disabled={!result}
            className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
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
