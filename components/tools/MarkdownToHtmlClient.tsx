'use client';

import { useEffect, useMemo, useState } from 'react';
import { marked } from 'marked';

type RightView = 'preview' | 'html';

const SAMPLE = `# Markdown to HTML

Type **Markdown** on the left, see the rendered HTML on the right.

- Lists work
- So does \`inline code\`

\`\`\`js
console.log('and code blocks');
\`\`\`

> Block quotes too.

[Visit Toolblip](https://toolblip.com)
`;

export default function MarkdownToHtmlClient() {
  const [src, setSrc] = useState(SAMPLE);
  const [right, setRight] = useState<RightView>('preview');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    marked.setOptions({ gfm: true, breaks: false });
  }, []);

  const html = useMemo(() => {
    try {
      return marked.parse(src, { async: false }) as string;
    } catch {
      return '';
    }
  }, [src]);

  const copy = () => {
    if (!html) return;
    navigator.clipboard.writeText(html).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Markdown ↔ HTML</span>
        <div className="tb-v2-mode-tabs" role="tablist" aria-label="Right pane">
          {(['preview', 'html'] as RightView[]).map((v) => (
            <button
              key={v}
              type="button"
              role="tab"
              aria-selected={right === v}
              onClick={() => setRight(v)}
              className={`tb-v2-mode-tab ${right === v ? 'on' : ''}`}
            >
              {v === 'preview' ? 'Preview' : 'HTML'}
            </button>
          ))}
        </div>
      </div>

      <div className="tb-v2-md-grid">
        <textarea
          value={src}
          onChange={(e) => setSrc(e.target.value)}
          className="tb-v2-tool-textarea tb-v2-md-src"
          style={{ fontFamily: 'var(--f-mono)' }}
          aria-label="Markdown input"
          placeholder="# Hello"
        />
        {right === 'preview' ? (
          <div
            className="tb-v2-md-preview"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: html }}
            aria-label="Rendered preview"
          />
        ) : (
          <pre className="tb-v2-md-html-pane">{html || ' - '}</pre>
        )}
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">{right === 'preview' ? 'Rendered' : 'HTML source'}</span>
        <button
          type="button"
          onClick={copy}
          disabled={!html}
          className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
        >
          {copied ? 'Copied' : 'Copy HTML'}
        </button>
      </div>
    </div>
  );
}
