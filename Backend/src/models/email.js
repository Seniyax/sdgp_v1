const supabase = require("../config/supabaseClient");

// (Keep your validateEmail, buildEmails, createPrimaryEmail, updatePrimaryEmail,
// deleteNonPrimaryEmails, and insertNonPrimaryEmails functions as before.)

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email) ? null : "Invalid email address format";
}

async function buildEmails(businessId) {
  const { data: emailsData, error: emailsError } = await supabase
    .from("email")
    .select("*")
    .eq("business_id", businessId);
  if (emailsError) throw emailsError;
  // (Mapping logic as before)
  const emails = await Promise.all(
    emailsData.map(async (email) => {
      const { data: emailTypeData, error: emailTypeError } = await supabase
        .from("email_type")
        .select("name")
        .eq("id", email.email_type_id)
        .maybeSingle();
      if (emailTypeError) throw emailTypeError;
      return {
        email_Id: email.id,
        email_address: email.email_address,
        email_type: emailTypeData ? emailTypeData.name : "",
      };
    })
  );
  return emails;
}

async function createPrimaryEmail(businessId, email_address) {
  const errorMessage = validateEmail(email_address);
  if (errorMessage) throw new Error(errorMessage);
  const { data, error } = await supabase
    .from("email")
    .insert([{ email_address, business_id: businessId }])
    .select();
  if (error) throw error;
  return data[0];
}

async function updatePrimaryEmail(emailId, newEmailAddress) {
  const errorMessage = validateEmail(newEmailAddress);
  if (errorMessage) throw new Error(errorMessage);
  const { error } = await supabase
    .from("email")
    .update({ email_address: newEmailAddress })
    .eq("id", emailId);
  if (error) throw error;
}

async function deleteEmail(businessId, emailId) {
  const { data, error } = await supabase
    .from("email")
    .delete()
    .eq("business_id", businessId)
    .eq("email_id", emailId)
    .neq("email_type_id", 1)
    .select();
  if (error) throw error;
  return data;
}

async function insertNonPrimaryEmails(businessId, emails) {
  let insertedIds = [];
  for (const email of emails) {
    const errorMessage = validateEmail(email.email_address);
    if (errorMessage) throw new Error(errorMessage);
    const { data, error } = await supabase
      .from("email")
      .insert({
        business_id: businessId,
        email_address: email.email_address,
        email_type_id: email.email_type,
      })
      .select();
    if (error) throw error;
    insertedIds.push(data[0].id);
  }
  return insertedIds;
}

// New helper: Get all emails for a business
async function getEmailsByBusiness(businessId) {
  const { data, error } = await supabase
    .from("email")
    .select("*")
    .eq("business_id", businessId);
  if (error) throw error;
  return data;
}

module.exports = {
  validateEmail,
  buildEmails,
  createPrimaryEmail,
  updatePrimaryEmail,
  deleteEmail,
  insertNonPrimaryEmails,
  getEmailsByBusiness,
};
