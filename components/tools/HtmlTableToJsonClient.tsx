"use client";

import { useState } from "react";

export default function HtmlTableToJson() {
  const [html, setHtml] = useState("");
  const [json, setJson] = useState("");
  const [error, setError] = useState("");

  const htmlTableToJson = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const table = doc.querySelector("table");
    if (!table) throw new Error("No table found in HTML");
    
    const headers: string[] = [];
    const headerCells = table.querySelectorAll("th");
    headerCells.forEach((cell) => headers.push(cell.textContent?.trim() || ""));
    
    if (headers.length === 0) {
      const firstRow = table.querySelector("tr");
      if (firstRow) {
        firstRow.querySelectorAll("td").forEach((cell) => {
          headers.push(cell.textContent?.trim() || "");
        });
      }
    }

    const rows: Record<string, string>[] = [];
    const trs = table.querySelectorAll("tr");
    trs.forEach((tr, idx) => {
      if (idx === 0 && headerCells.length > 0) return;
      const cells = tr.querySelectorAll("td");
      const row: Record<string, string> = {};
      cells.forEach((cell, cellIdx) => {
        const key = headers[cellIdx] || `col${cellIdx}`;
        row[key] = cell.textContent?.trim() || "";
      });
      if (Object.keys(row).length > 0) rows.push(row);
    });

    return JSON.stringify(headers.length > 0 ? { headers, rows } : rows, null, 2);
  };

  const handleConvert = () => {
    setError("");
    try {
      setJson(htmlTableToJson(html));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse HTML table");
      setJson("");
    }
  };

  return (
    <div className="tb-v2-section">
      <h2 className="tb-v2-heading-sm">HTML Table to JSON</h2>
      <p className="tb-v2-text">Convert HTML tables to JSON format for APIs and data processing.</p>
      
      <div className="tb-v2-form-group">
        <label className="tb-v2-label">HTML Table</label>
        <textarea
          className="tb-v2-textarea"
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          placeholder={`<table>
  <tr><th>Name</th><th>Age</th></tr>
  <tr><td>John</td><td>30</td></tr>
</table>`}
          rows={8}
        />
      </div>

      <button className="tb-v2-button" onClick={handleConvert}>
        Convert to JSON
      </button>

      {error && <p className="tb-v2-error">{error}</p>}

      {json && (
        <div className="tb-v2-form-group">
          <label className="tb-v2-label">JSON Output</label>
          <textarea
            className="tb-v2-textarea"
            value={json}
            readOnly
            rows={10}
          />
        </div>
      )}
    </div>
  );
}
