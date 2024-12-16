const customerService = require("../services/customerService");

exports.signUpCustomer = async ( req, res ) => {
    const { email, contact, password } = req.body;

    try{
        const customer = await customerService.signUpCustomer(email, contact, password);

        req.status(201).json({
            message: "Successfully created account",
            customer: customer
        });
    } catch (error){
        console.log(error);
        res.status(400).json({ message: "Failed to create account" });
    }
};
