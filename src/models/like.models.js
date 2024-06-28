import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
    comment : {
        type : Schema.Types.ObjectId,
        ref : "Comment"
    },
    video : {
        type : Schema.Types.ObjectId,
        ref : "Video"
    },
    likedBy : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
},
{
    timestamps : true
})

export default Comments = mongoose.model('Comments', commentSchema)