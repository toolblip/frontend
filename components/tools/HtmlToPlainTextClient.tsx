'use client';

import { useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE = `<h1>Welcome</h1>
<p>This is a <strong>sample</strong> paragraph with a <a href="https://toolblip.com">link</a>.</p>
<ul><li>One</li><li>Two</li></ul>`;

function htmlToPlainText(html: string): string {
  if (!html.trim()) return '';
  if (typeof DOMParser === 'undefined') {
    return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('script, style, template, noscript').forEach(node => node.remove());
  doc.querySelectorAll('br').forEach(node => node.replaceWith(doc.createTextNode('\n')));
  // Preserve common block boundaries without treating markup source as prose.
  doc.querySelectorAll('p, div, section, article, header, footer, h1, h2, h3, h4, h5, h6, li, tr, blockquote, pre')
    .forEach(node => { node.prepend(doc.createTextNode('\n')); node.append(doc.createTextNode('\n')); });
  return (doc.body.textContent || '').replace(/[ \t]*\n[ \t]*/g, '\n').replace(/\n+/g, '\n').trim();
}

export default function HtmlToPlainTextClient() {
  const [html, setHtml] = useState('');
  const [copied, setCopied] = useState(false);

  const plainText = useMemo(() => htmlToPlainText(html), [html]);

  const copy = () => {
    if (!plainText) return;
    navigator.clipboard.writeText(plainText).catch(() => {});
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
          disabled={!plainText}
          className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {!plainText ? (
          <p className="tb-v2-empty">Paste HTML or use Example.</p>
        ) : (
          <div style={{ whiteSpace: 'pre-wrap', fontSize: 14 }}>{plainText}</div>
        )}
      </div>
    </div>
  );
}
