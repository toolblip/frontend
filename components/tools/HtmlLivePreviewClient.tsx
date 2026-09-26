"use client";
import DeveloperGeneralFrame from './DeveloperGeneralFrame';

import ToolExampleClearActions from './ToolExampleClearActions';
import { useState } from "react";

export default function HtmlLivePreview() {
  const [html, setHtml] = useState("<h1>Hello World</h1>\n<p>Start typing your HTML here...</p>");

  return (
    <DeveloperGeneralFrame><div className="tb-v2-section">
      <ToolExampleClearActions onExample={() => {setHtml('<h1>Hello World</h1>');}} onClear={() => {setHtml('');}} />
      <h2 className="tb-v2-heading-sm">HTML Live Preview</h2>
      <p className="tb-v2-text">Write HTML and see the result in real-time.</p>

      <div className="tb-v2-split-view">
        <div className="tb-v2-pane">
          <label className="tb-v2-label">HTML Input</label>
          <textarea aria-label="Html" maxLength={100000}
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
              srcDoc={`<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:;">` + html}
              title="HTML Preview"
              sandbox=""
            />
          </div>
        </div>
      </div>
    </div></DeveloperGeneralFrame>
  );
}
