import neo4j, { Driver } from "neo4j-driver";

let driver: Driver | null = null;

export function getNeo4jDriver(): Driver {
  if (!driver) {
    const uri = process.env.NEO4J_URI || "bolt://localhost:7687";
    const user = process.env.NEO4J_USER || "";
    const password = process.env.NEO4J_PASSWORD || "";

    const auth = user && password ? neo4j.auth.basic(user, password) : undefined;
    driver = neo4j.driver(uri, auth);
  }
  return driver;
}
