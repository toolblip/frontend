'use client';

import { useState } from 'react';

// Extended color name database
const COLOR_NAMES: Record<string, string> = {
  '#f0f8ff':'AliceBlue','#faebd7':'AntiqueWhite','#00ffff':'Aqua','#7fffd4':'Aquamarine',
  '#f0ffff':'Azure','#f5f5dc':'Beige','#ffe4c4':'Bisque','#000000':'Black',
  '#ffebcd':'BlanchedAlmond','#0000ff':'Blue','#8a2be2':'BlueViolet','#a52a2a':'Brown',
  '#f08080':'LightCoral','#dc143c':'Crimson','#00008b':'DarkBlue',
  '#008b8b':'DarkCyan','#b8860b':'DarkGoldenRod','#a9a9a9':'DarkGray','#006400':'DarkGreen',
  '#bdb76b':'DarkKhaki','#8b008b':'DarkMagenta','#556b2f':'DarkOliveGreen','#ff8c00':'DarkOrange',
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
  '#ffa500':'Orange','#ff4500':'OrangeRed','#da70d6':'Orchid',
  '#008080':'Teal','#dda0dd':'Plum','#ff0000':'Red','#bc8f8f':'RosyBrown',
  '#4169e1':'RoyalBlue','#8b4513':'SaddleBrown','#2e8b57':'SeaGreen','#fff5ee':'SeaShell',
  '#f5deb3':'Wheat','#ffffff':'White','#f5f5f5':'WhiteSmoke','#ffff00':'Yellow',
  '#9acd32':'YellowGreen','#00fa9a':'MediumSpringGreen','#000080':'Navy','#ffc0cb':'Pink',
  '#db7093':'PaleVioletRed','#afeeee':'PaleTurquoise','#eee8aa':'PaleGoldenRod',
  '#e0e0e0':'Gray','#c0c0c0':'Silver','#808080':'Gray','#ff6347':'Tomato',
  '#40e0d0':'Turquoise','#ee82ee':'Violet','#ffffe0':'LightYellow',
  '#fff8dc':'Cornsilk','#ffe4e1':'MistyRose',
};

function hexToRgb(hex: string): {r:number;g:number;b:number}|null {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? {r:parseInt(r[1],16),g:parseInt(r[2],16),b:parseInt(r[3],16)} : null;
}

function isValidHex(hex: string): boolean {
  return /^#?[a-f\d]{6}$/i.test(hex);
}

function rgbToHsl(r:number,g:number,b:number):{h:number;s:number;l:number} {
  r/=255;g/=255;b/=255;
  const max=Math.max(r,g,b),min=Math.min(r,g,b);
  let h=0,s=0;const l=(max+min)/2;
  if(max!==min){
    const d=max-min;s=l>0.5?d/(2-max-min):d/(max+min);
    switch(max){case r:h=((g-b)/d+(g<b?6:0))/6;break;case g:h=((b-r)/d+2)/6;break;case b:h=((r-g)/d+4)/6;break;}
  }
  return {h:Math.round(h*360),s:Math.round(s*100),l:Math.round(l*100)};
}

function colorDistance(c1:{r:number;g:number;b:number},c2:{r:number;g:number;b:number}):number {
  return Math.sqrt((c1.r-c2.r)**2+(c1.g-c2.g)**2+(c1.b-c2.b)**2);
}

function findClosest(hex:string):{name:string;hex:string;distance:number} {
  const rgb=hexToRgb(hex);
  if(!rgb) return {name:'Unknown',hex, distance:Infinity};
  let best={name:'Unknown',hex, distance:Infinity};
  for(const [chex,name] of Object.entries(COLOR_NAMES)){
    const crgb=hexToRgb(chex);
    if(!crgb) continue;
    const dist=colorDistance(rgb,crgb);
    if(dist<best.distance) best={name,hex:chex,distance:dist};
  }
  return {name:best.name,hex:best.hex,distance:best.distance};
}

function getTints(hex:string):string[] {
  const rgb=hexToRgb(hex);
  if(!rgb) return [];
  return [20,40,60,80].map(pct=>'#'+([rgb.r+(255-rgb.r)*pct/100,rgb.g+(255-rgb.g)*pct/100,rgb.b+(255-rgb.b)*pct/100].map(v=>Math.min(255,Math.round(v)).toString(16).padStart(2,'0')).join('')));
}

function getShades(hex:string):string[] {
  const rgb=hexToRgb(hex);
  if(!rgb) return [];
  return [80,60,40,20].map(pct=>'#'+[rgb.r*pct/100,rgb.g*pct/100,rgb.b*pct/100].map(v=>Math.max(0,Math.round(v)).toString(16).padStart(2,'0')).join(''));
}

