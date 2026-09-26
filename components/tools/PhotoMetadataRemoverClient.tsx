'use client';

import { useState, useRef, useEffect } from 'react';

import ToolExampleClearActions from './ToolExampleClearActions';
import {readImage, exampleFile, canvasBlob} from '@/lib/images-qa';
import { stripImageMetadata } from '@/lib/image-metadata-strip';

const TAG_NAMES: Record<number, string> = {
  0x010f: 'Make',
  0x0110: 'Model',
  0x0112: 'Orientation',
  0x0132: 'DateTime',
  0x9003: 'DateTimeOriginal',
  0x829a: 'ExposureTime',
  0x829d: 'FNumber',
  0x8827: 'ISO',
  0x920a: 'FocalLength',
  0x8825: 'GPS IFD (location data)',
  0x0131: 'Software',
  0xa002: 'PixelXDimension',
  0xa003: 'PixelYDimension',
};

interface ExifTag { name: string; value: string; }

/** Minimal manual JPEG EXIF marker scan (APP1 / 0xFFE1 "Exif" signature). Best-effort, informational only. */
function readExifTags(bytes: Uint8Array): ExifTag[] {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return [];

  let offset = 2;
  let app1Start = -1;
  let app1Length = 0;
  while (offset < bytes.length - 4) {
    if (bytes[offset] !== 0xff) break;
    const marker = bytes[offset + 1];
    if (marker === 0xd8 || marker === 0xd9) { offset += 2; continue; }
    const segLength = (bytes[offset + 2] << 8) | bytes[offset + 3];
    if (marker === 0xe1) {
      const sig = new TextDecoder('ascii').decode(bytes.slice(offset + 4, offset + 10));
      if (sig === 'Exif\0\0') { app1Start = offset + 4; app1Length = segLength - 2; }
    }
    if (marker === 0xda) break;
    offset += 2 + segLength;
  }
  if (app1Start === -1) return [];

  const tiffStart = app1Start + 6;
  if (tiffStart + 8 > bytes.length) return [];
  const little = bytes[tiffStart] === 0x49 && bytes[tiffStart + 1] === 0x49;
  const read16 = (o: number) => (little ? bytes[o] | (bytes[o + 1] << 8) : (bytes[o] << 8) | bytes[o + 1]);
  const read32 = (o: number) => (little
    ? (bytes[o] | (bytes[o + 1] << 8) | (bytes[o + 2] << 16) | (bytes[o + 3] * 0x1000000)) >>> 0
    : ((bytes[o] * 0x1000000) | (bytes[o + 1] << 16) | (bytes[o + 2] << 8) | bytes[o + 3]) >>> 0);

  const ifdOffset = read32(tiffStart + 4);
  const ifdStart = tiffStart + ifdOffset;
  if (ifdStart + 2 > bytes.length) return [];
  const entryCount = read16(ifdStart);

  const tags: ExifTag[] = [];
  for (let i = 0; i < entryCount; i++) {
    const entryOffset = ifdStart + 2 + i * 12;
    if (entryOffset + 12 > bytes.length) break;
    const tagId = read16(entryOffset);
    const type = read16(entryOffset + 2);
    const count = read32(entryOffset + 4);
    const valueOffsetField = entryOffset + 8;

    const name = TAG_NAMES[tagId];
    if (!name) continue;

    let value = '';
    try {
      if (type === 2) {
        const strLen = count;
        const dataOffset = strLen <= 4 ? valueOffsetField : tiffStart + read32(valueOffsetField);
        value = new TextDecoder('ascii').decode(bytes.slice(dataOffset, dataOffset + strLen)).replace(/\0+$/, '');
      } else if (type === 3) {
        value = String(count <= 2 ? read16(valueOffsetField) : read16(tiffStart + read32(valueOffsetField)));
      } else if (type === 4) {
        value = String(read32(valueOffsetField));
      } else if (type === 5 && count === 1) {
        const dataOffset = tiffStart + read32(valueOffsetField);
        const numV = read32(dataOffset);
        const denV = read32(dataOffset + 4);
        value = denV !== 0 ? (numV / denV).toFixed(4).replace(/\.?0+$/, '') : String(numV);
      } else {
        continue;
      }
    } catch {
      continue;
    }
    if (value) tags.push({ name, value });
  }
  return tags;
}

