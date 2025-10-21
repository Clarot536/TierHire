import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
// ✅ Import BOTH functions to find users
import { getUserById, getRecruiterById } from "../db.js"; 

const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request: No token provided");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // ✅ --- THIS IS THE CORE FIX ---
        // Check the role from the token and fetch from the correct table.
        let user;
        if (decodedToken.role === 'RECRUITER') {
            user = await getRecruiterById(decodedToken?.userId);
        } else if (decodedToken.role === 'CANDIDATE') {
            user = await getUserById(decodedToken?.userId);
        } else {
             // If the role is missing or invalid
            throw new ApiError(401, "Invalid token: User role is not specified.");
        }

        if (!user) {
            throw new ApiError(401, "Invalid Access Token: User not found");
        }

        // Attach the found user (either candidate or recruiter) to the request object
        req.user = user;
        next();

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
});

export { verifyJWT };