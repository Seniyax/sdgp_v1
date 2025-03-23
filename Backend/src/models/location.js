const supabase = require("../config/supabaseClient");

async function getLocationDetails(locationId) {
  const { data, error } = await supabase
    .from("location")
    .select("line1, line2, line3, country")
    .eq("id", locationId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function createLocation(location) {
  const { data, error } = await supabase
    .from("location")
    .insert([
      {
        line1: location.line1,
        line2: location.line2,
        line3: location.line3,
        country: location.country,
      },
    ])
    .select();
  if (error) throw error;
  return data[0];
}

async function updateLocationRecord(locationId, updateData) {
  const { error } = await supabase
    .from("location")
    .update(updateData)
    .eq("id", locationId);
  if (error) throw error;
}

async function deleteLocation(locationId) {
  const { data, error } = await supabase
    .from("location")
    .delete()
    .eq("id", locationId);
  if (error) throw error;
  return data;
}

module.exports = {
  getLocationDetails,
  createLocation,
  updateLocationRecord,
  deleteLocation,
};
