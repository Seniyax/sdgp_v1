const express = require("express");
const router = express.Router();
const {
  getOneSlot,
  getAllSlots,
  createSlot,
  updateSlot,
  deleteSlot,
} = require("../controllers/slotController");

router.get("/getOneSlot", getOneSlot);
router.get("/getAllSlots", getAllSlots);
router.post("/createSlot", createSlot);
router.put("/updateSlot", updateSlot);
router.delete("/deleteSlot", deleteSlot);

module.exports = router;
