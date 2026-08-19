'use client';

import { useMemo, useState } from 'react';

const SAMPLE = '{\n  "user": {\n    "id": 42,\n    "name": "Ada Lovelace",\n    "roles": ["admin", "editor"]\n  },\n  "items": [\n    { "sku": "A100", "qty": 3 },\n    { "sku": "B200", "qty": 1 }\n  ],\n  "active": true,\n  "notes": null\n}';

function isContainer(v: unknown): v is Record<string, unknown> | unknown[] {
  return v !== null && typeof v === 'object';
}

function childPath(parentPath: string, key: string, isArray: boolean): string {
  if (isArray) return `${parentPath}[${key}]`;
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? `${parentPath}.${key}` : `${parentPath}["${key}"]`;
}

function entriesOf(value: Record<string, unknown> | unknown[]): [string, unknown][] {
  return Array.isArray(value) ? value.map((v, i) => [String(i), v] as [string, unknown]) : Object.entries(value);
}

function collectContainerPaths(value: unknown, path: string, out: Set<string>) {
  if (!isContainer(value)) return;
  out.add(path);
  for (const [k, v] of entriesOf(value)) {
    collectContainerPaths(v, childPath(path, k, Array.isArray(value)), out);
  }
}

/** Scans the tree for a case-insensitive key/value match; returns true if this node or any descendant matched. */
function scanMatches(value: unknown, path: string, key: string, needle: string, matched: Set<string>, autoExpand: Set<string>): boolean {
  let isMatch = key.toLowerCase().includes(needle);
  if (!isContainer(value) && !isMatch) {
    isMatch = String(value).toLowerCase().includes(needle);
  }
  let descendantMatch = false;
  if (isContainer(value)) {
    for (const [k, v] of entriesOf(value)) {
      if (scanMatches(v, childPath(path, k, Array.isArray(value)), k, needle, matched, autoExpand)) {
        descendantMatch = true;
      }
    }
  }
  if (isMatch) matched.add(path);
  if (isMatch || descendantMatch) {
    if (isContainer(value)) autoExpand.add(path);
    return true;
  }
  return false;
}

function typeColor(v: unknown): string {
  if (v === null) return 'var(--fg-3)';
  switch (typeof v) {
    case 'string': return 'var(--green)';
    case 'number': return 'var(--blue)';
    case 'boolean': return 'var(--purple)';
    default: return 'var(--fg-0)';
  }
}

function displayValue(v: unknown): string {
  if (v === null) return 'null';
  if (typeof v === 'string') return `"${v}"`;
  return String(v);
}

interface SharedTreeProps {
  expandedPaths: Set<string>;
  autoExpand: Set<string>;
  matchedPaths: Set<string>;
  onToggle: (path: string) => void;
  onCopyPath: (path: string) => void;
}

