const User = require('');

exports.signup = async(req,res,)=>
{
    try{
        const{email,password,name} = req.body;

        if(!email||!password||!name){
            return res.status(400).json({
                message:"Please provide all the required details"

            });
        }
    }

    catch(error){


    }
    ;
    
}


