'use client';

import { useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE_TEXT = `# Getting Started

This introduction paragraph explains what the guide covers and why it matters to the reader before diving into specifics.

### Installation

Skipping straight to an H3 here to demonstrate a hierarchy warning in the validator output below.

## Configuration

- Set your API key
- Choose a region
- Restart the service

## Usage

1. Import the library
2. Call the client
3. Handle the response

# Conclusion

A second top-level heading appears here, which the validator should flag as an issue since a document should generally have only one H1.`;

interface Heading {
  level: number;
  text: string;
  line: number;
}

interface CheckResult {
  status: 'pass' | 'warn';
  label: string;
  detail: string;
}

function parseHeadings(lines: string[]): Heading[] {
  const headings: Heading[] = [];
  lines.forEach((line, i) => {
    const match = line.match(/^(#{1,6})\s+(.*)$/);
    if (match) {
      headings.push({ level: match[1].length, text: match[2].trim(), line: i + 1 });
    }
  });
  return headings;
}

function parseParagraphs(text: string): { text: string; wordCount: number }[] {
  const blocks = text.split(/\n\s*\n/);
  return blocks
    .map(b => b.trim())
    .filter(b => b && !/^#{1,6}\s/.test(b) && !/^\s*([-*]|\d+\.)\s/.test(b))
    .map(b => ({ text: b, wordCount: b.split(/\s+/).filter(Boolean).length }));
}

function hasListUsage(lines: string[]): boolean {
  return lines.some(line => /^\s*([-*]|\d+\.)\s+/.test(line));
}

function analyze(text: string) {
  if (!text.trim()) return null;
  const lines = text.split('\n');
  const headings = parseHeadings(lines);
  const paragraphs = parseParagraphs(text);
  const usesLists = hasListUsage(lines);

  const checks: CheckResult[] = [];

  const h1Count = headings.filter(h => h.level === 1).length;
  if (h1Count === 0) {
    checks.push({ status: 'warn', label: 'H1 heading', detail: 'No top-level (H1) heading found.' });
  } else if (h1Count > 1) {
    checks.push({ status: 'warn', label: 'H1 heading', detail: `Found ${h1Count} H1 headings — a document should generally have only one.` });
  } else {
    checks.push({ status: 'pass', label: 'H1 heading', detail: 'Exactly one H1 heading found.' });
  }

  let hierarchySkips = 0;
  for (let i = 1; i < headings.length; i++) {
    const prev = headings[i - 1];
    const curr = headings[i];
    if (curr.level > prev.level + 1) {
      hierarchySkips++;
    }
  }
  if (headings.length === 0) {
    checks.push({ status: 'warn', label: 'Heading hierarchy', detail: 'No headings found to validate.' });
  } else if (hierarchySkips > 0) {
    checks.push({ status: 'warn', label: 'Heading hierarchy', detail: `${hierarchySkips} place(s) where a heading level was skipped (e.g. H1 straight to H3).` });
  } else {
    checks.push({ status: 'pass', label: 'Heading hierarchy', detail: 'Heading levels increase without skipping.' });
  }

  const longParagraphs = paragraphs.filter(p => p.wordCount > 150);
  if (paragraphs.length === 0) {
    checks.push({ status: 'warn', label: 'Paragraph length', detail: 'No paragraph text found.' });
  } else if (longParagraphs.length > 0) {
    checks.push({ status: 'warn', label: 'Paragraph length', detail: `${longParagraphs.length} paragraph(s) exceed 150 words.` });
  } else {
    checks.push({ status: 'pass', label: 'Paragraph length', detail: `All ${paragraphs.length} paragraph(s) are under 150 words.` });
  }

  if (usesLists) {
    checks.push({ status: 'pass', label: 'List usage', detail: 'Bulleted or numbered lists were detected.' });
  } else {
    checks.push({ status: 'warn', label: 'List usage', detail: 'No bulleted or numbered lists detected — consider breaking up content where relevant.' });
  }

  return { headings, paragraphs, longParagraphs, usesLists, checks };
}

export default function TextStructureValidatorClient() {
  const [text, setText] = useState('');
  const result = useMemo(() => analyze(text), [text]);

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Enter Markdown-style text</span>
        <ToolExampleClearActions
          onExample={() => setText(EXAMPLE_TEXT)}
          onClear={() => setText('')}
          canClear={text.length > 0}
        />
      </div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={'Paste Markdown-style content with headings (# H1, ## H2 ...), paragraphs, and lists...'}
        className="tb-v2-tool-textarea"
        rows={12}
      />

      {!result ? (
        <div className="tb-v2-tool-output-body">
          <div className="tb-v2-empty">Paste Markdown-style content or load the example to validate headings, paragraphs, and lists.</div>
        </div>
      ) : (
        <>
      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Structure Report</span>
      </div>
      <div className="tb-v2-tool-output-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <div className="tb-v2-section-title" style={{ marginBottom: 8 }}>Checks</div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, listStyle: 'none', padding: 0, margin: 0 }}>
                {result.checks.map((check, i) => (
                  <li
                    key={i}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 10, borderBottom: '1px solid var(--line)', paddingBottom: 8 }}
                  >
                    <span className={`tb-v2-status ${check.status === 'pass' ? 'tb-v2-status-ok' : 'tb-v2-status-warn'}`}>
                      {check.status === 'pass' ? 'Pass' : 'Warn'}
                    </span>
                    <span style={{ fontSize: 13.5 }}>
                      <strong>{check.label}:</strong> {check.detail}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="tb-v2-section-title" style={{ marginBottom: 8 }}>Heading Outline</div>
              {result.headings.length === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--fg-3)' }}>No headings found.</p>
              ) : (
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 4, listStyle: 'none', padding: 0, margin: 0, fontFamily: 'var(--f-mono)', fontSize: 13 }}>
                  {result.headings.map((h, i) => (
                    <li key={i} style={{ paddingLeft: (h.level - 1) * 18, color: 'var(--fg-1)' }}>
                      <span style={{ color: 'var(--fg-3)' }}>H{h.level}</span> {h.text}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="tb-v2-stats-grid" style={{ padding: 0, border: 0, background: 'transparent' }}>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{result.headings.length}</span>
                <span className="tb-v2-stat-pill-lbl">Headings</span>
              </div>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{result.paragraphs.length}</span>
                <span className="tb-v2-stat-pill-lbl">Paragraphs</span>
              </div>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{result.longParagraphs.length}</span>
                <span className="tb-v2-stat-pill-lbl">Long paragraphs</span>
              </div>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{result.usesLists ? 'Yes' : 'No'}</span>
                <span className="tb-v2-stat-pill-lbl">Uses lists</span>
              </div>
            </div>
          </div>
      </div>
        </>
      )}
    </div>
  );
}
