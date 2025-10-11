// db-query.mjs or with "type": "module" in package.json
import { Client } from 'pg';
import bcrypt from "bcrypt";

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'project_db',
  password: '123456',
  port: 5432,
});

const query = async function runQuery() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    const res = await client.query('SELECT * FROM "Candidates"');
    console.log('Query result:', res.rows);
  } catch (err) {
    console.error('Error executing query', err.stack);
  }
}

const checkusername = async (username) => {
  const query = `
    (SELECT 1 FROM "Candidates" WHERE username = $1)
    UNION ALL
    (SELECT 1 FROM "Recruiters" WHERE username = $1)
    LIMIT 1;
  `;
  const result = await client.query(query, [username]);
  return (result.rows.length > 0)
};


const checkemail = async (email) => {
  const query = `
    (SELECT 1 FROM "Candidates" WHERE email = $1)
    UNION ALL
    (SELECT 1 FROM "Recruiters" WHERE email = $1)
    LIMIT 1;
  `;
  const result = await client.query(query, [email]);
  return (result.rows.length > 0)
};

const register = async (username, email, fullName, password, role) => {
  const allowedTables = {
    CANDIDATE: 'Candidates',
    RECRUITER: 'Recruiters'
  };
  const tableName = allowedTables[role.toUpperCase()];

  if (!tableName) {
    return { success: false, error: 'Invalid user role specified.' };
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const now = new Date();
    
    const insertQuery = `
      INSERT INTO "${tableName}" (username, email, "fullName", "passwordHash", "createdAt", "updatedAt") 
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    
    await client.query(insertQuery, [username, email, fullName, passwordHash, now, now]);
    
    return { success: true };

  } catch (err) {
    // '23505' is the PostgreSQL error code for a unique constraint violation
    if (err.code === '23505') {
      if (err.constraint.includes('username')) {
        return { success: false, error: 'Username is already taken.' };
      }
      if (err.constraint.includes('email')) {
        return { success: false, error: 'Email is already in use.' };
      }
    }
    
    console.error("Registration Error:", err);
    return { success: false, error: 'An internal server error occurred.' };
  }
};


const login = async (credential, password) => {
  try {
    // ✅ Use UNION ALL to efficiently query both tables at once
    const query = `
      SELECT id, username, email, "passwordHash", "fullName", 'CANDIDATE' as role
      FROM "Candidates" WHERE email = $1 OR username = $1
      UNION ALL
      SELECT id, username, email, "passwordHash", "fullName", 'RECRUITER' as role
      FROM "Recruiters" WHERE email = $1 OR username = $1
      LIMIT 1;
    `;
    
    const result = await client.query(query, [credential]);

    if (result.rows.length === 0) {
      return { status: 404, success: false, message: "User not found" };
    }

    const user = result.rows[0];

    // ✅ Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      // Use a generic message for security; don't specify "Invalid password"
      return { status: 401, success: false, message: "Invalid credentials" };
    }

    // ✅ Successful login, return user data including the role
    return {
      status: 200,
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        role: user.role, // Crucial for managing user sessions
      },
    };
    
  } catch (error) {
    console.error("Login error:", error);
    return { status: 500, success: false, message: "Internal server error" };
  }
};


export {query, register, login, checkemail, checkusername};