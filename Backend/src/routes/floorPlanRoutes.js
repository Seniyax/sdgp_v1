const express = require("express");
const router = express.Router();
const {
  getFloorPlan,
  createFloorPlan,
  updateFloorPlan,
  deleteFloorPlan,
} = require("../controllers/floorPlanController");

router.get("/get", getFloorPlan);
router.post("/create", createFloorPlan);
router.put("/update", updateFloorPlan);
router.delete("/delete", deleteFloorPlan);

module.exports = router;
