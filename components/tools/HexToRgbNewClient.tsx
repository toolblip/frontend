"use client";

import { useState } from "react";

export default function HexToRgbNew() {
  const [hex, setHex] = useState("#3498db");
  const [rgb, setRgb] = useState<{ r: number; g: number; b: number } | null>(null);
  const [error, setError] = useState("");

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const handleConvert = () => {
    setError("");
    const result = hexToRgb(hex);
    if (!result) {
      setError("Invalid hex color. Use format #RRGGBB");
      setRgb(null);
      return;
    }
    setRgb(result);
  };

  return (
    <div className="tb-v2-section">
      <h2 className="tb-v2-heading-sm">Hex to RGB Converter</h2>
      <p className="tb-v2-text">Convert HEX colors to RGB values for web design.</p>
      
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
        Convert to RGB
      </button>

      {error && <p className="tb-v2-error">{error}</p>}

      {rgb && (
        <div className="tb-v2-result">
          <div className="tb-v2-result-preview" style={{ backgroundColor: hex }} />
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
