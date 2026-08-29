'use client';

import { useCallback, useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

/** CSS named colors (hex uppercase → canonical name). */
const HEX_TO_NAME: Record<string, string> = {
  '#F0F8FF': 'AliceBlue',
  '#FAEBD7': 'AntiqueWhite',
  '#00FFFF': 'Aqua',
  '#7FFFD4': 'Aquamarine',
  '#F0FFFF': 'Azure',
  '#F5F5DC': 'Beige',
  '#FFE4C4': 'Bisque',
  '#000000': 'Black',
  '#FFEBCD': 'BlanchedAlmond',
  '#0000FF': 'Blue',
  '#8A2BE2': 'BlueViolet',
  '#A52A2A': 'Brown',
  '#DEB887': 'BurlyWood',
  '#5F9EA0': 'CadetBlue',
  '#7FFF00': 'Chartreuse',
  '#D2691E': 'Chocolate',
  '#FF7F50': 'Coral',
  '#6495ED': 'CornflowerBlue',
  '#FFF8DC': 'Cornsilk',
  '#DC143C': 'Crimson',
  '#00008B': 'DarkBlue',
  '#008B8B': 'DarkCyan',
  '#B8860B': 'DarkGoldenRod',
  '#A9A9A9': 'DarkGray',
  '#006400': 'DarkGreen',
  '#BDB76B': 'DarkKhaki',
  '#8B008B': 'DarkMagenta',
  '#556B2F': 'DarkOliveGreen',
  '#FF8C00': 'DarkOrange',
  '#9932CC': 'DarkOrchid',
  '#8B0000': 'DarkRed',
  '#E9967A': 'DarkSalmon',
  '#8FBC8F': 'DarkSeaGreen',
  '#483D8B': 'DarkSlateBlue',
  '#2F4F4F': 'DarkSlateGray',
  '#00CED1': 'DarkTurquoise',
  '#9400D3': 'DarkViolet',
  '#FF1493': 'DeepPink',
  '#00BFFF': 'DeepSkyBlue',
  '#696969': 'DimGray',
  '#1E90FF': 'DodgerBlue',
  '#B22222': 'FireBrick',
  '#FFFAF0': 'FloralWhite',
  '#228B22': 'ForestGreen',
  '#FF00FF': 'Fuchsia',
  '#DCDCDC': 'Gainsboro',
  '#F8F8FF': 'GhostWhite',
  '#FFD700': 'Gold',
  '#DAA520': 'GoldenRod',
  '#808080': 'Gray',
  '#008000': 'Green',
  '#ADFF2F': 'GreenYellow',
  '#F0FFF0': 'HoneyDew',
  '#FF69B4': 'HotPink',
  '#CD5C5C': 'IndianRed',
  '#4B0082': 'Indigo',
  '#FFFFF0': 'Ivory',
  '#F0E68C': 'Khaki',
  '#E6E6FA': 'Lavender',
  '#FFF0F5': 'LavenderBlush',
  '#7CFC00': 'LawnGreen',
  '#FFFACD': 'LemonChiffon',
  '#ADD8E6': 'LightBlue',
  '#F08080': 'LightCoral',
  '#E0FFFF': 'LightCyan',
  '#FAFAD2': 'LightGoldenRodYellow',
  '#D3D3D3': 'LightGray',
  '#90EE90': 'LightGreen',
  '#FFB6C1': 'LightPink',
  '#FFA07A': 'LightSalmon',
  '#20B2AA': 'LightSeaGreen',
  '#87CEFA': 'LightSkyBlue',
  '#778899': 'LightSlateGray',
  '#B0C4DE': 'LightSteelBlue',
  '#FFFFE0': 'LightYellow',
  '#00FF00': 'Lime',
  '#32CD32': 'LimeGreen',
  '#FAF0E6': 'Linen',
  '#800000': 'Maroon',
  '#66CDAA': 'MediumAquaMarine',
  '#0000CD': 'MediumBlue',
  '#BA55D3': 'MediumOrchid',
  '#9370DB': 'MediumPurple',
  '#3CB371': 'MediumSeaGreen',
  '#7B68EE': 'MediumSlateBlue',
  '#00FA9A': 'MediumSpringGreen',
  '#48D1CC': 'MediumTurquoise',
  '#C71585': 'MediumVioletRed',
  '#191970': 'MidnightBlue',
  '#F5FFFA': 'MintCream',
  '#FFE4E1': 'MistyRose',
  '#FFE4B5': 'Moccasin',
  '#FFDEAD': 'NavajoWhite',
  '#000080': 'Navy',
  '#FDF5E6': 'OldLace',
  '#808000': 'Olive',
  '#6B8E23': 'OliveDrab',
  '#FFA500': 'Orange',
  '#FF4500': 'OrangeRed',
  '#DA70D6': 'Orchid',
  '#EEE8AA': 'PaleGoldenRod',
  '#98FB98': 'PaleGreen',
  '#AFEEEE': 'PaleTurquoise',
  '#DB7093': 'PaleVioletRed',
  '#FFEFD5': 'PapayaWhip',
  '#FFDAB9': 'PeachPuff',
  '#CD853F': 'Peru',
  '#FFC0CB': 'Pink',
  '#DDA0DD': 'Plum',
  '#B0E0E6': 'PowderBlue',
  '#800080': 'Purple',
  '#663399': 'RebeccaPurple',
  '#FF0000': 'Red',
  '#BC8F8F': 'RosyBrown',
  '#4169E1': 'RoyalBlue',
  '#8B4513': 'SaddleBrown',
  '#FA8072': 'Salmon',
  '#F4A460': 'SandyBrown',
  '#2E8B57': 'SeaGreen',
  '#FFF5EE': 'SeaShell',
  '#A0522D': 'Sienna',
  '#C0C0C0': 'Silver',
  '#87CEEB': 'SkyBlue',
  '#6A5ACD': 'SlateBlue',
  '#708090': 'SlateGray',
  '#FFFAFA': 'Snow',
  '#00FF7F': 'SpringGreen',
  '#4682B4': 'SteelBlue',
  '#D2B48C': 'Tan',
  '#008080': 'Teal',
  '#D8BFD8': 'Thistle',
  '#FF6347': 'Tomato',
  '#40E0D0': 'Turquoise',
  '#EE82EE': 'Violet',
  '#F5DEB3': 'Wheat',
  '#FFFFFF': 'White',
  '#F5F5F5': 'WhiteSmoke',
  '#FFFF00': 'Yellow',
  '#9ACD32': 'YellowGreen',
};

const DEFAULT_HEX = '#3498DB';
const EXAMPLE_HEX = '#DC143C';
const EXAMPLE_NAME = 'Crimson';

function isValidHex(hex: string): boolean {
  return /^#?[a-f\d]{6}$/i.test(hex);
}

function normalizeHex(hex: string): string {
  const h = hex.startsWith('#') ? hex : `#${hex}`;
  return h.toUpperCase();
}

function hexToRgb(hex: string) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
}

