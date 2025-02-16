const User = require('');
const {validateEmail} = require("utils\validate.js");
const jwt = require('jsonwebtokens')

exports.signup = async(req,res,)=>
{
    try{
        const{email,password,name} = req.body;

        if(!email||!password||!name){
            return res.status(400).json({
                status : 'error',
                message:"Please provide all the required details"

            });
        }

        if (!validateEmail(email)){
            return res.status(400).json({
                status:'error',
                message:'please provide a valid email'
            });
        }
        
        // checking whether a user is alerady exist
        const checkExistingUser = await User.findOne({email});
        if(checkExistingUser){
            return res.status(400).json({
                status:'error',
                message:'Email already in use'
            });
        }

        //create a new user
        const user = await User.create({
            email,
            password,
            name
        });
    }

    catch(error){


    }
    ;
    
}


