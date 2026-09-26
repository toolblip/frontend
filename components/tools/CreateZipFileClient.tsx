'use client';
import { readBrowserFile } from '@/lib/utility-design/core';
import UtilityDesignLayout from './UtilityDesignLayout';
import ToolExampleClearActions from './ToolExampleClearActions';

import { useState, useRef, useEffect } from 'react';

function makeCrcTable(): Uint32Array {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[n] = c >>> 0;
  }
  return table;
}
const CRC_TABLE = makeCrcTable();

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function dosDateTime(date: Date) {
  const time = ((date.getHours() & 0x1f) << 11) | ((date.getMinutes() & 0x3f) << 5) | ((Math.floor(date.getSeconds() / 2)) & 0x1f);
  const dosDate = (((date.getFullYear() - 1980) & 0x7f) << 9) | (((date.getMonth() + 1) & 0xf) << 5) | (date.getDate() & 0x1f);
  return { time, dosDate };
}

function pushU16(arr: number[], v: number) {
  arr.push(v & 0xff, (v >>> 8) & 0xff);
}
function pushU32(arr: number[], v: number) {
  arr.push(v & 0xff, (v >>> 8) & 0xff, (v >>> 16) & 0xff, (v >>> 24) & 0xff);
}

export function createZip(files: { name: string; data: Uint8Array }[]): Blob {
  const { time, dosDate } = dosDateTime(new Date());
  const localChunks: number[] = [];
  const centralChunks: number[] = [];
  let offset = 0;

  for (const file of files) {
    const nameBytes = Array.from(new TextEncoder().encode(file.name));
    const crc = crc32(file.data);
    const size = file.data.length;
    const localOffset = offset;

    const local: number[] = [];
    pushU32(local, 0x04034b50);
    pushU16(local, 20);
    pushU16(local, 0x0800);
    pushU16(local, 0);
    pushU16(local, time);
    pushU16(local, dosDate);
    pushU32(local, crc);
    pushU32(local, size);
    pushU32(local, size);
    pushU16(local, nameBytes.length);
    pushU16(local, 0);
    local.push(...nameBytes);

    localChunks.push(...local);
    offset += local.length;
    for (let i = 0; i < file.data.length; i++) localChunks.push(file.data[i]);
    offset += file.data.length;

    const central: number[] = [];
    pushU32(central, 0x02014b50);
    pushU16(central, 20);
    pushU16(central, 20);
    pushU16(central, 0x0800);
    pushU16(central, 0);
    pushU16(central, time);
    pushU16(central, dosDate);
    pushU32(central, crc);
    pushU32(central, size);
    pushU32(central, size);
    pushU16(central, nameBytes.length);
    pushU16(central, 0);
    pushU16(central, 0);
    pushU16(central, 0);
    pushU16(central, 0);
    pushU32(central, 0);
    pushU32(central, localOffset);
    central.push(...nameBytes);

    centralChunks.push(...central);
  }

  const centralStart = offset;
  const centralSize = centralChunks.length;

  const end: number[] = [];
  pushU32(end, 0x06054b50);
  pushU16(end, 0);
  pushU16(end, 0);
  pushU16(end, files.length);
  pushU16(end, files.length);
  pushU32(end, centralSize);
  pushU32(end, centralStart);
  pushU16(end, 0);

  const all = new Uint8Array(localChunks.length + centralChunks.length + end.length);
  all.set(localChunks, 0);
  all.set(centralChunks, localChunks.length);
  all.set(end, localChunks.length + centralChunks.length);

  return new Blob([all], { type: 'application/zip' });
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function CreateZipFileClient() {
  const generation = useRef(0);
  useEffect(() => () => { generation.current++; }, []);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [zipUrl, setZipUrl] = useState('');
  const [zipName, setZipName] = useState('');
  const [zipSize, setZipSize] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState('');
  useEffect(() => () => { if(zipUrl) URL.revokeObjectURL(zipUrl); }, [zipUrl]);
  const addFiles = (list: File[]) => {
    generation.current++; setIsLoading(false); setError('');
    const combined = [...files, ...list];
    if(combined.length > 100 || combined.reduce((n,f)=>n+f.size,0) > 10*1024*1024) { setError('Maximum 100 files and 10 MiB total.'); return; }
    if(new Set(combined.map(f=>f.name)).size !== combined.length) { setError('Duplicate filenames: rename before adding.'); return; }
    setFiles(combined);
    setZipUrl('');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(e.target.files || []));
    e.target.value = '';
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const removeFile = (index: number) => {
    generation.current++; setIsLoading(false);
    setFiles(prev => prev.filter((_, i) => i !== index));
    setZipUrl('');
  };

  const loadExample = () => {
    const a = new File(['Hello from Toolblip!'], 'hello.txt', { type: 'text/plain' });
    const b = new File(['This is a second example file.\nIt has two lines.'], 'notes.txt', { type: 'text/plain' });
    generation.current++; setIsLoading(false); setError(''); setFiles([a, b]);
    setZipUrl('');
  };

  const handleCreate = async () => {
    if (files.length === 0) return;
    const id = ++generation.current; setError('');
    setIsLoading(true);
    try {
    const entries = await Promise.all(files.map(async f => ({
      name: f.name,
      data: new Uint8Array(await readBrowserFile(f)),
    })));
    if(id !== generation.current) return;
    const blob = createZip(entries);
    setZipUrl(URL.createObjectURL(blob));
    setZipName(files.length === 1 ? `${files[0].name.replace(/\.[^.]+$/, '')}.zip` : 'archive.zip');
    setZipSize(blob.size);
    } catch { if(id === generation.current) setError('Could not create archive.'); }
    finally { if(id === generation.current) setIsLoading(false); }
  };

  return (<UtilityDesignLayout>
    <div>
      <ToolExampleClearActions onExample={() => { loadExample(); }} onClear={() => { generation.current++; setFiles([]); setZipUrl(''); setZipName(''); setZipSize(0); setIsLoading(false); setError(''); }}/>
      {error && <p role="alert">{error}</p>}
      <p>ZIP stores files without compression. Maximum 10 MiB total.</p>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Files</span>

      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'
        }`}
      >
        <div className="text-4xl mb-2">🗂️</div>
        <p className="text-gray-600 dark:text-gray-400">
          {isDragging ? 'Drop files here' : 'Click or drag files to add to the ZIP'}
        </p>
        <p className="text-xs text-gray-500 mt-1">Select one or more files</p>
      </div>

      <input aria-label="Upload file" ref={fileRef} type="file" multiple onChange={handleFileSelect} className="hidden" />

      {files.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 flex flex-col gap-2 mt-4">
          {files.map((f, i) => (
            <div key={i} className="flex justify-between items-center text-sm">
              <span className="truncate">{f.name} <span className="text-gray-500">({formatBytes(f.size)})</span></span>
              <button type="button" onClick={() => removeFile(i)} className="tb-v2-btn-sm">Remove</button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={handleCreate}
        disabled={isLoading || files.length === 0}
        className="tb-v2-btn tb-v2-btn-primary mt-4 w-full"
      >
        {isLoading ? 'Creating ZIP...' : 'Create ZIP File'}
      </button>

      {zipUrl && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Result</span>
          </div>
          <div className="tb-v2-tool-output-body">
            <div className="flex justify-between items-center">
              <span className="text-sm">{zipName} ({formatBytes(zipSize)})</span>
              <a href={zipUrl} download={zipName} className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-sm">
                Download
              </a>
            </div>
          </div>
        </>
      )}

      {!files.length && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">🗂️</div>
          <p>Add files above to bundle them into a ZIP archive</p>
        </div>
      )}
    </div>
  </UtilityDesignLayout>
  );
}