function TreeNode({ label, value, path, depth, shared }: {
  label: string;
  value: unknown;
  path: string;
  depth: number;
  shared: SharedTreeProps;
}) {
  const { expandedPaths, autoExpand, matchedPaths, onToggle, onCopyPath } = shared;
  const expanded = expandedPaths.has(path) || autoExpand.has(path);
  const matched = matchedPaths.has(path);
  const [copied, setCopied] = useState(false);

  const copy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopyPath(path);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const rowStyle: React.CSSProperties = {
    paddingLeft: depth * 16,
    fontFamily: 'var(--f-mono)',
    fontSize: 12.5,
    lineHeight: 1.9,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: matched ? 'var(--amber-tint)' : 'transparent',
    borderRadius: 4,
  };

  if (!isContainer(value)) {
    return (
      <div style={rowStyle}>
        <span style={{ width: 10, display: 'inline-block' }} />
        <span style={{ color: 'var(--fg-2)' }}>{label}:</span>
        <span style={{ color: typeColor(value) }}>{displayValue(value)}</span>
        <button type="button" onClick={copy} className="tb-v2-btn-sm" style={{ marginLeft: 'auto', opacity: 0.7 }} title="Copy path">
          {copied ? 'Copied' : 'Copy path'}
        </button>
      </div>
    );
  }

  const entries = entriesOf(value);
  const isArray = Array.isArray(value);
  const [openB, closeB] = isArray ? ['[', ']'] : ['{', '}'];
  const count = entries.length;

  return (
    <div>
      <div style={rowStyle}>
        <button
          type="button"
          onClick={() => onToggle(path)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', gap: 6, color: 'inherit', font: 'inherit', flex: 1, textAlign: 'left' }}
          aria-expanded={expanded}
        >
          <span style={{ color: 'var(--fg-3)', width: 10, display: 'inline-block' }}>{expanded ? '▾' : '▸'}</span>
          <span style={{ color: 'var(--fg-2)' }}>{label}:</span>
          <span style={{ color: 'var(--fg-3)' }}>
            {openB}{!expanded && `${count} item${count === 1 ? '' : 's'}${closeB}`}
          </span>
        </button>
        <button type="button" onClick={copy} className="tb-v2-btn-sm" style={{ opacity: 0.7 }} title="Copy path">
          {copied ? 'Copied' : 'Copy path'}
        </button>
      </div>
      {expanded && (
        <>
          {entries.map(([k, v]) => (
            <TreeNode key={k} label={isArray ? `[${k}]` : k} value={v} path={childPath(path, k, isArray)} depth={depth + 1} shared={shared} />
          ))}
          <div style={{ paddingLeft: (depth + 1) * 16, color: 'var(--fg-3)', fontFamily: 'var(--f-mono)', fontSize: 12.5 }}>{closeB}</div>
        </>
      )}
    </div>
  );
}

export default function JsonTreeViewClient() {
  const [input, setInput] = useState(SAMPLE);
  const [search, setSearch] = useState('');
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(['data']));
  const [copiedRoot, setCopiedRoot] = useState(false);

  const { value: parsed, error } = useMemo(() => {
    if (!input.trim()) return { value: undefined, error: '' };
    try {
      return { value: JSON.parse(input) as unknown, error: '' };
    } catch (e) {
      return { value: undefined, error: (e as Error).message };
    }
  }, [input]);

  const allContainerPaths = useMemo(() => {
    const out = new Set<string>();
    if (parsed !== undefined) collectContainerPaths(parsed, 'data', out);
    return out;
  }, [parsed]);

  const { matchedPaths, autoExpand } = useMemo(() => {
    const matched = new Set<string>();
    const auto = new Set<string>();
    if (parsed !== undefined && search.trim()) {
      scanMatches(parsed, 'data', 'data', search.trim().toLowerCase(), matched, auto);
    }
    return { matchedPaths: matched, autoExpand: auto };
  }, [parsed, search]);

  const toggle = (path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const copyPath = (path: string) => {
    navigator.clipboard.writeText(path).catch(() => {});
  };

  const expandAll = () => setExpandedPaths(new Set(allContainerPaths));
  const collapseAll = () => setExpandedPaths(new Set());

  const copyRootPath = () => {
    navigator.clipboard.writeText('data').catch(() => {});
    setCopiedRoot(true);
    setTimeout(() => setCopiedRoot(false), 1200);
  };

  const shared: SharedTreeProps = {
    expandedPaths,
    autoExpand,
    matchedPaths,
    onToggle: toggle,
    onCopyPath: copyPath,
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">JSON</span>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste JSON to explore…"
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)', minHeight: 180 }}
        spellCheck={false}
        aria-label="JSON input"
      />

      {error && (
        <p className="tb-v2-error" role="alert" style={{ marginTop: 12 }}>
          <strong>Syntax error:</strong> {error}
        </p>
      )}

      {parsed !== undefined && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Tree</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search keys/values…"
                className="tb-v2-input"
                style={{ width: 180, height: 30, padding: '0 10px', fontSize: 12.5 }}
                aria-label="Search JSON tree"
              />
              <button type="button" onClick={expandAll} className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm">Expand all</button>
              <button type="button" onClick={collapseAll} className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm">Collapse all</button>
            </div>
          </div>
          <div className="tb-v2-tool-output-body">
            {search.trim() && matchedPaths.size === 0 && (
              <p className="tb-v2-empty">No keys or values match &quot;{search}&quot;.</p>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: 12.5, color: 'var(--fg-2)' }}>data (root)</span>
              <button type="button" onClick={copyRootPath} className="tb-v2-btn-sm" style={{ opacity: 0.7 }} title="Copy path">
                {copiedRoot ? 'Copied' : 'Copy path'}
              </button>
            </div>
            <TreeNode label="data" value={parsed} path="data" depth={0} shared={shared} />
          </div>
        </>
      )}
    </div>
  );
}
