/** Date-only operations deliberately use UTC, independently of the browser zone. */
export function dateOnly(value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error('Enter a valid calendar date.');
  const d = new Date(value + 'T00:00:00Z');
  if (!Number.isFinite(d.getTime()) || d.toISOString().slice(0, 10) !== value) throw new Error('Enter a valid calendar date.');
  return d;
}
function addMonths(d: Date, n: number) {
  const r = new Date(d); r.setUTCDate(1); r.setUTCMonth(r.getUTCMonth() + n);
  const end = new Date(r); end.setUTCMonth(end.getUTCMonth() + 1); end.setUTCDate(0);
  r.setUTCDate(Math.min(d.getUTCDate(), end.getUTCDate())); return r;
}
export function ageBetween(birth: string, target: string) {
  const b = dateOnly(birth), t = dateOnly(target);
  if (b > t) throw new Error('Birth date cannot be after the target date.');
  let months = (t.getUTCFullYear() - b.getUTCFullYear()) * 12 + t.getUTCMonth() - b.getUTCMonth();
  if (addMonths(b, months) > t) months--;
  const totalDays = (t.getTime() - b.getTime()) / 86400000;
  let next = addMonths(b, (t.getUTCFullYear() - b.getUTCFullYear()) * 12);
  if (next < t) next = addMonths(b, (t.getUTCFullYear() + 1 - b.getUTCFullYear()) * 12);
  return { years: Math.floor(months / 12), months: months % 12, days: (t.getTime() - addMonths(b, months).getTime()) / 86400000,
    totalDays, totalWeeks: Math.floor(totalDays / 7), totalHours: totalDays * 24,
    nextBirthday: next.toISOString().slice(0, 10), daysUntilBirthday: (next.getTime() - t.getTime()) / 86400000 };
}
export function zoneParts(ms: number, zone: string) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(ms);
  const p = Object.fromEntries(parts.map(x => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}
/** Resolve a wall time using actual IANA offsets; reject gaps and repeated times. */
export function zonedInstant(date: string, time: string, zone: string): number {
  dateOnly(date);
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new Error('Enter a valid time.');
  const wall = `${date}T${time}`, naive = Date.parse(wall + ':00Z');
  const offsets = new Set<number>();
  for (let h = -36; h <= 36; h += 6) {
    const sample = naive + h * 3600000;
    offsets.add(Date.parse(zoneParts(sample, zone) + ':00Z') - sample);
  }
  const candidates = [...offsets].map(o => naive - o).filter(t => zoneParts(t, zone) === wall);
  if (candidates.length !== 1) throw new Error(candidates.length ? 'This time occurs twice during the DST change. Choose an unambiguous time.' : 'This local time does not exist during the DST change.');
  return candidates[0];
}
export function randomIntegers(min: number, max: number, count: number, unique: boolean) {
  const range = max - min + 1;
  if (![min, max, count, range].every(Number.isSafeInteger) || min > max || count < 1 || count > 1000 || (unique && count > range)) throw new Error('Use safe integer bounds, minimum ≤ maximum, and a count of 1–1000 within the unique range.');
  // Partial Fisher–Yates using a sparse map: bounded even when count equals range.
  const swaps = new Map<number, number>();
  return Array.from({ length: count }, (_, i) => {
    if (!unique) return min + Math.floor(Math.random() * range);
    const j = i + Math.floor(Math.random() * (range - i));
    const picked = swaps.get(j) ?? j; swaps.set(j, swaps.get(i) ?? i); return min + picked;
  });
}
export function ipv6(format: string, bytes: Uint8Array) {
  const b = [...bytes.slice(0, 16)];
  if (format === 'eui64') b.splice(8, 8, b[8] ^ 2, b[9], b[10], 255, 254, b[11], b[12], b[13]);
  const groups = Array.from({ length: 8 }, (_, i) => ((b[i * 2] << 8) | b[i * 2 + 1]).toString(16));
  if (format !== 'compressed') return groups.map(g => g.padStart(4, '0')).join(':');
  let best = -1, length = 1;
  for (let i = 0; i < 8;) { if (groups[i] !== '0') { i++; continue; } let end = i; while (groups[end] === '0') end++; if (end - i > length) { best = i; length = end - i; } i = end; }
  return best < 0 ? groups.join(':') : groups.slice(0, best).join(':') + '::' + groups.slice(best + length).join(':');
}
export function csvRows(text: string): string[] {
  if (text.includes('\0')) throw new Error('CSV must be text, not binary data.');
  const rows: string[] = []; let start = 0, quoted = false, fieldStart = true, closed = false;
  text = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) { if (c === '"') { if (text[i + 1] === '"') i++; else { quoted = false; closed = true; } } continue; }
    if (c === '"') { if (!fieldStart) throw new Error('Unexpected quote in CSV field.'); quoted = true; fieldStart = false; }
    else if (c === ',') { fieldStart = true; closed = false; }
    else if (c === '\r' || c === '\n') { rows.push(text.slice(start, i)); if (c === '\r' && text[i + 1] === '\n') i++; start = i + 1; fieldStart = true; closed = false; }
    else { if (closed) throw new Error('Unexpected text after closing CSV quote.'); fieldStart = false; }
  }
  if (quoted) throw new Error('Unclosed quoted CSV field.');
  if (start < text.length) rows.push(text.slice(start));
  return rows;
}
export function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export async function readBrowserFile(file: File): Promise<ArrayBuffer> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try { return await Promise.race([file.arrayBuffer(), new Promise<never>((_,reject)=>{timer=setTimeout(()=>reject(new Error('File read timed out.')),15000);})]); }
  finally { if(timer) clearTimeout(timer); }
}
/** Reject renamed text/ZIPs and excessive expanded XLSX payloads before SheetJS parsing. */
export function assertXlsx(buffer: ArrayBuffer) {
  const bytes=new Uint8Array(buffer),view=new DataView(buffer);let end=-1;
  for(let i=bytes.length-22;i>=Math.max(0,bytes.length-65557);i--) if(view.getUint32(i,true)===0x06054b50){end=i;break;}
  if(end<0)throw new Error('This is not an XLSX ZIP workbook.');
  const entries=view.getUint16(end+10,true);let pos=view.getUint32(end+16,true),expanded=0;const names=new Set<string>();
  if(entries>2000)throw new Error('Workbook has too many ZIP entries.');
  for(let i=0;i<entries;i++){
    if(pos+46>bytes.length||view.getUint32(pos,true)!==0x02014b50)throw new Error('Invalid XLSX ZIP directory.');
    expanded+=view.getUint32(pos+24,true);if(expanded>50*1024*1024)throw new Error('Expanded workbook exceeds 50 MiB.');
    const n=view.getUint16(pos+28,true),extra=view.getUint16(pos+30,true),comment=view.getUint16(pos+32,true);
    if(pos+46+n+extra+comment>bytes.length)throw new Error('Truncated workbook directory.');
    names.add(new TextDecoder().decode(bytes.slice(pos+46,pos+46+n)));pos+=46+n+extra+comment;
  }
  if(!names.has('[Content_Types].xml')||!names.has('xl/workbook.xml'))throw new Error('ZIP does not contain an XLSX workbook.');
}
export function allocateCents(amounts: number[]) {
  const cents=amounts.map(n=>Math.floor(n*100));let remaining=Math.round(amounts.reduce((a,b)=>a+b,0)*100)-cents.reduce((a,b)=>a+b,0);
  return cents.map(n=>(n+(remaining-->0?1:0))/100);
}
