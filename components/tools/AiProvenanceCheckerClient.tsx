'use client';

import { useEffect, useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';
import { scanAiProvenance, type ProvenanceReport } from '@/lib/ai-provenance';
import { formatImageBytes } from './ImageConversionClient';

type Scan = { name: string; size: number; url: string; report: ProvenanceReport };

const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;
const SAMPLE_URL = '/samples/ai-provenance-example.jpg';
const SAMPLE_NAME = 'ai-provenance-example.jpg';

const VERDICTS: Record<ProvenanceReport['verdict'], { title: string; body: string }> = {
  'ai-labeled': {
    title: 'AI label found',
    body: 'The file says it was generated or edited with AI. This is what the file declares about itself; signatures are not verified here.',
  },
  'credentials-no-ai-label': {
    title: 'Provenance data found, no AI label',
    body: 'The file carries Content Credentials or a source-type label, but none of them says AI was used.',
  },
  'no-signals': {
    title: 'No AI label found',
    body: 'No C2PA manifest, IPTC source type, or known AI generator text was found. That does not prove a person made the image: screenshots, re-saves, and most social platforms strip this metadata.',
  },
};

export default function AiProvenanceCheckerClient() {
  const [scan, setScan] = useState<Scan | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef('');
  const loadIdRef = useRef(0);

  const revoke = () => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = '';
  };
  useEffect(() => () => { loadIdRef.current += 1; revoke(); }, []);

  const clear = () => {
    loadIdRef.current += 1;
    revoke();
    setScan(null);
    setLoading(false);
    setError('');
  };

  const loadFile = async (file: File) => {
    const id = ++loadIdRef.current;
    revoke();
    setScan(null);
    setError('');
    setDragging(false);
    if (!file.type.startsWith('image/') && !/\.(jpe?g|png|webp|avif|heic|heif|gif|tiff?)$/i.test(file.name)) {
      setError('Choose an image file.');
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setError('Choose an image up to 50 MiB.');
      return;
    }
    setLoading(true);
    try {
      const report = scanAiProvenance(new Uint8Array(await file.arrayBuffer()));
      if (id !== loadIdRef.current) return;
      const url = URL.createObjectURL(file);
      urlRef.current = url;
      setScan({ name: file.name, size: file.size, url, report });
    } catch {
      if (id === loadIdRef.current) setError('This file could not be read. Try another image.');
    } finally {
      if (id === loadIdRef.current) setLoading(false);
    }
  };

  const loadExample = async () => {
    try {
      const response = await fetch(SAMPLE_URL);
      if (!response.ok) throw new Error();
      await loadFile(new File([await response.blob()], SAMPLE_NAME, { type: 'image/jpeg' }));
    } catch {
      setError('The example image could not be loaded.');
    }
  };

  const report = scan?.report;
  const verdict = report ? VERDICTS[report.verdict] : null;

  return (
    <div className="tb-image-tool">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Image to check</span>
        <ToolExampleClearActions onExample={() => void loadExample()} onClear={clear} canClear={Boolean(scan || error || loading)} exampleCount={1} exampleDisabled={loading} />
      </div>

      <div className="tb-image-tool-body">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          aria-label="Select image to check for AI provenance labels"
          onChange={(event) => { const file = event.target.files?.[0]; if (file) void loadFile(file); event.target.value = ''; }}
        />
        <button
          type="button"
          className={`tb-v2-dropzone tb-image-upload ${dragging ? 'dragging' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => { event.preventDefault(); setDragging(false); const file = event.dataTransfer.files[0]; if (file) void loadFile(file); }}
          aria-label={scan ? 'Check another image. Click or drop an image' : 'Choose image or drag and drop'}
          disabled={loading}
        >
          <Upload size={28} aria-hidden="true" />
          <span className="tb-image-upload-copy">
            <span className="tb-v2-dropzone-text">{loading ? 'Reading file...' : scan ? `${scan.name} · ${formatImageBytes(scan.size)}. Drop another to check it.` : 'Click to upload or drag an image here'}</span>
            <span className="tb-v2-dropzone-hint">JPEG, PNG, WebP, AVIF, HEIC and more. 50 MiB max. The file never leaves your browser.</span>
          </span>
        </button>

        {error && <p className="tb-image-hint" role="alert">{error}</p>}

        {scan && report && verdict && (
          <div className="tb-image-workspace">
            <figure className="tb-v2-card tb-image-preview-card">
              <div className="tb-image-preview">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={scan.url} alt="Checked image preview" />
              </div>
            </figure>

            <div className="tb-v2-card tb-image-result" aria-live="polite">
              <strong>{verdict.title}</strong>
              <p className="tb-image-hint">{verdict.body}</p>
              <div className="tb-v2-stats-grid">
                <div className="tb-v2-stat-pill">
                  <div className="tb-image-hint">Content Credentials (C2PA)</div>
                  <div>{report.hasC2pa ? 'Manifest present' : 'Not found'}</div>
                </div>
                <div className="tb-v2-stat-pill">
                  <div className="tb-image-hint">AI generator</div>
                  <div>{report.generators.join(', ') || 'Not named'}</div>
                </div>
              </div>
              <ResultList title="Digital source type (IPTC)" items={report.digitalSourceTypes} />
              <ResultList title="Software named in provenance data" items={report.softwareAgents} />
              {report.hasAiParameters && <p className="tb-image-hint">Stable Diffusion generation parameters (prompt, steps, sampler) are embedded in the file.</p>}
              <p className="tb-image-hint">
                Invisible pixel watermarks such as Google SynthID can&apos;t be read in a browser. Only the vendor&apos;s own detector can check them.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ResultList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <div className="tb-image-hint">{title}</div>
      <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
    </div>
  );
}
