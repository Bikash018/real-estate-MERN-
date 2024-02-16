const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const userRouter = require('./routes/user.routes') 
const authRouter = require("./routes/auth.routes.js")
dotenv.config()

mongoose.connect(process.env.MONGO)
    .then(()=>{
        console.log("Connected to database");
    }).catch((error)=>{
        console.log(error);
    })

const app =  express();
app.use(express.json());

app.use("/api/user",userRouter)
app.use("/api/auth",authRouter)

app.listen(3000,()=>{
    console.log("sever is running on port 3000");
})