'use client';

import { useState, useRef, useEffect } from 'react';

export default function AddTextClient() {
  const [text, setText] = useState('Sample Text');
  const [fontSize, setFontSize] = useState(48);
  const [fontColor, setFontColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#000000');
  const [position, setPosition] = useState<'top' | 'center' | 'bottom'>('center');
  const [opacity, setOpacity] = useState(100);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text
    const yPos = position === 'top' ? 60 : position === 'center' ? canvas.height / 2 : canvas.height - 40;
    
    ctx.globalAlpha = opacity / 100;
    ctx.fillStyle = fontColor;
    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = position === 'top' ? 'top' : position === 'center' ? 'middle' : 'bottom';
    ctx.fillText(text, canvas.width / 2, yPos);
    ctx.globalAlpha = 1;
  }, [text, fontSize, fontColor, bgColor, position, opacity]);

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-3">
        <div>
          <label className="tb-v2-tool-label">Text</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text..."
            className="tb-v2-input"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="tb-v2-tool-label">Font Size: {fontSize}px</label>
            <input
              type="range"
              min="12"
              max="120"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="tb-v2-input w-full"
            />
          </div>
          <div>
            <label className="tb-v2-tool-label">Position</label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value as 'top' | 'center' | 'bottom')}
              className="tb-v2-input"
            >
              <option value="top">Top</option>
              <option value="center">Center</option>
              <option value="bottom">Bottom</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="tb-v2-tool-label">Text Color</label>
            <div className="tb-v2-mode-tabs">
              <input
                type="color"
                value={fontColor}
                onChange={(e) => setFontColor(e.target.value)}
                className="tb-v2-input h-10 w-16"
              />
              <input
                type="text"
                value={fontColor}
                onChange={(e) => setFontColor(e.target.value)}
                className="tb-v2-input flex-1"
              />
            </div>
          </div>
          <div>
            <label className="tb-v2-tool-label">Background Color</label>
            <div className="tb-v2-mode-tabs">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="tb-v2-input h-10 w-16"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="tb-v2-input flex-1"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="tb-v2-tool-label">Opacity: {opacity}%</label>
          <input
            type="range"
            min="10"
            max="100"
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="tb-v2-input w-full"
          />
        </div>
      </div>

      <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full h-auto"
        />
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Preview only. Export functionality coming soon.
      </p>
    </div>
  );
}
