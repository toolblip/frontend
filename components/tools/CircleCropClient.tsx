'use client';

import { useEffect, useRef, useState } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { FileSizeError, UpgradeNotice } from '@/components/FileSizeGuard';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

type OutputBg = 'transparent' | 'white' | 'blur';

function renderCrop(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  bgType: OutputBg,
  outputSize: number,
): string {
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  canvas.width = outputSize;
  canvas.height = outputSize;
  ctx.clearRect(0, 0, outputSize, outputSize);

  if (bgType === 'white') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, outputSize, outputSize);
  } else if (bgType === 'blur') {
    const blurCanvas = document.createElement('canvas');
    const blurCtx = blurCanvas.getContext('2d');
    if (blurCtx) {
      blurCanvas.width = outputSize;
      blurCanvas.height = outputSize;
      blurCtx.filter = 'blur(20px)';
      const sourceSize = Math.max(img.width, img.height);
      const sourceX = (img.width - sourceSize) / 2;
      const sourceY = (img.height - sourceSize) / 2;
      blurCtx.drawImage(img, sourceX, sourceY, sourceSize, sourceSize, 0, 0, outputSize, outputSize);
      ctx.drawImage(blurCanvas, 0, 0);
    }
  }

  ctx.save();
  ctx.beginPath();
  ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2 - 1, 0, Math.PI * 2);
  ctx.clip();

  const sourceSize = Math.max(img.width, img.height);
  const sourceX = (img.width - sourceSize) / 2;
  const sourceY = (img.height - sourceSize) / 2;
  ctx.drawImage(img, sourceX, sourceY, sourceSize, sourceSize, 0, 0, outputSize, outputSize);
  ctx.restore();

  return canvas.toDataURL('image/png');
}

export default function CircleCropClient() {
  const [image, setImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [bgType, setBgType] = useState<OutputBg>('transparent');
  const [outputSize, setOutputSize] = useState(512);
  const [previewCanvas, setPreviewCanvas] = useState<string | null>(null);
  const [sampleError, setSampleError] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const { tier } = useSubscription();
  const maxSizeMB = tier === 'free' ? 5 : tier === 'starter' ? 10 : tier === 'ultra' ? 100 : tier === 'max' ? 500 : 5;

  const isOversized = selectedFile != null && selectedFile.size / (1024 * 1024) > maxSizeMB;

  useEffect(() => {
    if (!image || !imgRef.current || !canvasRef.current) return;
    setPreviewCanvas(renderCrop(canvasRef.current, imgRef.current, bgType, outputSize));
  }, [image, bgType, outputSize]);

  const applyLoadedImage = (img: HTMLImageElement, src: string) => {
    imgRef.current = img;
    setPreviewCanvas(null);
    setSampleError(false);
    setImage(src);
  };

  const loadImage = (file: File) => {
    setSelectedFile(file);
    setSampleError(false);
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => applyLoadedImage(img, src);
      img.onerror = () => setSampleError(true);
      img.src = src;
    };
    reader.onerror = () => setSampleError(true);
    reader.readAsDataURL(file);
  };

  const loadSample = () => {
    setSelectedFile(null);
    const img = new Image();
    img.onload = () => applyLoadedImage(img, '/samples/tool-sample.png');
    img.onerror = () => setSampleError(true);
    img.src = '/samples/tool-sample.png';
  };

  const handleBgChange = (nextBg: OutputBg) => {
    setBgType(nextBg);
  };

  const handleSizeChange = (size: number) => {
    setOutputSize(size);
  };

  const downloadCrop = () => {
    const img = imgRef.current;
    if (!img || !previewCanvas) return;
    const canvas = document.createElement('canvas');
    const dataUrl = renderCrop(canvas, img, bgType, outputSize);
    const link = document.createElement('a');
    link.download = `circle-crop-${outputSize}.png`;
    link.href = dataUrl;
    link.click();
  };

  const reset = () => {
    setImage(null);
    setSelectedFile(null);
    setBgType('transparent');
    setOutputSize(512);
    setPreviewCanvas(null);
    setSampleError(false);
    imgRef.current = null;
    if (canvasRef.current) canvasRef.current.width = 0;
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="tb-v2-tool-label">Circle Crop</span>
        <ToolExampleClearActions
          onExample={loadSample}
          onClear={reset}
          canClear={Boolean(image || selectedFile || previewCanvas || sampleError)}
        />
      </div>

      <div className="tb-v2-section" style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '20px' }}>
        {!image ? (
          <div
            className="border-2 border-dashed border-gray-700 hover:border-red-600 rounded-xl p-12 text-center transition-colors cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); const file = e.dataTransfer.files[0]; if (file?.type.startsWith('image/')) loadImage(file); }}
            onClick={() => document.getElementById('circle-crop-input')?.click()}
          >
            <span className="text-3xl mb-3 block">⭕</span>
            <p className="text-gray-400 text-sm">Drag &amp; drop an image, or click to browse</p>
            <p className="text-gray-600 text-xs mt-1">PNG, JPG, WebP, GIF • Max {maxSizeMB}MB</p>
            {sampleError && <p className="text-xs text-amber-500 mt-2">Couldn&apos;t load the sample image, try again.</p>}
            <input
              id="circle-crop-input"
              type="file"
              accept="image/*"
              onChange={(e) => { const file = e.target.files?.[0]; if (file) loadImage(file); }}
              className="hidden"
              aria-label="Upload image"
            />
            <UpgradeNotice tier={tier} />
            <FileSizeError file={selectedFile} maxSizeMB={maxSizeMB} />
          </div>
        ) : (
          <>
            <div className="flex justify-center">
              <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
              {previewCanvas && (
                <img
                  src={previewCanvas}
                  alt="Crop preview"
                  className="max-w-full max-h-64 rounded-lg object-contain"
                  style={{ aspectRatio: `${outputSize}/${outputSize}` }}
                />
              )}
            </div>

            <div>
              <p className="tb-v2-tool-label" style={{ marginBottom: 8 }}>Background</p>
              <div className="tb-v2-mode-tabs" role="group" aria-label="Background">
                {(['transparent', 'white', 'blur'] as OutputBg[]).map((bg) => (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => handleBgChange(bg)}
                    className={`tb-v2-mode-tab ${bgType === bg ? 'on' : ''}`}
                    aria-pressed={bgType === bg}
                  >
                    {bg === 'transparent' ? 'Transparent' : bg[0].toUpperCase() + bg.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {bgType === 'blur' && <p className="text-xs text-gray-500" style={{ margin: 0 }}>Blurred version of your image as background.</p>}

            <label className="flex items-center gap-3">
              <span className="tb-v2-tool-label">Output size</span>
              <input
                type="range"
                min={64}
                max={2048}
                step={64}
                value={outputSize}
                onChange={(e) => handleSizeChange(Number(e.target.value))}
                className="tb-v2-range flex-1"
              />
              <output className="text-sm font-semibold tabular-nums">{outputSize}px</output>
            </label>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={downloadCrop}
                disabled={!previewCanvas || isOversized}
                className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg disabled:opacity-50"
              >
                {isOversized ? 'File Too Large' : `Download ${outputSize}×${outputSize} PNG`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
