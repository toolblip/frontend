"use client";

import { useState } from "react";

export default function HexToHsl() {
  const [hex, setHex] = useState("#3498db");
  const [hsl, setHsl] = useState<{ h: number; s: number; l: number } | null>(null);
  const [error, setError] = useState("");

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const l = (max + min) / 2;
    if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h = 0;
    switch (max) {
      case rNorm: h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6; break;
      case gNorm: h = ((bNorm - rNorm) / d + 2) / 6; break;
      case bNorm: h = ((rNorm - gNorm) / d + 4) / 6; break;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const handleConvert = () => {
    setError("");
    const rgb = hexToRgb(hex);
    if (!rgb) {
      setError("Invalid hex color. Use format #RRGGBB");
      setHsl(null);
      return;
    }
    setHsl(rgbToHsl(rgb.r, rgb.g, rgb.b));
  };

  return (
    <div className="tb-v2-section">
      <h2 className="tb-v2-heading-sm">Hex to HSL Converter</h2>
      <p className="tb-v2-text">Convert HEX colors to HSL values for CSS and design.</p>
      
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
        Convert to HSL
      </button>

      {error && <p className="tb-v2-error">{error}</p>}

      {hsl && (
        <div className="tb-v2-result">
          <div className="tb-v2-result-preview" style={{ backgroundColor: hex }} />
          <div className="tb-v2-result-values">
            <div className="tb-v2-result-item">
              <span className="tb-v2-result-label">H</span>
              <span className="tb-v2-result-value">{hsl.h}°</span>
            </div>
            <div className="tb-v2-result-item">
              <span className="tb-v2-result-label">S</span>
              <span className="tb-v2-result-value">{hsl.s}%</span>
            </div>
            <div className="tb-v2-result-item">
              <span className="tb-v2-result-label">L</span>
              <span className="tb-v2-result-value">{hsl.l}%</span>
            </div>
          </div>
          <div className="tb-v2-code-block">
            hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
          </div>
        </div>
      )}
    </div>
  );
}
