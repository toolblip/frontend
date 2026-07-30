'use client';

import { useState, useRef } from 'react';

interface ZipEntry { offset: number; compSize: number; compMethod: number; }

function readUint16LE(b: Uint8Array, o: number): number { return b[o] | (b[o + 1] << 8); }
function readUint32LE(b: Uint8Array, o: number): number {
  return (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16) | (b[o + 3] * 0x1000000)) >>> 0;
}

function parseZip(bytes: Uint8Array): Map<string, ZipEntry> {
  const entries = new Map<string, ZipEntry>();
  const EOCD_SIG = 0x06054b50;
  let eocdOffset = -1;
  const minOffset = Math.max(0, bytes.length - 65557);
  for (let i = bytes.length - 22; i >= minOffset; i--) {
    if (readUint32LE(bytes, i) === EOCD_SIG) { eocdOffset = i; break; }
  }
  if (eocdOffset === -1) throw new Error('No end-of-central-directory record found. This is not a valid ZIP-based EPUB file.');

  const cdEntries = readUint16LE(bytes, eocdOffset + 10);
  const cdOffset = readUint32LE(bytes, eocdOffset + 16);
  const CD_SIG = 0x02014b50;

  let ptr = cdOffset;
  for (let i = 0; i < cdEntries; i++) {
    if (readUint32LE(bytes, ptr) !== CD_SIG) break;
    const compMethod = readUint16LE(bytes, ptr + 10);
    const compSize = readUint32LE(bytes, ptr + 20);
    const nameLen = readUint16LE(bytes, ptr + 28);
    const extraLen = readUint16LE(bytes, ptr + 30);
    const commentLen = readUint16LE(bytes, ptr + 32);
    const localHeaderOffset = readUint32LE(bytes, ptr + 42);
    const name = new TextDecoder('utf-8').decode(bytes.slice(ptr + 46, ptr + 46 + nameLen));
    entries.set(name, { offset: localHeaderOffset, compSize, compMethod });
    ptr += 46 + nameLen + extraLen + commentLen;
  }
  return entries;
}

async function extractZipEntry(bytes: Uint8Array, entry: ZipEntry): Promise<Uint8Array> {
  const LFH_SIG = 0x04034b50;
  const o = entry.offset;
  if (readUint32LE(bytes, o) !== LFH_SIG) throw new Error('Corrupt local file header in archive.');
  const nameLen = readUint16LE(bytes, o + 26);
  const extraLen = readUint16LE(bytes, o + 28);
  const dataStart = o + 30 + nameLen + extraLen;
  const compressed = bytes.slice(dataStart, dataStart + entry.compSize);
  if (entry.compMethod === 0) return compressed;
  if (entry.compMethod === 8) {
    const ds = new DecompressionStream('deflate-raw');
    const writer = ds.writable.getWriter();
    writer.write(compressed as BufferSource);
    writer.close();
    return new Uint8Array(await new Response(ds.readable).arrayBuffer());
  }
  throw new Error(`Unsupported ZIP compression method (${entry.compMethod}).`);
}

