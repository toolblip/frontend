'use client';
import UtilityDesignLayout from './UtilityDesignLayout';
import ToolExampleClearActions from './ToolExampleClearActions';

import { useMemo, useState, useRef, useEffect } from 'react';
import { documentPdf as textToPdf } from '@/lib/utility-design/document';
import { saveBlob } from '@/lib/utility-design/core';



function todayLong(): string {
  return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function PrivacyPolicyGeneratorClient() {
  const revision = useRef(0);
  useEffect(()=>()=>{revision.current++;},[]);
  const [exportError, setExportError] = useState('');
  const [exporting, setExporting] = useState(false);
  const [companyName, setCompanyName] = useState('Acme Corp');
  const [websiteUrl, setWebsiteUrl] = useState('https://www.example.com');
  const [contactEmail, setContactEmail] = useState('privacy@example.com');
  const [collectsAnalytics, setCollectsAnalytics] = useState(true);
  const [collectsNewsletter, setCollectsNewsletter] = useState(true);
  const [collectsContactForm, setCollectsContactForm] = useState(true);
  const [collectsPayment, setCollectsPayment] = useState(false);
  const [thirdPartyServices, setThirdPartyServices] = useState('Google Analytics, Stripe');
  const [applyGdpr, setApplyGdpr] = useState(true);
  const [applyCcpa, setApplyCcpa] = useState(true);
  const [copied, setCopied] = useState(false);

  const documentText = useMemo(() => {
    if (!(companyName || websiteUrl || contactEmail)) return '';

    const name = companyName.trim() || '[Company Name]';
    const url = websiteUrl.trim() || '[Website URL]';
    const email = contactEmail.trim() || '[Contact Email]';
    const services = thirdPartyServices.trim();

    const collectedItems: string[] = [];
    if (collectsAnalytics) collectedItems.push('Usage data and analytics information (such as pages visited, time on site, browser type, and device information) collected automatically via cookies and similar tracking technologies.');
    if (collectsNewsletter) collectedItems.push('Email address and name, when you subscribe to our newsletter or mailing list.');
    if (collectsContactForm) collectedItems.push('Information you submit through contact or feedback forms, such as your name, email address, and message content.');
    if (collectsPayment) collectedItems.push('Billing information (such as name, billing address, and payment card details), which is processed by our third-party payment processor and is not stored directly on our servers.');
    if (collectedItems.length === 0) collectedItems.push('We do not knowingly collect personal information beyond what is necessary to operate the Website.');

    const usesItems: string[] = ['Provide, operate, and maintain the Website;', 'Improve, personalize, and expand the Website;'];
    if (collectsAnalytics) usesItems.push('Understand and analyze how you use the Website;');
    if (collectsNewsletter) usesItems.push('Send you newsletters, updates, and marketing communications, which you may opt out of at any time;');
    if (collectsContactForm) usesItems.push('Respond to your inquiries and provide customer support;');
    if (collectsPayment) usesItems.push('Process transactions and send you related information, including purchase confirmations and invoices;');
    usesItems.push('Comply with legal obligations and protect against fraudulent or illegal activity.');

    const lines: string[] = [];
    lines.push(`PRIVACY POLICY FOR ${name.toUpperCase()}`);
    lines.push('');
    lines.push(`Effective Date: ${todayLong()}`);
    lines.push('');
    lines.push(`This Privacy Policy describes how ${name} ("we", "us", or "our") collects, uses, and discloses information in connection with your use of ${url} (the "Website"). By using the Website, you agree to the collection and use of information in accordance with this policy.`);
    lines.push('');
    lines.push('1. INFORMATION WE COLLECT');
    for (const item of collectedItems) lines.push(`- ${item}`);
    lines.push('');
    lines.push('2. HOW WE USE YOUR INFORMATION');
    lines.push('We use the information we collect to:');
    for (const item of usesItems) lines.push(`- ${item}`);
    lines.push('');

    if (collectsAnalytics) {
      lines.push('3. COOKIES AND TRACKING TECHNOLOGIES');
      lines.push('We use cookies and similar tracking technologies to track activity on the Website and store certain information. Cookies are small data files that may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent; however, if you do not accept cookies, some portions of the Website may not function properly.');
      lines.push('');
    }

    lines.push(`${collectsAnalytics ? '4' : '3'}. THIRD-PARTY SERVICE PROVIDERS`);
    if (services) {
      lines.push(`We may share information with trusted third-party service providers who assist us in operating the Website, conducting our business, or servicing you, including: ${services}. These third parties have access to your information only to perform specific tasks on our behalf and are obligated not to disclose or use it for any other purpose.`);
    } else {
      lines.push('We may engage third-party companies and individuals to facilitate our Website, provide services on our behalf, or assist us in analyzing how our Website is used. These third parties have access to information only to perform specific tasks on our behalf.');
    }
    lines.push('');

    const nextNum = collectsAnalytics ? 5 : 4;
    lines.push(`${nextNum}. DATA RETENTION`);
    lines.push('We retain personal information only for as long as necessary to fulfill the purposes for which it was collected, including for the purposes of satisfying any legal, accounting, or reporting requirements.');
    lines.push('');

    lines.push(`${nextNum + 1}. YOUR RIGHTS`);
    lines.push('Depending on your location, you may have rights regarding your personal information, including the right to access, correct, delete, or restrict our use of your information, and the right to withdraw consent where processing is based on consent.');
    let subNum = nextNum + 1;
    if (applyGdpr) {
      lines.push('');
      lines.push('GDPR (European Economic Area): If you are located in the EEA, you have the right to access, rectify, port, and erase your data, as well as the right to restrict and object to certain processing of your data, under the General Data Protection Regulation. The legal basis for our processing of your information is your consent, our legitimate interests, and/or performance of a contract with you.');
    }
    if (applyCcpa) {
      lines.push('');
      lines.push('CCPA (California Residents): If you are a California resident, you have the right to request disclosure of the categories and specific pieces of personal information we have collected about you, request deletion of your personal information, and opt out of the sale of your personal information (we do not sell personal information). To exercise these rights, contact us using the information below.');
    }
    lines.push('');
    subNum += 1;

    lines.push(`${subNum}. CHILDREN'S PRIVACY`);
    lines.push('The Website is not intended for children under the age of 13, and we do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us so we can delete it.');
    lines.push('');
    subNum += 1;

    lines.push(`${subNum}. CHANGES TO THIS POLICY`);
    lines.push('We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Effective Date" above.');
    lines.push('');
    subNum += 1;

    lines.push(`${subNum}. CONTACT US`);
    lines.push(`If you have any questions about this Privacy Policy, please contact us at: ${email}`);

    return lines.join('\n');
  }, [companyName, websiteUrl, contactEmail, collectsAnalytics, collectsNewsletter, collectsContactForm, collectsPayment, thirdPartyServices, applyGdpr, applyCcpa]);

  const copyText = () => {
    navigator.clipboard.writeText(documentText).then(() => setCopied(true), () => setCopied(false));
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadTxt = () => {
    const blob = new Blob([documentText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'privacy-policy.txt';
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
      <ToolExampleClearActions onExample={() => { revision.current++; setExporting(false); setExportError(''); setCompanyName('Acme Corp'); setWebsiteUrl('https://www.example.com'); setContactEmail('privacy@example.com'); setCollectsAnalytics(true); setCollectsNewsletter(true); setCollectsContactForm(true); setCollectsPayment(false); setThirdPartyServices('Google Analytics, Stripe'); setApplyGdpr(true); setApplyCcpa(true); }} onClear={() => { revision.current++; setExportError(''); setExporting(false); setCompanyName(''); setWebsiteUrl(''); setContactEmail(''); setCollectsAnalytics(false); setCollectsNewsletter(false); setCollectsContactForm(false); setCollectsPayment(false); setThirdPartyServices(''); setApplyGdpr(false); setApplyCcpa(false); }}/>
      <div className="tb-v2-grid-2">
        <div onChangeCapture={() => { revision.current++; setExporting(false); setExportError(''); }}>
      {exportError && <p role="alert">{exportError}</p>}
      {exporting && <p role="status">Preparing PDF…</p>}
      <p>Editable template draft. Verify all statements and applicable requirements before use; legal validity or compliance is not guaranteed.</p>
          <label className="tb-v2-tool-label">Company / Website Name</label>
          <input maxLength={100000} aria-label="Company Name" type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="tb-v2-input" />
        </div>
        <div>
          <label className="tb-v2-tool-label">Website URL</label>
          <input maxLength={100000} aria-label="Website Url" type="text" value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} className="tb-v2-input" />
        </div>
        <div>
          <label className="tb-v2-tool-label">Contact Email</label>
          <input aria-label="Contact Email" type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} className="tb-v2-input" />
        </div>
        <div>
          <label className="tb-v2-tool-label">Third-Party Services (comma separated)</label>
          <input maxLength={100000} aria-label="Third Party Services" type="text" value={thirdPartyServices} onChange={e => setThirdPartyServices(e.target.value)} className="tb-v2-input" placeholder="e.g. Google Analytics, Stripe" />
        </div>
      </div>

      <div>
        <span className="tb-v2-tool-label" style={{ display: 'block', marginBottom: 8 }}>What data does your site collect?</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label className="tb-v2-checkbox-row"><input aria-label="Collects Analytics" type="checkbox" checked={collectsAnalytics} onChange={e => setCollectsAnalytics(e.target.checked)} /> Analytics / cookies</label>
          <label className="tb-v2-checkbox-row"><input aria-label="Collects Newsletter" type="checkbox" checked={collectsNewsletter} onChange={e => setCollectsNewsletter(e.target.checked)} /> Email newsletter signups</label>
          <label className="tb-v2-checkbox-row"><input aria-label="Collects Contact Form" type="checkbox" checked={collectsContactForm} onChange={e => setCollectsContactForm(e.target.checked)} /> Contact form submissions</label>
          <label className="tb-v2-checkbox-row"><input aria-label="Collects Payment" type="checkbox" checked={collectsPayment} onChange={e => setCollectsPayment(e.target.checked)} /> Payment processing</label>
        </div>
      </div>

      <div>
        <span className="tb-v2-tool-label" style={{ display: 'block', marginBottom: 8 }}>Jurisdiction</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label className="tb-v2-checkbox-row"><input aria-label="Apply Gdpr" type="checkbox" checked={applyGdpr} onChange={e => setApplyGdpr(e.target.checked)} /> Include GDPR (EU/EEA) section</label>
          <label className="tb-v2-checkbox-row"><input aria-label="Apply Ccpa" type="checkbox" checked={applyCcpa} onChange={e => setApplyCcpa(e.target.checked)} /> Include CCPA (California) section</label>
        </div>
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
        This is a generic template and does not constitute legal advice. Consult a qualified attorney to ensure compliance with applicable laws (including GDPR, CCPA, or others) for your specific business.
      </p>
    </div>
  </UtilityDesignLayout>
  );
}
