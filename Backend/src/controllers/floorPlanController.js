const {
  getFloorsByBusiness,
  getAllFloorPlans,
  createFloorPlanWithTables,
  updateFloorPlanWithTables,
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

exports.getAllFloorPlans = async (req, res) => {
  try {
    const floorplans = await getAllFloorPlans();
    if (floorplans.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No floor plans were found",
      });
    }
    return res.status(200).json({
      success: true,
      floorplans,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving floor plans",
      error: error.message,
    });
  }
};

exports.createFloorPlan = async (req, res) => {
  const {
    business_id,
    canvas_width,
    canvas_height,
    floors,
    tables,
    width,
    height,
  } = req.body;
  if (
    !business_id ||
    !canvas_width ||
    !canvas_height ||
    !floors ||
    !tables ||
    !width ||
    !height
  ) {
    return res.status(400).json({
      success: false,
      message:
        "business_id, canvas_width, canvas_height, width, height, floors and tables arrays are required",
    });
  }
  try {
    // Check if floor plans exist for this business.
    const existingFloorplans = await getFloorsByBusiness(business_id);

    if (existingFloorplans.length > 0) {
      // Do a differential update: update changed records, insert new ones,
      // and soft-delete (or archive) records that are no longer present.
      await updateFloorPlanWithTables(
        business_id,
        canvas_width,
        canvas_height,
        floors,
        tables,
        width,
        height
      );
    } else {
      // No existing floor plans – create new ones.
      await createFloorPlanWithTables(
        business_id,
        canvas_width,
        canvas_height,
        floors,
        tables,
        width,
        height
      );
    }

    return res.status(201).json({
      success: true,
      message: "Floor plan updated successfully",
    });
  } catch (error) {
    console.log("Error creating/updating floor plan:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error creating/updating floor plan",
      error: error.message,
    });
  }
};