function findNearest(hex: string): { name: string; hex: string; distance: number } | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;

  const exact = HEX_TO_NAME[normalizeHex(hex)];
  if (exact) return { name: exact, hex: normalizeHex(hex), distance: 0 };

  let best: { name: string; hex: string; distance: number } | null = null;
  for (const [colorHex, name] of Object.entries(HEX_TO_NAME)) {
    const crgb = hexToRgb(colorHex);
    if (!crgb) continue;
    const distance = Math.sqrt(
      (rgb.r - crgb.r) ** 2 + (rgb.g - crgb.g) ** 2 + (rgb.b - crgb.b) ** 2
    );
    if (!best || distance < best.distance) {
      best = { name, hex: colorHex, distance };
    }
  }
  return best;
}

function nameToHex(name: string): string | null {
  const needle = name.trim().toLowerCase();
  if (!needle) return null;
  for (const [hex, n] of Object.entries(HEX_TO_NAME)) {
    if (n.toLowerCase() === needle) return hex;
  }
  // Grey/Gray + Cyan/Magenta aliases (same hex as Aqua/Fuchsia)
  if (needle === 'grey') return nameToHex('Gray');
  if (needle === 'darkgrey') return nameToHex('DarkGray');
  if (needle === 'lightgrey') return nameToHex('LightGray');
  if (needle === 'dimgrey') return nameToHex('DimGray');
  if (needle === 'slategrey') return nameToHex('SlateGray');
  if (needle === 'darkslategrey') return nameToHex('DarkSlateGray');
  if (needle === 'lightslategrey') return nameToHex('LightSlateGray');
  if (needle === 'cyan') return '#00FFFF';
  if (needle === 'magenta') return '#FF00FF';
  return null;
}

const SORTED_NAMES = Object.values(HEX_TO_NAME).sort((a, b) => a.localeCompare(b));

