const supabase = require("../config/supabase");
const emailService = require("./emailService");
const contactService = require("./contactService");

exports.signUpCustomer = async (
    email,
    contact,
    password,
    fname = null,
    lname = null
) => {
    if (!email || !contact || !password) {
        throw new Error("Email, contact, and password are mandatory");
    }

    let emailData, contactData;

    const existingEmail = await emailService.findByEmailAddress(email);

    if (existingEmail) {
        let existingCustomer = await this.findByCustomerEmail(existingEmail.id);

        if (existingCustomer) {
            return {
                statusCode: 409,
                message: "Customer with this email already exists",
            };
        }
    }

    emailData = await emailService.create(email);

    const checkContact = await contactService.findbyNumber(contact);
    if (!checkContact) {
        contactData = await contactService.create(contact);
    } else {
        contactData = checkContact;
    }

    return await this.create(emailData.id, contactData.id, password, fname, lname);
};

exports.signInCustomer = async (email, password) => {
    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    const emailData = await emailService.findByEmailAddress(email);
    if (!emailData) {
        return {
            statusCode: 404,
            message: "No account found with this email",
        };
    }

    const customer = await this.findByCustomerEmail(emailData.id);
    if (!customer) {
        return {
            statusCode: 404,
            message: "No customer account found",
        };
    }

    if (customer.password !== password) {
        return {
            statusCode: 401,
            message: "Invalid credentials",
        };
    }

    return customer;
};

exports.findByCustomerEmail = async (emailId) => {
    const { data: customerData, error: customerError } = await supabase
        .from("Customer")
        .select("*")
        .eq("email_id", emailId)
        .single();

    if (customerError) {
        throw new Error(`Customer Check Error: ${customerError.message}`);
    }

    return customerData;
};

exports.create = async (emailId, contactId, password, fname, lname) => {
    const { data: customerData, error: customerError } = await supabase
        .from("Customer")
        .insert([
            {
                email_id: emailId,
                contact_id: contactId,
                password,
                fname,
                lname,
            },
        ])
        .select("*")
        .single();

    if (customerError) {
        throw new Error(`Customer Error: ${customerError.message}`);
    }

    return customerData;
};

exports.updateCustomer = async (customerId, updateData) => {
    const { data: customerData, error: customerError } = await supabase
        .from("Customer")
        .update(updateData)
        .eq("id", customerId)
        .select("*")
        .single();

    if (customerError) {
        throw new Error(`Update Error: ${customerError.message}`);
    }

    return customerData;
};

exports.removeCustomer = async (customerId) => {
    const { error: customerError } = await supabase
        .from("Customer")
        .delete()
        .eq("id", customerId);

    if (customerError) {
        throw new Error(`Delete Error: ${customerError.message}`);
    }

    return { message: "Customer successfully deleted" };
};

exports.findCustomerByAll = async () => {
    const { data: customerData, error: customerError } = await supabase
        .from("Customer")
        .select("*");

    if (customerError) {
        throw new Error(`Find All Error: ${customerError.message}`);
    }

    return customerData;
};