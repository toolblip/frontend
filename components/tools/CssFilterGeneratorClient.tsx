"use client";
import { useState } from 'react';

export default function CssFilterGeneratorClient() {
  const [blur, setBlur] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturate, setSaturate] = useState(100);
  const [hueRotate, setHueRotate] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [invert, setInvert] = useState(0);
  const [copied, setCopied] = useState(false);

  const filterStr = [
    blur > 0 ? `blur(${blur}px)` : '',
    brightness !== 100 ? `brightness(${brightness}%)` : '',
    contrast !== 100 ? `contrast(${contrast}%)` : '',
    saturate !== 100 ? `saturate(${saturate}%)` : '',
    hueRotate > 0 ? `hue-rotate(${hueRotate}deg)` : '',
    sepia > 0 ? `sepia(${sepia}%)` : '',
    grayscale > 0 ? `grayscale(${grayscale}%)` : '',
    invert > 0 ? `invert(${invert}%)` : '',
  ].filter(Boolean).join(' ') || 'none';

  const cssCode = `filter: ${filterStr};`;

  const copy = () => {
    navigator.clipboard.writeText(cssCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const FilterSlider = ({ label, value, min, max, unit, onChange }: {
    label: string; value: number; min: number; max: number; unit: string;
    onChange: (v: number) => void;
  }) => (
    <div style={{ marginBottom: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <label className="tb-v2-tool-label">{label}</label>
        <span style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} value={value}
        onChange={e => onChange(+e.target.value)} className="w-full" />
    </div>
  );

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Filters</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem 1.5rem', marginBottom: '1rem' }}>
        <FilterSlider label="Blur" value={blur} min={0} max={20} unit="px" onChange={setBlur} />
        <FilterSlider label="Brightness" value={brightness} min={0} max={200} unit="%" onChange={setBrightness} />
        <FilterSlider label="Contrast" value={contrast} min={0} max={200} unit="%" onChange={setContrast} />
        <FilterSlider label="Saturate" value={saturate} min={0} max={200} unit="%" onChange={setSaturate} />
        <FilterSlider label="Hue Rotate" value={hueRotate} min={0} max={360} unit="°" onChange={setHueRotate} />
        <FilterSlider label="Sepia" value={sepia} min={0} max={100} unit="%" onChange={setSepia} />
        <FilterSlider label="Grayscale" value={grayscale} min={0} max={100} unit="%" onChange={setGrayscale} />
        <FilterSlider label="Invert" value={invert} min={0} max={100} unit="%" onChange={setInvert} />
      </div>
      <div style={{ borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem' }}>
        <img src="https://picsum.photos/600/300" alt="Sample" style={{
          width: '100%', height: '200px', objectFit: 'cover',
          filter: filterStr, display: 'block',
        }} />
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
