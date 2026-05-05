'use client';

import React, { useState, useEffect } from 'react';

interface HomoglyphInfo {
  char: string;
  position: number;
  category: 'Latin' | 'Cyrillic' | 'Greek' | 'Digit' | 'Other';
  similar: string[];
  risk: 'high' | 'medium' | 'low';
}

const HOMOGLYPHS: Record<string, string[]> = {
  'a': ['а', 'ɑ', 'α'],
  'A': ['А', 'Α'],
  'c': ['с', 'ϲ'],
  'C': ['С', 'Ϲ'],
  'e': ['е', 'ε', 'ё'],
  'E': ['Е', 'Ε'],
  'i': ['і', 'ι', 'í', 'ì'],
  'I': ['І', 'Ι', 'Í', 'Ì', 'İ', 'Ⅰ'],
  'k': ['κ'],
  'K': ['Κ'],
  'o': ['о', 'ο', 'ο', '0'],
  'O': ['О', 'Ο', '0'],
  'p': ['р', 'ρ'],
  'P': ['Р', 'Ρ'],
  's': ['ѕ'],
  'S': ['Ѕ', 'Σ'],
  'x': ['х'],
  'X': ['Х', 'Χ'],
  'y': ['у', 'γ'],
  'Y': ['У', 'Υ'],
  'z': ['ζ'],
  'Z': ['Ζ'],
  '0': ['О', 'о', 'Ο', 'ο'],
  '1': ['І', 'і', 'l', 'I', 'ι'],
  '2': ['Ζ', 'ζ', 'ρ'],
  '3': ['Ε', 'ε', 'з'],
  '4': ['Α', 'α', 'Ч', 'ч'],
  '5': ['Ѕ', 'ѕ', 'S', 's'],
  '6': ['б', 'β'],
  '7': ['Τ', 'τ', 'т'],
  '8': ['В', 'β', 'в'],
  '9': ['д', 'ο', 'ο'],
};

const getCharCategory = (char: string): 'Latin' | 'Cyrillic' | 'Greek' | 'Digit' | 'Other' => {
  const code = char.charCodeAt(0);
  if ((code >= 0x0041 && code <= 0x007A) || (code >= 0x0030 && code <= 0x0039)) return 'Latin';
  if ((code >= 0x0410 && code <= 0x044F) || (code >= 0x0400 && code <= 0x04FF)) return 'Cyrillic';
  if ((code >= 0x0370 && code <= 0x03FF) || (code >= 0x1F00 && code <= 0x1FFF)) return 'Greek';
  if (code >= 0x0030 && code <= 0x0039) return 'Digit';
  return 'Other';
};

const getRiskLevel = (info: HomoglyphInfo): 'high' | 'medium' | 'low' => {
  if (info.similar.length === 0) return 'low';
  if (info.category === 'Latin' && info.similar.some(s => getCharCategory(s) !== 'Latin')) return 'high';
  return 'medium';
};

