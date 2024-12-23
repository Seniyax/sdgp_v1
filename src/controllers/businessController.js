const { request } = require("express");

export const signInBusiness = async (req,res) => {
    const {email , password} = req.body;

    if(!email || !password){
        throw new error ("Email and password are  mandatory");
    }
    
    return {message:"sigin in is succesful"}
    
}


export const updateBusiness = async(req,res) => {
    const{name,role} = req.body;

    const{data,error} = await supabase

    .from('business')
    .update({name,role})
    .eq();

    if(error){
       return res.status(404).json({message:"failed to update the requet"});
    }

   return res.status(200).json({message:"updated",data});
};

export const removeBusiness = async (req,res) => {
    const {BusinessID} = req.params;

    const {data,error} = await supabase

    .from('business')
    .delete()
    .eq('id',id);

    if(error){
      return  res.status(404).json({message:"failed to delete the customer"})
    }

    return res.status(200).json({message:"Deleted the business",data})
};

export const findBusinessById = async (req,res) => {

    const {BusinessID} = req.params;

    const {data,error} = await supabase

    .from('business')
    .select('*')
    .eq('id',BusinessID);

    if(error){
        return res.status(400).json({message:"Id not found"});
    }

    return res.status(200).json(data[0]);
    
    
};

 export const findBusinessByAll = async (req,res) => {

    const{data,error} = await supabase.from('business').select('*');

    if(error){
        return res.status(400).json({message:"couldn't find"});
    }

    return res.status(200).json(data);
    
};