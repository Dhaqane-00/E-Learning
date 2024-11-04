const express = require('express');
const UserController = require('../controller/User'); 
const upload = require('../middleware/upload');
// Assuming you have an authentication middleware

const router = express.Router();

// Add multer middleware to handle file upload
router.post('/register', upload.single('profileImage'), UserController.register);

// Login user
router.post('/login', UserController.login);

// Get user profile (protected route)
router.get('/profile', UserController.getProfile);

// Update user profile (protected route)
router.put('/profile', UserController.updateProfile);

module.exports = router; 