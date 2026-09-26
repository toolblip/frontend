import { boundedInput, httpUrl } from './core';
const SITEMAP_NS = 'http://www.sitemaps.org/schemas/sitemap/0.9';
export function parseSitemap(xml: string) {
  boundedInput(xml);
  if (/<!DOCTYPE|<!ENTITY/i.test(xml)) throw new Error('DTD and entity declarations are not supported.');
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  if (doc.querySelector('parsererror')) throw new Error('Malformed XML. Check tags and escaped ampersands.');
  const root = doc.documentElement;
  if (!['urlset', 'sitemapindex'].includes(root.localName) || root.namespaceURI !== SITEMAP_NS) throw new Error('Expected urlset or sitemapindex in the sitemap namespace.');
  const entryName = root.localName === 'urlset' ? 'url' : 'sitemap';
  const errors: string[] = [];
  const children = Array.from(root.children);
  if (children.length > 50000) throw new Error('A sitemap may contain at most 50,000 entries.');
  const entries = children.map((entry, index) => {
    const fields = Array.from(entry.children).filter(e => e.namespaceURI === SITEMAP_NS);
    const field = (name: string) => fields.find(e => e.localName === name)?.textContent?.trim() ?? '';
    if (entry.localName !== entryName || entry.namespaceURI !== SITEMAP_NS) errors.push(`Entry ${index + 1}: expected ${entryName}.`);
    const loc = field('loc');
    if (fields.filter(e => e.localName === 'loc').length !== 1) errors.push(`Entry ${index + 1}: exactly one loc is required.`);
    try { httpUrl(loc); } catch { errors.push(`Entry ${index + 1}: invalid location URL.`); }
    const lastmod = field('lastmod'), priority = field('priority'), changefreq = field('changefreq');
    if (lastmod && !validDate(lastmod)) errors.push(`Entry ${index + 1}: invalid lastmod date.`);
    if (priority && (!/^(?:0(?:\.\d+)?|1(?:\.0+)?)$/.test(priority))) errors.push(`Entry ${index + 1}: priority must be between 0 and 1.`);
    if (changefreq && !['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'].includes(changefreq)) errors.push(`Entry ${index + 1}: invalid changefreq.`);
    return { loc, lastmod, priority, changefreq };
  });
  return { type: root.localName, count: entries.length, errors, entries };
}
export function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2}))?$/.test(value)) return false;
  const date = new Date(value.slice(0, 10));
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value.slice(0, 10) && Number.isFinite(Date.parse(value));
}
export function parseHtml(html: string) {
  boundedInput(html);
  // Inert parsing: never insert user HTML into the live document or execute scripts.
  return new DOMParser().parseFromString(html, 'text/html');
}
export function analyzeMeta(html: string) {
  const doc = parseHtml(html);
  const titles = Array.from(doc.querySelectorAll('title')).map(e => e.textContent?.trim() ?? '');
  const tags = Array.from(doc.querySelectorAll('meta[name], meta[property]')).map(e => ({ name: (e.getAttribute('name') ?? e.getAttribute('property') ?? '').toLowerCase(), content: e.getAttribute('content') ?? '' }));
  const canonicals = Array.from(doc.querySelectorAll('link[rel]')).filter(e => e.getAttribute('rel')?.toLowerCase().split(/\s+/).includes('canonical')).map(e => e.getAttribute('href') ?? '');
  const issues: string[] = [];
  if (titles.length !== 1 || !titles[0]) issues.push('Expected one nonempty title.');
  for (const key of ['description', 'og:title', 'og:description', 'og:image', 'twitter:card']) {
    const found = tags.filter(t => t.name === key);
    if (!found.some(t => t.content.trim())) issues.push(`Missing ${key}.`);
    if (found.length > 1) issues.push(`Multiple ${key} tags.`);
  }
  if (canonicals.length > 1) issues.push('Multiple canonical links.');
  return { titles, tags, canonicals, issues };
}
export function analyzeHeadings(html: string) {
  const doc = parseHtml(html);
  const headings = Array.from(doc.querySelectorAll('h1,h2,h3,h4,h5,h6')).map(e => ({ level: Number(e.tagName.slice(1)), text: e.textContent?.trim() ?? '' }));
  const issues: string[] = [];
  let previous = 0;
  for (const h of headings) {
    if (h.level > previous + 1) issues.push(`Heading level skips from H${previous} to H${h.level}.`);
    if (!h.text) issues.push(`Empty H${h.level}.`);
    previous = h.level;
  }
  if (!headings.some(h => h.level === 1)) issues.push('No H1 found.');
  return { headings, issues };
}
export function accessibilityIssues(html: string) {
  const doc = parseHtml(html), issues: string[] = [];
  const name = (e: Element): string => {
    const ids = e.getAttribute('aria-labelledby')?.trim().split(/\s+/) ?? [];
    const labelled = ids.map(id => doc.getElementById(id)?.textContent ?? '').join(' ').trim();
    return labelled || e.getAttribute('aria-label')?.trim() || e.textContent?.trim() || Array.from(e.querySelectorAll('img[alt]')).map(i => i.getAttribute('alt')).join(' ').trim() || e.getAttribute('title')?.trim() || '';
  };
  if (!doc.documentElement.getAttribute('lang')?.trim()) issues.push('Missing document language.');
  if (!doc.querySelector('title')?.textContent?.trim()) issues.push('Missing document title.');
  if (!doc.querySelector('main,[role="main"]')) issues.push('Missing main landmark.');
  doc.querySelectorAll('img:not([alt])').forEach(() => issues.push('Image is missing alt text.'));
  doc.querySelectorAll('button,a[href]').forEach(e => { if (!name(e)) issues.push(`${e.tagName.toLowerCase()} has no accessible name in this static check.`); });
  doc.querySelectorAll('input,select,textarea').forEach(e => {
    const type = e.getAttribute('type')?.toLowerCase();
    if (type === 'hidden') return;
    const label = Array.from(doc.querySelectorAll('label')).some(l => (e.id && l.htmlFor === e.id || l.contains(e)) && l.textContent?.trim());
    const intrinsic = ['submit', 'reset', 'button'].includes(type ?? '') && (e.getAttribute('value')?.trim() || type !== 'button');
    const imageAlt = type === 'image' && e.getAttribute('alt')?.trim();
    // Textarea value and select options are not the control's label.
    const aria = e.getAttribute('aria-label')?.trim() || (e.getAttribute('aria-labelledby')?.split(/\s+/).some(id => doc.getElementById(id)?.textContent?.trim()));
    if (!label && !intrinsic && !imageAlt && !aria && !e.getAttribute('title')?.trim()) issues.push('Form control is missing a label.');
  });
  doc.querySelectorAll('[onclick]').forEach(e => {
    if (!['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(e.tagName) && !(e.tagName === 'A' && e.hasAttribute('href')) && (!(Number(e.getAttribute('tabindex')) >= 0 && e.hasAttribute('tabindex')) || !(e.hasAttribute('onkeydown') || e.hasAttribute('onkeyup')))) issues.push('Custom click handler needs keyboard review.');
  });
  return issues;
}
