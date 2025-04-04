const express = require("express");
const router = express.Router();
const {
  getFloorPlan,
  getAllFloorPlans,
  createFloorPlan,
} = require("../controllers/floorPlanController");

router.post("/get", getFloorPlan);
router.get("/get-all", getAllFloorPlans);
router.post("/create", createFloorPlan);

module.exports = router;
