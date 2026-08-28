'use client';

import { useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE = `{
  "name": "toolblip",
  "tools": ["json", "yaml"],
  "version": 1
}`;

function toYaml(obj: unknown, depth = 0, indentSize = 2): string {
  const pad = ' '.repeat(depth * indentSize);
  if (obj === null) return 'null';
  if (obj === undefined) return '';
  if (typeof obj === 'string') return obj.includes(':') || obj.includes('#') || obj.includes("'") || obj.includes('"') || obj.includes('\n') ? `"${obj.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"` : obj;
  if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj);
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]';
    return obj.map(item => {
      const val = toYaml(item, depth + 1, indentSize);
      if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
        const lines = val.split('\n');
        return `${pad}- ${lines[0]}\n${lines.slice(1).join('\n')}`;
      }
      return `${pad}- ${val}`;
    }).join('\n');
  }
  const entries = Object.entries(obj as Record<string, unknown>);
  if (entries.length === 0) return '{}';
  return entries.map(([key, value]) => {
    const val = toYaml(value, depth + 1, indentSize);
    if (typeof value === 'object' && value !== null) {
      return `${pad}${key}:\n${val}`;
    }
    return `${pad}${key}: ${val}`;
  }).join('\n');
}

function convert(input: string, indent: number): { result: string; error: string } {
  if (!input.trim()) return { result: '', error: '' };
  try {
    const parsed = JSON.parse(input);
    return { result: toYaml(parsed, 0, indent), error: '' };
  } catch (e) {
    return { result: '', error: e instanceof Error ? e.message : 'Invalid JSON' };
  }
}

export default function JsonToYamlClient() {
  const [input, setInput] = useState('');
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);

  const { result, error } = useMemo(() => convert(input, indent), [input, indent]);

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">JSON</span>
        <ToolExampleClearActions
          onExample={() => setInput(EXAMPLE)}
          onClear={() => setInput('')}
          canClear={input.length > 0}
        />
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste JSON here..."
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label="JSON input"
      />

      <div
        style={{
          display: 'flex',
          gap: 12,
          padding: '12px 20px',
          flexWrap: 'wrap',
          alignItems: 'center',
          borderTop: '1px solid var(--line)',
        }}
      >
        <label style={{ fontSize: 13, color: 'var(--tb-text-secondary)' }}>Indent</label>
        <div className="tb-v2-mode-tabs" role="group" aria-label="Indent size">
          {[2, 4].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setIndent(n)}
              className={`tb-v2-mode-tab ${indent === n ? 'on' : ''}`}
              aria-pressed={indent === n}
            >
              {n} spaces
            </button>
          ))}
        </div>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">YAML</span>
        {result ? (
          <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        ) : null}
      </div>
      <div className="tb-v2-tool-output-body">
        {error ? (
          <p className="tb-v2-error" role="alert">
            {error}
          </p>
        ) : (
          <pre className="tb-v2-tool-pre">{result || ' - '}</pre>
        )}
      </div>
    </div>
  );
}
