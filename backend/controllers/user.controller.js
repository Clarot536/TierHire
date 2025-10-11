import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { register, login, getUserById,updateRefreshToken,checkEmail,checkUsername,updateCandidateProfile,getRecruiterById} from "../db.js"



const registerUser = asyncHandler(async (req, res) => {

    const { name, username, email, password,role   } = req.body;
    if ([name, username, email, password,role].some((field) => field?.trim() == "")) {
        throw new ApiError(404, "All Fields are required");
    }
    const existedUser = 0//query to find users existance

    if (existedUser) {
        throw new ApiError(400, "User Already Exists");
    }


    const createdUser = await register(username, email, name, password,role);

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

    const { credential, password,role } = req.body

    if ([credential, password].some((fields) => fields.trim() === "")) {
        throw new ApiError(400, "All Fields Must Be Entered")
    }
    const existedUser = await login(credential, password);
   
    console.log(existedUser)
    if (!existedUser?.user.id) {
        console.log("User not created")
        throw new ApiError(400, "User doesnot  exisits")

    }
    const accessToken=existedUser?.accessToken
    const refreshToken=existedUser?.refreshToken
    console.log("Access token")

    //resume uploading process
    // const localResumePath = req.files?.resume[0]?.path;
    // const resumeUploaded = await uploadOnCloudinary(localResumePath)

    //  if (!resumeUploaded) {
    //     throw new ApiError(400, "Need resume  file")
    // }
    // const resumeUploadStatus=await uploadResume(resumeUploaded,existedUser?.user.id,role);
    let LoggedInUser=null
    if(role==="CANDIDATE"){
        LoggedInUser = await getUserById(existedUser.user.id);
    }else if(role==="RECRUITER"){
         LoggedInUser = await getRecruiterById(existedUser.user.id);
    }
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

const checkemail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await checkEmail(email);
  if(result)
    return res.status(200).json({user : true, username : false, email : true});
  return res.status(200).json({user : false});
});

const checkusername = asyncHandler(async (req, res) => {
  const { username } = req.body;
  const result = await checkUsername(username);
  if(result)
    return res.status(200).json({user : true, username : true, email : false});
  return res.status(200).json({user : false});
});

//update user detatils to dashboard

 const updateDetails = asyncHandler(async (req, res) => {
  const candidateId = req.user.id; // from auth middleware
    console.log(req)
  try {
    // Parse JSON data from frontend
    const data = JSON.parse(req.body.data || "{}");
    const { domains, education, experience, projects, skills } = data;

    // Handle CV upload if provided
    let cvUrl = null;
    const localCvPath = req.files?.cv?.[0]?.path;
    if (localCvPath) {
      const uploadedCv = await uploadOnCloudinary(localCvPath);
      if (!uploadedCv?.url) throw new ApiError(400, "CV upload failed");
      cvUrl = uploadedCv.url;
    }

    // Update in DB
    const updateResult = await updateCandidateProfile({
      candidateId,
      domains,
      education,
      experience,
      projects,
      skills,
      cvUrl,
    });

    if (!updateResult.success) {
      throw new ApiError(500, "Failed to update candidate profile");
    }

    const updatedCandidate = updateResult.data;

    // Parse JSON fields before sending response
    updatedCandidate.domains = JSON.parse(updatedCandidate.domains || "[]");
    updatedCandidate.education = JSON.parse(updatedCandidate.education || "[]");
    updatedCandidate.experience = JSON.parse(updatedCandidate.experience || "[]");
    updatedCandidate.projects = JSON.parse(updatedCandidate.projects || "[]");
    updatedCandidate.skills = JSON.parse(updatedCandidate.skills || "[]");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedCandidate,
    });
  } catch (err) {
    console.error("❌ Error in controller:", err);
    throw new ApiError(err.statusCode || 500, err.message || "Server error");
  }
});




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

export { registerUser, logInUser,logOutUser,checkemail,checkusername,updateDetails}