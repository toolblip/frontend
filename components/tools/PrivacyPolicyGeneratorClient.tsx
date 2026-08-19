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

function todayLong(): string {
  return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function PrivacyPolicyGeneratorClient() {
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
    navigator.clipboard.writeText(documentText).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadTxt = () => {
    const blob = new Blob([documentText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'privacy-policy.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPdf = async () => {
    const bytes = await textToPdf(documentText);
    const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'privacy-policy.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tb-v2-tool-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="tb-v2-grid-2">
        <div>
          <label className="tb-v2-tool-label">Company / Website Name</label>
          <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="tb-v2-input" />
        </div>
        <div>
          <label className="tb-v2-tool-label">Website URL</label>
          <input type="text" value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} className="tb-v2-input" />
        </div>
        <div>
          <label className="tb-v2-tool-label">Contact Email</label>
          <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} className="tb-v2-input" />
        </div>
        <div>
          <label className="tb-v2-tool-label">Third-Party Services (comma separated)</label>
          <input type="text" value={thirdPartyServices} onChange={e => setThirdPartyServices(e.target.value)} className="tb-v2-input" placeholder="e.g. Google Analytics, Stripe" />
        </div>
      </div>

      <div>
        <span className="tb-v2-tool-label" style={{ display: 'block', marginBottom: 8 }}>What data does your site collect?</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label className="tb-v2-checkbox-row"><input type="checkbox" checked={collectsAnalytics} onChange={e => setCollectsAnalytics(e.target.checked)} /> Analytics / cookies</label>
          <label className="tb-v2-checkbox-row"><input type="checkbox" checked={collectsNewsletter} onChange={e => setCollectsNewsletter(e.target.checked)} /> Email newsletter signups</label>
          <label className="tb-v2-checkbox-row"><input type="checkbox" checked={collectsContactForm} onChange={e => setCollectsContactForm(e.target.checked)} /> Contact form submissions</label>
          <label className="tb-v2-checkbox-row"><input type="checkbox" checked={collectsPayment} onChange={e => setCollectsPayment(e.target.checked)} /> Payment processing</label>
        </div>
      </div>

      <div>
        <span className="tb-v2-tool-label" style={{ display: 'block', marginBottom: 8 }}>Jurisdiction</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label className="tb-v2-checkbox-row"><input type="checkbox" checked={applyGdpr} onChange={e => setApplyGdpr(e.target.checked)} /> Include GDPR (EU/EEA) section</label>
          <label className="tb-v2-checkbox-row"><input type="checkbox" checked={applyCcpa} onChange={e => setApplyCcpa(e.target.checked)} /> Include CCPA (California) section</label>
        </div>
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
        This is a generic template and does not constitute legal advice. Consult a qualified attorney to ensure compliance with applicable laws (including GDPR, CCPA, or others) for your specific business.
      </p>
    </div>
  );
}
