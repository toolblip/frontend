'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { useSubscription } from '@/hooks/useSubscription';
import { checkFileSize } from '@/lib/tier-limits';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

type Position = 'beginning' | 'end' | 'custom';
type PageSource = {
  sourceId: string;
  fileName: string;
  pageIndex: number;
  width: number;
  height: number;
  thumbnail?: string;
};
type EditorPage = PageSource & { id: string; kind: 'base' | 'insert' | 'blank' };
type SourceDocument = { id: string; file: File; bytes: Uint8Array; pages: PageSource[] };
type Result = { success: boolean; message: string; blob?: Blob; url?: string };

const isPdfFile = (file: File) => file.type === 'application/pdf' || /\.pdf$/i.test(file.name);

async function renderPdfPages(bytes: Uint8Array, scale: number) {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/pdf-worker/pdf.worker.min.mjs`;
  const loadingTask = pdfjs.getDocument({ data: bytes.slice() });
  const document = await loadingTask.promise;
  const pages: Array<{ image: string; width: number; height: number }> = [];
  try {
    for (let pageIndex = 0; pageIndex < document.numPages; pageIndex += 1) {
      const page = await document.getPage(pageIndex + 1);
      const viewport = page.getViewport({ scale });
      const canvas = window.document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas rendering is unavailable in this browser.');
      await page.render({ canvas, canvasContext: context, viewport }).promise;
      pages.push({
        image: canvas.toDataURL('image/png'),
        width: viewport.width / scale,
        height: viewport.height / scale,
      });
    }
  } finally {
    document.cleanup();
  }
  return pages;
}

function PageImage({ page, large = false }: { page: PageSource | EditorPage; large?: boolean }) {
  if (page.thumbnail) {
    return (
      <img
        src={page.thumbnail}
        alt={`Rendered page ${page.pageIndex + 1} from ${page.fileName}`}
        data-testid={large ? 'selected-page-image' : 'page-thumbnail-image'}
        className={large ? 'max-h-[460px] max-w-full object-contain' : 'h-28 w-full object-contain'}
      />
    );
  }
  return (
    <div className={`flex items-center justify-center bg-white text-center text-xs text-gray-500 ${large ? 'h-72 w-full' : 'h-28 w-full'}`}>
      Page {page.pageIndex + 1}<br />preview unavailable
    </div>
  );
}

export default function PdfPageAdderClient() {
  const { tier } = useSubscription();
  const [base, setBase] = useState<SourceDocument | null>(null);
  const [inserts, setInserts] = useState<SourceDocument[]>([]);
  const [editorPages, setEditorPages] = useState<EditorPage[]>([]);
  const [selectedEditorId, setSelectedEditorId] = useState<string | null>(null);
  const [selectedSourceKeys, setSelectedSourceKeys] = useState<string[]>([]);
  const [insertMode, setInsertMode] = useState<'pdf' | 'blank'>('pdf');
  const [blankCount, setBlankCount] = useState(1);
  const [position, setPosition] = useState<Position>('end');
  const [customPosition, setCustomPosition] = useState(1);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [selectedPreviewLoading, setSelectedPreviewLoading] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const baseInputRef = useRef<HTMLInputElement>(null);
  const insertInputRef = useRef<HTMLInputElement>(null);
  const generationRef = useRef(0);
  const idRef = useRef(0);
  const resultUrlRef = useRef<string | null>(null);
  const sourcePages = useMemo(() => inserts.flatMap((source) => source.pages), [inserts]);
  const selectedEditor = editorPages.find((page) => page.id === selectedEditorId) ?? editorPages[0] ?? null;

  const revokeResultUrl = useCallback(() => {
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    resultUrlRef.current = null;
  }, []);

  const clearAll = useCallback(() => {
    generationRef.current += 1;
    revokeResultUrl();
    setBase(null);
    setInserts([]);
    setEditorPages([]);
    setSelectedEditorId(null);
    setSelectedSourceKeys([]);
    setInsertMode('pdf');
    setBlankCount(1);
    setPosition('end');
    setCustomPosition(1);
    setLoading(false);
    setProcessing(false);
    setSelectedPreview(null);
    setSelectedPreviewLoading(false);
    setWarning(null);
    setResult(null);
    if (baseInputRef.current) baseInputRef.current.value = '';
    if (insertInputRef.current) insertInputRef.current.value = '';
  }, [revokeResultUrl]);

  useEffect(() => () => {
    generationRef.current += 1;
    revokeResultUrl();
  }, [revokeResultUrl]);

  useEffect(() => {
    if (!selectedEditor || selectedEditor.kind === 'blank') {
      setSelectedPreview(null);
      return;
    }
    const source = selectedEditor.kind === 'base'
      ? base
      : inserts.find((item) => item.id === selectedEditor.sourceId);
    if (!source) {
      setSelectedPreview(null);
      return;
    }

    const generation = generationRef.current;
    let active = true;
    setSelectedPreviewLoading(true);
    setSelectedPreview(null);
    void renderPdfPages(source.bytes, 1.15).then((pages) => {
      if (active && generation === generationRef.current) {
        setSelectedPreview(pages[selectedEditor.pageIndex]?.image ?? null);
      }
    }).catch(() => {
      if (active && generation === generationRef.current) setSelectedPreview(null);
    }).finally(() => {
      if (active && generation === generationRef.current) setSelectedPreviewLoading(false);
    });
    return () => {
      active = false;
    };
  }, [base, inserts, selectedEditor]);

  const createExample = useCallback(async (labels: string[]) => {
    const document = await PDFDocument.create();
    const font = await document.embedFont(StandardFonts.Helvetica);
    labels.forEach((label, index) => {
      const page = document.addPage([500, 360]);
      page.drawText(label, { x: 54, y: 270, size: 30, font, color: rgb(0.12, 0.2, 0.45) });
      page.drawText(`Example page ${index + 1}`, { x: 54, y: 220, size: 16, font, color: rgb(0.35, 0.4, 0.5) });
    });
    return new File(
      [await document.save() as BlobPart],
      `${labels[0].startsWith('Base') ? 'sample-base' : 'sample-insert'}.pdf`,
      { type: 'application/pdf' },
    );
  }, []);

  const loadBaseFile = useCallback(async (file: File | undefined) => {
    if (!file) return;
    const generation = ++generationRef.current;
    revokeResultUrl();
    setResult(null);
    setWarning(null);
    setLoading(true);
    setBase(null);
    setEditorPages([]);
    setSelectedEditorId(null);
    setSelectedSourceKeys([]);

    if (!isPdfFile(file)) {
      setLoading(false);
      setResult({ success: false, message: 'Please choose a base PDF file.' });
      return;
    }
    const sizeError = checkFileSize(file, tier);
    if (sizeError) {
      setLoading(false);
      setResult({ success: false, message: sizeError });
      return;
    }

    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const document = await PDFDocument.load(bytes);
      if (!document.getPageCount()) throw new Error('The PDF has no pages.');
      let rendered: Array<{ image: string; width: number; height: number }> = [];
      try {
        rendered = await renderPdfPages(bytes, 0.55);
      } catch {
        if (generation === generationRef.current) setWarning('The PDF loaded, but its thumbnail preview could not be rendered. Editing and export remain available.');
      }
      if (generation !== generationRef.current) return;
      const pages = Array.from({ length: document.getPageCount() }, (_, pageIndex) => ({
        sourceId: 'base',
        fileName: file.name,
        pageIndex,
        width: rendered[pageIndex]?.width ?? 612,
        height: rendered[pageIndex]?.height ?? 792,
        thumbnail: rendered[pageIndex]?.image,
      }));
      setBase({ id: 'base', file, bytes, pages });
      setEditorPages(pages.map((page) => ({ ...page, id: `base-${page.pageIndex}`, kind: 'base' as const })));
      setSelectedEditorId('base-0');
      setCustomPosition(pages.length + 1);
    } catch (error) {
      if (generation === generationRef.current) {
        setResult({ success: false, message: `Error loading base PDF: ${error instanceof Error ? error.message : 'Unknown error'}` });
      }
    } finally {
      if (generation === generationRef.current) setLoading(false);
    }
  }, [revokeResultUrl, tier]);

  const loadInsertFiles = useCallback(async (files: FileList | File[] | undefined) => {
    const selectedFiles = Array.from(files ?? []);
    if (!selectedFiles.length) return;
    const generation = ++generationRef.current;
    revokeResultUrl();
    setResult(null);
    setWarning(null);
    setLoading(true);

    try {
      const loaded: SourceDocument[] = [];
      for (const file of selectedFiles) {
        if (!isPdfFile(file)) throw new Error(`${file.name} is not a PDF file.`);
        const sizeError = checkFileSize(file, tier);
        if (sizeError) throw new Error(sizeError);
        const bytes = new Uint8Array(await file.arrayBuffer());
        const document = await PDFDocument.load(bytes);
        if (!document.getPageCount()) throw new Error(`${file.name} has no pages.`);
        let rendered: Array<{ image: string; width: number; height: number }> = [];
        try {
          rendered = await renderPdfPages(bytes, 0.55);
        } catch {
          if (generation === generationRef.current) setWarning('One or more insert PDFs loaded without thumbnail previews.');
        }
        const sourceId = `insert-${generation}-${loaded.length}`;
        const pages = Array.from({ length: document.getPageCount() }, (_, pageIndex) => ({
          sourceId,
          fileName: file.name,
          pageIndex,
          width: rendered[pageIndex]?.width ?? 612,
          height: rendered[pageIndex]?.height ?? 792,
          thumbnail: rendered[pageIndex]?.image,
        }));
        loaded.push({ id: sourceId, file, bytes, pages });
      }
      if (generation !== generationRef.current) return;
      setInserts((current) => [...current, ...loaded]);
      setSelectedSourceKeys([]);
    } catch (error) {
      if (generation === generationRef.current) {
        setResult({ success: false, message: `Error loading insert PDF: ${error instanceof Error ? error.message : 'Unknown error'}` });
      }
    } finally {
      if (generation === generationRef.current) setLoading(false);
    }
  }, [revokeResultUrl, tier]);

  const loadExample = useCallback(async () => {
    const baseFile = await createExample(['Base 1', 'Base 2']);
    const insertFile = await createExample(['Insert 1', 'Insert 2']);
    await loadBaseFile(baseFile);
    await loadInsertFiles([insertFile]);
  }, [createExample, loadBaseFile, loadInsertFiles]);

  const insertSelectedPages = () => {
    if (insertMode === 'pdf' && !selectedSourceKeys.length) {
      setResult({ success: false, message: 'Select one or more source pages to insert.' });
      return;
    }
    const instance = ++idRef.current;
    const blankWidth = base?.pages[0]?.width ?? 612;
    const blankHeight = base?.pages[0]?.height ?? 792;
    const pages: EditorPage[] = insertMode === 'blank'
      ? Array.from({ length: blankCount }, (_, index) => ({
          id: `blank-${instance}-${index}`,
          kind: 'blank',
          sourceId: '',
          fileName: 'Blank page',
          pageIndex: index,
          width: blankWidth,
          height: blankHeight,
        }))
      : selectedSourceKeys.flatMap((key) => {
          const page = sourcePages.find((item) => `${item.sourceId}-${item.pageIndex}` === key);
          return page ? [{ ...page, id: `${page.sourceId}-${page.pageIndex}-${instance}`, kind: 'insert' as const }] : [];
        });
    if (!pages.length) {
      setResult({ success: false, message: 'The selected source pages are no longer available.' });
      return;
    }

    setEditorPages((current) => {
      const index = position === 'beginning'
        ? 0
        : position === 'end'
          ? current.length
          : Math.min(current.length, Math.max(0, customPosition - 1));
      const next = [...current];
      next.splice(index, 0, ...pages);
      return next;
    });
    setSelectedEditorId(pages[0].id);
    setSelectedSourceKeys([]);
    setResult(null);
  };

  const movePage = (index: number, direction: -1 | 1) => setEditorPages((current) => {
    const target = index + direction;
    if (target < 0 || target >= current.length) return current;
    const next = [...current];
    [next[index], next[target]] = [next[target], next[index]];
    return next;
  });

  const deletePage = (id: string) => setEditorPages((current) => {
    if (current.length <= 1) return current;
    const index = current.findIndex((page) => page.id === id);
    const next = current.filter((page) => page.id !== id);
    setSelectedEditorId(next[Math.min(index, next.length - 1)]?.id ?? null);
    return next;
  });

  const saveEditedPdf = async () => {
    if (!base || !editorPages.length) {
      setResult({ success: false, message: 'Choose a base PDF first.' });
      return;
    }
    setProcessing(true);
    setResult(null);
    try {
      const output = await PDFDocument.create();
      const baseDocument = await PDFDocument.load(base.bytes);
      const insertDocuments = new Map<string, PDFDocument>();
      for (const source of inserts) insertDocuments.set(source.id, await PDFDocument.load(source.bytes));
      for (const page of editorPages) {
        if (page.kind === 'blank') {
          output.addPage([page.width, page.height]);
          continue;
        }
        const sourceDocument = page.kind === 'base' ? baseDocument : insertDocuments.get(page.sourceId);
        if (!sourceDocument) throw new Error('A source page is no longer available.');
        const [copied] = await output.copyPages(sourceDocument, [page.pageIndex]);
        output.addPage(copied);
      }
      const blob = new Blob([await output.save() as BlobPart], { type: 'application/pdf' });
      revokeResultUrl();
      const url = URL.createObjectURL(blob);
      resultUrlRef.current = url;
      setResult({ success: true, message: `Edited PDF ready: ${editorPages.length} pages`, blob, url });
    } catch (error) {
      setResult({ success: false, message: `Error exporting PDF: ${error instanceof Error ? error.message : 'Unknown error'}` });
    } finally {
      setProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!result?.blob) return;
    const anchor = document.createElement('a');
    anchor.href = result.url ?? '';
    anchor.download = base?.file.name.replace(/\.pdf$/i, '_edited.pdf') ?? 'edited.pdf';
    anchor.click();
  };

  return (
    <div className="tb-v2-tool-card space-y-5">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">PDF page editor</span>
        <ToolExampleClearActions onExample={() => void loadExample()} onClear={clearAll} canClear={Boolean(base || inserts.length || result)} exampleCount={1} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <UploadBox label="Base PDF" description="Pages in this PDF become the starting order." inputId="base-pdf-upload" inputRef={baseInputRef} fileName={base?.file.name} onFiles={(files) => void loadBaseFile(files[0])} />
        <UploadBox label="Insert PDFs" description="Choose one or more PDFs, then select source pages." inputId="insert-pdf-upload" inputRef={insertInputRef} multiple fileName={inserts.length ? `${inserts.length} source PDF${inserts.length === 1 ? '' : 's'}` : undefined} onFiles={(files) => void loadInsertFiles(files)} />
      </div>
      {base && <p className="text-sm text-gray-600 dark:text-gray-300">Base PDF: {base.pages.length} pages</p>}
      {inserts.length > 0 && <p className="text-sm text-gray-600 dark:text-gray-300">Insert PDF: {sourcePages.length} pages</p>}
      {warning && <p role="alert" className="tb-v2-error">{warning}</p>}
      {loading && <p role="status">Loading PDF pages…</p>}
      <section className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
        <h2 className="mb-3 text-base font-semibold">Source pages</h2>
        {sourcePages.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{sourcePages.map((page) => {
          const key = `${page.sourceId}-${page.pageIndex}`;
          const selected = selectedSourceKeys.includes(key);
          return <button key={key} type="button" data-testid={`source-page-${page.fileName}-${page.pageIndex + 1}`} aria-pressed={selected} aria-label={`Select insert page ${page.pageIndex + 1} from ${page.fileName}`} onClick={() => setSelectedSourceKeys((current) => selected ? current.filter((item) => item !== key) : [...current, key])} className={`rounded border p-2 text-left ${selected ? 'border-indigo-500 ring-2 ring-indigo-300' : 'border-gray-200 dark:border-gray-700'}`}><PageImage page={page} /><span className="mt-1 block text-xs">{page.fileName} · page {page.pageIndex + 1}</span></button>;
        })}</div> : <p className="text-sm text-gray-500">Upload an insert PDF to choose individual pages.</p>}
      </section>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={`tb-v2-mode-tab ${insertMode === 'pdf' ? 'on' : ''}`} onClick={() => setInsertMode('pdf')}>Pages from PDF</button>
        <button type="button" className={`tb-v2-mode-tab ${insertMode === 'blank' ? 'on' : ''}`} onClick={() => setInsertMode('blank')}>Blank pages</button>
      </div>
      {insertMode === 'blank' && <label className="block text-sm">Blank pages <input aria-label="Number of blank pages" type="number" min={1} max={50} value={blankCount} onChange={(event) => setBlankCount(Math.min(50, Math.max(1, Number(event.target.value) || 1)))} className="ml-2 w-20 rounded border p-2" /></label>}
      <div className="space-y-2">
        <span className="block text-sm font-medium">Insert position</span>
        <div className="flex flex-wrap gap-2">{(['beginning', 'end', 'custom'] as Position[]).map((option) => <button key={option} type="button" aria-pressed={position === option} onClick={() => setPosition(option)} className={`rounded px-4 py-2 ${position === option ? 'bg-indigo-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>{option[0].toUpperCase() + option.slice(1)}</button>)}</div>
        {position === 'custom' && <label className="block text-sm">Insert before page <input aria-label="Custom insert position" type="number" min={1} max={editorPages.length + 1} value={customPosition} onChange={(event) => setCustomPosition(Math.min(editorPages.length + 1, Math.max(1, Number(event.target.value) || 1)))} className="ml-2 w-20 rounded border p-2" /></label>}
      </div>
      <button type="button" onClick={insertSelectedPages} disabled={!base || (insertMode === 'pdf' && !selectedSourceKeys.length)} className="w-full rounded-lg bg-indigo-500 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50">Insert selected pages</button>
      <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <section className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <div className="mb-3 flex items-center justify-between"><h2 className="text-base font-semibold">Editor pages</h2><span className="text-sm text-gray-500">{editorPages.length} pages in editor</span></div>
          <div className="space-y-2">{editorPages.map((page, index) => <div key={page.id} data-testid="editor-page-thumbnail" data-page-label={page.kind === 'blank' ? 'Blank' : `${page.fileName.replace(/\.pdf$/i, '')} page ${page.pageIndex + 1}`} className={`flex items-center gap-2 rounded border p-2 ${selectedEditor?.id === page.id ? 'border-indigo-500 ring-1 ring-indigo-300' : 'border-gray-200 dark:border-gray-700'}`}>
            <button type="button" onClick={() => setSelectedEditorId(page.id)} aria-label={`Select page ${index + 1}`} className="min-w-0 flex-1 text-left"><PageImage page={page} /><span className="mt-1 block text-xs">Page {index + 1} · {page.kind === 'blank' ? 'Blank' : page.fileName}</span></button>
            <div className="flex flex-col gap-1"><button type="button" aria-label={`Move page ${index + 1} up`} onClick={() => movePage(index, -1)} disabled={index === 0} className="rounded border px-2 py-1 text-xs disabled:opacity-40">↑</button><button type="button" aria-label={`Move page ${index + 1} down`} onClick={() => movePage(index, 1)} disabled={index === editorPages.length - 1} className="rounded border px-2 py-1 text-xs disabled:opacity-40">↓</button><button type="button" aria-label={`Delete page ${index + 1}`} onClick={() => deletePage(page.id)} disabled={editorPages.length <= 1} className="rounded border px-2 py-1 text-xs text-red-600 disabled:opacity-40">×</button></div>
          </div>)}</div>
        </section>
        <section className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <h2 className="mb-3 text-base font-semibold">Selected page preview</h2>
          {selectedEditor ? <><p className="mb-3 text-sm text-gray-500">Page {editorPages.findIndex((page) => page.id === selectedEditor.id) + 1} of {editorPages.length}</p><div className="flex min-h-72 items-center justify-center rounded bg-gray-100 p-3 dark:bg-gray-800">{selectedPreviewLoading ? <p role="status">Loading selected page preview…</p> : selectedPreview ? <img src={selectedPreview} alt={`Large preview of page ${selectedEditor.pageIndex + 1}`} data-testid="selected-page-image" className="max-h-[460px] max-w-full object-contain" /> : <PageImage page={selectedEditor} large />}</div></> : <p className="text-sm text-gray-500">Upload a base PDF to begin editing.</p>}
        </section>
      </div>
      <button type="button" onClick={() => void saveEditedPdf()} disabled={!base || !editorPages.length || processing} className="w-full rounded-lg bg-green-600 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50">{processing ? 'Saving Edited PDF…' : 'Save Edited PDF'}</button>
      {result && <div role="status" className={`rounded-lg p-4 ${result.success ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}><p>{result.message}</p>{result.success && <div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={downloadResult} className="rounded bg-green-600 px-4 py-2 text-white">Download Edited PDF</button>{result.url && <a href={result.url} target="_blank" rel="noreferrer" className="rounded border border-green-600 px-4 py-2 text-green-700 dark:text-green-300">Preview Edited PDF</a>}</div>}</div>}
    </div>
  );
}

function UploadBox({ label, description, inputId, inputRef, fileName, multiple = false, onFiles }: { label: string; description: string; inputId: string; inputRef: React.RefObject<HTMLInputElement | null>; fileName?: string; multiple?: boolean; onFiles: (files: FileList) => void }) {
  return <div className="space-y-2"><label htmlFor={inputId} className="block text-sm font-medium">{label}</label><div onDrop={(event) => { event.preventDefault(); if (event.dataTransfer.files.length) onFiles(event.dataTransfer.files); }} onDragOver={(event) => event.preventDefault()} className="rounded-lg border-2 border-dashed border-gray-300 p-5 text-center hover:border-indigo-500 dark:border-gray-600"><input ref={inputRef} id={inputId} type="file" accept=".pdf,application/pdf" multiple={multiple} onChange={(event) => { if (event.target.files) onFiles(event.target.files); }} className="hidden" /><label htmlFor={inputId} className="cursor-pointer"><span className="block text-3xl" aria-hidden="true">📄</span><span className="block font-medium">{fileName ?? `Choose ${label.toLowerCase()}`}</span><span className="block text-xs text-gray-500">{description} Click or drop PDF{multiple ? 's' : ''}.</span></label></div></div>;
}
