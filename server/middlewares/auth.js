import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
// ✅ Import BOTH functions to find users
import { getUserById, getRecruiterById } from "../db.js"; 
import { use } from "react";

const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        let accessToken = req.cookies?.accessToken;
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            throw new ApiError(401, "Unauthorized request: No token provided");
        }

        if(!accessToken){
            const acc = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
            accessToken = jwt.sign(
                {userId: acc.id,
                email: acc.email,
                username: acc.username,
                role: acc.role,},
                process.env.ACCESS_TOKEN_SECRET,{ expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1m" });
        }
        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        let user;
        console.log(decodedToken.role, decodedToken.userId, decodedToken.role);
        if (decodedToken.role === 'RECRUITER') {
            user = await getRecruiterById(decodedToken?.userId);
        } else if (decodedToken.role === 'CANDIDATE') {
            user = await getUserById(decodedToken?.userId);
        } else {
            throw new ApiError(401, "Invalid token: User role is not specified.");
        }
        if (!user) {
            throw new ApiError(401, "Invalid Access Token: User not found");
        }
        if(user.refreshtoken!=refreshToken)
            throw new ApiError(401, "Invalid refresh token.");
        req.user = user;
        res.cookie("accessToken", accessToken, { httpOnly: true, secure: true });
        next();

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
});

export { verifyJWT };