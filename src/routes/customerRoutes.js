const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

router.post('/signUp', customerController.signUpCustomer);
router.post('/signIn', customerController.signInCustomer);
router.put('/update', customerController.updateCustomer);
router.delete('/delete', customerController.removeCustomer);
router.get('/get', customerController.findCustomerById);
router.get('/get-all', customerController.findCustomerByAll);

module.exports =  router;