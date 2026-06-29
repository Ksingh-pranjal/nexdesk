const express = require('express');
const router = express.Router();

//controller functions
const { register, login, getMe } = require('../controllers/authController');

//middleware
const { protect } = require('../middleware/auth');

//POST /api/auth/register -> calls register function
router.post('/register', register);

//POST /api/auth/login -> calls login function
router.post('/login', login);

//GET /api/auth/me -> protect runs first, then getMe
router.get('/me', protect, getMe);

module.exports = router;