'use client';

import { useState, useRef } from 'react';

export default function ChangeBgPhotoClient() {
  const [imageUrl, setImageUrl] = useState('');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [bgType, setBgType] = useState<'color' | 'transparent' | 'blur'>('transparent');
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const processImage = async () => {
    if (!imageUrl.trim()) return;

    setLoading(true);
    
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = imageUrl.trim();
      });

      const canvas = canvasRef.current;
      if (!canvas) return;
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (bgType === 'transparent') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        setProcessedImage(dataUrl);
      } else if (bgType === 'color') {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        setProcessedImage(dataUrl);
      } else if (bgType === 'blur') {
        // Create blurred background
        ctx.filter = 'blur(20px)';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.filter = 'none';
        // Draw original on top with slight transparency effect
        ctx.globalAlpha = 0.7;
        ctx.drawImage(img, 0, 0);
        ctx.globalAlpha = 1;
        const dataUrl = canvas.toDataURL('image/png');
        setProcessedImage(dataUrl);
      }
    } catch (err) {
      console.error('Error processing image:', err);
    }

    setLoading(false);
  };

  const downloadImage = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.download = 'background-changed.png';
    link.href = processedImage;
    link.click();
  };

  const copyToClipboard = async () => {
    if (!processedImage) return;
    
    try {
      const response = await fetch(processedImage);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
    } catch (err) {
      console.error('Failed to copy image:', err);
    }
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Enter image URL to change background</span>
      </div>

      <div className="tb-v2-input-group">
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="tb-v2-tool-input"
          aria-label="Image URL"
        />
      </div>

      <div className="tb-v2-tool-options" style={{ marginTop: '0.75rem' }}>
        <div className="tb-v2-tool-input-head" style={{ marginBottom: '0.5rem' }}>
          <span className="tb-v2-tool-label">Background Type</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setBgType('transparent')}
            className={`tb-v2-btn ${bgType === 'transparent' ? 'tb-v2-btn-primary' : 'tb-v2-btn-secondary'}`}
          >
            Transparent
          </button>
          <button
            type="button"
            onClick={() => setBgType('color')}
            className={`tb-v2-btn ${bgType === 'color' ? 'tb-v2-btn-primary' : 'tb-v2-btn-secondary'}`}
          >
            Solid Color
          </button>
          <button
            type="button"
            onClick={() => setBgType('blur')}
            className={`tb-v2-btn ${bgType === 'blur' ? 'tb-v2-btn-primary' : 'tb-v2-btn-secondary'}`}
          >
            Blur Effect
          </button>
        </div>
      </div>

      {bgType === 'color' && (
        <div style={{ marginTop: '0.75rem' }}>
          <label className="tb-v2-hint">Background Color</label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="tb-v2-color-input"
            aria-label="Background color"
          />
          <span className="tb-v2-hint" style={{ marginLeft: '0.5rem' }}>{bgColor}</span>
        </div>
      )}

      <div style={{ margin: '0.75rem 0' }}>
        <button
          type="button"
          onClick={processImage}
          disabled={loading || !imageUrl.trim()}
          className="tb-v2-btn tb-v2-btn-primary"
        >
          {loading ? 'Processing...' : 'Change Background'}
        </button>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Result</span>
      </div>
      <div className="tb-v2-tool-output-body">
        {processedImage ? (
          <div>
            <img
              src={processedImage}
              alt="Processed"
              style={{ maxWidth: '100%', borderRadius: '0.5rem' }}
            />
            <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={downloadImage}
                className="tb-v2-btn tb-v2-btn-secondary"
              >
                Download Image
              </button>
              <button
                type="button"
                onClick={copyToClipboard}
                className="tb-v2-btn tb-v2-btn-secondary"
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        ) : (
          <p className="tb-v2-hint">Enter an image URL and select background options</p>
        )}
      </div>
    </div>
  );
}
