'use client';

import { useMemo, useState } from 'react';

type Category = 'Image' | 'Video' | 'Audio' | 'Document' | 'Font' | 'Archive' | 'Text' | 'Application';

interface MimeEntry {
  extension: string;
  mimeType: string;
  category: Category;
}

const MIME_TYPES: MimeEntry[] = [
  { extension: '.png', mimeType: 'image/png', category: 'Image' },
  { extension: '.jpg', mimeType: 'image/jpeg', category: 'Image' },
  { extension: '.jpeg', mimeType: 'image/jpeg', category: 'Image' },
  { extension: '.gif', mimeType: 'image/gif', category: 'Image' },
  { extension: '.webp', mimeType: 'image/webp', category: 'Image' },
  { extension: '.svg', mimeType: 'image/svg+xml', category: 'Image' },
  { extension: '.bmp', mimeType: 'image/bmp', category: 'Image' },
  { extension: '.ico', mimeType: 'image/vnd.microsoft.icon', category: 'Image' },
  { extension: '.tif', mimeType: 'image/tiff', category: 'Image' },
  { extension: '.tiff', mimeType: 'image/tiff', category: 'Image' },
  { extension: '.avif', mimeType: 'image/avif', category: 'Image' },
  { extension: '.heic', mimeType: 'image/heic', category: 'Image' },
  { extension: '.psd', mimeType: 'image/vnd.adobe.photoshop', category: 'Image' },
  { extension: '.apng', mimeType: 'image/apng', category: 'Image' },

  { extension: '.mp4', mimeType: 'video/mp4', category: 'Video' },
  { extension: '.m4v', mimeType: 'video/x-m4v', category: 'Video' },
  { extension: '.webm', mimeType: 'video/webm', category: 'Video' },
  { extension: '.ogv', mimeType: 'video/ogg', category: 'Video' },
  { extension: '.mov', mimeType: 'video/quicktime', category: 'Video' },
  { extension: '.avi', mimeType: 'video/x-msvideo', category: 'Video' },
  { extension: '.wmv', mimeType: 'video/x-ms-wmv', category: 'Video' },
  { extension: '.mkv', mimeType: 'video/x-matroska', category: 'Video' },
  { extension: '.flv', mimeType: 'video/x-flv', category: 'Video' },
  { extension: '.3gp', mimeType: 'video/3gpp', category: 'Video' },
  { extension: '.mpeg', mimeType: 'video/mpeg', category: 'Video' },
  { extension: '.ts', mimeType: 'video/mp2t', category: 'Video' },

  { extension: '.mp3', mimeType: 'audio/mpeg', category: 'Audio' },
  { extension: '.wav', mimeType: 'audio/wav', category: 'Audio' },
  { extension: '.ogg', mimeType: 'audio/ogg', category: 'Audio' },
  { extension: '.m4a', mimeType: 'audio/mp4', category: 'Audio' },
  { extension: '.aac', mimeType: 'audio/aac', category: 'Audio' },
  { extension: '.flac', mimeType: 'audio/flac', category: 'Audio' },
  { extension: '.weba', mimeType: 'audio/webm', category: 'Audio' },
  { extension: '.mid', mimeType: 'audio/midi', category: 'Audio' },
  { extension: '.midi', mimeType: 'audio/midi', category: 'Audio' },
  { extension: '.opus', mimeType: 'audio/opus', category: 'Audio' },
  { extension: '.wma', mimeType: 'audio/x-ms-wma', category: 'Audio' },

  { extension: '.pdf', mimeType: 'application/pdf', category: 'Document' },
  { extension: '.doc', mimeType: 'application/msword', category: 'Document' },
  { extension: '.docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', category: 'Document' },
  { extension: '.xls', mimeType: 'application/vnd.ms-excel', category: 'Document' },
  { extension: '.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', category: 'Document' },
  { extension: '.ppt', mimeType: 'application/vnd.ms-powerpoint', category: 'Document' },
  { extension: '.pptx', mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', category: 'Document' },
  { extension: '.odt', mimeType: 'application/vnd.oasis.opendocument.text', category: 'Document' },
  { extension: '.ods', mimeType: 'application/vnd.oasis.opendocument.spreadsheet', category: 'Document' },
  { extension: '.odp', mimeType: 'application/vnd.oasis.opendocument.presentation', category: 'Document' },
  { extension: '.rtf', mimeType: 'application/rtf', category: 'Document' },
  { extension: '.epub', mimeType: 'application/epub+zip', category: 'Document' },

  { extension: '.ttf', mimeType: 'font/ttf', category: 'Font' },
  { extension: '.otf', mimeType: 'font/otf', category: 'Font' },
  { extension: '.woff', mimeType: 'font/woff', category: 'Font' },
  { extension: '.woff2', mimeType: 'font/woff2', category: 'Font' },
  { extension: '.eot', mimeType: 'application/vnd.ms-fontobject', category: 'Font' },

  { extension: '.zip', mimeType: 'application/zip', category: 'Archive' },
  { extension: '.rar', mimeType: 'application/vnd.rar', category: 'Archive' },
  { extension: '.7z', mimeType: 'application/x-7z-compressed', category: 'Archive' },
  { extension: '.tar', mimeType: 'application/x-tar', category: 'Archive' },
  { extension: '.gz', mimeType: 'application/gzip', category: 'Archive' },
  { extension: '.bz2', mimeType: 'application/x-bzip2', category: 'Archive' },
  { extension: '.xz', mimeType: 'application/x-xz', category: 'Archive' },
  { extension: '.iso', mimeType: 'application/x-iso9660-image', category: 'Archive' },
  { extension: '.jar', mimeType: 'application/java-archive', category: 'Archive' },
  { extension: '.dmg', mimeType: 'application/x-apple-diskimage', category: 'Archive' },

  { extension: '.txt', mimeType: 'text/plain', category: 'Text' },
  { extension: '.csv', mimeType: 'text/csv', category: 'Text' },
  { extension: '.html', mimeType: 'text/html', category: 'Text' },
  { extension: '.htm', mimeType: 'text/html', category: 'Text' },
  { extension: '.css', mimeType: 'text/css', category: 'Text' },
  { extension: '.md', mimeType: 'text/markdown', category: 'Text' },
  { extension: '.xml', mimeType: 'text/xml', category: 'Text' },
  { extension: '.ics', mimeType: 'text/calendar', category: 'Text' },
  { extension: '.vtt', mimeType: 'text/vtt', category: 'Text' },
  { extension: '.yaml', mimeType: 'application/x-yaml', category: 'Text' },
  { extension: '.yml', mimeType: 'application/x-yaml', category: 'Text' },
  { extension: '.tsv', mimeType: 'text/tab-separated-values', category: 'Text' },

  { extension: '.json', mimeType: 'application/json', category: 'Application' },
  { extension: '.jsonld', mimeType: 'application/ld+json', category: 'Application' },
  { extension: '.js', mimeType: 'text/javascript', category: 'Application' },
  { extension: '.mjs', mimeType: 'text/javascript', category: 'Application' },
  { extension: '.wasm', mimeType: 'application/wasm', category: 'Application' },
  { extension: '.bin', mimeType: 'application/octet-stream', category: 'Application' },
  { extension: '.exe', mimeType: 'application/x-msdownload', category: 'Application' },
  { extension: '.apk', mimeType: 'application/vnd.android.package-archive', category: 'Application' },
  { extension: '.sh', mimeType: 'application/x-sh', category: 'Application' },
  { extension: '.csh', mimeType: 'application/x-csh', category: 'Application' },
  { extension: '.php', mimeType: 'application/x-httpd-php', category: 'Application' },
  { extension: '.sql', mimeType: 'application/sql', category: 'Application' },
  { extension: '.swf', mimeType: 'application/x-shockwave-flash', category: 'Application' },
  { extension: '.rss', mimeType: 'application/rss+xml', category: 'Application' },
  { extension: '.atom', mimeType: 'application/atom+xml', category: 'Application' },
  { extension: '.xhtml', mimeType: 'application/xhtml+xml', category: 'Application' },
  { extension: '.deb', mimeType: 'application/vnd.debian.binary-package', category: 'Application' },
  { extension: '.rpm', mimeType: 'application/x-rpm', category: 'Application' },
  { extension: '.msi', mimeType: 'application/x-msi', category: 'Application' },
  { extension: '.crx', mimeType: 'application/x-chrome-extension', category: 'Application' },
  { extension: '.webmanifest', mimeType: 'application/manifest+json', category: 'Application' },
  { extension: '.form', mimeType: 'application/x-www-form-urlencoded', category: 'Application' },
  { extension: '.multipart', mimeType: 'multipart/form-data', category: 'Application' },
  { extension: '.bson', mimeType: 'application/bson', category: 'Application' },
  { extension: '.proto', mimeType: 'application/x-protobuf', category: 'Application' },
  { extension: '.graphql', mimeType: 'application/graphql', category: 'Application' },
  { extension: '.pem', mimeType: 'application/x-pem-file', category: 'Application' },
  { extension: '.crt', mimeType: 'application/x-x509-ca-cert', category: 'Application' },
  { extension: '.p12', mimeType: 'application/x-pkcs12', category: 'Application' },
  { extension: '.jks', mimeType: 'application/x-java-keystore', category: 'Application' },
  { extension: '.torrent', mimeType: 'application/x-bittorrent', category: 'Application' },
  { extension: '.ai', mimeType: 'application/postscript', category: 'Application' },
  { extension: '.eps', mimeType: 'application/postscript', category: 'Application' },
  { extension: '.indd', mimeType: 'application/x-indesign', category: 'Application' },
  { extension: '.dwg', mimeType: 'image/vnd.dwg', category: 'Application' },
  { extension: '.stl', mimeType: 'model/stl', category: 'Application' },
  { extension: '.gltf', mimeType: 'model/gltf+json', category: 'Application' },
  { extension: '.glb', mimeType: 'model/gltf-binary', category: 'Application' },
  { extension: '.kml', mimeType: 'application/vnd.google-earth.kml+xml', category: 'Application' },
  { extension: '.geojson', mimeType: 'application/geo+json', category: 'Application' },
  { extension: '.mobi', mimeType: 'application/x-mobipocket-ebook', category: 'Document' },
  { extension: '.azw3', mimeType: 'application/vnd.amazon.ebook', category: 'Document' },
];

const CATEGORY_ORDER: Category[] = ['Image', 'Video', 'Audio', 'Document', 'Font', 'Archive', 'Text', 'Application'];

export default function MIMETypesReferenceClient() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category | 'All'>('All');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return MIME_TYPES.filter(row => {
      if (category !== 'All' && row.category !== category) return false;
      if (!q) return true;
      return row.extension.toLowerCase().includes(q) || row.mimeType.toLowerCase().includes(q);
    });
  }, [search, category]);

  const copyMime = (idx: number, mimeType: string) => {
    navigator.clipboard.writeText(mimeType).catch(() => {});
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(cur => (cur === idx ? null : cur)), 1200);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Search by extension or MIME type</span>
      </div>
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="e.g. .json, image/png, pdf..."
        className="tb-v2-input"
        style={{ marginBottom: 10 }}
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
        <button type="button" onClick={() => setCategory('All')} className={`tb-v2-mode-tab ${category === 'All' ? 'on' : ''}`}>All</button>
        {CATEGORY_ORDER.map(c => (
          <button key={c} type="button" onClick={() => setCategory(c)} className={`tb-v2-mode-tab ${category === c ? 'on' : ''}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">{filtered.length} result{filtered.length === 1 ? '' : 's'}</span>
      </div>
      <div className="tb-v2-tool-output-body" style={{ maxHeight: 460, overflowY: 'auto' }}>
        {filtered.length === 0 ? (
          <p className="tb-v2-empty">No MIME types match that search.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--line)' }}>
                <th style={{ padding: '6px 8px' }}>Extension</th>
                <th style={{ padding: '6px 8px' }}>MIME type</th>
                <th style={{ padding: '6px 8px' }}>Category</th>
                <th style={{ padding: '6px 8px' }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => (
                <tr key={`${row.extension}-${row.mimeType}`} style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '6px 8px', fontFamily: 'var(--f-mono)' }}>{row.extension}</td>
                  <td style={{ padding: '6px 8px', fontFamily: 'var(--f-mono)' }}>{row.mimeType}</td>
                  <td style={{ padding: '6px 8px', color: 'var(--fg-2)' }}>{row.category}</td>
                  <td style={{ padding: '6px 8px' }}>
                    <button type="button" onClick={() => copyMime(idx, row.mimeType)} className="tb-v2-copy-btn">
                      {copiedIdx === idx ? 'Copied' : 'Copy'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
