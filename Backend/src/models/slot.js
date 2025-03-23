const supabase = require("../config/supabaseClient");

async function getOneSlot(id) {
  const { data, error } = await supabase
    .from("slot")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

async function getAllSlots() {
  const { data, error } = await supabase.from("slot").select("*");
  if (error) throw error;
  return data;
}

async function createSlot(slotData) {
  const { data, error } = await supabase
    .from("slot")
    .insert([slotData])
    .select();
  if (error) throw error;
  return data;
}

async function updateSlot(id, updateData) {
  const { data, error } = await supabase
    .from("slot")
    .update(updateData)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data;
}

async function deleteSlot(id) {
  const { data, error } = await supabase.from("slot").delete().eq("id", id);
  if (error) throw error;
  return data;
}

module.exports = {
  getOneSlot,
  getAllSlots,
  createSlot,
  updateSlot,
  deleteSlot,
};
