"use client";

import { useState } from "react";

export default function HtmlPlaintextExpress() {
  const [html, setHtml] = useState("");
  const [plaintext, setPlaintext] = useState("");
  const [error, setError] = useState("");

  const htmlToPlaintext = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    
    const element = doc.body;
    
    const blockElements = ["P", "DIV", "BR", "H1", "H2", "H3", "H4", "H5", "H6", "LI", "TR", "BLOCKQUOTE"];
    
    let text = "";
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let lastNode: Node | null = null;
    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      const parentName = node.parentElement?.tagName || "";
      
      if (blockElements.includes(parentName) && lastNode && lastNode.textContent) {
        const lastParent = (lastNode as Text).parentElement?.tagName || "";
        if (blockElements.includes(lastParent) || lastNode.textContent.trim() !== "") {
          text += "\n";
        }
      }
      
      text += node.textContent;
      lastNode = node;
    }
    
    return text.replace(/\n{3,}/g, "\n\n").trim();
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
      <h2 className="tb-v2-heading-sm">HTML to Plain Text</h2>
      <p className="tb-v2-text">Extract plain text from HTML, removing all tags and formatting.</p>
      
      <div className="tb-v2-form-group">
        <label className="tb-v2-label">HTML Input</label>
        <textarea
          className="tb-v2-textarea"
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          placeholder="Enter HTML to convert to plain text..."
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
