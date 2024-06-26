import { Router } from "express";
// import { getUser } from "../controllers/user.controller.js";
import { 
    registerUser,
    login,
    getUser,
    logout,
    refreshAccessToken,
 } from "../controllers/user.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"


const userRoute = Router()

userRoute.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount : 1
        },
        {
            name: "coverImage",
            maxCount : 1
        }
    ]),
    registerUser
)

userRoute.route("/getuser").get(getUser)

userRoute.route("/login").post(login)
userRoute.route("/logout").post(verifyJWT,logout)
userRoute.route("/refresh").post(refreshAccessToken)


export  default userRoute