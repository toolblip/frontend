"use client";

const MIME_TYPES = [
  { ext: '.html', mime: 'text/html', desc: 'HTML documents' },
  { ext: '.css', mime: 'text/css', desc: 'Cascading Style Sheets' },
  { ext: '.js', mime: 'application/javascript', desc: 'JavaScript files' },
  { ext: '.json', mime: 'application/json', desc: 'JSON data' },
  { ext: '.xml', mime: 'application/xml', desc: 'XML documents' },
  { ext: '.pdf', mime: 'application/pdf', desc: 'Adobe PDF' },
  { ext: '.zip', mime: 'application/zip', desc: 'ZIP archives' },
  { ext: '.png', mime: 'image/png', desc: 'PNG images' },
  { ext: '.jpg', mime: 'image/jpeg', desc: 'JPEG images' },
  { ext: '.gif', mime: 'image/gif', desc: 'GIF images' },
  { ext: '.svg', mime: 'image/svg+xml', desc: 'SVG vector images' },
  { ext: '.webp', mime: 'image/webp', desc: 'WebP images' },
  { ext: '.mp3', mime: 'audio/mpeg', desc: 'MP3 audio' },
  { ext: '.mp4', mime: 'video/mp4', desc: 'MP4 video' },
  { ext: '.webm', mime: 'video/webm', desc: 'WebM video' },
  { ext: '.woff', mime: 'font/woff', desc: 'WOFF font' },
  { ext: '.woff2', mime: 'font/woff2', desc: 'WOFF2 font' },
  { ext: '.csv', mime: 'text/csv', desc: 'CSV spreadsheet' },
  { ext: '.txt', mime: 'text/plain', desc: 'Plain text' },
  { ext: '.md', mime: 'text/markdown', desc: 'Markdown documents' },
];

export default function MimeTypesReferenceClient() {
  return (
    <div>
      <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Common MIME Types</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              {['Extension', 'MIME Type', 'Description'].map(h => (
                <th key={h} style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MIME_TYPES.map(m => (
              <tr key={m.ext} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'monospace', fontWeight: 600, color: '#667eea' }}>{m.ext}</td>
                <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'monospace' }}>{m.mime}</td>
                <td style={{ padding: '0.5rem 0.75rem', color: '#6b7280' }}>{m.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
