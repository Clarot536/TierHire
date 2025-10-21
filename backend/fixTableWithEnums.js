import { Client } from "pg";

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "ApexHire",
  password: "123456",
  port: 5432,
});

await client.connect();
console.log("✅ Connected to PostgreSQL");

// Create enum types and fix the table
const fixTableWithEnums = async () => {
  console.log("🔧 Creating enum types and fixing table structure...");
  
  try {
    // Create enum types
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE candidate_status AS ENUM('ACTIVE', 'WAITING_LIST', 'INACTIVE', 'COOLDOWN');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    console.log("✅ Created candidate_status enum type");
    
    // Add status column with enum type
    try {
      await client.query(`ALTER TABLE "Candidate_Domain_Performance" ADD COLUMN "status" candidate_status DEFAULT 'ACTIVE'`);
      console.log("✅ Added status column");
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log("⏭️ Status column already exists");
      } else {
        console.log("⚠️ Could not add status column:", error.message);
      }
    }
    
    console.log("✅ Table structure fixed!");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
};

// Test the domain query
const testDomainQuery = async () => {
  console.log("🧪 Testing domain query...");
  
  try {
    const query = `
      SELECT 
        d.domain_id,
        d.domain_name,
        d.description,
        COUNT(t.tier_id) as tier_count,
        COUNT(CASE WHEN cdp.status = 'ACTIVE' THEN 1 END) as active_candidates
      FROM "Domains" d
      LEFT JOIN "Tiers" t ON d.domain_id = t.domain_id
      LEFT JOIN "Candidate_Domain_Performance" cdp ON d.domain_id = cdp.domain_id
      GROUP BY d.domain_id, d.domain_name, d.description
      ORDER BY d.domain_id
    `;
    
    const result = await client.query(query);
    console.log("✅ Domain query successful!");
    console.log("📊 Results:", result.rows);
    
  } catch (error) {
    console.error("❌ Domain query failed:", error.message);
  }
};

// Test a simple domains query without joins
const testSimpleDomainsQuery = async () => {
  console.log("🧪 Testing simple domains query...");
  
  try {
    const query = `SELECT * FROM "Domains" ORDER BY domain_id`;
    const result = await client.query(query);
    console.log("✅ Simple domains query successful!");
    console.log("📊 Results:", result.rows);
    
  } catch (error) {
    console.error("❌ Simple domains query failed:", error.message);
  }
};

// Main execution
const main = async () => {
  try {
    await fixTableWithEnums();
    console.log("");
    await testSimpleDomainsQuery();
    console.log("");
    await testDomainQuery();
    
  } catch (error) {
    console.error("❌ Fatal error:", error);
  } finally {
    await client.end();
    console.log("🔌 Database connection closed");
  }
};

main();