export default function PhotoMetadataRemoverClient() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [cleanedUrl, setCleanedUrl] = useState<string | null>(null);
  const [tags, setTags] = useState<ExifTag[]>([]);
  const [scanned, setScanned] = useState(false);
  const [fileName, setFileName] = useState('');
  const [mimeType, setMimeType] = useState('image/jpeg');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const request=useRef(0);
  useEffect(()=>()=>{request.current++;},[]);
  useEffect(()=>()=>{if(imageUrl)URL.revokeObjectURL(imageUrl);},[imageUrl]);
  useEffect(()=>()=>{if(cleanedUrl)URL.revokeObjectURL(cleanedUrl);},[cleanedUrl]);
  const clear=()=>{request.current++;setImageUrl(null);setCleanedUrl(null);setTags([]);setScanned(false);setError('');setProcessing(false);if(fileInputRef.current)fileInputRef.current.value='';};
  const loadFile=async(file:File|undefined)=>{
    if(!file)return;clear();const id=request.current;setProcessing(true);
    try{const {img,bytes,mime}=await readImage(file);if(id!==request.current)return;
      const canvas=document.createElement('canvas');canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;
      canvas.getContext('2d')!.drawImage(img,0,0);const outType=mime==='image/jpeg'?'image/jpeg':'image/png';
      const encoded=await canvasBlob(canvas,outType);
      // WebKit's canvas encoder can add its own EXIF chunk. Strip the final
      // encoded bytes as well as re-encoding away the source metadata.
      const cleanedBytes=stripImageMetadata(new Uint8Array(await encoded.arrayBuffer()),outType);
      if(id!==request.current)return;
      const blob=new Blob([cleanedBytes],{type:outType});
      setTags(readExifTags(bytes));setScanned(true);setFileName(file.name);setMimeType(outType);
      setImageUrl(URL.createObjectURL(new Blob([bytes],{type:mime})));setCleanedUrl(URL.createObjectURL(blob));
    }catch(e){if(id===request.current)setError((e as Error).message);}finally{if(id===request.current)setProcessing(false);}
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => loadFile(e.target.files?.[0]);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    loadFile(e.dataTransfer.files?.[0]);
  };

  const downloadCleaned = () => {
    if (!cleanedUrl) return;
    const ext = mimeType === 'image/png' ? 'png' : 'jpg';
    const a = document.createElement('a');
    a.href = cleanedUrl;
    a.download = `${(fileName.replace(/\.[^.]+$/, '') || 'image')}-no-metadata.${ext}`;
    a.click();
  };

  return (
    <div className="tb-v2-tool-card"><style jsx>{`input,textarea,select {max-width:100%;min-width:0} .tb-v2-tool-card {min-width:0;max-width:100%;overflow-wrap:anywhere} .tb-v2-tool-input-head {flex-wrap:wrap;gap:8px} .tb-v2-range-row {flex-wrap:wrap} .tb-v2-range {min-width:0;flex:1}`}</style>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Upload Photo</span><ToolExampleClearActions onExample={()=>loadFile(exampleFile())} onClear={clear}/>
      </div>
      <div style={{ padding: 20 }}>
        <div
          className={`tb-v2-dropzone ${isDragging ? 'dragging' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <span style={{ fontSize: 28 }}>🛡️</span>
          <span className="tb-v2-dropzone-text">{processing ? 'Processing...' : 'Click or drag a photo here'}</span>
          <span className="tb-v2-dropzone-hint">Processed entirely in your browser, never uploaded</span>
          <input aria-label="Upload image" ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
        </div>
      </div>

      {error && <div className="tb-v2-banner tb-v2-banner-err" style={{ margin: '0 20px 20px' }}>{error}</div>}

      {imageUrl && !processing && (
        <div style={{ padding: '0 20px 20px' }}>
          <div className="tb-v2-stats-grid" style={{ marginBottom: 16 }}>
            <div className="tb-v2-stat-pill">
              <div style={{ fontSize: 11, color: 'var(--fg-2)' }}>Metadata Tags Found</div>
              <div style={{ fontFamily: 'var(--f-mono)', fontWeight: 600 }}>{tags.length}</div>
            </div>
            <div className="tb-v2-stat-pill">
              <div style={{ fontSize: 11, color: 'var(--fg-2)' }}>Status</div>
              <div style={{ fontFamily: 'var(--f-mono)', fontWeight: 600, color: cleanedUrl ? '#16a34a' : 'var(--fg-0)' }}>
                {cleanedUrl ? 'Stripped' : 'Pending'}
              </div>
            </div>
          </div>

          {scanned && (
            tags.length > 0 ? (
              <div className="tb-v2-tool-pre" style={{ marginBottom: 16 }}>
                <div style={{ marginBottom: 8, color: 'var(--fg-2)' }}>
                  Found {tags.length} readable tag{tags.length === 1 ? '' : 's'} in the original file{tags.some(t => t.name.startsWith('GPS')) ? ' — including GPS location data' : ''}:
                </div>
                {tags.map((t, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <span style={{ color: 'var(--fg-2)' }}>{t.name}</span>
                    <span style={{ fontFamily: 'var(--f-mono)' }}>{t.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="tb-v2-banner tb-v2-banner-info" style={{ marginBottom: 16 }}>
                None found by the quick scan (this parser only reads common JPEG EXIF tags — the file may already be
                clean, or use a format/encoding it doesn't decode). Re-encoding below still strips any embedded
                metadata as a safety measure, regardless of what this scan could read.
              </div>
            )
          )}

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--fg-2)', marginBottom: 4 }}>Original</div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="Original" style={{ maxWidth: 200, maxHeight: 200, border: '1px solid var(--line)', borderRadius: 4 }} />
            </div>
            {cleanedUrl && (
              <div>
                <div style={{ fontSize: 11, color: 'var(--fg-2)', marginBottom: 4 }}>Re-encoded (source metadata removed)</div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cleanedUrl} alt="Cleaned" style={{ maxWidth: 200, maxHeight: 200, border: '1px solid var(--line)', borderRadius: 4 }} />
              </div>
            )}
          </div>

          <button type="button" onClick={downloadCleaned} className="tb-v2-btn tb-v2-btn-primary" disabled={!cleanedUrl}>
            Download Metadata-Free Photo
          </button>
        </div>
      )}

      {!imageUrl && !error && !processing && <p className="tb-v2-empty" style={{ margin: '0 20px 20px' }}>Upload a photo to inspect and strip its metadata before sharing online.</p>}
    </div>
  );
}
