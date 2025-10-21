import { query } from './db.js';

const testDirectQuery = async () => {
  try {
    console.log('🧪 Testing direct database query...');
    
    const result = await query(`
      SELECT 
        d.domain_id,
        d.domain_name,
        d.description,
        d.createdAt,
        d.updatedAt,
        COUNT(t.tier_id) as tier_count,
        COUNT(CASE WHEN cdp.status = 'ACTIVE' THEN 1 END) as active_candidates
      FROM "Domains" d
      LEFT JOIN "Tiers" t ON d.domain_id = t.domain_id
      LEFT JOIN "Candidate_Domain_Performance" cdp ON d.domain_id = cdp.domain_id
      GROUP BY d.domain_id, d.domain_name, d.description, d.createdAt, d.updatedAt
      ORDER BY d.domain_id
    `);
    
    console.log('✅ Direct query successful!');
    console.log('📊 Results:', result.rows);
    
  } catch (error) {
    console.error('❌ Direct query failed:', error.message);
  }
};

testDirectQuery();