export default function ColorNameFinderV2Client() {
  const [color,setColor]=useState('#6366f1');
  const [colorInput,setColorInput]=useState('#6366f1');
  const [hexError,setHexError]=useState(false);
  const [mode,setMode]=useState<'name'|'tints'|'shades'>('name');
  const [copied,setCopied]=useState('');
  const rgb=hexToRgb(color);
  const hsl=rgb?rgbToHsl(rgb.r,rgb.g,rgb.b):null;
  const match=rgb?findClosest(color):null;
  const tints=getTints(color);
  const shades=getShades(color);

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

  const loadExample = () => setColorValue('#e74c3c');

  const copy = (label: string, value: string) => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(label);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Color Name Finder V2</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-end">
        <input type="color" value={color} onChange={e=>setColorValue(e.target.value)} className="rounded-lg cursor-pointer border-2 border-gray-200 flex-shrink-0" style={{width:80,height:80}} />
        <div className="flex-1 w-full">
          <label className="tb-v2-tool-label" style={{marginBottom:6,display:'block'}}>Hex Color</label>
          <input type="text" value={colorInput} onChange={e=>handleColorInput(e.target.value)} className="tb-v2-input" style={{fontFamily:'var(--f-mono)',fontSize:18}} />
          {hexError && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>Enter a valid 6-digit hex color (e.g., #3366FF).</p>}
        </div>
      </div>

      <div className="tb-v2-mode-tabs">
        {(['name','tints','shades'] as const).map(m=>(
          <button key={m} type="button" onClick={()=>setMode(m)} className={`tb-v2-mode-tab ${mode===m?'on':''}`}>{m.charAt(0).toUpperCase()+m.slice(1)}</button>
        ))}
      </div>

      {mode==='name'&&match&&(
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <div className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-gray-200" style={{backgroundColor:match.hex}}/>
          <div className="text-xl font-bold">{match.name}</div>
          <div className="text-sm text-gray-500 mb-3">approx. match, {Math.round(match.distance)}px away</div>
          <button
            type="button"
            onClick={() => copy('match', match.hex.toUpperCase())}
            className={`tb-v2-copy-btn ${copied === 'match' ? 'done' : ''}`}
          >
            {copied === 'match' ? 'Copied' : `Copy ${match.hex.toUpperCase()}`}
          </button>
        </div>
      )}

      {mode==='tints'&&(
        <div className="flex flex-col gap-3">
          <div className="tb-v2-tool-label">Tints (lighter variations)</div>
          <div className="grid grid-cols-4 gap-3">
            {tints.map((t)=>(
              <button key={t} type="button" onClick={() => copy(t, t.toUpperCase())} className="text-center">
                <div className="h-16 rounded-lg border border-gray-200" style={{backgroundColor:t}}/>
                <div className="text-xs font-mono mt-1">{copied === t ? 'Copied' : t.toUpperCase()}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {mode==='shades'&&(
        <div className="flex flex-col gap-3">
          <div className="tb-v2-tool-label">Shades (darker variations)</div>
          <div className="grid grid-cols-4 gap-3">
            {shades.map((s)=>(
              <button key={s} type="button" onClick={() => copy(s, s.toUpperCase())} className="text-center">
                <div className="h-16 rounded-lg border border-gray-200" style={{backgroundColor:s}}/>
                <div className="text-xs font-mono mt-1">{copied === s ? 'Copied' : s.toUpperCase()}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {rgb&&hsl&&(
        <div className="grid grid-cols-3 gap-3 text-sm">
          <button type="button" onClick={() => copy('hex', color.toUpperCase())} className="bg-gray-50 rounded p-2 text-left"><span className="text-gray-500 block">HEX</span><span className="font-mono font-medium">{copied === 'hex' ? 'Copied' : color.toUpperCase()}</span></button>
          <button type="button" onClick={() => copy('rgb', `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)} className="bg-gray-50 rounded p-2 text-left"><span className="text-gray-500 block">RGB</span><span className="font-mono font-medium">{copied === 'rgb' ? 'Copied' : `${rgb.r},${rgb.g},${rgb.b}`}</span></button>
          <button type="button" onClick={() => copy('hsl', `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)} className="bg-gray-50 rounded p-2 text-left"><span className="text-gray-500 block">HSL</span><span className="font-mono font-medium">{copied === 'hsl' ? 'Copied' : `${hsl.h},${hsl.s}%,${hsl.l}%`}</span></button>
        </div>
      )}
    </div>
  );
}
