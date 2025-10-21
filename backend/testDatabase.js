import { query } from './db.js';

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test domains table
    const domainsResult = await query('SELECT COUNT(*) as count FROM "Domains"');
    console.log('✅ Domains count:', domainsResult.rows[0].count);
    
    // Test if we can fetch domains
    const domainsList = await query('SELECT domain_id, domain_name, description FROM "Domains" ORDER BY domain_name');
    console.log('✅ Domains list:', domainsList.rows.length, 'domains found');
    domainsList.rows.forEach(domain => {
      console.log(`  - ${domain.domain_name}: ${domain.description}`);
    });
    
    console.log('✅ Database is working correctly!');
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
  }
}

testDatabase();
