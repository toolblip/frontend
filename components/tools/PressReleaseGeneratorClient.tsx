'use client';
import UtilityDesignLayout from './UtilityDesignLayout';
import ToolExampleClearActions from './ToolExampleClearActions';

import { useMemo, useState, useRef, useEffect } from 'react';
import { documentPdf as textToPdf } from '@/lib/utility-design/document';
import { saveBlob } from '@/lib/utility-design/core';



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
  const revision = useRef(0);
  useEffect(()=>()=>{revision.current++;},[]);
  const [exportError, setExportError] = useState('');
  const [exporting, setExporting] = useState(false);
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
    if (!(headline || body || companyName)) return '';

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
    navigator.clipboard.writeText(documentText).then(() => setCopied(true), () => setCopied(false));
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadTxt = () => {
    const blob = new Blob([documentText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'press-release.txt';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const downloadPdf = async () => {
    const id = revision.current; setExporting(true); setExportError('');
    try { const bytes = await textToPdf(documentText); if(id === revision.current) saveBlob(new Blob([bytes as BlobPart], {type:'application/pdf'}), 'document.pdf'); }
    catch(e) { if(id === revision.current) setExportError((e as Error).message); }
    finally { if(id === revision.current) setExporting(false); }
  };

  return (<UtilityDesignLayout>
    <div className="tb-v2-tool-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ToolExampleClearActions onExample={() => { revision.current++; setExporting(false); setExportError(''); setBody('Our team is opening a new workshop on July 1.'); setHeadline('Acme Corp Launches New Product Line'); setDateline('San Francisco, CA'); setDate(todayISO()); setCompanyName('Acme Corp'); setBoilerplate('Acme Corp is a company that builds useful things for its customers. Founded in 2020, Acme Corp is headquartered in San Francisco, CA.'); setContactName('Jane Doe'); setContactEmail('press@acmecorp.com'); setContactPhone('(555) 123-4567'); }} onClear={() => { revision.current++; setExportError(''); setExporting(false); setBody(''); setHeadline(''); setDateline(''); setDate(''); setCompanyName(''); setBoilerplate(''); setContactName(''); setContactEmail(''); setContactPhone(''); }}/>
      <div onChangeCapture={() => { revision.current++; setExporting(false); setExportError(''); }}>
      {exportError && <p role="alert">{exportError}</p>}
      {exporting && <p role="status">Preparing PDF…</p>}
      <p>Editable template draft. Verify all statements and applicable requirements before use; legal validity or compliance is not guaranteed.</p>
        <label className="tb-v2-tool-label">Headline</label>
        <input maxLength={100000} aria-label="Headline" type="text" value={headline} onChange={e => setHeadline(e.target.value)} className="tb-v2-input" />
      </div>

      <div className="tb-v2-grid-2">
        <div>
          <label className="tb-v2-tool-label">Dateline (City, State)</label>
          <input maxLength={100000} aria-label="Dateline" type="text" value={dateline} onChange={e => setDateline(e.target.value)} className="tb-v2-input" />
        </div>
        <div>
          <label className="tb-v2-tool-label">Date</label>
          <input aria-label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} className="tb-v2-input" />
        </div>
      </div>

      <div>
        <label className="tb-v2-tool-label">Body (separate paragraphs with a blank line)</label>
        <textarea maxLength={100000} aria-label="Body" value={body} onChange={e => setBody(e.target.value)} className="tb-v2-tool-textarea" style={{ minHeight: 140 }} />
      </div>

      <div className="tb-v2-grid-2">
        <div>
          <label className="tb-v2-tool-label">Company Name</label>
          <input maxLength={100000} aria-label="Company Name" type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="tb-v2-input" />
        </div>
        <div>
          <label className="tb-v2-tool-label">Media Contact Name</label>
          <input maxLength={100000} aria-label="Contact Name" type="text" value={contactName} onChange={e => setContactName(e.target.value)} className="tb-v2-input" />
        </div>
        <div>
          <label className="tb-v2-tool-label">Contact Email</label>
          <input aria-label="Contact Email" type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} className="tb-v2-input" />
        </div>
        <div>
          <label className="tb-v2-tool-label">Contact Phone</label>
          <input maxLength={100000} aria-label="Contact Phone" type="text" value={contactPhone} onChange={e => setContactPhone(e.target.value)} className="tb-v2-input" />
        </div>
      </div>

      <div>
        <label className="tb-v2-tool-label">Company Boilerplate / About</label>
        <textarea maxLength={100000} aria-label="Boilerplate" value={boilerplate} onChange={e => setBoilerplate(e.target.value)} className="tb-v2-tool-textarea" />
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Preview</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button disabled={!documentText} onClick={copyText} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>{copied ? 'Copied' : 'Copy'}</button>
          <button disabled={!documentText} onClick={downloadTxt} className="tb-v2-btn-sm">Download .txt</button>
          <button disabled={exporting || !documentText} onClick={downloadPdf} className="tb-v2-btn-sm">Download .pdf</button>
        </div>
      </div>
      <div className="tb-v2-tool-output-body">
        <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--f-mono)', fontSize: 12.5 }}>{documentText}</pre>
      </div>
    </div>
  </UtilityDesignLayout>
  );
}
