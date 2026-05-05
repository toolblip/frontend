"use client";

import { useState } from "react";

export default function HtmlLivePreview() {
  const [html, setHtml] = useState("<h1>Hello World</h1>\n<p>Start typing your HTML here...</p>");

  return (
    <div className="tb-v2-section">
      <h2 className="tb-v2-heading-sm">HTML Live Preview</h2>
      <p className="tb-v2-text">Write HTML and see the result in real-time.</p>
      
      <div className="tb-v2-split-view">
        <div className="tb-v2-pane">
          <label className="tb-v2-label">HTML Input</label>
          <textarea
            className="tb-v2-textarea"
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            placeholder="Enter HTML..."
            rows={15}
          />
        </div>
        <div className="tb-v2-pane">
          <label className="tb-v2-label">Preview</label>
          <div className="tb-v2-preview-frame">
            <iframe
              srcDoc={html}
              title="HTML Preview"
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
