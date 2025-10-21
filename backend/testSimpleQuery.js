import { query } from './db.js';

const testSimpleQuery = async () => {
  try {
    console.log('🧪 Testing simple domains query...');
    
    // Test 1: Simple domains query
    const result1 = await query(`SELECT * FROM "Domains" ORDER BY domain_id`);
    console.log('✅ Simple domains query successful!');
    console.log('📊 Domains:', result1.rows);
    
    // Test 2: Test the exact query from controller
    const result2 = await query(`
      SELECT 
        d.domain_id,
        d.domain_name,
        d.description,
        d."createdAt",
        d."updatedAt",
        COUNT(t.tier_id) as tier_count,
        COUNT(CASE WHEN cdp.status = 'ACTIVE' THEN 1 END) as active_candidates
      FROM "Domains" d
      LEFT JOIN "Tiers" t ON d.domain_id = t.domain_id
      LEFT JOIN "Candidate_Domain_Performance" cdp ON d.domain_id = cdp.domain_id
      GROUP BY d.domain_id, d.domain_name, d.description, d."createdAt", d."updatedAt"
      ORDER BY d.domain_id
    `);
    
    console.log('✅ Complex domains query successful!');
    console.log('📊 Results with counts:', result2.rows);
    
  } catch (error) {
    console.error('❌ Query failed:', error.message);
  }
};

testSimpleQuery();
