import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
    content : {
        type : String,
        required : true
    },
    video : {
        type : Schema.Types.ObjectId,
        ref : "Video"
    },
    commentOwner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
},
{
    timestamps : true
})

export default Comments = mongoose.model('Comments', commentSchema)