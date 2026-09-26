import { md5 } from './md5';
import { randomFromAlphabet, randomInt } from '../secureRandom';
export const MAX_TEXT = 100_000;
// UTF-8 needs at most three bytes per UTF-16 code unit (astral pairs need four).
const MAX_UTF8_BYTES = MAX_TEXT * 3;
export const MAX_BASE64_INPUT = Math.ceil(MAX_UTF8_BYTES / 3) * 4 + MAX_TEXT;
export const MAX_BINARY_INPUT = MAX_UTF8_BYTES * 9;
function encodedInput(text: string, limit: number) {
  if (text.length > limit) throw new Error('Encoded input exceeds the supported text budget.');
  return text.replace(/\s/g, '');
}
function decodeUtf8(bytes: Uint8Array) {
  if (bytes.length > MAX_UTF8_BYTES) throw new Error('Decoded payload exceeds the supported text budget.');
  return bounded(new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes));
}
export function bounded(text: string) { if(text.length > MAX_TEXT) throw new Error('Input exceeds 100,000 characters.'); return text; }
export const hex = (b: Uint8Array) => Array.from(b, x=>x.toString(16).padStart(2,'0')).join('');
export async function digest(algorithm: string, text: string) {
  bounded(text);
  return algorithm === 'MD5' ? md5(text) : hex(new Uint8Array(await crypto.subtle.digest(algorithm, new TextEncoder().encode(text))));
}
export function encodeBase64(text: string) {
  return bytesBase64(new TextEncoder().encode(bounded(text)));
}
export function bytesBase64(bytes: Uint8Array) {
  let s=''; for(const b of bytes) s+=String.fromCharCode(b); return btoa(s);
}
export function decodeBase64(text: string) {
  let s=encodedInput(text, MAX_BASE64_INPUT);
  if (s.length > Math.ceil(MAX_UTF8_BYTES / 3) * 4) throw new Error('Decoded payload exceeds the supported text budget.');
  if(!s.includes('=') && s.length%4!==1)s+='='.repeat((4-s.length%4)%4);
  if(!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(s)) throw new Error('Invalid padded Base64.');
  const bin=atob(s); if(btoa(bin)!==s) throw new Error('Noncanonical Base64 padding bits.');
  return decodeUtf8(Uint8Array.from(bin,c=>c.charCodeAt(0)));
}
export function textToBinary(text: string) { return Array.from(new TextEncoder().encode(bounded(text)),b=>b.toString(2).padStart(8,'0')).join(' '); }
export function binaryToText(text: string) {
  const s=encodedInput(text, MAX_BINARY_INPUT);
  if (s.length > MAX_UTF8_BYTES * 8) throw new Error('Decoded payload exceeds the supported text budget.');
  if(!s || !/^[01]+$/.test(s) || s.length%8) throw new Error('Use complete 8-bit binary bytes containing only 0 and 1.');
  return decodeUtf8(Uint8Array.from(s.match(/.{8}/g)!,b=>parseInt(b,2)));
}
export const escapeJson = (s:string)=>JSON.stringify(bounded(s)).slice(1,-1);
export const unescapeJson = (s:string):string=>JSON.parse('"'+bounded(s)+'"');
export function decodeHtml(s:string) {
  // Decode entities individually: markup stays literal and entities are decoded once.
  const el=document.createElement('textarea');
  return bounded(s).replace(/&(?:#[xX][\da-fA-F]+|#\d+|[A-Za-z][\dA-Za-z]+);/g,entity=>{el.innerHTML=entity;return el.value;});
}
export function base64UrlBytes(s:string) {
  if(!/^[A-Za-z0-9_-]*$/.test(s) || s.length%4===1) throw new Error('Invalid Base64URL segment.');
  const bin=atob(s.replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-s.length%4)%4));
  if(btoa(bin).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_')!==s) throw new Error('Invalid Base64URL padding bits.');
  return Uint8Array.from(bin,c=>c.charCodeAt(0));
}
export function decodeJwt(token:string) {
  const parts=bounded(token.trim()).split('.');
  if(parts.length!==3 || !parts[0] || !parts[1]) throw new Error('A JWT has three dot-separated parts: header.payload.signature');
  const decoder=new TextDecoder('utf-8',{fatal:true});
  const rawHeader=decoder.decode(base64UrlBytes(parts[0])), rawPayload=decoder.decode(base64UrlBytes(parts[1]));
  const header=JSON.parse(rawHeader), payload=JSON.parse(rawPayload);
  for(const value of [header,payload]) if(!value || typeof value!=='object' || Array.isArray(value)) throw new Error('JWT header and payload must be JSON objects.');
  if(typeof header.alg!=='string') throw new Error('JWT header must include alg.');
  base64UrlBytes(parts[2]);
  for(const key of ['exp','iat','nbf']) if(key in payload && (typeof payload[key]!=='number' || !Number.isFinite(payload[key]))) throw new Error(key+' must be a finite NumericDate in seconds.');
  return {header:header as Record<string,unknown>,payload:payload as Record<string,unknown>,signature:parts[2],rawHeader,rawPayload,signingInput:parts[0]+'.'+parts[1]};
}
export function normalizeUuid(input:string) {
  let s=input.trim().replace(/^urn:uuid:/i,'');
  if(s.startsWith('{')&&s.endsWith('}')) s=s.slice(1,-1);
  if(!/^(?:[\da-f]{32}|[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})$/i.test(s)) throw new Error('Invalid UUID spelling. Use 32 hex digits or the 8-4-4-4-12 format.');
  return s.replace(/-/g,'').toLowerCase();
}
const dashed=(s:string)=>`${s.slice(0,8)}-${s.slice(8,12)}-${s.slice(12,16)}-${s.slice(16,20)}-${s.slice(20)}`;
export function uuidV7(now=Date.now()) {
  const b=crypto.getRandomValues(new Uint8Array(16)); let t=BigInt(now);
  for(let i=5;i>=0;i--){b[i]=Number(t&255n);t>>=8n;}
  b[6]=(b[6]&15)|0x70; b[8]=(b[8]&63)|0x80; return dashed(hex(b));
}
export function uuidV1(now=Date.now()) {
  const t=BigInt(now)*10000n+122192928000000000n;
  // A new random node and clock sequence per ID avoid same-tick reuse; set multicast bit.
  const b=crypto.getRandomValues(new Uint8Array(8)); b[0]=(b[0]&63)|128;b[2]|=1;
  return `${(t&0xffffffffn).toString(16).padStart(8,'0')}-${((t>>32n)&65535n).toString(16).padStart(4,'0')}-${(((t>>48n)&4095n)|4096n).toString(16)}-${hex(b.slice(0,2))}-${hex(b.slice(2))}`;
}
export function ulid(now=Date.now()) {
  const alphabet='0123456789ABCDEFGHJKMNPQRSTVWXYZ'; let t=now,s='';
  for(let i=0;i<10;i++){s=alphabet[t%32]+s;t=Math.floor(t/32);}
  return s+randomFromAlphabet(alphabet,16);
}
export function password(length:number, groups:string[]) {
  if(!Number.isInteger(length)||length<groups.length||length<1||length>256||!groups.length||groups.some(g=>!g)) throw new Error('Select character sets and a valid password length.');
  const chars=groups.map(g=>randomFromAlphabet(g,1)).concat([...randomFromAlphabet(groups.join(''),length-groups.length)]);
  for(let i=chars.length-1;i>0;i--){const j=randomInt(0,i);[chars[i],chars[j]]=[chars[j],chars[i]];}return chars.join('');
}
export function validateEmail(email:string):{valid:boolean;reason?:string} {
  if(!email) return {valid:false};
  const parts=email.split('@');if(parts.length!==2)return {valid:false,reason:'Use one @ symbol.'};
  const [local,domain]=parts;
  if(email.length>254||!local||local.length>64||local.startsWith('.')||local.endsWith('.')||local.includes('..')||!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local))return {valid:false,reason:'Invalid local part or address length.'};
  if(!/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(domain))return {valid:false,reason:'Invalid domain format.'};
  return {valid:true};
}
export function luhn(card:string) {
  if(!/^[\d -]+$/.test(card))return false;
  const s=card.replace(/[ -]/g,'');if(s.length<13||s.length>19||/^0+$/.test(s))return false;
  let sum=0;for(let i=s.length-1,alt=false;i>=0;i--,alt=!alt){let d=Number(s[i]);if(alt){d*=2;if(d>9)d-=9;}sum+=d;}return sum%10===0;
}

export async function copySecurityText(text: string) {
  if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) throw new Error('Clipboard is not available.');
  await navigator.clipboard.writeText(text);
}
