import { query } from './db.js';

async function checkTableStructure() {
  try {
    console.log('🔍 Checking table structures...\n');
    
    // Check Candidates table structure
    console.log('👤 Candidates table structure:');
    const candidatesResult = await query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'Candidates' 
      ORDER BY ordinal_position
    `);
    candidatesResult.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });
    
    console.log('\n🏢 Recruiters table structure:');
    const recruitersResult = await query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'Recruiters' 
      ORDER BY ordinal_position
    `);
    recruitersResult.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });
    
    console.log('\n🌐 Domains table structure:');
    const domainsResult = await query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'Domains' 
      ORDER BY ordinal_position
    `);
    domainsResult.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });
    
  } catch (error) {
    console.error('❌ Error checking table structure:', error.message);
  }
}

checkTableStructure();
