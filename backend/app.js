import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app=express()

app.use(cors({
   origin:process.env.CORS_ORIGIN,
   credentials:true,

}))
app.use(express.json({limit:"200kb"}))
app.use(express.urlencoded({extended:true,limit:"20kb"}))
app.use(express.static('public'))
app.use(cookieParser());

//routes import
import userRoutes from "./routes/user.routes.js"

//routes declaration: as routes are declared separatly we cannot use get so we use app.use() middleware
app.use("/users",userRoutes)

export {app}