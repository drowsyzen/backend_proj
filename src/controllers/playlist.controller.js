import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/users.models.js";
import { Playlist } from "../models/playlist.models.js";
import ApiResponse from "../utils/apiResponse.js";


const createPlaylist = asyncHandler( async (req, res) => {
    // const name = req.body?.name , description = req.body?.description
    const { name, description } = req.body

    if (!name){
        throw new ApiError(411,"Playlist Name is required.")
    }

    
    const playlist = await Playlist.create({
        name,
        description,
        user : req.user?._id
    })

    return res
    .status(200)
    .json(
        new ApiResponse(211,"Playlist created Successfully.")
    )

})

const addVideo = asyncHandler( async (req, res) => {


})

const removeVideo = asyncHandler( async (req, res) => {


})

const deletePLaylist = asyncHandler( async (req, res) => {



})

const getUserPLaylist = asyncHandler( async (req, res) => {

})

const updatePLaylist = asyncHandler( async (req, res) => {

})

export {
    createPlaylist,
    addVideo,
    removeVideo,
    deletePLaylist,
    getUserPLaylist,
    updatePLaylist
}