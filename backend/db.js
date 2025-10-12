import { Client } from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError } from "./utils/ApiError.js";

// ✅ --- PostgreSQL Client Setup ---
const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "ApexHire",
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
      SELECT id, username, email, "fullName", 'CANDIDATE' AS role,"cvUrl"
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
        education = $1,
        experience = $2,
        projects = $3,
        skills = $4,
        "cvUrl" = COALESCE($5, "cvUrl"),
        "updatedAt" = NOW()
      WHERE id = $6
      RETURNING *;
    `;
    console.log("in db.js")
    const values = [
  education || {},
  experience || {},
  projects || {},
  skills || {},
  cvUrl,                                // TEXT
  candidateId                            // INT
];


    const result = await client.query(query, values);
    console.log(domains)
    for (const domain of domains) {
      const res = await client.query(`select * from "Candidate_Domain_Performance" where candidate_id = $1 AND domain_id = $2`, [candidateId, domain]);
      if(res.rows.length==0)
    await client.query(
      `INSERT INTO "Candidate_Domain_Performance" (candidate_id, domain_id) 
      VALUES($1, $2)`,
      [candidateId, domain]
    );
  }
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

const getUser = async (id) => {
    // 1. Get the main candidate details
    let candidateQuery = await client.query(`SELECT * FROM "Candidates" WHERE id = $1`, [id]);
    
    // Check if candidate exists
    if (candidateQuery.rows.length === 0) {
        return null;
    }
    
    let res = candidateQuery.rows[0];

    // Fetch domain data (this part is correct)
    const domainsQuery = await client.query(`
        SELECT 
            d.dmaid, d.name, cdp.tier, cdp.rank, cdp."totalInTier", cdp.progress 
        FROM "Domains" d
        JOIN "Candidate_Domain_Performance" cdp ON d.id = cdp.domain_id
        WHERE cdp.candidate_id = $1
    `, [id]);
    
    const domains = domainsQuery.rows;

    // --- ✅ FIX: Parse JSON strings from the database into actual arrays/objects ---
    const finalResponse = {
        fullName: res.fullName || 'N/A',
        bio: res.bio || '',
        
        // Safely parse JSON string fields, defaulting to empty array if null or invalid
        skills: res.skills ? JSON.parse(res.skills) : [], 
        experience: res.experience ? JSON.parse(res.experience) : [],
        projects: res.projects ? JSON.parse(res.projects) : [],
        education: res.education ? JSON.parse(res.education) : [],

        domains: domains,
        status: "ACTIVE",
        profilePicUrl: res.profilePicUrl || null,
        domainNews: [], // Default empty array
        timelineEvents: [
            {
                id: 1,
                date: "2025-10-12T00:00:00Z",
                description: "Joined the platform."
            }
        ]
    };
    
    return finalResponse;
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
  getRecruiterById,
  getUser
};