'use client';

import { useState } from 'react';

export default function HslToRgbClient() {
  const [h, setH] = useState('');
  const [s, setS] = useState('');
  const [l, setL] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const convert = () => {
    const hue = parseFloat(h);
    const sat = parseFloat(s);
    const light = parseFloat(l);
    if (isNaN(hue) || isNaN(sat) || isNaN(light)) { setOutput('Invalid input'); return; }

    const sNorm = sat / 100;
    const lNorm = light / 100;
    const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
    const x = c * (1 - Math.abs((hue / 60) % 2 - 1));
    const m = lNorm - c / 2;

    let r = 0, g = 0, b = 0;
    if (hue < 60)       { r = c; g = x; b = 0; }
    else if (hue < 120) { r = x; g = c; b = 0; }
    else if (hue < 180) { r = 0; g = c; b = x; }
    else if (hue < 240) { r = 0; g = x; b = c; }
    else if (hue < 300) { r = x; g = 0; b = c; }
    else                { r = c; g = 0; b = x; }

    const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
    const rgb = `${Math.round((r + m) * 255)}, ${Math.round((g + m) * 255)}, ${Math.round((b + m) * 255)}`;
    const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
    setOutput(`RGB: ${rgb}\nHEX: ${hex}`);
  };

  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Hue (0-360)</label>
          <input value={h} onChange={e => setH(e.target.value)} type="number" min="0" max="360" placeholder="0"
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-2.5 text-sm font-mono focus:ring-2 focus:ring-red-500 outline-none" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Saturation (%)</label>
          <input value={s} onChange={e => setS(e.target.value)} type="number" min="0" max="100" placeholder="0"
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-2.5 text-sm font-mono focus:ring-2 focus:ring-red-500 outline-none" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Lightness (%)</label>
          <input value={l} onChange={e => setL(e.target.value)} type="number" min="0" max="100" placeholder="0"
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-2.5 text-sm font-mono focus:ring-2 focus:ring-red-500 outline-none" />
        </div>
      </div>
      <button onClick={convert} className="w-full bg-red-600 hover:bg-red-500 text-white font-medium py-2.5 rounded-lg transition-colors text-sm">
        Convert to RGB / HEX
      </button>
      {output && (
        <div className="relative">
          <pre className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-3 text-sm font-mono whitespace-pre-wrap break-all">{output}</pre>
          <button onClick={copy} className="absolute top-2 right-2 px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors">
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  );
}
