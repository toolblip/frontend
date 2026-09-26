'use client';
import { useEffect, useMemo, useState } from 'react';
import { htmlEscape, httpUrl } from '@/lib/seo-network/core';
import { SeoField, SeoFrame, SeoOutput, SeoSelect } from './SeoNetworkShared';
export type PreviewKind = 'serp' | 'meta' | 'og' | 'social' | 'twitter';
const EMPTY = { title: '', description: '', url: '', image: '', site: '', handle: '', type: 'website', locale: '', custom: '' };
export default function SeoNetworkPreviewClient({ kind }: { kind: PreviewKind }) {
  const [fields, setFields] = useState(EMPTY), [device, setDevice] = useState('desktop'), [platform, setPlatform] = useState('Facebook'), [card, setCard] = useState('summary_large_image');
  const [imageError, setImageError] = useState(false);
  useEffect(() => setImageError(false), [fields.image]);
  const set = (key: keyof typeof fields, value: string) => setFields(current => ({ ...current, [key]: value }));
  const result = useMemo(() => {
    if (!fields.title && !fields.description && !fields.url && !fields.image) return { text: '', error: '' };
    try {
      for (const value of [fields.url, fields.image]) if (value) httpUrl(value);
      if (fields.handle && !/^@[A-Za-z0-9_]{1,15}$/.test(fields.handle)) throw new Error('Site handle must be @ followed by 1–15 letters, digits or underscores.');
      const tag = (key: string, value: string, property = false) => value ? `<meta ${property ? 'property' : 'name'}="${htmlEscape(key)}" content="${htmlEscape(value)}" />` : '';
      const tags: string[] = [];
      if (kind === 'meta' || kind === 'serp') tags.push(`<title>${htmlEscape(fields.title)}</title>`, tag('description', fields.description), fields.url ? `<link rel="canonical" href="${htmlEscape(fields.url)}" />` : '');
      if (kind !== 'twitter' && kind !== 'serp') tags.push(...Object.entries({ title: fields.title, description: fields.description, url: fields.url, image: fields.image, site_name: fields.site, type: fields.type, locale: fields.locale }).map(([key, value]) => tag(`og:${key}`, value, true)));
      if (kind === 'twitter' || kind === 'meta' || kind === 'social') tags.push(tag('twitter:card', card), tag('twitter:title', fields.title), tag('twitter:description', fields.description), tag('twitter:image', fields.image), tag('twitter:site', fields.handle));
      for (const line of fields.custom.split('\n').filter(x => x.trim())) {
        const match = line.match(/^(og:[\w:.-]+)=(.*)$/);
        if (!match) throw new Error('Custom tags use og:property=value, one per line.');
        tags.push(tag(match[1], match[2], true));
      }
      return { text: tags.filter(Boolean).join('\n'), error: '' };
    } catch (e) { return { text: '', error: (e as Error).message }; }
  }, [fields, kind, card]);
  const reset = () => { setFields(EMPTY); setDevice('desktop'); setPlatform('Facebook'); setCard('summary_large_image'); };
  return <SeoFrame clear={reset} example={() => setFields({ ...EMPTY, title: 'Tea & Coffee', description: 'Fresh tea and coffee.', url: 'https://example.com/tea', site: 'Example', handle: '@example', locale: 'en_US' })} note="A visual approximation using your input. Search and social services may truncate or rewrite text. This does not fetch a page or predict rankings. Image previews load the supplied public URL.">
    <div className="seo-fields"><SeoField label="Title" value={fields.title} onChange={v => set('title', v)} maxLength={500} /><SeoField label="Page URL" value={fields.url} onChange={v => set('url', v)} maxLength={2048} /></div>
    <SeoField label="Description" value={fields.description} onChange={v => set('description', v)} multiline maxLength={5000} />
    {kind !== 'serp' && <><div className="seo-fields"><SeoField label="Image URL" value={fields.image} onChange={v => set('image', v)} maxLength={2048} /><SeoField label="Site name" value={fields.site} onChange={v => set('site', v)} maxLength={200} /></div><SeoField label="Site handle" value={fields.handle} onChange={v => set('handle', v)} maxLength={16} /><SeoSelect label="Card type" value={card} onChange={setCard} options={['summary_large_image', 'summary']} /><SeoSelect label="Open Graph type" value={fields.type} onChange={v => set('type', v)} options={['website', 'article', 'product', 'profile', 'book', 'music.song', 'video.movie']} /><SeoField label="Locale" value={fields.locale} onChange={v => set('locale', v)} maxLength={20} /><SeoField label="Custom Open Graph tags" value={fields.custom} onChange={v => set('custom', v)} multiline maxLength={10000} /></>}
    <div className="seo-fields"><SeoSelect label="Device" value={device} onChange={setDevice} options={['desktop', 'mobile']} />{kind === 'social' && <SeoSelect label="Platform" value={platform} onChange={setPlatform} options={['Facebook', 'LinkedIn', 'Twitter', 'Discord']} />}</div>
    <p>Title: {Array.from(fields.title).length} characters · Description: {Array.from(fields.description).length} characters</p>
    {!result.error && result.text && <section aria-label="Preview" style={{ width: device === 'mobile' ? 320 : 600, maxWidth: '100%', border: '1px solid var(--border)', padding: 12, boxSizing: 'border-box' }}>
      {kind === 'social' && <small>{platform} approximation</small>}
      {fields.image && kind !== 'serp' && <img key={fields.image} src={fields.image} alt="Supplied preview image" referrerPolicy="no-referrer" onError={() => setImageError(true)} style={{ width: card === 'summary' ? 100 : '100%', maxHeight: 220, objectFit: 'contain' }} />}
      {imageError && <p role="status">Image could not be loaded. Check its URL and remote access policy.</p>}
      <p style={{ fontSize: 12 }}>{fields.site || fields.url}</p><div style={{ fontSize: 20, color: 'var(--fg)', display: '-webkit-box', WebkitLineClamp: device === 'mobile' ? 2 : 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{fields.title}</div><p style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{fields.description}</p>
    </section>}
    <SeoOutput text={result.text} error={result.error} filename="meta-tags.html" />
  </SeoFrame>;
}
