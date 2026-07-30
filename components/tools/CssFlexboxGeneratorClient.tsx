'use client';

import { useState, useMemo, type CSSProperties } from 'react';

const DIRECTIONS = ['row', 'row-reverse', 'column', 'column-reverse'];
const JUSTIFY = ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'];
const ALIGN = ['stretch', 'flex-start', 'flex-end', 'center', 'baseline'];
const WRAP = ['nowrap', 'wrap', 'wrap-reverse'];

function buildCss(direction: string, justify: string, align: string, wrap: string, gap: number): string {
  return `.container {\n  display: flex;\n  flex-direction: ${direction};\n  justify-content: ${justify};\n  align-items: ${align};\n  flex-wrap: ${wrap};\n  gap: ${gap}px;\n}`;
}

export default function CssFlexboxGeneratorClient() {
  const [direction, setDirection] = useState('row');
  const [justify, setJustify] = useState('flex-start');
  const [align, setAlign] = useState('stretch');
  const [wrap, setWrap] = useState('nowrap');
  const [gap, setGap] = useState(8);
  const [itemCount, setItemCount] = useState(4);
  const [copied, setCopied] = useState(false);

  const css = useMemo(() => buildCss(direction, justify, align, wrap, gap), [direction, justify, align, wrap, gap]);

  const copy = () => {
    navigator.clipboard.writeText(css).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Flexbox Container</span>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col gap-1">
          <label className="tb-v2-tool-label">Direction</label>
          <select value={direction} onChange={e => setDirection(e.target.value)} className="tb-v2-input">
            {DIRECTIONS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="tb-v2-tool-label">Justify Content</label>
          <select value={justify} onChange={e => setJustify(e.target.value)} className="tb-v2-input">
            {JUSTIFY.map(j => <option key={j} value={j}>{j}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="tb-v2-tool-label">Align Items</label>
          <select value={align} onChange={e => setAlign(e.target.value)} className="tb-v2-input">
            {ALIGN.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="tb-v2-tool-label">Flex Wrap</label>
          <select value={wrap} onChange={e => setWrap(e.target.value)} className="tb-v2-input">
            {WRAP.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>
      </div>

      <div className="tb-v2-range-row">
        <label className="tb-v2-tool-label">Gap</label>
        <input type="range" min={0} max={40} value={gap} onChange={e => setGap(Number(e.target.value))} className="tb-v2-range" />
        <span className="tb-v2-range-val">{gap}px</span>
      </div>

      <div className="tb-v2-range-row">
        <label className="tb-v2-tool-label">Item Count</label>
        <input type="range" min={2} max={8} value={itemCount} onChange={e => setItemCount(Number(e.target.value))} className="tb-v2-range" />
        <span className="tb-v2-range-val">{itemCount}</span>
      </div>

      <div>
        <div className="tb-v2-tool-label" style={{ marginBottom: 8 }}>Live Preview</div>
        <div
          className="bg-gray-100 rounded-xl p-3"
          style={{
            display: 'flex',
            flexDirection: direction as CSSProperties['flexDirection'],
            justifyContent: justify,
            alignItems: align,
            flexWrap: wrap as CSSProperties['flexWrap'],
            gap,
            minHeight: 160,
          }}
        >
          {Array.from({ length: itemCount }, (_, i) => (
            <div
              key={i}
              className="bg-red-500 text-white text-sm flex items-center justify-center rounded-lg"
              style={{ width: 48, height: 48 }}
            >
              {i + 1}
            </div>
          ))}
        </div>
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
