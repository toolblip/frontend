"use client";

import { useState } from "react";

export default function HexToCmyk() {
  const [hex, setHex] = useState("#3498db");
  const [cmyk, setCmyk] = useState<{ c: number; m: number; y: number; k: number } | null>(null);
  const [error, setError] = useState("");

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToCmyk = (r: number, g: number, b: number) => {
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    const k = 1 - Math.max(rNorm, gNorm, bNorm);
    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
    const c = (1 - rNorm - k) / (1 - k);
    const m = (1 - gNorm - k) / (1 - k);
    const y = (1 - bNorm - k) / (1 - k);
    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
    };
  };

  const handleConvert = () => {
    setError("");
    const rgb = hexToRgb(hex);
    if (!rgb) {
      setError("Invalid hex color. Use format #RRGGBB");
      setCmyk(null);
      return;
    }
    setCmyk(rgbToCmyk(rgb.r, rgb.g, rgb.b));
  };

  return (
    <div className="tb-v2-section">
      <h2 className="tb-v2-heading-sm">Hex to CMYK Converter</h2>
      <p className="tb-v2-text">Convert HEX colors to CMYK values for print design.</p>
      
      <div className="tb-v2-form-group">
        <label className="tb-v2-label">Hex Color</label>
        <div className="tb-v2-input-group">
          <input
            type="text"
            className="tb-v2-input"
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            placeholder="#3498db"
          />
          <input
            type="color"
            className="tb-v2-color-swatch"
            value={hex}
            onChange={(e) => setHex(e.target.value)}
          />
        </div>
      </div>

      <button className="tb-v2-button" onClick={handleConvert}>
        Convert to CMYK
      </button>

      {error && <p className="tb-v2-error">{error}</p>}

      {cmyk && (
        <div className="tb-v2-result">
          <div className="tb-v2-result-preview" style={{ backgroundColor: hex }} />
          <div className="tb-v2-result-values">
            <div className="tb-v2-result-item">
              <span className="tb-v2-result-label">C</span>
              <span className="tb-v2-result-value">{cmyk.c}%</span>
            </div>
            <div className="tb-v2-result-item">
              <span className="tb-v2-result-label">M</span>
              <span className="tb-v2-result-value">{cmyk.m}%</span>
            </div>
            <div className="tb-v2-result-item">
              <span className="tb-v2-result-label">Y</span>
              <span className="tb-v2-result-value">{cmyk.y}%</span>
            </div>
            <div className="tb-v2-result-item">
              <span className="tb-v2-result-label">K</span>
              <span className="tb-v2-result-value">{cmyk.k}%</span>
            </div>
          </div>
          <div className="tb-v2-code-block">
            cmyk({cmyk.c}, {cmyk.m}, {cmyk.y}, {cmyk.k})
          </div>
        </div>
      )}
    </div>
  );
}
