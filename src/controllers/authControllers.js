const User = require('');
//const {validateEmail} = require("utils\validate.js");
//const jwt = require('jsonwebtokens')

const supabase = require('.../config/supabaseClient');



exports.signup = async(req,res,)=>
{
    try{
        const{email,password,name} = req.body;
        
        // This checks wheather the user exists with the email
        const {data:existUser} = await supabase
         .from('users')
         .select('*')
         .eq('email',email)
         .single();

        if(existUser){
            return res.status(400).json({
                error: 'User with this email already esists'
            });
        }  
        // Signup user with Supabase Auth
        const{data:authData,error: authError} = await supabase.auth.signup({
            email,
            password,
            options:{
                data:{
                    name

                }
            }
        });

        if(authError){
            return res.status(400).json({
                error:authError.message
            });
        }

        // create a profile in users table
        const{error:profileError} = await supabase
          .from('users')
          .insert({
            id:authData.user,id,
            email,
            name,
            created_at:new Date()

          });

        if(profileError){
            return res.status(500).json({
              error:'Failed to create the profile'
            });
          }

        res.status(201).json({
            message:'User registration successfully',
            user: {
                id:authData.user.id,
                email:authData.user.email
            }
        });
    } catch(error){
        res.status(500).json({
            error:'signup failed',
            details:error.message

        });
    }}

          

        //if(!email||!password||!name){
            //return res.status(400).json({
               // status : 'error',
                //message:"Please provide all the required details"

           // });
       // }

        //if (!validateEmail(email)){
            //return res.status(400).json({
                //status:'error',
                //message:'please provide a valid email'
           // });
        
        
        
       

    

    
    


exports.signin = async(req,res)=>{

    try{
        const{email,password} = req.body;

        const{data,error} = await supabase.auth.signInPassword({
            email,
            password
        });

        if(error){
            return res.status(401).json({
                error:"Invalid Login credentials"
            });
        }

        const{data:profileData} = await supabase
          .from('users')  
          .select('*')
          .eq('id',data.user.id)
          .single();

        res.status(200).json({
            message:'Login successful',
            user:{
                id:data.user.id,
                email:data.user.email,
                full_name_name:profileData?.full_name
            },
            session:data.session

        });
    }catch(error){
        res.status(500).json({
            error:'Login failed',
            details:error.message
        });
    }}
    

exports.socialLogin=async(req,res)=>{
    try{
        const {provider} = req.params;
        const{access_token} = req.body;

        let authRespose;

        switch(provider){
            case 'google':
                authResponse = await supabase.auth.signInwithOAuth({
                    provider:'google',
                    options:{
                        access_token
                    }
                });
                break;
            case'facebook':
                authRespose = await supabase.auth.signInwithOAuth({
                    provider:'facebook',
                    options:{
                        access_token
                    }
                });
                break;
            case 'apple':
                authRespose = await supabase.auth.signInwithOAuth({
                    provider:'apple',
                    options:{
                        access_token
                    }
                });
                break
             default:
                return res.status(400).json({
                    eror: 'Unsupported social login'
                });       
           } 

           const{data,error} = authResponse;

           if(error){
            return res.status(401).json({
                error:'Social login failed',
                details:error.message
            });
           }
           const {error:profileError} = await supabase
             .from('users')
             .upsert({
                id:data.user.id,
                email:data.user.email,
                full_name:data.user.user_metadata?.full_name||data.user.email,
                created_at:new Date()
             },{conflict:'id'});
            
            if (profileError){
                return res.status(500).json({
                    error:'Failed to update user profile'
                });
            } 
            res.status(200).json({
                message:'social login succesful',
                user:{
                    id:data.user.id,
                    email:data.user.email,
                    full_name:data.user.user_metadata?.full_name
                },
                session:data.session
            });         
        }    
      catch(error){
        res.status(500).json({
            error:'Social login process failed',
            details:error.message
        })
    }
    
    exports.logout=async(req,res)=>{
        try{
            const {error} = await supabase.auth.signOut();

            if(error){
                console.error('Logout error:',error);
                return res.status(500).json({
                    error:'Logout faild',
                    deails:error.message
                });
            }
            res.status(200).json({
                message:'Logg out successfully'
            })
    }  
    catch(error){
        res.status(500).json({
            error:'Logout process failed',
            details:error.message
        });
    }}

        
        
        
        //if(!email||!password) {
            //return res.status(400).json({
                //status: 'error',
                //message: 'Please provide email and password'
              //});
    

        //const user = await User.findOne({ email });


        //if (!user || !(await user.isValidPassword(password))) {

           // return res.status(401).json({
               // status: 'error',
                //message: 'Invalid email or password'
              //});
            //}  

        //}
        

    
}   //catch(error){

    


