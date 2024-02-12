const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()

mongoose.connect(process.env.MONGO)
    .then(()=>{
        console.log("Connected to database");
    }).catch((error)=>{
        console.log(error);
    })

const app =  express();

app.listen(3000,()=>{
    console.log("sever is running on port 3000");
})