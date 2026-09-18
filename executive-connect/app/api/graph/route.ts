import { NextResponse } from "next/server";
import { getNeo4jDriver } from "@/lib/neo4j/driver";
import { FALLBACK_NODES, FALLBACK_EDGES, GraphNode, GraphEdge } from "@/lib/graph/neo4jFallbackData";

function formatNode(node: any): GraphNode {
  const labels: string[] = node.labels || [];
  const props: Record<string, any> = node.properties || {};
  let group = labels[0] || "Unknown";

  if (group === "Person") {
    const title = (props.title || "").toLowerCase();
    const seniority = (props.seniority || "").toLowerCase();
    if (title.includes("cto") || seniority.includes("cto")) {
      group = "CTO";
    } else if (title.includes("founder") || seniority.includes("founder")) {
      group = "Founder";
    }
  }

  return {
    id: node.elementId || node.identity?.toString() || props.id || props.name,
    label: props.name || props.id || "Unnamed",
    group,
    properties: props,
    labels,
  };
}

export async function GET() {
  try {
    const driver = getNeo4jDriver();
    const session = driver.session();
    try {
      const cypher = `
        MATCH (n)
        OPTIONAL MATCH (n)-[r]->(m)
        RETURN collect(DISTINCT n) as nodes, collect(DISTINCT r) as rels
      `;
      const result = await session.run(cypher);
      if (result.records.length > 0) {
        const rawNodes = result.records[0].get("nodes");
        const rawRels = result.records[0].get("rels");

        const nodesMap = new Map<string, GraphNode>();
        rawNodes.forEach((n: any) => {
          const formatted = formatNode(n);
          nodesMap.set(formatted.id, formatted);
        });

        const edges: GraphEdge[] = [];
        rawRels.forEach((r: any) => {
          if (!r) return;
          const startId = r.startNodeElementId || r.start?.toString();
          const endId = r.endNodeElementId || r.end?.toString();
          edges.push({
            id: r.elementId || r.identity?.toString(),
            from: startId,
            to: endId,
            label: r.type,
            type: r.type,
            properties: r.properties || {},
          });
        });

        if (nodesMap.size > 0) {
          return NextResponse.json({
            nodes: Array.from(nodesMap.values()),
            edges,
            source: "neo4j",
          });
        }
      }
    } finally {
      await session.close();
    }
  } catch (error) {
    console.warn("Neo4j query failed in /api/graph, using fallback data:", error);
  }

  // Fallback
  return NextResponse.json({
    nodes: FALLBACK_NODES,
    edges: FALLBACK_EDGES,
    source: "fallback",
  });
}