export default function HomoglyphDetectorClient() {
  const [input, setInput] = useState('example.com or g00gle.com');
  const [results, setResults] = useState<HomoglyphInfo[]>([]);
  const [urlAnalysis, setUrlAnalysis] = useState<{ original: string; decoded: string; isSuspicious: boolean }[]>([]);

  useEffect(() => {
    const chars: HomoglyphInfo[] = [];
    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      const similar = HOMOGLYPHS[char.toLowerCase()] || HOMOGLYPHS[char] || [];
      const info: HomoglyphInfo = {
        char,
        position: i,
        category: getCharCategory(char),
        similar,
        risk: getRiskLevel({ char, position: i, category: getCharCategory(char), similar, risk: 'low' }),
      };
      info.risk = getRiskLevel(info);
      if (similar.length > 0 || info.risk !== 'low') {
        chars.push(info);
      }
    }
    setResults(chars);
  }, [input]);

  useEffect(() => {
    const urls = input.match(/https?:\/\/[^\s]+/g) || [];
    const analysis = urls.map((url) => {
      const decoded = url.replace(/[\u0400-\u04FF\u0370-\u03FF\u1F00-\u1FFF]/g, (char) => {
        const lower = char.toLowerCase();
        for (const [latin, homoglyphs] of Object.entries(HOMOGLYPHS)) {
          if (homoglyphs.includes(lower)) {
            return latin;
          }
        }
        return char;
      });
      return {
        original: url,
        decoded,
        isSuspicious: decoded !== url,
      };
    });
    setUrlAnalysis(analysis);
  }, [input]);

  const suspiciousCount = results.filter(r => r.risk === 'high').length;
  const warningCount = results.filter(r => r.risk === 'medium').length;

  const getRiskColor = (risk: 'high' | 'medium' | 'low') => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Latin': return 'bg-blue-100 text-blue-700';
      case 'Cyrillic': return 'bg-purple-100 text-purple-700';
      case 'Greek': return 'bg-green-100 text-green-700';
      case 'Digit': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="tb-v2-card">
      <div className="tb-v2-card-header">
        <h2 className="tb-v2-card-title">Homoglyph Detector</h2>
        <p className="tb-v2-card-description">
          Detect look-alike characters that can be used for phishing and spoofing attacks
        </p>
      </div>

      <div className="tb-v2-form-group">
        <label className="tb-v2-label">Input Text or URL</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="tb-v2-input font-mono min-h-[100px]"
          placeholder="Enter text or URL to check for homoglyphs (e.g., g00gle.com, pаypal.com)"
        />
        <p className="tb-v2-text text-xs mt-1">
          Enter any text containing Latin characters, digits, or URLs to scan
        </p>
      </div>

      <div className="tb-v2-form-group">
        <div className="flex gap-4 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-red-500"></span>
            <span className="text-sm">High Risk: {suspiciousCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-yellow-500"></span>
            <span className="text-sm">Warning: {warningCount}</span>
          </div>
        </div>

        {results.length > 0 ? (
          <div className="tb-v2-card p-4 space-y-2">
            <div className="flex flex-wrap gap-2">
              {results.map((result, idx) => (
                <div
                  key={idx}
                  className={`px-3 py-2 rounded-lg border ${getRiskColor(result.risk)}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg font-bold">"{result.char}"</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${getCategoryColor(result.category)}`}>
                      {result.category}
                    </span>
                  </div>
                  {result.similar.length > 0 && (
                    <div className="text-xs mt-1">
                      Similar: {result.similar.join(', ')}
                    </div>
                  )}
                  <div className="text-xs mt-1 opacity-75">
                    Position: {result.position}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="tb-v2-card p-4 bg-green-50 border-green-200 text-center">
            <p className="text-green-700">No homoglyphs detected!</p>
          </div>
        )}
      </div>

      {urlAnalysis.length > 0 && (
        <div className="tb-v2-form-group">
          <label className="tb-v2-label">URL Analysis</label>
          <div className="space-y-2">
            {urlAnalysis.map((url, idx) => (
              <div key={idx} className={`tb-v2-card p-4 rounded-lg border ${
                url.isSuspicious ? 'border-red-300 bg-red-50' : 'border-green-200 bg-green-50'
              }`}>
                <div className="text-sm">
                  <div className="flex items-start gap-2">
                    <span className={url.isSuspicious ? 'text-red-600' : 'text-green-600'}>
                      {url.isSuspicious ? '⚠️' : '✅'}
                    </span>
                    <div className="flex-1">
                      <div className="font-mono text-xs text-gray-600 mb-1">Original:</div>
                      <div className="font-mono text-sm break-all">{url.original}</div>
                      {url.isSuspicious && (
                        <>
                          <div className="font-mono text-xs text-gray-600 mt-2 mb-1">Decoded to:</div>
                          <div className="font-mono text-sm break-all text-green-700">{url.decoded}</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="tb-v2-form-group">
        <div className="tb-v2-label">Character Reference</div>
        <div className="tb-v2-card p-4 text-sm">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <div className="font-semibold mb-1">Common Latin Homoglyphs</div>
              <div className="text-gray-600 space-y-0.5">
                <div>a → а, α, ɑ</div>
                <div>o → о, ο, 0</div>
                <div>e → е, ε, ё</div>
                <div>p → р, ρ</div>
                <div>c → с, ϲ</div>
              </div>
            </div>
            <div>
              <div className="font-semibold mb-1">Digit Homoglyphs</div>
              <div className="text-gray-600 space-y-0.5">
                <div>0 → О, о</div>
                <div>1 → І, і, l, I</div>
                <div>3 → Ε, ε, з</div>
                <div>4 → Α, α, Ч</div>
                <div>5 → Ѕ, ѕ, S</div>
              </div>
            </div>
            <div>
              <div className="font-semibold mb-1">Attack Examples</div>
              <div className="text-gray-600 space-y-0.5">
                <div>g00gle.com</div>
                <div>pаypal.com</div>
                <div>араple.com</div>
                <div>аmazon.com</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tb-v2-form-group">
        <div className="tb-v2-label">Security Advisory</div>
        <div className="tb-v2-card p-4 text-sm space-y-2">
          <p>
            <strong>Homoglyph attacks</strong> (also called IDN homograph attacks) exploit visual 
            similarity between characters from different scripts to create deceptive domain names.
          </p>
          <p className="text-gray-600">
            Attackers may register domains like "pаypal.com" (with Cyrillic 'а') that look identical 
            to "paypal.com" in browsers, tricking users into visiting malicious sites.
          </p>
          <p className="text-gray-600">
            <strong>Protection:</strong> Always verify URLs carefully, enable punycode display in 
            your browser, use security tools that detect homoglyph domains, and implement URL 
            validation in your applications.
          </p>
        </div>
      </div>
    </div>
  );
}
