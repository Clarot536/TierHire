import { query } from './db.js';

const testDomainQuery = async () => {
  try {
    console.log('🧪 Testing domain query...');
    
    const queryText = `
      SELECT 
        d.*,
        COUNT(t.tier_id) as tier_count,
        COUNT(CASE WHEN cdp.status = 'ACTIVE' THEN 1 END) as active_candidates
      FROM "Domains" d
      LEFT JOIN "Tiers" t ON d.domain_id = t.domain_id
      LEFT JOIN "Candidate_Domain_Performance" cdp ON d.domain_id = cdp.domain_id
      GROUP BY d.domain_id, d.domain_name, d.description, d.createdAt, d.updatedAt
      ORDER BY d.domain_id
    `;
    
    const result = await query(queryText);
    console.log('✅ Query successful!');
    console.log('📊 Results:', result.rows);
    
  } catch (error) {
    console.error('❌ Query failed:', error);
  }
};

testDomainQuery();
