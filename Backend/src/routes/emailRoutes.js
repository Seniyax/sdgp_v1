const express = require("express");
const router = express.Router();
const {
  getAllEmailTypes,
  verifyUserEmail,
  verifyBusinessEmail,
  verifyUserEmailBySupervisor,
  forgotPassword,
  sendSupportEmail,
} = require("../controllers/emailController");

router.get("/get-types", getAllEmailTypes);
router.get("/verify-user", verifyUserEmail);
router.get("/verify-business", verifyBusinessEmail);
router.get("/verify-user-by-supervisor", verifyUserEmailBySupervisor);
router.get("/forgot-password", forgotPassword);
router.post("/contact-dev", sendSupportEmail);

module.exports = router;
