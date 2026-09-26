"use client";
import DeveloperSecurityFrame from './DeveloperSecurityFrame';
import { decodeHtml } from '@/lib/developer-security/primitives';

import { useState, useEffect } from "react";

export default function HtmlEncoderDecoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const htmlEncode = (str: string) => {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  };

  const htmlDecode = decodeHtml;

  const handleConvert = () => {
    setOutput(mode === "encode" ? htmlEncode(input) : htmlDecode(input));
  };

  useEffect(() => { handleConvert(); }, [input, mode]);

  return (
    <DeveloperSecurityFrame onExample={()=>{setMode('encode');setInput('<b>é & tea</b>');}} onClear={()=>{setInput('');setOutput('');}}>
    <div className="tb-v2-section">
      <h2 className="tb-v2-heading-sm">HTML Encoder / Decoder</h2>
      <p className="tb-v2-text">Encode or decode HTML entities in text.</p>

      <div className="tb-v2-form-group">
        <div className="tb-v2-button-group">
          <button
            className={mode === "encode" ? "tb-v2-button" : "tb-v2-button-secondary"}
            onClick={() => setMode("encode")}
          >
            Encode
          </button>
          <button
            className={mode === "decode" ? "tb-v2-button" : "tb-v2-button-secondary"}
            onClick={() => setMode("decode")}
          >
            Decode
          </button>
        </div>
      </div>

      <div className="tb-v2-form-group">
        <label className="tb-v2-label">Input</label>
        <textarea aria-label="Input" maxLength={100000}
          className="tb-v2-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text..."
          rows={4}
        />
      </div>

      <button className="tb-v2-button" onClick={handleConvert}>
        {mode === "encode" ? "Encode" : "Decode"}
      </button>

      {output && (
        <div className="tb-v2-form-group">
          <label className="tb-v2-label">Output</label>
          <textarea aria-label="Output" maxLength={100000}
            className="tb-v2-textarea"
            value={output}
            readOnly
            rows={4}
          />
        </div>
      )}
    </div>
    </DeveloperSecurityFrame>
  );
}
