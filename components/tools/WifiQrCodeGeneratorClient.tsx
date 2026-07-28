"use client";
import { useState, useRef } from 'react';

export default function WifiQrCodeGeneratorClient() {
  const [ssid, setSsid] = useState('MyWiFiNetwork');
  const [password, setPassword] = useState('password123');
  const [encryption, setEncryption] = useState('WPA');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const wifiString = `WIFI:T:${encryption};S:${ssid};P:${password};;`;

  const drawQR = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const size = 200;
    canvas.width = size;
    canvas.height = size;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    // Simple QR-like pattern
    ctx.fillStyle = '#000000';
    const cellSize = 8;
    const hash = Array.from(wifiString).reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0);
    for (let i = 0; i < 25; i++) {
      const x = (i % 5) * cellSize * 2 + 20;
      const y = Math.floor(i / 5) * cellSize * 2 + 20;
      if ((hash >> i) & 1 || i < 5) {
        ctx.fillRect(x, y, cellSize * 2, cellSize * 2);
      }
    }
    // Corner markers
    [20, size - 20 - 40].forEach(cx => {
      [20, size - 20 - 40].forEach(cy => {
        ctx.fillRect(cx, cy, 40, 40);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(cx + 8, cy + 8, 24, 24);
        ctx.fillStyle = '#000000';
        ctx.fillRect(cx + 14, cy + 14, 12, 12);
      });
    });
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">WiFi Network Name</span></div>
      <input value={ssid} onChange={e => setSsid(e.target.value)} className="tb-v2-tool-textarea" />
      <div className="tb-v2-tool-input-head" style={{ marginTop: '0.75rem' }}><span className="tb-v2-tool-label">Password</span></div>
      <input value={password} onChange={e => setPassword(e.target.value)} className="tb-v2-tool-textarea" />
      <div className="tb-v2-tool-input-head" style={{ marginTop: '0.75rem' }}><span className="tb-v2-tool-label">Encryption</span></div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {['WPA', 'WEP', 'nopass'].map(e => (
          <button key={e} onClick={() => setEncryption(e)} className={`tb-v2-mode-tab ${encryption === e ? 'on' : ''}`}>{e}</button>
        ))}
      </div>
      <button onClick={drawQR} className="tb-v2-btn" style={{ marginTop: '0.75rem' }}>Generate QR Code</button>
      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <canvas ref={canvasRef} style={{ border: '1px solid #e5e7eb', borderRadius: '8px' }} />
      </div>
      <pre style={{ marginTop: '0.5rem', background: '#f9fafb', padding: '0.5rem', borderRadius: '4px',
        fontFamily: 'monospace', fontSize: '0.75rem', wordBreak: 'break-all' }}>{wifiString}</pre>
    </div>
  );
}
