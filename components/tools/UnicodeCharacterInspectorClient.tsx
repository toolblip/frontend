'use client';

import { useState, useMemo } from 'react';

interface CharInfo {
  char: string;
  codePoint: number;
  hex: string;
  name: string;
  category: string;
  block: string;
  utf8: string;
  utf16: string;
}

const getUnicodeCategory = (code: number): string => {
  if (code >= 0x0000 && code <= 0x001F) return 'Control';
  if (code >= 0x0020 && code <= 0x007E) return 'ASCII Printable';
  if (code >= 0x007F && code <= 0x009F) return 'Control';
  if (code >= 0x00A0 && code <= 0x00FF) return 'Latin-1 Supplement';
  if (code >= 0x0100 && code <= 0x017F) return 'Latin Extended-A';
  if (code >= 0x0180 && code <= 0x024F) return 'Latin Extended-B';
  if (code >= 0x0250 && code <= 0x02AF) return 'IPA Extensions';
  if (code >= 0x0300 && code <= 0x036F) return 'Combining Diacritical';
  if (code >= 0x0370 && code <= 0x03FF) return 'Greek';
  if (code >= 0x0400 && code <= 0x04FF) return 'Cyrillic';
  if (code >= 0x0500 && code <= 0x052F) return 'Cyrillic Supplement';
  if (code >= 0x0530 && code <= 0x058F) return 'Armenian';
  if (code >= 0x0590 && code <= 0x05FF) return 'Hebrew';
  if (code >= 0x0600 && code <= 0x06FF) return 'Arabic';
  if (code >= 0x0900 && code <= 0x097F) return 'Devanagari';
  if (code >= 0x0980 && code <= 0x09FF) return 'Bengali';
  if (code >= 0x0A00 && code <= 0x0A7F) return 'Gurmukhi';
  if (code >= 0x0A80 && code <= 0x0AFF) return 'Gujarati';
  if (code >= 0x0B00 && code <= 0x0B7F) return 'Oriya';
  if (code >= 0x0B80 && code <= 0x0BFF) return 'Tamil';
  if (code >= 0x0C00 && code <= 0x0C7F) return 'Telugu';
  if (code >= 0x0C80 && code <= 0x0CFF) return 'Kannada';
  if (code >= 0x0D00 && code <= 0x0D7F) return 'Malayalam';
  if (code >= 0x0E00 && code <= 0x0E7F) return 'Thai';
  if (code >= 0x0E80 && code <= 0x0EFF) return 'Lao';
  if (code >= 0x1000 && code <= 0x109F) return 'Myanmar';
  if (code >= 0x10A0 && code <= 0x10FF) return 'Georgian';
  if (code >= 0x1100 && code <= 0x11FF) return 'Hangul Jamo';
  if (code >= 0x1E00 && code <= 0x1EFF) return 'Latin Extended Additional';
  if (code >= 0x1F00 && code <= 0x1FFF) return 'Greek Extended';
  if (code >= 0x2000 && code <= 0x206F) return 'General Punctuation';
  if (code >= 0x2070 && code <= 0x209F) return 'Superscripts/Subscripts';
  if (code >= 0x20A0 && code <= 0x20CF) return 'Currency';
  if (code >= 0x2100 && code <= 0x214F) return 'Letterlike Symbols';
  if (code >= 0x2150 && code <= 0x218F) return 'Number Forms';
  if (code >= 0x2190 && code <= 0x21FF) return 'Arrows';
  if (code >= 0x2200 && code <= 0x22FF) return 'Mathematical Operators';
  if (code >= 0x2300 && code <= 0x23FF) return 'Misc Technical';
  if (code >= 0x2400 && code <= 0x243F) return 'Control Pictures';
  if (code >= 0x2500 && code <= 0x257F) return 'Box Drawing';
  if (code >= 0x2580 && code <= 0x259F) return 'Block Elements';
  if (code >= 0x25A0 && code <= 0x25FF) return 'Geometric Shapes';
  if (code >= 0x2600 && code <= 0x26FF) return 'Misc Symbols';
  if (code >= 0x2700 && code <= 0x27BF) return 'Dingbats';
  if (code >= 0x27C0 && code <= 0x27EF) return 'Misc Math-A';
  if (code >= 0x2800 && code <= 0x28FF) return 'Braille';
  if (code >= 0x2900 && code <= 0x297F) return 'Misc Math-B';
  if (code >= 0x3000 && code <= 0x303F) return 'CJK Symbols';
  if (code >= 0x3040 && code <= 0x309F) return 'Hiragana';
  if (code >= 0x30A0 && code <= 0x30FF) return 'Katakana';
  if (code >= 0x3100 && code <= 0x312F) return 'Bopomofo';
  if (code >= 0x3130 && code <= 0x318F) return 'Hangul Compat';
  if (code >= 0x3190 && code <= 0x319F) return 'Kanbun';
  if (code >= 0x3200 && code <= 0x32FF) return 'CJK Enclosed';
  if (code >= 0x3300 && code <= 0x33FF) return 'CJK Compatibility';
  if (code >= 0x4E00 && code <= 0x9FFF) return 'CJK Unified';
  if (code >= 0xA000 && code <= 0xA48F) return 'Yi Syllables';
  if (code >= 0xAC00 && code <= 0xD7AF) return 'Hangul Syllables';
  if (code >= 0xD800 && code <= 0xDB7F) return 'High Surrogates';
  if (code >= 0xDB80 && code <= 0xDBFF) return 'High Private Use Surrogates';
  if (code >= 0xDC00 && code <= 0xDFFF) return 'Low Surrogates';
  if (code >= 0xE000 && code <= 0xF8FF) return 'Private Use Area';
  if (code >= 0xF900 && code <= 0xFAFF) return 'CJK Compatibility Ideographs';
  if (code >= 0xFB00 && code <= 0xFB4F) return 'Alphabetic Presentation Forms';
  if (code >= 0xFB50 && code <= 0xFDFF) return 'Arabic Presentation Forms-A';
  if (code >= 0xFE00 && code <= 0xFE0F) return 'Variation Selectors';
  if (code >= 0xFE10 && code <= 0xFE1F) return 'Vertical Forms';
  if (code >= 0xFE20 && code <= 0xFE2F) return 'Combining Half Marks';
  if (code >= 0xFE30 && code <= 0xFE4F) return 'CJK Compatibility Forms';
  if (code >= 0xFE50 && code <= 0xFE6F) return 'Small Form Variants';
  if (code >= 0xFE70 && code <= 0xFEFF) return 'Arabic Presentation Forms-B';
  if (code >= 0xFF00 && code <= 0xFFEF) return 'Halfwidth/Fullwidth';
  if (code >= 0xFFF0 && code <= 0xFFFF) return 'Specials';
  return 'Other';
};

