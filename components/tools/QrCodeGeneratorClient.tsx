'use client';

import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

type ContentType = 'url' | 'text' | 'wifi' | 'vcard';
type WifiSecurity = 'WPA' | 'WEP' | 'nopass';

const SIZES = [
  { label: 'S', value: 128 },
  { label: 'M', value: 256 },
  { label: 'L', value: 512 },
  { label: 'XL', value: 1024 },
];

type QrPayloadInput = {
  type: ContentType;
  text: string;
  ssid: string;
  wifiPassword: string;
  wifiSecurity: WifiSecurity;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
};

export function getQrRenderOptions(width: number) {
  return { width, margin: 4 };
}

function escapeWifiPart(part: string) {
  return part.replace(/([\\;,:"'])/g, '\\$1');
}

function escapeVCardText(part: string) {
  return part
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\r|\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

function getVCardNameParts(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return { given: parts[0] || '', family: '' };
  return {
    given: parts.slice(0, -1).join(' '),
    family: parts[parts.length - 1],
  };
}

export function buildQrPayload(input: QrPayloadInput) {
  if (input.type === 'wifi') {
    if (!input.ssid.trim()) return '';
    const password = input.wifiSecurity === 'nopass' ? '' : `P:${escapeWifiPart(input.wifiPassword)};`;
    return `WIFI:T:${input.wifiSecurity};S:${escapeWifiPart(input.ssid)};${password};`;
  }

  if (input.type === 'vcard') {
    const name = input.contactName.trim();
    if (!name) return '';
    const { given, family } = getVCardNameParts(name);
    return [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${escapeVCardText(name)}`,
      `N:${escapeVCardText(family)};${escapeVCardText(given)};;;`,
      input.contactPhone.trim() && `TEL:${escapeVCardText(input.contactPhone.trim())}`,
      input.contactEmail.trim() && `EMAIL:${escapeVCardText(input.contactEmail.trim())}`,
      'END:VCARD',
    ].filter(Boolean).join('\r\n');
  }

  return input.text.trim();
}

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
  const generationId = useRef(0);

  function currentPayload(overrides: Partial<QrPayloadInput> = {}) {
    return buildQrPayload({
      type: contentType,
      text,
      ssid,
      wifiPassword,
      wifiSecurity,
      contactName,
      contactPhone,
      contactEmail,
      ...overrides,
    });
  }

  function invalidateResult(options: { clearError?: boolean } = {}) {
    generationId.current++;
    setImageUrl('');
    setSvgUrl('');
    setLoading(false);
    if (options.clearError) setError('');
  }

  async function generate(overrides: Partial<QrPayloadInput> = {}, outputSize = size) {
    const id = ++generationId.current;
    const type = overrides.type ?? contentType;
    const payload = currentPayload(overrides);
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
      const options = getQrRenderOptions(outputSize);
      const [png, svg] = await Promise.all([
        QRCode.toDataURL(payload, options),
        QRCode.toString(payload, { ...options, type: 'svg' }),
      ]);
      if (id !== generationId.current) return;
      setImageUrl(png);
      setSvgUrl(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);
    } catch {
      if (id !== generationId.current) return;
      setError('Could not generate QR code. Please try again.');
    } finally {
      if (id === generationId.current) setLoading(false);
    }
  }

  // Auto-generate on mount
  useEffect(() => { generate(); }, []);
  useEffect(() => () => { generationId.current++; }, []);

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
    void generate({ type: 'url', text: example }, size);
  }

  function clear() {
    generationId.current++;
    setContentType('url');
    setText('');
    setSize(256);
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

  function handleContentTypeChange(type: ContentType) {
    setContentType(type);
    invalidateResult({ clearError: true });
  }

  function handleFieldChange(setter: (value: string) => void, value: string) {
    setter(value);
    invalidateResult({ clearError: true });
  }

  function handleWifiSecurityChange(value: WifiSecurity) {
    setWifiSecurity(value);
    invalidateResult({ clearError: true });
  }

  function handleSizeChange(nextSize: number) {
    setSize(nextSize);
    const payload = currentPayload();
    if (payload) {
      void generate({}, nextSize);
    } else {
      invalidateResult({ clearError: false });
    }
  }

  const canClear = !!text || !!ssid || !!wifiPassword || !!contactName || !!contactPhone || !!contactEmail || !!imageUrl || !!svgUrl || !!error || loading || size !== 256 || contentType !== 'url';

  return (
    <div className="tb-v2-qr-root tb-qr-tool">
          <div className="tb-v2-tool-input-head">
            <span className="tb-v2-tool-label">QR code content</span>
            <ToolExampleClearActions onExample={loadExample} onClear={clear} canClear={canClear} />
          </div>
      <div className="tb-image-tool-body">
        <div className="tb-qr-input-section">
          <div className="tb-v2-mode-tabs" role="group" aria-label="QR code content type">
            {(['url', 'text', 'wifi', 'vcard'] as ContentType[]).map((type) => (
              <button
                key={type}
                type="button"
                aria-pressed={contentType === type}
                onClick={() => handleContentTypeChange(type)}
                className={`tb-v2-mode-tab ${contentType === type ? 'on' : ''}`}
              >
                {type === 'vcard' ? 'Contact' : type === 'wifi' ? 'Wi-Fi' : type.toUpperCase()}
              </button>
            ))}
          </div>
          {contentType === 'wifi' ? (
            <div className="tb-image-fields">
              <input className="tb-v2-input" value={ssid} onChange={(e) => handleFieldChange(setSsid, e.target.value)} placeholder="Network name (SSID)" aria-label="Wi-Fi network name" />
              <input className="tb-v2-input" type="password" value={wifiPassword} onChange={(e) => handleFieldChange(setWifiPassword, e.target.value)} placeholder="Password" aria-label="Wi-Fi password" disabled={wifiSecurity === 'nopass'} />
              <select className="tb-v2-input" value={wifiSecurity} onChange={(e) => handleWifiSecurityChange(e.target.value as WifiSecurity)} aria-label="Wi-Fi security">
                <option value="WPA">WPA/WPA2</option><option value="WEP">WEP</option><option value="nopass">Open network</option>
              </select>
            </div>
          ) : contentType === 'vcard' ? (
            <div className="tb-image-fields">
              <input className="tb-v2-input" value={contactName} onChange={(e) => handleFieldChange(setContactName, e.target.value)} placeholder="Full name" aria-label="Contact name" />
              <input className="tb-v2-input" value={contactPhone} onChange={(e) => handleFieldChange(setContactPhone, e.target.value)} placeholder="Phone (optional)" aria-label="Contact phone" />
              <input className="tb-v2-input" type="email" value={contactEmail} onChange={(e) => handleFieldChange(setContactEmail, e.target.value)} placeholder="Email (optional)" aria-label="Contact email" />
            </div>
          ) : (
            <input
              type="text"
              value={text}
              onChange={e => handleFieldChange(setText, e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generate()}
              placeholder={contentType === 'url' ? 'Enter a URL' : 'Enter text to encode'}
              className={`tb-v2-input ${error ? 'tb-v2-qr-input--err' : ''}`}
              aria-label="QR code content"
            />
          )}
          {error && <p className="tb-v2-qr-error" role="alert">{error}</p>}
        <button type="button" className="tb-v2-btn tb-v2-btn-primary tb-qr-generate" disabled={loading} onClick={() => void generate()}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          {loading ? 'Generating…' : 'Generate'}
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
                className={`tb-v2-mode-tab ${size === s.value ? 'on' : ''}`}
                onClick={() => handleSizeChange(s.value)}
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
              <button type="button" className="tb-v2-btn tb-v2-btn-sm" onClick={download}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                PNG
              </button>
              <button type="button" className="tb-v2-btn tb-v2-btn-sm" onClick={downloadSvg}>
                SVG
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="tb-qr-output" aria-live="polite">
      <span className="tb-v2-tool-label">QR preview</span>
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
          <p>Choose a content type, enter the details, and click Generate.</p>
        </div>
      )}
      </div>
      </div>
    </div>
  );
}
