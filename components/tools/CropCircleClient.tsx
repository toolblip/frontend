'use client';

import { useState, useRef } from 'react';

export default function CropCircleClient() {
  const [image, setImage] = useState<string | null>(null);
  const [size, setSize] = useState(200);
  const [borderWidth, setBorderWidth] = useState(0);
  const [borderColor, setBorderColor] = useState('#ffffff');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
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
    <div className="tb-v2-card">
      <div className="tb-v2-card-header">
        <h2 className="tb-v2-card-title">Crop Circle</h2>
        <p className="tb-v2-card-description">Create perfect circular images with optional border</p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="tb-v2-form-group">
          <label className="tb-v2-label">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="tb-v2-input w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="tb-v2-form-group">
            <label className="tb-v2-label">Size (px)</label>
            <input
              type="number"
              value={size}
              onChange={(e) => setSize(Math.max(50, parseInt(e.target.value) || 200))}
              className="tb-v2-input w-full"
              min="50"
              max="1000"
            />
          </div>

          <div className="tb-v2-form-group">
            <label className="tb-v2-label">Border Width (px)</label>
            <input
              type="number"
              value={borderWidth}
              onChange={(e) => setBorderWidth(Math.max(0, parseInt(e.target.value) || 0))}
              className="tb-v2-input w-full"
              min="0"
              max="50"
            />
          </div>
        </div>

        <div className="tb-v2-form-group">
          <label className="tb-v2-label">Border Color</label>
          <div className="flex gap-3">
            <input
              type="color"
              value={borderColor}
              onChange={(e) => setBorderColor(e.target.value)}
              className="tb-v2-input h-12 w-20 cursor-pointer"
            />
            <input
              type="text"
              value={borderColor}
              onChange={(e) => setBorderColor(e.target.value)}
              className="tb-v2-input flex-1 uppercase"
            />
          </div>
        </div>
      </div>

      {image && (
        <div className="mb-6">
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
        </div>
      )}

      <button
        onClick={handleDownload}
        disabled={!image}
        className="tb-v2-button-primary w-full"
      >
        Download Circle Image
      </button>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
