const supabase = require("../config/supabaseClient");

async function getCustomerIdByUsername(customerUsername) {
  const { data, error } = await supabase
    .from("customer")
    .select("id")
    .eq("username", customerUsername)
    .single();

  if (error) throw error;
  return data.id;
}

async function getReservationsByBusiness(businessId) {
  const { data, error } = await supabase
    .from("reservation")
    .select("*")
    .eq("business_id", businessId)
    .order("id", { ascending: true });

  if (error) throw error;
  return data;
}

async function createReservationModel(data) {
  const { data: tableRecord, error: tableError } = await supabase
    .from("table")
    .select("*")
    .eq("business_id", data.businessId)
    .eq("table_number", data.tableNumber)
    .single();

  if (tableError || !tableRecord) {
    throw new Error("Table not found for the provided table number.");
  }

  const insertData = {
    business_id: data.businessId,
    table_id: tableRecord.id,
    customer_id: await getCustomerIdByUsername(data.customerUsername),
    people_count: data.groupSize,
    start_time: data.startTime,
    end_time: data.endTime,
  };

  const { data: insertedData, error } = await supabase
    .from("reservation")
    .insert([insertData])
    .select();

  if (error) throw error;
  return insertedData[0];
}

async function updateReservationModel(reservationId, data) {
  const { data: updatedData, error } = await supabase
    .from("reservation")
    .update(data)
    .eq("id", reservationId)
    .select();

  if (error) throw error;
  return updatedData[0];
}

async function deleteReservationModel(reservationId) {
  const { error } = await supabase
    .from("reservation")
    .delete()
    .eq("id", reservationId);
  if (error) throw error;
  return true;
}

module.exports = {
  getReservationsByBusiness,
  createReservationModel,
  updateReservationModel,
  deleteReservationModel,
};
