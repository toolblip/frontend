'use client';

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from 'react';
import { Image as ImageIcon, LetterText, Smile, Upload } from 'lucide-react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';
import {
  FAVICON_TEXT_MAX_GRAPHEMES,
  LOGO_FILE_ACCEPT,
  LOGO_FILE_TYPES,
  buildFaviconTextSvg,
  clampIcoExportSize,
  fitFaviconTextFontSize,
  getFaviconCanvasFont,
  getContainFit,
  normalizeFaviconText,
  parseFaviconSizeDraft,
} from '@/lib/favicon-generator';

type Mode = 'emoji' | 'text' | 'logo';
type ExportFormat = 'png' | 'ico' | 'svg';

type LogoState = {
  fileName: string;
  url: string;
  image: HTMLImageElement;
  width: number;
  height: number;
};

const MODES: Array<{ id: Mode; label: string; icon: typeof Smile }> = [
  { id: 'emoji', label: 'Emoji', icon: Smile },
  { id: 'text', label: 'Text', icon: LetterText },
  { id: 'logo', label: 'Upload logo', icon: ImageIcon },
];

const EMOJI_CHOICES = ['🚀', '✨', '⚡', '🔥', '💎', '🎯', '🌱', '🧠', '🛠️', '📊', '🔐', '🌊'];
const SIZE_PRESETS = [16, 32, 48, 64, 128, 180, 256, 512];
const DEFAULTS = {
  emoji: '🚀',
  text: 'TB',
  bg: '#111827',
  fg: '#ffffff',
  size: '64',
  padding: 14,
};

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function canvasToBlob(canvas: HTMLCanvasElement, type = 'image/png'): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type));
}

async function makeIcoBlob(canvas: HTMLCanvasElement, sourceSize: number): Promise<Blob | null> {
  const icoSize = clampIcoExportSize(sourceSize);
  const icoCanvas = document.createElement('canvas');
  icoCanvas.width = icoSize;
  icoCanvas.height = icoSize;
  icoCanvas.getContext('2d')?.drawImage(canvas, 0, 0, icoSize, icoSize);

  const png = await canvasToBlob(icoCanvas, 'image/png');
  if (!png) return null;

  const imageData = await png.arrayBuffer();
  const icoData = new ArrayBuffer(22 + imageData.byteLength);
  const view = new DataView(icoData);
  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true);
  view.setUint16(4, 1, true);
  view.setUint8(6, icoSize === 256 ? 0 : icoSize);
  view.setUint8(7, icoSize === 256 ? 0 : icoSize);
  view.setUint8(8, 0);
  view.setUint8(9, 0);
  view.setUint16(10, 1, true);
  view.setUint16(12, 32, true);
  view.setUint32(14, imageData.byteLength, true);
  view.setUint32(18, 22, true);
  new Uint8Array(icoData, 22).set(new Uint8Array(imageData));

  return new Blob([icoData], { type: 'image/vnd.microsoft.icon' });
}

function readImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('This image could not be decoded. Try a PNG, JPEG, WebP, or SVG file.'));
    image.src = url;
  });
}

function fileLooksSupported(file: File) {
  if (LOGO_FILE_TYPES.has(file.type)) return true;
  return file.type === '' && /\.(png|jpe?g|webp|svg)$/i.test(file.name);
}

