"use client";

const ENCODINGS = [
  { name: 'UTF-8', type: 'Unicode', bytes: '1-4', bom: 'Optional', desc: 'Variable-length Unicode encoding' },
  { name: 'ASCII', type: '7-bit', bytes: '1', bom: 'No', desc: 'Basic English characters and control codes' },
  { name: 'ISO-8859-1', type: '8-bit', bytes: '1', bom: 'No', desc: 'Western European languages' },
  { name: 'Windows-1252', type: '8-bit', bytes: '1', bom: 'No', desc: 'Microsoft superset of ISO-8859-1' },
  { name: 'UTF-16', type: 'Unicode', bytes: '2-4', bom: 'Optional', desc: 'Fixed/variable length, common in Windows' },
  { name: 'UTF-32', type: 'Unicode', bytes: '4', bom: 'Optional', desc: 'Fixed 4-byte Unicode encoding' },
  { name: 'Base64', type: 'Binary→Text', bytes: '4/3', bom: 'No', desc: 'Encodes binary data as ASCII text' },
  { name: 'URL Encoding', type: 'Percent', bytes: 'Varies', bom: 'No', desc: 'Encodes URLs with %xx hex sequences' },
];

export default function EncodingsReferenceClient() {
  return (
    <div>
      <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Common Character Encodings</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              {['Name', 'Type', 'Bytes/Char', 'BOM', 'Description'].map(h => (
                <th key={h} style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ENCODINGS.map(e => (
              <tr key={e.name} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '0.75rem', fontWeight: 600, fontFamily: 'monospace' }}>{e.name}</td>
                <td style={{ padding: '0.75rem' }}>{e.type}</td>
                <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>{e.bytes}</td>
                <td style={{ padding: '0.75rem' }}>{e.bom}</td>
                <td style={{ padding: '0.75rem', color: '#6b7280' }}>{e.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
