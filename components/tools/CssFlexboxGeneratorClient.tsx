"use client";
import { useState } from 'react';

type Direction = 'row' | 'column' | 'row-reverse' | 'column-reverse';
type Wrap = 'nowrap' | 'wrap' | 'wrap-reverse';
type Justify = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
type Align = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';

export default function CssFlexboxGeneratorClient() {
  const [direction, setDirection] = useState<Direction>('row');
  const [wrap, setWrap] = useState<Wrap>('wrap');
  const [justify, setJustify] = useState<Justify>('flex-start');
  const [align, setAlign] = useState<Align>('stretch');
  const [gap, setGap] = useState(10);
  const [copied, setCopied] = useState(false);

  const css = `.flex-container {
  display: flex;
  flex-direction: ${direction};
  flex-wrap: ${wrap};
  justify-content: ${justify};
  align-items: ${align};
  gap: ${gap}px;
}`;

  const previewStyle: React.CSSProperties = {
    display: 'flex', flexDirection: direction, flexWrap: wrap,
    justifyContent: justify, alignItems: align, gap: `${gap}px`,
    background: '#f3f4f6', borderRadius: '8px', padding: '1rem', minHeight: '150px',
  };

  const items = [1, 2, 3, 4, 5];

  const copy = () => {
    navigator.clipboard.writeText(css).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const SelectField = ({ label, value, options, onChange }: {
    label: string; value: string; options: string[];
    onChange: (v: string) => void;
  }) => (
    <div>
      <label className="tb-v2-tool-label">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="tb-v2-tool-textarea" style={{ padding: '0.5rem' }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Flexbox Settings</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
        <SelectField label="Direction" value={direction}
          options={['row', 'column', 'row-reverse', 'column-reverse']}
          onChange={v => setDirection(v as Direction)} />
        <SelectField label="Wrap" value={wrap}
          options={['nowrap', 'wrap', 'wrap-reverse']}
          onChange={v => setWrap(v as Wrap)} />
        <SelectField label="Justify Content" value={justify}
          options={['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly']}
          onChange={v => setJustify(v as Justify)} />
        <SelectField label="Align Items" value={align}
          options={['flex-start', 'flex-end', 'center', 'stretch', 'baseline']}
          onChange={v => setAlign(v as Align)} />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label className="tb-v2-tool-label">Gap: {gap}px</label>
        <input type="range" min={0} max={40} value={gap}
          onChange={e => setGap(+e.target.value)} className="w-full" />
      </div>
      <div style={previewStyle}>
        {items.map(i => (
          <div key={i} style={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            borderRadius: '4px', padding: '1rem', color: '#fff',
            fontWeight: 600, minWidth: '60px', textAlign: 'center',
          }}>{i}</div>
        ))}
      </div>
      <div className="tb-v2-tool-input-head" style={{ marginTop: '1rem' }}>
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
