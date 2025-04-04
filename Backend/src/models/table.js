const supabase = require("../config/supabaseClient");

async function getTablesByBusiness(business_id) {
  const { data, error } = await supabase
    .from("table")
    .select("*")
    .eq("business_id", business_id)
    .eq("active", true);
  if (error) throw error;
  return data;
}

async function createTables(tableRows) {
  const { error } = await supabase.from("table").insert(tableRows);
  if (error) throw error;
  return;
}

module.exports = {
  getTablesByBusiness,
  createTables,
};
