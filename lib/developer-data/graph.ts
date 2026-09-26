import { parseJson } from './core';
type JsonValue = string | number | boolean | null | JsonValue[] | {
    [key: string]: JsonValue;
};
export interface GraphNode {
    id: string;
    label: string;
    kind: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null' | 'root';
    depth: number;
}
export interface GraphEdge {
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
export function buildGraph(input: string): Graph {
    const trimmed = input.trim();
    if (!trimmed) {
        return { nodes: [], edges: [], refCount: 0, cycle: false };
    }
    let parsed: JsonValue;
    try {
        parsed = parseJson(trimmed) as JsonValue;
    }
    catch (e) {
        return {
            nodes: [],
            edges: [],
            refCount: 0,
            cycle: false,
            error: (e as Error).message,
        };
    }
    const nodes: GraphNode[] = [];
    // Rendering is deliberately limited; JSON cannot encode cycles or shared references.
    let total = 0;
    const pending: unknown[] = [parsed];
    while (pending.length) {
        const v = pending.pop();
        total++;
        if (v && typeof v === 'object')
            pending.push(...Object.values(v));
    }
    if (total > 200)
        return { nodes: [], edges: [], refCount: 0, cycle: false, error: 'Graph is limited to 200 values.' };
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
            }
            else {
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
        }
        else if (typeof value === 'string') {
            label = JSON.stringify(value).slice(0, 24);
            kind = 'string';
        }
        else if (typeof value === 'number') {
            label = String(value);
            kind = 'number';
        }
        else {
            label = String(value);
            kind = 'boolean';
        }
        nodes.push({ id, label, kind, depth });
        return id;
    };
    visit(parsed, '$', 0, null);
    // Detect cycle (a node referencing itself indirectly)
    const adj = new Map<string, string[]>();
    for (const edge of edges) {
        if (!adj.has(edge.from))
            adj.set(edge.from, []);
        adj.get(edge.from)!.push(edge.to);
    }
    const cycle = (() => {
        const visiting = new Set<string>();
        const visited = new Set<string>();
        const dfs = (id: string): boolean => {
            if (visiting.has(id))
                return true;
            if (visited.has(id))
                return false;
            visiting.add(id);
            const next = adj.get(id) ?? [];
            for (const n of next)
                if (dfs(n))
                    return true;
            visiting.delete(id);
            visited.add(id);
            return false;
        };
        for (const n of nodes)
            if (dfs(n.id))
                return true;
        return false;
    })();
    return { nodes, edges, refCount, cycle };
}
