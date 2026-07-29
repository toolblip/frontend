'use client';

import { useState, useRef, useCallback } from 'react';

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setProcessedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const createMeme = useCallback(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
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
          ctx.strokeText(line.toUpperCase(), canvas.width / 2, lineY);
          ctx.fillStyle = fill;
          ctx.fillText(line.toUpperCase(), canvas.width / 2, lineY);
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
    img.src = image;
  }, [image, topText, bottomText, fontSize, textColor, strokeColor]);

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.download = 'meme.png';
    link.href = processedImage;
    link.click();
  };

  return (
    <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4 tb-v2-p-4">
      <h2 className="tb-v2-text-2xl tb-v2-font-bold">Meme Maker</h2>

      <input
        ref={fileInputRef}
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
                type="text"
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
                placeholder="TOP TEXT"
                className="tb-v2-input"
              />
            </div>
            <div>
              <label className="tb-v2-text-sm tb-v2-font-medium tb-v2-block tb-v2-mb-1">Bottom Text</label>
              <input
                type="text"
                value={bottomText}
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
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="tb-v2-range"
            />
          </div>

          <div className="tb-v2-flex tb-v2-items-center tb-v2-gap-4">
            <div className="tb-v2-flex tb-v2-items-center tb-v2-gap-2">
              <label className="tb-v2-text-sm tb-v2-font-medium">Text:</label>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="tb-v2-w-8 tb-v2-h-8 tb-v2-rounded"
              />
            </div>
            <div className="tb-v2-flex tb-v2-items-center tb-v2-gap-2">
              <label className="tb-v2-text-sm tb-v2-font-medium">Stroke:</label>
              <input
                type="color"
                value={strokeColor}
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

      <canvas ref={canvasRef} className="tb-v2-hidden" />

      {image && (
        <div className="tb-v2-mt-4">
          <p className="tb-v2-tool-label" style={{marginBottom:8}}>Preview</p>
          <img src={image} alt="Original" className="tb-v2-max-w-full tb-v2-rounded-lg" />
        </div>
      )}

      {processedImage && (
        <div className="tb-v2-mt-4">
          <p className="tb-v2-tool-label" style={{marginBottom:8}}>Meme Result</p>
          <img src={processedImage} alt="Meme" className="tb-v2-max-w-full tb-v2-rounded-lg" />
          <button onClick={handleDownload} className="tb-v2-btn tb-v2-btn-secondary tb-v2-mt-2">
            Download Meme
          </button>
        </div>
      )}
    </div>
  );
}