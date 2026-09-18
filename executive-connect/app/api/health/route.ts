import { NextResponse } from "next/server";
import { getNeo4jDriver } from "@/lib/neo4j/driver";

export async function GET() {
  try {
    const driver = getNeo4jDriver();
    const session = driver.session();
    try {
      const result = await session.run("RETURN 1 as ping");
      const ping = result.records[0]?.get("ping")?.toNumber?.() ?? 1;
      return NextResponse.json({ status: "ok", neo4j: "connected", mode: "live", ping });
    } finally {
      await session.close();
    }
  } catch (error: any) {
    return NextResponse.json({
      status: "ok",
      neo4j: "offline",
      mode: "fallback",
      message: error?.message || "Neo4j connection unavailable, using fallback data"
    });
  }
}
