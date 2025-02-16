const express = require("express");
const router = express.Router();
const {
  getOneBusiness,
  getAllBusiness,
  createBusiness,
  updateBusiness,
  deleteBusiness,
} = require("../controllers/businessControler");

router.get("/getOneBusiness", getOneBusiness);
router.get("/getAllBusiness", getAllBusiness);
router.post("/createBusiness", createBusiness);
router.post("/updateBusiness", updateBusiness);
router.post("/deleteBusiness", deleteBusiness);

module.exports = router;
