"use client";

import { useState } from "react";

export default function HexToRgba() {
  const [hex, setHex] = useState("#3498db");
  const [alpha, setAlpha] = useState(1);
  const [rgba, setRgba] = useState<{ r: number; g: number; b: number; a: number } | null>(null);
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
    const rgb = hexToRgb(hex);
    if (!rgb) {
      setError("Invalid hex color. Use format #RRGGBB");
      setRgba(null);
      return;
    }
    setRgba({ ...rgb, a: alpha });
  };

  return (
    <div className="tb-v2-section">
      <h2 className="tb-v2-heading-sm">Hex to RGBA Converter</h2>
      <p className="tb-v2-text">Convert HEX colors to RGBA with custom opacity.</p>
      
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

      <div className="tb-v2-form-group">
        <label className="tb-v2-label">Alpha: {alpha}</label>
        <input
          type="range"
          className="tb-v2-range"
          min="0"
          max="1"
          step="0.1"
          value={alpha}
          onChange={(e) => setAlpha(parseFloat(e.target.value))}
        />
      </div>

      <button className="tb-v2-button" onClick={handleConvert}>
        Convert to RGBA
      </button>

      {error && <p className="tb-v2-error">{error}</p>}

      {rgba && (
        <div className="tb-v2-result">
          <div 
            className="tb-v2-result-preview" 
            style={{ backgroundColor: `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})` }} 
          />
          <div className="tb-v2-result-values">
            <div className="tb-v2-result-item">
              <span className="tb-v2-result-label">R</span>
              <span className="tb-v2-result-value">{rgba.r}</span>
            </div>
            <div className="tb-v2-result-item">
              <span className="tb-v2-result-label">G</span>
              <span className="tb-v2-result-value">{rgba.g}</span>
            </div>
            <div className="tb-v2-result-item">
              <span className="tb-v2-result-label">B</span>
              <span className="tb-v2-result-value">{rgba.b}</span>
            </div>
            <div className="tb-v2-result-item">
              <span className="tb-v2-result-label">A</span>
              <span className="tb-v2-result-value">{rgba.a}</span>
            </div>
          </div>
          <div className="tb-v2-code-block">
            rgba({rgba.r}, {rgba.g}, {rgba.b}, {rgba.a})
          </div>
        </div>
      )}
    </div>
  );
}
