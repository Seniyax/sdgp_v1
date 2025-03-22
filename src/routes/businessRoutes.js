const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const {
  getAllBusinesses,
  getOneBusiness,
  createBusiness,
  updateBusiness,
  deleteBusiness,
} = require("../controllers/businessController");

router.post(
  "/register",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  createBusiness
);

router.get("/get-all", getAllBusinesses);
router.post("/get-by-id", getOneBusiness);
router.put("/update", updateBusiness);
router.delete("/delete", deleteBusiness);

module.exports = router;
