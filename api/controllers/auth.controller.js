const User = require("../models/user.model");
const bcrypt = require("bcryptjs");


module.exports.signup = async (req,res,next) =>{
   const {username,email,password} = req.body;
   const hashedPassword= bcrypt.hashSync(password,10);
   const newUser = new User({username,email,password:hashedPassword});
   try{
      await newUser.save();
      res.json("new user created successfully");
   } 
   catch(err){
     next(err);
   }
   
}