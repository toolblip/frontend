"use client";

import { useState } from "react";

export default function HslToRgbNew() {
  const [h, setH] = useState(200);
  const [s, setS] = useState(80);
  const [l, setL] = useState(50);
  const [rgb, setRgb] = useState<{ r: number; g: number; b: number } | null>(null);

  const hslToRgb = (h: number, s: number, l: number) => {
    const sNorm = s / 100;
    const lNorm = l / 100;
    const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = lNorm - c / 2;
    let r = 0, g = 0, b = 0;
    if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
    else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
    else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
    else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
    else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
    else if (h >= 300 && h < 360) { r = c; g = 0; b = x; }
    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    };
  };

  const handleConvert = () => {
    setRgb(hslToRgb(h, s, l));
  };

  const hslColor = `hsl(${h}, ${s}%, ${l}%)`;

  return (
    <div className="tb-v2-section">
      <h2 className="tb-v2-heading-sm">HSL to RGB Converter</h2>
      <p className="tb-v2-text">Convert HSL color values to RGB format.</p>
      
      <div className="tb-v2-form-group">
        <label className="tb-v2-label">Hue (0-360°)</label>
        <div className="tb-v2-input-group">
          <input
            type="range"
            className="tb-v2-range"
            min="0"
            max="360"
            value={h}
            onChange={(e) => setH(parseInt(e.target.value))}
          />
          <span className="tb-v2-value-display">{h}°</span>
        </div>
      </div>

      <div className="tb-v2-form-group">
        <label className="tb-v2-label">Saturation (0-100%)</label>
        <div className="tb-v2-input-group">
          <input
            type="range"
            className="tb-v2-range"
            min="0"
            max="100"
            value={s}
            onChange={(e) => setS(parseInt(e.target.value))}
          />
          <span className="tb-v2-value-display">{s}%</span>
        </div>
      </div>

      <div className="tb-v2-form-group">
        <label className="tb-v2-label">Lightness (0-100%)</label>
        <div className="tb-v2-input-group">
          <input
            type="range"
            className="tb-v2-range"
            min="0"
            max="100"
            value={l}
            onChange={(e) => setL(parseInt(e.target.value))}
          />
          <span className="tb-v2-value-display">{l}%</span>
        </div>
      </div>

      <button className="tb-v2-button" onClick={handleConvert}>
        Convert to RGB
      </button>

      {rgb && (
        <div className="tb-v2-result">
          <div className="tb-v2-result-preview" style={{ backgroundColor: hslColor }} />
          <div className="tb-v2-result-values">
            <div className="tb-v2-result-item">
              <span className="tb-v2-result-label">R</span>
              <span className="tb-v2-result-value">{rgb.r}</span>
            </div>
            <div className="tb-v2-result-item">
              <span className="tb-v2-result-label">G</span>
              <span className="tb-v2-result-value">{rgb.g}</span>
            </div>
            <div className="tb-v2-result-item">
              <span className="tb-v2-result-label">B</span>
              <span className="tb-v2-result-value">{rgb.b}</span>
            </div>
          </div>
          <div className="tb-v2-code-block">
            rgb({rgb.r}, {rgb.g}, {rgb.b})
          </div>
        </div>
      )}
    </div>
  );
}
