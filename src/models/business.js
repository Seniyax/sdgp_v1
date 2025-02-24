const supabase = require("../config/supabaseClient");

async function createBusinessRecord(
  name,
  categoryId,
  locationId,
  verificationToken
) {
  const { data, error } = await supabase
    .from("business")
    .insert([
      {
        name,
        category_id: categoryId,
        location_id: locationId,
        is_verified: false,
        verification_token: verificationToken,
      },
    ])
    .select();
  if (error) throw error;
  return data[0];
}

async function updateBusinessRecord(businessId, updateData) {
  const { data, error } = await supabase
    .from("business")
    .update(updateData)
    .eq("id", businessId)
    .select();
  if (error) throw error;
  return data;
}

async function getAllBusinesses() {
  // Returns all fields (detailed view) if needed elsewhere
  const { data, error } = await supabase.from("business").select("*");
  if (error) throw error;
  return data;
}

async function getBusinessesMinimal() {
  // Returns only id and name for select options
  const { data, error } = await supabase.from("business").select("id, name");
  if (error) throw error;
  return data;
}

async function getOneBusiness(businessId) {
  const { data, error } = await supabase
    .from("business")
    .select("*")
    .eq("id", businessId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function deleteBusiness(businessId) {
  const { data, error } = await supabase
    .from("business")
    .delete()
    .eq("id", businessId)
    .select();
  if (error) throw error;
  return data;
}

module.exports = {
  createBusinessRecord,
  updateBusinessRecord,
  getAllBusinesses,
  getBusinessesMinimal,
  getOneBusiness,
  deleteBusiness,
};
