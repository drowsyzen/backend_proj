import asyncHandler from "../utils/asyncHandler.js"


// const registerUser = asyncHandler( async (req,res) => {
//     console.log('IN the get req')
//     res.status(200).json({
//         message:"ok"
//     })
// })

const registerUser = asyncHandler( async (req,res) => {
    console.log('IN the get req')
    res.status(204).json({
        message:"ok"
    })
})


export default registerUser