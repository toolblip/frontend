'use client';

import { useMemo, useState } from 'react';

function minifyHtml(src: string): string {
  let out = '';
  let i = 0;
  const n = src.length;

  while (i < n) {
    const c = src[i];
    const next = src[i + 1];

    // HTML comment
    if (c === '<' && next === '!' && src[i + 2] === '-' && src[i + 3] === '-') {
      i += 4;
      while (i < n && !(src[i] === '-' && src[i + 1] === '-' && src[i + 2] === '>')) i++;
      i += 3;
      continue;
    }

    // Script/style content - preserve inner text
    if (c === '<' && (next === 's' || next === 'S')) {
      const tagMatch = src.slice(i).match(/^<(script|style)[^>]*>/i);
      if (tagMatch) {
        const tag = tagMatch[0];
        const tagName = tagMatch[1].toLowerCase();
        out += tag;
        i += tag.length;
        
        const closeTag = `</${tagName}>`;
        const closeIdx = src.toLowerCase().indexOf(closeTag, i);
        if (closeIdx !== -1) {
          out += src.slice(i, closeIdx);
          i = closeIdx + closeTag.length;
        }
        continue;
      }
    }

    // Whitespace collapse (but preserve pre/form textarea)
    if (/\s/.test(c)) {
      // Check if we're inside a pre/form/textarea tag
      let inPre = false;
      let preIdx = out.lastIndexOf('<');
      if (preIdx !== -1) {
        const beforeTag = out.slice(preIdx).toLowerCase();
        inPre = beforeTag.startsWith('<pre') || beforeTag.startsWith('<form') || beforeTag.startsWith('<textarea');
      }
      
      if (inPre) {
        out += c;
        i++;
      } else {
        while (i < n && /\s/.test(src[i])) i++;
        const prev = out.length > 0 ? out[out.length - 1] : '';
        const nxt = i < n ? src[i] : '';
        if (/[a-zA-Z0-9]/.test(prev) && /[a-zA-Z0-9(]/.test(nxt)) {
          out += ' ';
        }
      }
      continue;
    }

    out += c; i++;
  }

  return out.trim();
}

export default function HtmlMinifierClient() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const { result, error } = useMemo(() => {
    if (!input.trim()) return { result: '', error: '' };
    try {
      return { result: minifyHtml(input), error: '' };
    } catch (e) {
      return { result: '', error: (e as Error).message };
    }
  }, [input]);

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const orig = new TextEncoder().encode(input).length;
  const min = new TextEncoder().encode(result).length;
  const saved = orig > 0 ? Math.round(((orig - min) / orig) * 100) : 0;

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">HTML</span>
        {input && !error && (
          <span className="tb-v2-hash-stats">
            {orig.toLocaleString()} → {min.toLocaleString()} bytes ({saved}% smaller)
          </span>
        )}
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={`<!DOCTYPE html>\n<html>\n  <!-- comment -->\n  <head>\n    <title>Page</title>\n  </head>\n  <body>\n    <p>Hello World</p>\n  </body>\n</html>`}
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label="HTML input"
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Minified</span>
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
          <p className="tb-v2-error" role="alert">{error}</p>
        ) : (
          <pre className="tb-v2-tool-pre">{result || '—'}</pre>
        )}
      </div>
    </div>
  );
}
