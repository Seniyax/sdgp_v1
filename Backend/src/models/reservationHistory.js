const supabase = require("../config/supabaseClient");

async function getReservationHistoryByUser(userId) {
  const { data, error } = await supabase
    .from("reservation")
    .select("*")
    .eq("customer_id", userId)
    .order("start_time", { ascending: false });
  
  if (error) throw error;
  return data;
}

module.exports = {
  getReservationHistoryByUser,
};