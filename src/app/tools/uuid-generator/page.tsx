'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

export const toolMeta = {
  name: 'UUID v7 Generator',
  description:
    'Generate time-ordered UUID v7 values with timestamp breakdown, batch generation, and format options. 100% client-side — nothing leaves your browser.',
  category: 'developer',
};

// ─── UUID v7 implementation ───────────────────────────────────────────────────

function generateUuidV7(): string {
  const now = BigInt(Date.now());

  // 48-bit Unix timestamp in milliseconds
  const t0 = Number((now >> 40n) & 0xffn);
  const t1 = Number((now >> 32n) & 0xffn);
  const t2 = Number((now >> 24n) & 0xffn);
  const t3 = Number((now >> 16n) & 0xffn);
  const t4 = Number((now >> 8n) & 0xffn);
  const t5 = Number(now & 0xffn);

  const rand = new Uint8Array(10);
  crypto.getRandomValues(rand);

  // Byte 6: version 7 (0111) in high nibble + 4 random bits
  const b6 = 0x70 | (rand[0] & 0x0f);
  // Byte 7: 8 random bits (rand_a low byte)
  const b7 = rand[1];
  // Byte 8: variant 10xx in high 2 bits + 6 random bits
  const b8 = 0x80 | (rand[2] & 0x3f);
  // Bytes 9-15: rand_b
  const [b9, b10, b11, b12, b13, b14, b15] = rand.slice(3);

  const h = (b: number) => b.toString(16).padStart(2, '0');
  return (
    `${h(t0)}${h(t1)}${h(t2)}${h(t3)}-` +
    `${h(t4)}${h(t5)}-` +
    `${h(b6)}${h(b7)}-` +
    `${h(b8)}${h(b9)}-` +
    `${h(b10)}${h(b11)}${h(b12)}${h(b13)}${h(b14)}${h(b15)}`
  );
}

// ─── UUID v7 parser ───────────────────────────────────────────────────────────

interface UuidInfo {
  timestampMs: number;
  date: Date;
  version: number;
  variant: string;
  randA: string;
  randB: string;
}

function parseUuidV7(uuid: string): UuidInfo | null {
  const clean = uuid.replace(/-/g, '');
  if (clean.length !== 32) return null;

  // Timestamp: first 48 bits = 12 hex chars
  const tsHex = clean.slice(0, 12);
  const timestampMs = Number(BigInt('0x' + tsHex));

  // Version nibble (char 12)
  const version = parseInt(clean[12], 16);

  // Variant (top 2 bits of char 16)
  const variantNibble = parseInt(clean[16], 16);
  const variantBits = variantNibble >> 2;
  const variant = variantBits === 2 ? 'RFC 9562 / RFC 4122 (10xx)' : `Other (${variantBits.toString(2).padStart(2, '0')}xx)`;

  // rand_a: chars 13–15 (12 bits)
  const randA = clean.slice(13, 16);

  // rand_b: chars 17–31 (60 bits)
  const randB = clean.slice(17, 32);

  return { timestampMs, date: new Date(timestampMs), version, variant, randA, randB };
}

// ─── Format helpers ───────────────────────────────────────────────────────────

type DisplayFormat = 'standard' | 'nodashes' | 'uppercase';

