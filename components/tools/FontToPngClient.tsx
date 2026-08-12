'use client';

import { useRef, useState, useCallback } from 'react';

const DEFAULT_TEXT = 'The quick brown fox';

export default function FontToPngClient() {
  const [fontName, setFontName] = useState('');
  const [fontReady, setFontReady] = useState(false);
  const [fontError, setFontError] = useState('');
  const [loadingFont, setLoadingFont] = useState(false);

  const [text, setText] = useState(DEFAULT_TEXT);
  const [fontSize, setFontSize] = useState(64);
  const [textColor, setTextColor] = useState('#18181b');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [transparentBg, setTransparentBg] = useState(false);

  const [pngUrl, setPngUrl] = useState('');
  const [renderError, setRenderError] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loadedFontRef = useRef<FontFace | null>(null);

  const handleFontUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFontError('');
    setFontReady(false);
    setPngUrl('');
    setLoadingFont(true);

    try {
      const buffer = await file.arrayBuffer();
      const font = new FontFace('TbUploadedFont', buffer);
      await font.load();
      document.fonts.add(font);
      loadedFontRef.current = font;
      setFontName(file.name);
      setFontReady(true);
    } catch {
      setFontError('Could not load this file as a font. Please upload a valid .ttf, .otf, .woff, or .woff2 file.');
      setFontReady(false);
      loadedFontRef.current = null;
    } finally {
      setLoadingFont(false);
    }
  }, []);

  const render = useCallback(() => {
    setRenderError('');
    if (!fontReady) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const sampleText = text || DEFAULT_TEXT;

    try {
      ctx.font = `${fontSize}px TbUploadedFont`;
      const metrics = ctx.measureText(sampleText);
      const padding = Math.max(16, Math.round(fontSize * 0.3));
      const ascent = metrics.actualBoundingBoxAscent ?? fontSize * 0.8;
      const descent = metrics.actualBoundingBoxDescent ?? fontSize * 0.2;
      const textWidth = Math.max(1, Math.ceil(metrics.width));
      const textHeight = Math.max(1, Math.ceil(ascent + descent));

      canvas.width = textWidth + padding * 2;
      canvas.height = textHeight + padding * 2;

      // Re-set font after resizing canvas (canvas resets context state).
      ctx.font = `${fontSize}px TbUploadedFont`;
      ctx.textBaseline = 'alphabetic';

      if (!transparentBg) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      ctx.fillStyle = textColor;
      ctx.fillText(sampleText, padding, padding + ascent);

      setPngUrl(canvas.toDataURL('image/png'));
    } catch {
      setRenderError('Something went wrong while rendering this text. Try a different font size or text.');
      setPngUrl('');
    }
  }, [fontReady, text, fontSize, textColor, bgColor, transparentBg]);

  const download = () => {
    if (!pngUrl) return;
    const a = document.createElement('a');
    a.href = pngUrl;
    a.download = 'font-to-png.png';
    a.click();
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Font to PNG Converter</span>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className="tb-v2-tool-label" htmlFor="tb-font-upload">
            Upload font file
          </label>
          <input
            id="tb-font-upload"
            type="file"
            accept=".ttf,.otf,.woff,.woff2"
            onChange={handleFontUpload}
            className="tb-v2-input mt-1"
          />
          {loadingFont && (
            <p className="text-sm mt-1" style={{ color: '#71717a' }}>Loading font…</p>
          )}
          {fontError && (
            <p className="text-sm mt-1" style={{ color: '#ef4444' }}>{fontError}</p>
          )}
          {fontReady && !fontError && (
            <p className="text-sm mt-1" style={{ color: '#16a34a' }}>Loaded: {fontName}</p>
          )}
        </div>

        <div>
          <label className="tb-v2-tool-label" htmlFor="tb-font-text">
            Sample text
          </label>
          <input
            id="tb-font-text"
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={DEFAULT_TEXT}
            className="tb-v2-input mt-1"
          />
        </div>

        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="tb-v2-tool-label" htmlFor="tb-font-size">
              Font size: {fontSize}px
            </label>
            <input
              id="tb-font-size"
              type="range"
              min={12}
              max={300}
              value={fontSize}
              onChange={e => setFontSize(Number(e.target.value))}
              className="mt-1"
            />
          </div>

          <div>
            <label className="tb-v2-tool-label" htmlFor="tb-text-color">
              Text color
            </label>
            <input
              id="tb-text-color"
              type="color"
              value={textColor}
              onChange={e => setTextColor(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <label className="tb-v2-tool-label" htmlFor="tb-bg-color">
              Background color
            </label>
            <input
              id="tb-bg-color"
              type="color"
              value={bgColor}
              onChange={e => setBgColor(e.target.value)}
              disabled={transparentBg}
              className="mt-1"
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={transparentBg}
              onChange={e => setTransparentBg(e.target.checked)}
            />
            Transparent background
          </label>
        </div>

        <div>
          <button
            type="button"
            onClick={render}
            disabled={!fontReady}
            className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg"
          >
            Generate PNG
          </button>
        </div>

        {!fontReady && !loadingFont && (
          <p className="text-sm" style={{ color: '#71717a' }}>
            Upload a font file above to get started.
          </p>
        )}

        {renderError && (
          <p className="text-sm" style={{ color: '#ef4444' }}>{renderError}</p>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {pngUrl && (
          <div className="tb-v2-tool-output-body">
            <div className="flex justify-between items-center mb-2">
              <span className="tb-v2-tool-label">Preview</span>
              <button onClick={download} className="tb-v2-btn-sm">
                Download PNG
              </button>
            </div>
            <div
              style={{
                background: transparentBg
                  ? 'repeating-conic-gradient(#e5e5e5 0% 25%, transparent 0% 50%) 50% / 16px 16px'
                  : undefined,
                display: 'inline-block',
                padding: 8,
                borderRadius: 8,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pngUrl} alt="Rendered text as PNG" style={{ maxWidth: '100%', display: 'block' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
