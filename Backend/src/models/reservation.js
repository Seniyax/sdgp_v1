// reservation.js
const supabase = require("../config/supabaseClient");

async function getCustomerByUsername(customerUsername) {
  const { data, error } = await supabase
    .from("customer")
    .select("id, full_name")
    .eq("username", customerUsername)
    .single();

  if (error) throw error;
  return data;
}

async function getReservationsByBusiness(businessId) {
  const { data, error } = await supabase
    .from("reservation")
    .select(
      `
      *,
      customer:customer(username, email, full_name),
      table:table(table_number, seats, floor_plan:floor_plan(floor_name))
    `
    )
    .eq("business_id", businessId)
    .order("id", { ascending: true });

  if (error) throw error;
  return data;
}

async function createReservationModel(data) {
  const { data: tableRecord, error: tableError } = await supabase
    .from("table")
    .select("*, floor_plan(*)")
    .eq("business_id", data.businessId)
    .eq("table_number", data.tableNumber)
    .single();

  if (tableError || !tableRecord) {
    throw new Error("Table not found for the provided table number.");
  }

  const onlineCustomer = data.customerUsername
    ? await getCustomerByUsername(data.customerUsername)
    : null;

  const insertData = {
    business_id: data.businessId,
    table_id: tableRecord.id,
    customer_id: onlineCustomer ? onlineCustomer.id : null,
    people_count: data.groupSize,
    start_time: data.startTime,
    end_time: data.endTime,
    end_date: data.endDate,
    status: data.status,
    customer_name:
      data.customerName || (onlineCustomer ? onlineCustomer.full_name : null),
    customer_number: data.customerNumber || null,
  };

  const { data: insertedData, error } = await supabase
    .from("reservation")
    .insert([insertData]).select(`
      *,
      customer: customer_id (
        id, email, full_name, username
      ),
      table: table_id (
        seats, table_number, floor_plan: floor_plan_id (
          floor_name
        )
      )
    `);

  if (error) throw error;
  const reservation = insertedData[0];
  reservation.table_number = data.tableNumber;
  return reservation;
}

async function updateReservationModel(reservationId, data) {
  const { data: updatedData, error } = await supabase
    .from("reservation")
    .update(data)
    .eq("id", reservationId)
    .select(
      `
      *,
      customer: customer_id (
        id, email, full_name, username
      ),
      table: table_id (
        seats, table_number, floor_plan: floor_plan_id (
          floor_name
        )
      )
    `
    )
    .single();

  if (error) throw error;
  return updatedData;
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
