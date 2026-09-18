import { NextRequest, NextResponse } from "next/server";
import { getNeo4jDriver } from "@/lib/neo4j/driver";
import { findFallbackShortestPath } from "@/lib/graph/neo4jFallbackData";

function formatNode(node: any) {
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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const source = searchParams.get("source");
  const target = searchParams.get("target");
  const type = searchParams.get("type") || "intros";

  if (!source || !target) {
    return NextResponse.json({ error: "Provide source and target query parameters" }, { status: 400 });
  }

  try {
    const driver = getNeo4jDriver();
    const session = driver.session();
    try {
      const relFilter = type === "intros" ? "[:KNOWS|LIKELY_KNOWS*..10]" : "[*..10]";
      let cypher = `
        MATCH (a:Person {name: $source}), (b:Person {name: $target})
        MATCH p = shortestPath((a)-${relFilter}-(b))
        RETURN p, [n in nodes(p) | n] as pathNodes, [r in relationships(p) | r] as pathRels, length(p) as length
      `;
      let params = { source, target };

      let result = await session.run(cypher, params);

      // If no path with intros filter, fallback to any relationship
      if (result.records.length === 0 && type === "intros") {
        const fallbackCypher = `
          MATCH (a:Person {name: $source}), (b:Person {name: $target})
          MATCH p = shortestPath((a)-[*..10]-(b))
          RETURN p, [n in nodes(p) | n] as pathNodes, [r in relationships(p) | r] as pathRels, length(p) as length
        `;
        result = await session.run(fallbackCypher, params);
      }

      if (result.records.length > 0) {
        const record = result.records[0];
        const pathNodesRaw = record.get("pathNodes");
        const pathRelsRaw = record.get("pathRels");
        const pathLength = record.get("length").toNumber();

        const pathNodes = pathNodesRaw.map(formatNode);
        const pathEdges = pathRelsRaw.map((r: any) => ({
          id: r.elementId || r.identity?.toString(),
          from: r.startNodeElementId || r.start?.toString(),
          to: r.endNodeElementId || r.end?.toString(),
          label: r.type,
          type: r.type,
          properties: r.properties || {},
        }));

        const steps = [];
        for (let i = 0; i < pathNodes.length; i++) {
          const curr = pathNodes[i];
          const edgeToNext = i < pathEdges.length ? pathEdges[i] : null;
          steps.push({
            step: i + 1,
            node: curr,
            viaRelationship: edgeToNext ? edgeToNext.type : null,
            relationshipDetails: edgeToNext ? edgeToNext.properties : null,
          });
        }

        return NextResponse.json({
          found: true,
          length: pathLength,
          hops: pathLength,
          nodes: pathNodes,
          edges: pathEdges,
          nodeIds: pathNodes.map((n: any) => n.id),
          edgeIds: pathEdges.map((e: any) => e.id),
          steps,
          source: "neo4j",
        });
      }
    } finally {
      await session.close();
    }
  } catch (error) {
    console.warn("Neo4j query failed in /api/shortest-path, using fallback search:", error);
  }

  // Fallback in-memory graph shortest path
  const fallbackResult = findFallbackShortestPath(source, target);
  return NextResponse.json({ ...fallbackResult, source: "fallback" });
}
