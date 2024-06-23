import mongoose from "mongoose"
import express from "express"
import { DBNAME } from "./constants.js"

const app = express()

;( async() => {
    try {
        await mongoose.connect(`${process.env.DBURL}/${DBNAME}`);
        app.on("error", (error) => {
            console.log("Error connecting app to database", error);
            throw error;
        });
        app.listen(process.env.PORT, () => {
            console.log(`server started on ${process.env.PORT}`);
        })

    }
    catch(error){
        console.log("Error connecting to database : ",error)
        throw error
    }
})()
