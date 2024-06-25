import dotnev from "dotenv"
import connectDB  from "./db/index.js"
import app from "./app.js"

dotnev.config({
    path:'./env'
})

connectDB().then(
    ()=>{
        app.listen(process.env.PORT, () => {
            console.log(`Server is listenting at port : ${process.env.PORT}`)
        })
    }).catch((err) => {
        console.log('Failed connection',err)
    })