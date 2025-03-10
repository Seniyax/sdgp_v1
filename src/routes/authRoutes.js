const express = require('express');

const authcontroller = require('../controllers/authControllers');

const router = express.Router();

router.post('/signup',authcontroller.signup)
router.post('/signin',authcontroller.signin)

router.post('/social/:provider',authcontroller.socialLogin)

router.post('/logout',authcontroller.logout)

export default router;
