const {
  getFloorsByBusiness,
  createFloorPlanWithTables,
  deleteFloorPlan: deleteFloorPlanModel,
} = require("../models/floorPlan");
const { getTablesByBusiness } = require("../models/table");

exports.getFloorPlan = async (req, res) => {
  const { business_id } = req.body;
  if (!business_id) {
    return res.status(400).json({
      success: false,
      message: "business_id is required",
    });
  }
  try {
    const floors = await getFloorsByBusiness(business_id);
    if (floors.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Floor plan not found",
      });
    }
    const tables = await getTablesByBusiness(business_id);
    return res.status(200).json({
      success: true,
      floors,
      tables,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving floor plan",
      error: error.message,
    });
  }
};

exports.createFloorPlan = async (req, res) => {
  const { business_id, canvas_width, canvas_height, floors, tables } = req.body;
  if (!business_id || !canvas_width || !canvas_height || !floors || !tables) {
    return res.status(400).json({
      success: false,
      message:
        "business_id, canvas_width, canvas_height, floors and tables arrays are required",
    });
  }
  try {
    await createFloorPlanWithTables(
      business_id,
      canvas_width,
      canvas_height,
      floors,
      tables
    );
    return res.status(201).json({
      success: true,
      message: "Floor plan created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating floor plan",
      error: error.message,
    });
  }
};

exports.updateFloorPlan = async (req, res) => {
  return res.status(501).json({
    success: false,
    message: "Update floor plan not implemented yet",
  });
};

exports.deleteFloorPlan = async (req, res) => {
  const { floor_plan_id } = req.params;
  if (!floor_plan_id) {
    return res.status(400).json({
      success: false,
      message: "floor_plan_id is required",
    });
  }
  try {
    await deleteFloorPlanModel(floor_plan_id);
    return res.status(200).json({
      success: true,
      message: "Floor plan deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting floor plan",
      error: error.message,
    });
  }
};
