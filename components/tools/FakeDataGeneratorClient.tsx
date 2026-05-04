'use client';

import { useState } from 'react';

const FIRST = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen'];
const LAST = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Taylor', 'Moore', 'Jackson', 'Martin'];
const DOMAINS = ['example.com', 'mail.com', 'test.org', 'demo.net'];
const STREETS = ['Main St', 'Oak Ave', 'Maple Dr', 'Cedar Ln', 'Pine Rd', 'Elm St', 'Washington Blvd', 'Park Ave'];
const CITIES = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];
const ST = ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'CA'];
const ZIPS = ['10001', '90001', '60601', '77001', '85001', '19101', '78201', '92101', '75201', '95101'];

function rnd<T>(a: T[]): T { return a[Math.floor(Math.random() * a.length)]; }
function ri(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function gen() {
  const f = rnd(FIRST), l = rnd(LAST);
  return { name: `${f} ${l}`, email: `${f.toLowerCase()}.${l.toLowerCase()}${ri(1, 99)}@${rnd(DOMAINS)}`, phone: `(${ri(200, 999)}) ${ri(200, 999)}-${ri(1000, 9999)}`, address: `${ri(100, 9999)} ${rnd(STREETS)}, ${rnd(CITIES)} ${rnd(ST)} ${rnd(ZIPS)}`, username: `${f.toLowerCase()}${l.toLowerCase()}${ri(1, 99)}`, password: `P@ss${ri(100, 999)}!` };
}

type T = 'person' | 'email' | 'address' | 'username';

export default function FakeDataGeneratorClient() {
  const [count, setCount] = useState(5);
  const [type, setType] = useState<T>('person');
  const [data, setData] = useState<Record<string, string>[]>([]);

  const generate = () => {
    const items = Array.from({ length: count }, () => {
      const p = gen();
      if (type === 'person') return p;
      if (type === 'email') return { email: p.email };
      if (type === 'address') return { address: p.address };
      return { username: p.username };
    });
    setData(items as Record<string, string>[]);
  };

  const keys = data[0] ? Object.keys(data[0]) : [];

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Options</span></div>
      <div className="tb-v2-tool-output-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <input type="number" value={count} onChange={e => setCount(Math.max(1, parseInt(e.target.value) || 1))} className="tb-v2-tool-textarea" style={{ width: 64, minHeight: 32, resize: 'none', textAlign: 'center' }} min={1} max={100} />
          <div className="tb-v2-mode-tabs" role="group">
            {(['person', 'email', 'address', 'username'] as T[]).map(t => (
              <button key={t} type="button" onClick={() => setType(t)} className={`tb-v2-mode-tab ${type === t ? 'on' : ''}`}>{t}</button>
            ))}
          </div>
        </div>
      </div>
      <button onClick={generate} className="tb-v2-btn-primary" style={{ marginTop: 12 }}>Generate</button>
      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Generated Data</span>
        {data.length > 0 && <button type="button" onClick={() => navigator.clipboard.writeText(data.map(r => Object.values(r).join(',')).join('\n')).catch(() => {})} className="tb-v2-copy-btn">Copy CSV</button>}
      </div>
      <div className="tb-v2-tool-output-body">
        {data.length > 0 ? (
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 13, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>{keys.map(k => <th key={k} style={{ textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid var(--tb-border)', color: 'var(--tb-text-secondary)', fontSize: 11, textTransform: 'uppercase' }}>{k}</th>)}</tr></thead>
              <tbody>{data.map((row, i) => <tr key={i}>{keys.map(k => <td key={k} style={{ padding: '5px 8px', borderBottom: '1px solid var(--tb-border)' }}>{row[k]}</td>)}</tr>)}</tbody>
            </table>
          </div>
        ) : <div style={{ color: 'var(--tb-text-secondary)', fontSize: 14 }}>Click Generate to create fake data</div>}
      </div>
    </div>
  );
}
