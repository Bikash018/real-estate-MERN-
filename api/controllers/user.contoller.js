const bcryptjs =  require('bcryptjs');
const User = require('../models/user.model.js');
const { errorHandler } = require('../utils/errorHandler.js');
const Listing = require('../models/listing.model.js');
module.exports.test = (req,res)=>{
    res.json({
        "message" : "hello world"
    })
}

module.exports.updateUser = async (req,res)=>{
   
    if(req.user.id !== req.params.id) {
        return next(errorHandler(401, 'You can only update your own account!')); 
    }
    try {
        if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password,10)
        }

        const updateUser = await User.findByIdAndUpdate(
            req.params.id , 
            {
                $set : {
                    username : req.body.username,
                    email : req.body.email,
                    password: req.body.password,
                    avatar : req.body.avatar
                },
            },
            { new: true }
        )
        const {password , ...rest} = updateUser._doc;
        res.status(200).json(rest);

    } catch(err){
        next(err);
    }
    
}

module.exports.deleteUser = async (req,res,next) =>{
    if(req.user.id !== req.params.id){
        return next(errorHandler('401',"you can delete only your account"))
    }
    try{
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json('User has been deleted!');

    }catch(err){
        next(err)
    }
}

module.exports.getUserListings = async(req,res,next) =>{
    if(req.user.id === req.params.id) {
        try{
            const Listings = await Listing.find({userRef : req.params.id});

            res.status(200).json(Listings);

        } catch(err){
            next(err)
        }
    } else{
        return next(errorHandler(401, 'You can only view your own listings!'));
    }
}
