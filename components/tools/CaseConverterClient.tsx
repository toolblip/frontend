'use client';

import { useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const CASES = [
  { label: 'UPPER', key: 'upper' },
  { label: 'lower', key: 'lower' },
  { label: 'Title', key: 'title' },
  { label: 'Sentence', key: 'sentence' },
  { label: 'camelCase', key: 'camel' },
  { label: 'snake_case', key: 'snake' },
  { label: 'kebab-case', key: 'kebab' },
  { label: 'CONSTANT', key: 'constant' },
] as const;

type CaseKey = typeof CASES[number]['key'];

function tokenize(text: string): string[] {
  if (!text.trim()) return [];
  return text
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(/[\s_\-./]+/)
    .filter(Boolean);
}

function convert(text: string, key: CaseKey): string {
  if (!text) return '';
  switch (key) {
    case 'upper':
      return text.toUpperCase();
    case 'lower':
      return text.toLowerCase();
    case 'title':
      return text.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
    case 'sentence':
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    case 'camel': {
      const words = tokenize(text);
      if (words.length === 0) return '';
      return (
        words[0].toLowerCase() +
        words.slice(1).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('')
      );
    }
    case 'snake':
      return tokenize(text).map((w) => w.toLowerCase()).join('_');
    case 'kebab':
      return tokenize(text).map((w) => w.toLowerCase()).join('-');
    case 'constant':
      return tokenize(text).map((w) => w.toUpperCase()).join('_');
  }
}

export default function CaseConverterClient() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState<CaseKey | null>(null);

  const copy = (val: string, key: CaseKey) => {
    if (!val) return;
    navigator.clipboard.writeText(val).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Input</span>
        <ToolExampleClearActions
          onExample={() => setText('Hello World Example')}
          onClear={() => setText('')}
          canClear={text.length > 0}
        />
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text here..."
        className="tb-v2-tool-textarea"
        aria-label="Text input"
      />

      {!text.trim() && (
        <p className="tb-v2-empty">Type or paste text above to see it converted into every case at once.</p>
      )}

      {text.trim() && (
      <>
      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">All cases</span>
      </div>
      <div className="tb-v2-tool-output-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {CASES.map(({ label, key }) => {
          const val = convert(text, key);
          return (
            <div key={key} className="tb-v2-case-row">
              <span className="tb-v2-case-label">{label}</span>
              <span className="tb-v2-case-val" title={val}>
                {val || ' - '}
              </span>
              <button
                type="button"
                onClick={() => copy(val, key)}
                className={`tb-v2-copy-btn ${copied === key ? 'done' : ''}`}
                disabled={!val}
                aria-label={`Copy ${label}`}
              >
                {copied === key ? 'Copied' : 'Copy'}
              </button>
            </div>
          );
        })}
      </div>
      </>
      )}
    </div>
  );
}