interface EpubMeta {
  title: string | null;
  authors: string[];
  language: string | null;
  publisher: string | null;
  date: string | null;
  chapterCount: number;
  wordCount: number;
  coverBlobUrl: string | null;
  mergedHtml: string;
  truncated: boolean;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function parseEpub(bytes: Uint8Array): Promise<EpubMeta> {
  const entries = parseZip(bytes);

  const containerEntry = entries.get('META-INF/container.xml');
  if (!containerEntry) throw new Error('Missing META-INF/container.xml - not a valid EPUB file.');
  const containerXml = new TextDecoder('utf-8').decode(await extractZipEntry(bytes, containerEntry));
  const containerDoc = new DOMParser().parseFromString(containerXml, 'application/xml');
  const opfPath = containerDoc.querySelector('rootfile')?.getAttribute('full-path');
  if (!opfPath) throw new Error('Could not locate the OPF package file referenced by the EPUB.');

  const opfEntry = entries.get(opfPath);
  if (!opfEntry) throw new Error('OPF package file is referenced but missing from the archive.');
  const opfXml = new TextDecoder('utf-8').decode(await extractZipEntry(bytes, opfEntry));
  const opfDoc = new DOMParser().parseFromString(opfXml, 'application/xml');

  const getFirst = (tag: string) => opfDoc.getElementsByTagName(tag)[0]?.textContent?.trim() || null;
  const title = getFirst('dc:title');
  const language = getFirst('dc:language');
  const publisher = getFirst('dc:publisher');
  const date = getFirst('dc:date');
  const authors = Array.from(opfDoc.getElementsByTagName('dc:creator')).map(n => n.textContent?.trim() || '').filter(Boolean);

  const manifestItems = Array.from(opfDoc.getElementsByTagName('item'));
  const spineRefs = Array.from(opfDoc.getElementsByTagName('itemref')).map(n => n.getAttribute('idref')).filter(Boolean) as string[];
  const opfDir = opfPath.includes('/') ? opfPath.slice(0, opfPath.lastIndexOf('/') + 1) : '';

  const metaCover = Array.from(opfDoc.getElementsByTagName('meta')).find(m => m.getAttribute('name') === 'cover');
  const coverId = metaCover?.getAttribute('content') || null;
  const coverItem = manifestItems.find(item => item.getAttribute('properties')?.includes('cover-image'))
    || manifestItems.find(item => item.getAttribute('id') === coverId);

  let coverBlobUrl: string | null = null;
  if (coverItem) {
    const href = coverItem.getAttribute('href');
    const mediaType = coverItem.getAttribute('media-type') || 'image/jpeg';
    const coverEntry = href ? entries.get(opfDir + href) : undefined;
    if (coverEntry) {
      const coverBytes = await extractZipEntry(bytes, coverEntry);
      coverBlobUrl = URL.createObjectURL(new Blob([coverBytes as unknown as BlobPart], { type: mediaType }));
    }
  }

  const MAX_SECTIONS = 500;
  const truncated = spineRefs.length > MAX_SECTIONS;
  let mergedHtml = '';
  let wordCount = 0;

  for (const idref of spineRefs.slice(0, MAX_SECTIONS)) {
    const item = manifestItems.find(m => m.getAttribute('id') === idref);
    const href = item?.getAttribute('href');
    if (!href) continue;
    const entry = entries.get(opfDir + href);
    if (!entry) continue;
    const html = new TextDecoder('utf-8').decode(await extractZipEntry(bytes, entry));
    const chapterDoc = new DOMParser().parseFromString(html, 'text/html');
    const bodyHtml = chapterDoc.body ? chapterDoc.body.innerHTML : html;
    mergedHtml += `<section>${bodyHtml}</section>\n`;
    const text = (chapterDoc.body?.textContent || '').trim();
    wordCount += text.length ? text.split(/\s+/).length : 0;
  }

  return { title, authors, language, publisher, date, chapterCount: spineRefs.length, wordCount, coverBlobUrl, mergedHtml, truncated };
}

export default function EpubToMobiClient() {
  const [meta, setMeta] = useState<EpubMeta | null>(null);
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFile = async (file: File | undefined) => {
    if (!file) return;
    setError('');
    setMeta(null);
    if (!file.name.toLowerCase().endsWith('.epub')) {
      setError('Please choose a file with an .epub extension.');
      return;
    }
    setLoading(true);
    try {
      const buffer = await file.arrayBuffer();
      const parsed = await parseEpub(new Uint8Array(buffer));
      setFileName(file.name);
      setMeta(parsed);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not parse this EPUB file.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => loadFile(e.target.files?.[0]);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    loadFile(e.dataTransfer.files?.[0]);
  };

  const downloadHtml = () => {
    if (!meta) return;
    const doc = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${escapeHtml(meta.title || fileName)}</title></head><body>${meta.mergedHtml}</body></html>`;
    const blob = new Blob([doc], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName.replace(/\.epub$/i, '') || 'book'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Upload EPUB File</span>
      </div>
      <div style={{ padding: 20 }}>
        <div
          className={`tb-v2-dropzone ${isDragging ? 'dragging' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <span style={{ fontSize: 28 }}>📚</span>
          <span className="tb-v2-dropzone-text">{loading ? 'Parsing...' : 'Click or drag an .epub file here'}</span>
          <span className="tb-v2-dropzone-hint">Unzipped and parsed entirely in your browser</span>
          <input ref={fileInputRef} type="file" accept=".epub" onChange={handleFileChange} style={{ display: 'none' }} />
        </div>
      </div>

      {error && <div className="tb-v2-banner-err" style={{ margin: '0 20px 20px' }}>{error}</div>}

      {meta && (
        <div style={{ padding: '0 20px 20px' }}>
          <div className="tb-v2-banner" style={{ marginBottom: 16 }}>
            Generating a real, device-valid legacy MOBI file requires Amazon's proprietary PalmDOC/MOBI binary
            packaging and can't be reliably produced in-browser. Below is the book's real metadata and content,
            extracted directly from the EPUB, with an HTML export you can open anywhere or convert offline with
            Calibre or Kindle Previewer.
          </div>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {meta.coverBlobUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={meta.coverBlobUrl} alt="Cover" style={{ width: 120, height: 'auto', border: '1px solid var(--line)', borderRadius: 4 }} />
            )}
            <div className="tb-v2-stats-grid" style={{ flex: 1, minWidth: 240 }}>
              {meta.title && <div className="tb-v2-stat-pill"><div style={{ fontSize: 11, color: 'var(--fg-2)' }}>Title</div><div>{meta.title}</div></div>}
              {meta.authors.length > 0 && <div className="tb-v2-stat-pill"><div style={{ fontSize: 11, color: 'var(--fg-2)' }}>Author(s)</div><div>{meta.authors.join(', ')}</div></div>}
              {meta.publisher && <div className="tb-v2-stat-pill"><div style={{ fontSize: 11, color: 'var(--fg-2)' }}>Publisher</div><div>{meta.publisher}</div></div>}
              {meta.language && <div className="tb-v2-stat-pill"><div style={{ fontSize: 11, color: 'var(--fg-2)' }}>Language</div><div>{meta.language}</div></div>}
              {meta.date && <div className="tb-v2-stat-pill"><div style={{ fontSize: 11, color: 'var(--fg-2)' }}>Date</div><div>{meta.date}</div></div>}
              <div className="tb-v2-stat-pill"><div style={{ fontSize: 11, color: 'var(--fg-2)' }}>Chapters</div><div>{meta.chapterCount}</div></div>
              <div className="tb-v2-stat-pill"><div style={{ fontSize: 11, color: 'var(--fg-2)' }}>Word Count</div><div>{meta.wordCount.toLocaleString()}</div></div>
            </div>
          </div>

          {meta.truncated && <div className="tb-v2-banner" style={{ marginTop: 12 }}>Only the first 500 sections were processed for this preview.</div>}

          <button type="button" onClick={downloadHtml} className="tb-v2-btn tb-v2-btn-primary" style={{ marginTop: 16 }}>
            Download Full Content as HTML
          </button>
        </div>
      )}

      {!meta && !error && !loading && <p className="tb-v2-empty" style={{ margin: '0 20px 20px' }}>Upload an EPUB file to inspect and extract its content.</p>}
    </div>
  );
}
