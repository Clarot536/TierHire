import { query } from './db.js';

const checkTableStructure = async () => {
  try {
    console.log('🔍 Checking Candidate_Domain_Performance table structure...');
    
    const result = await query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'Candidate_Domain_Performance'
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Columns in Candidate_Domain_Performance:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

checkTableStructure();
