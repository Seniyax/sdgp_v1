const supabase = require("../config/supabaseClient");

async function getTablesByBusiness(business_id) {
  const { data, error } = await supabase
    .from("table")
    .select("*")
    .eq("business_id", business_id);
  if (error) throw error;
  return data;
}

module.exports = {
  getTablesByBusiness,
};
