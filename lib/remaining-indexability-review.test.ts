import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import audit from '../docs/gsc-remaining-review-2026-09-26.json';
import { tools, getCanonicalToolSlug } from '../data/tools';
import { getToolContent } from '../data/tool-content';
import { isToolIndexable } from './indexable-tools';
const aliases: Record<string,string> = {
 'hash-from-text':'sha256-hash-generator',
 'regex-description-generator':'regex-explainer',
 'google-serp-preview':'serp-preview',
 'google-serp-simulator':'serp-preview',
};
describe('remaining review cohort and approved exact duplicates',()=>{
 it('keeps a traceable original 99-row cohort and specific purpose/content',()=>{
  expect(audit.rows).toHaveLength(99);expect(new Set(audit.rows.map(r=>r.slug)).size).toBe(99);
  for(const r of audit.rows){expect(r.source).toMatch(/^components\/tools\//);expect(readFileSync(r.source,'utf8')).toBeTruthy();expect(r.purpose.length).toBeGreaterThan(35);expect(r.example.length).toBeGreaterThan(25);expect(r.limitations.length).toBeGreaterThan(35);if(!aliases[r.slug]){const c=getToolContent(r.slug)!;expect(c.description.length).toBeGreaterThan(60);expect(c.examples[0]!.code.length).toBeGreaterThan(25);expect(c.examples[0]!.note?.length ?? 0).toBeGreaterThan(25);}}
 });
 it('maps only the four authorized exact duplicates directly to retained targets',async()=>{
  const {default:config}=await import('../next.config.mjs');const redirects=await config.redirects!();
  for(const [source,target] of Object.entries(aliases)){
   expect(getCanonicalToolSlug(source)).toBe(target);expect(tools.some(t=>t.slug===source)).toBe(false);expect(tools.some(t=>t.slug===target)).toBe(true);
   expect(redirects.find((r:any)=>r.source===`/tools/${source}`)).toEqual({source:`/tools/${source}`,destination:`/tools/${target}`,permanent:true});
   expect(redirects.some((r:any)=>r.destination===`/tools/${source}`)).toBe(false);
  }
 });
 it('keeps authored blog links off the four retired tool routes',()=>{
  const retired = Object.keys(aliases).join('|');
  const link = new RegExp(`(?:\\]\\(\\s*|href=["'])\\s*(?:https?:\\/\\/(?:www\\.)?toolblip\\.com)?\\/tools\\/(${retired})(?=[/?#)\\s"'])`, 'g');
  const inbound: string[] = [];
  for (const dir of ['content/blog', 'src/content/blog']) {
   for (const file of readdirSync(dir).filter(name => /\.mdx?$/.test(name))) {
    const source = readFileSync(join(dir, file), 'utf8');
    for (const match of source.matchAll(link)) inbound.push(`${dir}/${file}: ${match[1]}`);
   }
  }
  expect(inbound).toEqual([]);
 });
 it('retains overlapping but nonidentical tools and all previous eligible routes',()=>{
  for(const s of ['gradient-generator','slug-generator','reading-level-estimator']){expect(getCanonicalToolSlug(s)).toBe(s);expect(tools.some(t=>t.slug===s)).toBe(true);expect(isToolIndexable(s)).toBe(false);}
  expect(tools.filter(t=>isToolIndexable(t.slug))).toHaveLength(437);
  expect(tools.filter(t=>!isToolIndexable(t.slug))).toHaveLength(3);
 });
 it('publishes exactly the retained eligible canonical tools in the tool sitemap',async()=>{
  const {GET}=await import('../app/sitemap-tools.xml/route');
  const xml=await (await GET()).text();
  expect((xml.match(/<loc>/g)||[])).toHaveLength(437);
  for(const slug of Object.keys(aliases))expect(xml).not.toContain(`/tools/${slug}<`);
  for(const slug of ['gradient-generator','slug-generator','reading-level-estimator'])expect(xml).not.toContain(`/tools/${slug}<`);
  for(const slug of ['json-to-markdown-table','temp-converter','passive-voice-detector','random-id-generator'])expect(xml).toContain(`/tools/${slug}<`);
  expect(xml).toContain('https://toolblip.com/tools/serp-preview');
 });
});
