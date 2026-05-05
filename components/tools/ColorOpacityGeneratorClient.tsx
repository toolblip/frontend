'use client';

import React, { useState } from 'react';

function hexToRgb(hex: string): {r:number;g:number;b:number}|null {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? {r:parseInt(r[1],16),g:parseInt(r[2],16),b:parseInt(r[3],16)} : null;
}

function rgbToHex(r:number,g:number,b:number):string {
  return '#'+[r,g,b].map(x=>Math.max(0,Math.min(255,Math.round(x))).toString(16).padStart(2,'0')).join('');
}

export default function ColorOpacityGeneratorClient() {
  const [color, setColor] = useState('#6366f1');
  const [opacity, setOpacity] = useState(50);
  const rgb = hexToRgb(color);

  const r = rgb ? rgb.r : 0;
  const g = rgb ? rgb.g : 0;
  const b = rgb ? rgb.b : 0;
  const bgRgb = rgbToHex(
    Math.round(255 - (255 - r) * opacity / 100),
    Math.round(255 - (255 - g) * opacity / 100),
    Math.round(255 - (255 - b) * opacity / 100)
  );

  const hex8 = color.replace('#', '') + Math.round(opacity * 255 / 100).toString(16).padStart(2, '0');
  const rgba = rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(opacity/100).toFixed(2)})` : '—';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Base Color</label>
          <div className="flex gap-2">
            <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-14 h-12 rounded cursor-pointer" />
            <input type="text" value={color} onChange={e => setColor(e.target.value)} className="flex-1 px-3 py-2 border rounded font-mono text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Opacity — {opacity}%</label>
          <input type="range" min="0" max="100" value={opacity} onChange={e => setOpacity(Number(e.target.value))} className="w-full" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg overflow-hidden border border-gray-200">
          <div className="h-32 checkerboard" style={{backgroundColor: color}} />
          <div className="bg-gray-50 p-3 text-xs font-medium">Solid {color.toUpperCase()}</div>
        </div>
        <div className="rounded-lg overflow-hidden border border-gray-200">
          <div className="h-32 checkerboard" style={{backgroundColor: `rgba(${rgb?.r ?? 0}, ${rgb?.g ?? 0}, ${rgb?.b ?? 0}, ${opacity/100})`}} />
          <div className="bg-gray-50 p-3 text-xs font-medium">Opacity {opacity}%</div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm font-mono">
        <div className="flex items-center justify-between"><span className="text-gray-500">RGBA:</span><span>{rgba}</span></div>
        <div className="flex items-center justify-between"><span className="text-gray-500">HEX 8-digit:</span><span>#{hex8.toUpperCase()}</span></div>
        <div className="flex items-center justify-between"><span className="text-gray-500">CSS opacity:</span><span>{(opacity/100).toFixed(2)}</span></div>
      </div>

      <style jsx>{`
        .checkerboard {
          background-image:
            linear-gradient(45deg, #ccc 25%, transparent 25%),
            linear-gradient(-45deg, #ccc 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #ccc 75%),
            linear-gradient(-45deg, transparent 75%, #ccc 75%);
          background-size: 16px 16px;
          background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
        }
      `}</style>
    </div>
  );
}
