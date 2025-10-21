import Router from "express"
import {registerUser,logInUser,logOutUser} from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.js"
import { checkusername, checkemail, updateDetails, mainDashBoard, getData, getRecData, getCurrentUser } from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.js"; 
const router  = Router();
router.route("/register").post(registerUser)
router.route("/login").post(logInUser)
router.route("/logout").post(verifyJWT,logOutUser)
router.route("/checkUsername").post(checkusername);
router.route("/checkEmail").post(checkemail);
router.route("/updateDashboard").post(verifyJWT,upload.fields([
    {
        name:"resume",
        maxCount:1
 
    }]),updateDetails)
router.route("/mainDashboard").post(verifyJWT,mainDashBoard)    
router.route("/me").get(verifyJWT, getCurrentUser);
router.route("/getData").get(
    // 1. Add this logging middleware
    (req, res, next) => {
        console.log("➡️ Calling controller: getData");
        next(); // 2. Pass control to the next function (verifyJWT)
    },
    verifyJWT,
    getData
);

router.route("/getRecData").get(
    // 1. Add this logging middleware
    (req, res, next) => {
        console.log("➡️ Calling controller: getRecData");
        next(); // 2. Pass control to the next function (verifyJWT)
    },
    verifyJWT,
    getRecData
);


export default router