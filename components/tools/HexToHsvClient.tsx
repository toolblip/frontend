"use client";

import { useState } from "react";

export default function HexToHsv() {
  const [hex, setHex] = useState("#3498db");
  const [hsv, setHsv] = useState<{ h: number; s: number; v: number } | null>(null);
  const [error, setError] = useState("");

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHsv = (r: number, g: number, b: number) => {
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const v = max;
    const d = max - min;
    const s = max === 0 ? 0 : d / max;
    let h = 0;
    if (max !== min) {
      switch (max) {
        case rNorm: h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6; break;
        case gNorm: h = ((bNorm - rNorm) / d + 2) / 6; break;
        case bNorm: h = ((rNorm - gNorm) / d + 4) / 6; break;
      }
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      v: Math.round(v * 100)
    };
  };

  const handleConvert = () => {
    setError("");
    const rgb = hexToRgb(hex);
    if (!rgb) {
      setError("Invalid hex color. Use format #RRGGBB");
      setHsv(null);
      return;
    }
    setHsv(rgbToHsv(rgb.r, rgb.g, rgb.b));
  };

  return (
    <div className="tb-v2-section">
      <h2 className="tb-v2-heading-sm">Hex to HSV Converter</h2>
      <p className="tb-v2-text">Convert HEX colors to HSV values for image editing and design.</p>
      
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
        Convert to HSV
      </button>

      {error && <p className="tb-v2-error">{error}</p>}

      {hsv && (
        <div className="tb-v2-result">
          <div className="tb-v2-result-preview" style={{ backgroundColor: hex }} />
          <div className="tb-v2-result-values">
            <div className="tb-v2-result-item">
              <span className="tb-v2-result-label">H</span>
              <span className="tb-v2-result-value">{hsv.h}°</span>
            </div>
            <div className="tb-v2-result-item">
              <span className="tb-v2-result-label">S</span>
              <span className="tb-v2-result-value">{hsv.s}%</span>
            </div>
            <div className="tb-v2-result-item">
              <span className="tb-v2-result-label">V</span>
              <span className="tb-v2-result-value">{hsv.v}%</span>
            </div>
          </div>
          <div className="tb-v2-code-block">
            hsv({hsv.h}, {hsv.s}%, {hsv.v}%)
          </div>
        </div>
      )}
    </div>
  );
}
