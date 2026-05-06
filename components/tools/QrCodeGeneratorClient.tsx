'use client';

import { useState, useRef } from 'react';

const SIZES = [
  { label: 'S', value: 128 },
  { label: 'M', value: 256 },
  { label: 'L', value: 512 },
  { label: 'XL', value: 1024 },
];

export default function QrCodeGeneratorClient() {
  const [text, setText] = useState('');
  const [size, setSize] = useState(256);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function generate() {
    if (!text.trim()) {
      setError('Please enter a URL or text to encode.');
      setImageUrl('');
      inputRef.current?.focus();
      return;
    }
    setError('');
    setGenerating(true);
    try {
      // Use Google Charts API to generate QR code — reliable, no canvas needed
      const encoded = encodeURIComponent(text);
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&format=png&margin=2`;
      setImageUrl(url);
    } catch {
      setError('Could not generate QR code. Please check your input.');
      setImageUrl('');
    } finally {
      setGenerating(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      generate();
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setText(e.target.value);
    if (error) setError('');
  }

  function downloadPng() {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = 'qr-code.png';
    a.click();
  }

  return (
    <div className="tb-v2-qr-root">
      {/* Input row */}
      <div className="tb-v2-qr-input-row">
        <div className="tb-v2-qr-input-wrap">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter URL, text, WiFi, email…"
            className={`tb-v2-qr-input ${error ? 'tb-v2-qr-input--err' : ''}`}
            aria-label="QR code content"
            aria-describedby={error ? 'qr-error' : undefined}
          />
          {error && (
            <p className="tb-v2-qr-error" id="qr-error" role="alert">{error}</p>
          )}
        </div>
        <button
          type="button"
          className="tb-v2-qr-gen-btn"
          onClick={generate}
          disabled={generating}
        >
          {generating ? (
            <span className="tb-v2-qr-spinner" aria-hidden="true" />
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
          Generate
        </button>
      </div>

      {/* Size + Download row */}
      <div className="tb-v2-qr-controls">
        <div className="tb-v2-qr-size-group">
          <span className="tb-v2-qr-label">Size</span>
          <div className="tb-v2-qr-sizes" role="group" aria-label="QR code size">
            {SIZES.map((s) => (
              <button
                key={s.value}
                type="button"
                className={`tb-v2-qr-size-btn ${size === s.value ? 'on' : ''}`}
                onClick={() => setSize(s.value)}
                aria-pressed={size === s.value}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {imageUrl && (
          <div className="tb-v2-qr-dl-group">
            <span className="tb-v2-qr-label">Download</span>
            <div className="tb-v2-qr-dl-btns">
              <button type="button" className="tb-v2-qr-dl-btn" onClick={downloadPng}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                PNG
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Preview */}
      {imageUrl ? (
        <div className="tb-v2-qr-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="Generated QR code" className="tb-v2-qr-img" />
        </div>
      ) : (
        <div className="tb-v2-qr-placeholder">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
          </svg>
          <p>Enter text and click Generate</p>
        </div>
      )}
    </div>
  );
}
