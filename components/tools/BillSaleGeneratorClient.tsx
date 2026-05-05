'use client';

import { useState } from 'react';

interface FormData {
  sellerName: string;
  sellerAddress: string;
  sellerCity: string;
  buyerName: string;
  buyerAddress: string;
  buyerCity: string;
  itemDescription: string;
  salePrice: string;
  taxRate: string;
  date: string;
  paymentMethod: string;
  soldAsIs: boolean;
  warranty: boolean;
  additionalTerms: string;
}

const initial: FormData = {
  sellerName: '',
  sellerAddress: '',
  sellerCity: '',
  buyerName: '',
  buyerAddress: '',
  buyerCity: '',
  itemDescription: '',
  salePrice: '',
  taxRate: '0',
  date: new Date().toISOString().split('T')[0],
  paymentMethod: 'Cash',
  soldAsIs: false,
  warranty: true,
  additionalTerms: '',
};

export default function BillSaleGeneratorClient() {
  const [form, setForm] = useState<FormData>(initial);
  const [generated, setGenerated] = useState(false);

  const set = (key: keyof FormData, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const subtotal = parseFloat(form.salePrice) || 0;
  const tax = subtotal * (parseFloat(form.taxRate) || 0) / 100;
  const total = subtotal + tax;

  const generate = () => setGenerated(true);

  const download = () => {
    window.print();
  };

  const reset = () => {
    setForm(initial);
    setGenerated(false);
  };

  const Input = ({ id, label, placeholder, value, type = 'text' }: { id: keyof FormData; label: string; placeholder: string; value: string; type?: string }) => (
    <div>
      <label className="tb-v2-tool-label" style={{ display: 'block', marginBottom: '0.25rem' }}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => set(id, e.target.value)}
        placeholder={placeholder}
        className="tb-v2-tool-input"
        aria-label={label}
      />
    </div>
  );

  const Textarea = ({ id, label, placeholder, value }: { id: keyof FormData; label: string; placeholder: string; value: string }) => (
    <div>
      <label className="tb-v2-tool-label" style={{ display: 'block', marginBottom: '0.25rem' }}>{label}</label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => set(id, e.target.value)}
        placeholder={placeholder}
        className="tb-v2-tool-textarea"
        style={{ minHeight: '60px' }}
        aria-label={label}
      />
    </div>
  );

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Bill of Sale Details</span>
      </div>

      <div className="tb-v2-grid-2" style={{ gap: '0.75rem', marginTop: '0.75rem' }}>
        <Input id="date" label="Date of Sale" value={form.date} type="date" placeholder="" />
        <Input id="paymentMethod" label="Payment Method" value={form.paymentMethod} placeholder="Cash, Check, etc." />
      </div>

      <div style={{ marginTop: '1rem' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--tb-text)' }}>Seller Information</h3>
        <div className="tb-v2-grid-2" style={{ gap: '0.5rem' }}>
          <Input id="sellerName" label="Seller Name" value={form.sellerName} placeholder="Full legal name" />
          <Input id="sellerAddress" label="Address" value={form.sellerAddress} placeholder="Street address" />
          <Input id="sellerCity" label="City, State, ZIP" value={form.sellerCity} placeholder="City, State, ZIP" />
        </div>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--tb-text)' }}>Buyer Information</h3>
        <div className="tb-v2-grid-2" style={{ gap: '0.5rem' }}>
          <Input id="buyerName" label="Buyer Name" value={form.buyerName} placeholder="Full legal name" />
          <Input id="buyerAddress" label="Address" value={form.buyerAddress} placeholder="Street address" />
          <Input id="buyerCity" label="City, State, ZIP" value={form.buyerCity} placeholder="City, State, ZIP" />
        </div>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <Textarea id="itemDescription" label="Item Description" value={form.itemDescription} placeholder="Year, Make, Model, VIN / Serial Number, Condition, etc." />
      </div>

      <div className="tb-v2-grid-2" style={{ gap: '0.75rem', marginTop: '0.75rem' }}>
        <Input id="salePrice" label="Sale Price ($)" value={form.salePrice} placeholder="0.00" />
        <Input id="taxRate" label="Tax Rate (%)" value={form.taxRate} placeholder="0" />
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={form.soldAsIs} onChange={(e) => set('soldAsIs', e.target.checked)} aria-label="Sold as-is" />
          <span className="tb-v2-tool-label" style={{ marginBottom: 0 }}>Sold As-Is (no warranties)</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={form.warranty} onChange={(e) => set('warranty', e.target.checked)} aria-label="With warranty" />
          <span className="tb-v2-tool-label" style={{ marginBottom: 0 }}>Includes implied warranty</span>
        </label>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <Textarea id="additionalTerms" label="Additional Terms (optional)" value={form.additionalTerms} placeholder="Any additional terms or conditions..." />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <button type="button" onClick={generate} className="tb-v2-btn" style={{ flex: 1 }}>
          Generate Bill of Sale
        </button>
        <button type="button" onClick={reset} className="tb-v2-btn-secondary">
          Reset
        </button>
      </div>

      {generated && (
        <div style={{ marginTop: '1rem' }}>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Bill of Sale Document</span>
            <button type="button" onClick={download} className="tb-v2-copy-btn">
              Print / Save PDF
            </button>
          </div>
          <div className="tb-v2-tool-output-body" id="bill-of-sale-document" style={{ background: '#fff', color: '#000', padding: '2rem', borderRadius: '0.5rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem', borderBottom: '2px solid #000', paddingBottom: '1rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>BILL OF SALE</h1>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem' }}>Document generated via Toolblip</p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong>Date of Sale:</strong> {form.date}<br />
              <strong>Payment Method:</strong> {form.paymentMethod}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.25rem', borderBottom: '1px solid #ccc', paddingBottom: '0.25rem' }}>SELLER</h3>
                <p style={{ margin: 0 }}>{form.sellerName || '_________________'}</p>
                <p style={{ margin: 0 }}>{form.sellerAddress || '_________________'}</p>
                <p style={{ margin: 0 }}>{form.sellerCity || '_________________'}</p>
              </div>
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.25rem', borderBottom: '1px solid #ccc', paddingBottom: '0.25rem' }}>BUYER</h3>
                <p style={{ margin: 0 }}>{form.buyerName || '_________________'}</p>
                <p style={{ margin: 0 }}>{form.buyerAddress || '_________________'}</p>
                <p style={{ margin: 0 }}>{form.buyerCity || '_________________'}</p>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '0.25rem', borderBottom: '1px solid #ccc', paddingBottom: '0.25rem' }}>ITEM DESCRIPTION</h3>
              <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{form.itemDescription || '_________________'}</p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '0.25rem', borderBottom: '1px solid #ccc', paddingBottom: '0.25rem' }}>FINANCIAL TERMS</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '200px' }}>
                <span>Sale Price:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {tax > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '200px' }}>
                  <span>Tax ({form.taxRate}%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '200px', fontWeight: 700, borderTop: '1px solid #000', paddingTop: '0.25rem', marginTop: '0.25rem' }}>
                <span>TOTAL:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <p>✅ Seller acknowledges receipt of payment in full.</p>
              {form.warranty && <p>✅ This sale includes an implied warranty of merchantability.</p>}
              {form.soldAsIs && <p>⚠️ This item is sold AS-IS with no warranties express or implied.</p>}
            </div>

            {form.additionalTerms && (
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '0.25rem', borderBottom: '1px solid #ccc', paddingBottom: '0.25rem' }}>ADDITIONAL TERMS</h3>
                <p style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '0.9em' }}>{form.additionalTerms}</p>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
              <div>
                <div style={{ borderBottom: '1px solid #000', marginBottom: '0.25rem' }} />
                <p style={{ margin: 0, fontSize: '0.8rem' }}>Seller Signature</p>
                <p style={{ margin: 0, fontSize: '0.8rem' }}>{form.sellerName}</p>
              </div>
              <div>
                <div style={{ borderBottom: '1px solid #000', marginBottom: '0.25rem' }} />
                <p style={{ margin: 0, fontSize: '0.8rem' }}>Buyer Signature</p>
                <p style={{ margin: 0, fontSize: '0.8rem' }}>{form.buyerName}</p>
              </div>
            </div>

            <p style={{ marginTop: '1.5rem', fontSize: '0.7rem', textAlign: 'center', color: '#666' }}>
              This document is provided for informational purposes only and does not constitute legal advice.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
