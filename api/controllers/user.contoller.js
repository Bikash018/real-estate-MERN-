const bcryptjs =  require('bcryptjs');
const User = require('../models/user.model.js');
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
