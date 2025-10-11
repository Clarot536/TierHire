import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { register, login, getUserById,updateRefreshToken } from "../db.js"



const registerUser = asyncHandler(async (req, res) => {
    console.log("iam in controller.js")

    const { name, username, email, password } = req.body;
    if ([name, username, email, password].some((field) => field?.trim() == "")) {
        throw new ApiError(404, "All Fields are required");
    }
    const existedUser = 0//query to find users existance

    if (existedUser) {
        throw new ApiError(400, "User Already Exists");
    }


    const createdUser = await register(username, email, name, password);

    if (createdUser) {
        console.log("User Created ");
    }



    if (!createdUser) {
        throw new ApiError(400, "Something Went Wrong While creating a user")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, createdUser, "new User Created")
        )


})

const logInUser = asyncHandler(async (req, res) => {

    const { credential, password } = req.body

    if ([credential, password].some((fields) => fields.trim() === "")) {
        throw new ApiError(400, "All Fields Must Be Entered")
    }
    const existedUser = await login(credential, password);
    

    if (!existedUser?.userId) {
        console.log("User not created")
        throw new ApiError(400, "User doesnot  exisits")

    }
    const accessToken=existedUser?.accessToken
    const refreshToken=existedUser?.refreshToken

        console.log(accessToken)

    
    const LoggedInUser = await getUserById(existedUser.userId);
    console.log(LoggedInUser)

    const options = {
        httpOnly: true,
        secure: true
    }
    
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, {
            user: LoggedInUser,
            refreshToken, accessToken
        }, "User Logged In Successfully"))


})
const logOutUser = asyncHandler(async (req, res) => {
        const userId=req.user.id
        const UpdateUser=await updateRefreshToken(userId,null)

    const options={
        httpOnly:true,
        secure:true
    }
    return res
           .status(200)
           .clearCookie("accessToken",options)
           .clearCookie("refreshToken",options)
           .json(new ApiResponse(200,"User logged Out Successfully"))


})

export { registerUser, logInUser,logOutUser }