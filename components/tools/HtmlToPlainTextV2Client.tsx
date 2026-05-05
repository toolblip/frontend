"use client";

import { useState } from "react";

export default function HtmlToPlainTextV2() {
  const [html, setHtml] = useState("");
  const [plaintext, setPlaintext] = useState("");
  const [error, setError] = useState("");

  const htmlToPlaintext = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    
    const element = doc.body;
    
    const blockTags = ["P", "DIV", "H1", "H2", "H3", "H4", "H5", "H6", "LI", "TR", "BLOCKQUOTE", "BR"];
    
    let result = "";
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let lastBlock = false;
    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      const isBlock = blockTags.includes(node.parentElement?.tagName || "");
      
      if (isBlock && !lastBlock && result.length > 0) {
        result += "\n";
      }
      
      result += node.textContent || "";
      lastBlock = isBlock;
    }
    
    return result
      .replace(/\n{3,}/g, "\n\n")
      .replace(/[ \t]+/g, " ")
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
      <h2 className="tb-v2-heading-sm">HTML to Plain Text V2</h2>
      <p className="tb-v2-text">Extract readable plain text from HTML documents.</p>
      
      <div className="tb-v2-form-group">
        <label className="tb-v2-label">HTML Input</label>
        <textarea
          className="tb-v2-textarea"
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          placeholder="Enter HTML content..."
          rows={8}
        />
      </div>

      <button className="tb-v2-button" onClick={handleConvert}>
        Convert to Plain Text
      </button>

      {error && <p className="tb-v2-error">{error}</p>}

      {plaintext && (
        <div className="tb-v2-form-group">
          <label className="tb-v2-label">Plain Text Output</label>
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
