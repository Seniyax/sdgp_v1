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
    contactData = await contactService.create(number);
  } else {
    contactData = checkContact;
  }

  return await this.create(emailData.id, contactData.id, password, fname, lname);
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
}
