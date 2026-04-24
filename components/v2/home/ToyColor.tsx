'use client';

import { useMemo, useState } from 'react';

export default function ToyColor() {
  const [h, setH] = useState(4);
  const [s, setS] = useState(78);
  const [l, setL] = useState(53);

  const hex = useMemo(() => {
    const s1 = s / 100;
    const l1 = l / 100;
    const a = s1 * Math.min(l1, 1 - l1);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const c = l1 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
      return Math.round(255 * c).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }, [h, s, l]);

  const rgb = useMemo(() => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  }, [hex]);

  return (
    <div className="tb-v2-toy-color-pane">
      <div className="tb-v2-toy-swatch" style={{ background: hex }}>
        <span>{hex.toUpperCase()}</span>
      </div>
      <div className="tb-v2-toy-color-sliders">
        <div className="tb-v2-toy-color-slider">
          <span>H</span>
          <input
            type="range"
            min={0}
            max={360}
            value={h}
            onChange={(e) => setH(Number(e.target.value))}
            aria-label="Hue"
          />
          <span style={{ textAlign: 'right' }}>{h}°</span>
        </div>
        <div className="tb-v2-toy-color-slider">
          <span>S</span>
          <input
            type="range"
            min={0}
            max={100}
            value={s}
            onChange={(e) => setS(Number(e.target.value))}
            aria-label="Saturation"
          />
          <span style={{ textAlign: 'right' }}>{s}%</span>
        </div>
        <div className="tb-v2-toy-color-slider">
          <span>L</span>
          <input
            type="range"
            min={0}
            max={100}
            value={l}
            onChange={(e) => setL(Number(e.target.value))}
            aria-label="Lightness"
          />
          <span style={{ textAlign: 'right' }}>{l}%</span>
        </div>
      </div>
      <div className="tb-v2-toy-color-row">
        <div className="tb-v2-toy-color-val"><span>HEX</span><b>{hex.toUpperCase()}</b></div>
        <div className="tb-v2-toy-color-val"><span>RGB</span><b>{rgb}</b></div>
        <div className="tb-v2-toy-color-val"><span>HSL</span><b>{h}, {s}%, {l}%</b></div>
        <div className="tb-v2-toy-color-val"><span>WCAG</span><b>{l < 50 ? 'AA' : 'AAA'}</b></div>
      </div>
    </div>
  );
}
