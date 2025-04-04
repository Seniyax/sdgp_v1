const supabase = require("../config/supabaseClient");

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email) ? null : "Invalid email address format";
}

async function buildEmails(businessId) {
  const { data, error } = await supabase
    .from("email")
    .select(
      `
      id,
      email_address,
      email_type:email_type_id ( name )
    `
    )
    .eq("business_id", businessId);

  if (error) throw error;

  return data.map((email) => ({
    email_id: email.id,
    email_address: email.email_address,
    email_type: email.email_type ? email.email_type.name : "",
  }));
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

async function getEmailsByBusiness(businessId) {
  const { data, error } = await supabase
    .from("email")
    .select("*, email_type(name)")
    .eq("business_id", businessId);
  if (error) throw error;
  return data;
}

async function updateEmails(emails) {
  for (const email of emails) {
    const { error } = await supabase
      .from("email")
      .update({ email_address: email.email_address })
      .eq("id", email.id);
    if (error) throw error;
  }
}

async function getEmails() {
  const { data, error } = await supabase
    .from("email")
    .select("*, email_type(name)");
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
  updateEmails,
  getEmails,
};
