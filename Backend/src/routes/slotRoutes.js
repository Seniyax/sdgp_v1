const express = require("express");
const router = express.Router();
const {
  getOneSlot,
  getAllSlots,
  createSlot,
  updateSlot,
  deleteSlot,
} = require("../controllers/slotController");

router.get("/get-one", getOneSlot);
router.get("/get-all", getAllSlots);
router.post("/create", createSlot);
router.put("/update", updateSlot);
router.delete("/delete", deleteSlot);

module.exports = router;
