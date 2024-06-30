import { Router } from "express";
// import { getUser } from "../controllers/user.controller.js";
import { 
    toggleSubscription,
    subscribersList,
    channelList
 } from "../controllers/subscription.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js"
// import { upload } from "../middlewares/multer.middleware.js"


const subscriptionRoute = Router()

subscriptionRoute.route("/toggleSubscription").post(verifyJWT,toggleSubscription)
subscriptionRoute.route("/subscribersList").post(subscribersList)
subscriptionRoute.route("/channelList").post(channelList)

export  default subscriptionRoute