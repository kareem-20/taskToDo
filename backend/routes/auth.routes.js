const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');


// register route
router.post('/register', authController.register);

// login route
router.post('/login', authController.login);

// generate a new tokens with refresh token
router.post('/refresh', authController.refreshToken);



module.exports = router;