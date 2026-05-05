'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface Selection {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export default function CropClient() {
  const [image, setImage] = useState<string | null>(null);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setCroppedImage(null);
        setSelection(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const scaleX = imageRef.current.naturalWidth / rect.width;
    const scaleY = imageRef.current.naturalHeight / rect.height;
    
    setIsSelecting(true);
    setSelection({
      startX: (e.clientX - rect.left) * scaleX,
      startY: (e.clientY - rect.top) * scaleY,
      endX: (e.clientX - rect.left) * scaleX,
      endY: (e.clientY - rect.top) * scaleY,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSelecting || !selection || !imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const scaleX = imageRef.current.naturalWidth / rect.width;
    const scaleY = imageRef.current.naturalHeight / rect.height;

    setSelection({
      ...selection,
      endX: (e.clientX - rect.left) * scaleX,
      endY: (e.clientY - rect.top) * scaleY,
    });
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
  };

  const applyCrop = useCallback(() => {
    if (!image || !selection || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const x = Math.min(selection.startX, selection.endX);
      const y = Math.min(selection.startY, selection.endY);
      const width = Math.abs(selection.endX - selection.startX);
      const height = Math.abs(selection.endY - selection.startY);

      if (width <= 0 || height <= 0) return;

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
      setCroppedImage(canvas.toDataURL('image/png'));
    };
    img.src = image;
  }, [image, selection]);

  const handleDownload = () => {
    if (!croppedImage) return;
    const link = document.createElement('a');
    link.download = 'cropped-image.png';
    link.href = croppedImage;
    link.click();
  };

  const getSelectionStyle = () => {
    if (!selection || !imageRef.current) return {};
    const rect = imageRef.current.getBoundingClientRect();
    const scaleX = rect.width / imageRef.current.naturalWidth;
    const scaleY = rect.height / imageRef.current.naturalHeight;

    return {
      left: Math.min(selection.startX, selection.endX) * scaleX,
      top: Math.min(selection.startY, selection.endY) * scaleY,
      width: Math.abs(selection.endX - selection.startX) * scaleX,
      height: Math.abs(selection.endY - selection.startY) * scaleY,
    };
  };

  return (
    <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4 tb-v2-p-4">
      <h2 className="tb-v2-text-2xl tb-v2-font-bold">Crop Image</h2>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="tb-v2-file-input"
      />

      {image && (
        <button onClick={applyCrop} className="tb-v2-btn tb-v2-btn-primary">
          Apply Crop
        </button>
      )}

      <canvas ref={canvasRef} className="tb-v2-hidden" />

      {image && (
        <div className="tb-v2-relative tb-v2-inline-block" ref={previewRef}>
          <div
            className="tb-v2-relative tb-v2-cursor-crosshair tb-v2-select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              ref={imageRef}
              src={image}
              alt="Crop preview"
              className="tb-v2-max-w-full tb-v2-rounded-lg"
              draggable={false}
            />
            {selection && (
              <div
                className="tb-v2-absolute tb-v2-border-2 tb-v2-border-blue-500 tb-v2-bg-blue-500/10"
                style={getSelectionStyle()}
              />
            )}
          </div>
          <p className="tb-v2-text-xs tb-v2-text-gray-500 tb-v2-mt-1">
            Click and drag to select crop area
          </p>
        </div>
      )}

      {croppedImage && (
        <div className="tb-v2-mt-4">
          <p className="tb-v2-text-sm tb-v2-font-medium tb-v2-mb-2">Cropped</p>
          <img src={croppedImage} alt="Cropped" className="tb-v2-max-w-full tb-v2-rounded-lg" />
          <button onClick={handleDownload} className="tb-v2-btn tb-v2-btn-secondary tb-v2-mt-2">
            Download
          </button>
        </div>
      )}
    </div>
  );
}
