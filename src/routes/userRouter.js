const express = require('express');
const {register, login, getProfile, updateProfile} = require('../controller/User'); 
const upload = require('../middleware/upload');
// Assuming you have an authentication middleware

const router = express.Router();

// Add multer middleware to handle file upload
router.post('/register', upload.single('profileImage'), register);

// Login user
router.post('/login', login);

// Get user profile (protected route)
router.get('/profile', getProfile);

// Update user profile (protected route)
router.put('/profile', updateProfile);

module.exports = router; 