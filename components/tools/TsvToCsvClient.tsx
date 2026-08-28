'use client';

import { useCallback, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE_CSV = `name,age,city
John,30,NYC
Jane,25,LA`;

const EXAMPLE_TSV = `name\tage\tcity
John\t30\tNYC
Jane\t25\tLA`;

function splitCsvLine(line: string): string[] {
  const cells: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === ',' && !inQuotes) {
      cells.push(cur);
      cur = '';
      continue;
    }
    cur += ch;
  }
  cells.push(cur);
  return cells;
}

function escapeCsvCell(cell: string): string {
  if (/[",\n]/.test(cell)) return `"${cell.replace(/"/g, '""')}"`;
  return cell;
}

function tsvToCsv(input: string): string {
  if (!input) return '';
  return input
    .split('\n')
    .map((line) => line.split('\t').map(escapeCsvCell).join(','))
    .join('\n');
}

function csvToTsv(input: string): string {
  if (!input) return '';
  return input
    .split('\n')
    .map((line) => splitCsvLine(line).join('\t'))
    .join('\n');
}

export default function TsvToCsvClient() {
  const [csv, setCsv] = useState('');
  const [tsv, setTsv] = useState('');
  const [copiedCsv, setCopiedCsv] = useState(false);
  const [copiedTsv, setCopiedTsv] = useState(false);

  const applyCsv = useCallback((text: string) => {
    setCsv(text);
    setTsv(csvToTsv(text));
  }, []);

  const applyTsv = useCallback((text: string) => {
    setTsv(text);
    setCsv(tsvToCsv(text));
  }, []);

  const clearAll = useCallback(() => {
    setCsv('');
    setTsv('');
  }, []);

  const copyCsv = useCallback(() => {
    if (!csv) return;
    navigator.clipboard.writeText(csv).catch(() => {});
    setCopiedCsv(true);
    setTimeout(() => setCopiedCsv(false), 1500);
  }, [csv]);

  const copyTsv = useCallback(() => {
    if (!tsv) return;
    navigator.clipboard.writeText(tsv).catch(() => {});
    setCopiedTsv(true);
    setTimeout(() => setCopiedTsv(false), 1500);
  }, [tsv]);

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="tb-v2-tool-label">CSV ↔ TSV</span>
        <ToolExampleClearActions
          onExample={() => applyCsv(EXAMPLE_CSV)}
          onClear={clearAll}
          canClear={csv.length > 0 || tsv.length > 0}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y divide-[var(--line)] md:divide-y-0 md:divide-x">
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 280 }}>
          <div className="tb-v2-tool-input-head">
            <span className="tb-v2-tool-label">CSV</span>
            <button
              type="button"
              onClick={copyCsv}
              disabled={!csv}
              className={`tb-v2-copy-btn ${copiedCsv ? 'done' : ''}`}
            >
              {copiedCsv ? 'Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            value={csv}
            onChange={(e) => applyCsv(e.target.value)}
            placeholder={EXAMPLE_CSV}
            className="tb-v2-tool-textarea"
            style={{
              flex: 1,
              minHeight: 220,
              fontFamily: 'var(--f-mono)',
              border: 'none',
              borderRadius: 0,
              resize: 'vertical',
            }}
            aria-label="CSV input"
            spellCheck={false}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 280 }}>
          <div className="tb-v2-tool-input-head">
            <span className="tb-v2-tool-label">TSV</span>
            <button
              type="button"
              onClick={copyTsv}
              disabled={!tsv}
              className={`tb-v2-copy-btn ${copiedTsv ? 'done' : ''}`}
            >
              {copiedTsv ? 'Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            value={tsv}
            onChange={(e) => applyTsv(e.target.value)}
            placeholder={EXAMPLE_TSV}
            className="tb-v2-tool-textarea"
            style={{
              flex: 1,
              minHeight: 220,
              fontFamily: 'var(--f-mono)',
              border: 'none',
              borderRadius: 0,
              resize: 'vertical',
            }}
            aria-label="TSV input"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
