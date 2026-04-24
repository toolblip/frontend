'use client';

import { useState, useCallback, useEffect } from 'react';
import type { Tool } from '@/data/tools';

/* ─────────────────────────────────────────────
   Shared v2 primitives
   ───────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-2)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
      {children}
    </span>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <button onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

/* ─────────────────────────────────────────────
   Word Counter
   ───────────────────────────────────────────── */

function WordCounterUI() {
  const [text, setText] = useState('');

  const stats = {
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, '').length,
    sentences: text.split(/[.!?]+/).filter(s => s.trim()).length,
    paragraphs: text.split(/\n\n+/).filter(s => s.trim()).length,
    readingTime: Math.ceil(text.trim() ? text.trim().split(/\s+/).length / 200 : 0),
  };

  return (
    <>
      <div className="tb-v2-tool-input-head">
        <SectionLabel>Input</SectionLabel>
      </div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste or type your text here…"
        rows={6}
        className="tb-v2-tool-textarea"
        aria-label="Text to count"
      />
      <div className="tb-v2-stats-grid">
        {[
          { label: 'Words', val: stats.words },
          { label: 'Chars', val: stats.characters },
          { label: 'Chars (no spaces)', val: stats.charactersNoSpaces },
          { label: 'Sentences', val: stats.sentences },
          { label: 'Paragraphs', val: stats.paragraphs },
          { label: 'Read (min)', val: stats.readingTime },
        ].map(({ label, val }) => (
          <div key={label} className="tb-v2-stat-pill">
            <span className="tb-v2-stat-pill-val">{val}</span>
            <span className="tb-v2-stat-pill-lbl">{label}</span>
          </div>
        ))}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   Character Counter
   ───────────────────────────────────────────── */

function CharacterCounterUI() {
  const [text, setText] = useState('');
  const limits = [
    { name: 'Twitter / X', limit: 280 },
    { name: 'LinkedIn', limit: 3000 },
    { name: 'Meta Description', limit: 160 },
    { name: 'Google Title', limit: 60 },
  ];
  const len = text.length;

  return (
    <>
      <div className="tb-v2-tool-input-head">
        <SectionLabel>Input</SectionLabel>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-2)', fontVariantNumeric: 'tabular-nums' }}>
          {len} chars
        </span>
      </div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type or paste your text…"
        rows={5}
        className="tb-v2-tool-textarea"
        aria-label="Text to count"
      />
      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--line)', background: 'var(--surface-2)' }}>
        {limits.map(l => {
          const pct = Math.min((len / l.limit) * 100, 100);
          const over = len > l.limit;
          return (
            <div key={l.name} style={{ marginBottom: 12 }}>
              <div className="tb-v2-limit-row">
                <span className="tb-v2-limit-name">{l.name} ({l.limit})</span>
                <span className={`tb-v2-limit-count ${over ? 'tb-v2-copy-btn done' : ''}`} style={{ color: over ? 'var(--red)' : 'var(--fg-1)' }}>
                  {len}/{l.limit}
                </span>
              </div>
              <div className="tb-v2-limit-bar">
                <div
                  className="tb-v2-limit-fill"
                  style={{
                    width: `${pct}%`,
                    background: over ? 'var(--red)' : pct > 80 ? '#f59e0b' : 'var(--red)',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   Case Converter
   ───────────────────────────────────────────── */

function toWords(s: string) {
  return s.match(/[A-Z]?[a-z]+|[A-Z]+(?=[A-Z][a-z])|\d+/g) || [];
}

const caseFns: { label: string; fn: (s: string) => string }[] = [
  { label: 'UPPERCASE', fn: s => s.toUpperCase() },
  { label: 'lowercase', fn: s => s.toLowerCase() },
  { label: 'Title Case', fn: s => s.replace(/\b\w/g, c => c.toUpperCase()) },
  { label: 'camelCase', fn: s => toWords(s).map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('') },
  { label: 'snake_case', fn: s => toWords(s).map(w => w.toLowerCase()).join('_') },
  { label: 'kebab-case', fn: s => toWords(s).map(w => w.toLowerCase()).join('-') },
  { label: 'PascalCase', fn: s => toWords(s).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('') },
];

function CaseConverterUI() {
  const [input, setInput] = useState('');

  return (
    <>
      <div className="tb-v2-tool-input-head">
        <SectionLabel>Input</SectionLabel>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Enter text to convert…"
        rows={4}
        className="tb-v2-tool-textarea"
        aria-label="Text to convert"
      />
      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--line)' }}>
        <div style={{ marginBottom: 12 }}>
          <SectionLabel>Converted</SectionLabel>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {caseFns.map(({ label, fn }) => {
            const result = input ? fn(input) : '';
            return (
              <div key={label} className="tb-v2-case-row">
                <span className="tb-v2-case-label">{label}</span>
                <code className="tb-v2-case-val" style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {result || '-'}
                </code>
                {result && <CopyButton text={result} />}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   Base64 Encode / Decode
   ───────────────────────────────────────────── */

function Base64UI() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const process = useCallback(() => {
    setError('');
    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
    } catch {
      setError('Invalid input for the selected mode.');
      setOutput('');
    }
  }, [mode, input]);

  useEffect(() => { process(); }, [process]);

  return (
    <>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--line)' }}>
        <div className="tb-v2-mode-tabs" style={{ marginBottom: 12 }}>
          {(['encode', 'decode'] as const).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); }}
              className={`tb-v2-mode-tab ${mode === m ? 'on' : ''}`}
            >
              {m === 'encode' ? 'Encode → Base64' : 'Decode ← Base64'}
            </button>
          ))}
        </div>
        <textarea
          value={input}
          onChange={e => { setInput(e.target.value); setError(''); }}
          placeholder={mode === 'encode' ? 'Text to encode…' : 'Base64 string to decode…'}
          rows={4}
          className="tb-v2-tool-textarea"
          aria-label={mode === 'encode' ? 'Text to encode' : 'Base64 string to decode'}
          style={{ minHeight: 100 }}
        />
      </div>
      <div className="tb-v2-tool-output-head">
        <SectionLabel>Output</SectionLabel>
        {output && !error && <CopyButton text={output} />}
      </div>
      <div className="tb-v2-tool-output-body">
        {error ? (
          <p className="tb-v2-error">{error}</p>
        ) : (
          <pre className="tb-v2-tool-pre">{output}</pre>
        )}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   URL Encode / Decode
   ───────────────────────────────────────────── */

function URLEncodeUI() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const process = useCallback(() => {
    setError('');
    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch {
      setError('Invalid URL-encoded string.');
      setOutput('');
    }
  }, [mode, input]);

  useEffect(() => { process(); }, [process]);

  return (
    <>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--line)' }}>
        <div className="tb-v2-mode-tabs" style={{ marginBottom: 12 }}>
          {(['encode', 'decode'] as const).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); }}
              className={`tb-v2-mode-tab ${mode === m ? 'on' : ''}`}
            >
              {m === 'encode' ? 'Encode → URL-safe' : 'Decode ← URL-safe'}
            </button>
          ))}
        </div>
        <textarea
          value={input}
          onChange={e => { setInput(e.target.value); setError(''); }}
          placeholder={mode === 'encode' ? 'Text to URL-encode…' : 'URL-encoded string to decode…'}
          rows={3}
          className="tb-v2-tool-textarea"
          aria-label={mode === 'encode' ? 'Text to URL-encode' : 'URL-encoded string to decode'}
          style={{ minHeight: 80 }}
        />
      </div>
      <div className="tb-v2-tool-output-head">
        <SectionLabel>Output</SectionLabel>
        {output && !error && <CopyButton text={output} />}
      </div>
      <div className="tb-v2-tool-output-body">
        {error ? (
          <p className="tb-v2-error">{error}</p>
        ) : (
          <pre className="tb-v2-tool-pre">{output}</pre>
        )}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   JSON Formatter
   ───────────────────────────────────────────── */

function JSONFormatterUI() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState<2 | 4>(2);

  const process = useCallback((raw: string, minify = false) => {
    setError('');
    if (!raw.trim()) { setOutput(''); return; }
    try {
      const parsed = JSON.parse(raw);
      setOutput(minify ? JSON.stringify(parsed) : JSON.stringify(parsed, null, indent));
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`);
      setOutput('');
    }
  }, [indent]);

  const handleInput = (val: string) => {
    setInput(val);
    process(val);
  };

  const handleIndent = (i: 2 | 4) => {
    setIndent(i);
    process(input, false);
  };

  return (
    <>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
          <SectionLabel>Indent</SectionLabel>
          <div className="tb-v2-mode-tabs">
            {([2, 4] as const).map(i => (
              <button
                key={i}
                onClick={() => handleIndent(i)}
                className={`tb-v2-mode-tab ${indent === i ? 'on' : ''}`}
              >
                {i} spaces
              </button>
            ))}
          </div>
          <button
            onClick={() => process(input, true)}
            className="tb-v2-mode-tab"
            style={{ marginLeft: 'auto' }}
          >
            Minify
          </button>
        </div>
        <textarea
          value={input}
          onChange={e => handleInput(e.target.value)}
          placeholder={'Paste JSON here - {"key": "value"}'}
          rows={6}
          className="tb-v2-tool-textarea"
          style={{ fontFamily: 'var(--f-mono)', fontSize: 13.5 }}
          aria-label="JSON input"
        />
      </div>
      <div className="tb-v2-tool-output-head">
        <SectionLabel>Formatted Output</SectionLabel>
        {output && !error && <CopyButton text={output} />}
      </div>
      <div className="tb-v2-tool-output-body">
        {error ? (
          <p className="tb-v2-error">{error}</p>
        ) : (
          <pre className="tb-v2-tool-pre" style={{ maxHeight: 320 }}>
            {output || <span style={{ color: 'var(--fg-3)', fontStyle: 'italic' }}>Output will appear here…</span>}
          </pre>
        )}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   Tool router
   ───────────────────────────────────────────── */

const TOOL_UIS: Record<string, React.ComponentType> = {
  'word-counter': WordCounterUI,
  'character-counter': CharacterCounterUI,
  'case-converter': CaseConverterUI,
  'base64': Base64UI,
  'url-encode': URLEncodeUI,
  'json-formatter': JSONFormatterUI,
};

export default function ToolUI({ tool }: { tool: Tool }) {
  const Component = TOOL_UIS[tool.slug];
  if (!Component) return null;
  return <Component />;
}
