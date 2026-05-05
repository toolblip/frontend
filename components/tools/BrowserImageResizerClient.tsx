'use client';

import { useState, useRef } from 'react';

export default function BrowserImageResizerClient({}: {}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [lockRatio, setLockRatio] = useState(true);
  const [result, setResult] = useState('');
  const [ratio, setRatio] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    const img = new Image();
    img.onload = () => {
      setWidth(String(img.width));
      setHeight(String(img.height));
      setRatio(img.width / img.height);
    };
    img.src = url;
  };

  const handleWidth = (w: string) => {
    setWidth(w);
    if (lockRatio) setHeight(String(Math.round(Number(w) / ratio)));
  };

  const handleHeight = (h: string) => {
    setHeight(h);
    if (lockRatio) setWidth(String(Math.round(Number(h) * ratio)));
  };

  const resize = () => {
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = Number(width) || img.width;
      canvas.height = Number(height) || img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      setResult(canvas.toDataURL('image/png'));
    };
    img.src = preview;
  };

  return (
    <div className="tb-v2-stack">
      <div className="tb-v2-card">
        <h3 className="tb-v2-label">Upload Image</h3>
        <input type="file" accept="image/*" onChange={handleFile} className="tb-v2-input" />
        {preview && <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '0.5rem' }} />}
      </div>
      {file && (
        <div className="tb-v2-card">
          <h3 className="tb-v2-label">Resize</h3>
          <div className="tb-v2-flex-row" style={{ gap: '0.5rem', alignItems: 'center' }}>
            <div>
              <label className="tb-v2-label" style={{ fontSize: '0.75rem' }}>Width</label>
              <input className="tb-v2-input" type="number" value={width} onChange={(e) => handleWidth(e.target.value)} />
            </div>
            <div style={{ marginTop: '1.25rem' }}>
              <button className="tb-v2-btn" onClick={() => setLockRatio(!lockRatio)} style={{ fontSize: '0.7rem' }}>
                {lockRatio ? '🔗' : '🔓'}
              </button>
            </div>
            <div>
              <label className="tb-v2-label" style={{ fontSize: '0.75rem' }}>Height</label>
              <input className="tb-v2-input" type="number" value={height} onChange={(e) => handleHeight(e.target.value)} />
            </div>
          </div>
          <button className="tb-v2-btn" onClick={resize} style={{ marginTop: '0.75rem' }}>Resize Image</button>
        </div>
      )}
      {result && (
        <div className="tb-v2-card">
          <h3 className="tb-v2-label">Result</h3>
          <img src={result} alt="Resized" style={{ maxWidth: '100%' }} />
          <a href={result} download="resized.png" className="tb-v2-btn" style={{ marginTop: '0.5rem', display: 'inline-block' }}>Download</a>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
