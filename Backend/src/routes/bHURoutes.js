const expreess = require("express");
const router = expreess.Router();
const {
  getBusinessUserRelationsByBusinessId,
  getBusinessUserRelationsByUserId,
  createBusinessUserRelation,
} = require("../controllers/bHUController");

router.get("/get-relations-of-business", getBusinessUserRelationsByBusinessId);
router.get("/get-relations-of-user", getBusinessUserRelationsByUserId);
router.post("/create", createBusinessUserRelation);

module.exports = router;
