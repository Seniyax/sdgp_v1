const express = require("express");
const router = express.Router();
const {
  getAllBusinesses,
  getOneBusiness,
  createBusiness,
  updateBusiness,
  deleteBusiness,
} = require("../controllers/businessController");

router.get("/get-all", getAllBusinesses);
router.post("/get-by-id", getOneBusiness);
router.post("/register", createBusiness);
router.put("/update", updateBusiness);
router.delete("/delete", deleteBusiness);

module.exports = router;
