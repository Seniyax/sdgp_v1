const supabase = require("../config/supabaseClient");

async function getCategoryId(categoryName) {
  const { data, error } = await supabase
    .from("category")
    .select("id")
    .eq("name", categoryName)
    .single();
  if (error) throw error;
  return data ? data.id : null;
}

async function getCategoryName(categoryId) {
  const { data, error } = await supabase
    .from("category")
    .select("name")
    .eq("id", categoryId)
    .single();
  if (error) throw error;
  return data ? data.name : null;
}

module.exports = { getCategoryId, getCategoryName };
