import mongoose from "mongoose"
import express from "express"
import { DBNAME } from "../constants.js"

const app = express()

const connectDB = async () => {
    try {
        // console.log(process.env.DBURL);
        const connectionInst = await mongoose.connect(`${process.env.DBURL}/${DBNAME}`);
        console.log('mongo db connected');
        console.log(connectionInst.connection.host,' : Host Name');
    }
    catch(error){
        console.log(error);
        process.exit(1)
    }
}

export default connectDB