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
  for (const paragraph of paragraphs) {
    const isHeading = paragraph.length > 0 && paragraph.length < 70 && paragraph === paragraph.toUpperCase() && /[A-Z]/.test(paragraph);
    const useFont = isHeading ? boldFont : font;
    const lines = wrapLine(paragraph, useFont, FONT_SIZE, maxWidth);
    for (const line of lines) {
      if (y < MARGIN) newPage();
      page.drawText(line, { x: MARGIN, y, size: FONT_SIZE, font: useFont, color: rgb(0.1, 0.1, 0.1) });
      y -= LINE_HEIGHT;
    }
  }

  return pdfDoc.save();
}

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
  const [buyerName, setBuyerName] = useState('John Buyer');
  const [sellerName, setSellerName] = useState('Acme Sales LLC');
  const [itemDescription, setItemDescription] = useState('2019 Ford F-150, VIN 1FTFW1E5XKFA00000, including all standard accessories.');
  const [price, setPrice] = useState('15000');
  const [paymentTerms, setPaymentTerms] = useState('Full payment due at signing via cashier\'s check or wire transfer.');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [governingState, setGoverningState] = useState('California');
  const [copied, setCopied] = useState(false);

  const documentText = useMemo(() => {
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
    navigator.clipboard.writeText(documentText).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadTxt = () => {
    const blob = new Blob([documentText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'purchase-agreement.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPdf = async () => {
    const bytes = await textToPdf(documentText);
    const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'purchase-agreement.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tb-v2-tool-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="tb-v2-grid-2">
        <div>
          <label className="tb-v2-tool-label">Buyer Name</label>
          <input type="text" value={buyerName} onChange={e => setBuyerName(e.target.value)} className="tb-v2-input" />
        </div>
        <div>
          <label className="tb-v2-tool-label">Seller Name</label>
          <input type="text" value={sellerName} onChange={e => setSellerName(e.target.value)} className="tb-v2-input" />
        </div>
        <div>
          <label className="tb-v2-tool-label">Purchase Price (USD)</label>
          <input type="number" min={0} step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="tb-v2-input" />
        </div>
        <div>
          <label className="tb-v2-tool-label">Delivery Date</label>
          <input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} className="tb-v2-input" />
        </div>
        <div>
          <label className="tb-v2-tool-label">Governing State</label>
          <input type="text" value={governingState} onChange={e => setGoverningState(e.target.value)} className="tb-v2-input" />
        </div>
      </div>

      <div>
        <label className="tb-v2-tool-label">Item / Property Description</label>
        <textarea value={itemDescription} onChange={e => setItemDescription(e.target.value)} className="tb-v2-tool-textarea" />
      </div>

      <div>
        <label className="tb-v2-tool-label">Payment Terms</label>
        <textarea value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)} className="tb-v2-tool-textarea" style={{ minHeight: 60 }} />
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

      <p className="text-xs text-gray-500">
        This is a generic template and does not constitute legal advice. Consult a qualified attorney before relying on this document for a real transaction.
      </p>
    </div>
  );
}
