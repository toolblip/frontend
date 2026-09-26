'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

import ToolExampleClearActions from './ToolExampleClearActions';
import {readImage,exampleFile} from '@/lib/images-qa';

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

  const outputMime=useRef('image/png');
  const request=useRef(0),decoded=useRef<HTMLImageElement|null>(null);
  const [error,setError]=useState('');
  useEffect(()=>()=>{request.current++;},[]);useEffect(()=>()=>{if(image)URL.revokeObjectURL(image);},[image]);
  const clear=()=>{request.current++;decoded.current=null;setImage(null);setSelection(null);setCroppedImage(null);setError('');if(fileInputRef.current)fileInputRef.current.value='';};
  const loadFile=async(file:File|undefined)=>{if(!file)return;clear();const id=request.current;try{const {img,mime,bytes}=await readImage(file);if(id!==request.current)return;decoded.current=img;outputMime.current=mime==='image/jpeg'?'image/jpeg':'image/png';setImage(URL.createObjectURL(new Blob([bytes],{type:mime})));setSelection({startX:0,startY:0,endX:img.naturalWidth,endY:img.naturalHeight});}catch(e){if(id===request.current)setError((e as Error).message);}};

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    loadFile(e.target.files?.[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    loadFile(e.dataTransfer.files?.[0]);
  };

  const handleMouseDown = (e: React.PointerEvent) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const scaleX = imageRef.current.naturalWidth / rect.width;
    const scaleY = imageRef.current.naturalHeight / rect.height;

    e.currentTarget.setPointerCapture(e.pointerId);
    setIsSelecting(true);
    setSelection({
      startX: Math.max(0,Math.min(imageRef.current.naturalWidth,(e.clientX - rect.left) * scaleX)),
      startY: Math.max(0,Math.min(imageRef.current.naturalHeight,(e.clientY - rect.top) * scaleY)),
      endX: Math.max(0,Math.min(imageRef.current.naturalWidth,(e.clientX - rect.left) * scaleX)),
      endY: Math.max(0,Math.min(imageRef.current.naturalHeight,(e.clientY - rect.top) * scaleY)),
    });
  };

  const handleMouseMove = (e: React.PointerEvent) => {
    if (!isSelecting || !selection || !imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const scaleX = imageRef.current.naturalWidth / rect.width;
    const scaleY = imageRef.current.naturalHeight / rect.height;

    setSelection({
      ...selection,
      endX: Math.max(0,Math.min(imageRef.current.naturalWidth,(e.clientX - rect.left) * scaleX)),
      endY: Math.max(0,Math.min(imageRef.current.naturalHeight,(e.clientY - rect.top) * scaleY)),
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

    const img = decoded.current;
    if(!img)return;
    {
      const x = Math.min(selection.startX, selection.endX);
      const y = Math.min(selection.startY, selection.endY);
      const width = Math.round(Math.abs(selection.endX - selection.startX));
      const height = Math.round(Math.abs(selection.endY - selection.startY));

      if (width <= 0 || height <= 0) {setCroppedImage(null);return;}

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
      setCroppedImage(canvas.toDataURL(outputMime.current,0.92));
    };

  }, [image, selection]);

  useEffect(()=>{applyCrop();},[applyCrop]);

  const handleDownload = () => {
    if (!croppedImage) return;
    const link = document.createElement('a');
    link.download = outputMime.current==='image/jpeg'?'cropped-image.jpg':'cropped-image.png';
    link.href = croppedImage;
    link.click();
  };

  const getSelectionStyle = () => {
    if (!selection || !imageRef.current) return {};
    const rect = imageRef.current.getBoundingClientRect();
    const scaleX = rect.width / imageRef.current.naturalWidth;
    const scaleY = rect.height / imageRef.current.naturalHeight;

    return {
      left: `${Math.min(selection.startX, selection.endX) / imageRef.current.naturalWidth * 100}%`,
      top: `${Math.min(selection.startY, selection.endY) / imageRef.current.naturalHeight * 100}%`,
      width: `${Math.abs(selection.endX - selection.startX) / imageRef.current.naturalWidth * 100}%`,
      height: `${Math.abs(selection.endY - selection.startY) / imageRef.current.naturalHeight * 100}%`,
    };
  };

  return (
    <div className="tb-v2-tool-card flex flex-col gap-4"><style jsx>{`input,textarea,select {max-width:100%;min-width:0} .tb-v2-tool-card {min-width:0;max-width:100%;overflow-wrap:anywhere} .tb-v2-tool-input-head {flex-wrap:wrap;gap:8px} .tb-v2-range-row {flex-wrap:wrap} .tb-v2-range {min-width:0;flex:1}`}</style>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Crop Image</span><ToolExampleClearActions onExample={()=>loadFile(exampleFile())} onClear={clear}/>
      </div>

      {error&&<p role="alert">{error}</p>}
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
          aria-label="Upload image" ref={fileInputRef}
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
              className="relative cursor-crosshair select-none" style={{touchAction:"none"}}
              onPointerDown={handleMouseDown}
              onPointerMove={handleMouseMove}
              onPointerUp={handleMouseUp}
              onPointerCancel={handleMouseUp}
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
