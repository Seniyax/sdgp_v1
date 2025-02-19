const express = require("express");
const router = express.Router();
const {
  getOneBusiness,
  createBusiness,
  updateBusiness,
  deleteBusiness,
  getAllEmailTypes,
} = require("../controllers/businessController");

router.post("/signIn", getOneBusiness);
router.post("/signUp", createBusiness);
router.put("/update", updateBusiness);
router.delete("/delete", deleteBusiness);
router.get("/getEmailTypes", getAllEmailTypes);

module.exports = router;
