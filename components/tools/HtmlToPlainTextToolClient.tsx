"use client";

import { useState } from "react";

export default function HtmlToPlainTextTool() {
  const [html, setHtml] = useState("");
  const [plaintext, setPlaintext] = useState("");
  const [error, setError] = useState("");

  const htmlToPlaintext = (html: string) => {
    return html
      .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, "")
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ")
      .trim();
  };

  const handleConvert = () => {
    setError("");
    try {
      setPlaintext(htmlToPlaintext(html));
    } catch (err) {
      setError("Failed to convert HTML to plain text");
      setPlaintext("");
    }
  };

  return (
    <div className="tb-v2-section">
      <h2 className="tb-v2-heading-sm">HTML to Plain Text Tool</h2>
      <p className="tb-v2-text">Strip HTML tags to get clean plain text content.</p>
      
      <div className="tb-v2-form-group">
        <label className="tb-v2-label">HTML Input</label>
        <textarea
          className="tb-v2-textarea"
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          placeholder="Enter HTML to strip tags..."
          rows={8}
        />
      </div>

      <button className="tb-v2-button" onClick={handleConvert}>
        Strip HTML Tags
      </button>

      {error && <p className="tb-v2-error">{error}</p>}

      {plaintext && (
        <div className="tb-v2-form-group">
          <label className="tb-v2-label">Plain Text</label>
          <textarea
            className="tb-v2-textarea"
            value={plaintext}
            readOnly
            rows={8}
          />
        </div>
      )}
    </div>
  );
}
