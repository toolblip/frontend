'use client';

import { useState } from 'react';

const COLOR_NAMES: Record<string, string> = {
  '#f0f8ff':'AliceBlue','#faebd7':'AntiqueWhite','#00ffff':'Aqua','#7fffd4':'Aquamarine',
  '#f0ffff':'Azure','#f5f5dc':'Beige','#ffe4c4':'Bisque','#000000':'Black',
  '#ffebcd':'BlanchedAlmond','#0000ff':'Blue','#8a2be2':'BlueViolet','#a52a2a':'Brown',
  '#00008b':'DarkBlue','#008b8b':'DarkCyan','#b8860b':'DarkGoldenRod','#a9a9a9':'DarkGray',
  '#006400':'DarkGreen','#8b008b':'DarkMagenta','#556b2f':'DarkOliveGreen','#ff8c00':'DarkOrange',
  '#9932cc':'DarkOrchid','#8b0000':'DarkRed','#e9967a':'DarkSalmon','#8fbc8f':'DarkSeaGreen',
  '#483d8b':'DarkSlateBlue','#2f4f4f':'DarkSlateGray','#00ced1':'DarkTurquoise','#9400d3':'DarkViolet',
  '#ff1493':'DeepPink','#00bfff':'DeepSkyBlue','#696969':'DimGray','#1e90ff':'DodgerBlue',
  '#b22222':'FireBrick','#ffd700':'Gold','#dadada':'Gainsboro','#800080':'Purple',
  '#008000':'Green','#adff2f':'GreenYellow','#f0fff0':'Honeydew','#ff69b4':'HotPink',
  '#cd5c5c':'IndianRed','#4b0082':'Indigo','#fffff0':'Ivory','#f0e68c':'Khaki',
  '#e6e6fa':'Lavender','#fff0f5':'LavenderBlush','#7cfc00':'LawnGreen','#fffacd':'LemonChiffon',
  '#add8e6':'LightBlue','#e0ffff':'LightCyan','#ffb6c1':'LightPink',
  '#fafad2':'LightGoldenRodYellow','#90ee90':'LightGreen','#d3d3d3':'LightGray',
  '#0000cd':'MediumBlue','#fa8072':'Salmon','#f4a460':'SandyBrown','#6b8e23':'OliveDrab',
  '#ffa500':'Orange','#ff4500':'OrangeRed','#da70d6':'Orchid','#008080':'Teal',
  '#dda0dd':'Plum','#ff0000':'Red','#bc8f8f':'RosyBrown','#4169e1':'RoyalBlue',
  '#8b4513':'SaddleBrown','#2e8b57':'SeaGreen','#fff5ee':'SeaShell','#f5deb3':'Wheat',
  '#ffffff':'White','#f5f5f5':'WhiteSmoke','#ffff00':'Yellow','#9acd32':'YellowGreen',
  '#00fa9a':'MediumSpringGreen','#000080':'Navy','#ffc0cb':'Pink','#db7093':'PaleVioletRed',
};

function hexToRgb(hex: string): {r:number;g:number;b:number}|null {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? {r:parseInt(r[1],16),g:parseInt(r[2],16),b:parseInt(r[3],16)} : null;
}

function isValidHex(hex: string): boolean {
  return /^#?[a-f\d]{6}$/i.test(hex);
}

function colorDistance(c1:{r:number;g:number;b:number},c2:{r:number;g:number;b:number}):number {
  return Math.sqrt((c1.r-c2.r)**2+(c1.g-c2.g)**2+(c1.b-c2.b)**2);
}

function findClosest(hex:string) {
  const rgb=hexToRgb(hex);
  if(!rgb) return null;
  let best={name:'Unknown',hex,dist:Infinity};
  for(const [chex,name] of Object.entries(COLOR_NAMES)){
    const crgb=hexToRgb(chex);
    if(!crgb) continue;
    const dist=colorDistance(rgb,crgb);
    if(dist<best.dist) best={name,hex:chex,dist};
  }
  return best;
}

export default function ColorNameToolClient() {
  const [color,setColor]=useState('#6366f1');
  const [colorInput,setColorInput]=useState('#6366f1');
  const [hexError,setHexError]=useState(false);
  const [copied,setCopied]=useState('');
  const match=findClosest(color);
  const rgb=hexToRgb(color);

  const setColorValue = (value: string) => {
    setColor(value);
    setColorInput(value);
    setHexError(false);
  };

  const handleColorInput = (value: string) => {
    setColorInput(value);
    if (isValidHex(value)) {
      setColor(value.startsWith('#') ? value : `#${value}`);
      setHexError(false);
    } else {
      setHexError(true);
    }
  };

  const loadExample = () => setColorValue('#2ecc71');

  const copy = (label: string, value: string) => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(label);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Color Name Tool</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div className="flex gap-4 items-end">
        <input type="color" value={color} onChange={e=>setColorValue(e.target.value)} className="rounded cursor-pointer border-2 border-gray-200" style={{width:80,height:80}} />
        <div className="flex-1">
          <label className="tb-v2-tool-label" style={{marginBottom:6,display:'block'}}>Enter Hex</label>
          <input type="text" value={colorInput} onChange={e=>handleColorInput(e.target.value)} className="tb-v2-input" style={{fontFamily:'var(--f-mono)',fontSize:18}} />
          {hexError && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>Enter a valid 6-digit hex color (e.g., #3366FF).</p>}
        </div>
      </div>

      {match&&(
        <div className="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
          <div className="w-16 h-16 rounded-lg border border-gray-200" style={{backgroundColor:match.hex}}/>
          <div className="flex-1">
            <div className="text-xl font-bold">{match.name}</div>
            <div className="text-sm text-gray-500">{match.hex.toUpperCase()}, {Math.round(match.dist)}px away</div>
          </div>
          <button
            type="button"
            onClick={() => copy('match', match.hex.toUpperCase())}
            className={`tb-v2-copy-btn ${copied === 'match' ? 'done' : ''}`}
          >
            {copied === 'match' ? 'Copied' : 'Copy'}
          </button>
        </div>
      )}

      {rgb&&(
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <button type="button" onClick={() => copy('hex', color.toUpperCase())} className="bg-gray-50 rounded p-3 text-left"><span className="text-gray-500 block">HEX</span><span className="font-mono">{copied === 'hex' ? 'Copied' : color.toUpperCase()}</span></button>
          <button type="button" onClick={() => copy('rgb', `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)} className="bg-gray-50 rounded p-3 text-left"><span className="text-gray-500 block">RGB</span><span className="font-mono">{copied === 'rgb' ? 'Copied' : `${rgb.r},${rgb.g},${rgb.b}`}</span></button>
          <div className="bg-gray-50 rounded p-3"><span className="text-gray-500 block">Name</span><span>{match?.name}</span></div>
        </div>
      )}
    </div>
  );
}