export default function FaviconGeneratorClient() {
  const [mode, setMode] = useState<Mode>('emoji');
  const [emoji, setEmoji] = useState(DEFAULTS.emoji);
  const [text, setText] = useState(DEFAULTS.text);
  const [fg, setFg] = useState(DEFAULTS.fg);
  const [bg, setBg] = useState(DEFAULTS.bg);
  const [transparent, setTransparent] = useState(false);
  const [sizeDraft, setSizeDraft] = useState(DEFAULTS.size);
  const [padding, setPadding] = useState(DEFAULTS.padding);
  const [logo, setLogo] = useState<LogoState | null>(null);
  const [isLogoLoading, setIsLogoLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [drawError, setDrawError] = useState('');
  const [isReady, setIsReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sizeInputRef = useRef<HTMLInputElement>(null);
  const loadTokenRef = useRef(0);
  const logoUrlRef = useRef<string | null>(null);
  const renderedTextFontSizeRef = useRef<number | null>(null);

  const size = parseFaviconSizeDraft(sizeDraft);
  const sizeError = sizeDraft.trim() && size === null ? 'Enter a whole pixel size from 16 to 512.' : '';
  const activeText = mode === 'emoji' ? normalizeFaviconText(emoji, 1) : normalizeFaviconText(text);
  const hasInput = mode === 'logo' ? Boolean(logo) : activeText.length > 0;
  const canExport = Boolean(size && hasInput && isReady && !drawError);
  const icoNote = size ? `ICO downloads at ${clampIcoExportSize(size)}px${size > 256 ? ' because ICO is capped at 256px here' : ''}.` : '';

  const clearLogo = () => {
    loadTokenRef.current += 1;
    if (logoUrlRef.current) URL.revokeObjectURL(logoUrlRef.current);
    logoUrlRef.current = null;
    setLogo(null);
    setIsLogoLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  useEffect(() => {
    return () => {
      loadTokenRef.current += 1;
      if (logoUrlRef.current) URL.revokeObjectURL(logoUrlRef.current);
      logoUrlRef.current = null;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    setIsReady(false);
    setDrawError('');
    renderedTextFontSizeRef.current = null;

    if (!canvas || !ctx || size === null || !hasInput) {
      if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    canvas.width = size;
    canvas.height = size;
    ctx.clearRect(0, 0, size, size);

    if (!transparent) {
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.roundRect(0, 0, size, size, Math.max(3, size * 0.18));
      ctx.fill();
    }

    if (mode === 'logo') {
      if (!logo) return;
      const fit = getContainFit({
        sourceWidth: logo.width,
        sourceHeight: logo.height,
        targetSize: size,
        paddingPercent: padding,
      });
      if (!fit) {
        setDrawError('The logo dimensions or padding leave no drawable area.');
        return;
      }
      ctx.drawImage(logo.image, fit.x, fit.y, fit.width, fit.height);
      setIsReady(true);
      return;
    }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = fg;

    const textMode = mode === 'emoji' ? 'emoji' : 'text';
    const fontSize = fitFaviconTextFontSize({
      mode: textMode,
      text: activeText,
      size,
      padding,
      measureText: (font, value) => {
        ctx.font = font;
        return ctx.measureText(value).width;
      },
    });
    ctx.font = getFaviconCanvasFont(textMode, fontSize);
    renderedTextFontSizeRef.current = fontSize;

    ctx.fillText(activeText, size / 2, size / 2 + size * 0.035);
    setIsReady(true);
  }, [activeText, bg, fg, hasInput, logo, mode, padding, size, transparent]);

  const handleFile = async (file: File | undefined) => {
    setUploadError('');
    setDrawError('');
    setIsReady(false);
    clearLogo();
    if (!file) return;

    if (!fileLooksSupported(file)) {
      setUploadError('Choose a PNG, JPEG, WebP, or SVG logo file.');
      return;
    }

    const token = loadTokenRef.current + 1;
    loadTokenRef.current = token;
    const url = URL.createObjectURL(file);
    setIsLogoLoading(true);

    try {
      const image = await readImage(url);
      if (loadTokenRef.current !== token) {
        URL.revokeObjectURL(url);
        return;
      }
      if (!image.naturalWidth || !image.naturalHeight) {
        throw new Error('This image decoded without usable dimensions.');
      }
      logoUrlRef.current = url;
      setLogo({
        fileName: file.name,
        url,
        image,
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
      setIsLogoLoading(false);
    } catch (error) {
      URL.revokeObjectURL(url);
      if (loadTokenRef.current === token) {
        setUploadError(error instanceof Error ? error.message : 'This image could not be decoded.');
        setIsLogoLoading(false);
      }
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    void handleFile(event.target.files?.[0]);
    event.target.value = '';
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setMode('logo');
    void handleFile(event.dataTransfer.files?.[0]);
  };

  const loadExample = () => {
    setUploadError('');
    setDrawError('');
    if (mode === 'emoji') {
      setEmoji('✨');
      setBg('#172554');
      setFg('#ffffff');
      setTransparent(false);
      setPadding(12);
      setSizeDraft('64');
      return;
    }
    if (mode === 'text') {
      setText('AP');
      setBg('#0f766e');
      setFg('#f8fafc');
      setTransparent(false);
      setPadding(16);
      setSizeDraft('128');
      return;
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120"><rect width="160" height="120" rx="24" fill="#0f172a"/><path d="M35 84 66 28l23 38 14-22 22 40H35Z" fill="#38bdf8"/><circle cx="114" cy="34" r="13" fill="#facc15"/></svg>`;
    const file = new File([svg], 'toolblip-sample-logo.svg', { type: 'image/svg+xml' });
    setMode('logo');
    setBg('#ffffff');
    setTransparent(false);
    setPadding(18);
    setSizeDraft('128');
    void handleFile(file);
  };

  const clear = () => {
    setEmoji('');
    setText('');
    setFg(DEFAULTS.fg);
    setBg(DEFAULTS.bg);
    setTransparent(false);
    setSizeDraft(DEFAULTS.size);
    setPadding(DEFAULTS.padding);
    setUploadError('');
    setDrawError('');
    setIsReady(false);
    setIsLogoLoading(false);
    clearLogo();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const download = async (format: ExportFormat) => {
    if (!canExport || !size || !canvasRef.current) return;
    const canvas = canvasRef.current;

    if (format === 'png') {
      const blob = await canvasToBlob(canvas, 'image/png');
      if (blob) downloadBlob(blob, `favicon-${size}.png`);
      return;
    }

    if (format === 'ico') {
      const blob = await makeIcoBlob(canvas, size);
      if (blob) downloadBlob(blob, 'favicon.ico');
      return;
    }

    if (mode === 'logo') {
      const dataUrl = canvas.toDataURL('image/png');
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img"><desc>Bitmap SVG export: the uploaded logo favicon is embedded as a rendered PNG for faithful output.</desc><image href="${dataUrl}" width="${size}" height="${size}"/></svg>`;
      downloadBlob(new Blob([svg], { type: 'image/svg+xml' }), 'favicon-bitmap.svg');
      return;
    }

    const textMode = mode === 'emoji' ? 'emoji' : 'text';
    const svg = buildFaviconTextSvg({
      mode: textMode,
      text: activeText,
      size,
      padding,
      background: bg,
      foreground: fg,
      transparent,
      fontSize: renderedTextFontSizeRef.current ?? fitFaviconTextFontSize({
        mode: textMode,
        text: activeText,
        size,
        padding,
        measureText: () => 0,
      }),
    });
    downloadBlob(new Blob([svg], { type: 'image/svg+xml' }), 'favicon.svg');
  };

  return (
    <div className="tb-v2-section" style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 20 }}>
      <div className="tb-v2-tool-input-head">
        <div>
          <span className="tb-v2-tool-label">Favicon source</span>
          <p className="text-sm text-gray-600 dark:text-gray-400" style={{ marginTop: 4 }}>
            Choose one source, preview one size, then export PNG, ICO, or SVG.
          </p>
        </div>
        <ToolExampleClearActions
          onExample={loadExample}
          onClear={clear}
          canClear={hasInput || isLogoLoading || Boolean(uploadError) || Boolean(drawError)}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="space-y-5">
          <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-900" role="group" aria-label="Favicon input mode">
            {MODES.map(({ id, label, icon: Icon }) => {
              const active = mode === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setMode(id);
                    setUploadError('');
                    setDrawError('');
                  }}
                  className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    active
                      ? 'bg-white text-gray-950 shadow-sm dark:bg-gray-800 dark:text-white'
                      : 'text-gray-600 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white'
                  }`}
                >
                  <Icon aria-hidden="true" size={16} />
                  {label}
                </button>
              );
            })}
          </div>

          {mode === 'emoji' && (
            <div className="space-y-3">
              <label htmlFor="favicon-emoji" className="tb-v2-tool-label">Emoji</label>
              <input
                id="favicon-emoji"
                type="text"
                inputMode="text"
                value={emoji}
                onChange={(event) => setEmoji(normalizeFaviconText(event.target.value, 1))}
                className="tb-v2-input text-2xl"
                aria-describedby="favicon-emoji-help"
                placeholder="🚀"
              />
              <p id="favicon-emoji-help" className="text-sm text-gray-600 dark:text-gray-400">Pick one, or type/paste any emoji including joined emoji sequences.</p>
              <div className="grid grid-cols-6 gap-2 sm:grid-cols-12" aria-label="Emoji choices">
                {EMOJI_CHOICES.map((choice) => (
                  <button
                    key={choice}
                    type="button"
                    aria-label={`Use ${choice} emoji`}
                    onClick={() => setEmoji(choice)}
                    className="rounded-md border border-gray-200 bg-white p-2 text-xl transition-colors hover:border-red-300 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
                  >
                    {choice}
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === 'text' && (
            <div className="space-y-3">
              <label htmlFor="favicon-text" className="tb-v2-tool-label">Short text</label>
              <input
                id="favicon-text"
                type="text"
                value={text}
                onChange={(event) => setText(normalizeFaviconText(event.target.value, FAVICON_TEXT_MAX_GRAPHEMES))}
                className="tb-v2-input text-2xl font-semibold"
                aria-describedby="favicon-text-help"
                placeholder="TB"
              />
              <p id="favicon-text-help" className="text-sm text-gray-600 dark:text-gray-400">Up to four visible characters. The preview shrinks the type to fit the icon.</p>
            </div>
          )}

          {mode === 'logo' && (
            <div className="space-y-3">
              <span className="tb-v2-tool-label">Logo file</span>
              <label
                onDragOver={(event) => event.preventDefault()}
                onDrop={handleDrop}
                className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center transition-colors hover:border-red-300 hover:bg-red-50/60 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={LOGO_FILE_ACCEPT}
                  onClick={(event) => {
                    event.currentTarget.value = '';
                  }}
                  onChange={handleFileChange}
                  className="sr-only"
                  aria-describedby="favicon-logo-help"
                />
                <Upload aria-hidden="true" size={24} />
                <span className="font-medium text-gray-900 dark:text-gray-100">{isLogoLoading ? 'Loading logo...' : logo ? logo.fileName : 'Drop a logo or choose a file'}</span>
                <span id="favicon-logo-help" className="text-sm text-gray-600 dark:text-gray-400">PNG, JPEG, WebP, or SVG. The logo is contained inside the square with padding.</span>
              </label>
            </div>
          )}

          {mode === 'logo' && isLogoLoading && (
            <div className="tb-v2-banner" role="status">
              Loading logo...
            </div>
          )}

          {(uploadError || drawError || sizeError || (!hasInput && !(mode === 'logo' && isLogoLoading))) && (
            <div className="tb-v2-banner tb-v2-banner-err" role="alert">
              {uploadError || drawError || sizeError || `Add ${mode === 'logo' ? 'a logo file' : mode === 'emoji' ? 'an emoji' : 'short text'} to enable downloads.`}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="favicon-size" className="tb-v2-tool-label">Export size</label>
              <select
                id="favicon-size"
                value={SIZE_PRESETS.includes(Number(sizeDraft)) ? sizeDraft : 'custom'}
                onChange={(event) => {
                  if (event.target.value !== 'custom') {
                    setSizeDraft(event.target.value);
                    return;
                  }
                  sizeInputRef.current?.focus();
                  sizeInputRef.current?.select();
                }}
                className="tb-v2-input"
                aria-label="Choose a standard favicon size"
              >
                {SIZE_PRESETS.map((preset) => (
                  <option key={preset} value={preset}>{preset}px</option>
                ))}
                <option value="custom">Custom</option>
              </select>
            </div>
            <div>
              <label htmlFor="favicon-size-custom" className="tb-v2-tool-label">Custom size</label>
              <input
                ref={sizeInputRef}
                id="favicon-size-custom"
                type="number"
                value={sizeDraft}
                onChange={(event) => setSizeDraft(event.target.value)}
                min={16}
                max={512}
                step={1}
                aria-invalid={Boolean(sizeError)}
                aria-describedby={sizeError ? 'favicon-size-error' : 'favicon-export-note'}
                className="tb-v2-input"
              />
              {sizeError && <p id="favicon-size-error" className="tb-v2-error" role="alert" style={{ marginTop: 8 }}>{sizeError}</p>}
            </div>
            <div>
              <label htmlFor="favicon-bg" className="tb-v2-tool-label">Background</label>
              <input
                id="favicon-bg"
                type="color"
                value={bg}
                disabled={transparent}
                onChange={(event) => setBg(event.target.value)}
                className="h-11 w-full cursor-pointer rounded-md border border-gray-300 bg-white p-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900"
              />
            </div>
            {mode !== 'logo' && (
              <div>
                <label htmlFor="favicon-fg" className="tb-v2-tool-label">Text color</label>
                <input
                  id="favicon-fg"
                  type="color"
                  value={fg}
                  onChange={(event) => setFg(event.target.value)}
                  className="h-11 w-full cursor-pointer rounded-md border border-gray-300 bg-white p-1 dark:border-gray-700 dark:bg-gray-900"
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3 text-sm font-medium text-gray-800 dark:text-gray-200">
              <input
                type="checkbox"
                checked={transparent}
                onChange={(event) => setTransparent(event.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              Transparent background
            </label>
            <div>
              <label htmlFor="favicon-padding" className="tb-v2-tool-label">Padding: {padding}%</label>
              <input
                id="favicon-padding"
                type="range"
                min={0}
                max={36}
                value={padding}
                onChange={(event) => setPadding(Number(event.target.value))}
                className="w-full accent-red-600"
              />
            </div>
            <p id="favicon-export-note" className="text-sm text-gray-600 dark:text-gray-400">
              PNG and SVG use {size ?? 'a valid'}px. {icoNote || 'ICO downloads are capped at 256px.'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="mx-auto flex aspect-square w-full max-w-[228px] items-center justify-center rounded-lg border border-gray-200 bg-[linear-gradient(45deg,#f3f4f6_25%,transparent_25%),linear-gradient(-45deg,#f3f4f6_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f3f4f6_75%),linear-gradient(-45deg,transparent_75%,#f3f4f6_75%)] bg-[length:18px_18px] bg-[position:0_0,0_9px,9px_-9px,-9px_0] p-6 dark:border-gray-700 dark:bg-gray-900">
            <canvas
              ref={canvasRef}
              aria-label="Live favicon preview"
              className="block h-auto w-full max-w-[180px] rounded-md shadow-sm [image-rendering:auto]"
              style={{ aspectRatio: '1 / 1' }}
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(['png', 'ico', 'svg'] as const).map((format) => (
              <button
                key={format}
                type="button"
                disabled={!canExport}
                onClick={() => void download(format)}
                className="tb-v2-btn tb-v2-btn-secondary justify-center disabled:cursor-not-allowed disabled:opacity-50"
              >
                {format.toUpperCase()}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {mode === 'logo'
              ? 'Logo SVG export embeds the rendered PNG inside an SVG wrapper.'
              : 'Emoji and text SVG exports keep the typed content escaped in SVG text.'}
          </p>
        </div>
      </div>
    </div>
  );
}
