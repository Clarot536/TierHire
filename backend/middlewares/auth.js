import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getUserById } from "../db.js"; // You'll need this to get the full user

const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        // Get the token from the cookies sent by the browser
        const token = req.cookies?.accessToken;

        if (!token) {
            throw new ApiError(401, "Unauthorized request: No token provided");
        }

        // Verify the token using your secret key
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Fetch the user from the database using the ID from the token
        const user = await getUserById(decodedToken?.userId);

        if (!user) {
            // This handles cases where the user might have been deleted but the token still exists
            throw new ApiError(401, "Invalid Access Token: User not found");
        }

        // IMPORTANT: Attach the full user object to the request
        req.user = user;
        console.log("User ", req.user);
        next(); // Proceed to the next middleware or controller

    } catch (error) {
        // Catches errors from jwt.verify (e.g., expired token, invalid signature)
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
});

export { verifyJWT };