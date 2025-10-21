import { query } from './db.js';

async function createMissingTables() {
  console.log('🔧 Creating missing tables for tier-based hiring platform...\n');
  
  try {
    // 1. Create Exams table
    console.log('📝 Creating Exams table...');
    await query(`
      CREATE TABLE IF NOT EXISTS "Exams" (
        exam_id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(50) NOT NULL CHECK (category IN ('DSA', 'SQL', 'REACT', 'GENERAL')),
        duration_minutes INTEGER NOT NULL DEFAULT 60,
        total_questions INTEGER NOT NULL DEFAULT 10,
        passing_score INTEGER NOT NULL DEFAULT 70,
        domain_id INTEGER REFERENCES "Domains"(domain_id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Exams table created');

    // 2. Create Exam_Questions table
    console.log('❓ Creating Exam_Questions table...');
    await query(`
      CREATE TABLE IF NOT EXISTS "Exam_Questions" (
        question_id SERIAL PRIMARY KEY,
        exam_id INTEGER NOT NULL REFERENCES "Exams"(exam_id) ON DELETE CASCADE,
        question_text TEXT NOT NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN ('multiple_choice', 'coding', 'sql', 'react')),
        options JSONB,
        correct_answer TEXT NOT NULL,
        difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD')),
        points INTEGER NOT NULL DEFAULT 10,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Exam_Questions table created');

    // 3. Create Candidate_Exam_Attempts table
    console.log('📊 Creating Candidate_Exam_Attempts table...');
    await query(`
      CREATE TABLE IF NOT EXISTS "Candidate_Exam_Attempts" (
        attempt_id SERIAL PRIMARY KEY,
        candidate_id UUID NOT NULL REFERENCES "Candidates"(candidate_id) ON DELETE CASCADE,
        exam_id INTEGER NOT NULL REFERENCES "Exams"(exam_id) ON DELETE CASCADE,
        start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        end_time TIMESTAMP,
        score INTEGER,
        status VARCHAR(20) NOT NULL CHECK (status IN ('IN_PROGRESS', 'COMPLETED', 'ABANDONED')) DEFAULT 'IN_PROGRESS',
        answers_submitted JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Candidate_Exam_Attempts table created');

    // 4. Create Contests table
    console.log('🏆 Creating Contests table...');
    await query(`
      CREATE TABLE IF NOT EXISTS "Contests" (
        contest_id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        type VARCHAR(50) NOT NULL CHECK (type IN ('SHIFTING_TEST', 'INTERNAL_CONTEST')),
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        domain_id INTEGER REFERENCES "Domains"(domain_id) ON DELETE SET NULL,
        max_participants INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Contests table created');

    // 5. Create Contest_Participations table
    console.log('🎯 Creating Contest_Participations table...');
    await query(`
      CREATE TABLE IF NOT EXISTS "Contest_Participations" (
        participation_id SERIAL PRIMARY KEY,
        candidate_id UUID NOT NULL REFERENCES "Candidates"(candidate_id) ON DELETE CASCADE,
        contest_id INTEGER NOT NULL REFERENCES "Contests"(contest_id) ON DELETE CASCADE,
        score INTEGER DEFAULT 0,
        rank INTEGER,
        submission_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Contest_Participations table created');

    // 6. Create Premium_Subscriptions table
    console.log('💎 Creating Premium_Subscriptions table...');
    await query(`
      CREATE TABLE IF NOT EXISTS "Premium_Subscriptions" (
        subscription_id SERIAL PRIMARY KEY,
        candidate_id UUID NOT NULL REFERENCES "Candidates"(candidate_id) ON DELETE CASCADE,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        status VARCHAR(20) NOT NULL CHECK (status IN ('ACTIVE', 'EXPIRED', 'CANCELLED')) DEFAULT 'ACTIVE',
        plan_id INTEGER REFERENCES "Subscription_Plans"(plan_id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Premium_Subscriptions table created');

    // 7. Create Analytics_Data table
    console.log('📈 Creating Analytics_Data table...');
    await query(`
      CREATE TABLE IF NOT EXISTS "Analytics_Data" (
        analytics_id SERIAL PRIMARY KEY,
        recruiter_id UUID NOT NULL REFERENCES "Recruiters"(recruiter_id) ON DELETE CASCADE,
        domain_id INTEGER REFERENCES "Domains"(domain_id) ON DELETE SET NULL,
        tier_id INTEGER REFERENCES "Tiers"(tier_id) ON DELETE SET NULL,
        metric_name VARCHAR(100) NOT NULL,
        metric_value DECIMAL(10,2) NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Analytics_Data table created');

    // 8. Create Cooldown_Periods table
    console.log('⏰ Creating Cooldown_Periods table...');
    await query(`
      CREATE TABLE IF NOT EXISTS "Cooldown_Periods" (
        cooldown_id SERIAL PRIMARY KEY,
        candidate_id UUID NOT NULL REFERENCES "Candidates"(candidate_id) ON DELETE CASCADE,
        job_id INTEGER NOT NULL REFERENCES "Jobs"(job_id) ON DELETE CASCADE,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Cooldown_Periods table created');

    // 9. Create Tier_Thresholds table
    console.log('🎚️ Creating Tier_Thresholds table...');
    await query(`
      CREATE TABLE IF NOT EXISTS "Tier_Thresholds" (
        threshold_id SERIAL PRIMARY KEY,
        domain_id INTEGER NOT NULL REFERENCES "Domains"(domain_id) ON DELETE CASCADE,
        tier_id INTEGER NOT NULL REFERENCES "Tiers"(tier_id) ON DELETE CASCADE,
        min_score INTEGER NOT NULL,
        max_score INTEGER NOT NULL,
        max_slots INTEGER NOT NULL DEFAULT 100,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tier_Thresholds table created');

    console.log('\n🎉 All missing tables created successfully!');
    
    // Show final table count
    const result = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log(`\n📋 Total tables in database: ${result.rows.length}`);
    console.log('Tables:', result.rows.map(row => row.table_name).join(', '));
    
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    throw error;
  }
}

createMissingTables();
