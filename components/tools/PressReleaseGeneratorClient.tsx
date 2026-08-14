'use client';

import { useMemo, useState } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN = 56;
const FONT_SIZE = 10.5;
const LINE_HEIGHT = 14;

function wrapLine(text: string, font: import('pdf-lib').PDFFont, size: number, maxWidth: number): string[] {
  if (text === '') return [''];
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

async function textToPdf(text: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const maxWidth = PAGE_WIDTH - MARGIN * 2;

  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  const newPage = () => {
    page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    y = PAGE_HEIGHT - MARGIN;
  };

  const paragraphs = text.split('\n');
  paragraphs.forEach((paragraph, idx) => {
    const isHeading = idx === 0 || paragraph === 'FOR IMMEDIATE RELEASE' || paragraph === '###' || (paragraph.startsWith('About '));
    const useFont = isHeading ? boldFont : font;
    const lines = wrapLine(paragraph, useFont, FONT_SIZE, maxWidth);
    for (const line of lines) {
      if (y < MARGIN) newPage();
      page.drawText(line, { x: MARGIN, y, size: FONT_SIZE, font: useFont, color: rgb(0.1, 0.1, 0.1) });
      y -= LINE_HEIGHT;
    }
  });

  return pdfDoc.save();
}

function formatDate(iso: string): string {
  if (!iso) return '[Date]';
  const d = new Date(`${iso}T00:00:00`);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function PressReleaseGeneratorClient() {
  const [headline, setHeadline] = useState('Acme Corp Launches New Product Line');
  const [dateline, setDateline] = useState('San Francisco, CA');
  const [date, setDate] = useState(todayISO());
  const [body, setBody] = useState(
    'Acme Corp today announced the launch of its new product line, designed to help customers save time and money.\n\nThe new offering includes several features requested by long-time customers, and will be available starting next month.'
  );
  const [companyName, setCompanyName] = useState('Acme Corp');
  const [boilerplate, setBoilerplate] = useState('Acme Corp is a company that builds useful things for its customers. Founded in 2020, Acme Corp is headquartered in San Francisco, CA.');
  const [contactName, setContactName] = useState('Jane Doe');
  const [contactEmail, setContactEmail] = useState('press@acmecorp.com');
  const [contactPhone, setContactPhone] = useState('(555) 123-4567');
  const [copied, setCopied] = useState(false);

  const documentText = useMemo(() => {
    const paragraphs = body.split(/\n\s*\n/).map(p => p.replace(/\n/g, ' ').trim()).filter(Boolean);
    const [lead, ...rest] = paragraphs.length ? paragraphs : ['[Body of the press release goes here.]'];

    const lines: string[] = [];
    lines.push('FOR IMMEDIATE RELEASE');
    lines.push('');
    lines.push(headline.trim() || '[Headline]');
    lines.push('');
    lines.push(`${dateline.trim() || '[City, State]'} — ${formatDate(date)} — ${lead}`);
    for (const p of rest) {
      lines.push('');
      lines.push(p);
    }
    lines.push('');
    lines.push('###');
    lines.push('');
    lines.push(`About ${companyName.trim() || '[Company Name]'}`);
    lines.push(boilerplate.trim() || '[Company boilerplate goes here.]');
    lines.push('');
    lines.push('Media Contact:');
    lines.push(contactName.trim() || '[Contact Name]');
    if (contactEmail.trim()) lines.push(contactEmail.trim());
    if (contactPhone.trim()) lines.push(contactPhone.trim());

    return lines.join('\n');
  }, [headline, dateline, date, body, companyName, boilerplate, contactName, contactEmail, contactPhone]);

  const copyText = () => {
    navigator.clipboard.writeText(documentText).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadTxt = () => {
    const blob = new Blob([documentText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'press-release.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPdf = async () => {
    const bytes = await textToPdf(documentText);
    const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'press-release.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tb-v2-tool-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label className="tb-v2-tool-label">Headline</label>
        <input type="text" value={headline} onChange={e => setHeadline(e.target.value)} className="tb-v2-input" />
      </div>

      <div className="tb-v2-grid-2">
        <div>
          <label className="tb-v2-tool-label">Dateline (City, State)</label>
          <input type="text" value={dateline} onChange={e => setDateline(e.target.value)} className="tb-v2-input" />
        </div>
        <div>
          <label className="tb-v2-tool-label">Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="tb-v2-input" />
        </div>
      </div>

      <div>
        <label className="tb-v2-tool-label">Body (separate paragraphs with a blank line)</label>
        <textarea value={body} onChange={e => setBody(e.target.value)} className="tb-v2-tool-textarea" style={{ minHeight: 140 }} />
      </div>

      <div className="tb-v2-grid-2">
        <div>
          <label className="tb-v2-tool-label">Company Name</label>
          <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="tb-v2-input" />
        </div>
        <div>
          <label className="tb-v2-tool-label">Media Contact Name</label>
          <input type="text" value={contactName} onChange={e => setContactName(e.target.value)} className="tb-v2-input" />
        </div>
        <div>
          <label className="tb-v2-tool-label">Contact Email</label>
          <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} className="tb-v2-input" />
        </div>
        <div>
          <label className="tb-v2-tool-label">Contact Phone</label>
          <input type="text" value={contactPhone} onChange={e => setContactPhone(e.target.value)} className="tb-v2-input" />
        </div>
      </div>

      <div>
        <label className="tb-v2-tool-label">Company Boilerplate / About</label>
        <textarea value={boilerplate} onChange={e => setBoilerplate(e.target.value)} className="tb-v2-tool-textarea" />
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Preview</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={copyText} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>{copied ? 'Copied' : 'Copy'}</button>
          <button onClick={downloadTxt} className="tb-v2-btn-sm">Download .txt</button>
          <button onClick={downloadPdf} className="tb-v2-btn-sm">Download .pdf</button>
        </div>
      </div>
      <div className="tb-v2-tool-output-body">
        <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--f-mono)', fontSize: 12.5 }}>{documentText}</pre>
      </div>
    </div>
  );
}
