const supabase = require("../config/supabaseClient");

function validateContact(contact) {
  const regex = /^[0-9]{10,15}$/;
  return regex.test(contact) ? null : "Invalid contact number format";
}

async function getContacts(businessId) {
  const { data, error } = await supabase
    .from("contact")
    .select("number")
    .eq("business_id", businessId);
  if (error) throw error;
  return data.map((contact) => ({ number: contact.number }));
}

async function createContacts(businessId, contacts) {
  const contactsToInsert = contacts.map((contact) => ({
    number: contact.number,
    type: contact.type,
    business_id: businessId,
  }));
  const { data, error } = await supabase
    .from("contact")
    .insert(contactsToInsert)
    .select();
  if (error) throw error;
  return data;
}

async function updateContact(contactId, newNumber) {
  const errorMessage = validateContact(newNumber);
  if (errorMessage) throw new Error(errorMessage);

  const { error } = await supabase
    .from("contact")
    .update({ number: newNumber })
    .eq("id", contactId);
  if (error) throw error;
}

async function insertContact(businessId, number) {
  const errorMessage = validateContact(number);
  if (errorMessage) throw new Error(errorMessage);

  const { data, error } = await supabase
    .from("contact")
    .insert({ number, business_id: businessId })
    .select();
  if (error) throw error;
  return data[0].id;
}

async function deleteContacts(businessId) {
  const { data, error } = await supabase
    .from("contact")
    .delete()
    .eq("business_id", businessId)
    .select();
  if (error) throw error;
  return data;
}

module.exports = {
  validateContact,
  getContacts,
  createContacts,
  updateContact,
  insertContact,
  deleteContacts,
};