function applyFormat(uuid: string, fmt: DisplayFormat): string {
  switch (fmt) {
    case 'nodashes':
      return uuid.replace(/-/g, '');
    case 'uppercase':
      return uuid.toUpperCase();
    default:
      return uuid;
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [text]);

  return (
    <button
      onClick={copy}
      className="text-xs px-2 py-0.5 rounded transition-colors text-gray-500 hover:text-white"
      aria-label={label ?? 'Copy'}
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start gap-4 py-2 border-b border-gray-800 last:border-0">
      <span className="text-xs text-gray-500 uppercase tracking-wide w-32 shrink-0 pt-0.5">{label}</span>
      <span className={`text-sm text-gray-200 break-all ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const BATCH_SIZES = [1, 5, 10, 25, 100] as const;
type BatchSize = (typeof BATCH_SIZES)[number];

const FORMAT_LABELS: Record<DisplayFormat, string> = {
  standard: 'Standard',
  nodashes: 'No dashes',
  uppercase: 'UPPERCASE',
};

export default function UuidV7GeneratorPage() {
  const [uuids, setUuids] = useState<string[]>(() => [generateUuidV7()]);
  const [batchSize, setBatchSize] = useState<BatchSize>(1);
  const [format, setFormat] = useState<DisplayFormat>('standard');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedAll, setCopiedAll] = useState(false);

  const generate = useCallback(() => {
    const next = Array.from({ length: batchSize }, () => generateUuidV7());
    setUuids(next);
    setSelectedIndex(0);
  }, [batchSize]);

  const copyAll = useCallback(async () => {
    await navigator.clipboard.writeText(
      uuids.map((u) => applyFormat(u, format)).join('\n')
    );
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  }, [uuids, format]);

  const selected = uuids[selectedIndex] ?? uuids[0];
  const info = selected ? parseUuidV7(selected) : null;

  return (
    <>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="border-b border-gray-800 bg-gray-900/40">
        <div className="max-w-4xl mx-auto px-4 py-2 text-sm text-gray-500 flex gap-2">
          <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-gray-300 transition-colors">Tools</Link>
          <span>/</span>
          <span className="text-gray-300" aria-current="page">UUID v7 Generator</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🔑</span>
            <h1 className="text-2xl font-bold text-white">UUID v7 Generator</h1>
          </div>
          <p className="text-gray-400">{toolMeta.description}</p>
          <span className="inline-block mt-2 text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
            Developer
          </span>
        </div>

        {/* Tool */}
        <section aria-label="Tool" className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <button
              onClick={generate}
              className="bg-green-600 hover:bg-green-500 text-black font-semibold px-5 py-2 rounded-lg text-sm transition-colors"
            >
              Generate
            </button>

            {/* Batch size */}
            <div className="flex items-center gap-1">
              {BATCH_SIZES.map((n) => (
                <button
                  key={n}
                  onClick={() => setBatchSize(n)}
                  className={`text-sm px-3 py-1.5 rounded-full transition-colors ${
                    batchSize === n
                      ? 'bg-green-600 text-black font-medium'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Format selector */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-gray-500 uppercase tracking-wide">Format</span>
            <div className="flex gap-1">
              {(Object.keys(FORMAT_LABELS) as DisplayFormat[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`text-xs px-3 py-1 rounded-full transition-colors ${
                    format === f
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {FORMAT_LABELS[f]}
                </button>
              ))}
            </div>
          </div>

          {/* UUID list */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg font-mono text-sm divide-y divide-gray-700/60 mb-4 max-h-72 overflow-y-auto">
            {uuids.map((uuid, i) => (
              <div
                key={i}
                onClick={() => setSelectedIndex(i)}
                className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                  i === selectedIndex ? 'bg-gray-700/60' : 'hover:bg-gray-700/30'
                }`}
              >
                <span className="text-gray-600 w-7 shrink-0 text-right select-none">{i + 1}</span>
                <span className="text-green-400 flex-1 truncate">{applyFormat(uuid, format)}</span>
                <CopyButton text={applyFormat(uuid, format)} label={`Copy UUID ${i + 1}`} />
              </div>
            ))}
          </div>

          {/* Footer row */}
          <div className="flex items-center gap-4">
            <button
              onClick={copyAll}
              className="text-sm text-green-400 hover:text-green-300 transition-colors"
            >
              {copiedAll ? 'Copied!' : `Copy all (${uuids.length})`}
            </button>
            <button
              onClick={generate}
              className="text-sm text-gray-500 hover:text-white transition-colors"
            >
              Regenerate
            </button>
          </div>
        </section>

        {/* Info panel */}
        {info && (
          <section aria-label="UUID breakdown" className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
            <h2 className="text-sm font-semibold text-white mb-1">UUID Breakdown</h2>
            <p className="text-xs text-gray-500 mb-4">
              Showing breakdown for UUID {selectedIndex + 1}
              {uuids.length > 1 ? ' — click a row above to inspect another' : ''}
            </p>

            {/* Visual structure */}
            <div className="font-mono text-xs mb-5 flex flex-wrap gap-0">
              {(() => {
                const u = selected;
                const parts = [
                  { value: u.slice(0, 8),  title: 'Timestamp (bits 0–31)',  color: 'text-blue-400' },
                  { value: '-',             title: '',                        color: 'text-gray-600' },
                  { value: u.slice(9, 13),  title: 'Timestamp (bits 32–47)', color: 'text-blue-300' },
                  { value: '-',             title: '',                        color: 'text-gray-600' },
                  { value: u.slice(14, 15), title: 'Version = 7',             color: 'text-yellow-400' },
                  { value: u.slice(15, 18), title: 'rand_a (12 bits)',        color: 'text-purple-400' },
                  { value: '-',             title: '',                        color: 'text-gray-600' },
                  { value: u.slice(19, 20), title: 'Variant (10xx)',          color: 'text-orange-400' },
                  { value: u.slice(20, 23), title: 'rand_b start',            color: 'text-pink-400' },
                  { value: '-',             title: '',                        color: 'text-gray-600' },
                  { value: u.slice(24),     title: 'rand_b (remaining)',      color: 'text-pink-300' },
                ];
                return parts.map((p, i) =>
                  p.title ? (
                    <span key={i} title={p.title} className={`${p.color} underline decoration-dotted cursor-help`}>
                      {p.value}
                    </span>
                  ) : (
                    <span key={i} className={p.color}>{p.value}</span>
                  )
                );
              })()}
            </div>

            <div className="space-y-0">
              <InfoRow
                label="Timestamp"
                value={info.date.toISOString()}
              />
              <InfoRow
                label="Unix ms"
                value={info.timestampMs.toLocaleString()}
                mono
              />
              <InfoRow
                label="Version"
                value={`${info.version} (time-ordered)`}
              />
              <InfoRow
                label="Variant"
                value={info.variant}
              />
              <InfoRow
                label="rand_a"
                value={`0x${info.randA} — 12 random bits after version nibble`}
                mono
              />
              <InfoRow
                label="rand_b"
                value={`0x${info.randB} — 60 random bits (after variant bits)`}
                mono
              />
            </div>
          </section>
        )}

        {/* Explainer */}
        <section aria-label="About UUID v7" className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-sm font-semibold text-white mb-4">What is UUID v7?</h2>
          <div className="space-y-3 text-sm text-gray-400 leading-relaxed">
            <p>
              UUID v7 (defined in{' '}
              <span className="text-gray-300 font-medium">RFC 9562</span>, 2024) is a time-ordered universally unique
              identifier. Unlike UUID v4 which is purely random, v7 embeds a{' '}
              <span className="text-green-400">48-bit Unix timestamp</span> in the most-significant bits, making
              UUIDs generated later sort higher lexicographically.
            </p>
            <p>
              This makes UUID v7 ideal for{' '}
              <span className="text-gray-300 font-medium">database primary keys</span>: records inserted later
              naturally cluster at the end of B-tree indexes, avoiding the random page splits that plague UUID v4
              and leading to better write performance (similar to auto-increment IDs, but globally unique).
            </p>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 font-mono text-xs">
              <div className="text-gray-500 mb-2">// Structure (128 bits)</div>
              <div>
                <span className="text-blue-400">unix_ts_ms</span>
                <span className="text-gray-600"> [48 bits]  </span>
                <span className="text-gray-500">← millisecond precision timestamp</span>
              </div>
              <div>
                <span className="text-yellow-400">ver</span>
                <span className="text-gray-600">       [4 bits]   </span>
                <span className="text-gray-500">← always 0111 (7)</span>
              </div>
              <div>
                <span className="text-purple-400">rand_a</span>
                <span className="text-gray-600">    [12 bits]  </span>
                <span className="text-gray-500">← random (or monotonic seq)</span>
              </div>
              <div>
                <span className="text-orange-400">var</span>
                <span className="text-gray-600">       [2 bits]   </span>
                <span className="text-gray-500">← always 10 (RFC 4122 variant)</span>
              </div>
              <div>
                <span className="text-pink-400">rand_b</span>
                <span className="text-gray-600">    [62 bits]  </span>
                <span className="text-gray-500">← random bits</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {[
                { icon: '⏱️', title: 'Time-ordered', desc: 'Sorts chronologically — great for indexed columns' },
                { icon: '🌐', title: 'Globally unique', desc: 'Random bits ensure no collisions across nodes' },
                { icon: '📦', title: 'DB friendly', desc: 'Avoids B-tree fragmentation from random UUIDs' },
              ].map((item) => (
                <div key={item.title} className="bg-gray-800 border border-gray-700 rounded-lg p-3">
                  <div className="text-lg mb-1">{item.icon}</div>
                  <div className="text-xs font-semibold text-gray-200 mb-1">{item.title}</div>
                  <div className="text-xs text-gray-500">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <p className="text-xs text-gray-600 text-center">
          🔒 100% client-side — your data never leaves your browser
        </p>
      </div>
    </>
  );
}
