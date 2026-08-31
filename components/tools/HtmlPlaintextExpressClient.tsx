'use client';

import { useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE = `<article>
  <h2>News</h2>
  <p>First paragraph with <em>emphasis</em>.</p>
  <p>Second paragraph.</p>
</article>`;

function htmlToPlaintext(html: string): string {
  if (!html.trim()) return '';
  if (typeof DOMParser === 'undefined' || typeof document === 'undefined') {
    return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const element = doc.body;
  const blockElements = new Set([
    'P',
    'DIV',
    'BR',
    'H1',
    'H2',
    'H3',
    'H4',
    'H5',
    'H6',
    'LI',
    'TR',
    'BLOCKQUOTE',
    'SECTION',
    'ARTICLE',
  ]);

  let text = '';
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let lastWasBlock = false;

  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    const parentName = node.parentElement?.tagName || '';
    const chunk = node.textContent || '';
    if (!chunk) continue;

    if (blockElements.has(parentName) && text && !lastWasBlock) {
      text += '\n';
    }
    text += chunk;
    lastWasBlock = blockElements.has(parentName);
  }

  return text.replace(/\n{3,}/g, '\n\n').trim();
}

export default function HtmlPlaintextExpress() {
  const [html, setHtml] = useState('');
  const [copied, setCopied] = useState(false);

  const plaintext = useMemo(() => htmlToPlaintext(html), [html]);

  const copy = () => {
    if (!plaintext) return;
    navigator.clipboard.writeText(plaintext).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">HTML</span>
        <ToolExampleClearActions
          exampleCount={1}
          onExample={() => setHtml(EXAMPLE)}
          onClear={() => setHtml('')}
          canClear={html.length > 0}
        />
      </div>
      <textarea
        value={html}
        onChange={(e) => setHtml(e.target.value)}
        placeholder="Paste HTML…"
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)', minHeight: 140 }}
        aria-label="HTML input"
        spellCheck={false}
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Plain text</span>
        <button
          type="button"
          onClick={copy}
          disabled={!plaintext}
          className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {!plaintext ? (
          <p className="tb-v2-empty">Paste HTML or use Example.</p>
        ) : (
          <div style={{ whiteSpace: 'pre-wrap', fontSize: 14 }}>{plaintext}</div>
        )}
      </div>
    </div>
  );
}
