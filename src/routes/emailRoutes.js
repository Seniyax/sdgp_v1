const express = require("express");
const router = express.Router();
const {
  getAllEmailTypes,
  verifyEmail,
} = require("../controllers/emailController");

router.get("/get-types", getAllEmailTypes);
router.get("/verify", verifyEmail);

module.exports = router;
