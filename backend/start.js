import { exec } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config();

const execAsync = promisify(exec);

async function startServer() {
  console.log('🚀 Starting Tier-Based Hiring Platform...\n');

  try {
    // Check if database is set up
    console.log('📊 Checking database setup...');
    
    // Try to connect to database
    const { client } = await import('./db.js');
    console.log('✅ Database connection successful\n');

    // Start the server
    console.log('🌐 Starting Express server...');
    const { app } = await import('./app.js');
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🎉 Server running on port ${PORT}`);
      console.log(`📱 Frontend should connect to: http://localhost:${PORT}`);
      console.log('\n🔗 Available API endpoints:');
      console.log('   • POST /api/users/register - User registration');
      console.log('   • POST /api/users/login - User login');
      console.log('   • GET /api/domains - Get all domains');
      console.log('   • GET /api/exams/domain/:domainId - Get available exams');
      console.log('   • GET /api/tiers/domain/:domainId - Get tier information');
      console.log('   • GET /api/contests/active - Get active contests');
      console.log('   • GET /api/recruiters/dashboard - Recruiter dashboard');
      console.log('\n💡 Next steps:');
      console.log('   1. Start the frontend: cd frontend && npm start');
      console.log('   2. Register as a candidate or recruiter');
      console.log('   3. Take initial assessments to get tier placement');
    });

  } catch (error) {
    console.error('❌ Error starting server:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure PostgreSQL is running');
    console.log('   2. Check your .env file has correct DATABASE_URL');
    console.log('   3. Run: node setup.js (to set up database)');
    process.exit(1);
  }
}

startServer();
