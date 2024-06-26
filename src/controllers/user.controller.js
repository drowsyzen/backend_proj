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

    if (!username || !email ){
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


// export default registerUser, getUser;
export { registerUser, getUser }