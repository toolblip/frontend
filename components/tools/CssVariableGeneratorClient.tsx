"use client";
import { useState } from 'react';

interface CssVar {
  name: string;
  value: string;
  type: 'color' | 'size' | 'string' | 'number';
}

export default function CssVariableGeneratorClient() {
  const [vars, setVars] = useState<CssVar[]>([
    { name: '--primary', value: '#667eea', type: 'color' },
    { name: '--secondary', value: '#764ba2', type: 'color' },
    { name: '--spacing-sm', value: '8px', type: 'size' },
    { name: '--spacing-md', value: '16px', type: 'size' },
    { name: '--spacing-lg', value: '24px', type: 'size' },
    { name: '--font-family', value: 'system-ui, sans-serif', type: 'string' },
    { name: '--border-radius', value: '8px', type: 'size' },
  ]);
  const [scope, setScope] = useState(':root');
  const [copied, setCopied] = useState(false);

  const css = `${scope} {
${vars.map(v => `  ${v.name}: ${v.value};`).join('\n')}
}`;

  const addVar = () => {
    setVars([...vars, { name: '--new-variable', value: '#000000', type: 'color' }]);
  };

  const removeVar = (idx: number) => {
    setVars(vars.filter((_, i) => i !== idx));
  };

  const updateVar = (idx: number, field: keyof CssVar, val: string) => {
    setVars(vars.map((v, i) => i === idx ? { ...v, [field]: val } : v));
  };

  const copy = () => {
    navigator.clipboard.writeText(css).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">CSS Variables</span>
        <button type="button" onClick={addVar}
          className="tb-v2-copy-btn" style={{ background: '#667eea' }}>+ Add</button>
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <label className="tb-v2-tool-label">Scope</label>
        <input value={scope} onChange={e => setScope(e.target.value)}
          className="tb-v2-tool-textarea" style={{ padding: '0.5rem', fontFamily: 'monospace', width: '200px' }} />
      </div>
      {vars.map((v, i) => (
        <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
          <input value={v.name} onChange={e => updateVar(i, 'name', e.target.value)}
            className="tb-v2-tool-textarea" style={{ padding: '0.25rem', fontFamily: 'monospace', flex: 1, fontSize: '0.75rem' }} />
          {v.type === 'color' ? (
            <input type="color" value={v.value} onChange={e => updateVar(i, 'value', e.target.value)}
              style={{ width: '40px', height: '32px', border: 'none', borderRadius: '4px', cursor: 'pointer' }} />
          ) : (
            <input value={v.value} onChange={e => updateVar(i, 'value', e.target.value)}
              className="tb-v2-tool-textarea" style={{ padding: '0.25rem', fontFamily: 'monospace', flex: 1, fontSize: '0.75rem' }} />
          )}
          <select value={v.type} onChange={e => updateVar(i, 'type', e.target.value)}
            className="tb-v2-tool-textarea" style={{ padding: '0.25rem', fontSize: '0.75rem', width: '80px' }}>
            <option value="color">color</option>
            <option value="size">size</option>
            <option value="string">string</option>
            <option value="number">number</option>
          </select>
          <button type="button" onClick={() => removeVar(i)}
            style={{ color: '#ef4444', cursor: 'pointer', border: 'none', background: 'none', fontSize: '1.25rem' }}>×</button>
        </div>
      ))}
      <div className="tb-v2-tool-input-head" style={{ marginTop: '1rem' }}>
        <span className="tb-v2-tool-label">Generated CSS</span>
        <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre style={{ background: '#1a1a2e', color: '#a5f3fc', padding: '1rem', borderRadius: '8px',
        fontFamily: 'monospace', fontSize: '0.875rem', overflowX: 'auto' }}>{css}</pre>
    </div>
  );
}
