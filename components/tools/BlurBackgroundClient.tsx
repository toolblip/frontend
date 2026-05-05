'use client';

import { useState, useRef } from 'react';

export default function BlurBackgroundClient() {
  const [imageUrl, setImageUrl] = useState('');
  const [blurAmount, setBlurAmount] = useState(10);
  const [processedUrl, setProcessedUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const applyBlur = () => {
    if (!imageUrl) return;
    setLoading(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.filter = `blur(${blurAmount}px)`;
      ctx.drawImage(img, 0, 0);
      setProcessedUrl(canvas.toDataURL());
      setLoading(false);
    };
    img.onerror = () => {
      setLoading(false);
      alert('Failed to load image');
    };
    img.src = imageUrl;
  };

  const downloadImage = () => {
    if (!processedUrl) return;
    const link = document.createElement('a');
    link.download = 'blurred-image.png';
    link.href = processedUrl;
    link.click();
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Image URL</span>
      </div>
      <input
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Enter image URL..."
        className="tb-v2-tool-input"
        aria-label="Image URL"
      />
      <div style={{ margin: '0.75rem 0' }}>
        <label className="tb-v2-hint">
          Blur Amount: {blurAmount}px
          <input
            type="range"
            min="0"
            max="50"
            value={blurAmount}
            onChange={(e) => setBlurAmount(Number(e.target.value))}
            className="tb-v2-range"
            style={{ marginLeft: '1rem', width: '200px' }}
          />
        </label>
      </div>
      <div style={{ margin: '0.75rem 0' }}>
        <button type="button" onClick={applyBlur} className="tb-v2-btn tb-v2-btn-primary" disabled={loading}>
          {loading ? 'Processing...' : 'Apply Blur'}
        </button>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Result</span>
        {processedUrl && (
          <button type="button" onClick={downloadImage} className="tb-v2-copy-btn">
            Download
          </button>
        )}
      </div>
      <div className="tb-v2-tool-output-body" style={{ textAlign: 'center' }}>
        {processedUrl ? (
          <img src={processedUrl} alt="Blurred" style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '0.5rem' }} />
        ) : (
          <p className="tb-v2-hint">Enter an image URL and adjust blur to preview</p>
        )}
      </div>
    </div>
  );
}
