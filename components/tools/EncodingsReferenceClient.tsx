'use client';

import { useState, useMemo } from 'react';

type Category = 'ascii' | 'entities' | 'url' | 'base64';

const CATEGORY_LABELS: Record<Category, string> = {
  ascii: 'ASCII Table',
  entities: 'HTML Entities',
  url: 'URL Encoding',
  base64: 'Base64 Alphabet',
};

interface AsciiRow { dec: number; hex: string; char: string; }
const ASCII_ROWS: AsciiRow[] = Array.from({ length: 95 }, (_, i) => {
  const dec = i + 32;
  return { dec, hex: dec.toString(16).toUpperCase().padStart(2, '0'), char: dec === 32 ? '(space)' : String.fromCharCode(dec) };
});

interface EntityRow { name: string; entity: string; numeric: string; description: string; }
const ENTITY_ROWS: EntityRow[] = [
  { name: 'amp', entity: '&amp;', numeric: '&#38;', description: 'Ampersand' },
  { name: 'lt', entity: '&lt;', numeric: '&#60;', description: 'Less than' },
  { name: 'gt', entity: '&gt;', numeric: '&#62;', description: 'Greater than' },
  { name: 'quot', entity: '&quot;', numeric: '&#34;', description: 'Double quote' },
  { name: 'apos', entity: '&apos;', numeric: '&#39;', description: 'Apostrophe' },
  { name: 'nbsp', entity: '&nbsp;', numeric: '&#160;', description: 'Non-breaking space' },
  { name: 'copy', entity: '&copy;', numeric: '&#169;', description: 'Copyright sign' },
  { name: 'reg', entity: '&reg;', numeric: '&#174;', description: 'Registered trademark' },
  { name: 'trade', entity: '&trade;', numeric: '&#8482;', description: 'Trademark' },
  { name: 'euro', entity: '&euro;', numeric: '&#8364;', description: 'Euro sign' },
  { name: 'pound', entity: '&pound;', numeric: '&#163;', description: 'Pound sign' },
  { name: 'yen', entity: '&yen;', numeric: '&#165;', description: 'Yen sign' },
  { name: 'cent', entity: '&cent;', numeric: '&#162;', description: 'Cent sign' },
  { name: 'sect', entity: '&sect;', numeric: '&#167;', description: 'Section sign' },
  { name: 'para', entity: '&para;', numeric: '&#182;', description: 'Pilcrow' },
  { name: 'deg', entity: '&deg;', numeric: '&#176;', description: 'Degree sign' },
  { name: 'plusmn', entity: '&plusmn;', numeric: '&#177;', description: 'Plus-minus sign' },
  { name: 'times', entity: '&times;', numeric: '&#215;', description: 'Multiplication sign' },
  { name: 'divide', entity: '&divide;', numeric: '&#247;', description: 'Division sign' },
  { name: 'frac12', entity: '&frac12;', numeric: '&#189;', description: 'One half' },
  { name: 'frac14', entity: '&frac14;', numeric: '&#188;', description: 'One quarter' },
  { name: 'hellip', entity: '&hellip;', numeric: '&#8230;', description: 'Horizontal ellipsis' },
  { name: 'ndash', entity: '&ndash;', numeric: '&#8211;', description: 'En dash' },
  { name: 'laquo', entity: '&laquo;', numeric: '&#171;', description: 'Left angle quote' },
  { name: 'raquo', entity: '&raquo;', numeric: '&#187;', description: 'Right angle quote' },
  { name: 'bull', entity: '&bull;', numeric: '&#8226;', description: 'Bullet' },
  { name: 'dagger', entity: '&dagger;', numeric: '&#8224;', description: 'Dagger' },
  { name: 'larr', entity: '&larr;', numeric: '&#8592;', description: 'Left arrow' },
  { name: 'rarr', entity: '&rarr;', numeric: '&#8594;', description: 'Right arrow' },
  { name: 'uarr', entity: '&uarr;', numeric: '&#8593;', description: 'Up arrow' },
  { name: 'darr', entity: '&darr;', numeric: '&#8595;', description: 'Down arrow' },
  { name: 'hearts', entity: '&hearts;', numeric: '&#9829;', description: 'Heart suit' },
];

const URL_CHARS = [' ', '!', '"', '#', '$', '%', '&', "'", '(', ')', '*', '+', ',', '/', ':', ';', '=', '?', '@', '[', ']'];
interface UrlRow { char: string; encoded: string; }
const URL_ROWS: UrlRow[] = URL_CHARS.map(c => ({ char: c === ' ' ? '(space)' : c, encoded: encodeURIComponent(c) }));

interface Base64Row { index: number; char: string; }
const BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const BASE64_ROWS: Base64Row[] = Array.from(BASE64_ALPHABET).map((char, index) => ({ index, char }));

