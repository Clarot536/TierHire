// db.js
import pg from 'pg';
const { Pool } = pg;

// ❗️ Replace with your actual PostgreSQL connection string
const connectionString = 'postgresql://postgres:1234@localhost:5432/exam_app';

const pool = new Pool({
  connectionString,
});

// A helper function to query the database
export const query = (text, params) => pool.query(text, params);