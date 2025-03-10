const supabase = require("../config/supabaseClient");

async function getFloorsByBusiness(business_id) {
  const { data, error } = await supabase
    .from("floor_plan")
    .select("*")
    .eq("business_id", business_id);
  if (error) throw error;
  return data;
}

async function createFloorPlanWithTables(business_id, floors, tables) {
  const insertedFloors = [];
  try {
    for (const floor of floors) {
      const { data, error } = await supabase
        .from("floor_plan")
        .insert({
          business_id,
          floor_name: floor.floor_name,
          floor_plan: floor.floor_plan,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select();
      if (error) throw error;
      insertedFloors.push(data[0]);
    }

    for (const table of tables) {
      const matchingFloor = insertedFloors.find(
        (floor) => floor.floor_name === table.floor_name
      );
      if (!matchingFloor) {
        throw new Error(`No floor found with name ${table.floor_name}`);
      }
      const { error: tableError } = await supabase.from("table").insert({
        business_id,
        floor_plan_id: matchingFloor.id,
        table_number: table.table_number,
        seats: table.seats,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      if (tableError) throw tableError;
    }
  } catch (error) {
    for (const floor of insertedFloors) {
      await supabase.from("floor_plan").delete().eq("id", floor.id);
    }
    throw error;
  }
}

async function deleteFloorPlan(floor_plan_id) {
  const { error } = await supabase
    .from("floor_plan")
    .delete()
    .eq("id", floor_plan_id);
  if (error) throw error;
  return;
}

module.exports = {
  getFloorsByBusiness,
  createFloorPlanWithTables,
  deleteFloorPlan,
};
