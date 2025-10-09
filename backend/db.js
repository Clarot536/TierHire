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

    const res = await client.query('SELECT * FROM "Users"');
    console.log('Query result:', res.rows);
  } catch (err) {
    console.error('Error executing query', err.stack);
  }
}

const register = async (username, email, full_name, password)=>{
    const now = new Date();
    const passwordHash = await bcrypt.hash(password, 10);
    const insquery = 'insert into "Users" (username, email, full_name, "passwordHash", "createdAt", "updatedAt") values ($1, $2, $3, $4, $5, $6)';
    try{
        const res = await client.query(insquery, [username, email, full_name, passwordHash, now, now]);
        console.log(res, res.rows[0]);
        return true;
    }
    catch(e){
        console.log(e);
        throw new APIError(400, "Couldn't upload to database");
    }
}


export {query, register};