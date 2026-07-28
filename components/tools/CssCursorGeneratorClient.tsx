"use client";
import { useState } from 'react';

const CURSORS = [
  'auto', 'default', 'none', 'context-menu', 'help', 'pointer', 'progress',
  'wait', 'cell', 'crosshair', 'text', 'vertical-text', 'alias', 'copy',
  'move', 'no-drop', 'not-allowed', 'grab', 'grabbing', 'e-resize',
  'n-resize', 'ne-resize', 'nw-resize', 's-resize', 'se-resize',
  'sw-resize', 'w-resize', 'col-resize', 'row-resize', 'all-scroll',
  'zoom-in', 'zoom-out',
];

export default function CssCursorGeneratorClient() {
  const [selected, setSelected] = useState('pointer');
  const [customUrl, setCustomUrl] = useState('');
  const [hotspotX, setHotspotX] = useState(0);
  const [hotspotY, setHotspotY] = useState(0);
  const [copied, setCopied] = useState(false);

  const cursorValue = selected === 'custom' && customUrl
    ? `url(${customUrl}) ${hotspotX} ${hotspotY}, auto` : selected;

  const cssCode = `cursor: ${cursorValue};`;

  const copy = () => {
    navigator.clipboard.writeText(cssCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Select Cursor</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
        {CURSORS.map(c => (
          <button key={c} onClick={() => setSelected(c)}
            className={`tb-v2-mode-tab ${selected === c ? 'on' : ''}`}
            style={{ fontSize: '0.7rem', padding: '0.5rem', textAlign: 'center' }}>
            {c}
          </button>
        ))}
        <button onClick={() => setSelected('custom')}
          className={`tb-v2-mode-tab ${selected === 'custom' ? 'on' : ''}`}
          style={{ fontSize: '0.7rem', padding: '0.5rem' }}>Custom URL</button>
      </div>
      {selected === 'custom' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
          <div style={{ gridColumn: 'span 3' }}>
            <label className="tb-v2-tool-label">Cursor URL</label>
            <input value={customUrl} onChange={e => setCustomUrl(e.target.value)}
              className="tb-v2-tool-textarea" placeholder="https://example.com/cursor.png" />
          </div>
          <div>
            <label className="tb-v2-tool-label">Hotspot X</label>
            <input type="number" value={hotspotX} onChange={e => setHotspotX(+e.target.value)}
              className="tb-v2-tool-textarea" />
          </div>
          <div>
            <label className="tb-v2-tool-label">Hotspot Y</label>
            <input type="number" value={hotspotY} onChange={e => setHotspotY(+e.target.value)}
              className="tb-v2-tool-textarea" />
          </div>
        </div>
      )}
      <div style={{ padding: '2rem', background: '#f3f4f6', borderRadius: '8px', textAlign: 'center', cursor: cursorValue, marginBottom: '1rem' }}>
        <p style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Hover over this area</p>
        <p style={{ color: '#6b7280', margin: '0.5rem 0 0' }}>Current: {cursorValue}</p>
      </div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">CSS</span>
        <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre style={{ background: '#1a1a2e', color: '#a5f3fc', padding: '1rem', borderRadius: '8px',
        fontFamily: 'monospace', fontSize: '0.875rem' }}>{cssCode}</pre>
    </div>
  );
}