export default function HexToNamedColorClient() {
  const defaultMatch = findNearest(DEFAULT_HEX)!;
  const [hex, setHex] = useState(DEFAULT_HEX);
  const [hexInput, setHexInput] = useState(DEFAULT_HEX);
  const [nameInput, setNameInput] = useState(defaultMatch.name);
  const [hexError, setHexError] = useState('');
  const [nameError, setNameError] = useState('');
  const [copiedHex, setCopiedHex] = useState(false);
  const [copiedName, setCopiedName] = useState(false);

  const match = useMemo(() => findNearest(hex), [hex]);

  const applyHex = useCallback((raw: string, syncInput = true) => {
    const normalized = normalizeHex(raw);
    setHex(normalized);
    if (syncInput) setHexInput(normalized);
    setHexError('');
    const nearest = findNearest(normalized);
    if (nearest) {
      setNameInput(nearest.name);
      setNameError('');
    }
  }, []);

  const applyName = useCallback((raw: string, syncInput = true) => {
    if (syncInput) setNameInput(raw);
    const found = nameToHex(raw);
    if (found) {
      setHex(found);
      setHexInput(found);
      setHexError('');
      setNameError('');
      // Canonicalize casing
      setNameInput(HEX_TO_NAME[found] ?? raw);
    } else if (raw.trim()) {
      setNameError('Unknown CSS named color');
    } else {
      setNameError('');
    }
  }, []);

  const handleHexText = (value: string) => {
    setHexInput(value);
    if (isValidHex(value)) {
      applyHex(value, false);
    } else if (value.trim()) {
      setHexError('Enter a valid 6-digit hex (e.g. #DC143C)');
    } else {
      setHexError('');
    }
  };

  const handleNameText = (value: string) => {
    setNameInput(value);
    const found = nameToHex(value);
    if (found) {
      applyName(value, false);
    } else if (value.trim()) {
      setNameError('Unknown CSS named color');
    } else {
      setNameError('');
    }
  };

  const loadExample = () => {
    applyHex(EXAMPLE_HEX);
    setNameInput(EXAMPLE_NAME);
  };

  const clearAll = () => {
    applyHex(DEFAULT_HEX);
  };

  const copyHex = () => {
    navigator.clipboard.writeText(hex).catch(() => {});
    setCopiedHex(true);
    setTimeout(() => setCopiedHex(false), 1500);
  };

  const copyName = () => {
    const name = match?.name ?? nameInput;
    if (!name) return;
    navigator.clipboard.writeText(name).catch(() => {});
    setCopiedName(true);
    setTimeout(() => setCopiedName(false), 1500);
  };

  const canClear = hex.toUpperCase() !== DEFAULT_HEX || nameInput !== defaultMatch.name;

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="tb-v2-tool-label">HEX-Named Color Converter</span>
        <ToolExampleClearActions onExample={loadExample} onClear={clearAll} canClear={canClear} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y divide-[var(--line)] md:divide-y-0 md:divide-x">
        {/* HEX pane */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 280, padding: 16, gap: 12 }}>
          <div className="tb-v2-tool-input-head" style={{ borderBottom: 'none', padding: 0 }}>
            <span className="tb-v2-tool-label">HEX</span>
            <button
              type="button"
              onClick={copyHex}
              className={`tb-v2-copy-btn ${copiedHex ? 'done' : ''}`}
            >
              {copiedHex ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="flex gap-3 items-center">
            <input
              type="color"
              value={hex}
              onChange={(e) => applyHex(e.target.value)}
              className="rounded-lg cursor-pointer border-2 border-gray-200"
              style={{ width: 64, height: 64 }}
              aria-label="Pick hex color"
            />
            <input
              type="text"
              value={hexInput}
              onChange={(e) => handleHexText(e.target.value)}
              className="tb-v2-input flex-1"
              style={{ fontFamily: 'var(--f-mono)', fontSize: 18 }}
              placeholder="#DC143C"
              spellCheck={false}
            />
          </div>
          {hexError && <p style={{ fontSize: 12, color: '#ef4444', margin: 0 }}>{hexError}</p>}
          <div
            className="rounded-xl border flex-1 min-h-[96px]"
            style={{ backgroundColor: hex, borderColor: 'var(--line)' }}
            aria-hidden
          />
        </div>

        {/* Named color pane */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 280, padding: 16, gap: 12 }}>
          <div className="tb-v2-tool-input-head" style={{ borderBottom: 'none', padding: 0 }}>
            <span className="tb-v2-tool-label">Named color</span>
            <button
              type="button"
              onClick={copyName}
              className={`tb-v2-copy-btn ${copiedName ? 'done' : ''}`}
            >
              {copiedName ? 'Copied' : 'Copy'}
            </button>
          </div>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => handleNameText(e.target.value)}
            list="css-named-colors"
            className="tb-v2-input"
            style={{ fontSize: 18 }}
            placeholder="Crimson"
            spellCheck={false}
          />
          <datalist id="css-named-colors">
            {SORTED_NAMES.map((n) => (
              <option key={n} value={n} />
            ))}
          </datalist>
          <select
            className="tb-v2-input"
            value={nameToHex(nameInput) ? HEX_TO_NAME[nameToHex(nameInput)!] : ''}
            onChange={(e) => applyName(e.target.value)}
            aria-label="Pick named color"
          >
            <option value="" disabled>
              Pick a CSS named color…
            </option>
            {SORTED_NAMES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          {nameError && <p style={{ fontSize: 12, color: '#ef4444', margin: 0 }}>{nameError}</p>}
          {!nameError && match && (
            <p style={{ fontSize: 13, color: 'var(--tb-text-secondary)', margin: 0 }}>
              {match.distance === 0
                ? 'Exact CSS named color'
                : `Nearest: ${match.name} (distance ${Math.round(match.distance)})`}
            </p>
          )}
          <div
            className="rounded-xl border flex-1 min-h-[96px]"
            style={{
              backgroundColor: hex,
              borderColor: 'var(--line)',
            }}
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}
