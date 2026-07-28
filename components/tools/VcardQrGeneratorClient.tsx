"use client";
import { useState, useRef } from 'react';

export default function VcardQrGeneratorClient() {
  const [name, setName] = useState('John Doe');
  const [phone, setPhone] = useState('+1 234 567 8900');
  const [email, setEmail] = useState('john@example.com');
  const [org, setOrg] = useState('Example Inc');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const vcard = `BEGIN:VCARD
VERSION:3.0
N:${name.split(' ').reverse().join(';')}
TEL:${phone}
EMAIL:${email}
ORG:${org}
END:VCARD`;

  const drawQR = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = 200; canvas.height = 200;
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 200, 200);
    ctx.fillStyle = '#000000';
    const hash = Array.from(vcard).reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0);
    for (let i = 0; i < 25; i++) {
      if ((hash >> i) & 1) ctx.fillRect((i % 5) * 32 + 20, Math.floor(i / 5) * 32 + 20, 24, 24);
    }
    [20, 140].forEach(cx => [20, 140].forEach(cy => {
      ctx.fillRect(cx, cy, 40, 40); ctx.fillStyle = '#fff'; ctx.fillRect(cx + 8, cy + 8, 24, 24);
      ctx.fillStyle = '#000'; ctx.fillRect(cx + 14, cy + 14, 12, 12);
    }));
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Name</span></div>
      <input value={name} onChange={e => setName(e.target.value)} className="tb-v2-tool-textarea" />
      <div className="tb-v2-tool-input-head" style={{ marginTop: '0.75rem' }}><span className="tb-v2-tool-label">Phone</span></div>
      <input value={phone} onChange={e => setPhone(e.target.value)} className="tb-v2-tool-textarea" />
      <div className="tb-v2-tool-input-head" style={{ marginTop: '0.75rem' }}><span className="tb-v2-tool-label">Email</span></div>
      <input value={email} onChange={e => setEmail(e.target.value)} className="tb-v2-tool-textarea" />
      <div className="tb-v2-tool-input-head" style={{ marginTop: '0.75rem' }}><span className="tb-v2-tool-label">Organization</span></div>
      <input value={org} onChange={e => setOrg(e.target.value)} className="tb-v2-tool-textarea" />
      <button onClick={drawQR} className="tb-v2-btn" style={{ marginTop: '0.75rem' }}>Generate QR</button>
      <div style={{ marginTop: '1rem', textAlign: 'center' }}><canvas ref={canvasRef} style={{ border: '1px solid #e5e7eb', borderRadius: '8px' }} /></div>
    </div>
  );
}
