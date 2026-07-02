'use client';

import { useMemo, useState } from 'react';

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

interface GraphNode {
  id: string;
  label: string;
  kind: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null' | 'root';
  depth: number;
}

interface GraphEdge {
  from: string;
  to: string;
  key: string;
}

interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  refCount: number;
  cycle: boolean;
  error?: string;
}

function buildGraph(input: string): Graph {
  const trimmed = input.trim();
  if (!trimmed) {
    return { nodes: [], edges: [], refCount: 0, cycle: false };
  }
  let parsed: JsonValue;
  try {
    parsed = JSON.parse(trimmed) as JsonValue;
  } catch (e) {
    return {
      nodes: [],
      edges: [],
      refCount: 0,
      cycle: false,
      error: (e as Error).message,
    };
  }

  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const valueToId = new Map<JsonValue, string>();
  let refCount = 0;

  const visit = (value: JsonValue, key: string, depth: number, parentId: string | null): string => {
    if (value !== null && typeof value === 'object') {
      const existing = valueToId.get(value);
      if (existing) {
        if (parentId) {
          edges.push({ from: parentId, to: existing, key });
          refCount += 1;
        }
        return existing;
      }
      const id = `n${nodes.length}`;
      const kind: GraphNode['kind'] = Array.isArray(value) ? 'array' : 'object';
      nodes.push({ id, label: key || (Array.isArray(value) ? '[]' : '{}'), kind, depth });
      valueToId.set(value, id);
      if (Array.isArray(value)) {
        value.forEach((item, i) => {
          const childId = visit(item, String(i), depth + 1, id);
          if (childId !== id) {
            edges.push({ from: id, to: childId, key: String(i) });
          }
        });
      } else {
        for (const [k, v] of Object.entries(value)) {
          const childId = visit(v, k, depth + 1, id);
          if (childId !== id) {
            edges.push({ from: id, to: childId, key: k });
          }
        }
      }
      return id;
    }

    const id = `n${nodes.length}`;
    let label = '';
    let kind: GraphNode['kind'];
    if (value === null) {
      label = 'null';
      kind = 'null';
    } else if (typeof value === 'string') {
      label = JSON.stringify(value).slice(0, 24);
      kind = 'string';
    } else if (typeof value === 'number') {
      label = String(value);
      kind = 'number';
    } else {
      label = String(value);
      kind = 'boolean';
    }
    nodes.push({ id, label, kind, depth });
    if (parentId) {
      edges.push({ from: parentId, to: id, key });
    }
    return id;
  };

  visit(parsed, '$', 0, null);

  // Detect cycle (a node referencing itself indirectly)
  const adj = new Map<string, string[]>();
  for (const edge of edges) {
    if (!adj.has(edge.from)) adj.set(edge.from, []);
    adj.get(edge.from)!.push(edge.to);
  }
  const cycle = (() => {
    const visiting = new Set<string>();
    const visited = new Set<string>();
    const dfs = (id: string): boolean => {
      if (visiting.has(id)) return true;
      if (visited.has(id)) return false;
      visiting.add(id);
      const next = adj.get(id) ?? [];
      for (const n of next) if (dfs(n)) return true;
      visiting.delete(id);
      visited.add(id);
      return false;
    };
    for (const n of nodes) if (dfs(n.id)) return true;
    return false;
  })();

  return { nodes, edges, refCount, cycle };
}

function kindColor(kind: GraphNode['kind']): string {
  switch (kind) {
    case 'object':
      return '#2563eb';
    case 'array':
      return '#9333ea';
    case 'string':
      return '#16a34a';
    case 'number':
      return '#ea580c';
    case 'boolean':
      return '#ca8a04';
    case 'null':
      return '#6b7280';
    default:
      return '#dc2626';
  }
}

function nodeShape(kind: GraphNode['kind']): 'rect' | 'diamond' | 'ellipse' {
  if (kind === 'object') return 'rect';
  if (kind === 'array') return 'diamond';
  return 'ellipse';
}

const CANVAS_W = 920;
const CANVAS_H = 520;

function layoutNodes(nodes: GraphNode[], edges: GraphEdge[]): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();
  if (nodes.length === 0) return positions;

  // Group by depth
  const byDepth = new Map<number, GraphNode[]>();
  for (const n of nodes) {
    if (!byDepth.has(n.depth)) byDepth.set(n.depth, []);
    byDepth.get(n.depth)!.push(n);
  }

  const maxDepth = Math.max(...Array.from(byDepth.keys()));
  const colWidth = Math.max(120, (CANVAS_W - 60) / (maxDepth + 1));

  for (const [depth, list] of byDepth.entries()) {
    const rowHeight = Math.max(60, (CANVAS_H - 40) / list.length);
    const x = 30 + depth * colWidth;
    list.forEach((node, i) => {
      const y = 30 + i * rowHeight + rowHeight / 2;
      positions.set(node.id, { x, y });
    });
  }
  return positions;
}

