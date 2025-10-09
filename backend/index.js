
import express from 'express';
import {app} from "./app.js"
import dotenv from "dotenv"
import {query} from './db.js';
dotenv.config({
    path:'./.env'
})

query().then(()=>{console.log("Query successful")})
        .catch((e)=>{console.log("Failed to Connect DB")});
//give connection to database from here

app.listen(process.env.PORT||8000,()=>{
    console.log(`Server Connected at port ${process.env.PORT}`);
})
app.on('error',(e)=>{
        console.log("Server issue")
    })
