import { Router } from "express";
import { getUser } from "../controllers/user.controller.js";
import { registerUser } from "../controllers/user.controller.js";
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


export  default userRoute