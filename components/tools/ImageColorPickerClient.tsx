'use client';

import { useState, useRef } from 'react';

interface ColorInfo {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function getColorAtPoint(ctx: CanvasRenderingContext2D, x: number, y: number): ColorInfo {
  const pixel = ctx.getImageData(x, y, 1, 1).data;
  const r = pixel[0], g = pixel[1], b = pixel[2];
  return {
    hex: rgbToHex(r, g, b),
    rgb: { r, g, b },
    hsl: rgbToHsl(r, g, b)
  };
}

export default function ImageColorPickerClient() {
  const [selectedColor, setSelectedColor] = useState<ColorInfo | null>(null);
  const [pickedColors, setPickedColors] = useState<ColorInfo[]>([]);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.drawImage(img, 0, 0);
    };
    img.src = URL.createObjectURL(file);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    const ctx = canvas.getContext('2d');
    if (ctx) {
      const color = getColorAtPoint(ctx, x, y);
      setSelectedColor(color);
    }
  };

  const pickColor = () => {
    if (selectedColor && !pickedColors.some(c => c.hex === selectedColor.hex)) {
      setPickedColors([...pickedColors, selectedColor]);
    }
  };

  const copyColor = (format: 'hex' | 'rgb' | 'hsl') => {
    if (!selectedColor) return;
    let text = '';
    switch (format) {
      case 'hex': text = selectedColor.hex; break;
      case 'rgb': text = `rgb(${selectedColor.rgb.r}, ${selectedColor.rgb.g}, ${selectedColor.rgb.b})`; break;
      case 'hsl': text = `hsl(${selectedColor.hsl.h}, ${selectedColor.hsl.s}%, ${selectedColor.hsl.l}%)`; break;
    }
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Upload Image</span>
      </div>
      <input type="file" accept="image/*" onChange={handleImageUpload} className="tb-v2-tool-textarea" style={{ marginTop: 8 }} />

      <canvas ref={canvasRef} onClick={handleCanvasClick} style={{ display: 'none' }} />

      {imageRef.current && (
        <div style={{ marginTop: 12, maxHeight: 300, overflow: 'auto', borderRadius: 8, border: '1px solid var(--tb-border)' }}>
          <img src={imageRef.current.src} alt="Uploaded" style={{ width: '100%', display: 'block', cursor: 'crosshair' }} onClick={handleCanvasClick as any} />
        </div>
      )}

      <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
        <span className="tb-v2-tool-label">Selected Color</span>
      </div>
      <div className="tb-v2-tool-output-body">
        {selectedColor ? (
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ width: 64, height: 64, background: selectedColor.hex, borderRadius: 8, border: '1px solid var(--tb-border)' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <button type="button" onClick={() => copyColor('hex')} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`} style={{ fontSize: 13 }}>HEX: {selectedColor.hex}</button>
              <div style={{ fontSize: 12, color: 'var(--tb-text-secondary)' }}>RGB: {selectedColor.rgb.r}, {selectedColor.rgb.g}, {selectedColor.rgb.b}</div>
              <div style={{ fontSize: 12, color: 'var(--tb-text-secondary)' }}>HSL: {selectedColor.hsl.h}°, {selectedColor.hsl.s}%, {selectedColor.hsl.l}%</div>
            </div>
          </div>
        ) : (
          <span style={{ color: 'var(--tb-text-secondary)' }}>Click on the image to pick a color</span>
        )}
      </div>
    </div>
  );
}
