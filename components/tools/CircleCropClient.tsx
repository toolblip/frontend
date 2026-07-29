'use client';

import { useState, useRef } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { FileSizeError, UpgradeNotice } from '@/components/FileSizeGuard';

type CircleShape = 'circle' | 'rounded' | 'square';
type OutputBg = 'transparent' | 'white' | 'blur' | 'custom';

const CIRCLE_PRESETS = [
  { label: 'Circle', shape: 'circle' as CircleShape, radius: 50 },
  { label: 'Rounded Square', shape: 'rounded' as CircleShape, radius: 20 },
  { label: 'Soft Rounded', shape: 'rounded' as CircleShape, radius: 10 },
  { label: 'Square', shape: 'square' as CircleShape, radius: 0 },
];

export default function CircleCropClient() {
  const [image, setImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preset, setPreset] = useState(CIRCLE_PRESETS[0]);
  const [bgType, setBgType] = useState<OutputBg>('transparent');
  const [customBg, setCustomBg] = useState('#ffffff');
  const [outputSize, setOutputSize] = useState(512);
  const [previewCanvas, setPreviewCanvas] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const { tier } = useSubscription();
  const maxSizeMB = tier === 'free' ? 5 : tier === 'starter' ? 10 : tier === 'ultra' ? 100 : tier === 'max' ? 500 : 5;

  const isOversized = selectedFile != null && selectedFile.size / (1024 * 1024) > maxSizeMB;

  const loadImage = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setImage(src);
      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
        drawPreview(img);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const drawPreview = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = outputSize;
    canvas.width = size;
    canvas.height = size;

    // Background
    if (bgType === 'white' || bgType === 'custom') {
      ctx.fillStyle = bgType === 'white' ? '#ffffff' : customBg;
      ctx.fillRect(0, 0, size, size);
    } else if (bgType === 'blur') {
      // Draw blurred version of image as background
      const blurCanvas = document.createElement('canvas');
      const blurCtx = blurCanvas.getContext('2d');
      if (blurCtx) {
        blurCanvas.width = size;
        blurCanvas.height = size;
        blurCtx.filter = 'blur(20px)';
        const s = Math.max(img.width, img.height);
        const ox = (img.width - s) / 2;
        const oy = (img.height - s) / 2;
        blurCtx.drawImage(img, ox, oy, s, s, 0, 0, size, size);
        ctx.drawImage(blurCanvas, 0, 0);
      }
    }
    // transparent = no background (canvas is already empty/transparent)

    // Clip to shape
    const r = (preset.radius / 100) * size;
    ctx.save();
    if (preset.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2);
      ctx.clip();
    } else if (preset.shape === 'rounded') {
      const rr = r;
      ctx.beginPath();
      ctx.moveTo(rr, 0);
      ctx.lineTo(size - rr, 0);
      ctx.quadraticCurveTo(size, 0, size, rr);
      ctx.lineTo(size, size - rr);
      ctx.quadraticCurveTo(size, size, size - rr, size);
      ctx.lineTo(rr, size);
      ctx.quadraticCurveTo(0, size, 0, size - rr);
      ctx.lineTo(0, rr);
      ctx.quadraticCurveTo(0, 0, rr, 0);
      ctx.closePath();
      ctx.clip();
    }
    // square = no clipping needed

    // Draw image centered and cropped to square
    const s = Math.max(img.width, img.height);
    const ox = (img.width - s) / 2;
    const oy = (img.height - s) / 2;
    ctx.drawImage(img, ox, oy, s, s, 0, 0, size, size);
    ctx.restore();

    // Add subtle border for square/rounded
    if (preset.shape !== 'circle') {
      ctx.save();
      if (preset.shape === 'rounded') {
        ctx.beginPath();
        const rr = r;
        ctx.moveTo(rr, 0);
        ctx.lineTo(size - rr, 0);
        ctx.quadraticCurveTo(size, 0, size, rr);
        ctx.lineTo(size, size - rr);
        ctx.quadraticCurveTo(size, size, size - rr, size);
        ctx.lineTo(rr, size);
        ctx.quadraticCurveTo(0, size, 0, size - rr);
        ctx.lineTo(0, rr);
        ctx.quadraticCurveTo(0, 0, rr, 0);
        ctx.closePath();
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();
    }

    setPreviewCanvas(canvas.toDataURL('image/png'));
  };

  const handlePresetChange = (p: typeof CIRCLE_PRESETS[0]) => {
    setPreset(p);
    if (imgRef.current) drawPreview(imgRef.current);
  };

  const handleBgChange = (bg: OutputBg) => {
    setBgType(bg);
    if (imgRef.current) drawPreview(imgRef.current);
  };

  const handleSizeChange = (size: number) => {
    setOutputSize(size);
    if (imgRef.current) drawPreview(imgRef.current);
  };

  const handleCustomBgChange = (color: string) => {
    setCustomBg(color);
    if (imgRef.current) drawPreview(imgRef.current);
  };

  const downloadCrop = () => {
    const canvas = document.createElement('canvas');
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext('2d');
    const img = imgRef.current;
    if (!ctx || !img) return;

    // Background
    if (bgType === 'white' || bgType === 'custom') {
      ctx.fillStyle = bgType === 'white' ? '#ffffff' : customBg;
      ctx.fillRect(0, 0, outputSize, outputSize);
    } else if (bgType === 'blur') {
      const blurCanvas = document.createElement('canvas');
      const blurCtx = blurCanvas.getContext('2d');
      if (blurCtx) {
        blurCanvas.width = outputSize;
        blurCanvas.height = outputSize;
        blurCtx.filter = 'blur(20px)';
        const s = Math.max(img.width, img.height);
        const ox = (img.width - s) / 2;
        const oy = (img.height - s) / 2;
        blurCtx.drawImage(img, ox, oy, s, s, 0, 0, outputSize, outputSize);
        ctx.drawImage(blurCanvas, 0, 0);
      }
    }
    // transparent = nothing

    const r = (preset.radius / 100) * outputSize;
    ctx.save();
    if (preset.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2 - 1, 0, Math.PI * 2);
      ctx.clip();
    } else if (preset.shape === 'rounded') {
      const rr = r;
      ctx.beginPath();
      ctx.moveTo(rr, 0);
      ctx.lineTo(outputSize - rr, 0);
      ctx.quadraticCurveTo(outputSize, 0, outputSize, rr);
      ctx.lineTo(outputSize, outputSize - rr);
      ctx.quadraticCurveTo(outputSize, outputSize, outputSize - rr, outputSize);
      ctx.lineTo(rr, outputSize);
      ctx.quadraticCurveTo(0, outputSize, 0, outputSize - rr);
      ctx.lineTo(0, rr);
      ctx.quadraticCurveTo(0, 0, rr, 0);
      ctx.closePath();
      ctx.clip();
    }

    const s = Math.max(img.width, img.height);
    const ox = (img.width - s) / 2;
    const oy = (img.height - s) / 2;
    ctx.drawImage(img, ox, oy, s, s, 0, 0, outputSize, outputSize);
    ctx.restore();

    const ext = bgType === 'transparent' ? 'png' : 'png';
    const link = document.createElement('a');
    link.download = `circle-crop-${outputSize}.${ext}`;
    link.href = canvas.toDataURL(`image/${ext}`);
    link.click();
  };

  return (
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
      {/* Upload zone */}
      {!image ? (
        <div
          className="border-2 border-dashed border-gray-700 hover:border-[#DC2626] rounded-xl p-12 text-center transition-colors cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith('image/')) loadImage(f); }}
          onClick={() => document.getElementById('circle-crop-input')?.click()}
        >
          <span className="text-3xl mb-3 block">⭕</span>
          <p className="text-gray-400 text-sm">Drag & drop an image, or click to browse</p>
          <p className="text-gray-600 text-xs mt-1">PNG, JPG, WebP, GIF • Max {maxSizeMB}MB</p>
          <input
            id="circle-crop-input"
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
        <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
          {/* Preview */}
          <div className="flex justify-center">
            {previewCanvas ? (
              <img
                src={previewCanvas}
                alt="Crop preview"
                className="max-w-full max-h-64 rounded-lg object-contain"
                style={{ aspectRatio: `${outputSize}/${outputSize}` }}
              />
            ) : (
              <canvas ref={canvasRef} className="hidden" />
            )}
          </div>

          {/* Shape presets */}
          <div>
            <p className="text-xs text-gray-500 mb-2 font-medium">Shape</p>
            <div className="tb-v2-mode-tabs">
              {CIRCLE_PRESETS.map((p) => (
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
          </div>

          {/* Background type */}
          <div>
            <p className="text-xs text-gray-500 mb-2 font-medium">Background</p>
            <div className="tb-v2-mode-tabs">
              {(['transparent', 'white', 'blur'] as OutputBg[]).map((bg) => (
                <button
                  key={bg}
                  onClick={() => handleBgChange(bg)}
                  className={`text-xs px-3 py-1.5 rounded-full transition-colors capitalize ${
                    bgType === bg
                      ? 'bg-[#DC2626] text-black font-semibold'
                      : 'bg-[#1a1a2e] text-gray-400 hover:text-white border border-gray-700'
                  }`}
                >
                  {bg === 'transparent' ? 'Transparent' : bg}
                </button>
              ))}
            </div>
          </div>

          {/* Custom bg color */}
          {bgType === 'blur' && (
            <p className="text-xs text-gray-500 italic">Blurred version of your image as background</p>
          )}

          {/* Output size */}
          <div className="flex items-center gap-3">
            <p className="text-xs text-gray-500 font-medium">Output Size:</p>
            <input
              type="range"
              min={64}
              max={2048}
              step={64}
              value={outputSize}
              onChange={(e) => handleSizeChange(Number(e.target.value))}
              className="flex-1 accent-[#DC2626]"
            />
            <span className="text-xs text-[#DC2626] font-medium w-16 text-right">{outputSize}px</span>
          </div>

          {/* Download */}
          <div className="tb-v2-mode-tabs">
            <button
              onClick={downloadCrop}
              disabled={!previewCanvas || isOversized}
              className="bg-[#DC2626] hover:bg-[#B91C1C] text-black font-semibold px-5 py-2 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isOversized ? 'File Too Large' : `Download ${outputSize}×${outputSize} PNG`}
            </button>
            <button
              onClick={() => { setImage(null); setSelectedFile(null); setPreviewCanvas(null); }}
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
