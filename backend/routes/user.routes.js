import Router from "express"
import {registerUser,logInUser} from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.js"
import { checkUsername, checkEmail } from "../controllers/user.controller.js";

const router  = Router();
router.route("/register").post(registerUser);
router.route("/login").post(logInUser);
router.route("/checkUsername").post(checkUsername);
router.route("/checkEmail").post(checkEmail);

export default router