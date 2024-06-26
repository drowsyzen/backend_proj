import asyncHandler from "../utils/asyncHandler.js"
import Apierror from "../utils/apiError.js"
import { User } from "../models/users.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/apiResponse.js"

// const registerUser = asyncHandler( async (req,res) => {
//     console.log('IN the get req')
//     res.status(200).json({
//         message:"ok"
//     })
// })

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
    console.log('IN the get req')
    const users = User.findOne()
    console.log('IN the get req',users)
    
    return res.status(201).json(
        new ApiResponse(201,users,"User added successfully."))
    
})



// export default registerUser, getUser;
export { registerUser, getUser }