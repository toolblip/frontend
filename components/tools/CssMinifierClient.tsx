'use client';

import { useMemo, useState } from 'react';

function minifyCss(src: string): string {
  let out = '';
  let i = 0;
  const n = src.length;

  while (i < n) {
    const c = src[i];
    const next = src[i + 1];

    // Block comment
    if (c === '/' && next === '*') {
      i += 2;
      while (i < n && !(src[i] === '*' && src[i + 1] === '/')) i++;
      i += 2;
      continue;
    }

    // String (preserve content)
    if (c === '"' || c === "'") {
      const quote = c;
      out += c; i++;
      while (i < n) {
        const ch = src[i];
        out += ch;
        if (ch === '\\' && i + 1 < n) { out += src[i + 1]; i += 2; continue; }
        if (ch === quote) { i++; break; }
        i++;
      }
      continue;
    }

    // Whitespace
    if (/\s/.test(c)) {
      while (i < n && /\s/.test(src[i])) i++;
      const prev = out.length > 0 ? out[out.length - 1] : '';
      const nxt = i < n ? src[i] : '';
      // Keep space only between word chars or after {, : or before }
      if (/[a-zA-Z0-9]/.test(prev) && /[a-zA-Z0-9(]/.test(nxt)) {
        out += ' ';
      } else if (prev === '{' || prev === ':') {
        out += ' ';
      }
      continue;
    }

    out += c; i++;
  }

  // Shorten colors
  out = out.replace(/#([0-9a-fA-F])\1([0-9a-fA-F])\2([0-9a-fA-F])\3/g, '#$1$2$3');

  return out.trim();
}

export default function CssMinifierClient() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const { result, error } = useMemo(() => {
    if (!input.trim()) return { result: '', error: '' };
    try {
      return { result: minifyCss(input), error: '' };
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
        <span className="tb-v2-tool-label">CSS</span>
        {input && !error && (
          <span className="tb-v2-hash-stats">
            {orig.toLocaleString()} → {min.toLocaleString()} bytes ({saved}% smaller)
          </span>
        )}
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={`.container {\n  /* comment */\n  color: #ffffff;\n  background-color: #000000;\n  font-family: Arial, sans-serif;\n}`}
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label="CSS input"
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
