'use client';

import { useState, useRef, useEffect } from 'react';

import ToolExampleClearActions from './ToolExampleClearActions';
import {readImage,exampleFile} from '@/lib/images-qa';

export default function CropCircleClient() {
  const [image, setImage] = useState<string | null>(null);
  const [size, setSize] = useState(200);
  const [borderWidth, setBorderWidth] = useState(0);
  const [borderColor, setBorderColor] = useState('#ffffff');
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const request=useRef(0),decoded=useRef<HTMLImageElement|null>(null);
  const [error,setError]=useState('');
  useEffect(()=>()=>{request.current++;},[]);useEffect(()=>()=>{if(image)URL.revokeObjectURL(image);},[image]);
  const clear=()=>{request.current++;setImage(null);decoded.current=null;setError('');if(fileInputRef.current)fileInputRef.current.value='';};
  const loadFile=async(file:File|undefined)=>{if(!file)return;clear();const id=request.current;try{const {img,mime,bytes}=await readImage(file);if(id!==request.current)return;decoded.current=img;setImage(URL.createObjectURL(new Blob([bytes],{type:mime})));}catch(e){if(id===request.current)setError((e as Error).message);}};

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

    const img = decoded.current;
    if(!img)return;
    const side=Math.min(img.naturalWidth,img.naturalHeight);
    ctx.drawImage(img,(img.naturalWidth-side)/2,(img.naturalHeight-side)/2,side,side,borderWidth,borderWidth,size,size);
    const link=document.createElement('a');link.download='circle-crop.png';link.href=canvas.toDataURL('image/png');link.click();
  };

  return (
    <div className="tb-v2-tool-card" style={{display:"grid",gap:12}}><style jsx>{`input,textarea,select {max-width:100%;min-width:0} .tb-v2-tool-card {min-width:0;max-width:100%;overflow-wrap:anywhere} .tb-v2-tool-input-head {flex-wrap:wrap;gap:8px} .tb-v2-range-row {flex-wrap:wrap} .tb-v2-range {min-width:0;flex:1}`}</style>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Crop Circle</span><ToolExampleClearActions onExample={()=>loadFile(exampleFile())} onClear={clear}/>
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
          aria-label="Upload image" ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
      </div>

      {error&&<p role="alert">{error}</p>}
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
              aria-label="Size" value={size}
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
              aria-label="Border Width" value={borderWidth}
              onChange={(e) => setBorderWidth(Number(e.target.value))}
              className="tb-v2-range"
            />
            <span className="tb-v2-range-val">{borderWidth}px</span>
          </div>

          <div className="flex items-center gap-4">
            <label className="tb-v2-tool-label">Border Color</label>
            <input
              type="color"
              aria-label="Border Color" value={borderColor}
              onChange={(e) => setBorderColor(e.target.value)}
              style={{ width: 40, height: 40, borderRadius: 6, border: '1px solid var(--line)' }}
            />
          </div>

          <div
            className="mx-auto rounded-full bg-gray-100 flex items-center justify-center overflow-hidden"
            style={{
              width: size + borderWidth * 2, maxWidth: '100%', aspectRatio: '1',
              height: 'auto',
              border: borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : 'none',
            }}
          >
            <img
              src={image}
              alt="Preview"
              className="rounded-full"
              style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }}
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
