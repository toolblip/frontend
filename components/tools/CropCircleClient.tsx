'use client';

import { useState, useRef } from 'react';

export default function CropCircleClient() {
  const [image, setImage] = useState<string | null>(null);
  const [size, setSize] = useState(200);
  const [borderWidth, setBorderWidth] = useState(0);
  const [borderColor, setBorderColor] = useState('#ffffff');
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    loadFile(e.target.files?.[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    loadFile(e.dataTransfer.files?.[0]);
  };

  const handleDownload = () => {
    if (!image || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = size + borderWidth * 2;
    canvas.height = size + borderWidth * 2;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = size / 2;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + borderWidth, 0, Math.PI * 2);
    ctx.fillStyle = borderColor;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, borderWidth, borderWidth, size, size);
      const link = document.createElement('a');
      link.download = 'circle-crop.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = image;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Crop Circle</span>
      </div>

      <div
        className={`tb-v2-dropzone ${isDragging ? 'dragging' : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <span style={{ fontSize: 28 }}>⭕</span>
        <span className="tb-v2-dropzone-text">Click or drag an image here</span>
        <span className="tb-v2-dropzone-hint">Create a perfect circular crop with an optional border</span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
      </div>

      {!image ? (
        <p className="tb-v2-empty">Upload an image above to start cropping.</p>
      ) : (
        <>
          <div className="tb-v2-range-row">
            <label className="tb-v2-tool-label">Size</label>
            <input
              type="range"
              min="50"
              max="500"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="tb-v2-range"
            />
            <span className="tb-v2-range-val">{size}px</span>
          </div>

          <div className="tb-v2-range-row">
            <label className="tb-v2-tool-label">Border Width</label>
            <input
              type="range"
              min="0"
              max="30"
              value={borderWidth}
              onChange={(e) => setBorderWidth(Number(e.target.value))}
              className="tb-v2-range"
            />
            <span className="tb-v2-range-val">{borderWidth}px</span>
          </div>

          <div className="flex items-center gap-4">
            <label className="tb-v2-tool-label">Border Color</label>
            <input
              type="color"
              value={borderColor}
              onChange={(e) => setBorderColor(e.target.value)}
              style={{ width: 40, height: 40, borderRadius: 6, border: '1px solid var(--line)' }}
            />
          </div>

          <div
            className="mx-auto rounded-full bg-gray-100 flex items-center justify-center overflow-hidden"
            style={{
              width: size + borderWidth * 2,
              height: size + borderWidth * 2,
              border: borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : 'none',
            }}
          >
            <img
              src={image}
              alt="Preview"
              className="rounded-full"
              style={{ width: size, height: size, objectFit: 'cover' }}
            />
          </div>

          <button
            type="button"
            onClick={handleDownload}
            className="tb-v2-btn tb-v2-btn-primary"
            style={{ alignSelf: 'flex-start' }}
          >
            Download Circle Image
          </button>
        </>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
