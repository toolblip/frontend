'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

type ContentType = 'url' | 'text' | 'wifi' | 'vcard';

const SIZES = [
  { label: 'S', value: 128 },
  { label: 'M', value: 256 },
  { label: 'L', value: 512 },
  { label: 'XL', value: 1024 },
];

export default function QrCodeGeneratorClient() {
  const [text, setText] = useState('https://toolblip.com');
  const [size, setSize] = useState(256);
  const [contentType, setContentType] = useState<ContentType>('url');
  const [ssid, setSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiSecurity, setWifiSecurity] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [svgUrl, setSvgUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function makePayload(value: string, type: ContentType) {
    const escapeWifi = (part: string) => part.replace(/([\\;,:"'])/g, '\\$1');
    if (type === 'wifi') {
      if (!ssid.trim()) return '';
      const password = wifiSecurity === 'nopass' ? '' : `P:${escapeWifi(wifiPassword)};`;
      return `WIFI:T:${wifiSecurity};S:${escapeWifi(ssid)};${password};`;
    }
    if (type === 'vcard') {
      const name = contactName.trim();
      if (!name) return '';
      return [
        'BEGIN:VCARD', 'VERSION:3.0', `FN:${name}`, `N:${name}`,
        contactPhone.trim() && `TEL:${contactPhone.trim()}`,
        contactEmail.trim() && `EMAIL:${contactEmail.trim()}`,
        'END:VCARD',
      ].filter(Boolean).join('\n');
    }
    return value.trim();
  }

  async function generate(value = text, outputSize = size, type = contentType) {
    const payload = makePayload(value, type);
    if (!payload) {
      setError(type === 'wifi' ? 'Enter a Wi-Fi network name.' : type === 'vcard' ? 'Enter a contact name.' : 'Please enter a URL or text to encode.');
      setImageUrl('');
      setSvgUrl('');
      setLoading(false);
      return;
    }
    setError('');
    setLoading(true);
    setImageUrl('');
    setSvgUrl('');
    try {
      const [png, svg] = await Promise.all([
        QRCode.toDataURL(payload, { width: outputSize, margin: 2 }),
        QRCode.toString(payload, { type: 'svg', width: outputSize, margin: 2 }),
      ]);
      setImageUrl(png);
      setSvgUrl(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);
    } catch {
      setError('Could not generate QR code. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Auto-generate on mount
  useEffect(() => { generate(); }, []);

  function download() {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = 'qr-code.png';
    a.click();
  }

  function downloadSvg() {
    if (!svgUrl) return;
    const a = document.createElement('a');
    a.href = svgUrl;
    a.download = 'qr-code.svg';
    a.click();
  }

  function loadExample() {
    const example = 'https://toolblip.com/tools/images';
    setContentType('url');
    setText(example);
    void generate(example, size, 'url');
  }

  function clear() {
    setContentType('url');
    setText('');
    setSsid('');
    setWifiPassword('');
    setWifiSecurity('WPA');
    setContactName('');
    setContactPhone('');
    setContactEmail('');
    setImageUrl('');
    setSvgUrl('');
    setError('');
    setLoading(false);
  }

  return (
    <div className="tb-v2-qr-root">
      {/* Input row */}
      <div className="tb-v2-qr-input-row">
        <div className="tb-v2-qr-input-wrap">
          <div className="tb-v2-tool-input-head">
            <span className="tb-v2-tool-label">QR code content</span>
            <ToolExampleClearActions onExample={loadExample} onClear={clear} canClear={!!text || !!ssid || !!contactName || !!contactPhone || !!contactEmail || !!imageUrl} />
          </div>
          <div className="tb-v2-mode-tabs" role="group" aria-label="QR code content type">
            {(['url', 'text', 'wifi', 'vcard'] as ContentType[]).map((type) => (
              <button
                key={type}
                type="button"
                aria-pressed={contentType === type}
                onClick={() => { setContentType(type); if (error) setError(''); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${contentType === type ? 'bg-red-600 text-black' : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white'}`}
              >
                {type === 'vcard' ? 'Contact' : type === 'wifi' ? 'Wi-Fi' : type.toUpperCase()}
              </button>
            ))}
          </div>
          {contentType === 'wifi' ? (
            <div className="tb-v2-grid-2">
              <input className="tb-v2-qr-input" value={ssid} onChange={(e) => setSsid(e.target.value)} placeholder="Network name (SSID)" aria-label="Wi-Fi network name" />
              <input className="tb-v2-qr-input" type="password" value={wifiPassword} onChange={(e) => setWifiPassword(e.target.value)} placeholder="Password" aria-label="Wi-Fi password" disabled={wifiSecurity === 'nopass'} />
              <select className="tb-v2-qr-input" value={wifiSecurity} onChange={(e) => setWifiSecurity(e.target.value as typeof wifiSecurity)} aria-label="Wi-Fi security">
                <option value="WPA">WPA/WPA2</option><option value="WEP">WEP</option><option value="nopass">Open network</option>
              </select>
            </div>
          ) : contentType === 'vcard' ? (
            <div className="tb-v2-grid-2">
              <input className="tb-v2-qr-input" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Full name" aria-label="Contact name" />
              <input className="tb-v2-qr-input" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="Phone (optional)" aria-label="Contact phone" />
              <input className="tb-v2-qr-input" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="Email (optional)" aria-label="Contact email" />
            </div>
          ) : (
            <input
              type="text"
              value={text}
              onChange={e => { setText(e.target.value); if (error) setError(''); }}
              onKeyDown={e => e.key === 'Enter' && generate()}
              placeholder={contentType === 'url' ? 'Enter a URL' : 'Enter text to encode'}
              className={`tb-v2-qr-input ${error ? 'tb-v2-qr-input--err' : ''}`}
              aria-label="QR code content"
            />
          )}
          {error && <p className="tb-v2-qr-error" role="alert">{error}</p>}
        </div>
        <button type="button" className="tb-v2-qr-gen-btn" onClick={() => void generate()}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          Generate
        </button>
      </div>

      {/* Size + Download */}
      <div className="tb-v2-qr-controls">
        <div className="tb-v2-qr-size-group">
          <span className="tb-v2-qr-label">Size</span>
          <div className="tb-v2-qr-sizes" role="group" aria-label="QR code size">
            {SIZES.map((s) => (
              <button
                key={s.value}
                type="button"
                className={`tb-v2-qr-size-btn ${size === s.value ? 'on' : ''}`}
                onClick={() => { setSize(s.value); if (text.trim()) void generate(text, s.value); }}
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
              <button type="button" className="tb-v2-qr-dl-btn" onClick={download}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                PNG
              </button>
              <button type="button" className="tb-v2-qr-dl-btn" onClick={downloadSvg}>
                SVG
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Preview */}
      {loading ? (
        <div className="tb-v2-qr-placeholder">
          <div className="tb-v2-qr-spinner" aria-hidden="true" />
          <p>Generating…</p>
        </div>
      ) : imageUrl ? (
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
