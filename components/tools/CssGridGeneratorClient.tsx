"use client";
import { useState, useCallback } from 'react';

export default function CssGridGeneratorClient() {
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(3);
  const [gap, setGap] = useState(10);
  const [colTemplate, setColTemplate] = useState('1fr 1fr 1fr');
  const [rowTemplate, setRowTemplate] = useState('auto auto auto');
  const [copied, setCopied] = useState(false);

  const css = `.grid-container {
  display: grid;
  grid-template-columns: ${colTemplate};
  grid-template-rows: ${rowTemplate};
  gap: ${gap}px;
}`;

  const previewStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: colTemplate,
    gridTemplateRows: rowTemplate,
    gap: `${gap}px`,
  };

  const cells = Array.from({ length: cols * rows }, (_, i) => i + 1);

  const copy = () => {
    navigator.clipboard.writeText(css).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Grid Settings</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
        <div>
          <label className="tb-v2-tool-label">Columns: {cols}</label>
          <input type="range" min={1} max={8} value={cols}
            onChange={e => { setCols(+e.target.value);
              setColTemplate(Array(+e.target.value).fill('1fr').join(' ')); }}
            className="w-full" />
        </div>
        <div>
          <label className="tb-v2-tool-label">Rows: {rows}</label>
          <input type="range" min={1} max={8} value={rows}
            onChange={e => { setRows(+e.target.value);
              setRowTemplate(Array(+e.target.value).fill('auto').join(' ')); }}
            className="w-full" />
        </div>
        <div>
          <label className="tb-v2-tool-label">Gap: {gap}px</label>
          <input type="range" min={0} max={40} value={gap}
            onChange={e => setGap(+e.target.value)}
            className="w-full" />
        </div>
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <label className="tb-v2-tool-label">Column Template</label>
        <input value={colTemplate} onChange={e => setColTemplate(e.target.value)}
          className="tb-v2-tool-textarea" style={{ padding: '0.5rem', fontFamily: 'monospace' }} />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label className="tb-v2-tool-label">Row Template</label>
        <input value={rowTemplate} onChange={e => setRowTemplate(e.target.value)}
          className="tb-v2-tool-textarea" style={{ padding: '0.5rem', fontFamily: 'monospace' }} />
      </div>
      <div style={{ padding: '1rem', background: '#f3f4f6', borderRadius: '8px', marginBottom: '1rem' }}>
        <div style={previewStyle}>
          {cells.map(i => (
            <div key={i} style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: '4px', padding: '1rem', color: '#fff', textAlign: 'center',
              fontWeight: 600, fontSize: '0.875rem',
            }}>{i}</div>
          ))}
        </div>
      </div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">CSS</span>
        <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre style={{ background: '#1a1a2e', color: '#a5f3fc', padding: '1rem', borderRadius: '8px',
        fontFamily: 'monospace', fontSize: '0.875rem', overflowX: 'auto' }}>{css}</pre>
    </div>
  );
}
