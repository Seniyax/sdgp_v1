const express = require("express");
const router = express.Router();
const businessController = require("../controllers/businessController");

router.post('/signUp', businessController.signUpBusiness);
router.post('/signIn', businessController.signInBusiness);
router.put('/update', businessController.updateBusiness);
router.delete('/delete', businessController.removeBusiness);
router.get('/get', businessController.findBusinessById);
router.get('/get-all', businessController.findBusinessByAll);

module.exports =  router;