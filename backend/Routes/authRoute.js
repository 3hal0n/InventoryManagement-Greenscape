const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
const { verifyToken, checkRole } = require('../middleware/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/profile', verifyToken, authController.getProfile);

// Admin only routes
router.put('/update-role', 
    verifyToken, 
    checkRole(['admin']), 
    authController.updateUserRole
);

module.exports = router; 