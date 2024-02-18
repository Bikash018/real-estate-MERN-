const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const {errorHandler} = require("../utils/errorHandler.js");
const jwt = require('jsonwebtoken');


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

module.exports.signin = async (req,res,next) =>{
   const {email,password} = req.body;
   try{
      const validUser = await User.findOne({email});
      if(!validUser)  return next(errorHandler('404',"User Not found"));
      const validPassword =bcrypt.compareSync(password,validUser.password);
      if(!validPassword) return next(errorHandler('401' ,"Wrong Credentials!"));
      const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
      const {password : pass , ...rest} = validUser._doc;
      res
         .cookie('access-token',token, {httpOnly: true })
         .status(200)
         .json(rest)
   } 
   catch(error) {
      next(error);
   }
}