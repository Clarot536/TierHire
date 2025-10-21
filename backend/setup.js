import { exec } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config();

const execAsync = promisify(exec);

async function setupDatabase() {
  console.log('🚀 Setting up tier-based hiring platform database...\n');

  try {
    // Run migrations
    console.log('📊 Running database migrations...');
    await execAsync('npx sequelize-cli db:migrate');
    console.log('✅ Migrations completed successfully\n');

    // Run seeders
    console.log('🌱 Seeding database with initial data...');
    await execAsync('npx sequelize-cli db:seed:all');
    console.log('✅ Seeding completed successfully\n');

    console.log('🎉 Database setup completed successfully!');
    console.log('\n📋 What was created:');
    console.log('   • Complete database schema for tier-based hiring');
    console.log('   • 5 domains: DSA, Web Dev, Database, ML, DevOps');
    console.log('   • 25 tiers (5 tiers per domain)');
    console.log('   • Sample exam questions for each domain');
    console.log('   • Tier thresholds and configurations');
    
    console.log('\n🔗 Next steps:');
    console.log('   1. Start the backend server: npm run dev');
    console.log('   2. Start the frontend: cd frontend && npm start');
    console.log('   3. Register as a candidate or recruiter');
    console.log('   4. Take initial assessments to get tier placement');
    
    console.log('\n💡 Features available:');
    console.log('   • Domain selection and tier-based assessment');
    console.log('   • Exam system with multiple question types');
    console.log('   • Contest system (shifting and internal)');
    console.log('   • Recruiter dashboard with tier-based access');
    console.log('   • Anonymous analytics for recruiters');
    console.log('   • Premium subscription system');

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    process.exit(1);
  }
}

// Run setup if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase();
}

export { setupDatabase };
