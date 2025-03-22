const express = require('express');
const authcontroller = require('../controllers/authControllers');

const router = express.Router();

// registration and login routes
router.post('/signup', authcontroller.signup);
router.post('/signin', authcontroller.signin);
router.post('/social/:provider', authcontroller.socialLogin);
router.post('/logout', authcontroller.logout);
router.post('/reset-password',authcontroller.resetpassword);
router.post('/update-password',authcontroller.updatePassword);

// Session managment routes
router.get('/sessions',authcontroller.getSession);
router.post('/refresh', authcontroller.refreshSession);

// Protected routes
router.get('/profile')

module.exports = router;  // ✅ Use CommonJS export
