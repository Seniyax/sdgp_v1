const express = require('express');

const authController = require('../controllers/authControllers');

const router = express.Router();

router.post('/signup',authController.signup)
router.post('/signin',authController.signin)

router.post('/social/:provider',authController.socialLogin)

router.post('/logout',authController.logout)

module.exports = router;
