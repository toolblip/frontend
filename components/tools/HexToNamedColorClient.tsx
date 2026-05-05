"use client";

import { useState } from "react";

const namedColors: Record<string, string> = {
  "#FF0000": "Red",
  "#00FF00": "Lime",
  "#0000FF": "Blue",
  "#FFFFFF": "White",
  "#000000": "Black",
  "#FFFF00": "Yellow",
  "#00FFFF": "Cyan",
  "#FF00FF": "Magenta",
  "#C0C0C0": "Silver",
  "#808080": "Gray",
  "#800000": "Maroon",
  "#808000": "Olive",
  "#008000": "Green",
  "#800080": "Purple",
  "#008080": "Teal",
  "#000080": "Navy",
  "#FFA500": "Orange",
  "#FFC0CB": "Pink",
  "#A52A2A": "Brown",
  "#F0F8FF": "AliceBlue",
  "#FFE4C4": "Bisque",
  "#DEB887": "BurlyWood",
  "#DC143C": "Crimson",
  "#00008B": "DarkBlue",
  "#008B8B": "DarkCyan",
  "#B8860B": "DarkGoldenRod",
  "#A9A9A9": "DarkGray",
  "#006400": "DarkGreen",
  "#4B0082": "Indigo",
  "#FF8C00": "DarkOrange",
  "#9932CC": "DarkOrchid",
  "#E9967A": "DarkSalmon",
  "#8B0000": "DarkRed",
  "#2F4F4F": "DarkSlateGray",
  "#D2691E": "Chocolate",
  "#FF7F50": "Coral",
  "#6495ED": "CornflowerBlue",
  "#DAA520": "GoldenRod",
  "#FFD700": "Gold",
  "#ADFF2F": "GreenYellow",
  "#F0FFF0": "HoneyDew",
  "#FF69B4": "HotPink",
  "#CD853F": "Peru",
  "#FF4500": "OrangeRed",
  "#DA70D6": "Orchid",
  "#EEEEEE": "Gainsboro",
};

export default function HexToNamedColor() {
  const [hex, setHex] = useState("#3498db");
  const [result, setResult] = useState<{ name: string; hex: string } | null>(null);
  const [error, setError] = useState("");

  const findNearestNamedColor = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;
    
    let nearestName = "Custom Color";
    let nearestDistance = Infinity;
    
    for (const [colorHex, name] of Object.entries(namedColors)) {
      const colorRgb = hexToRgb(colorHex);
      if (!colorRgb) continue;
      const distance = Math.sqrt(
        Math.pow(rgb.r - colorRgb.r, 2) +
        Math.pow(rgb.g - colorRgb.g, 2) +
        Math.pow(rgb.b - colorRgb.b, 2)
      );
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestName = name;
      }
    }
    return { name: nearestName, hex };
  };

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
    const found = namedColors[hex.toUpperCase()];
    if (found) {
      setResult({ name: found, hex: hex.toUpperCase() });
    } else {
      const nearest = findNearestNamedColor(hex);
      if (nearest) {
        setResult(nearest);
      } else {
        setError("Invalid hex color. Use format #RRGGBB");
        setResult(null);
      }
    }
  };

  return (
    <div className="tb-v2-section">
      <h2 className="tb-v2-heading-sm">Hex to Named Color</h2>
      <p className="tb-v2-text">Find the nearest CSS named color for any hex value.</p>
      
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
        Find Named Color
      </button>

      {error && <p className="tb-v2-error">{error}</p>}

      {result && (
        <div className="tb-v2-result">
          <div className="tb-v2-result-preview" style={{ backgroundColor: result.hex }} />
          <div className="tb-v2-result-info">
            <div className="tb-v2-result-name">{result.name}</div>
            <div className="tb-v2-result-hex">{result.hex}</div>
          </div>
        </div>
      )}
    </div>
  );
}
