import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const registerUser=asyncHandler(async(req,res)=>{
   const {name,username,email,password}=req.body;
   if([name,username,email,password].some((field)=>field?.trim()=="")){
        throw new ApiError(404,"All Fields are required");
   }
   console.log("iam in controller.js")
   const existedUser=0//query to find users existance

    if (existedUser) {
        throw new ApiError(400, "User Already Exists");
    }


    //create or upload everything to database

    const createdUser = 0//fetch the user details from database

    if(!createdUser){
        throw new ApiError(400, "Something Went Wrong While creating a user")

    }

    return res
           .status(200)
           .json(
            new ApiResponse(200,createdUser,"new User Created")
           ) 


    




})

const logInUser=asyncHandler(async(req,res)=>{

})

export {registerUser,logInUser}