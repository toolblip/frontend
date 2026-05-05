"use client";

import { useState } from "react";

const entities = [
  { char: "<", name: "Less than", hex: "&#60;", decimal: "&lt;" },
  { char: ">", name: "Greater than", hex: "&#62;", decimal: "&gt;" },
  { char: "&", name: "Ampersand", hex: "&#38;", decimal: "&amp;" },
  { char: '"', name: "Quotation mark", hex: "&#34;", decimal: "&quot;" },
  { char: "'", name: "Apostrophe", hex: "&#39;", decimal: "&apos;" },
  { char: " ", name: "Non-breaking space", hex: "&#160;", decimal: "&nbsp;" },
  { char: "©", name: "Copyright", hex: "&#169;", decimal: "&copy;" },
  { char: "®", name: "Registered trademark", hex: "&#174;", decimal: "&reg;" },
  { char: "™", name: "Trademark", hex: "&#8482;", decimal: "&trade;" },
  { char: "€", name: "Euro", hex: "&#8364;", decimal: "&euro;" },
  { char: "£", name: "Pound", hex: "&#163;", decimal: "&pound;" },
  { char: "¥", name: "Yen", hex: "&#165;", decimal: "&yen;" },
  { char: "¢", name: "Cent", hex: "&#162;", decimal: "&cent;" },
  { char: "§", name: "Section", hex: "&#167;", decimal: "&sect;" },
  { char: "¶", name: "Paragraph", hex: "&#182;", decimal: "&para;" },
  { char: "•", name: "Bullet", hex: "&#8226;", decimal: "&bull;" },
  { char: "…", name: "Ellipsis", hex: "&#8230;", decimal: "&hellip;" },
  { char: "'", name: "Left single quote", hex: "&#8216;", decimal: "&lsquo;" },
  { char: "'", name: "Right single quote", hex: "&#8217;", decimal: "&rsquo;" },
  { char: '\u201C', name: "Left double quote", hex: "&#8220;", decimal: "&ldquo;" },
  { char: '\u201D', name: "Right double quote", hex: "&#8221;", decimal: "&rdquo;" },
  { char: "–", name: "En dash", hex: "&#8211;", decimal: "&ndash;" },
  { char: "—", name: "Em dash", hex: "&#8212;", decimal: "&mdash;" },
  { char: "×", name: "Multiplication", hex: "&#215;", decimal: "&times;" },
  { char: "÷", name: "Division", hex: "&#247;", decimal: "&divide;" },
];

export default function HtmlEntitiesReference() {
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const filteredEntities = entities.filter(
    (e) =>
      e.char.includes(search) ||
      e.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(`${type}-${text}`);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="tb-v2-section">
      <h2 className="tb-v2-heading-sm">HTML Entities Reference</h2>
      <p className="tb-v2-text">Quick reference for common HTML entities and special characters.</p>
      
      <div className="tb-v2-form-group">
        <label className="tb-v2-label">Search</label>
        <input
          type="text"
          className="tb-v2-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search characters or names..."
        />
      </div>

      <div className="tb-v2-table">
        <div className="tb-v2-table-header">
          <div>Character</div>
          <div>Name</div>
          <div>Decimal</div>
          <div>Hex</div>
        </div>
        {filteredEntities.map((entity, idx) => (
          <div key={idx} className="tb-v2-table-row">
            <div className="tb-v2-char-cell">{entity.char}</div>
            <div>{entity.name}</div>
            <div className="tb-v2-code-cell">
              <button
                className="tb-v2-copy-btn"
                onClick={() => handleCopy(entity.decimal, "dec")}
              >
                {copied === `dec-${entity.decimal}` ? "Copied!" : entity.decimal}
              </button>
            </div>
            <div className="tb-v2-code-cell">
              <button
                className="tb-v2-copy-btn"
                onClick={() => handleCopy(entity.hex, "hex")}
              >
                {copied === `hex-${entity.hex}` ? "Copied!" : entity.hex}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
