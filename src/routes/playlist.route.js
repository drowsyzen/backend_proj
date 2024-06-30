import { Router } from "express";
import {
    createPlaylist,
    addVideo,
    removeVideo,
    deletePLaylist,
    getUserPLaylist,
    updatePLaylist
} from "../controllers/playlist.controller.js"
import verifyJWT from "../middlewares/auth.middleware.js";
// import { upload } from "../middlewares/multer.middleware.js"


const playlistRoute = Router()


playlistRoute.route("/createplaylist").post(verifyJWT,createPlaylist)
playlistRoute.route("/addvideo").get(addVideo)
playlistRoute.route("/removevideo").get(removeVideo)
playlistRoute.route("/deleteplaylist").get(deletePLaylist)
playlistRoute.route("/getuserplaylist").get(getUserPLaylist)
playlistRoute.route("/updateplaylist").get(updatePLaylist)
// userRoute.route("/watchhistory").get(verifyJWT,getWatchHistory)


export  default playlistRoute