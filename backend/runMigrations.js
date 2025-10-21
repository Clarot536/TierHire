import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execAsync = promisify(exec);

async function runMigrations() {
  console.log('🚀 Running database migrations...\n');
  
  try {
    // Change to the backend directory and run migrations
    const { stdout, stderr } = await execAsync('npx sequelize-cli db:migrate', {
      cwd: __dirname
    });
    
    console.log(stdout);
    if (stderr) console.error(stderr);
    console.log('✅ Migrations completed successfully\n');
    
  } catch (error) {
    console.error('❌ Error running migrations:', error.message);
    process.exit(1);
  }
}

runMigrations();
