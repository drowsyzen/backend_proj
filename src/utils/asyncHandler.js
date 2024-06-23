// // asyncHandler using promise
const asyncHandler = () => {
    (req,res,next) => {
        Promise.resolve(req,res,next).catch((error) => next(error))
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

export { asyncHandler }