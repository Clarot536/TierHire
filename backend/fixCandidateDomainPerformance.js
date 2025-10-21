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

// Fix the Candidate_Domain_Performance table structure
const fixCandidateDomainPerformanceTable = async () => {
  console.log("🔧 Fixing Candidate_Domain_Performance table structure...");
  
  try {
    // Add missing columns
    const missingColumns = [
      { name: 'total_score', type: 'INTEGER DEFAULT 0' },
      { name: 'average_score', type: 'DECIMAL(5,2) DEFAULT 0.00' },
      { name: 'participation_count', type: 'INTEGER DEFAULT 0' },
      { name: 'last_active', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' },
      { name: 'status', type: "ENUM('ACTIVE', 'WAITING_LIST', 'INACTIVE', 'COOLDOWN') DEFAULT 'ACTIVE'" },
      { name: 'tier_assigned_date', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' }
    ];
    
    for (const col of missingColumns) {
      try {
        await client.query(`ALTER TABLE "Candidate_Domain_Performance" ADD COLUMN "${col.name}" ${col.type}`);
        console.log(`✅ Added column ${col.name}`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`⏭️ Column ${col.name} already exists`);
        } else {
          console.log(`⚠️ Could not add column ${col.name}:`, error.message);
        }
      }
    }
    
    console.log("✅ Candidate_Domain_Performance table structure fixed!");
    
  } catch (error) {
    console.error("❌ Error fixing table:", error.message);
  }
};

// Test the fixed domain query
const testDomainQuery = async () => {
  console.log("🧪 Testing fixed domain query...");
  
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

// Main execution
const main = async () => {
  try {
    await fixCandidateDomainPerformanceTable();
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
