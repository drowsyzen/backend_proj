import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({
    origin:'*',
    credentials:true
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


// routes import
import userRoute from "./routes/user.routes.js";
import subscriptionRoute from "./routes/subscription.route.js";
import playlistRoute from "./routes/playlist.route.js";

// console.log('in route')
app.use("/user",userRoute)
app.use("/subscription",subscriptionRoute)
app.use("/playlist",playlistRoute)

export default app