export default function JsonGraphVisualizerClient() {
  const [input, setInput] = useState('');
  const [showRefs, setShowRefs] = useState(true);

  const graph = useMemo(() => buildGraph(input), [input]);
  const positions = useMemo(() => layoutNodes(graph.nodes, graph.edges), [graph]);

  const summary = graph.error
    ? { error: graph.error }
    : {
        nodes: graph.nodes.length,
        edges: graph.edges.length,
        refs: graph.refCount,
        cycle: graph.cycle,
      };

  return (
    <div className="space-y-6">
      <div>
        <div className="tb-v2-tool-input-head">
          <span className="tb-v2-tool-label">JSON</span>
          <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={showRefs}
              onChange={(e) => setShowRefs(e.target.checked)}
            />
            Show shared references
          </label>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"users": [{"id": 1, "name": "Ada"}], "owner": {"id": 1}}'
          className="tb-v2-tool-textarea"
          style={{ fontFamily: 'var(--f-mono)', minHeight: 200 }}
          aria-label="JSON input"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center dark:border-gray-800 dark:bg-gray-900">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {'error' in summary ? '—' : summary.nodes}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Nodes</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center dark:border-gray-800 dark:bg-gray-900">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {'error' in summary ? '—' : summary.edges}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Edges</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center dark:border-gray-800 dark:bg-gray-900">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {'error' in summary ? '—' : summary.refs}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Shared refs</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center dark:border-gray-800 dark:bg-gray-900">
          <p
            className={`text-2xl font-bold ${'error' in summary ? 'text-gray-400' : summary.cycle ? 'text-red-600' : 'text-emerald-600'}`}
          >
            {'error' in summary ? '—' : summary.cycle ? 'Yes' : 'No'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Cycle</p>
        </div>
      </div>

      {'error' in summary ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
        >
          {summary.error}
        </div>
      ) : graph.nodes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-950/40 dark:text-gray-400">
          Paste JSON above to see a node-and-edge map of its structure.
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="overflow-x-auto">
            <svg
              viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
              width={CANVAS_W}
              height={CANVAS_H}
              className="mx-auto max-w-full"
              role="img"
              aria-label="JSON graph visualization"
            >
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M0,0 L10,5 L0,10 Z" fill="#9ca3af" />
                </marker>
              </defs>

              {/* Edges */}
              {graph.edges.map((edge, i) => {
                const from = positions.get(edge.from);
                const to = positions.get(edge.to);
                if (!from || !to) return null;
                const isRef = graph.refCount > 0 && to.x <= from.x;
                if (isRef && !showRefs) return null;
                const midX = (from.x + to.x) / 2;
                const path = `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`;
                return (
                  <g key={`e-${i}`}>
                    <path
                      d={path}
                      stroke={isRef ? '#dc2626' : '#9ca3af'}
                      strokeWidth={isRef ? 2 : 1.2}
                      strokeDasharray={isRef ? '4 4' : 'none'}
                      fill="none"
                      markerEnd="url(#arrow)"
                    />
                    <text
                      x={midX}
                      y={(from.y + to.y) / 2 - 6}
                      fill="#6b7280"
                      fontSize="11"
                      textAnchor="middle"
                    >
                      {edge.key}
                    </text>
                  </g>
                );
              })}

              {/* Nodes */}
              {graph.nodes.map((node) => {
                const pos = positions.get(node.id);
                if (!pos) return null;
                const color = kindColor(node.kind);
                if (nodeShape(node.kind) === 'rect') {
                  const w = 90;
                  const h = 36;
                  return (
                    <g key={node.id}>
                      <rect
                        x={pos.x - w / 2}
                        y={pos.y - h / 2}
                        width={w}
                        height={h}
                        rx={6}
                        fill={color}
                        fillOpacity={0.12}
                        stroke={color}
                        strokeWidth={1.5}
                      />
                      <text
                        x={pos.x}
                        y={pos.y + 4}
                        textAnchor="middle"
                        fill={color}
                        fontSize="12"
                        fontWeight={600}
                      >
                        {node.label.length > 12 ? `${node.label.slice(0, 11)}…` : node.label}
                      </text>
                    </g>
                  );
                }
                if (nodeShape(node.kind) === 'diamond') {
                  return (
                    <g key={node.id}>
                      <polygon
                        points={`${pos.x},${pos.y - 20} ${pos.x + 40},${pos.y} ${pos.x},${pos.y + 20} ${pos.x - 40},${pos.y}`}
                        fill={color}
                        fillOpacity={0.12}
                        stroke={color}
                        strokeWidth={1.5}
                      />
                      <text
                        x={pos.x}
                        y={pos.y + 4}
                        textAnchor="middle"
                        fill={color}
                        fontSize="12"
                        fontWeight={600}
                      >
                        {node.label.length > 6 ? `${node.label.slice(0, 5)}…` : node.label}
                      </text>
                    </g>
                  );
                }
                return (
                  <g key={node.id}>
                    <ellipse
                      cx={pos.x}
                      cy={pos.y}
                      rx={50}
                      ry={18}
                      fill={color}
                      fillOpacity={0.12}
                      stroke={color}
                      strokeWidth={1.5}
                    />
                    <text
                      x={pos.x}
                      y={pos.y + 4}
                      textAnchor="middle"
                      fill={color}
                      fontSize="12"
                      fontWeight={600}
                    >
                      {node.label.length > 10 ? `${node.label.slice(0, 9)}…` : node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-sm" style={{ background: kindColor('object') }} />
              object
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rotate-45" style={{ background: kindColor('array') }} />
              array
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full" style={{ background: kindColor('string') }} />
              string
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full" style={{ background: kindColor('number') }} />
              number
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full" style={{ background: kindColor('boolean') }} />
              boolean
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full" style={{ background: kindColor('null') }} />
              null
            </span>
            {graph.cycle && (
              <span className="ml-auto rounded-full bg-red-50 px-2 py-0.5 font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-300">
                Cycle detected
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}