export default function EncodingsReferenceClient() {
  const [category, setCategory] = useState<Category>('ascii');
  const [search, setSearch] = useState('');

  const filteredAscii = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ASCII_ROWS;
    return ASCII_ROWS.filter(r => r.char.toLowerCase().includes(q) || String(r.dec).includes(q) || r.hex.toLowerCase().includes(q));
  }, [search]);

  const filteredEntities = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ENTITY_ROWS;
    return ENTITY_ROWS.filter(r => r.name.includes(q) || r.description.toLowerCase().includes(q) || r.entity.includes(q));
  }, [search]);

  const filteredUrl = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return URL_ROWS;
    return URL_ROWS.filter(r => r.char.toLowerCase().includes(q) || r.encoded.toLowerCase().includes(q));
  }, [search]);

  const filteredBase64 = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return BASE64_ROWS;
    return BASE64_ROWS.filter(r => r.char.toLowerCase() === q || String(r.index) === q);
  }, [search]);

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Category</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
        {(Object.keys(CATEGORY_LABELS) as Category[]).map(c => (
          <button key={c} type="button" onClick={() => setCategory(c)} className={`tb-v2-mode-tab ${category === c ? 'on' : ''}`}>
            {CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Filter this table..."
        className="tb-v2-input"
        style={{ marginBottom: 10 }}
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">{CATEGORY_LABELS[category]}</span>
      </div>
      <div className="tb-v2-tool-output-body" style={{ maxHeight: 420, overflowY: 'auto' }}>
        {category === 'ascii' && (
          filteredAscii.length === 0 ? <p className="tb-v2-empty">No matching characters.</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead><tr style={{ textAlign: 'left', borderBottom: '1px solid var(--line)' }}>
                <th style={{ padding: '6px 8px' }}>Dec</th><th style={{ padding: '6px 8px' }}>Hex</th><th style={{ padding: '6px 8px' }}>Char</th>
              </tr></thead>
              <tbody>{filteredAscii.map(r => (
                <tr key={r.dec} style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '6px 8px', fontFamily: 'var(--f-mono)' }}>{r.dec}</td>
                  <td style={{ padding: '6px 8px', fontFamily: 'var(--f-mono)' }}>0x{r.hex}</td>
                  <td style={{ padding: '6px 8px', fontFamily: 'var(--f-mono)' }}>{r.char}</td>
                </tr>
              ))}</tbody>
            </table>
          )
        )}

        {category === 'entities' && (
          filteredEntities.length === 0 ? <p className="tb-v2-empty">No matching entities.</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead><tr style={{ textAlign: 'left', borderBottom: '1px solid var(--line)' }}>
                <th style={{ padding: '6px 8px' }}>Entity</th><th style={{ padding: '6px 8px' }}>Numeric</th><th style={{ padding: '6px 8px' }}>Description</th>
              </tr></thead>
              <tbody>{filteredEntities.map(r => (
                <tr key={r.name} style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '6px 8px', fontFamily: 'var(--f-mono)' }}>{r.entity}</td>
                  <td style={{ padding: '6px 8px', fontFamily: 'var(--f-mono)' }}>{r.numeric}</td>
                  <td style={{ padding: '6px 8px' }}>{r.description}</td>
                </tr>
              ))}</tbody>
            </table>
          )
        )}

        {category === 'url' && (
          filteredUrl.length === 0 ? <p className="tb-v2-empty">No matching characters.</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead><tr style={{ textAlign: 'left', borderBottom: '1px solid var(--line)' }}>
                <th style={{ padding: '6px 8px' }}>Char</th><th style={{ padding: '6px 8px' }}>Encoded</th>
              </tr></thead>
              <tbody>{filteredUrl.map(r => (
                <tr key={r.char} style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '6px 8px', fontFamily: 'var(--f-mono)' }}>{r.char}</td>
                  <td style={{ padding: '6px 8px', fontFamily: 'var(--f-mono)' }}>{r.encoded}</td>
                </tr>
              ))}</tbody>
            </table>
          )
        )}

        {category === 'base64' && (
          filteredBase64.length === 0 ? <p className="tb-v2-empty">No matching characters.</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead><tr style={{ textAlign: 'left', borderBottom: '1px solid var(--line)' }}>
                <th style={{ padding: '6px 8px' }}>Index</th><th style={{ padding: '6px 8px' }}>Char</th>
              </tr></thead>
              <tbody>{filteredBase64.map(r => (
                <tr key={r.index} style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '6px 8px', fontFamily: 'var(--f-mono)' }}>{r.index}</td>
                  <td style={{ padding: '6px 8px', fontFamily: 'var(--f-mono)' }}>{r.char}</td>
                </tr>
              ))}
              <tr><td style={{ padding: '6px 8px', fontFamily: 'var(--f-mono)' }}>pad</td><td style={{ padding: '6px 8px', fontFamily: 'var(--f-mono)' }}>=</td></tr>
              </tbody>
            </table>
          )
        )}
      </div>
    </div>
  );
}
