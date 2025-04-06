const supabase = require("../config/supabaseClient");

async function getReservationHistoryByUser(userId) {
  const { data, error } = await supabase
    .from("reservation")
    .select(
      "*, business:business_id(name, cover), customer_payment(amount, currency), table:table_id(table_number, floor_plan:floor_plan_id(floor_name))"
    )
    .eq("customer_id", userId)
    .order("start_time", { ascending: false });

  if (error) throw error;

  data.forEach((reservation) => {
    if (
      reservation.customer_payment &&
      Array.isArray(reservation.customer_payment)
    ) {
      const seen = new Set();
      reservation.customer_payment = reservation.customer_payment.filter(
        (payment) => {
          const key = `${payment.amount}-${payment.currency}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        }
      );
    }
  });

  return data;
}

module.exports = {
  getReservationHistoryByUser,
};
