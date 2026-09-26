'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

import ToolExampleClearActions from './ToolExampleClearActions';
import {readImage,exampleFile} from '@/lib/images-qa';

export default function MemeMakerClient() {
  const [image, setImage] = useState<string | null>(null);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(48);
  const [textColor, setTextColor] = useState('#ffffff');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const request=useRef(0),decoded=useRef<HTMLImageElement|null>(null);
  const [error,setError]=useState('');
  useEffect(()=>()=>{request.current++;},[]);useEffect(()=>()=>{if(image)URL.revokeObjectURL(image);},[image]);
  const clear=()=>{request.current++;decoded.current=null;setImage(null);setProcessedImage(null);setTopText('');setBottomText('');setError('');if(fileInputRef.current)fileInputRef.current.value='';};
  const load=async(file?:File)=>{if(!file)return;clear();const id=request.current;try{const {img,mime,bytes}=await readImage(file);if(id!==request.current)return;decoded.current=img;setImage(URL.createObjectURL(new Blob([bytes],{type:mime})));}catch(e){if(id===request.current)setError((e as Error).message);}};
  const handleImageUpload=(e:React.ChangeEvent<HTMLInputElement>)=>load(e.target.files?.[0]);

  const createMeme = useCallback(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = decoded.current;
    if(!img)return;
    {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      const fontSizePx = fontSize * (img.width / 500);
      ctx.font = `bold ${fontSizePx}px Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      const strokeWidth = Math.max(2, fontSizePx / 15);

      const drawText = (text: string, y: number, stroke: string, fill: string) => {
        const lines = text.split('\n');
        const lineHeight = fontSizePx * 1.2;

        lines.forEach((line, i) => {
          const lineY = y + i * lineHeight;
          ctx.strokeStyle = stroke;
          ctx.lineWidth = strokeWidth;
          ctx.lineJoin = 'round';
          ctx.strokeText(line.toUpperCase(), canvas.width / 2, lineY,canvas.width*0.94);
          ctx.fillStyle = fill;
          ctx.fillText(line.toUpperCase(), canvas.width / 2, lineY,canvas.width*0.94);
        });
      };

      if (topText) {
        const topY = img.height * 0.02;
        drawText(topText, topY, strokeColor, textColor);
      }

      if (bottomText) {
        const bottomY = img.height - fontSizePx * (bottomText.split('\n').length + 0.5);
        drawText(bottomText, bottomY, strokeColor, textColor);
      }

      setProcessedImage(canvas.toDataURL('image/png'));
    };

  }, [image, topText, bottomText, fontSize, textColor, strokeColor]);

  useEffect(()=>{createMeme();},[createMeme]);

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.download = 'meme.png';
    link.href = processedImage;
    link.click();
  };

  return (
    <div className="tb-v2-tool-card" style={{display:"grid",gap:12,padding:16}}><style jsx>{`input,textarea,select {max-width:100%;min-width:0} .tb-v2-tool-card {min-width:0;max-width:100%;overflow-wrap:anywhere} .tb-v2-tool-input-head {flex-wrap:wrap;gap:8px} .tb-v2-range-row {flex-wrap:wrap} .tb-v2-range {min-width:0;flex:1}`}</style>
      <div className="tb-v2-tool-input-head"><span>Meme Maker</span><ToolExampleClearActions onExample={()=>load(exampleFile())} onClear={clear}/></div>{error&&<p role="alert">{error}</p>}

      <input
        aria-label="Upload image" ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="tb-v2-file-input"
      />

      {image && (
        <>
          <div className="tb-v2-grid tb-v2-grid-cols-2 tb-v2-gap-4">
            <div>
              <label className="tb-v2-text-sm tb-v2-font-medium tb-v2-block tb-v2-mb-1">Top Text</label>
              <input
                type="text" maxLength={200}
                aria-label="Top Text" value={topText}
                onChange={(e) => setTopText(e.target.value)}
                placeholder="TOP TEXT"
                className="tb-v2-input"
              />
            </div>
            <div>
              <label className="tb-v2-text-sm tb-v2-font-medium tb-v2-block tb-v2-mb-1">Bottom Text</label>
              <input
                type="text" maxLength={200}
                aria-label="Bottom Text" value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
                placeholder="BOTTOM TEXT"
                className="tb-v2-input"
              />
            </div>
          </div>

          <div className="tb-v2-flex tb-v2-items-center tb-v2-gap-4">
            <label className="tb-v2-text-sm tb-v2-font-medium">Font Size: {fontSize}px</label>
            <input
              type="range"
              min="20"
              max="100"
              aria-label="Font Size" value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="tb-v2-range"
            />
          </div>

          <div className="tb-v2-flex tb-v2-items-center tb-v2-gap-4">
            <div className="tb-v2-flex tb-v2-items-center tb-v2-gap-2">
              <label className="tb-v2-text-sm tb-v2-font-medium">Text:</label>
              <input
                type="color"
                aria-label="Text Color" value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="tb-v2-w-8 tb-v2-h-8 tb-v2-rounded"
              />
            </div>
            <div className="tb-v2-flex tb-v2-items-center tb-v2-gap-2">
              <label className="tb-v2-text-sm tb-v2-font-medium">Stroke:</label>
              <input
                type="color"
                aria-label="Stroke Color" value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                className="tb-v2-w-8 tb-v2-h-8 tb-v2-rounded"
              />
            </div>
          </div>

          <button
            onClick={createMeme}
            className="tb-v2-btn tb-v2-btn-primary"
          >
            Generate Meme
          </button>
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />

      {image && (
        <div className="tb-v2-mt-4">
          <p className="tb-v2-tool-label" style={{marginBottom:8}}>Preview</p>
          <img src={image} alt="Original" style={{maxWidth:"100%"}} />
        </div>
      )}

      {processedImage && (
        <div className="tb-v2-mt-4">
          <p className="tb-v2-tool-label" style={{marginBottom:8}}>Meme Result</p>
          <img src={processedImage} alt="Meme" style={{maxWidth:"100%"}} />
          <button onClick={handleDownload} className="tb-v2-btn tb-v2-btn-secondary tb-v2-mt-2">
            Download Meme
          </button>
        </div>
      )}
    </div>
  );
}
