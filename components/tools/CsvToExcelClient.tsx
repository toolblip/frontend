'use client';

import { useState, useMemo } from 'react';

const EXAMPLE = `Name,Email,Role\nAda Lovelace,ada@example.com,Engineer\nGrace Hopper,grace@example.com,Admiral`;

function parseCsv(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const ch = csv[i];
    if (inQuotes) {
      if (ch === '"') {
        if (csv[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (ch !== '\r') {
      field += ch;
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter(r => r.some(c => c.trim() !== ''));
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildExcelDocument(rows: string[][]): string {
  const tableRows = rows
    .map((row, i) => {
      const tag = i === 0 ? 'th' : 'td';
      const cells = row.map(cell => `<${tag}>${escapeHtml(cell)}</${tag}>`).join('');
      return `<tr>${cells}</tr>`;
    })
    .join('\n');

  return `<html xmlns:x="urn:schemas-microsoft-com:office:excel">
<head>
<meta charset="UTF-8">
<!--[if gte mso 9]><xml>
<x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
<x:Name>Sheet1</x:Name>
<x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
</x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook>
</xml><![endif]-->
</head>
<body>
<table border="1">
${tableRows}
</table>
</body>
</html>`;
}

export default function CsvToExcelClient() {
  const [input, setInput] = useState(EXAMPLE);

  const rows = useMemo(() => parseCsv(input), [input]);

  const loadExample = () => setInput(EXAMPLE);

  const download = () => {
    if (rows.length === 0) return;
    const doc = buildExcelDocument(rows);
    const blob = new Blob([doc], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'converted.xls';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">CSV Input</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Name,Email,Role&#10;Ada Lovelace,ada@example.com,Engineer"
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Preview</span>
        <button type="button" onClick={download} disabled={rows.length === 0} className="tb-v2-btn tb-v2-btn-primary">
          Download .xls
        </button>
      </div>

      {rows.length === 0 ? (
        <p className="tb-v2-empty">Paste CSV data above to preview and download it as an Excel file.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 13 }}>
            <thead>
              <tr>
                {rows[0].map((cell, i) => (
                  <th key={i} style={{ border: '1px solid var(--line)', padding: '6px 10px', textAlign: 'left', background: 'var(--bg-subtle, #f5f5f5)' }}>
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(1).map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} style={{ border: '1px solid var(--line)', padding: '6px 10px' }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
