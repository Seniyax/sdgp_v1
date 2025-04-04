const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const {
  getOneUser,
  getOneUserById,
  createUser,
  updateUser,
  deleteUser,
  requestPasswordReset,
  resetPassword,
} = require("../controllers/userController");

router.put("/update", upload.single("profile_pic_url"), updateUser);
router.post("/sign-in", getOneUser);
router.get("/get-by-id", getOneUserById);
router.post("/sign-up", createUser);
router.delete("/delete", deleteUser);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

module.exports = router;
