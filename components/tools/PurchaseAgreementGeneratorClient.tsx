'use client';
import UtilityDesignLayout from './UtilityDesignLayout';
import ToolExampleClearActions from './ToolExampleClearActions';

import { useMemo, useState, useRef, useEffect } from 'react';
import { documentPdf as textToPdf } from '@/lib/utility-design/document';
import { saveBlob } from '@/lib/utility-design/core';



function formatDate(iso: string): string {
  if (!iso) return '[Delivery Date]';
  const d = new Date(`${iso}T00:00:00`);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function todayLong(): string {
  return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function formatPrice(price: string): string {
  const n = parseFloat(price);
  if (isNaN(n)) return price || '[Purchase Price]';
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function PurchaseAgreementGeneratorClient() {
  const revision = useRef(0);
  useEffect(()=>()=>{revision.current++;},[]);
  const [exportError, setExportError] = useState('');
  const [exporting, setExporting] = useState(false);
  const [buyerName, setBuyerName] = useState('John Buyer');
  const [sellerName, setSellerName] = useState('Acme Sales LLC');
  const [itemDescription, setItemDescription] = useState('2019 Ford F-150, VIN 1FTFW1E5XKFA00000, including all standard accessories.');
  const [price, setPrice] = useState('15000');
  const [paymentTerms, setPaymentTerms] = useState('Full payment due at signing via cashier\'s check or wire transfer.');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [governingState, setGoverningState] = useState('California');
  const [copied, setCopied] = useState(false);

  const documentText = useMemo(() => {
    if (!(buyerName || sellerName || itemDescription)) return '';

    if (price && (!Number.isFinite(Number(price)) || Number(price) < 0)) return '';
    const buyer = buyerName.trim() || '[Buyer Name]';
    const seller = sellerName.trim() || '[Seller Name]';
    const item = itemDescription.trim() || '[Description of Item/Property]';
    const priceText = formatPrice(price);
    const terms = paymentTerms.trim() || '[Payment Terms]';
    const delivery = formatDate(deliveryDate);
    const state = governingState.trim() || '[Governing State]';

    return [
      'PURCHASE AGREEMENT',
      '',
      `This Purchase Agreement ("Agreement") is made as of ${todayLong()}, by and between ${seller} ("Seller") and ${buyer} ("Buyer"), collectively the "Parties".`,
      '',
      '1. DESCRIPTION OF GOODS',
      `Seller agrees to sell, and Buyer agrees to purchase, the following item(s)/property (the "Goods"): ${item}`,
      '',
      '2. PURCHASE PRICE AND PAYMENT',
      `The total purchase price for the Goods is ${priceText} (the "Purchase Price"). Payment terms: ${terms}`,
      '',
      '3. DELIVERY',
      `Seller shall deliver the Goods to Buyer on or before ${delivery}. Risk of loss and title to the Goods shall pass to Buyer upon delivery and receipt of full payment, unless otherwise agreed in writing by the Parties.`,
      '',
      '4. INSPECTION AND ACCEPTANCE',
      'Buyer shall have the right to inspect the Goods prior to or upon delivery. Acceptance of the Goods shall occur upon Buyer\'s receipt unless Buyer notifies Seller in writing of any defect or nonconformity within a reasonable time after delivery.',
      '',
      '5. WARRANTIES',
      'Seller represents and warrants that it has good and marketable title to the Goods, free and clear of all liens and encumbrances, and has the full right and authority to sell the Goods. EXCEPT AS EXPRESSLY SET FORTH HEREIN, THE GOODS ARE SOLD "AS IS" AND "WHERE IS," WITHOUT ANY OTHER WARRANTY OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.',
      '',
      '6. RISK OF LOSS',
      'Risk of loss or damage to the Goods shall remain with Seller until delivery to Buyer has been completed, at which point risk of loss shall transfer to Buyer.',
      '',
      '7. DEFAULT AND REMEDIES',
      'If either Party fails to perform its obligations under this Agreement, the non-defaulting Party shall be entitled to pursue all remedies available at law or in equity, including but not limited to specific performance, damages, and/or rescission of this Agreement.',
      '',
      '8. GOVERNING LAW',
      `This Agreement shall be governed by and construed in accordance with the laws of the State of ${state}, without regard to its conflict of laws principles.`,
      '',
      '9. ENTIRE AGREEMENT',
      'This Agreement constitutes the entire agreement between the Parties concerning the subject matter herein and supersedes all prior negotiations, understandings, and agreements, whether written or oral. This Agreement may only be modified by a written instrument signed by both Parties.',
      '',
      'IN WITNESS WHEREOF, the Parties have executed this Purchase Agreement as of the date first written above.',
      '',
      '',
      `SELLER: ${seller}`,
      '',
      'Signature: _______________________________',
      '',
      'Date: _______________________________',
      '',
      '',
      `BUYER: ${buyer}`,
      '',
      'Signature: _______________________________',
      '',
      'Date: _______________________________',
    ].join('\n');
  }, [buyerName, sellerName, itemDescription, price, paymentTerms, deliveryDate, governingState]);

  const copyText = () => {
    navigator.clipboard.writeText(documentText).then(() => setCopied(true), () => setCopied(false));
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadTxt = () => {
    const blob = new Blob([documentText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'purchase-agreement.txt';
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
    <div onChangeCapture={() => { revision.current++; setExporting(false); setExportError(''); }} className="tb-v2-tool-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ToolExampleClearActions onExample={() => { revision.current++; setExporting(false); setExportError(''); setBuyerName('John Buyer'); setSellerName('Acme Sales LLC'); setItemDescription('2019 Ford F-150, VIN 1FTFW1E5XKFA00000, including all standard accessories.'); setPrice('15000'); setPaymentTerms('Full payment due at signing via cashier\'s check or wire transfer.'); setDeliveryDate(''); setGoverningState('California'); }} onClear={() => { revision.current++; setExportError(''); setExporting(false); setBuyerName(''); setSellerName(''); setItemDescription(''); setPrice(''); setPaymentTerms(''); setDeliveryDate(''); setGoverningState(''); }}/>
      <div className="tb-v2-grid-2">
        <div>
      {exportError && <p role="alert">{exportError}</p>}
      {exporting && <p role="status">Preparing PDF…</p>}
      <p>Editable template draft. Verify all statements and applicable requirements before use; legal validity or compliance is not guaranteed.</p>
          <label className="tb-v2-tool-label">Buyer Name</label>
          <input maxLength={100000} aria-label="Buyer Name" type="text" value={buyerName} onChange={e => setBuyerName(e.target.value)} className="tb-v2-input" />
        </div>
        <div>
          <label className="tb-v2-tool-label">Seller Name</label>
          <input maxLength={100000} aria-label="Seller Name" type="text" value={sellerName} onChange={e => setSellerName(e.target.value)} className="tb-v2-input" />
        </div>
        <div>
          <label className="tb-v2-tool-label">Purchase Price (USD)</label>
          <input aria-label="Price" type="number" min={0} step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="tb-v2-input" />
        </div>
        <div>
          <label className="tb-v2-tool-label">Delivery Date</label>
          <input aria-label="Delivery Date" type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} className="tb-v2-input" />
        </div>
        <div>
          <label className="tb-v2-tool-label">Governing State</label>
          <input maxLength={100000} aria-label="Governing State" type="text" value={governingState} onChange={e => setGoverningState(e.target.value)} className="tb-v2-input" />
        </div>
      </div>

      <div>
        <label className="tb-v2-tool-label">Item / Property Description</label>
        <textarea maxLength={100000} aria-label="Item Description" value={itemDescription} onChange={e => setItemDescription(e.target.value)} className="tb-v2-tool-textarea" />
      </div>

      <div>
        <label className="tb-v2-tool-label">Payment Terms</label>
        <textarea maxLength={100000} aria-label="Payment Terms" value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)} className="tb-v2-tool-textarea" style={{ minHeight: 60 }} />
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

      <p className="text-xs text-gray-500">
        This is a generic template and does not constitute legal advice. Consult a qualified attorney before relying on this document for a real transaction.
      </p>
    </div>
  </UtilityDesignLayout>
  );
}
