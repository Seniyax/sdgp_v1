const supabase = require("../config/supabaseClient");

async function getFloorsByBusiness(business_id) {
  const { data, error } = await supabase
    .from("floor_plan")
    .select("*")
    .eq("business_id", business_id)
    .order("id", { ascending: true });

  if (error) throw error;
  return data;
}

async function createFloorPlanWithTables(
  business_id,
  canvas_width,
  canvas_height,
  floors,
  tables
) {
  const floorRows = floors.map((floor) => ({
    business_id,
    canvas_width,
    canvas_height,
    floor_name: floor.floor_name,
    floor_plan: floor.floor_plan,
  }));

  const { data: insertedFloors, error: floorError } = await supabase
    .from("floor_plan")
    .insert(floorRows)
    .select();

  if (floorError) throw floorError;

  const floorMap = insertedFloors.reduce((map, floor) => {
    map[floor.floor_name] = floor.id;
    return map;
  }, {});

  const tableRows = tables.map((table) => {
    const floor_plan_id = floorMap[table.floor];
    if (!floor_plan_id) {
      throw new Error(`No floor found with name ${table.floor}`);
    }
    return {
      business_id,
      floor_plan_id,
      table_number: table.table_number,
      seats: table.seats,
    };
  });

  const { error: tableError } = await supabase.from("table").insert(tableRows);

  if (tableError) {
    const floorIds = insertedFloors.map((floor) => floor.id);
    await supabase.from("floor_plan").delete().in("id", floorIds);
    throw tableError;
  }

  return insertedFloors;
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
