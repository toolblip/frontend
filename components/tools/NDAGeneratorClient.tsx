'use client';
import UtilityDesignLayout from './UtilityDesignLayout';
import ToolExampleClearActions from './ToolExampleClearActions';

import { useMemo, useState, useRef, useEffect } from 'react';
import { documentPdf as textToPdf } from '@/lib/utility-design/document';
import { saveBlob } from '@/lib/utility-design/core';



function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function NDAGeneratorClient() {
  const revision = useRef(0);
  useEffect(()=>()=>{revision.current++;},[]);
  const [exportError, setExportError] = useState('');
  const [exporting, setExporting] = useState(false);
  const [discloser, setDiscloser] = useState('Acme Corp.');
  const [receiver, setReceiver] = useState('Jane Doe');
  const [effectiveDate, setEffectiveDate] = useState(todayISO());
  const [purpose, setPurpose] = useState('evaluating a potential business relationship');
  const [termYears, setTermYears] = useState(2);
  const [governingState, setGoverningState] = useState('Delaware');
  const [mutual, setMutual] = useState(true);
  const [copied, setCopied] = useState(false);

  const documentText = useMemo(() => {
    if (!(discloser || receiver || purpose)) return '';

    if (!Number.isInteger(termYears) || termYears < 1 || termYears > 100) return '';
    const partyA = discloser.trim() || '[Disclosing Party]';
    const partyB = receiver.trim() || '[Receiving Party]';
    const date = effectiveDate || '[Effective Date]';
    const purposeText = purpose.trim() || '[Purpose]';
    const state = governingState.trim() || '[Governing State]';

    const recitals = mutual
      ? `WHEREAS, ${partyA} and ${partyB} (each a "Party" and collectively the "Parties") wish to explore, participate in, and/or engage in ${purposeText} (the "Purpose"), and in connection with the Purpose, each Party may disclose to the other certain confidential and proprietary information;`
      : `WHEREAS, ${partyA} ("Disclosing Party") wishes to disclose certain confidential and proprietary information to ${partyB} ("Receiving Party") in connection with ${purposeText} (the "Purpose"), and Receiving Party agrees to receive and hold such information in confidence on the terms set forth below;`;

    const definitionClause = mutual
      ? `"Confidential Information" means any and all non-public information disclosed by either Party (the "Disclosing Party") to the other Party (the "Receiving Party"), whether disclosed orally, in writing, electronically, or by any other means, and whether or not marked as confidential, including but not limited to business plans, financial information, technical data, trade secrets, know-how, product designs, customer lists, and any other information related to the Purpose.`
      : `"Confidential Information" means any and all non-public information disclosed by Disclosing Party to Receiving Party, whether disclosed orally, in writing, electronically, or by any other means, and whether or not marked as confidential, including but not limited to business plans, financial information, technical data, trade secrets, know-how, product designs, customer lists, and any other information related to the Purpose.`;

    const obligationsClause = mutual
      ? `Each Receiving Party agrees to: (a) hold the other Party's Confidential Information in strict confidence; (b) not disclose such Confidential Information to any third party without the prior written consent of the Disclosing Party; (c) use such Confidential Information solely for the Purpose; and (d) protect such Confidential Information using at least the same degree of care it uses to protect its own confidential information of similar nature, but in no event less than a reasonable degree of care.`
      : `Receiving Party agrees to: (a) hold the Confidential Information in strict confidence; (b) not disclose the Confidential Information to any third party without the prior written consent of Disclosing Party; (c) use the Confidential Information solely for the Purpose; and (d) protect the Confidential Information using at least the same degree of care it uses to protect its own confidential information, but in no event less than a reasonable degree of care.`;

    return [
      'NON-DISCLOSURE AGREEMENT',
      '',
      `This Non-Disclosure Agreement ("Agreement") is entered into as of ${date} (the "Effective Date"), by and between ${partyA} and ${partyB}.`,
      '',
      recitals,
      '',
      'NOW, THEREFORE, in consideration of the mutual covenants contained herein and other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the Parties agree as follows:',
      '',
      '1. DEFINITION OF CONFIDENTIAL INFORMATION',
      definitionClause,
      '',
      '2. OBLIGATIONS OF RECEIVING PARTY',
      obligationsClause,
      '',
      '3. EXCLUSIONS',
      'Confidential Information does not include information that: (a) is or becomes publicly available through no fault of the Receiving Party; (b) was rightfully known to the Receiving Party prior to disclosure; (c) is rightfully received from a third party without breach of any confidentiality obligation; (d) is independently developed without use of or reference to the Confidential Information; or (e) is required to be disclosed by law, regulation, or court order, provided the Receiving Party gives prompt written notice to the Disclosing Party where legally permitted so as to allow the Disclosing Party to seek a protective order.',
      '',
      '4. TERM',
      `This Agreement shall remain in effect for a period of ${termYears} year(s) from the Effective Date, unless earlier terminated by either Party upon written notice. The confidentiality obligations set forth herein shall survive termination or expiration of this Agreement for a period of ${termYears} year(s), or until the Confidential Information no longer qualifies as confidential, whichever is longer.`,
      '',
      '5. RETURN OF MATERIALS',
      'Upon written request of the Disclosing Party or upon termination of this Agreement, the Receiving Party shall promptly return or destroy all documents, materials, and copies thereof containing Confidential Information, and certify such destruction if requested.',
      '',
      '6. NO LICENSE OR OWNERSHIP RIGHTS',
      'Nothing in this Agreement shall be construed as granting any rights, by license or otherwise, to any Confidential Information disclosed hereunder, except as necessary to evaluate or carry out the Purpose. All Confidential Information remains the property of the Disclosing Party.',
      '',
      '7. REMEDIES',
      'The Parties acknowledge that unauthorized use or disclosure of Confidential Information may cause irreparable harm for which monetary damages alone would be an inadequate remedy, and that the non-breaching Party shall be entitled to seek injunctive relief in addition to any other remedies available at law or in equity.',
      '',
      '8. GOVERNING LAW',
      `This Agreement shall be governed by and construed in accordance with the laws of the State of ${state}, without regard to its conflict of laws principles.`,
      '',
      '9. ENTIRE AGREEMENT',
      'This Agreement constitutes the entire agreement between the Parties with respect to its subject matter and supersedes all prior agreements, discussions, and understandings, whether written or oral, relating thereto. This Agreement may only be amended in a writing signed by both Parties.',
      '',
      'IN WITNESS WHEREOF, the Parties have executed this Non-Disclosure Agreement as of the Effective Date.',
      '',
      '',
      `${mutual ? 'PARTY A' : 'DISCLOSING PARTY'}: ${partyA}`,
      '',
      'Signature: _______________________________',
      '',
      'Name: _______________________________',
      '',
      'Date: _______________________________',
      '',
      '',
      `${mutual ? 'PARTY B' : 'RECEIVING PARTY'}: ${partyB}`,
      '',
      'Signature: _______________________________',
      '',
      'Name: _______________________________',
      '',
      'Date: _______________________________',
    ].join('\n');
  }, [discloser, receiver, effectiveDate, purpose, termYears, governingState, mutual]);

  const copyText = () => {
    navigator.clipboard.writeText(documentText).then(() => setCopied(true), () => setCopied(false));
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadTxt = () => {
    const blob = new Blob([documentText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nda.txt';
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
      <ToolExampleClearActions onExample={() => { revision.current++; setExporting(false); setExportError(''); setDiscloser('Acme Corp.'); setReceiver('Jane Doe'); setEffectiveDate(todayISO()); setPurpose('evaluating a potential business relationship'); setTermYears(2); setGoverningState('Delaware'); setMutual(true); }} onClear={() => { revision.current++; setExportError(''); setExporting(false); setDiscloser(''); setReceiver(''); setEffectiveDate(''); setPurpose(''); setTermYears(1); setGoverningState(''); setMutual(false); }}/>
      <label className="tb-v2-checkbox-row" style={{ width: 'fit-content' }}>
        <input aria-label="Mutual" type="checkbox" checked={mutual} onChange={e => setMutual(e.target.checked)} />
        Mutual NDA (both parties disclose confidential information)
      </label>

      <div className="tb-v2-grid-2">
        <div onChangeCapture={() => { revision.current++; setExporting(false); setExportError(''); }}>
      {exportError && <p role="alert">{exportError}</p>}
      {exporting && <p role="status">Preparing PDF…</p>}
      <p>Editable template draft. Verify all statements and applicable requirements before use; legal validity or compliance is not guaranteed.</p>
          <label className="tb-v2-tool-label">{mutual ? 'Party A' : 'Disclosing Party'} Name</label>
          <input maxLength={100000} aria-label="Discloser" type="text" value={discloser} onChange={e => setDiscloser(e.target.value)} className="tb-v2-input" />
        </div>
        <div>
          <label className="tb-v2-tool-label">{mutual ? 'Party B' : 'Receiving Party'} Name</label>
          <input maxLength={100000} aria-label="Receiver" type="text" value={receiver} onChange={e => setReceiver(e.target.value)} className="tb-v2-input" />
        </div>
        <div>
          <label className="tb-v2-tool-label">Effective Date</label>
          <input aria-label="Effective Date" type="date" value={effectiveDate} onChange={e => setEffectiveDate(e.target.value)} className="tb-v2-input" />
        </div>
        <div>
          <label className="tb-v2-tool-label">Term (years)</label>
          <input aria-label="Term Years" type="number" min={1} value={termYears} onChange={e => setTermYears(Number(e.target.value) || 1)} className="tb-v2-input" />
        </div>
        <div>
          <label className="tb-v2-tool-label">Governing State/Jurisdiction</label>
          <input maxLength={100000} aria-label="Governing State" type="text" value={governingState} onChange={e => setGoverningState(e.target.value)} className="tb-v2-input" />
        </div>
      </div>

      <div>
        <label className="tb-v2-tool-label">Purpose / Confidential Information Description</label>
        <textarea maxLength={100000} aria-label="Purpose"
          value={purpose}
          onChange={e => setPurpose(e.target.value)}
          className="tb-v2-tool-textarea"
          placeholder="e.g. evaluating a potential business partnership"
        />
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Document Preview</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button disabled={!documentText} onClick={copyText} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>{copied ? 'Copied' : 'Copy'}</button>
          <button disabled={!documentText} onClick={downloadTxt} className="tb-v2-btn-sm">Download .txt</button>
          <button disabled={exporting || !documentText} onClick={downloadPdf} className="tb-v2-btn-sm">Download .pdf</button>
        </div>
      </div>
      <div className="tb-v2-tool-output-body">
        <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--f-mono)', fontSize: 12.5 }}>{documentText}</pre>
      </div>

      <p className="text-xs text-gray-500">
        This is a generic template provided for convenience and does not constitute legal advice. Consult a qualified attorney before relying on this document.
      </p>
    </div>
  </UtilityDesignLayout>
  );
}
