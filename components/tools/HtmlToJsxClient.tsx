"use client";

import { useState } from "react";

export default function HtmlToJsx() {
  const [html, setHtml] = useState("");
  const [jsx, setJsx] = useState("");
  const [error, setError] = useState("");

  const htmlToJsx = (html: string) => {
    let result = html
      .replace(/class=/g, "className=")
      .replace(/for=/g, "htmlFor=")
      .replace(/onclick=/g, "onClick=")
      .replace(/onchange=/g, "onChange=")
      .replace(/onsubmit=/g, "onSubmit=")
      .replace(/onfocus=/g, "onFocus=")
      .replace(/onblur=/g, "onBlur=")
      .replace(/onkeydown=/g, "onKeyDown=")
      .replace(/onkeyup=/g, "onKeyUp=")
      .replace(/onscroll=/g, "onScroll=")
      .replace(/style="([^"]*)"/g, 'style={{$1}}')
      .replace(/tabindex=/g, "tabIndex=")
      .replace(/readonly=/g, "readOnly=")
      .replace(/maxlength=/g, "maxLength=")
      .replace(/colspan=/g, "colSpan=")
      .replace(/rowspan=/g, "rowSpan=")
      .replace(/novalidate=/g, "noValidate=")
      .replace(/autocomplete=/g, "autoComplete=");
    return result;
  };

  const handleConvert = () => {
    setError("");
    try {
      setJsx(htmlToJsx(html));
    } catch (err) {
      setError("Failed to convert HTML to JSX");
      setJsx("");
    }
  };

  return (
    <div className="tb-v2-section">
      <h2 className="tb-v2-heading-sm">HTML to JSX Converter</h2>
      <p className="tb-v2-text">Convert HTML attributes to React JSX format.</p>
      
      <div className="tb-v2-form-group">
        <label className="tb-v2-label">HTML</label>
        <textarea
          className="tb-v2-textarea"
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          placeholder="Enter HTML code..."
          rows={8}
        />
      </div>

      <button className="tb-v2-button" onClick={handleConvert}>
        Convert to JSX
      </button>

      {error && <p className="tb-v2-error">{error}</p>}

      {jsx && (
        <div className="tb-v2-form-group">
          <label className="tb-v2-label">JSX Output</label>
          <textarea
            className="tb-v2-textarea"
            value={jsx}
            readOnly
            rows={8}
          />
        </div>
      )}
    </div>
  );
}
