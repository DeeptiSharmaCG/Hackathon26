import { NextResponse } from "next/server";
import { getNeo4jDriver } from "@/lib/neo4j/driver";
import { FALLBACK_NODES } from "@/lib/graph/neo4jFallbackData";

export async function GET() {
  try {
    const driver = getNeo4jDriver();
    const session = driver.session();
    try {
      const result = await session.run(`
        MATCH (p:Person)
        RETURN p.id as id, p.name as name, p.title as title, p.company as company, p.seniority as seniority
        ORDER BY p.name ASC
      `);
      const people = result.records.map((rec) => ({
        id: rec.get("id"),
        name: rec.get("name"),
        title: rec.get("title") || "",
        company: rec.get("company") || "",
        seniority: rec.get("seniority") || "",
      }));
      if (people.length > 0) {
        return NextResponse.json(people);
      }
    } finally {
      await session.close();
    }
  } catch (error) {
    console.warn("Neo4j query failed in /api/people, falling back:", error);
  }

  // Fallback
  const people = FALLBACK_NODES
    .filter((n) => n.labels.includes("Person"))
    .map((n) => ({
      id: n.id,
      name: n.properties.name || n.label,
      title: n.properties.title || "",
      company: n.properties.company || "",
      seniority: n.properties.seniority || "",
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return NextResponse.json(people);
}
