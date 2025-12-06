const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');

/*
 * @route   POST /api/auth/register
 * @desc    Register a new user (with email, username, and password hashing)
 * @access  Public
 */
router.post('/register', register);

/*
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get JWT token (Login via email only)
 * @access  Public
 */
router.post('/login', login);

module.exports = router;