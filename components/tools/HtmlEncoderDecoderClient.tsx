"use client";

import { useState } from "react";

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

  const htmlDecode = (str: string) => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = str;
    return textarea.value;
  };

  const handleConvert = () => {
    setOutput(mode === "encode" ? htmlEncode(input) : htmlDecode(input));
  };

  return (
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
        <textarea
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
          <textarea
            className="tb-v2-textarea"
            value={output}
            readOnly
            rows={4}
          />
        </div>
      )}
    </div>
  );
}
