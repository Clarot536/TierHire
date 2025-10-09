
import express from 'express';
import {app} from "./app.js"
import dotenv from "dotenv"
dotenv.config({
    path:'./.env'
})

//give connection to database from here

 app.listen(process.env.PORT||8000,()=>{
        console.log(`Server Connected at port ${process.env.PORT}`);

})
app.on('error',(e)=>{
        console.log("Server issue")
    })
