"use client";
import { useState, useCallback } from 'react';

type GradientType = 'linear' | 'radial' | 'conic';

export default function GradientGeneratorClient() {
  const [type, setType] = useState<GradientType>('linear');
  const [angle, setAngle] = useState(135);
  const [color1, setColor1] = useState('#667eea');
  const [color2, setColor2] = useState('#764ba2');
  const [color3, setColor3] = useState('');
  const [pos1, setPos1] = useState(0);
  const [pos2, setPos2] = useState(100);
  const [pos3, setPos3] = useState(50);
  const [copied, setCopied] = useState(false);

  const buildGradient = useCallback(() => {
    const stops = [{ color: color1, pos: pos1 }];
    if (color3) stops.push({ color: color3, pos: pos3 });
    stops.push({ color: color2, pos: pos2 });
    const stopStr = stops.map(s => `${s.color} ${s.pos}%`).join(', ');
    if (type === 'linear') return `linear-gradient(${angle}deg, ${stopStr})`;
    if (type === 'radial') return `radial-gradient(circle, ${stopStr})`;
    return `conic-gradient(${stopStr})`;
  }, [type, angle, color1, color2, color3, pos1, pos2, pos3]);

  const gradient = buildGradient();
  const cssCode = `background: ${gradient};`;

  const copy = () => {
    navigator.clipboard.writeText(cssCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Gradient Type</span>
      </div>
      <div className="tb-v2-mode-tabs" role="tablist">
        {(['linear', 'radial', 'conic'] as GradientType[]).map(t => (
          <button key={t} role="tab" aria-selected={type === t}
            onClick={() => setType(t)}
            className={`tb-v2-mode-tab ${type === t ? 'on' : ''}`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      {type === 'linear' && (
        <div style={{ marginTop: '0.75rem' }}>
          <label className="tb-v2-tool-label">Angle: {angle}°</label>
          <input type="range" min={0} max={360} value={angle}
            onChange={e => setAngle(+e.target.value)}
            className="w-full" />
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
        <div>
          <label className="tb-v2-tool-label">Color 1</label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input type="color" value={color1} onChange={e => setColor1(e.target.value)}
              style={{ width: '40px', height: '40px', border: 'none', borderRadius: '4px', cursor: 'pointer' }} />
            <input type="text" value={color1} onChange={e => setColor1(e.target.value)}
              className="tb-v2-tool-textarea" style={{ padding: '0.25rem', fontFamily: 'monospace', fontSize: '0.75rem' }} />
          </div>
          <input type="range" min={0} max={100} value={pos1}
            onChange={e => setPos1(+e.target.value)} className="w-full" />
        </div>
        <div>
          <label className="tb-v2-tool-label">Color 2</label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input type="color" value={color2} onChange={e => setColor2(e.target.value)}
              style={{ width: '40px', height: '40px', border: 'none', borderRadius: '4px', cursor: 'pointer' }} />
            <input type="text" value={color2} onChange={e => setColor2(e.target.value)}
              className="tb-v2-tool-textarea" style={{ padding: '0.25rem', fontFamily: 'monospace', fontSize: '0.75rem' }} />
          </div>
          <input type="range" min={0} max={100} value={pos2}
            onChange={e => setPos2(+e.target.value)} className="w-full" />
        </div>
        <div>
          <label className="tb-v2-tool-label">Color 3 (optional)</label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input type="color" value={color3 || '#ffffff'} onChange={e => setColor3(e.target.value)}
              style={{ width: '40px', height: '40px', border: 'none', borderRadius: '4px', cursor: 'pointer' }} />
            <input type="text" value={color3} onChange={e => setColor3(e.target.value)}
              className="tb-v2-tool-textarea" style={{ padding: '0.25rem', fontFamily: 'monospace', fontSize: '0.75rem' }}
              placeholder="optional" />
          </div>
          <input type="range" min={0} max={100} value={pos3}
            onChange={e => setPos3(+e.target.value)} className="w-full" />
        </div>
      </div>
      <div style={{ marginTop: '1rem', borderRadius: '8px', height: '120px', background: gradient }} />
      <div className="tb-v2-tool-input-head" style={{ marginTop: '1rem' }}>
        <span className="tb-v2-tool-label">CSS Code</span>
        <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre style={{ background: '#1a1a2e', color: '#a5f3fc', padding: '1rem', borderRadius: '8px',
        fontFamily: 'monospace', fontSize: '0.875rem', overflowX: 'auto' }}>{cssCode}</pre>
    </div>
  );
}
