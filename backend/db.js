import { Client } from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError } from "./utils/ApiError.js";

// ✅ --- PostgreSQL Client Setup ---
const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "project_db",
  password: "123456",
  port: 5432,
});

await client.connect();
console.log("✅ Connected to PostgreSQL");

// ✅ --- Username & Email Checks ---
const checkUsername = async (username) => {
  const query = `
    (SELECT 1 FROM "Candidates" WHERE username = $1)
    UNION ALL
    (SELECT 1 FROM "Recruiters" WHERE username = $1)
    LIMIT 1;
  `;
  const result = await client.query(query, [username]);
  return result.rows.length > 0;
};

const checkEmail = async (email) => {
  const query = `
    (SELECT 1 FROM "Candidates" WHERE email = $1)
    UNION ALL
    (SELECT 1 FROM "Recruiters" WHERE email = $1)
    LIMIT 1;
  `;
  const result = await client.query(query, [email]);
  return result.rows.length > 0;
};

// ✅ --- JWT Helper Functions ---
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1h" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user.id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};

const generateAccessAndRefreshToken = async (user) => {
  const accessToken =   generateAccessToken(user);
  const refreshToken =  generateRefreshToken(user);
  await updateRefreshToken(user.id, user.role, refreshToken);
  return { accessToken, refreshToken };
};

// ✅ --- Update Refresh Token in DB ---
const updateRefreshToken = async (userId, role, refreshToken) => {
  // console.log(userId,role,refreshToken)
  const tableName = role === "CANDIDATE" ? "Candidates" : "Recruiters";
  try {
    await client.query(
      `UPDATE "${tableName}" SET "refreshtoken" = $1 WHERE "id" = $2`,
      [refreshToken, userId]
    );
  } catch (err) {
    console.error("Error updating refresh token:", err);
  }
};

// ✅ --- Get User by ID ---
const getUserById = async (userId) => {
  try {
    const query = `
      SELECT id, username, email, "fullName", 'CANDIDATE' AS role,"cvUrl",domain_id 
      FROM "Candidates" WHERE id = $1
      LIMIT 1;
    `;
    const res = await client.query(query, [userId]);
    return res.rows[0] || null;
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    return null;
  }
};

const getRecruiterById=async (userId) => {
  try {
    const query = `
      SELECT id, username, email, "fullName", 'RECRUITER' AS role
      FROM "Recruiters" WHERE id = $1
      LIMIT 1;
    `;
    const res = await client.query(query, [userId]);
    return res.rows[0] || null;
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    return null;
  }
};

// ✅ --- Register User ---
const register = async (username, email, fullName, password, role) => {
  const allowedTables = {
    CANDIDATE: "Candidates",
    RECRUITER: "Recruiters",
  };

  const tableName = allowedTables[role?.toUpperCase()];
  if (!tableName) throw new ApiError(400, "Invalid user role specified");

  try {
    const usernameExists = await checkUsername(username);
    if (usernameExists) throw new ApiError(400, "Username already taken");

    const emailExists = await checkEmail(email);
    if (emailExists) throw new ApiError(400, "Email already in use");

    const passwordHash = await bcrypt.hash(password, 10);
    const now = new Date();

    const insertQuery = `
      INSERT INTO "${tableName}" (username, email, "fullName", "passwordHash", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, username, email, "fullName";
    `;

    const res = await client.query(insertQuery, [
      username,
      email,
      fullName,
      passwordHash,
      now,
      now,
    ]);

    const newUser = res.rows[0];
    newUser.role = role.toUpperCase();

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(newUser);

    return { success: true, user: newUser, accessToken, refreshToken };
  } catch (err) {
    console.error("Registration Error:", err);
    throw new ApiError(500, err.message || "Internal server error during registration");
  }
};

// ✅ --- Login User ---
const login = async (credential, password) => {
  try {
    const query = `
      (SELECT id, username, email, "passwordHash", "fullName", "refreshtoken", 'CANDIDATE' AS role
      FROM "Candidates"
      WHERE email = $1 OR username = $1
      )UNION ALL
      (SELECT id, username, email, "passwordHash", "fullName", "refreshtoken", 'RECRUITER' AS role
      FROM "Recruiters"
      WHERE email = $1 OR username = $1)
      LIMIT 1
    `;

    const res = await client.query(query, [credential]);
    if (res.rows.length === 0) throw new ApiError(404, "User not found");

    const user = res.rows[0];
    console.log(user)
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new ApiError(401, "Invalid credentials");

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user);
     let cvUrl=undefined
    if(user.role==="CANDIDATE"){
      cvUrl=(await getUserById(user.id)).cvUrl
    }
   
    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        cvUrl
      },
      accessToken,
      refreshToken,
    };
  } catch (err) {
    console.error("Login Error:", err);
    throw new ApiError(err.statusCode || 500, err.message || "Login failed");
  }
};

// ✅ --- resume upload User ---
const updateCandidateProfile = async ({
  candidateId,
  domains,
  education,
  experience,
  projects,
  skills,
  cvUrl,
}) => {
  try {
    const query = `UPDATE "Candidates"
      SET 
        domain_id = $1,
        education = $2,
        experience = $3,
        projects = $4,
        skills = $5,
        "cvUrl" = COALESCE($6, "cvUrl"),
        "updatedAt" = NOW()
      WHERE id = $7
      RETURNING *;
    `;
    console.log("in db.js")
    const values = [
  domains || [],                        // INT[] column, keep as array of integers
  JSON.stringify(education || ""),      // JSONB columns must be stringified
  JSON.stringify(experience || ""),
  JSON.stringify(projects || ""),
  JSON.stringify(skills || ""),
  cvUrl,                                // TEXT
  candidateId                            // INT
];


    const result = await client.query(query, values);

    if (result.rows.length === 0) return { success: false };
    return { success: true, data: result.rows[0] };
  } catch (err) {
    console.error("❌ DB error updating candidate:", err);
    return { success: false, error: err.message };
  }
};

// ✅ --- Logout User ---
const logOut = async (userId, role) => {
  await updateRefreshToken(userId, role, null);
  return { success: true, message: "Logged out successfully" };
};


// ✅ --- Export Everything ---
export {
  client as query,
  register,
  login,
  logOut,
  getUserById,
  updateRefreshToken,
  checkUsername,
  checkEmail,
  updateCandidateProfile,
  getRecruiterById
};