'use client';

import React, { useState } from 'react';

// A small built-in database of ~80 named CSS colors
const COLOR_NAMES: Record<string, string> = {
  '#f0f8ff': 'AliceBlue', '#faebd7': 'AntiqueWhite', '#00ffff': 'Aqua', '#7fffd4': 'Aquamarine',
  '#f0ffff': 'Azure', '#f5f5dc': 'Beige', '#ffe4c4': 'Bisque', '#000000': 'Black',
  '#ffebcd': 'BlanchedAlmond', '#0000ff': 'Blue', '#8a2be2': 'BlueViolet', '#a52a2a': 'Brown',
  '#f08080': 'LightCoral', '#dc143c': 'Crimson', '#00008b': 'DarkBlue',
  '#008b8b': 'DarkCyan', '#b8860b': 'DarkGoldenRod', '#a9a9a9': 'DarkGray', '#006400': 'DarkGreen',
  '#bdb76b': 'DarkKhaki', '#8b008b': 'DarkMagenta', '#556b2f': 'DarkOliveGreen', '#ff8c00': 'DarkOrange',
  '#9932cc': 'DarkOrchid', '#8b0000': 'DarkRed', '#e9967a': 'DarkSalmon', '#8fbc8f': 'DarkSeaGreen',
  '#483d8b': 'DarkSlateBlue', '#2f4f4f': 'DarkSlateGray', '#00ced1': 'DarkTurquoise', '#9400d3': 'DarkViolet',
  '#ff1493': 'DeepPink', '#00bfff': 'DeepSkyBlue', '#696969': 'DimGray', '#1e90ff': 'DodgerBlue',
  '#b22222': 'FireBrick', '#ffd700': 'Gold', '#dadada': 'Gainsboro', '#800080': 'Purple',
  '#008000': 'Green', '#adff2f': 'GreenYellow', '#f0fff0': 'Honeydew', '#ff69b4': 'HotPink',
  '#cd5c5c': 'IndianRed', '#4b0082': 'Indigo', '#fffff0': 'Ivory', '#f0e68c': 'Khaki',
  '#e6e6fa': 'Lavender', '#fff0f5': 'LavenderBlush', '#7cfc00': 'LawnGreen', '#fffacd': 'LemonChiffon',
  '#add8e6': 'LightBlue', '#e0ffff': 'LightCyan', '#ffb6c1': 'LightPink',
  '#fafad2': 'LightGoldenRodYellow', '#90ee90': 'LightGreen', '#d3d3d3': 'LightGray',
  '#0000cd': 'MediumBlue', '#fa8072': 'Salmon', '#f4a460': 'SandyBrown', '#6b8e23': 'OliveDrab',
  '#ffa500': 'Orange', '#ff4500': 'OrangeRed', '#da70d6': 'Orchid',
  '#008080': 'Teal', '#dda0dd': 'Plum', '#ff0000': 'Red', '#bc8f8f': 'RosyBrown',
  '#4169e1': 'RoyalBlue', '#8b4513': 'SaddleBrown', '#2e8b57': 'SeaGreen', '#fff5ee': 'SeaShell',
  '#f5deb3': 'Wheat', '#ffffff': 'White', '#f5f5f5': 'WhiteSmoke', '#ffff00': 'Yellow',
  '#9acd32': 'YellowGreen', '#00fa9a': 'MediumSpringGreen', '#000080': 'Navy', '#ffc0cb': 'Pink',
  '#db7093': 'PaleVioletRed', '#afeeee': 'PaleTurquoise', '#eee8aa': 'PaleGoldenRod',
};

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
}

function colorDistance(c1: {r:number;g:number;b:number}, c2: {r:number;g:number;b:number}): number {
  return Math.sqrt((c1.r - c2.r) ** 2 + (c1.g - c2.g) ** 2 + (c1.b - c2.b) ** 2);
}

function findClosestName(hex: string): { name: string; distance: number } {
  const rgb = hexToRgb(hex);
  if (!rgb) return { name: 'Unknown', distance: Infinity };

  let best = { name: 'Unknown', distance: Infinity };
  for (const [colorHex, name] of Object.entries(COLOR_NAMES)) {
    const crgb = hexToRgb(colorHex);
    if (!crgb) continue;
    const dist = colorDistance(rgb, crgb);
    if (dist < best.distance) best = { name, distance: dist };
  }
  return best;
}

export default function ColorNameFinderClient() {
  const [color, setColor] = useState('#6366f1');
  const rgb = hexToRgb(color);

  const match = rgb ? findClosestName(color) : null;

  const variations = rgb ? [
    { name: 'Lighten 20%', hex: '#' + [rgb.r + Math.round((255 - rgb.r) * 0.2), rgb.g + Math.round((255 - rgb.g) * 0.2), rgb.b + Math.round((255 - rgb.b) * 0.2)].map(v => Math.min(255, v).toString(16).padStart(2, '0')).join('') },
    { name: 'Darken 20%', hex: '#' + [rgb.r * 0.8, rgb.g * 0.8, rgb.b * 0.8].map(v => Math.max(0, Math.round(v)).toString(16).padStart(2, '0')).join('') },
    { name: 'Saturate +20%', hex: color },
    { name: 'Desaturate 20%', hex: color },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-2">Pick a Color</label>
          <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-24 h-24 rounded-lg cursor-pointer border-2 border-gray-200" />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Hex</label>
          <input type="text" value={color} onChange={e => setColor(e.target.value)} className="w-full px-4 py-3 border rounded-lg font-mono text-lg" />
        </div>
      </div>

      {match && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold mb-1" style={{ color }}>{match.name}</div>
          <div className="text-sm text-gray-500">Closest CSS named color · distance {Math.round(match.distance)}</div>
        </div>
      )}

      {rgb && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-gray-50 rounded p-3"><span className="text-gray-500">HEX</span><div className="font-mono font-medium">{color.toUpperCase()}</div></div>
          <div className="bg-gray-50 rounded p-3"><span className="text-gray-500">RGB</span><div className="font-mono font-medium">{rgb.r}, {rgb.g}, {rgb.b}</div></div>
          <div className="bg-gray-50 rounded p-3"><span className="text-gray-500">HSL</span><div className="font-mono font-medium"> - </div></div>
          <div className="bg-gray-50 rounded p-3"><span className="text-gray-500">Name</span><div className="font-medium">{match?.name}</div></div>
        </div>
      )}
    </div>
  );
}
