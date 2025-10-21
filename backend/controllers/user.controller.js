import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { register, login, getUserById,updateRefreshToken,checkEmail,checkUsername,updateCandidateProfile,getRecruiterById, getUser,logOut, getRecUser} from "../db.js"



const registerUser = asyncHandler(async (req, res) => {

    const { name, username, email, password,role, companyname } = req.body;
    if ([name, username, email, password,role].some((field) => field?.trim() == "")) {
        throw new ApiError(404, "All Fields are required");
    }
    const existedUser = 0//query to find users existance

    if (existedUser) {
        throw new ApiError(400, "User Already Exists");
    }

    console.log("Company ", companyname);
    const createdUser = await register(username, email, name, password, role, companyname);

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

    const { email, password,role } = req.body
    const existedUser = await login(email, password);
   
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
    console.log(role);
    if(role==="CANDIDATE"){
        LoggedInUser = await getUserById(existedUser.user.id);
    }else if(role==="RECRUITER"){
         LoggedInUser = await getRecruiterById(existedUser.user.id);
    }

    const options = {
        httpOnly: true,
        secure: true
    }
    console.log("Logged in ", LoggedInUser);
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
  try {
    // Parse JSON data from frontend
    const data = req.body || {};
    const { domains, education, experience, projects, skills } = JSON.parse(data.data);

    // Handle CV upload if provided
    let cvUrl = 100;
    // const localCvPath = req.files?.resume?.[0]?.path;
    // if (localCvPath) {
    //   const uploadedCv = await uploadOnCloudinary(localCvPath);
    //   if (!uploadedCv?.url) throw new ApiError(400, "CV upload failed");
    //   cvUrl = uploadedCv.url;
    // }

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
    console.log(updatedCandidate)
    // Parse JSON fields before sending response
    updatedCandidate.domains = JSON.parse(updatedCandidate.domains || "[]");
    updatedCandidate.education = updatedCandidate.education || {};
    updatedCandidate.experience = updatedCandidate.experience || {};
    updatedCandidate.projects = updatedCandidate.projects || {};
    updatedCandidate.skills = updatedCandidate.skills || {};

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
        const UpdateUser=await updateRefreshToken(userId,'Candidate',null)

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

const mainDashBoard = asyncHandler(async(req,res)=>{
   try {
    const { userId } = req.user;

    const candidate = await getCandidateMainDashBoardById(userId);
    if (!candidate) {
      return res.status(404).json({ success: false, message: "Candidate not found" });
    }

    // remove sensitive fields (extra safety)
    const { passwordHash, refreshToken, ...safeCandidate } = candidate;

    return res.status(200).json({
      success: true,
      message: "Candidate profile fetched successfully",
      data: safeCandidate,
    });
  } catch (error) {
    console.error("Error fetching candidate:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
})


const getRecData = asyncHandler(async (req, res) => {
    try {
      console.log("Hiiiii");
        const id = req.user?.id;

        if (!id) {
            throw new ApiError(401, "User not authenticated or ID is missing");
        }

        const result = await getRecUser(id);

        if (!result) {
            throw new ApiError(404, "Recruiter data not found");
        }
        
        // The result is already a complete JSON object from getUser
        return res.status(200).json(new ApiResponse(200, result, "Recruiter data fetched successfully"));

    } catch (e) {
        console.error("Error in getData controller:", e);
        // Pass the error to the asyncHandler's error handler
        throw new ApiError(e.statusCode || 500, e.message || "Failed to get user data");
    }
});

const getCurrentUser = asyncHandler(async (req, res) => {
    // The verifyJWT middleware has already found the user (candidate or recruiter)
    // and attached them to the request object. We just return it here.
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "User data fetched successfully"));
});

const getData = asyncHandler(async (req, res) => {
    try {
        // ❌ WRONG: Don't get id from body on a GET request.
        // const { id } = req.body; 

        // ✅ CORRECT: Get the authenticated user's ID from the verifyJWT middleware.
        const id = req.user?.id;

        if (!id) {
            throw new ApiError(401, "User not authenticated or ID is missing");
        }

        const result = await getUser(id);

        if (!result) {
            throw new ApiError(404, "Candidate data not found");
        }
        
        // The result is already a complete JSON object from getUser
        return res.status(200).json(new ApiResponse(200, result, "Candidate data fetched successfully"));

    } catch (e) {
        console.error("Error in getData controller:", e);
        // Pass the error to the asyncHandler's error handler
        throw new ApiError(e.statusCode || 500, e.message || "Failed to get user data");
    }
});

export { registerUser, logInUser,logOutUser,checkemail,checkusername,updateDetails,mainDashBoard, getData, getRecData, getCurrentUser }