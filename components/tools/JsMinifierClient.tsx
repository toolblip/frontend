'use client';

import { useMemo, useState } from 'react';

// Conservative JS minifier:
//   - strips // line comments and /* block */ comments
//   - collapses whitespace inside code (preserves whitespace inside
//     strings, template literals, and regex literals)
//   - removes whitespace around operators when safe
// It does NOT rename identifiers and does NOT optimize syntax  -  for serious
// minification, use a dedicated tool like terser as part of your build.

const REGEX_PRECEDERS = new Set('(,=:[!&|?{};+-*/%^~<>'.split(''));
const KEYWORD_PRECEDERS = new Set([
  'return', 'typeof', 'instanceof', 'in', 'of', 'new', 'void', 'delete',
  'throw', 'do', 'else', 'case', 'yield', 'await',
]);

function isWordChar(c: string): boolean {
  return /[A-Za-z0-9_$]/.test(c);
}

function lastIdent(out: string): string {
  let i = out.length - 1;
  while (i >= 0 && isWordChar(out[i])) i--;
  return out.slice(i + 1);
}

function lastNonSpace(out: string): string {
  for (let i = out.length - 1; i >= 0; i--) {
    if (!/\s/.test(out[i])) return out[i];
  }
  return '';
}

function minify(src: string): string {
  let out = '';
  let i = 0;
  const n = src.length;

  while (i < n) {
    const c = src[i];
    const next = src[i + 1];

    // Line comment
    if (c === '/' && next === '/') {
      while (i < n && src[i] !== '\n') i++;
      continue;
    }
    // Block comment
    if (c === '/' && next === '*') {
      i += 2;
      while (i < n && !(src[i] === '*' && src[i + 1] === '/')) i++;
      i += 2;
      continue;
    }

    // Strings
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

    // Template literal
    if (c === '`') {
      out += c; i++;
      let depth = 0;
      while (i < n) {
        const ch = src[i];
        if (ch === '\\' && i + 1 < n) { out += ch + src[i + 1]; i += 2; continue; }
        if (depth === 0 && ch === '`') { out += ch; i++; break; }
        if (ch === '$' && src[i + 1] === '{') { depth++; out += '${'; i += 2; continue; }
        if (depth > 0 && ch === '}') { depth--; out += '}'; i++; continue; }
        out += ch; i++;
      }
      continue;
    }

    // Regex literal vs division
    if (c === '/') {
      const last = lastNonSpace(out);
      const ident = lastIdent(out);
      const isRegex = last === '' || REGEX_PRECEDERS.has(last) || KEYWORD_PRECEDERS.has(ident);
      if (isRegex) {
        out += c; i++;
        let inClass = false;
        while (i < n) {
          const ch = src[i];
          out += ch;
          if (ch === '\\' && i + 1 < n) { out += src[i + 1]; i += 2; continue; }
          if (ch === '[') inClass = true;
          else if (ch === ']') inClass = false;
          else if (ch === '/' && !inClass) { i++; break; }
          else if (ch === '\n') break;
          i++;
        }
        // flags
        while (i < n && /[a-z]/.test(src[i])) { out += src[i]; i++; }
        continue;
      }
    }

    // Whitespace
    if (/\s/.test(c)) {
      // collapse runs to single space
      while (i < n && /\s/.test(src[i])) i++;
      const prev = out.length > 0 ? out[out.length - 1] : '';
      const nxt = i < n ? src[i] : '';
      // keep a space only if both sides are word characters (identifier/number)
      // or both are operators that could collide (e.g. ++ +)
      if (isWordChar(prev) && (isWordChar(nxt) || nxt === '"' || nxt === "'" || nxt === '`')) {
        out += ' ';
      } else if (
        (prev === '+' && nxt === '+') ||
        (prev === '-' && nxt === '-') ||
        (prev === '+' && nxt === '=') ||
        (prev === '-' && nxt === '=') ||
        (prev === '!' && nxt === '-')
      ) {
        out += ' ';
      }
      continue;
    }

    out += c; i++;
  }

  return out.trim();
}

export default function JsMinifierClient() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const { result, error } = useMemo(() => {
    if (!input.trim()) return { result: '', error: '' };
    try {
      return { result: minify(input), error: '' };
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
        <span className="tb-v2-tool-label">JavaScript</span>
        {input && !error && (
          <span className="tb-v2-hash-stats">
            {orig.toLocaleString()} → {min.toLocaleString()} bytes ({saved}% smaller)
          </span>
        )}
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={"function hello(name) {\n  // greet the user\n  return 'Hello, ' + name;\n}"}
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label="JavaScript input"
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
          <pre className="tb-v2-tool-pre">{result || ' - '}</pre>
        )}
      </div>
    </div>
  );
}
