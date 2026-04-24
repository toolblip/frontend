'use client';

import { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';

const SIZES = [
  { label: 'S', value: 128, desc: '128px' },
  { label: 'M', value: 256, desc: '256px' },
  { label: 'L', value: 512, desc: '512px' },
  { label: 'XL', value: 1024, desc: '1024px' },
];

export default function QrCodeGeneratorClient() {
  const [text, setText] = useState('https://toolblip.com');
  const [size, setSize] = useState(256);
  const [dataUrl, setDataUrl] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!text.trim()) {
      setDataUrl('');
      return;
    }
    QRCode.toDataURL(text, {
      width: size,
      margin: 2,
      color: { dark: '#18181b', light: '#ffffff' },
    }).then(setDataUrl).catch(() => setDataUrl(''));
  }, [text, size]);

  const downloadPng = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'qr-code.png';
    a.click();
  };

  const downloadSvg = async () => {
    if (!text.trim()) return;
    try {
      const svg = await QRCode.toString(text, {
        type: 'svg',
        width: size,
        margin: 2,
        color: { dark: '#18181b', light: '#ffffff' },
      });
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qr-code.svg';
      a.click();
      URL.revokeObjectURL(url);
    } catch {}
  };

  return (
    <div className="tb-v2-qr-root">
      <div className="tb-v2-qr-form">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter URL, text, or any data…"
          className="tb-v2-wc-input"
          rows={3}
          aria-label="QR code content"
        />

        <div className="tb-v2-qr-size-row">
          <span className="tb-v2-qr-size-label">Size</span>
          <div className="tb-v2-qr-sizes">
            {SIZES.map((s) => (
              <button
                key={s.value}
                type="button"
                className={`tb-v2-qr-size-btn ${size === s.value ? 'on' : ''}`}
                onClick={() => setSize(s.value)}
                title={s.desc}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="tb-v2-qr-dl-row">
          <button
            type="button"
            className="tb-v2-qr-dl-btn"
            onClick={downloadPng}
            disabled={!dataUrl}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            PNG
          </button>
          <button
            type="button"
            className="tb-v2-qr-dl-btn"
            onClick={downloadSvg}
            disabled={!text.trim()}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            SVG
          </button>
        </div>
      </div>

      <div className="tb-v2-qr-preview-wrap">
        {dataUrl ? (
          <img src={dataUrl} alt="QR code" className="tb-v2-qr-preview-img" />
        ) : (
          <div className="tb-v2-qr-empty">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
            <span>Enter text to generate QR code</span>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
