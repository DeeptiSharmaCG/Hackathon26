import { Person, Relationship, GraphData } from "@/lib/types";

export function buildGraph(
  people: Person[],
  relationships: Relationship[],
  meId: string = "me"
): GraphData {
  const nodes = [
    {
      id: meId,
      label: "You",
      title: "Your Profile",
      company: "",
      isMe: true,
    },
    ...people.map((p) => ({
      id: p.id,
      label: p.name.split(" ")[0],
      title: p.title,
      company: p.company,
      avatar: p.avatar,
      isMe: false,
    })),
  ];

  const edgeSet = new Set<string>();
  const edges = relationships
    .filter((r) => {
      const key = [r.source, r.target].sort().join("--");
      if (edgeSet.has(key)) return false;
      edgeSet.add(key);
      return true;
    })
    .map((r) => ({
      source: r.source,
      target: r.target,
      type: r.type,
      strength: r.strength,
    }));

  return { nodes, edges };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toCytoscapeElements(data: GraphData): any[] {
  const nodeIds = new Set(data.nodes.map((n) => n.id));
  return [
    ...data.nodes.map((n) => ({
      data: { ...n },
      classes: n.isMe ? "node-me" : "node-person",
    })),
    ...data.edges
      .filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target))
      .map((e) => ({
        data: {
          id: `${e.source}--${e.target}`,
          source: e.source,
          target: e.target,
          type: e.type,
          strength: e.strength,
        },
      })),
  ];
}
