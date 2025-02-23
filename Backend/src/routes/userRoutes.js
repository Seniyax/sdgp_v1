const express = require("express");
const router = express.Router();
const {
    getOneUser,
    createUser,
    updateUser,
    deleteUser
} = require("../controllers/userController");

router.post("/sign-in", getOneUser);
router.post("/sign-up", createUser);
router.put("/update", updateUser);
router.delete("/delete", deleteUser);

module.exports = router;