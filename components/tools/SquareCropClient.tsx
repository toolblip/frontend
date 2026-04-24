'use client';

import { useState, useRef, useCallback } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { FileSizeError, UpgradeNotice } from '@/components/FileSizeGuard';

const SQUARE_PRESETS = [
  { label: 'Instagram Post', size: 1080, description: '1080×1080' },
  { label: 'Instagram Profile', size: 320, description: '320×320' },
  { label: 'Facebook Post', size: 1200, description: '1200×1200' },
  { label: 'Twitter/X Post', size: 1024, description: '1024×1024' },
  { label: 'LinkedIn Post', size: 1200, description: '1200×1200' },
  { label: 'Pinterest Pin', size: 1000, description: '1000×1000' },
  { label: 'Custom', size: 0, description: 'Any size' },
];

export default function SquareCropClient() {
  const [image, setImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preset, setPreset] = useState(SQUARE_PRESETS[0]);
  const [customSize, setCustomSize] = useState(1024);
  const [cropSize, setCropSize] = useState(1080);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [cropPos, setCropPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imgLoaded, setImgLoaded] = useState(false);
  const { tier } = useSubscription();
  const maxSizeMB = tier === 'free' ? 5 : tier === 'starter' ? 10 : tier === 'ultra' ? 100 : tier === 'max' ? 500 : 5;

  const isOversized = selectedFile != null && selectedFile.size / (1024 * 1024) > maxSizeMB;
  const outputSize = preset.size || customSize;

  const loadImage = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setImage(src);
      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
        setImgLoaded(true);
        // Center the crop area
        const canvas = canvasRef.current;
        if (!canvas) return;
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const scaledW = img.width * scale;
        const scaledH = img.height * scale;
        setCropPos({ x: (canvas.width - scaledW) / 2, y: (canvas.height - scaledH) / 2 });
        drawCanvas();
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fit image to canvas (cover)
    const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
    const scaledW = img.width * scale;
    const scaledH = img.height * scale;
    const offsetX = (canvas.width - scaledW) / 2;
    const offsetY = (canvas.height - scaledH) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, scaledW, scaledH);

    // Draw semi-transparent overlay outside crop area
    const cropX = cropPos.x;
    const cropY = cropPos.y;
    const cropW = Math.min(outputSize * scale, canvas.width - cropX);
    const cropH = Math.min(outputSize * scale, canvas.height - cropY);

    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, canvas.width, cropY);
    ctx.fillRect(0, cropY + cropH, canvas.width, canvas.height - cropY - cropH);
    ctx.fillRect(0, cropY, cropX, cropH);
    ctx.fillRect(cropX + cropW, cropY, canvas.width - cropX - cropW, cropH);

    // Crop border
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 2;
    ctx.strokeRect(cropX, cropY, cropW, cropH);

    // Corner markers
    const cornerSize = 8;
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 3;
    // Top-left
    ctx.beginPath();
    ctx.moveTo(cropX, cropY + cornerSize); ctx.lineTo(cropX, cropY); ctx.lineTo(cropX + cornerSize, cropY);
    ctx.stroke();
    // Top-right
    ctx.beginPath();
    ctx.moveTo(cropX + cropW - cornerSize, cropY); ctx.lineTo(cropX + cropW, cropY); ctx.lineTo(cropX + cropW, cropY + cornerSize);
    ctx.stroke();
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(cropX, cropY + cropH - cornerSize); ctx.lineTo(cropX, cropY + cropH); ctx.lineTo(cropX + cornerSize, cropY + cropH);
    ctx.stroke();
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(cropX + cropW - cornerSize, cropY + cropH); ctx.lineTo(cropX + cropW, cropY + cropH); ctx.lineTo(cropX + cropW, cropY + cropH - cornerSize);
    ctx.stroke();
  }, [cropPos, outputSize]);

  const handlePresetChange = (p: typeof SQUARE_PRESETS[0]) => {
    setPreset(p);
    if (p.size) setCropSize(p.size);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    setDragStart({ x: e.clientX - cropPos.x, y: e.clientY - cropPos.y });
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const newX = Math.max(0, Math.min(e.clientX - rect.left - dragStart.x + cropPos.x, rect.width - outputSize));
    const newY = Math.max(0, Math.min(e.clientY - rect.top - dragStart.y + cropPos.y, rect.height - outputSize));
    setCropPos({ x: newX, y: newY });
    drawCanvas();
  };

  const handleMouseUp = () => setIsDragging(false);

  const downloadCrop = () => {
    if (!imgRef.current || !imgLoaded) return;
    const img = imgRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate source rect from crop position
    const displayScale = Math.min(canvasRef.current!.width / img.width, canvasRef.current!.height / img.height);
    const srcScale = img.width / (canvasRef.current!.width / displayScale);
    const srcX = cropPos.x * srcScale;
    const srcY = cropPos.y * srcScale;
    const srcSize = outputSize * srcScale;

    ctx.drawImage(img, srcX, srcY, srcSize, srcSize, 0, 0, outputSize, outputSize);

    const link = document.createElement('a');
    link.download = `square-crop-${outputSize}x${outputSize}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-4">
      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        {SQUARE_PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => handlePresetChange(p)}
            className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
              preset.label === p.label
                ? 'bg-[#DC2626] text-black font-semibold'
                : 'bg-[#1a1a2e] text-gray-400 hover:text-white border border-gray-700'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {preset.label === 'Custom' && (
        <div className="flex items-center gap-3">
          <label className="text-xs text-gray-400">Size (px):</label>
          <input
            type="number"
            min={50}
            max={4000}
            value={customSize}
            onChange={(e) => setCustomSize(Number(e.target.value))}
            className="bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white w-24"
          />
          <span className="text-xs text-gray-500">{customSize} × {customSize}px</span>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Output: <span className="text-[#DC2626] font-medium">{outputSize} × {outputSize}px</span> - drag on image to reposition crop area
      </p>

      {/* Upload zone */}
      {!image ? (
        <div
          className="border-2 border-dashed border-gray-700 hover:border-[#DC2626] rounded-xl p-12 text-center transition-colors cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith('image/')) loadImage(f); }}
          onClick={() => document.getElementById('square-crop-input')?.click()}
        >
          <span className="text-3xl mb-3 block">✂️</span>
          <p className="text-gray-400 text-sm">Drag & drop an image, or click to browse</p>
          <p className="text-gray-600 text-xs mt-1">PNG, JPG, WebP, GIF • Max {maxSizeMB}MB</p>
          <input
            id="square-crop-input"
            type="file"
            accept="image/*"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) loadImage(f); }}
            className="hidden"
            aria-label="Upload image"
          />
          <UpgradeNotice tier={tier} />
          <FileSizeError file={selectedFile} maxSizeMB={maxSizeMB} />
        </div>
      ) : (
        <div className="space-y-3">
          <canvas
            ref={canvasRef}
            width={500}
            height={500}
            className="max-w-full rounded-lg cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
          <div className="flex gap-3">
            <button
              onClick={downloadCrop}
              disabled={!imgLoaded || isOversized}
              className="bg-[#DC2626] hover:bg-[#B91C1C] text-black font-semibold px-5 py-2 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isOversized ? 'File Too Large' : `Download ${outputSize}×${outputSize} PNG`}
            </button>
            <button
              onClick={() => { setImage(null); setSelectedFile(null); setImgLoaded(false); }}
              className="bg-[#1a1a2e] hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm border border-gray-700 transition-colors"
            >
              Choose New Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
