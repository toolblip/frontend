'use client';

import { useState, useCallback } from 'react';

interface Variable {
  id: string;
  name: string;
  value: string;
}

let _nextId = 0;
const mkId = () => `var-${++_nextId}`;

function defaultVariables(): Variable[] {
  return [
    { id: mkId(), name: 'primary-color', value: '#7c3aed' },
    { id: mkId(), name: 'spacing-md', value: '16px' },
    { id: mkId(), name: 'font-family-base', value: "'Inter', sans-serif" },
  ];
}

function isColorValue(value: string): boolean {
  return /^#[0-9a-f]{3,8}$/i.test(value.trim());
}

function slugifyName(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function buildCss(vars: Variable[]): string {
  const lines = vars
    .filter(v => v.name.trim())
    .map(v => `  --${slugifyName(v.name)}: ${v.value};`)
    .join('\n');
  return `:root {\n${lines}\n}`;
}

export default function CssVariableGeneratorClient() {
  const [vars, setVars] = useState<Variable[]>(defaultVariables);
  const [copied, setCopied] = useState(false);

  const css = buildCss(vars);

  const updateVar = useCallback((id: string, patch: Partial<Variable>) => {
    setVars(prev => prev.map(v => (v.id === id ? { ...v, ...patch } : v)));
  }, []);

  const addVar = useCallback(() => {
    setVars(prev => [...prev, { id: mkId(), name: '', value: '' }]);
  }, []);

  const removeVar = useCallback((id: string) => {
    setVars(prev => (prev.length > 1 ? prev.filter(v => v.id !== id) : prev));
  }, []);

  const copy = () => {
    navigator.clipboard.writeText(css).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">CSS Custom Properties</span>
        <button type="button" onClick={addVar} className="tb-v2-btn-sm">+ Add Variable</button>
      </div>

      <div className="flex flex-col gap-2">
        {vars.map(v => (
          <div key={v.id} className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
            <span className="text-gray-400" style={{ fontFamily: 'var(--f-mono)' }}>--</span>
            <input
              type="text"
              value={v.name}
              onChange={e => updateVar(v.id, { name: e.target.value })}
              placeholder="variable-name"
              className="tb-v2-input"
              style={{ flex: 1, fontFamily: 'var(--f-mono)' }}
            />
            <input
              type="text"
              value={v.value}
              onChange={e => updateVar(v.id, { value: e.target.value })}
              placeholder="value"
              className="tb-v2-input"
              style={{ flex: 1, fontFamily: 'var(--f-mono)' }}
            />
            {isColorValue(v.value) && (
              <input
                type="color"
                value={v.value}
                onChange={e => updateVar(v.id, { value: e.target.value })}
                style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid var(--line)', flexShrink: 0 }}
              />
            )}
            <button
              type="button"
              onClick={() => removeVar(v.id)}
              disabled={vars.length <= 1}
              className="text-gray-500 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed text-xl leading-none shrink-0"
              aria-label="Remove variable"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">CSS Output</span>
        <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'var(--f-mono)', fontSize: 13 }}>{css}</pre>
      </div>
    </div>
  );
}