const getUtf8Bytes = (code: number): string => {
  if (code <= 0x7F) return code.toString(16).toUpperCase().padStart(2, '0');
  if (code <= 0x7FF) {
    const b1 = 0xC0 | ((code >> 6) & 0x1F);
    const b2 = 0x80 | (code & 0x3F);
    return `${b1.toString(16).toUpperCase()} ${b2.toString(16).toUpperCase()}`;
  }
  if (code <= 0xFFFF) {
    const b1 = 0xE0 | ((code >> 12) & 0x0F);
    const b2 = 0x80 | ((code >> 6) & 0x3F);
    const b3 = 0x80 | (code & 0x3F);
    return `${b1.toString(16).toUpperCase()} ${b2.toString(16).toUpperCase()} ${b3.toString(16).toUpperCase()}`;
  }
  if (code <= 0x10FFFF) {
    const b1 = 0xF0 | ((code >> 18) & 0x07);
    const b2 = 0x80 | ((code >> 12) & 0x3F);
    const b3 = 0x80 | ((code >> 6) & 0x3F);
    const b4 = 0x80 | (code & 0x3F);
    return `${b1.toString(16).toUpperCase()} ${b2.toString(16).toUpperCase()} ${b3.toString(16).toUpperCase()} ${b4.toString(16).toUpperCase()}`;
  }
  return '?';
};

export default function UnicodeCharacterInspectorClient() {
  const [input, setInput] = useState('');

  const charInfo = useMemo<CharInfo[]>(() => {
    if (!input) return [];
    
    const chars = [...input];
    return chars.map(char => {
      const codePoint = char.codePointAt(0) || 0;
      return {
        char,
        codePoint,
        hex: `U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}`,
        name: `U+${codePoint.toString(16).toUpperCase()}`,
        category: getUnicodeCategory(codePoint),
        block: getUnicodeCategory(codePoint),
        utf8: getUtf8Bytes(codePoint),
        utf16: codePoint.toString(16).toUpperCase().padStart(4, '0'),
      };
    });
  }, [input]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Unicode Character Inspector</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Enter characters to inspect</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-2xl font-mono"
          placeholder="Type or paste characters..."
        />
      </div>

      {charInfo.length > 0 && (
        <div className="mt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="text-left py-2 px-3">Char</th>
                  <th className="text-left py-2 px-3">Hex</th>
                  <th className="text-left py-2 px-3">Code Point</th>
                  <th className="text-left py-2 px-3">Category</th>
                  <th className="text-left py-2 px-3">UTF-8</th>
                  <th className="text-left py-2 px-3">UTF-16</th>
                </tr>
              </thead>
              <tbody>
                {charInfo.map((info, i) => (
                  <tr key={i} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="py-3 px-3 text-2xl font-mono">{info.char}</td>
                    <td className="py-3 px-3 font-mono text-blue-500">{info.hex}</td>
                    <td className="py-3 px-3 font-mono">{info.codePoint}</td>
                    <td className="py-3 px-3 text-gray-600 dark:text-gray-400">{info.category}</td>
                    <td className="py-3 px-3 font-mono text-sm">{info.utf8}</td>
                    <td className="py-3 px-3 font-mono text-sm">{info.utf16}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-medium mb-2">Unicode Information:</h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Unicode is a universal character encoding standard</li>
          <li>• Each character has a unique code point (e.g., U+0041 for "A")</li>
          <li>• UTF-8 is the most common encoding for web content</li>
          <li>• Supports over 1 million characters from various scripts</li>
        </ul>
      </div>
    </div>
  );
}
