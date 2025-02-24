const supabase = require("../config/supabaseClient");

async function insertBusinessUpdateLog(businessId, userId, description) {
  const { error } = await supabase
    .from("business_update_log")
    .insert([{ business_id: businessId, user_id: userId, description }]);
  if (error) throw error;
}

module.exports = { insertBusinessUpdateLog };
