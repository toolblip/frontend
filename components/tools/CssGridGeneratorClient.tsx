'use client';

import { useState, useMemo } from 'react';

const PRESETS = [
  { name: '2 Column', cols: 2, rows: 1, gap: 16 },
  { name: '3 Column', cols: 3, rows: 1, gap: 16 },
  { name: 'Sidebar', cols: '250px 1fr', rows: 1, gap: 16 },
  { name: 'Holy Grail', cols: '200px 1fr 200px', rows: '60px 1fr 40px', gap: 8 },
  { name: 'Card Grid', cols: 'repeat(auto-fill, minmax(250px, 1fr))', rows: 'auto', gap: 20 },
  { name: 'Dashboard', cols: 'repeat(4, 1fr)', rows: 'repeat(3, 100px)', gap: 12 },
];

export default function CssGridGeneratorClient() {
  const [columns, setColumns] = useState('3');
  const [rows, setRows] = useState('2');
  const [gap, setGap] = useState('16');
  const [columnGap, setColumnGap] = useState('');
  const [rowGap, setRowGap] = useState('');
  const [copied, setCopied] = useState(false);

  const css = useMemo(() => {
    const gapValue = columnGap || rowGap
      ? `${rowGap || gap}px ${columnGap || gap}px`
      : `${gap}px`;

    return `.grid-container {
  display: grid;
  grid-template-columns: ${columns.includes('px') || columns.includes('minmax') || columns.includes('repeat') ? columns : `repeat(${columns}, 1fr)`};
  grid-template-rows: ${rows.includes('px') || rows.includes('minmax') || rows.includes('repeat') ? rows : `repeat(${rows}, 1fr)`};
  gap: ${gapValue};
}`;
  }, [columns, rows, gap, columnGap, rowGap]);

  const html = useMemo(() => {
    const cols = columns.includes('px') || columns.includes('minmax') || columns.includes('repeat')
      ? 3
      : parseInt(columns) || 3;
    const rowsCount = rows.includes('px') || rows.includes('minmax') || rows.includes('repeat')
      ? 2
      : parseInt(rows) || 2;

    let items = '';
    for (let i = 1; i <= cols * rowsCount; i++) {
      items += `  <div class="grid-item">Item ${i}</div>\n`;
    }
    return `<div class="grid-container">
${items}</div>`;
  }, [columns, rows]);

  const copy = () => {
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const loadPreset = (preset: typeof PRESETS[0]) => {
    setColumns(String(preset.cols));
    setRows(String(preset.rows));
    setGap(String(preset.gap));
    setColumnGap('');
    setRowGap('');
  };

  return (
    <div>
      {/* Presets */}
      <div>
        <label className="tb-v2-tool-label">Quick Presets</label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => loadPreset(p)}
              className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid controls */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className="tb-v2-tool-label">Columns</label>
          <input
            type="text"
            value={columns}
            onChange={e => setColumns(e.target.value)}
            className="tb-v2-input"
            placeholder="3"
          />
        </div>
        <div>
          <label className="tb-v2-tool-label">Rows</label>
          <input
            type="text"
            value={rows}
            onChange={e => setRows(e.target.value)}
            className="tb-v2-input"
            placeholder="2"
          />
        </div>
        <div>
          <label className="tb-v2-tool-label">Gap</label>
          <input
            type="number"
            value={gap}
            onChange={e => setGap(e.target.value)}
            className="tb-v2-input"
            placeholder="16"
          />
        </div>
        <div>
          <label className="tb-v2-tool-label">Gap (px)</label>
          <div className="text-xs text-gray-500">Row: {gap} Col: {gap}</div>
        </div>
      </div>

      {/* Preview */}
      <div>
        <label className="tb-v2-tool-label">Preview</label>
        <div
          className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
          style={{
            display: 'grid',
            gridTemplateColumns: columns.includes('px') || columns.includes('minmax') || columns.includes('repeat') ? columns : `repeat(${columns}, 1fr)`,
            gridTemplateRows: rows.includes('px') || rows.includes('minmax') || rows.includes('repeat') ? rows : `repeat(${rows}, 1fr)`,
            gap: `${gap}px`,
            minHeight: 200,
          }}
        >
          {Array.from({ length: (parseInt(columns) || 3) * (parseInt(rows) || 2) }).map((_, i) => (
            <div
              key={i}
              className="bg-indigo-100 dark:bg-indigo-900/30 border-2 border-dashed border-indigo-300 dark:border-indigo-700 rounded-lg flex items-center justify-center text-sm text-indigo-600 dark:text-indigo-400"
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* CSS Output */}
      <div>
        <div className="tb-v2-tool-output-head">
          <span className="tb-v2-tool-label">CSS</span>
          <button onClick={copy} className="tb-v2-copy-btn">
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="tb-v2-tool-output-body">
          <pre className="tb-v2-tool-pre">{css}</pre>
        </div>
      </div>

      {/* HTML Output */}
      <div>
        <div className="tb-v2-tool-output-head">
          <span className="tb-v2-tool-label">HTML</span>
          <button
            onClick={() => { navigator.clipboard.writeText(html); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
            className="tb-v2-copy-btn"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="tb-v2-tool-output-body">
          <pre className="tb-v2-tool-pre">{html}</pre>
        </div>
      </div>
    </div>
  );
}
