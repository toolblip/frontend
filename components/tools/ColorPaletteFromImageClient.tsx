'use client';

import React, { useState } from 'react';

export default function ColorPaletteFromImageClient() {
  const [url, setUrl] = useState('');
  const [palette, setPalette] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const extract = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const img = new window.Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });

      const c = document.createElement('canvas');
      c.width = img.width; c.height = img.height;
      const ctx = c.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, c.width, c.height).data;
      const m: Record<string, number> = {};
      for (let i = 0; i < d.length; i += 4) {
        const r = Math.round(d[i]/16)*16, g = Math.round(d[i+1]/16)*16, b = Math.round(d[i+2]/16)*16;
        const hex = '#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');
        m[hex] = (m[hex]||0)+1;
      }
      const top = Object.entries(m).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([c])=>c);
      setPalette(top);
    } catch { setPalette([]); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <input type="text" value={url} onChange={e=>setUrl(e.target.value)} placeholder="Image URL..." className="flex-1 px-4 py-3 border rounded-lg" />
        <button onClick={extract} disabled={!url||loading} className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50">{loading?'...':'Extract'}</button>
      </div>
      {palette.length>0&&(
        <div className="space-y-3">
          <div className="text-sm font-medium">Palette</div>
          <div className="flex flex-wrap gap-2">
            {palette.map((c,i)=>(
              <div key={i} className="text-center cursor-pointer" onClick={()=>navigator.clipboard.writeText(c)}>
                <div className="w-14 h-14 rounded-lg border border-gray-200" style={{backgroundColor:c}}/>
                <div className="text-xs font-mono mt-1">{c.toUpperCase()}</div>
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-400">Click swatch to copy</div>
        </div>
      )}
    </div>
  );
}
