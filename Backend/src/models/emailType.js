const supabase = require("../config/supabaseClient");

async function getAllEmailTypes() {
  const { data, error } = await supabase.from("email_type").select("name");
  if (error) throw error;
  return data;
}

module.exports = {
  getAllEmailTypes,
};
