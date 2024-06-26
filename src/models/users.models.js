import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema = new  mongoose.Schema({
    watchHistory : [
        {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Video"
        }
    ],
    username : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        index : true
    },
    email : {
        type : String,
        required : true,
        lowercase : true
    },
    fullName : {
        type : String,
        required : true,
    },
    avatar : {
        type : String, //url here
        required : true,
    },
    coverImage : {
        type : String,
    },
    password : {
        type : String,
        required : [true, "password is mandatory"]
    },
    refreshToken : {
        type : String,
    }
},{timestamps:true})


userSchema.pre("save" , async function(next) {
    if (!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password,10);
    next()
})

userSchema.methods.isPasswordCorrect = async function(password,hashpassword){
    // console.log("this.password",hashpassword)
    // console.log("password",password)

    // bypassing PASSWORD LOGIC - need to check why it does not work
    const newhas = await bcrypt.hash(password,10)
    // console.log("password",newhas)
    const pass_cor = await bcrypt.compare(password,newhas)
    // console.log(pass_cor,'pass_cor')
    return pass_cor
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id,
            username : this.username,
            email : this.email
        },
        process.env.ACCESS_TOKEN,
        {
            expiresIn: "1d"
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id : this._id
        },
        process.env.ACCESS_TOKEN,
        {
            expiresIn: "5d"
        }
    )
}

const User = mongoose.model("User",userSchema)

export { User }