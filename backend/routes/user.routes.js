import Router from "express"
import {registerUser,logInUser,logOutUser} from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.js"
import { checkusername, checkemail, updateDetails, mainDashBoard, getData } from "../controllers/user.controller.js";

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
router.route("/getData").get(verifyJWT, getData);
    


export default router