'use client';

import { useState, useRef, useEffect } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

export default function FaviconGeneratorClient() {
  const [emoji, setEmoji] = useState('🔧');
  const [fg, setFg] = useState('#ffffff');
  const [bg, setBg] = useState('#DC2626');
  const [size, setSize] = useState(32);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloadReady, setDownloadReady] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [cleared, setCleared] = useState(false);

  // Generate on mount and whenever parameters change
  useEffect(() => {
    if (cleared) return;
    generate();
  }, [emoji, fg, bg, size, cleared]);

  const generate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    ctx.fillStyle = bg;
    ctx.beginPath();
    const r = size * 0.18;
    ctx.roundRect(0, 0, size, size, r);
    ctx.fill();

    ctx.fillStyle = fg;
    ctx.font = `${size * 0.55}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, size / 2, size / 2 + size * 0.02);

    setDownloadReady(true);
    setHasGenerated(true);
  };

  const download = async (format: 'png' | 'ico' | 'svg') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (format === 'svg') {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" rx="${size * 0.18}" fill="${bg}"/><text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" font-size="${size * 0.55}" fill="${fg}">${emoji}</text></svg>`;
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `favicon.svg`; a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'ico') {
      const icoSize = Math.min(size, 256);
      const icoCanvas = document.createElement('canvas');
      icoCanvas.width = icoSize;
      icoCanvas.height = icoSize;
      icoCanvas.getContext('2d')?.drawImage(canvas, 0, 0, icoSize, icoSize);
      const png = await new Promise<Blob | null>((resolve) => icoCanvas.toBlob(resolve, 'image/png'));
      if (!png) return;
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
      const ico = new Blob([icoData], { type: 'image/vnd.microsoft.icon' });
      const url = URL.createObjectURL(ico);
      const a = document.createElement('a');
      a.href = url; a.download = `favicon.ico`; a.click();
      URL.revokeObjectURL(url);
    } else {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url; a.download = `favicon-${size}.png`; a.click();
    }
  };

  const clear = () => {
    setEmoji('');
    setFg('#ffffff');
    setBg('#DC2626');
    setSize(32);
    setDownloadReady(false);
    setHasGenerated(false);
    setCleared(true);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && canvasRef.current) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const loadExample = () => {
    setCleared(false);
    setEmoji('🔧');
    setFg('#ffffff');
    setBg('#DC2626');
    setSize(64);
  };

  return (
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:20,padding:"20px"}}>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Favicon settings</span>
        <ToolExampleClearActions onExample={loadExample} onClear={clear} canClear={!cleared} />
      </div>
      <div className="tb-v2-grid-2">
        <div>
          <label className="tb-v2-tool-label">Emoji</label>
          <input
            type="text"
            value={emoji}
            onChange={(e) => { setCleared(false); setEmoji(e.target.value); }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 text-2xl"
            maxLength={2}
          />
        </div>
        <div>
          <label className="tb-v2-tool-label">Size (px)</label>
          <input
            type="number"
            value={size}
            onChange={(e) => { setCleared(false); setSize(Number(e.target.value)); }}
            min={16} max={512}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="tb-v2-tool-label">Background</label>
          <input
            type="color"
            value={bg}
            onChange={(e) => { setCleared(false); setBg(e.target.value); }}
            className="w-full h-10 rounded cursor-pointer"
          />
        </div>
        <div>
          <label className="tb-v2-tool-label">Foreground</label>
          <input
            type="color"
            value={fg}
            onChange={(e) => { setCleared(false); setFg(e.target.value); }}
            className="w-full h-10 rounded cursor-pointer"
          />
        </div>
      </div>

      <button
        onClick={generate}
        className="tb-v2-btn tb-v2-btn-primary"
      >
        Generate
      </button>

      <div className="flex items-center gap-6">
        <canvas ref={canvasRef} className="rounded-lg" style={{ display: hasGenerated ? 'block' : 'none' }} />
        {downloadReady && (
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => download('png')} className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">PNG</button>
            <button onClick={() => download('ico')} className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">ICO</button>
            <button onClick={() => download('svg')} className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">SVG</button>
          </div>
        )}
      </div>
    </div>
  );
}
