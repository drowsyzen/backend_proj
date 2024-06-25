// // asyncHandler using promise
const asyncHandler = (requesthandler) => {
    return (req,res,next) => {
        Promise.resolve(requesthandler(req,res,next)).catch((error) => next(error))
    }
}


// // asyncHandler using try catch
// const asyncHandler = (fn) => async (req ,res ,next) => {
//     try {
//         await fn(req,res,next)
//     }
//     catch(error){
//         console.log(error)
//         res.status(error.code || 409).json({
//             success: false,
//             message: error.message
//         })
//     }
// }

export default asyncHandler