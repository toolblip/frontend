'use client';
import UtilityDesignLayout from './UtilityDesignLayout';
import ToolExampleClearActions from './ToolExampleClearActions';

import { useState, useRef, useCallback, useEffect } from 'react';

interface ShadowConfig {
  offsetX: number;
  offsetY: number;
  blur: number;
  color: string;
  opacity: number;
}

export default function ImageShadowGeneratorClient() {
  const generation=useRef(0);
  const [error,setError]=useState('');
  useEffect(()=>()=>{generation.current++;},[]);
  const [image, setImage] = useState<string | null>(null);
  const [shadow, setShadow] = useState<ShadowConfig>({
    offsetX: 10,
    offsetY: 10,
    blur: 20,
    color: '#000000',
    opacity: 0.5,
  });
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadExample=()=>{ generation.current++; setError(''); setProcessedImage(null); const c=document.createElement('canvas'); c.width=120;c.height=80;const ctx=c.getContext('2d')!;ctx.fillStyle='#ef4444';ctx.fillRect(10,10,100,60);setImage(c.toDataURL('image/png')); };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file=e.target.files?.[0]; if(!file) return;
    const id=++generation.current; setImage(null); setProcessedImage(null);setError('');
    if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>10*1024*1024){setError('Choose a PNG, JPEG, or WebP up to 10 MiB.');return;}
    const reader=new FileReader();
    const timer=setTimeout(()=>{reader.abort();if(id===generation.current)setError('Image read timed out.');},15000);
    reader.onload=()=>{if(id===generation.current)setImage(String(reader.result));};
    reader.onerror=()=>{if(id===generation.current)setError('Could not read image.');};
    reader.onloadend=()=>clearTimeout(timer);reader.readAsDataURL(file);
  };

  const applyShadow = useCallback(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const id=++generation.current; setError(''); setProcessedImage(null);
    const img = new Image();
    const timer=setTimeout(()=>{if(id===generation.current){generation.current++;setError('Image decoding timed out.');}},15000);
    img.onerror=()=>{clearTimeout(timer);if(id===generation.current)setError('Invalid image bytes.');};
    img.onload = () => {
      clearTimeout(timer); if(id!==generation.current)return;
      if(img.width*img.height>16000000 || img.width>8000 || img.height>8000){setError('Maximum image size is 16 megapixels and 8000 pixels per side.');return;}
      const padding = shadow.blur + Math.max(Math.abs(shadow.offsetX), Math.abs(shadow.offsetY));
      canvas.width = img.width + padding * 2;
      canvas.height = img.height + padding * 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.shadowColor = shadow.color + Math.round(shadow.opacity*255).toString(16).padStart(2,'0');
      ctx.shadowOffsetX = shadow.offsetX + canvas.width*2;
      ctx.shadowOffsetY = shadow.offsetY;
      ctx.shadowBlur = shadow.blur;


      ctx.drawImage(img, padding-canvas.width*2, padding);
      ctx.restore();

      ctx.drawImage(img, padding, padding);

      setProcessedImage(canvas.toDataURL('image/png'));
    };
    img.src = image;
  }, [image, shadow]);

  useEffect(()=>{ if(image) applyShadow(); },[image,applyShadow]);

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.download = 'shadow-image.png';
    link.href = processedImage;
    link.click();
  };

  return (<UtilityDesignLayout>
    <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4 tb-v2-p-4">
      <ToolExampleClearActions onExample={() => { loadExample(); }} onClear={() => { generation.current++; setImage(null); setProcessedImage(null); setError(''); if(fileInputRef.current) fileInputRef.current.value=''; }}/>
      {error && <p role="alert">{error}</p>}
      <p>PNG export preserves transparent shadow margins, including for JPEG inputs.</p>
      <h2 className="tb-v2-text-2xl tb-v2-font-bold">Drop Shadow</h2>

      <input aria-label="Upload file"
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="tb-v2-file-input"
      />

      {image && (
        <>
          <div className="tb-v2-flex tb-v2-items-center tb-v2-gap-4">
            <label className="tb-v2-text-sm tb-v2-font-medium">Offset X: {shadow.offsetX}px</label>
            <input aria-label="Shadow offset X"
              type="range"
              min="-50"
              max="50"
              value={shadow.offsetX}
              onChange={(e) => setShadow({ ...shadow, offsetX: Number(e.target.value) })}
              className="tb-v2-range"
            />
          </div>

          <div className="tb-v2-flex tb-v2-items-center tb-v2-gap-4">
            <label className="tb-v2-text-sm tb-v2-font-medium">Offset Y: {shadow.offsetY}px</label>
            <input aria-label="Shadow offset Y"
              type="range"
              min="-50"
              max="50"
              value={shadow.offsetY}
              onChange={(e) => setShadow({ ...shadow, offsetY: Number(e.target.value) })}
              className="tb-v2-range"
            />
          </div>

          <div className="tb-v2-flex tb-v2-items-center tb-v2-gap-4">
            <label className="tb-v2-text-sm tb-v2-font-medium">Blur: {shadow.blur}px</label>
            <input aria-label="Shadow blur"
              type="range"
              min="0"
              max="100"
              value={shadow.blur}
              onChange={(e) => setShadow({ ...shadow, blur: Number(e.target.value) })}
              className="tb-v2-range"
            />
          </div>

          <div className="tb-v2-flex tb-v2-items-center tb-v2-gap-4">
            <label className="tb-v2-text-sm tb-v2-font-medium">Opacity: {Math.round(shadow.opacity * 100)}%</label>
            <input aria-label="Shadow opacity"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={shadow.opacity}
              onChange={(e) => setShadow({ ...shadow, opacity: Number(e.target.value) })}
              className="tb-v2-range"
            />
          </div>

          <div className="tb-v2-flex tb-v2-items-center tb-v2-gap-4">
            <label className="tb-v2-text-sm tb-v2-font-medium">Color:</label>
            <input aria-label="Shadow color"
              type="color"
              value={shadow.color}
              onChange={(e) => setShadow({ ...shadow, color: e.target.value })}
              className="tb-v2-color-input"
            />
          </div>

          <button onClick={applyShadow} className="tb-v2-btn tb-v2-btn-primary">
            Apply Shadow
          </button>
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />

      {image && (
        <div className="tb-v2-grid tb-v2-grid-cols-2 tb-v2-gap-4">
          <div>
            <p className="tb-v2-tool-label" style={{marginBottom:8}}>Original</p>
            <img src={image} alt="Original" className="tb-v2-max-w-full tb-v2-rounded-lg" />
          </div>
          {processedImage && (
            <div>
              <p className="tb-v2-tool-label" style={{marginBottom:8}}>With Shadow</p>
              <img src={processedImage} alt="Shadow" className="tb-v2-max-w-full tb-v2-rounded-lg" />
              <button onClick={handleDownload} className="tb-v2-btn tb-v2-btn-secondary tb-v2-mt-2">
                Download
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  </UtilityDesignLayout>
  );
}
