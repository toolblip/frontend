"use client";
import { useState, useMemo } from 'react';

type Convention = 'kebab' | 'camel' | 'snake' | 'pascal' | 'bem';

function toKebab(s: string) {
  return s.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[_\s]+/g, '-').toLowerCase();
}
function toCamel(s: string) {
  return s.replace(/[-_\s]+(.)/g, (_, c) => c.toUpperCase()).replace(/^./, c => c.toLowerCase());
}
function toSnake(s: string) {
  return toKebab(s).replace(/-/g, '_');
}
function toPascal(s: string) {
  return toCamel(s).replace(/^./, c => c.toUpperCase());
}
function toBEM(s: string) {
  const base = toKebab(s);
  return `${base}__element--modifier`;
}

export default function CssNamingConventionClient() {
  const [input, setInput] = useState('myComponentName');
  const [convention, setConvention] = useState<Convention>('kebab');

  const converters: Record<Convention, (s: string) => string> = {
    kebab: toKebab, camel: toCamel, snake: toSnake, pascal: toPascal, bem: toBEM,
  };

  const result = useMemo(() => {
    try { return converters[convention](input); }
    catch { return 'Error'; }
  }, [input, convention]);

  const allFormats = useMemo(() => ({
    kebab: toKebab(input), camel: toCamel(input), snake: toSnake(input),
    pascal: toPascal(input), bem: toBEM(input),
  }), [input]);

  const copy = (val: string) => {
    navigator.clipboard.writeText(val).catch(() => {});
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Input Name</span>
      </div>
      <input value={input} onChange={e => setInput(e.target.value)}
        className="tb-v2-tool-textarea" style={{ padding: '0.75rem', fontFamily: 'monospace' }}
        placeholder="Enter a CSS class name..." />
      <div className="tb-v2-tool-input-head" style={{ marginTop: '1rem' }}>
        <span className="tb-v2-tool-label">Target Convention</span>
      </div>
      <div className="tb-v2-mode-tabs" role="tablist">
        {(['kebab', 'camel', 'snake', 'pascal', 'bem'] as Convention[]).map(c => (
          <button key={c} role="tab" aria-selected={convention === c}
            onClick={() => setConvention(c)}
            className={`tb-v2-mode-tab ${convention === c ? 'on' : ''}`}>
            {c.toUpperCase()}
          </button>
        ))}
      </div>
      <div style={{ marginTop: '1rem', padding: '1rem', background: '#f3f4f6', borderRadius: '8px' }}>
        <p style={{ fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>{result}</p>
      </div>
      <div className="tb-v2-tool-input-head" style={{ marginTop: '1rem' }}>
        <span className="tb-v2-tool-label">All Formats</span>
      </div>
      {(Object.entries(allFormats) as [Convention, string][]).map(([name, val]) => (
        <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#6b7280', width: '80px' }}>{name}</span>
          <span style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>{val}</span>
          <button type="button" onClick={() => copy(val)}
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#667eea' }}>Copy</button>
        </div>
      ))}
    </div>
  );
}
