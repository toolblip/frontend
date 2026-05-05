"use client";

import { useState } from "react";

export default function HexColorPicker() {
  const [hex, setHex] = useState("#3498db");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="tb-v2-section">
      <h2 className="tb-v2-heading-sm">Hex Color Picker</h2>
      <p className="tb-v2-text">Pick any color and get its hex code instantly.</p>
      
      <div className="tb-v2-form-group">
        <input
          type="color"
          className="tb-v2-color-picker-large"
          value={hex}
          onChange={(e) => setHex(e.target.value)}
        />
      </div>

      <div className="tb-v2-form-group">
        <label className="tb-v2-label">Hex Value</label>
        <div className="tb-v2-input-group">
          <input
            type="text"
            className="tb-v2-input"
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            placeholder="#3498db"
          />
          <button className="tb-v2-button-secondary" onClick={handleCopy}>
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      <div className="tb-v2-result">
        <div className="tb-v2-result-preview" style={{ backgroundColor: hex }} />
        <div className="tb-v2-result-info">
          <div className="tb-v2-result-hex">{hex}</div>
        </div>
      </div>
    </div>
  );
}
