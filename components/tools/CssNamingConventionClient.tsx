'use client';

import { useState, useMemo } from 'react';

const EXAMPLE = `primary_button\nUserProfileCard\nnav-item-active\nmain content wrapper`;

function tokenize(raw: string): string[] {
  return raw
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map(w => w.toLowerCase());
}

function toKebab(words: string[]): string {
  return words.join('-');
}

function toSnake(words: string[]): string {
  return words.join('_');
}

function toCamel(words: string[]): string {
  return words.map((w, i) => (i === 0 ? w : w[0].toUpperCase() + w.slice(1))).join('');
}

function toPascal(words: string[]): string {
  return words.map(w => w[0].toUpperCase() + w.slice(1)).join('');
}

function toConstant(words: string[]): string {
  return words.join('_').toUpperCase();
}

function toBem(words: string[]): string {
  if (words.length <= 1) return words.join('-');
  return `${words[0]}__${words.slice(1).join('-')}`;
}

interface Conversion {
  original: string;
  kebab: string;
  camel: string;
  pascal: string;
  snake: string;
  constant: string;
  bem: string;
}

function convertLine(line: string): Conversion {
  const words = tokenize(line);
  return {
    original: line,
    kebab: toKebab(words),
    camel: toCamel(words),
    pascal: toPascal(words),
    snake: toSnake(words),
    constant: toConstant(words),
    bem: toBem(words),
  };
}

export default function CssNamingConventionClient() {
  const [input, setInput] = useState(EXAMPLE);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const results = useMemo(
    () => input.split('\n').map(l => l.trim()).filter(Boolean).map(convertLine),
    [input]
  );

  const loadExample = () => setInput(EXAMPLE);

  const copy = (key: string, value: string) => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(prev => (prev === key ? null : prev)), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Names (one per line)</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="primary_button&#10;UserProfileCard"
        className="tb-v2-tool-textarea"
      />

      {results.length === 0 ? (
        <p className="tb-v2-empty">Enter one or more names above to see naming convention conversions.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {results.map((r, i) => (
            <div key={i} className="bg-gray-100 rounded-xl p-4">
              <div className="tb-v2-tool-label" style={{ marginBottom: 8 }}>{r.original}</div>
              <div className="flex flex-col gap-1.5">
                {([
                  ['kebab-case', r.kebab],
                  ['camelCase', r.camel],
                  ['PascalCase', r.pascal],
                  ['snake_case', r.snake],
                  ['CONSTANT_CASE', r.constant],
                  ['BEM', r.bem],
                ] as const).map(([label, value]) => {
                  const key = `${i}-${label}`;
                  return (
                    <div key={key} className="flex items-center justify-between gap-3 bg-white rounded-lg px-3 py-1.5">
                      <span className="text-xs text-gray-500 w-28 shrink-0">{label}</span>
                      <code className="text-sm flex-1" style={{ fontFamily: 'var(--f-mono)' }}>{value}</code>
                      <button
                        type="button"
                        onClick={() => copy(key, value)}
                        className={`tb-v2-copy-btn ${copiedKey === key ? 'done' : ''}`}
                      >
                        {copiedKey === key ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
