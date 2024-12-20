const customerService = require("../services/customerService");

exports.signUpCustomer = async (req, res) => {
    const { email, contact, password, fname, lname } = req.body;

    try {
        const customer = await customerService.signUpCustomer(email, contact, password, fname, lname);

        if (customer.statusCode) {
            return res.status(customer.statusCode).json({ message: customer.message });
        }

        res.status(201).json({
            message: "Successfully created account",
            customer: customer
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Failed to create account" });
    }
};

exports.signInCustomer = async (req, res) => {
    const { email, password } = req.body;

    try {
        const customer = await customerService.signInCustomer(email, password);

        if (customer.statusCode) {
            return res.status(customer.statusCode).json({ message: customer.message });
        }

        res.status(200).json({
            message: "Successfully signed in",
            customer: customer
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Failed to sign in" });
    }
};

exports.updateCustomer = async (req, res) => {
    const { customerId, ...updateData } = req.body;

    try {
        const customer = await customerService.updateCustomer(customerId, updateData);
        res.status(200).json({
            message: "Successfully updated customer",
            customer: customer
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Failed to update customer" });
    }
};

exports.removeCustomer = async (req, res) => {
    const { customerId } = req.params;

    try {
        const result = await customerService.removeCustomer(customerId);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Failed to delete customer" });
    }
};

exports.findCustomerByAll = async (req, res) => {
    try {
        const customers = await customerService.findCustomerByAll();
        res.status(200).json(customers);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Failed to fetch customers" });
    }
};