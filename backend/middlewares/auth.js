import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import jwt from "jsonwebtoken"
import { getUserById } from "../db.js";

export const verifyJWT= asyncHandler(async (req,res,next)=>{
   try {
    const token = req.cookies?.accessToken||req.header("Authorization")?.replace("Bearer ","")
    console.log(req)
    if(!token){
     throw new ApiError(401,"Unauthorized Request")
    }
    const decoded=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    console.log(decoded,token)
    // const user=await User.findById(decoded?._id).select("-password -refreshToken");
    const user = await getUserById(decoded.userId);
    if(!user){
     // Discuss about frontend
         throw new ApiError(400,"Invalid Access Token")
    }
    req.user=user;
    next()
   } catch (error) {
      console.log(error)
          throw new ApiError(401,"Invalid Access Token")
   }

   
})
