import { query } from './db.js';

const testDomainQuery = async () => {
  try {
    console.log('🧪 Testing domain query directly...');
    
    const result = await query(`
      SELECT 
        d.domain_id,
        d.domain_name,
        d.description,
        d."createdAt",
        d."updatedAt"
      FROM "Domains" d
      ORDER BY d.domain_id
    `);
    
    console.log('✅ Query successful!');
    console.log('📊 Results:', result.rows);
    
  } catch (error) {
    console.error('❌ Query failed:', error.message);
  }
};

testDomainQuery();
