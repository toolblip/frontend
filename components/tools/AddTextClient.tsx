'use client';

import { useState, useRef, useEffect } from 'react';

const EXAMPLES = ['Hello World', 'Toolblip', 'Subscribe Now', 'Sale 50% Off'];

export default function AddTextClient() {
  const [text, setText] = useState('Sample Text');
  const [fontSize, setFontSize] = useState(48);
  const [fontColor, setFontColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#000000');
  const [position, setPosition] = useState<'top' | 'center' | 'bottom'>('center');
  const [opacity, setOpacity] = useState(100);
  const [copied, setCopied] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const yPos = position === 'top' ? 60 : position === 'center' ? canvas.height / 2 : canvas.height - 40;
    ctx.globalAlpha = opacity / 100;
    ctx.fillStyle = fontColor;
    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = position === 'top' ? 'top' : position === 'center' ? 'middle' : 'bottom';
    ctx.fillText(text, canvas.width / 2, yPos);
    ctx.globalAlpha = 1;
  }, [text, fontSize, fontColor, bgColor, position, opacity]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'text-image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const copy = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob(blob => {
      if (blob) {
        navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    });
  };

  const loadExample = (ex: string) => {
    setText(ex);
    setShowExamples(false);
  };

  return (
    <div>
      {/* Text input */}
      <div>
        <div className="tb-v2-tool-input-head">
          <span className="tb-v2-tool-label">Text</span>
          <button
            type="button"
            onClick={() => setShowExamples(!showExamples)}
            className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm"
          >
            📋 Examples
          </button>
        </div>

        {showExamples && (
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-3 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map(ex => (
                <button
                  key={ex}
                  onClick={() => loadExample(ex)}
                  className="px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text..."
          className="tb-v2-tool-textarea"
          style={{ minHeight: 48 }}
        />
      </div>

      {/* Settings */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="tb-v2-tool-label">Font Size: {fontSize}px</label>
          <input type="range" min={12} max={120} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full" />
        </div>
        <div>
          <label className="tb-v2-tool-label">Position</label>
          <div className="flex gap-2">
            {(['top', 'center', 'bottom'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPosition(p)}
                className={`flex-1 p-2 rounded-lg text-sm capitalize transition-colors ${
                  position === p
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="tb-v2-tool-label">Text Color</label>
          <div className="flex gap-2">
            <input type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)} className="w-12 h-10 rounded-lg cursor-pointer" />
            <input type="text" value={fontColor} onChange={(e) => setFontColor(e.target.value)} className="flex-1 tb-v2-input font-mono text-sm" />
          </div>
        </div>
        <div>
          <label className="tb-v2-tool-label">Background</label>
          <div className="flex gap-2">
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-12 h-10 rounded-lg cursor-pointer" />
            <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="flex-1 tb-v2-input font-mono text-sm" />
          </div>
        </div>
      </div>

      <div>
        <label className="tb-v2-tool-label">Opacity: {opacity}%</label>
        <input type="range" min={10} max={100} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full" />
      </div>

      {/* Preview */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <canvas ref={canvasRef} width={800} height={400} className="w-full h-auto" />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button onClick={copy} className="tb-v2-btn tb-v2-btn-ghost flex-1">
          {copied ? '✅ Copied!' : '📋 Copy Image'}
        </button>
        <button onClick={download} className="tb-v2-btn tb-v2-btn-primary flex-1">
          ⬇️ Download PNG
        </button>
      </div>
    </div>
  );
}
