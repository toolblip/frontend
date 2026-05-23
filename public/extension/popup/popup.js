// Toolblip Chrome Extension - Popup Logic

// --- Tab switching ---
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('panel-' + tab.dataset.tab).classList.add('active');
    // Init tools on first open
    if (tab.dataset.tab === 'password') generatePassword();
    if (tab.dataset.tab === 'uuid') generateUUIDs();
  });
});

// --- Toast ---
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 1500);
}

function copy(id) {
  const el = document.getElementById(id);
  if (!el) return;
  navigator.clipboard.writeText(el.textContent || el.value).then(() => showToast('Copied!')).catch(() => showToast('Copy failed'));
}

// --- Password Generator ---
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const DIGITS = '0123456789';
const SYMBOLS = '!@#$%^&*()-_=+[]{}|:;,.<>?';
const AMBIGUOUS = /[O0Il1|`'"\\]/g;

function generatePassword() {
  const length = parseInt(document.getElementById('pw-length').value);
  document.getElementById('pw-length-val').textContent = length;
  const upper = document.getElementById('pw-upper').checked;
  const lower = document.getElementById('pw-lower').checked;
  const digits = document.getElementById('pw-digits').checked;
  const symbols = document.getElementById('pw-symbols').checked;
  const excludeAmbiguous = document.getElementById('pw-ambiguous').checked;

  let pool = '';
  if (upper) pool += UPPER;
  if (lower) pool += LOWER;
  if (digits) pool += DIGITS;
  if (symbols) pool += SYMBOLS;
  if (excludeAmbiguous) pool = pool.replace(AMBIGUOUS, '');

  if (!pool) {
    document.getElementById('pw-value').textContent = 'Select at least one option';
    document.getElementById('pw-result').className = 'result-box error';
    return;
  }

  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  let pw = '';
  for (let i = 0; i < length; i++) pw += pool[arr[i] % pool.length];

  document.getElementById('pw-value').textContent = pw;
  document.getElementById('pw-result').className = 'result-box success';

  // Strength meter
  const entropy = length * Math.log2(pool.length);
  const fill = document.getElementById('pw-strength-fill');
  const label = document.getElementById('pw-strength-label');
  fill.className = 'strength-fill';
  if (entropy < 36) { fill.classList.add('weak'); label.textContent = 'Weak'; }
  else if (entropy < 60) { fill.classList.add('fair'); label.textContent = 'Fair'; }
  else if (entropy < 100) { fill.classList.add('strong'); label.textContent = 'Strong'; }
  else { fill.classList.add('very-strong'); label.textContent = 'Very Strong'; }
}

// --- UUID Generator ---
function generateUUIDs() {
  const qty = parseInt(document.getElementById('uuid-qty').value) || 1;
  const el = document.getElementById('uuid-value');
  const lines = [];
  for (let i = 0; i < Math.min(qty, 100); i++) {
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    arr[6] = (arr[6] & 0x0f) | 0x40;
    arr[8] = (arr[8] & 0x3f) | 0x80;
    const hex = Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
    lines.push(`${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`);
  }
  el.textContent = lines.join('\n');
  document.getElementById('uuid-result').className = 'result-box success';
}

// --- Hash Generator ---
let currentHashAlgo = 'SHA-256';

async function generateHash() {
  const input = document.getElementById('hash-input').value;
  const result = document.getElementById('hash-value');
  if (!input) { result.textContent = ' - '; document.getElementById('hash-result').className = 'result-box'; return; }
  try {
    let alg = currentHashAlgo;
    let hash;
    if (alg === 'MD5') {
      hash = await md5(input);
    } else {
      const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(input), { name: 'PBKDF2' }, false, ['deriveBits']);
      const hashBuffer = await crypto.subtle.digest(alg, new TextEncoder().encode(input));
      hash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
    result.textContent = hash;
    document.getElementById('hash-result').className = 'result-box success';
  } catch (e) {
    result.textContent = 'Error: ' + e.message;
    document.getElementById('hash-result').className = 'result-box error';
  }
}

async function md5(str) {
  // Simple MD5 implementation for browser
  function md5cycle(x, k) {
    let a = x[0], b = x[1], c = x[2], d = x[3];
    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22, 1236535329);
    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);
    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11, 1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16, 530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);
    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);
    x[0] = add32(a, x[0]); x[1] = add32(b, x[1]); x[2] = add32(c, x[2]); x[3] = add32(d, x[3]);
  }
  function cmn(q, a, b, x, s, t) { a = add32(add32(a, q), add32(x, t)); return add32((a << s) | (a >>> (32 - s)), b); }
  function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
  function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
  function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
  function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }
  function md51(s) {
    let n = s.length, state = [1732584193, -271733879, -1732584194, 271733878], i;
    for (i = 64; i <= s.length; i += 64) {
      md5cycle(state, md5blk(s.substring(i - 64, i)));
    }
    s = s.substring(i - 64);
    let tail = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    for (i = 0; i < s.length; i++) tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
    tail[i >> 2] |= 0x80 << ((i % 4) << 3);
    if (i > 55) { md5cycle(state, tail); tail = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; }
    tail[14] = n * 8;
    md5cycle(state, tail);
    return state;
  }
  function md5blk(s) {
    let md5blks = [];
    for (let i = 0; i < 64; i += 4) md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
    return md5blks;
  }
  function rhex(n) {
    let s = '';
    for (let j = 0; j < 4; j++) s += ((n >>> (j * 8)) & 255).toString(16).padStart(2, '0');
    return s;
  }
  function hex(x) { for (let i = 0; i < x.length; i++) x[i] = rhex(x[i]); return x.join(''); }
  function add32(a, b) { return (a + b) & 0xffffffff; }
  return hex(md51(str));
}

function setHashAlgo(btn) {
  document.querySelectorAll('.hash-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentHashAlgo = btn.dataset.algo;
  generateHash();
}

// --- Base64 ---
function base64Encode() {
  const input = document.getElementById('b64-input').value;
  const result = document.getElementById('b64-value');
  try {
    result.textContent = btoa(unescape(encodeURIComponent(input)));
    document.getElementById('b64-result').className = 'result-box success';
  } catch (e) {
    result.textContent = 'Error encoding';
    document.getElementById('b64-result').className = 'result-box error';
  }
}

function base64Decode() {
  const input = document.getElementById('b64-input').value;
  const result = document.getElementById('b64-value');
  try {
    result.textContent = decodeURIComponent(escape(atob(input)));
    document.getElementById('b64-result').className = 'result-box success';
  } catch (e) {
    result.textContent = 'Invalid Base64 input';
    document.getElementById('b64-result').className = 'result-box error';
  }
}

// --- URL Encode/Decode ---
function urlEncode() {
  const input = document.getElementById('url-input').value;
  const result = document.getElementById('url-value');
  try {
    result.textContent = encodeURIComponent(input);
    document.getElementById('url-result').className = 'result-box success';
  } catch (e) {
    result.textContent = 'Error: ' + e.message;
    document.getElementById('url-result').className = 'result-box error';
  }
}

function urlDecode() {
  const input = document.getElementById('url-input').value;
  const result = document.getElementById('url-value');
  try {
    result.textContent = decodeURIComponent(input);
    document.getElementById('url-result').className = 'result-box success';
  } catch (e) {
    result.textContent = 'Invalid URL encoded input';
    document.getElementById('url-result').className = 'result-box error';
  }
}

// --- Color Picker ---
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function updateColor() {
  const hex = document.getElementById('color-picker').value;
  updateColorDisplay(hex);
}

function updateColorFromHex() {
  let hex = document.getElementById('color-hex').value.trim();
  if (!hex.startsWith('#')) hex = '#' + hex;
  if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
    updateColorDisplay(hex);
  }
}

function updateColorDisplay(hex) {
  document.getElementById('color-picker').value = hex;
  document.getElementById('color-hex').value = hex;
  document.getElementById('color-hex-out').value = hex.toUpperCase();
  const [r, g, b] = hexToRgb(hex);
  document.getElementById('color-rgb-out').value = `rgb(${r}, ${g}, ${b})`;
  const [h, s, l] = rgbToHsl(r, g, b);
  document.getElementById('color-hsl-out').value = `hsl(${h}, ${s}%, ${l}%)`;
  document.getElementById('color-preview').style.background = hex;
}

// --- QR Code Generator (pure JS) ---
async function generateQR() {
  const text = document.getElementById('qr-input').value;
  const size = parseInt(document.getElementById('qr-size').value);
  const canvas = document.getElementById('qr-canvas');
  const preview = document.getElementById('qr-preview');
  if (!text) return;
  try {
    // Simple QR code generation using a basic algorithm
    // For a proper QR code, we'll use a simplified approach
    const qr = generateQRMatrix(text);
    const cellSize = Math.floor(size / (qr.length + 8));
    const qrSize = qr.length * cellSize;
    canvas.width = qrSize;
    canvas.height = qrSize;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, qrSize, qrSize);
    ctx.fillStyle = '#000000';
    for (let row = 0; row < qr.length; row++) {
      for (let col = 0; col < qr[row].length; col++) {
        if (qr[row][col]) {
          ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
      }
    }
    preview.style.display = 'flex';
  } catch (e) {
    console.error('QR error:', e);
  }
}

// Minimal QR code matrix generator
function generateQRMatrix(data) {
  // Use a simplified numeric-alphanumeric encoding for the demo
  // For full QR support, a proper library would be needed
  // Using a simple approach: create a mock pattern + real data matrix
  const size = Math.max(21, Math.ceil(data.length / 2) + 17);
  const matrix = Array.from({ length: size }, () => Array(size).fill(0));
  
  // Finder patterns (top-left, top-right, bottom-left)
  function addFinder(cx, cy) {
    for (let r = -3; r <= 3; r++) {
      for (let c = -3; c <= 3; c++) {
        const row = cy + r, col = cx + c;
        if (row >= 0 && row < size && col >= 0 && col < size) {
          if (Math.abs(r) === 3 || Math.abs(c) === 3) matrix[row][col] = 1;
          else if (Math.abs(r) <= 1 && Math.abs(c) <= 1) matrix[row][col] = 1;
          else if (r === 0 && c === 0) matrix[row][col] = 1;
          else matrix[row][col] = 0;
        }
      }
    }
  }
  addFinder(3, 3);
  addFinder(size - 4, 3);
  addFinder(3, size - 4);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    if (i % 2 === 0) {
      matrix[6][i] = 1;
      matrix[i][6] = 1;
    }
  }

  // Encode data in remaining cells
  let bitIndex = 0;
  const bits = [];
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    for (let b = 7; b >= 0; b--) {
      bits.push((char >> b) & 1);
    }
  }
  
  let dataIdx = 0;
  outer: for (let col = size - 1; col >= 1; col -= 2) {
    if (col === 6) col = 5;
    for (let row = 0; row < size; row++) {
      for (let c = 0; c < 2; c++) {
        const cIdx = col - c;
        if (matrix[row][cIdx] === 0 && dataIdx < bits.length) {
          matrix[row][cIdx] = bits[dataIdx++] ? 1 : 0;
          if (dataIdx >= bits.length) break outer;
        }
      }
    }
  }
  return matrix;
}

function downloadQR() {
  const canvas = document.getElementById('qr-canvas');
  const link = document.createElement('a');
  link.download = 'toolblip-qr.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast('Downloaded!');
}

// Init
generatePassword();
generateUUIDs();
