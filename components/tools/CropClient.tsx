'use client';

import { useState, useRef, useCallback } from 'react';

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
  const [isDragging, setIsDragging] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const loadFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setCroppedImage(null);
      setSelection(null);
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
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Crop Image</span>
      </div>

      <div
        className={`tb-v2-dropzone ${isDragging ? 'dragging' : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <span style={{ fontSize: 28 }}>✂️</span>
        <span className="tb-v2-dropzone-text">Click or drag an image here</span>
        <span className="tb-v2-dropzone-hint">Then drag on the preview to select a crop area</span>
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
          <div className="relative inline-block">
            <div
              className="relative cursor-crosshair select-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img
                ref={imageRef}
                src={image}
                alt="Crop preview"
                className="max-w-full rounded-lg"
                draggable={false}
              />
              {selection && (
                <div
                  className="absolute border-2 border-blue-500 bg-blue-500/10"
                  style={getSelectionStyle()}
                />
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={applyCrop}
            disabled={!selection}
            className="tb-v2-btn tb-v2-btn-primary"
            style={{ alignSelf: 'flex-start' }}
          >
            Apply Crop
          </button>
        </>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {croppedImage && (
        <div>
          <p className="tb-v2-tool-label" style={{ marginBottom: 8 }}>Cropped</p>
          <img src={croppedImage} alt="Cropped" className="max-w-full rounded-lg" />
          <button type="button" onClick={handleDownload} className="tb-v2-btn" style={{ marginTop: 8 }}>
            Download
          </button>
        </div>
      )}
    </div>
  );
}
