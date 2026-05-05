'use client';

import { useState } from 'react';

export default function BorderClient() {
  const [width, setWidth] = useState('2');
  const [style, setStyle] = useState<'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge'>('solid');
  const [color, setColor] = useState('#000000');
  const [radius, setRadius] = useState('0');
  const [previewText, setPreviewText] = useState('Border Preview');

  const cssValue = `${width}px ${style} ${color}`;
  const combinedCss = {
    border: cssValue,
    borderRadius: `${radius}px`,
  };

  const copyCss = () => {
    navigator.clipboard.writeText(`border: ${cssValue}; border-radius: ${radius}px;`);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Border Generator</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div>
          <label className="tb-v2-hint">Width (px)</label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            min="0"
            max="20"
            className="tb-v2-tool-input"
            aria-label="Border width"
          />
        </div>
        <div>
          <label className="tb-v2-hint">Style</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value as typeof style)}
            className="tb-v2-select"
          >
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
            <option value="double">Double</option>
            <option value="groove">Groove</option>
            <option value="ridge">Ridge</option>
          </select>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div>
          <label className="tb-v2-hint">Color</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="tb-v2-color-input"
            aria-label="Border color"
          />
        </div>
        <div>
          <label className="tb-v2-hint">Border Radius (px)</label>
          <input
            type="number"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            min="0"
            max="50"
            className="tb-v2-tool-input"
            aria-label="Border radius"
          />
        </div>
      </div>
      <div style={{ marginBottom: '0.75rem' }}>
        <label className="tb-v2-hint">Preview Text</label>
        <input
          type="text"
          value={previewText}
          onChange={(e) => setPreviewText(e.target.value)}
          className="tb-v2-tool-input"
          aria-label="Preview text"
        />
      </div>
      <div style={{ margin: '0.75rem 0' }}>
        <button type="button" onClick={copyCss} className="tb-v2-copy-btn">
          Copy CSS
        </button>
      </div>
      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Preview</span>
      </div>
      <div className="tb-v2-tool-output-body" style={{ textAlign: 'center' }}>
        <div
          style={{
            ...combinedCss,
            padding: '2rem',
            backgroundColor: '#f8f9fa',
            display: 'inline-block',
            minWidth: '200px',
          }}
        >
          {previewText || 'Border Preview'}
        </div>
        <p className="tb-v2-hint" style={{ marginTop: '1rem', fontFamily: 'var(--f-mono)', fontSize: '0.875rem' }}>
          {cssValue}
        </p>
      </div>
    </div>
  );
}
