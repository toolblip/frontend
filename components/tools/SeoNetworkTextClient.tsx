'use client';
import { useMemo, useState } from 'react';
import { SeoField, SeoFrame, SeoOutput, SeoSelect, useSeoRequest } from './SeoNetworkShared';
import { canonicalUrl, duplicateUrls, hreflangOutput, htmlEscape, httpUrl, keywordStats, parseRobots, robotsDecision } from '@/lib/seo-network/core';
import { accessibilityIssues, analyzeHeadings, analyzeMeta, parseSitemap } from '@/lib/seo-network/documents';
import { boundedFetch } from '@/lib/seo-network/request';
export type TextKind = 'robots' | 'sitemap' | 'meta' | 'headings' | 'accessibility' | 'title' | 'description' | 'og-debug' | 'keywords' | 'extract' | 'ideas' | 'canonical' | 'duplicates' | 'hreflang';
const HTML = '<!doctype html><html lang="en"><head><title>Tea &amp; Coffee</title><meta name="description" content="Fresh tea and coffee."><meta property="og:title" content="Tea &amp; Coffee"></head><body><main><h1>Tea <em>&amp; Coffee</em></h1><h3>Brewing</h3><img src="tea.png"></main></body></html>';
const EXAMPLES: Record<TextKind, string> = {
  robots: 'User-agent: *\nDisallow: /private/\nAllow: /private/public$\nSitemap: https://example.com/sitemap.xml',
  sitemap: '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://example.com/?a=1&amp;b=2</loc><priority>0.5</priority></url><url><loc>https://example.com/about</loc></url></urlset>',
  meta: HTML, headings: HTML, accessibility: HTML, title: 'Tea & Coffee', description: 'Fresh tea and coffee.', 'og-debug': HTML,
  keywords: 'Cat cat scatter dog', extract: 'Cat cat scatter dog', ideas: 'coffee', canonical: 'http://www.example.com/page/?a=1&b=2#section', duplicates: 'https://example.com/a\nhttps://example.com/a\nhttps://example.com/b', hreflang: 'en https://example.com/\nfr https://example.com/fr\nx-default https://example.com/'
};
const NOTES: Record<TextKind, string> = {
  robots: 'Validate access rules and test a path for a crawler product token. robots.txt is not access control. Empty Disallow permits crawling; crawler extensions are reported separately.',
  sitemap: 'Parse a sitemap or sitemap index. XML entities are decoded. Download exports every location, including sitemap locations for an index.',
  meta: 'Inspect supplied HTML or fetch a CORS-enabled page. Missing tags are observations, not an SEO grade. Scripts are not executed.',
  headings: 'Read heading text in document order, including nested markup. Level skips are review prompts, not a search ranking score.',
  accessibility: 'Static HTML checks only. This cannot certify accessibility or test computed contrast, layout, focus order or runtime behavior.',
  title: 'Character counts are Unicode code points. Search engines may rewrite titles; this is not a ranking score or a guaranteed display limit.',
  description: 'Count description characters and check an optional phrase. Search engines may choose different snippets.',
  'og-debug': 'Inspect Open Graph and Twitter tags from actual HTML. URL fetching requires CORS permission; no invented metadata is returned.',
  keywords: 'Whole-word and phrase frequency. Density is occurrences divided by the number of possible phrase windows. Overlapping matches count.',
  extract: 'Frequency-based extraction with optional English stop-word filtering. No semantic relevance or search-volume estimates.',
  ideas: 'Local phrase templates for brainstorming. These are not live search suggestions and include no volume or competition data.',
  canonical: 'Choose transformations explicitly. Query strings, hostnames and trailing slashes may identify different pages.',
  duplicates: 'Exact normalized HTTP(S) URLs by default. Optional transformations can merge distinct resources; review before using the list.',
  hreflang: 'One language-code URL pair per line. Includes reciprocal alternates in every sitemap entry. Add at most one x-default line.'
};
export default function SeoNetworkTextClient({ kind }: { kind: TextKind }) {
  const [input, setInput] = useState(''), [secondary, setSecondary] = useState(''), [path, setPath] = useState('/private/file');
  const [mode, setMode] = useState('local'), [format, setFormat] = useState('html'), [size, setSize] = useState('1'), [stop, setStop] = useState(kind === 'extract');
  const [options, setOptions] = useState({ https: false, www: false, slash: false, query: false, hash: false });
  const [remote, setRemote] = useState(''); const request = useSeoRequest();
  const canFetch = ['meta', 'headings', 'accessibility', 'title', 'description', 'og-debug', 'sitemap', 'robots'].includes(kind);
  const update = (value: string) => { request.cancel(); setRemote(''); setInput(value); };
  const clear = () => { update(''); setSecondary(''); setMode('local'); setFormat('html'); setSize('1'); setPath('/private/file'); setOptions({ https: false, www: false, slash: false, query: false, hash: false }); setStop(kind === 'extract'); };
  const example = () => { request.cancel(); setRemote(''); setInput(mode === 'url' ? 'https://example.com/' : EXAMPLES[kind]); setSecondary(kind === 'robots' ? 'Googlebot' : ['keywords', 'description'].includes(kind) ? 'cat' : ''); };
  const source = mode === 'url' ? remote : input;
  const result = useMemo(() => {
    if (!source.trim()) return { text: '', error: '', download: '' };
    try {
      let text = '', download = '';
      if (kind === 'robots') {
        const parsed = parseRobots(source);
        const decision = secondary.trim() && !parsed.errors.length ? robotsDecision(parsed, secondary.trim(), path) : null;
        text = JSON.stringify({ ...parsed, decision }, null, 2); download = source;
      } else if (kind === 'sitemap') {
        const parsed = parseSitemap(source); text = JSON.stringify(parsed, null, 2); download = parsed.entries.map(e => e.loc).join('\n');
      } else if (['meta', 'og-debug'].includes(kind)) { text = JSON.stringify(analyzeMeta(source), null, 2); }
      else if (kind === 'headings') { text = JSON.stringify(analyzeHeadings(source), null, 2); }
      else if (kind === 'accessibility') { const issues = accessibilityIssues(source); text = JSON.stringify({ scope: 'Static checks only; manual review still required.', count: issues.length, issues }, null, 2); }
      else if (kind === 'title' || kind === 'description') {
        const meta = mode === 'url' || format === 'HTML' ? analyzeMeta(source) : null;
        const values = meta ? kind === 'title' ? meta.titles : meta.tags.filter(t => t.name === 'description').map(t => t.content) : [source];
        text = JSON.stringify({ count: values.length, values: values.map(value => ({ text: value, characters: Array.from(value).length, ...(secondary ? { containsPhrase: value.toLowerCase().includes(secondary.toLowerCase()) } : {}) })), issues: values.length === 1 && values[0].trim() ? [] : [`Expected one nonempty ${kind}.`] }, null, 2);
      } else if (kind === 'keywords' || kind === 'extract') { text = JSON.stringify(keywordStats(source, secondary, Number(size), stop), null, 2); }
      else if (kind === 'ideas') {
        const seed = source.trim().replace(/\s+/g, ' ');
        if (seed.length > 100) throw new Error('Use a seed of at most 100 characters.');
        text = ['what is', 'how to', 'how to use', 'why', 'when', 'where', 'can', 'is', 'best', 'cheap', 'free'].map(prefix => `${prefix} ${seed}`).concat(['for', 'with', 'without', 'near', 'vs', 'guide', 'review', 'alternatives', 'for beginners'].map(suffix => `${seed} ${suffix}`)).join('\n');
      } else if (kind === 'canonical') { text = `<link rel="canonical" href="${htmlEscape(canonicalUrl(source, options))}" />`; }
      else if (kind === 'duplicates') { const parsed = duplicateUrls(source, options); text = JSON.stringify(parsed, null, 2); download = parsed.unique.join('\n'); }
      else if (kind === 'hreflang') text = hreflangOutput(source, format);
      return { text, error: '', download: download || text };
    } catch (e) { return { text: '', download: '', error: e instanceof Error ? e.message : 'Invalid input.' }; }
  }, [source, kind, secondary, path, size, stop, options, mode, format]);
  const label = mode === 'url' ? 'Page URL' : kind === 'robots' ? 'robots.txt' : kind === 'sitemap' ? 'Sitemap XML' : ['meta', 'og-debug', 'headings', 'accessibility'].includes(kind) || format === 'HTML' ? 'HTML' : kind === 'hreflang' ? 'Language URLs' : kind === 'canonical' ? 'URL' : kind === 'duplicates' ? 'URLs' : 'Text';
  return <SeoFrame example={example} clear={clear} note={NOTES[kind]}>
    {canFetch && <SeoSelect label="Input mode" value={mode} onChange={value => { update(''); setMode(value); }} options={[[ 'local', 'Paste input' ], ['url', 'Fetch URL (CORS required)']]} />}
    {['title', 'description'].includes(kind) && mode === 'local' && <SeoSelect label="Content format" value={format === 'HTML' ? 'HTML' : 'Text'} onChange={value => { update(''); setFormat(value); }} options={['Text', 'HTML']} />}
    <SeoField label={label} value={input} onChange={update} multiline={mode !== 'url' && kind !== 'canonical' && kind !== 'ideas'} maxLength={mode === 'url' ? 2048 : 200000} />
    {mode === 'url' && <button className="tb-v2-btn tb-v2-btn-primary" disabled={request.loading} onClick={() => { setRemote(''); request.run(async signal => { const url = httpUrl(input); const response = await boundedFetch(url.href, signal); return response.text(); }, setRemote); }}>{request.loading ? 'Fetching…' : 'Fetch'}</button>}
    {['robots', 'keywords', 'extract', 'description'].includes(kind) && <SeoField label={kind === 'robots' ? 'Crawler product token' : 'Keyword or phrase (optional)'} value={secondary} onChange={setSecondary} maxLength={200} />}
    {kind === 'robots' && <SeoField label="Test path" value={path} onChange={setPath} maxLength={2048} />}
    {['keywords', 'extract'].includes(kind) && <><SeoSelect label="Phrase size" value={size} onChange={setSize} options={['1', '2', '3']} /><label><input type="checkbox" checked={stop} onChange={e => setStop(e.target.checked)} /> Exclude English stop words from the frequency list</label></>}
    {['canonical', 'duplicates'].includes(kind) && Object.entries({ https: 'Force HTTPS', www: 'Remove www', slash: 'Remove trailing slash', query: 'Remove query', hash: 'Remove fragment' }).map(([key, label]) => <label key={key}><input type="checkbox" checked={options[key as keyof typeof options]} onChange={e => setOptions({ ...options, [key]: e.target.checked })} /> {label}</label>)}
    {kind === 'hreflang' && <SeoSelect label="Output format" value={format} onChange={setFormat} options={['html', 'json', 'sitemap']} />}
    <SeoOutput text={result.text} error={request.error ? `${request.error} URL reads may be blocked by CORS or the remote service; paste the source instead.` : result.error} filename={kind === 'hreflang' ? `hreflang.${format === 'sitemap' ? 'xml' : format}` : `${kind}-report.txt`} />
    {result.download && ['robots', 'sitemap', 'duplicates'].includes(kind) && <SeoDownload text={result.download} filename={kind === 'robots' ? 'robots.txt' : 'urls.txt'} />}
  </SeoFrame>;
}
import { downloadText } from '@/lib/seo-network/request';
function SeoDownload({ text, filename }: { text: string; filename: string }) { return <button className="tb-v2-btn-sm" onClick={() => downloadText(text, filename)}>Download {filename}</button>; }
