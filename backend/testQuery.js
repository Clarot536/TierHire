import { query } from "./db.js";

async function testQuery() {
  try {
    console.log("Testing database query...");
    const result = await query('SELECT COUNT(*) FROM "Domains"');
    console.log("Query successful:", result.rows);
  } catch (error) {
    console.error("Query failed:", error);
  }
}

testQuery();
