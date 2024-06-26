import { User } from "../models/users.models.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";


const verifyJWT = asyncHandler(async (req,_,next) => {
    try{
        const accessToken = req.cookies?.accessToken

        if(!accessToken){
            throw new ApiError(402,"Unauthorized request")
        }

        const tokendata = jwt.verify(accessToken,process.env.ACCESS_TOKEN)

        const usrObj = await User.findById(tokendata._id).select("-password -refreshToken")

        if (!usrObj){
            throw new ApiError(403,'Invalid Access Token')
        }

        req.user = usrObj
        next()

    }
    catch(error){
        console.log('Error while validating auth tokens',error)
    }
})

export default verifyJWT