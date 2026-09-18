import { Relationship } from "@/lib/types";

type AdjMap = Map<string, Array<{ node: string; strength: number }>>;

function buildAdjacency(relationships: Relationship[]): AdjMap {
  const adj: AdjMap = new Map();

  const ensure = (id: string) => {
    if (!adj.has(id)) adj.set(id, []);
  };

  for (const r of relationships) {
    ensure(r.source);
    ensure(r.target);
    adj.get(r.source)!.push({ node: r.target, strength: r.strength });
    adj.get(r.target)!.push({ node: r.source, strength: r.strength });
  }

  return adj;
}

export function bfsShortestPath(
  from: string,
  to: string,
  relationships: Relationship[]
): string[] | null {
  if (from === to) return [from];

  const adj = buildAdjacency(relationships);
  const visited = new Set<string>();
  const queue: Array<{ node: string; path: string[] }> = [
    { node: from, path: [from] },
  ];

  visited.add(from);

  while (queue.length > 0) {
    const { node, path } = queue.shift()!;
    const neighbors = adj.get(node) || [];

    for (const { node: neighbor } of neighbors) {
      if (neighbor === to) {
        return [...path, neighbor];
      }
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push({ node: neighbor, path: [...path, neighbor] });
      }
    }
  }

  return null; // No path found
}

export function getPathEdges(path: string[]): Array<[string, string]> {
  const edges: Array<[string, string]> = [];
  for (let i = 0; i < path.length - 1; i++) {
    edges.push([path[i], path[i + 1]]);
  }
  return edges;
}

export function describePathSteps(path: string[]): number {
  return Math.max(0, path.length - 2); // degrees of separation (excluding self and target)
}
