import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { checkemail, checkusername, login, register } from "../db.js";


const registerUser=asyncHandler(async(req,res)=>{
   const {name,username,email,password, role}=req.body;
   if([name,username,email,password, role].some((field)=>field?.trim()=="")){
        throw new ApiError(404,"All Fields are required");
   }
    const createdUser = await register(username, email, name, password, role);

    return res
           .status(200)
           .json(
            createdUser
           ) })

const logInUser = asyncHandler(async (req, res) => {
  const { credential, password } = req.body;

  // ✅ Validate input
  if ([credential, password].some((field) => !field?.trim())) {
    return res.status(400).json({ status: 400, message: "All fields are required" });
  }

  // ✅ Actually call the login function
  const result = await login(credential, password);

  if (result.status !== 200) {
    return res.status(result.status).json(result);
  }

  return res.status(200).json(result);
});

const checkEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await checkemail(email);
  if(result)
    return res.status(200).json({user : true, username : false, email : true});
  return res.status(200).json({user : false});
});

const checkUsername = asyncHandler(async (req, res) => {
  const { username } = req.body;
  const result = await checkusername(username);
  if(result)
    return res.status(200).json({user : true, username : true, email : false});
  return res.status(200).json({user : false});
});

export {registerUser,logInUser, checkEmail, checkUsername}