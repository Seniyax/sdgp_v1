const expreess = require("express");
const router = expreess.Router();
const {
  createBusinessRelation,
  getBusinessRelations,
} = require("../controllers/bHUController");

router.post("/create-business", createBusinessRelation);
router.post("/get-businesses", getBusinessRelations);

module.exports = router;
