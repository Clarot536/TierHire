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

// Function to check if column exists
const columnExists = async (tableName, columnName) => {
  const query = `
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = $1 AND column_name = $2
  `;
  const result = await client.query(query, [tableName, columnName]);
  return result.rows.length > 0;
};

// Function to add missing columns
const addMissingColumns = async () => {
  console.log("🔧 Adding missing columns...");
  
  try {
    // Add missing columns to Candidates table
    const candidatesColumns = [
      { name: 'premium_status', type: 'BOOLEAN DEFAULT false' },
      { name: 'last_login', type: 'TIMESTAMP' }
    ];
    
    for (const col of candidatesColumns) {
      const exists = await columnExists('Candidates', col.name);
      if (!exists) {
        await client.query(`ALTER TABLE "Candidates" ADD COLUMN "${col.name}" ${col.type}`);
        console.log(`✅ Added column ${col.name} to Candidates table`);
      } else {
        console.log(`⏭️ Column ${col.name} already exists in Candidates table`);
      }
    }
    
    // Add missing columns to Tiers table
    const tiersColumns = [
      { name: 'yearly_cost', type: 'DECIMAL(10,2) DEFAULT 0.00' },
      { name: 'features', type: 'JSONB' }
    ];
    
    for (const col of tiersColumns) {
      const exists = await columnExists('Tiers', col.name);
      if (!exists) {
        await client.query(`ALTER TABLE "Tiers" ADD COLUMN "${col.name}" ${col.type}`);
        console.log(`✅ Added column ${col.name} to Tiers table`);
      } else {
        console.log(`⏭️ Column ${col.name} already exists in Tiers table`);
      }
    }
    
    console.log("✅ All missing columns added successfully!");
    
  } catch (error) {
    console.error("❌ Error adding columns:", error.message);
  }
};

// Function to rename tables to match migrations
const renameTables = async () => {
  console.log("🔄 Checking table names...");
  
  try {
    // Check if Exam_Questions exists and rename to Questions if needed
    const examQuestionsExists = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_name = 'Exam_Questions'
    `);
    
    const questionsExists = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_name = 'Questions'
    `);
    
    if (examQuestionsExists.rows.length > 0 && questionsExists.rows.length === 0) {
      await client.query(`ALTER TABLE "Exam_Questions" RENAME TO "Questions"`);
      console.log("✅ Renamed Exam_Questions to Questions");
    }
    
    // Check if Candidate_Exam_Attempts exists and rename to Exam_Attempts if needed
    const candidateExamAttemptsExists = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_name = 'Candidate_Exam_Attempts'
    `);
    
    const examAttemptsExists = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_name = 'Exam_Attempts'
    `);
    
    if (candidateExamAttemptsExists.rows.length > 0 && examAttemptsExists.rows.length === 0) {
      await client.query(`ALTER TABLE "Candidate_Exam_Attempts" RENAME TO "Exam_Attempts"`);
      console.log("✅ Renamed Candidate_Exam_Attempts to Exam_Attempts");
    }
    
    console.log("✅ Table renaming completed!");
    
  } catch (error) {
    console.error("❌ Error renaming tables:", error.message);
  }
};

// Function to create missing indexes
const createIndexes = async () => {
  console.log("📊 Creating performance indexes...");
  
  try {
    const indexes = [
      { table: 'Exam_Attempts', columns: ['candidate_id', 'exam_id'] },
      { table: 'Candidate_Domain_Performance', columns: ['candidate_id', 'domain_id'] },
      { table: 'Contest_Participations', columns: ['candidate_id', 'contest_id'] },
      { table: 'Analytics_Data', columns: ['domain_id', 'tier_id', 'metric_type'] }
    ];
    
    for (const index of indexes) {
      const indexName = `idx_${index.table}_${index.columns.join('_')}`;
      try {
        await client.query(`
          CREATE INDEX IF NOT EXISTS "${indexName}" 
          ON "${index.table}" (${index.columns.map(col => `"${col}"`).join(', ')})
        `);
        console.log(`✅ Created index ${indexName}`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`⏭️ Index ${indexName} already exists`);
        } else {
          console.log(`⚠️ Could not create index ${indexName}:`, error.message);
        }
      }
    }
    
    console.log("✅ Index creation completed!");
    
  } catch (error) {
    console.error("❌ Error creating indexes:", error.message);
  }
};

// Function to verify final structure
const verifyStructure = async () => {
  console.log("🔍 Verifying final database structure...");
  
  try {
    const tables = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log("📋 Final table list:");
    tables.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    // Check key columns exist
    const keyChecks = [
      { table: 'Candidates', columns: ['premium_status', 'last_login'] },
      { table: 'Tiers', columns: ['yearly_cost', 'features'] }
    ];
    
    for (const check of keyChecks) {
      for (const column of check.columns) {
        const exists = await columnExists(check.table, column);
        console.log(`${exists ? '✅' : '❌'} ${check.table}.${column}: ${exists ? 'EXISTS' : 'MISSING'}`);
      }
    }
    
    console.log("✅ Database structure verification completed!");
    
  } catch (error) {
    console.error("❌ Error verifying structure:", error.message);
  }
};

// Main execution
const main = async () => {
  try {
    console.log("🚀 Starting database structure fix...");
    
    await addMissingColumns();
    await renameTables();
    await createIndexes();
    await verifyStructure();
    
    console.log("🎉 Database structure fix completed successfully!");
    
  } catch (error) {
    console.error("❌ Fatal error:", error);
  } finally {
    await client.end();
    console.log("🔌 Database connection closed");
  }
};

main();
