import asyncHandler from "../utils/asyncHandler.js"
import Apierror from "../utils/apiError.js"
import { User } from "../models/users.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/apiResponse.js"
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// const registerUser = asyncHandler( async (req,res) => {
//     console.log('IN the get req')
//     res.status(200).json({
//         message:"ok"
//     })
// })

const generateAccessAndRefreshToken = async (userid) => {
    try{

        const usrobej = await User.findById({_id:userid})
        const accessToken = await usrobej.generateAccessToken()
        const refreshToken = await usrobej.generateRefreshToken()

        usrobej.refreshToken = refreshToken
        await usrobej.save({validateBeforeSave:false}) 

        return { accessToken, refreshToken }

    }
    catch(error){
        throw new Apierror(502,"something went wrong while generating the tokens.")
    }
}

const registerUser = asyncHandler( async (req,res) => {
    console.log('IN the get req')

    const {fullName, email, username, password} =req.body  ;
    console.log('email',email)

    if (
        [fullName,email,username,password].some((field) => field?.trim() == "")
    ){
        throw new Apierror(401,"fields are required.")
    }
    else{
        console.log("no error found")
    }

    const userExist = await User.findOne({
        $or: [{ username }, { email }]
    })

    if(userExist){
        throw new Apierror(402,"Username or Email Already exists.")
    }

    console.log('req.files >>',req.files);
    
    const avatarlocalpath = req.files?.avatar[0]?.path
    const coverImagelocalpath = req.files?.coverImage[0]?.path
    
    if (!avatarlocalpath){
        throw new Apierror(403,'avatar is required(local)')
    }
    
    const avatar = await uploadOnCloudinary(avatarlocalpath)
    const coverImage = await uploadOnCloudinary(coverImagelocalpath)
    
    if (!avatar){
        throw new Apierror(403,'avatar is required')
    }
    
    const userobj = User.create({
        fullName,
        username,
        email,
        password,
        avatar : avatar.url,
        coverImage : coverImage?.url || ""

    })

    const createduser = User.findById(userobj._id).select(
        "-password -refreshToken"
    )

    if (!createduser){
        throw new Apierror(506,"something went wrong while registering user")
    }

    return res.status(201).json(
        new ApiResponse(201,createduser,"User added successfully.")
    ) 

})

const getUser = asyncHandler( async (req,res) => {
    // console.log('IN the get req')
    // const users = User.find()
    const uquery = User.findOne({'username':'qwerty1'}).select('-password').exec().then(
        console.log()
    )

    console.log('IN -->',uquery)
    // console.log('IN the get req',users.fullName)
    
    // return res.status(201).json(
    //     new ApiResponse(201,users,"User added successfully."))
    
    return res.status(202).json(
        new ApiResponse(201,"users","User added successfully."))
})



const login = asyncHandler( async (req,res) => {
    // console.log('IN the get req')
    // const users = User.find()
    const {username ,email, password} = req.body

    if (!(username || email) ){
        throw new Apierror(406,"username or email is required")
    }

    const usrobj = User.findOne({
        $or:[ {username}, {email}]
    })

    if (!usrobj) {
        throw new Apierror(407,"User does not exists")
    }

    const passwordcheck = await usrobj.isPasswordCorrect(password)

    if (!passwordcheck){

        throw new Apierror(408,'Password is not correct')
    }

    const { acsToken,refshToken } = await generateAccessAndRefreshToken(usrobj._id)

    const loggedinUser = User.findById(usrobj._id).select("-password -refreshToken")

    const options = {
        httpOnly:true,
        secure:true
    }

    return res
            .status(200)
            .cookie("accessToken",acsToken,options)
            .cookie("refreshToken",refshToken,options)
            .json(
                new ApiResponse(200,{
                    user:loggedinUser,acsToken,refshToken
                })
            )


})

const logout = asyncHandler( async (req,res) => {
    
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set :{
                refreshToken: undefined
            }
        }    
    )

    const options = {
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(208,"","logged out")
    )


})


const refreshAccessToken = asyncHandler( async (req,res) => {
    const reqrefreshToken = req.cookies?.refreshToken

    if (!reqrefreshToken){
        throw new Apierror(401,"No refresh token found.")
    }

    const decodedToken  = jwt.verify(reqrefreshToken,process.env.ACCESS_TOKEN)

    if (!decodedToken){
        throw new Apierror(401,"Invalid refresh token.")
    }

    const refUserObj = await User.findById(decodedToken._id).select("-password")

    if (!refUserObj){
        throw new Apierror(403,"Invalid refresh token.")
    }
    
    if (refUserObj.refreshToken == reqrefreshToken){
        throw new Apierror(402,"refresh token is expired or used.")
    }

    const {newaccessToken,newrefreshToken} = await generateAccessAndRefreshToken(refUserObj._id)

    const options = {
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accessToken",newaccessToken,options)
    .cookie("refreshToken",newrefreshToken,options)
    .json(
        new ApiResponse(208,{
            user:{refUserObj, newaccessToken, newrefreshToken}
        },
        "access token refreshed.")
    )

})


const getUserChannelProfile = asyncHandler( async(req,res) => {
    const channel = req.params.channel

    if (!channel) {
        throw new Apierror(401,"channel is required")
    }

    // const chaneldata = await User.findOne({username:channel}).select("-password -refreshToken")


    const channelData = await User.aggregate([
        {
            $match :{
                username : username
            }
        },
        {
            $lookup :{
                from : "Subscription",
                localField : '_id',
                foreignField : "channel",
                as : "subscribers"
            }
        },
        {
            $lookup :{
                from : "Subscription",
                localField : '_id',
                foreignField : "subscriber",
                as : "subscribedTo"
            }
        },
        {
            $addFields : {
                subscribersCount :{
                    $size : "$subscribers"
                },
                subscribedCount :{
                    $size : "$subscribedTo"
                },
                isSubscribed : {
                    $cond : {
                        if : {$in: [req.user?._id,"$subscribers.subscriber"]},
                        then : true,
                        else : false
                    }
                }
            }
        },
        {
            $project : {
                fullName : 1,
                username : 1,
                email : 1,
                subscribedCount : 1,
                subscribersCount : 1,
                isSubscribed : 1,
                avatar : 1,
                coverImage : 1
            }
        }
    ])


    if (!channelData?.length){
        throw new Apierror(401,"channel not found.")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, channelData[0], "channel data found successfully.")
    )

})

const getWatchHistory = asyncHandler(async (req,res) => {

    const watchHistoryData = await User.aggregate([
        {
            $match : {
                _id : mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup : {
                from : "videos",
                localField : "watchHistory",
                foreignField : "_id",
                as : "watchhistorylist",
                pipeline : [
                    {
                        $lookup : {
                            from : "users",
                            localField : "owner",
                            foreignField : "_id",
                            as : "owner",
                            pipeline : {
                                $project : {
                                    fullName : 1,
                                    avatar : 1,
                                    username : 1
                                }
                            }
                        }
                    },
                    {
                        $addFields:{
                            owner : {
                                $first : "$owner"
                            }
                        }
                    }
                ]
            }
        },
        {
            $addFields :{}
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(256,watchHistoryData[0],"Watch history found successfully")
    )

})


// export default registerUser, getUser;
export { registerUser
    ,getUser
    ,login
    ,logout
    ,refreshAccessToken
    ,getUserChannelProfile
    ,getWatchHistory
}