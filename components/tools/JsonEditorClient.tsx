'use client';

import { useMemo, useState } from 'react';

const SAMPLE = '{\n  "name": "Ada Lovelace",\n  "born": 1815,\n  "tags": ["mathematician", "writer"],\n  "active": true,\n  "notes": null\n}';

interface ParseError {
  message: string;
  line: number | null;
  column: number | null;
}

function lineColFromPosition(text: string, pos: number): { line: number; column: number } {
  let line = 1;
  let lastNewline = -1;
  for (let i = 0; i < pos && i < text.length; i++) {
    if (text[i] === '\n') {
      line++;
      lastNewline = i;
    }
  }
  return { line, column: pos - lastNewline };
}

function parseWithLocation(text: string): { value: unknown; error: ParseError | null } {
  try {
    return { value: JSON.parse(text), error: null };
  } catch (e) {
    const message = (e as Error).message;
    const posMatch = message.match(/position (\d+)/i);
    const lineColMatch = message.match(/line (\d+) column (\d+)/i);
    if (lineColMatch) {
      return { value: undefined, error: { message, line: Number(lineColMatch[1]), column: Number(lineColMatch[2]) } };
    }
    if (posMatch) {
      const { line, column } = lineColFromPosition(text, Number(posMatch[1]));
      return { value: undefined, error: { message, line, column } };
    }
    return { value: undefined, error: { message, line: null, column: null } };
  }
}

function typeColor(v: unknown): string {
  if (v === null) return 'var(--fg-3)';
  switch (typeof v) {
    case 'string': return 'var(--green)';
    case 'number': return 'var(--blue)';
    case 'boolean': return 'var(--purple)';
    default: return 'var(--fg-0)';
  }
}

function displayValue(v: unknown): string {
  if (v === null) return 'null';
  if (typeof v === 'string') return `"${v}"`;
  return String(v);
}

function TreeNode({ label, value, depth }: { label: string; value: unknown; depth: number }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const isObject = value !== null && typeof value === 'object' && !Array.isArray(value);
  const isArray = Array.isArray(value);

  if (!isObject && !isArray) {
    return (
      <div style={{ paddingLeft: depth * 16, fontFamily: 'var(--f-mono)', fontSize: 12.5, lineHeight: 1.7 }}>
        <span style={{ color: 'var(--fg-2)' }}>{label}: </span>
        <span style={{ color: typeColor(value) }}>{displayValue(value)}</span>
      </div>
    );
  }

  const entries = isArray
    ? (value as unknown[]).map((v, i) => [String(i), v] as const)
    : Object.entries(value as Record<string, unknown>);
  const bracket = isArray ? ['[', ']'] : ['{', '}'];
  const count = entries.length;

  return (
    <div style={{ paddingLeft: depth * 16, fontFamily: 'var(--f-mono)', fontSize: 12.5, lineHeight: 1.7 }}>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', gap: 4, color: 'inherit', font: 'inherit' }}
        aria-expanded={expanded}
      >
        <span style={{ color: 'var(--fg-3)', width: 10, display: 'inline-block' }}>{expanded ? '▾' : '▸'}</span>
        <span style={{ color: 'var(--fg-2)' }}>{label}: </span>
        <span style={{ color: 'var(--fg-3)' }}>
          {bracket[0]}{!expanded && `${count} item${count === 1 ? '' : 's'}`}{!expanded && bracket[1]}
        </span>
      </button>
      {expanded && (
        <>
          {entries.map(([k, v]) => (
            <TreeNode key={k} label={isArray ? `[${k}]` : k} value={v} depth={depth + 1} />
          ))}
          <div style={{ paddingLeft: 16, color: 'var(--fg-3)' }}>{bracket[1]}</div>
        </>
      )}
    </div>
  );
}

export default function JsonEditorClient() {
  const [input, setInput] = useState(SAMPLE);
  const [copied, setCopied] = useState(false);

  const { value, error } = useMemo(() => parseWithLocation(input), [input]);

  const format = () => {
    if (error || value === undefined) return;
    setInput(JSON.stringify(value, null, 2));
  };

  const minify = () => {
    if (error || value === undefined) return;
    setInput(JSON.stringify(value));
  };

  const copy = () => {
    navigator.clipboard.writeText(input).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">JSON</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={format} disabled={!!error} className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm">Format</button>
          <button type="button" onClick={minify} disabled={!!error} className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm">Minify</button>
          <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>{copied ? 'Copied' : 'Copy'}</button>
        </div>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste or edit JSON…"
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)', minHeight: 220 }}
        spellCheck={false}
        aria-label="JSON editor"
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">
          {error ? 'Invalid JSON' : 'Valid JSON'}
        </span>
      </div>
      <div className="tb-v2-tool-output-body">
        {error ? (
          <p className="tb-v2-error" role="alert">
            <strong>Syntax error{error.line !== null ? ` at line ${error.line}, column ${error.column}` : ''}:</strong> {error.message}
          </p>
        ) : value === undefined ? (
          <p className="tb-v2-empty">Nothing to show yet.</p>
        ) : (
          <TreeNode label="root" value={value} depth={0} />
        )}
      </div>
    </div>
  );
}
