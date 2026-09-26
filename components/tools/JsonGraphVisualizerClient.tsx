'use client';
import ToolExampleClearActions from './ToolExampleClearActions';
import { buildGraph, type GraphNode, type GraphEdge } from '@/lib/developer-data/graph';

import { useMemo, useState } from 'react';

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
    const x = 60 + depth * colWidth;
    list.forEach((node, i) => {
      const y = 30 + i * rowHeight + rowHeight / 2;
      positions.set(node.id, { x, y });
    });
  }
  return positions;
}

export default function JsonGraphVisualizerClient() {
  const [input, setInput] = useState('');

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
    <div className="space-y-6" style={{minWidth:0,maxWidth:"100%"}}>
      <p>Each JSON value has its own node. JSON cannot encode shared references or cycles. Graphs are limited to 200 values.</p>
      <div>
        <div className="tb-v2-tool-input-head" style={{flexWrap:"wrap",gap:8}}>
          <span className="tb-v2-tool-label">JSON</span>
        <ToolExampleClearActions onExample={() => setInput('{"name":"Ada","items":[1,true,null]}')} onClear={() => { setInput(''); }} />

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

      <div className="grid gap-4 sm:grid-cols-2">
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
              viewBox={`0 0 ${Math.max(CANVAS_W, ...Array.from(positions.values()).map(p => p.x + 70))} ${Math.max(CANVAS_H, ...Array.from(positions.values()).map(p => p.y + 40))}`}
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