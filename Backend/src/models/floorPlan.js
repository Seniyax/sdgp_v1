const supabase = require("../config/supabaseClient");
const { createTables } = require("../models/table.js");

async function getFloorsByBusiness(business_id) {
  const { data, error } = await supabase
    .from("floor_plan")
    .select("*")
    .eq("business_id", business_id)
    .order("id", { ascending: true });
  if (error) throw error;
  return data;
}

async function getAllFloorPlans() {
  const { data, error } = await supabase
    .from("floor_plan")
    .select("id, business_id");
  if (error) throw error;
  return data;
}

async function createFloorPlanWithTables(
  business_id,
  canvas_width,
  canvas_height,
  floors,
  tables,
  width,
  height
) {
  const floorRows = floors.map((floor) => ({
    business_id,
    canvas_width,
    canvas_height,
    floor_name: floor.floor_name,
    floor_plan: floor.floor_plan,
    width,
    height,
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
      active: true,
    };
  });
  try {
    await createTables(tableRows);
  } catch (tableError) {
    const floorIds = insertedFloors.map((floor) => floor.id);
    await supabase.from("floor_plan").delete().in("id", floorIds);
    throw tableError;
  }
  return insertedFloors;
}

async function updateFloorPlanWithTables(
  business_id,
  canvas_width,
  canvas_height,
  newFloors,
  newTables,
  width,
  height
) {
  const existingFloors = await getFloorsByBusiness(business_id);
  const existingFloorMap = {};
  existingFloors.forEach((floor) => {
    existingFloorMap[floor.floor_name] = floor;
  });
  for (const newFloor of newFloors) {
    if (existingFloorMap[newFloor.floor_name]) {
      const { error } = await supabase
        .from("floor_plan")
        .update({
          canvas_width,
          canvas_height,
          floor_plan: newFloor.floor_plan,
          width,
          height,
        })
        .eq("id", existingFloorMap[newFloor.floor_name].id);
      if (error) throw error;
      delete existingFloorMap[newFloor.floor_name];
    } else {
      const { data, error } = await supabase
        .from("floor_plan")
        .insert({
          business_id,
          canvas_width,
          canvas_height,
          floor_name: newFloor.floor_name,
          floor_plan: newFloor.floor_plan,
          width,
          height,
        })
        .select();
      if (error) throw error;
    }
  }
  for (const floorName in existingFloorMap) {
    const floorId = existingFloorMap[floorName].id;
    const { error } = await supabase
      .from("floor_plan")
      .delete()
      .eq("id", floorId);
    if (error) throw error;
  }
  const { data: currentFloors, error: floorQueryError } = await supabase
    .from("floor_plan")
    .select("id, floor_name")
    .eq("business_id", business_id);
  if (floorQueryError) throw floorQueryError;
  const floorNameToId = {};
  currentFloors.forEach((floor) => {
    floorNameToId[floor.floor_name] = floor.id;
  });
  const { data: existingTables, error: tableQueryError } = await supabase
    .from("table")
    .select("*")
    .eq("business_id", business_id);
  if (tableQueryError) throw tableQueryError;
  const existingTablesMap = {};
  existingTables.forEach((table) => {
    existingTablesMap[table.table_number] = table;
  });
  for (const newTable of newTables) {
    const newFloorId = floorNameToId[newTable.floor];
    if (!newFloorId) {
      throw new Error(
        `Floor ${newTable.floor} not found for table ${newTable.table_number}`
      );
    }
    if (existingTablesMap[newTable.table_number]) {
      const { error } = await supabase
        .from("table")
        .update({
          floor_plan_id: newFloorId,
          seats: newTable.seats,
          active: true,
        })
        .eq("id", existingTablesMap[newTable.table_number].id);
      if (error) throw error;
      delete existingTablesMap[newTable.table_number];
    } else {
      const { error } = await supabase.from("table").insert({
        business_id,
        floor_plan_id: newFloorId,
        table_number: newTable.table_number,
        seats: newTable.seats,
        active: true,
      });
      if (error) throw error;
    }
  }
  for (const tableNumber in existingTablesMap) {
    const tableId = existingTablesMap[tableNumber].id;
    const { error } = await supabase
      .from("table")
      .update({ active: false })
      .eq("id", tableId);
    if (error) throw error;
  }
  return true;
}

module.exports = {
  getFloorsByBusiness,
  getAllFloorPlans,
  createFloorPlanWithTables,
  updateFloorPlanWithTables,
};
