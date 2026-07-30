'use client';

import { useState } from 'react';

export default function BorderClient() {
  const [width, setWidth] = useState('2');
  const [style, setStyle] = useState<'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge'>('solid');
  const [color, setColor] = useState('#000000');
  const [radius, setRadius] = useState('0');
  const [previewText, setPreviewText] = useState('Border Preview');
  const [copied, setCopied] = useState(false);

  const cssValue = `${width}px ${style} ${color}`;
  const combinedCss = {
    border: cssValue,
    borderRadius: `${radius}px`,
  };

  const loadExample = () => {
    setWidth('4');
    setStyle('dashed');
    setColor('#6366f1');
    setRadius('12');
    setPreviewText('Border Preview');
  };

  const copyCss = () => {
    navigator.clipboard.writeText(`border: ${cssValue};\nborder-radius: ${radius}px;`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Border Generator</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Width (px)</label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            min="0"
            max="20"
            className="tb-v2-input"
            aria-label="Border width"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Style</label>
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
          <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Color</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{ width: '100%', height: 40, borderRadius: 8, border: '1px solid var(--tb-border)', cursor: 'pointer' }}
            aria-label="Border color"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Border Radius (px)</label>
          <input
            type="number"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            min="0"
            max="50"
            className="tb-v2-input"
            aria-label="Border radius"
          />
        </div>
      </div>
      <div style={{ marginBottom: '0.75rem' }}>
        <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Preview Text</label>
        <input
          type="text"
          value={previewText}
          onChange={(e) => setPreviewText(e.target.value)}
          className="tb-v2-input"
          aria-label="Preview text"
        />
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Preview</span>
        <button type="button" onClick={copyCss} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy CSS'}
        </button>
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
        <p className="text-xs text-gray-500 dark:text-gray-400" style={{ marginTop: '1rem', fontFamily: 'var(--f-mono)' }}>
          border: {cssValue}; border-radius: {radius}px;
        </p>
      </div>
    </div>
  );
}
